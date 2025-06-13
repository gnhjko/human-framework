import { Animation, AnimationClip, AnimationState } from "cc";

import { _decorator, Component } from 'cc';
import { Action0 } from "../../../HumanScript/logic/Define";
const { ccclass, property } = _decorator;


/**
 * 패널 오픈 및 클로즈시 애니메이션 타입
 * Animation 제작시 해당 이름을 지정해주어야 한다 
 */
export enum E_PANEL_ANIMATION_TYPE {
    APPEAR = "appear",
    DISAPPEAR = "disappear",
}

@ccclass('PanelAnimation')
export class PanelAnimation extends Component {
    @property(Animation) animation: Animation = null;
    @property(AnimationClip) appearClip: AnimationClip = null;
    @property(AnimationClip) disappearClip: AnimationClip = null;


    private availableClipNames: Set<E_PANEL_ANIMATION_TYPE> = new Set<E_PANEL_ANIMATION_TYPE>();
    private animationState: AnimationState | null;
    private callbacks: { [id: string]: () => void } = {}
    private onceCallbacks: { [id: string]: () => void } = {}

    onLoad() {
        if (this.animation) {
            let animation = this.animation;

            animation.playOnLoad = false;

            this.addClip(this.appearClip, E_PANEL_ANIMATION_TYPE.APPEAR);
            this.addClip(this.disappearClip, E_PANEL_ANIMATION_TYPE.DISAPPEAR);

        }
    }

    onEnable() {
        if (this.animation) {
            this.animation.on(Animation.EventType.PLAY, this.onAnimationPlay, this, false);
            this.animation.on(Animation.EventType.FINISHED, this.onAnimationFinish, this, false);
        }
    }

    onDisable() {
        if (this.animation) {
            this.animation.off(Animation.EventType.PLAY, this.onAnimationPlay, this);
            this.animation.off(Animation.EventType.FINISHED, this.onAnimationFinish, this);

            if (this.animationState) {
                this.animation.stop();
                this.animationState = null;
            }
        }
    }

    onDestroy() {
        this.callbacks = {};
        this.onceCallbacks = {};
    }



    private addClip(clip: AnimationClip, type: E_PANEL_ANIMATION_TYPE) {
        if (clip) {
            this.animation.addClip(clip, type);
            this.availableClipNames.add(type);
        }
    }

    isPlaying() {
        return this.animationState && this.animationState.isPlaying;
    }


    /**
     * 패널 오픈시 오픈 애니메이션이 존재 할경우 준비상태
     */
    standy() {
        if (this.animation) {
            this.animation.getState(E_PANEL_ANIMATION_TYPE.APPEAR).setTime(0);
            this.animation.play(E_PANEL_ANIMATION_TYPE.APPEAR);
            this.animation.stop();
        }
    }



    *appear() {
        if (this.animation) {
            this.animation.getState(E_PANEL_ANIMATION_TYPE.APPEAR).setTime(0);
            this.play(E_PANEL_ANIMATION_TYPE.APPEAR);

            while (this.isPlaying()) yield;
        }
    }


    *disappear() {
        if (this.animation) {
            if (this.isPlaying()) this.stop();
            this.animation.getState(E_PANEL_ANIMATION_TYPE.DISAPPEAR).setTime(0);

            this.play(E_PANEL_ANIMATION_TYPE.DISAPPEAR);
        
            while (this.isPlaying()) yield;
        }
    }

    onFinish(type: E_PANEL_ANIMATION_TYPE, callback: Action0) {
        this.callbacks[type] = callback;
    }

    onceFinish(type: E_PANEL_ANIMATION_TYPE, callback: Action0) {
        this.onceCallbacks[type] = callback;
    }



    private play(type: E_PANEL_ANIMATION_TYPE) {
        if (this.availableClipNames.has(type) && !this.isPlaying()) {
            this.animationState = this.animation.getState(type);
            this.animation.play(type);
        } else {
            if (this.animationState && this.callbacks[this.animationState.name]) {
                this.callbacks[this.animationState.name]();
            }

            if (this.animationState && this.onceCallbacks[this.animationState.name]) {
                this.onceCallbacks[this.animationState.name]();
                delete this.onceCallbacks[this.animationState.name];
            }
        }
    }

    private stop() {
        if (this.animationState) {
            this.animationState.stop();
            this.onAnimationFinish();
        }
    }

    private onAnimationPlay(type: Animation.EventType, state: AnimationState) { }

    private onAnimationFinish(event?: Event) {
        if (this.animationState && this.callbacks[this.animationState.name]) {
            this.callbacks[this.animationState.name]();
        }
        if (this.animationState && this.onceCallbacks[this.animationState.name]) {
            this.onceCallbacks[this.animationState.name]();
            delete this.onceCallbacks[this.animationState.name];
        }

        this.animationState = null;
    }
}