
import { Component, _decorator } from 'cc';
import { Util } from '../core/Util';
import { Action0 } from '../logic/Define';
import { director } from 'cc';
import { Prefab } from 'cc';
import { instantiate } from 'cc';
import { Node } from 'cc';
import { ADFailPopup } from '../ad/ADFailPopup';
import { E_LOADING_TYPE, PanelManager } from './PanelManager';
import { PlatformManager } from './PlatformManager';

const { ccclass, property } = _decorator;

/* 광고 상태 코드 */
export enum AD_EVENT_STATE {
    /** 광고 노출시 오류 */
    AD_ERROR = 'adError',

    /** 리워드 광고 클로즈*/
    AD_CLOSE_REWARD = 'adClosedReward',
    /** 리워드 광고 보상 완료 */
    VIDEO_COMPLETE_REWARD = 'videoCompletedReward',

    /** 전면 광고 보상 완료 */
    VIDEO_COMPLETE_INTERSTITIAL = 'videoCompletedInterstitial',

}

export interface AD_RESULT {
    STATE: AD_EVENT_STATE,
    ERROR_CODE: number
}


@ccclass('ADManager')
export class ADManager extends Component {

    public static Inst: ADManager = null;

    onLoad() {
        ADManager.Inst = this;
    }

    @property(Prefab) adFailPopup: Prefab = null;

    public async init() {

    }

    public async showInterstitial(_data1: string) {
        console.info("인터스티셜 광고 노출 : ", _data1);
        let isComplete: boolean = false;

        let result: AD_RESULT = await PlatformManager.Inst.showInterstitial(_data1);
        await Util.delay(1000);
        isComplete = true;

        return isComplete;
    }

    public async showReward(_data1: string) {

        console.info("리워드 광고 노출 : ", _data1);
        let isComplete: boolean = false;

        let result: AD_RESULT = await PlatformManager.Inst.showRewardedVideo(_data1);

        if (result.STATE == AD_EVENT_STATE.VIDEO_COMPLETE_REWARD) {
            isComplete = true;
        }

        return isComplete;

    }






    /**
     * 광고 실패 팝업
     */
    public showHideADFailPopup(callback?: Action0) {
        let canvas: any = director.getScene().getChildByName("Canvas");
        PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
        if (this.adFailPopup && canvas) {
            let clonePopup: Node = instantiate(this.adFailPopup)
            clonePopup.parent = canvas.getChildByName("Root");

            if (callback) {
                clonePopup.getComponent(ADFailPopup).init(callback);
            }
        }

        PanelManager.Inst.hideLoadingPanel();
    }



}
