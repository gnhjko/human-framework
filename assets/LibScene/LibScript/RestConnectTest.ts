import { Button } from 'cc';
import { _decorator, Component, Node } from 'cc';
import { ccComponentEventHandler, named } from '../../HumanScript/core/HelperManeger';
import { ConnectManager } from '../../HumanScript/managers/ConnectManager';
import { E_LOADING_TYPE, PanelManager } from '../../HumanScript/managers/PanelManager';
const { ccclass, property } = _decorator;

@ccclass('RestConnectTest')
export class RestConnectTest extends Component {
    @property(Button) btnGameInfoRequest: Button = null;



    onEnable(): void {

        ConnectManager.Inst.init();
        this.btnGameInfoRequest.clickEvents = [ccComponentEventHandler(this, this.onClickRequestGameInfo)];

    }


    @named
    async onClickRequestGameInfo() {
        PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
        let data = await ConnectManager.Inst.gameInfo();
        console.log(data);
        PanelManager.Inst.hideLoadingPanel();
    }

}


