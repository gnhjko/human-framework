import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('StatusBarContext')
export class StatusBarContext extends Component {
    public show() {
        this.node.active = true;
    }

    public hide() {
        this.node.active = false;
    }


    public isActive(): boolean {
        return this.node.activeInHierarchy;
    }


    public enableEvents(isActive: boolean) {

    }
}


