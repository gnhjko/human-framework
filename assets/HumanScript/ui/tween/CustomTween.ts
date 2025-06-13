
import { CCBoolean, Component, Enum, Node, tween, Tween, UIOpacity, Vec3, _decorator } from 'cc';
import { CustomEasingValue, CustomTweenValue } from './CustomTweenValue';
const { ccclass, property } = _decorator;



/**
 * 아래 속성 트윈 가능
 */
export enum E_CUSTOM_EASING_TYPE {
    Position,
    Scale,
    EulerAngles,
    Opacity
}


/*

 cc.d.ts 39868  
 _actions:any 추가

 export class Tween<T> {

 @property(CustomTween) cs: CustomTween = null;

 this.cs.SetStartCallFn(() => {
    console.log(this);
 })

 this.cs.SetEndCallFn(() => {
            console.log(this);
 })
 this.cs.TweenStart();
 this.cs.TweenStop();
 this.cs.TweenRemove();
 this.cs.TweenResetValue();
 _actions: any; : cc.d.ts 36937 
*/

@ccclass('CustomTween')
export class CustomTween extends Component {
    @property(CCBoolean) playOnLoad: boolean = false; //active = true일경우 자동으로 실행
    @property(CCBoolean) repeat: boolean = false;   // 무한 반복 여부
    @property(CCBoolean) diableToReset: boolean = false; //active = false일경우 초기값으로 설정
    @property({ type: Enum(E_CUSTOM_EASING_TYPE), visible: true, tooltip: "트윈 Easing 타입" }) customEasingType: E_CUSTOM_EASING_TYPE = E_CUSTOM_EASING_TYPE.Scale;

    @property({ type: CustomTweenValue, visible: true }) customTweenValue: CustomTweenValue[] = []; //트윈 설정값


    private _callBackEnd: any = null;
    private _callBackStart: any = null;
    private _tweenAction: any
    private _tweens: any = [];
    private _tagID: number = 0;

    private _orignPosition: Vec3 = new Vec3(0, 0, 0);
    private _orignScale: Vec3 = new Vec3(0, 0, 0);
    private _orignEulerAngles: Vec3 = new Vec3(0, 0, 0);
    private _orignOpacity: number = 0;

    private opacityComponent: UIOpacity = null;

    constructor() {
        super();
        this._tagID = Math.floor(Math.random() * (99999 - 10000)) + 10000;
    }


    onEnable() {

        this._orignPosition = this.node.position.clone();
        this._orignScale = this.node.scale.clone();
        this._orignEulerAngles = this.node.eulerAngles.clone();


        this.opacityComponent = this.node.getComponent(UIOpacity);
        this._orignOpacity = (this.opacityComponent) ? this.opacityComponent.opacity : 0;


        for (let i = 0; i < this.customTweenValue.length; i++) {
            let value: Vec3 = this.customTweenValue[i].value;
            let time: number = this.customTweenValue[i].time;
            let ease = CustomEasingValue[this.customTweenValue[i].Ease];

            //시간이 0면 해당 속성 바로 적용
            if (time == 0) {
                if (this.customEasingType == E_CUSTOM_EASING_TYPE.Position) {
                    this._tweens[i] = tween().set({ position: value })['_actions'][0];

                } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.Scale) {
                    this._tweens[i] = tween().set({ scale: value })['_actions'][0];

                } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.EulerAngles) {
                    this._tweens[i] = tween().set({ eulerAngles: value })['_actions'][0];

                } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.Opacity) {
                    this._tweens[i] = tween().set({ opacity: value.x })['_actions'][0];
                }

            } else {
                if (this.customEasingType == E_CUSTOM_EASING_TYPE.Position) {
                    this._tweens[i] = tween().to(time, { position: value }, { easing: ease })['_actions'][0];

                } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.Scale) {
                    this._tweens[i] = tween().to(time, { scale: value }, { easing: ease })['_actions'][0];

                } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.EulerAngles) {
                    this._tweens[i] = tween().to(time, { eulerAngles: value }, { easing: ease })['_actions'][0];

                } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.Opacity) {
                    this._tweens[i] = tween().to(time, { opacity: value.x }, { easing: ease })['_actions'][0];
                }
            }



        }

        this.initTween();
        if (this.playOnLoad) this.TweenStart();

    }

    /**
     * 트윈 초기화
     * @returns 
     */
    private initTween() {

        let target: Node | UIOpacity = (this.customEasingType == E_CUSTOM_EASING_TYPE.Opacity) ? this.opacityComponent : this.node;
        if (!target) return;

        if (this.repeat) {
            //리핏일경우 종료 콜백이 존재하지 않는다

            this._tweenAction = tween(target).repeatForever(tween().call(() => {
                //console.log("Start Tween");
                if (this._callBackStart != null) {
                    this._callBackStart();
                }

            }).sequence(this._tweens));

        } else {


            this._tweenAction = tween(target).call(() => {
                if (this._callBackStart != null) {
                    this._callBackStart();
                }


            }).sequence(this._tweens).call(() => {
                if (this._callBackEnd != null) {
                    this._callBackEnd();
                }
            });
        }

        this._tweenAction.tag(this._tagID);
    }


    /**
     * 트윈 시작
     */
    public TweenStart() {
        this.TweenRemove()
        if (this._tweenAction) this._tweenAction.start();
    }


    /**
     * 트윈 정지
     */
    public TweenStop() {
        if (this._tweenAction) this._tweenAction.stop();
    }

    /**
     * TweenRemove
     */
    public TweenRemove() {
        Tween.stopAllByTag(this._tagID);
    }


    /**
     * 해당 트윈의 초기값으로 설정한다 
     */
    public TweenResetValue() {
        if (this.customEasingType == E_CUSTOM_EASING_TYPE.Position) {

            this.node.setPosition(this._orignPosition);
        } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.Scale) {
            this.node.setScale(this._orignScale);

        } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.EulerAngles) {
            this.node.eulerAngles = this._orignEulerAngles;

        } else if (this.customEasingType == E_CUSTOM_EASING_TYPE.Opacity) {
            if (this.opacityComponent) {
                this.opacityComponent.opacity = this._orignOpacity;
            }
        }
    }


    /**
     * 트윈 타겟
     */
    public get tweenTarget(): Tween<Node> {
        if (this._tweenAction) {
            return this._tweenAction;
        } else {
            return null;
        }
    }



    /**
     * 트윈 시작 콜백
     * @param callBack 
     */
    public SetEndCallFn(callBack: any) {
        this._callBackEnd = callBack
    }


    /**
     * 트윈 종료 콜백
     * @param callBack 
     */
    public SetStartCallFn(callBack: any) {
        this._callBackStart = callBack
    }



    /**
     * 객체가 active false될경우 초기 값으로 설정한다 
     */
    onDisable() {
        this.TweenStop();
        if (this.diableToReset) {
            this.TweenResetValue();
        }
    }




    randomRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

}
