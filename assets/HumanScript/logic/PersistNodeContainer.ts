
import { director } from 'cc';
import { game } from 'cc';
import { _decorator, Component, Node, screen, UITransform, view } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 파괴되지 않는 노드 
 * 싱글턴 매니저들 상주
 */

@ccclass('PersistNodeContainer')
export class PersistNodeContainer extends Component {

    public static Inst: PersistNodeContainer = null;

    onLoad() {
        PersistNodeContainer.Inst = this;
    }

    @property(Node) root: Node = null;

    private isEnable: boolean = false;


    /**
     * 상주 노드는 씬변환시 onEnable 호출
     * @returns 
     */
    onEnable() {

        if (this.isEnable) return;

        this.isEnable = true;
        director.addPersistRootNode(this.node);

        this.resizeCallFn()
        screen.on("window-resize", () => {
            setTimeout(() => {
                console.log("resize call")
                this.resizeCallFn();
            }, 100)
        });

    }


    /**
     * 화면 사이즈에 따른 리사이즈
     * Root는 동적 UI에 맞게 사용하기 위해 Widget의 target을 Root로 설정
     */
    private resizeCallFn() {
        let width = (screen.resolution.width / view.getVisibleSizeInPixel().width) * 720
        let height = (screen.resolution.height / view.getVisibleSizeInPixel().height) * 1280

        this.root.getComponent(UITransform).setContentSize(width, height);
    }

}

