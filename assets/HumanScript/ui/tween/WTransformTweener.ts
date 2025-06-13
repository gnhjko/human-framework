
import { _decorator, Component, Node, CCFloat, CCBoolean, Enum } from 'cc';
import { Action1 } from '../../logic/Define';
const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = WTransformTweener
 * DateTime = Tue Feb 22 2022 22:05:18 GMT+0900 (대한민국 표준시)
 * Author = brane7
 * FileBasename = WTransformTweener.ts
 * FileBasenameNoExtension = WTransformTweener
 * URL = db://assets/WTransformTweener.ts
 * ManualUrl = https://docs.cocos.com/creator/3.4/manual/en/
 *
 */




export enum E_EASING_TYPE {
    Linear,
    QuadIn, QuadOut, QuadInOut,
    CubicIn, CubicOut, CubicInOut,
    QuartIn, QuartOut, QuartInOut,
    QuintIn, QuintOut, QuintInOut,
    SinIn, SinOut, SinInOut,
    ExpoIn, ExpoOut, ExpoInOut,
    CircIn, CircOut, CircInOut,
    ElasticIn, ElasticOut, ElasticInOut,
    BackIn, BackOut, BackInOut,
    BounceIn, BounceOut, BounceInOut,
}

@ccclass('WTransformTweener')
export class WTransformTweener extends Component {


    @property({ visible: true }) _playOnEnable: boolean = false;

    @property({ type: Enum(E_EASING_TYPE), visible: true }) _easeType: E_EASING_TYPE = E_EASING_TYPE.Linear;

    @property({ type: CCFloat, visible: true }) _duration: number = 1;

    @property({ type: CCFloat, visible: true }) _delayOnPlay: number = 0;

    @property({ type: CCFloat, visible: true }) _delayOnStart: number = 0;

    @property({ type: CCFloat, visible: true }) _delayOnEnd: number = 0;

    @property({ visible: true }) _loop: boolean = false;

    @property({ visible: true }) _pingpong: boolean = false;

    @property({ type: CCFloat, range: [0, 1] }) _progress: number = 0;

    @property({ visible: true }) _direction: boolean = true;

    public _progressSpeed: number = 0;

    public _delayTime: number = 0;

    public _isPlaying: boolean = false;

    public _onPlay: Action1<Node> = null;

    public _onComplete: Action1<Node> = null;

    onEnable() {
        if (this._playOnEnable) {
            this.Play();
        }
    }

    onDisable() {
        this._isPlaying = false;
    }

    update(dt: number) {
        if (this._isPlaying) {
            if (this._delayTime > 0) {
                this._delayTime -= dt;
            }
            else if (this._progress < 1) {
                if (this._onPlay) this._onPlay(this.node);

                this._onPlay = null;

                this.SetProgress(this._progress + this._progressSpeed * dt);

                if (this._progress >= 1) {
                    this.OnEnd();

                    if (this._loop) {
                        this.Play();

                        if (this._pingpong) {
                            this._direction = !this._direction;

                            this.SetProgress(0);
                        }
                    }
                    else {
                        if (this._pingpong && this._direction) {
                            this.Play();

                            this._direction = false;

                            this.SetProgress(0);
                        }
                        else {
                            this._isPlaying = false;

                            if (this._onComplete) this._onComplete(this.node);

                            this._onComplete = null;
                        }
                    }
                }
            }
        }
    }

    public Play(onComplete: Action1<Node> = null): WTransformTweener {
        if (!this._isPlaying) {
            this._isPlaying = true;

            this._delayTime = this._delayOnPlay;

            this._direction = true;
        }
        else if (this._progress >= 1) {
            if (!this._pingpong) {
                this._delayTime = this._delayOnEnd;
            }
            else if (!this._direction) {
                this._delayTime = this._delayOnEnd;
            }
        }

        this.node.active = true;

        this._progressSpeed = 1 / (this._pingpong ? this._duration * 0.5 : this._duration);

        this.SetProgress(0);

        this.OnBegin();

        this.SetOnComplete(onComplete);

        return this;
    }

    public Stop(): WTransformTweener {
        this._isPlaying = false;

        return this;
    }

    public SetPlayOnEnable(playOnEnable: boolean): WTransformTweener {
        this._playOnEnable = playOnEnable;

        return this;
    }

    public SetDelayOnPlay(delay: number): WTransformTweener {
        this._delayOnPlay = delay;

        return this;
    }

    public SetDuration(duration: number): WTransformTweener {
        this._duration = duration;

        return this;
    }

    public SetEaseType(easeType: E_EASING_TYPE): WTransformTweener {
        this._easeType = easeType;

        return this;
    }

    public SetLoop(loop: boolean): WTransformTweener {
        this._loop = loop;

        return this;
    }

    public SetPingpong(pingpong: boolean): WTransformTweener {
        this._pingpong = pingpong;

        return this;
    }

    public SetProgress(progress: number): WTransformTweener {
        this._progress = Easing.clamp01(progress);

        this.UpdateValue(Easing.Evaluate(this._easeType, (this._direction) ? this._progress : (1 - this._progress)));

        return this;
    }

    public SetOnPlay(onPlay: Action1<Node>): WTransformTweener {
        this._onPlay = onPlay;

        return this;
    }

    public SetOnComplete(onComplete: Action1<Node>): WTransformTweener {
        this._onComplete = onComplete;

        return this;
    }

    protected OnBegin() { }
    protected OnEnd() { }

    public UpdateValue(t: number) {

    };


}



export class Easing {

    // [min, max) in R-space
    static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }


    static clamp(value: number, min: number = 0, max: number = 1): number {
        return Math.min(max, Math.max(min, value));
    }

    static clamp01(value: number): number {
        let result: number = 0;
        if (value <= 0) {
            result = 0
        } else if (value >= 1) {
            result = 1
        } else {
            result = value;
        }
        return result;
    }

    public static Evaluate(type: E_EASING_TYPE, t: number): number {
        switch (type) {
            case E_EASING_TYPE.QuadIn: return Quadratic.In(t);
            case E_EASING_TYPE.QuadOut: return Quadratic.Out(t);
            case E_EASING_TYPE.QuadInOut: return Quadratic.InOut(t);
            case E_EASING_TYPE.CubicIn: return Cubic.In(t);
            case E_EASING_TYPE.CubicOut: return Cubic.Out(t);
            case E_EASING_TYPE.CubicInOut: return Cubic.InOut(t);
            case E_EASING_TYPE.QuartIn: return Quartic.In(t);
            case E_EASING_TYPE.QuartOut: return Quartic.Out(t);
            case E_EASING_TYPE.QuartInOut: return Quartic.InOut(t);
            case E_EASING_TYPE.QuintIn: return Quintic.In(t);
            case E_EASING_TYPE.QuintOut: return Quintic.Out(t);
            case E_EASING_TYPE.QuintInOut: return Quintic.InOut(t);
            case E_EASING_TYPE.SinIn: return Sinusoidal.In(t);
            case E_EASING_TYPE.SinOut: return Sinusoidal.Out(t);
            case E_EASING_TYPE.SinInOut: return Sinusoidal.InOut(t);
            case E_EASING_TYPE.ExpoIn: return Exponential.In(t);
            case E_EASING_TYPE.ExpoOut: return Exponential.Out(t);
            case E_EASING_TYPE.ExpoInOut: return Exponential.InOut(t);
            case E_EASING_TYPE.CircIn: return Circular.In(t);
            case E_EASING_TYPE.CircOut: return Circular.Out(t);
            case E_EASING_TYPE.CircInOut: return Circular.InOut(t);
            case E_EASING_TYPE.ElasticIn: return Elastic.In(t);
            case E_EASING_TYPE.ElasticOut: return Elastic.Out(t);
            case E_EASING_TYPE.ElasticInOut: return Elastic.InOut(t);
            case E_EASING_TYPE.BackIn: return Back.In(t);
            case E_EASING_TYPE.BackOut: return Back.Out(t);
            case E_EASING_TYPE.BackInOut: return Back.InOut(t);
            case E_EASING_TYPE.BounceIn: return Bounce.In(t);
            case E_EASING_TYPE.BounceOut: return Bounce.Out(t);
            case E_EASING_TYPE.BounceInOut: return Bounce.InOut(t);
        }
        return this.Linear(t);
    }

    public static Linear(k: number): number {
        return k;
    }
}
export class Quadratic {
    public static In(k: number): number {
        return k * k;
    }

    public static Out(k: number): number {
        return k * (2 - k);
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return 0.5 * k * k;
        return -0.5 * ((k -= 1) * (k - 2) - 1);
    }
};

export class Cubic {
    public static In(k: number): number {
        return k * k * k;
    }

    public static Out(k: number): number {
        return 1 + ((k -= 1) * k * k);
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return 0.5 * k * k * k;
        return 0.5 * ((k -= 2) * k * k + 2);
    }
};

export class Quartic {
    public static In(k: number): number {
        return k * k * k * k;
    }

    public static Out(k: number): number {
        return 1 - ((k -= 1) * k * k * k);
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k;
        return -0.5 * ((k -= 2) * k * k * k - 2);
    }
};

export class Quintic {
    public static In(k: number): number {
        return k * k * k * k * k;
    }

    public static Out(k: number): number {
        return 1 + ((k -= 1) * k * k * k * k);
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return 0.5 * k * k * k * k * k;
        return 0.5 * ((k -= 2) * k * k * k * k + 2);
    }
};

export class Sinusoidal {
    public static In(k: number): number {
        return 1 - Math.cos(k * Math.PI / 2);
    }

    public static Out(k: number): number {
        return Math.sin(k * Math.PI / 2);
    }

    public static InOut(k: number): number {
        return 0.5 * (1 - Math.cos(Math.PI * k));
    }
};

export class Exponential {
    public static In(k: number): number {
        return k == 0 ? 0 : Math.pow(1024, k - 1);
    }

    public static Out(k: number): number {
        return k == 1 ? 1 : 1 - Math.pow(2, -10 * k);
    }

    public static InOut(k: number): number {
        if (k == 0) return 0;
        if (k == 1) return 1;
        if ((k *= 2) < 1) return 0.5 * Math.pow(1024, k - 1);
        return 0.5 * (-Math.pow(2, -10 * (k - 1)) + 2);
    }
};

export class Circular {
    public static In(k: number): number {
        return 1 - Math.sqrt(1 - k * k);
    }

    public static Out(k: number): number {
        return Math.sqrt(1 - ((k -= 1) * k));
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return -0.5 * (Math.sqrt(1 - k * k) - 1);
        return 0.5 * (Math.sqrt(1 - (k -= 2) * k) + 1);
    }
};

export class Elastic {
    public static In(k: number): number {
        if (k == 0) return 0;
        if (k == 1) return 1;
        return -Math.pow(2, 10 * (k -= 1)) * Math.sin((k - 0.1) * (2 * Math.PI) / 0.4);
    }

    public static Out(k: number): number {
        if (k == 0) return 0;
        if (k == 1) return 1;
        return Math.pow(2, -10 * k) * Math.sin((k - 0.1) * (2 * Math.PI) / 0.4) + 1;
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return -0.5 * Math.pow(2, 10 * (k -= 1)) * Math.sin((k - 0.1) * (2 * Math.PI) / 0.4);
        return Math.pow(2, -10 * (k -= 1)) * Math.sin((k - 0.1) * (2 * Math.PI) / 0.4) * 0.5 + 1;
    }
};

export class Back {
    static s: number = 1.70158;
    static s2: number = 2.5949095;

    public static In(k: number): number {
        return k * k * ((this.s + 1) * k - this.s);
    }

    public static Out(k: number): number {
        return (k -= 1) * k * ((this.s + 1) * k + this.s) + 1;
    }

    public static InOut(k: number): number {
        if ((k *= 2) < 1) return 0.5 * (k * k * ((this.s2 + 1) * k - this.s2));
        return 0.5 * ((k -= 2) * k * ((this.s2 + 1) * k + this.s2) + 2);
    }
};

export class Bounce {
    public static In(k: number): number {
        return 1 - this.Out(1 - k);
    }

    public static Out(k: number): number {
        if (k < (1 / 2.75)) {
            return 7.5625 * k * k;
        }
        else if (k < (2 / 2.75)) {
            return 7.5625 * (k -= (1.5 / 2.75)) * k + 0.75;
        }
        else if (k < (2.5 / 2.75)) {
            return 7.5625 * (k -= (2.25 / 2.75)) * k + 0.9375;
        }
        else {
            return 7.5625 * (k -= (2.625 / 2.75)) * k + 0.984375;
        }
    }

    public static InOut(k: number): number {
        if (k < 0.5) return this.In(k * 2) * 0.5;
        return this.Out(k * 2 - 1) * 0.5 + 0.5;
    }
};



