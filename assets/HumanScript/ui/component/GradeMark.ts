
import { _decorator, Component, Node, Animation, AnimationState, AnimationClip, __private, CCBoolean, Vec3, tween, Tween, TweenSystem, CCInteger, CCFloat, CCString, Enum, easing, UIOpacity, game } from 'cc';
const { ccclass, property } = _decorator;


/**
 * 등급 마크 자동 비노출
 * 1. GradeMark Node에 부착
 */

@ccclass('GradeMark')
export class GradeMark extends Component {

    private isOnEnable: boolean = false;
    private intervalIndex: number = 0;
    onEnable() {
        if (!this.isOnEnable) {

            this.schedule(() => {
                this.node.setSiblingIndex(this.node.parent.children.length);
                this.intervalIndex++;

                if (this.intervalIndex == 40) {
                    this.unscheduleAllCallbacks();
                    this.node.destroy();
                }
            }, 0.1);

            this.isOnEnable = true;
        }
    }


}
