import { Node, Prefab } from "cc";
import { _decorator, Component, instantiate } from 'cc';
import { SimpleLoading } from "../ui/panel/SimpleLoading";
import { SceneLoading } from "../ui/panel/SceneLoading";
import { StatusBarContext } from "../ui/panel/StatusBarContext";
import { PanelStackController } from "../ui/panel/PanelStackController";
import { PanelContext } from "../ui/panel/PanelContext";
import { Action1, Func1 } from "../logic/Define";
import { AssetLoader } from "../logic/AssetLoader";
import { Util } from "../core/Util";
import { Coroutine, CoroutineManager } from "./CoroutineManager";




/**
 * 규칙 1 : 패널 프리펩의 이름은 Class와 동일하게 가져가되 "Context"는 빼준다  class명 : LobbyPanelContext -> 프리펩명 : LobbyPanel
 * 규칙 2 : 각 Context는 PanelContext를 상속 받아야 한다 
 * 규칙 3 : 패널은 팝업형 패널일경우 StatusBar보다 위로 올라와야 하며 showStatusBar를 false로 설정한다
 * 규칙 3 : 패널 오픈시 Open 함수를 사용하여 오픈한다
 * 규칙 4 : 패널 클로즈시 Close 함수를 사용하여 클로즈한다
 * 규칙 5 : Context는 별도 라이프 사이클을 가지고 있으며 onAppearStart, onAppearFinish, onDisappearStart, onDisappearFinish 함수를 오버라이드하여 사용한다
 * 규칙 6 : Loading패널은 중복 오픈을 방지 해야 하며 오픈 되면 클로즈를 해주어야 한다
 */

export enum E_LOADING_TYPE {
    SCENE,
    SIMPLE
}

const { ccclass, property, executionOrder, executeInEditMode } = _decorator;
@ccclass('PanelManager')
export class PanelManager extends Component {
    public static Inst: PanelManager = null;

    @property(Node) panelRoot: Node = null;
    @property(SimpleLoading) simpleLoading: SimpleLoading = null;
    @property(SceneLoading) sceneLoading: SceneLoading = null;
    @property(StatusBarContext) statusBar: StatusBarContext = null;


    private panelStackController = new PanelStackController();

    onLoad() {
        PanelManager.Inst = this;
    }

    /**
     * 패널을 띄운다
     * @param panelContext 
     * @param beforeAppear 
     */
    public async Open<T extends PanelContext>(panelContext: { new(): T }, beforeAppear?: Action1<T>): Promise<T>;
    public async Open<T extends PanelContext>(prefab: Prefab, beforeAppear?: Action1<T>): Promise<T>;
    public async Open<T extends PanelContext>(panelName: string, beforeAppear?: Action1<T>): Promise<T>;
    public async Open<T extends PanelContext>(param: string | Prefab | { new(): T }, beforeAppear?: Action1<T>,): Promise<T> {
        let panelName: string;
        if (typeof param === "string") panelName = param + "Panel";
        else if (param instanceof Prefab) panelName = param.name;
        else panelName = Util.getPanelNameByContext(param);


        let loadAsset = await AssetLoader.loadBundle<Prefab>("Bundles", "Prefabs/Panels/" + panelName, Prefab)
        let node: Node = instantiate(loadAsset.asset);
        let newPanel = node.getComponent(PanelContext) as T;

        this.panelStackController.push(newPanel);
        node.name = panelName;
        node.parent = this.panelRoot;
        node.active = false;


        //스테이터스바 뎁스 조정
        this.adjustStatusBarDepth();

        let coroutine = CoroutineManager.startCoroutine(this.appearCoroutine(newPanel, beforeAppear), null);
        await coroutine.getDonePromise();


        console.log(this.panelStackController.getAllPanels().map(panel => panel.name));
        return newPanel;
    }


    /**
     * 패널 오픈시 발생하는 라이프 사이클
     * @param newPanel 
     * @param beforeAppear 
     */
    private *appearCoroutine(newPanel: PanelContext, beforeAppear?: Action1<PanelContext>) {
        beforeAppear && beforeAppear(newPanel);

        yield Util.waitForPromise(newPanel.onAppearStart());

        this.sceneLoading.progress = 1;

        //애니메이션 가능할경우 준비
        if (newPanel.panelAnimation) {
            newPanel.panelAnimation.standy();
        }

        //패널 Active true
        this.hideLoadingPanel();
        newPanel.node.active = true;

        //애니메이션 노출
        if (newPanel.panelAnimation) {
            yield newPanel.panelAnimation.appear();
        }

        yield Util.waitForPromise(newPanel.onAppearFinish());
    }


    /**
     * 패널이 닫힐경우 발생하는 destroy이전 라이프 사이클
     * @param panelContext 
     * @param immediately 
     * @returns 
     */
    public async disappear(panelContext: PanelContext, immediately = false) {
        if (!this.panelStackController.contains(panelContext)) {
            return;
        }

        this.statusBar.enableEvents(false);

        let poppedPanel: PanelContext | undefined;
        let peekedPanel = this.panelStackController.peek();
        let coroutine: Coroutine;

        if (panelContext === peekedPanel) {
            poppedPanel = this.panelStackController.pop();
            coroutine = CoroutineManager.startCoroutine(this.disappearCoroutine(poppedPanel!, this.panelStackController.peek(), immediately), null);



        } else {
            if (panelContext.node.active) {
                let panels = this.panelStackController.getAllPanels();
                let PanelIndex = panels.findIndex((panel, index) => panel === panelContext);
                panels[PanelIndex - 1].node.active = true;
            }

            this.panelStackController.remove(panelContext);
            coroutine = CoroutineManager.startCoroutine(this.disappearCoroutine(panelContext, undefined, immediately), null);
        }


        await coroutine.getDonePromise();
    }


    /**
    * 패널이 닫힐경우 발생하는 destroy이전 라이프 사이클
    * @param panelContext 
    * @param immediately 
    * @returns 
    */
    private *disappearCoroutine(disappearPanel: PanelContext, uncoverPanel: PanelContext | undefined, immediately: boolean) {
        yield Util.waitForPromise(disappearPanel.onDisappearStart());

        if (!immediately && disappearPanel.panelAnimation) {
            yield disappearPanel.panelAnimation.disappear();
        }

        yield Util.waitForPromise(disappearPanel.onDisappearFinish());


        disappearPanel.node.destroy();

        if (this.disappearResolves[disappearPanel.name]) {
            this.disappearResolves[disappearPanel.name].forEach(resolve => resolve(disappearPanel));
            delete this.disappearResolves[disappearPanel.name];
        }
    }


    /**
     * 해당 패널을 닫아준다
     * @param panelContextClass 
     */
    public Close(panelContextClass: Function): void {
        let checkFunc: Func1<boolean, PanelContext>;
        checkFunc = cPanel => cPanel instanceof panelContextClass;

        let panelContext = this.panelStackController.peek();

        while (panelContext && !checkFunc(panelContext)) {
            CoroutineManager.startCoroutine(this.disappearCoroutine(panelContext, undefined, true), null);

            this.panelStackController.pop();
            panelContext = this.panelStackController.peek();
        }

    }


    /**
     * 해당 패널이 닫힐때까지 기다린다
     */
    private disappearResolves: { [panelName: string]: Action1<PanelContext>[] } = {};
    public whenPanelClosed(panelContext: PanelContext): Promise<PanelContext> {
        return new Promise<PanelContext>(resolve => {
            if (!this.disappearResolves[panelContext.name]) this.disappearResolves[panelContext.name] = [];
            this.disappearResolves[panelContext.name].push(resolve);
        });
    }


    /**
     * StatusBat Panel의 Depth를 조정한다
     */
    private adjustStatusBarDepth(): void {
        let array = this.panelStackController.getAllPanels();
        let lastPanel = array[array.length - 1];
        if (lastPanel && lastPanel.showStatusBar) {
            this.statusBar.node.setSiblingIndex(array.length + 1);
        }
    }




    public showLoadingPanel(type: E_LOADING_TYPE, initProgress?: number) {
        switch (type) {
            case E_LOADING_TYPE.SCENE:
                this.sceneLoading.show(initProgress);
                break;

            case E_LOADING_TYPE.SIMPLE:
                this.simpleLoading.node.active = true;
                break;
        }
    }

    hideLoadingPanel(): Coroutine | undefined {
        if (this.sceneLoading.node.active) {
            return CoroutineManager.startCoroutine(this._hideLoadingPanel(), null);
        } else {
            this.simpleLoading.node.active = false;
        }
    }

    *_hideLoadingPanel() {
        yield this.sceneLoading.disappear();
    }



}