
import { CCFloat, easing, Enum, Vec3, _decorator } from 'cc';
const { ccclass, property } = _decorator;



export const CustomEasingValue: any[] = [
    easing.linear,
    easing.quadIn, easing.quadOut, easing.quadInOut,
    easing.cubicIn, easing.cubicOut, easing.cubicInOut,
    easing.quartIn, easing.quartOut, easing.quartInOut,
    easing.quintIn, easing.quintOut, easing.quintInOut,
    easing.sineIn, easing.sineOut, easing.sineInOut,
    easing.expoIn, easing.expoOut, easing.expoInOut,
    easing.circIn, easing.circOut, easing.circInOut,
    easing.elasticIn, easing.elasticOut, easing.elasticInOut,
    easing.backIn, easing.backOut, easing.backInOut,
    easing.bounceIn, easing.bounceOut, easing.bounceInOut,
    easing.quadOutIn, easing.cubicOutIn, easing.quartOutIn,
    easing.quintOutIn, easing.sineOutIn, easing.expoOutIn, easing.circOutIn, easing.elasticOutIn, easing.backOutIn, easing.bounceOutIn,
];

/**
 * 문자열로 입력시 인스펙터에 노출이 안됨
 */
export enum E_CUSTOM_EASING {
    linear,
    quadIn, quadOut, quadInOut,
    cubicIn, cubicOut, cubicInOut,
    quartIn, quartOut, quartInOut,
    quintIn, quintOut, quintInOut,
    sineIn, sineOut, sineInOut,
    expoIn, expoOut, expoInOut,
    circIn, circOut, circInOut,
    elasticIn, elasticOut, elasticInOut,
    backIn, backOut, backInOut,
    bounceIn, bounceOut, bounceInOut,
    quadOutIn, cubicOutIn, quartOutIn,
    quintOutIn, sineOutIn, expoOutIn, circOutIn, elasticOutIn, backOutIn, bounceOutIn,
}




@ccclass("CustomTweenValue")
export class CustomTweenValue {

    @property({  tooltip: "트윈 값" }) value: Vec3 = new Vec3(0, 0, 0);
    @property({ type: CCFloat, tooltip: "트윈 시간" }) time: number = 0;
    @property({ type: Enum(E_CUSTOM_EASING), visible: true, tooltip: "트윈 이징" }) Ease: E_CUSTOM_EASING = E_CUSTOM_EASING.linear;

}
