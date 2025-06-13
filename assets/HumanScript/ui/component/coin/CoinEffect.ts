import { _decorator, Component, instantiate, Node, Prefab, Tween, Vec3 } from 'cc';
import { MyMath } from '../../../core/Util';
import { Action0 } from '../../../logic/Define';
import { E_WORLD_TYPE, WTransformBezierPositioner2D } from '../../tween/WTransformBezierPositioner2D';
import { E_EASING_TYPE } from '../../tween/WTransformTweener';
import { Coin2D } from './Coin2D';
const { ccclass, property } = _decorator;

@ccclass('CoinEffect')
export class CoinEffect extends Component {


    private static s_instance: CoinEffect = null;

    public static get Inst(): CoinEffect {
        return this.s_instance;
    }

    onLoad() {
        CoinEffect.s_instance = this;
    }


    @property(Prefab) coinPrefab: Prefab = null;
    @property(Node) container: Node = null;

    public coinMax: number = 100;
    private coinArray: Coin2D[] = []

    onEnable() {

        if (this.coinArray.length == 0) {
            for (let i = 0; i < this.coinMax; i++) {
                let cloneCoin: Node = instantiate(this.coinPrefab);
                cloneCoin.setParent(this.container);
                cloneCoin.setPosition(new Vec3(0, 0, 0));
                cloneCoin.active = false;
                let coin: Coin2D = cloneCoin.getComponent(Coin2D);
                coin.init();
                this.coinArray.push(coin);
            }
        }
    }

    async playCoinEffect(is3D: boolean, startPoint: Vec3, endPoint: Vec3, completeCallFn?: Action0) {

        this.coinMax = 20;

        let completeCount: number = 0;
        for (let i: number = 0; i < this.coinMax; i++) {

            let coin = this.coinArray[i].node.getComponent(WTransformBezierPositioner2D)
                .SetStartPosition(startPoint)
                .SetTargetPosition(endPoint)
                .SetPositionType(E_WORLD_TYPE.LOCAL)
                .SetDelayOnPlay(i * 0.02)
                .SetEaseType(E_EASING_TYPE.Linear)
                .Play()
                //.SetOnPlay(coin => coin.getComponent(Sprite).enabled = true)
                .SetOnComplete((coin: Node) => {

                    completeCount++;

                    coin.active = false;

                    if (completeCount == this.coinMax) {
                        if (completeCallFn != undefined) {
                            completeCallFn();
                        }
                    }
                });
        }

    }

    /**
     * 하단에 머물다 올라가는 이펙트
     * @param is3D 
     * @param startPoint 
     * @param endPoint 
     * @param completeCallFn 
     */
    async playCustomCoinEffect(is3D: boolean, startPoint: Vec3, endPoint: Vec3, firstCoinArrive?: Action0, completeCallFn?: Action0) {
        this.unscheduleAllCallbacks();

        this.coinMax = 20;

        let completeCount: number = 0;
        for (let i: number = 0; i < this.coinMax; i++) {

            let transform = this.coinArray[i].node.getComponent(WTransformBezierPositioner2D) as WTransformBezierPositioner2D
            transform.Stop();

            //0으로 지정시 오류난다 
            this.coinArray[i].node.setScale(new Vec3(1, 1, 1))
            this.coinArray[i].node.setPosition(startPoint.clone())


            let randX: number = MyMath.randomRange(startPoint.x + -150, startPoint.x + 150);
            let randY: number = MyMath.randomRange(startPoint.y + -100, startPoint.y - 150);

            Tween.stopAllByTarget(this.coinArray[i].node);
            this.coinArray[i].node.active = true;



            let coin = this.coinArray[i].node.getComponent(WTransformBezierPositioner2D)
                .SetStartPosition(this.coinArray[i].node.position)
                .SetTargetPosition(endPoint)
                .SetPositionType(E_WORLD_TYPE.LOCAL)
                .SetDelayOnPlay(MyMath.randomRange(0, 0.4))
                .SetDuration(MyMath.randomRange(1, 1.3))
                .SetEaseType(E_EASING_TYPE.QuadIn)
                .Play()
                //.SetOnPlay(coin => coin.getComponent(Sprite).enabled = true)
                .SetOnComplete((coin: Node) => {

                    if (completeCount == 0) {
                        if (firstCoinArrive != undefined) {
                            firstCoinArrive();
                        }
                    }

                    completeCount++;

                    coin.active = false;

                    if (completeCount == this.coinMax) {
                        if (completeCallFn != undefined) {
                            completeCallFn();

                        }
                    }
                });


        }

    }



}

