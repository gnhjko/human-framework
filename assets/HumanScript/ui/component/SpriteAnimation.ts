
import { _decorator, CCBoolean, Component, director, Sprite, SpriteFrame } from 'cc';
import { Time } from '../../../HumanScript/core/Time';
const { ccclass, property } = _decorator;

/**
 * 캐릭터에 사용되는 Sprite Animation
 */

interface ISpriteAtlasDecompo {
    key: string,
    frame: SpriteFrame
}



@ccclass('SpriteAnimation')
export class SpriteAnimation extends Component {


    @property({ visible: true }) mFPS: number = 30;
    @property({ visible: true }) mLoop: boolean = true;
    @property(SpriteFrame) animFrams: SpriteFrame[] = []
    @property(CCBoolean) playOnLoad: boolean = false;
    protected mSprite: Sprite = null;
    protected mDelta: number = 0;
    protected mIndex: number = 0;
    protected mActive: boolean = false;



    onEnable() {
        this.mSprite = this.node.getComponent<Sprite>(Sprite);
        if (this.playOnLoad) {
            this.play();
        }
    }

    public get frames(): number {
        return this.animFrams.length;
    }


    /// <summary>
    /// Animation framerate.
    /// </summary>

    public get framesPerSecond(): number {
        return this.mFPS;
    }



    public set framesPerSecond(v: number) {
        this.mFPS = v;
    }






    /// <summary>
    /// Set the animation to be looping or not
    /// </summary>

    public get loop(): boolean {
        return this.mLoop;
    }



    public set loop(v: boolean) {
        this.mLoop = v;
    }


    /// <summary>
    /// Returns is the animation is still playing or not
    /// </summary>


    public get isPlaying(): boolean {
        return this.mActive;
    }



    public play() {
        this.mActive = true;
        this.mIndex = 0;
    }

    public pause() {
        this.mActive = false;
    }

    public stop() {
        this.mActive = false;
        this.mIndex = 0;
    }


    update() {

        if (Time.timeScale == 0) return;

        if (this.mActive && this.animFrams.length > 0 && !director.isPaused() && this.mFPS > 0) {
            this.mDelta += Time.deltaTime;


            let rate: number = 1 / this.mFPS;

            if (rate < this.mDelta) {

                this.mDelta = (rate > 0) ? this.mDelta - rate : 0;
                if (++this.mIndex >= this.animFrams.length) {
                    this.mIndex = 0;
                    this.mActive = this.loop;
                }

                if (this.mActive) {
                    this.mSprite.spriteFrame = this.animFrams[this.mIndex];
                }
            }
        }
    }

    /// <summary>
    /// Rebuild the sprite list after changing the sprite name.
    /// </summary>

    public RebuildSpriteList(spriteFrames: SpriteFrame[]) {

        if (this.mSprite == null) this.mSprite = this.node.getComponent<Sprite>(Sprite);
        this.stop();
        this.animFrams = spriteFrames;

    }


    /// <summary>
    /// Reset the animation to frame 0 and activate it.
    /// </summary>

    public Reset() {
        this.mActive = true;
        this.mIndex = 0;

        if (this.mSprite != null && this.animFrams.length > 0) {
            this.mSprite.spriteFrame = this.animFrams[this.mIndex];
        }
    }

    private static SortByName(o1: SpriteFrame, o2: SpriteFrame): number {
        return o1.name.localeCompare(o2.name);
    }

}


