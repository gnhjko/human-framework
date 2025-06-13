import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ccComponentEventHandler, named } from '../../HumanScript/core/HelperManeger';
import { E_LOADING_TYPE, PanelManager } from '../../HumanScript/managers/PanelManager';
import { ADManager } from '../../HumanScript/managers/ADManager';
const { ccclass, property } = _decorator;

@ccclass('ADTest')
export class ADTest extends Component {
    @property(Button) btnInterstitial: Button = null;
    @property(Button) btnReward: Button = null;


    onEnable(): void {


        this.btnInterstitial.clickEvents = [ccComponentEventHandler(this, this.onClickInterstitial)];
        this.btnReward.clickEvents = [ccComponentEventHandler(this, this.onClickReward)];
    }


    @named
    async onClickInterstitial() {
        PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
        await ADManager.Inst.showInterstitial("log");
        PanelManager.Inst.hideLoadingPanel();
    }


    @named
    async onClickReward() {
        PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
        let sucess: boolean = await ADManager.Inst.showReward("log");
        if(sucess){
            console.info("보상성공");
        }else{
            console.info("보상실패");
        }
        PanelManager.Inst.hideLoadingPanel();
    }


}


