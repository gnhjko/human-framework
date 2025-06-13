import { _decorator, CCFloat, Component } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DelayDestroy')
export class DelayDestroy extends Component {
    @property(CCFloat) destroySecond: number = 0.5
    protected onEnable(): void {
        this.scheduleOnce(() => {
            this.node.destroy()
        }, this.destroySecond)
    }
}


