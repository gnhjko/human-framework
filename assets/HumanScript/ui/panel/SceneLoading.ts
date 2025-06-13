import { _decorator, Component, Node } from 'cc';
import { ArrayUtil, MyMath, Util } from '../../../HumanScript/core/Util';
import { Label } from 'cc';
import { ProgressBar } from 'cc';
import { Sprite } from 'cc';
import { SpriteFrame } from 'cc';
import { Coroutine, WaitForSeconds } from '../../managers/CoroutineManager';
const { ccclass, property } = _decorator;

@ccclass('SceneLoading')
export class SceneLoading extends Component {

    @property(Sprite) iconSprite: Sprite = null;
    @property(ProgressBar) progressBar: ProgressBar = null;
    @property(Label) progressText: Label = null;

    private progressQueue: number[] = [];
    private currentProgress = 0;
    private progressCoroutine: Coroutine | null;

 

    show(initProgress?: number) {

        let percent = (initProgress) ? initProgress : 0;

        this.progressText.string = percent + "%";
        this.progressQueue = [];
        this.progressCoroutine = null;

        this.node.active = true;
        this.progressBar.progress = this.currentProgress = this.progress = percent * 0.01;
    }

    get active(): boolean {
        return this.node.active;
    }

    get progress(): number {
        if (this.progressQueue.length === 0) return this.currentProgress;
        return ArrayUtil.getLast(this.progressQueue)!;
    }

    set progress(progress: number) {
        progress = MyMath.clamp(progress, 0, 1);

        if (!this.node.active) return;
        else if (progress < this.progress) return;

        this.progressQueue.push(progress);
    }

    set spriteFrame(spriteFrame: SpriteFrame) {
        this.iconSprite.spriteFrame = spriteFrame;
    }

    update(dt) {
        if (this.node.active && this.progressQueue.length > 0 && (!this.progressCoroutine || this.progressCoroutine.done)) {
            let newProgress: number = MyMath.clamp(this.progressQueue.shift()!);
            let duration = (newProgress - this.currentProgress) * 2;
            this.currentProgress = newProgress;
            this.progressCoroutine = Util.rollUpNumber(this, duration, this.progressBar.progress, newProgress, r => {
                this.progressBar.progress = r;
                this.progressText.string = Math.floor(r * 100).toString() + "%";
            });
        }
    }

    *disappear() {
        while (!ArrayUtil.isNullOrEmpty(this.progressQueue) || (this.progressCoroutine && !this.progressCoroutine.done)) {
            yield;
        }

        yield new WaitForSeconds(0.1);

        this.node.active = false;
    }

}


