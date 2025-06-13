

import { _decorator, CCBoolean, Component } from 'cc';
import { PanelAnimation } from "./PanelAnimation";
import { PanelManager } from '../../managers/PanelManager';
const { ccclass, property, executionOrder } = _decorator;


/**
 * Cocos의 노드 라이프타임과 별도로 자체 라이프 타임 생성해준다 
 * 기준은 애니메이션 시작전과 애니메이션 완료후
 */
@ccclass('PanelContext')
export class PanelContext extends Component {
    @property(CCBoolean) showStatusBar: boolean = true;

    public panelAnimation: PanelAnimation;

    onLoad() {
        if (this.node.getComponent(PanelAnimation)) {
            this.panelAnimation = this.node.getComponent(PanelAnimation);
        }

    }

    start() { }
    onEnable() { }
    onDisable() { }
    onDestroy() { }
    update(dt: number) { }



    /**
     * 패널이 하이어라이 붙은 다음 진행(애니메이션 시`작전)
     */
    public async onAppearStart() {
        console.log(`@@@@ Panel(${this.name}) onAppearStart`);
    }

    /**
     * AppearStart가 완료 될경우 진행(애니메이션 완료후)
     */
    public async onAppearFinish() {
        console.log(`@@@@ Panel(${this.name}) onAppearFinish`);
    }




    /**
     * 애니메이션 시작전
     */
    public async onDisappearStart() {
        console.log(`@@@@ Panel(${this.name}) onDisappearStart`);
    }


    /**
     * 애니메이션 완료후
     */
    public async onDisappearFinish() {
        console.log(`@@@@ Panel(${this.name}) onDisappearFinish`);
    }

    /**
     * 뒤로가기 버튼 클릭시
     */
    public onClickBack() {
        PanelManager.Inst.disappear(this);
    }



}