import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { ccComponentEventHandler, named } from '../../HumanScript/core/HelperManeger';
import { AnalyticsManager } from '../../HumanScript/managers/AnalyticsManager';
const { ccclass, property } = _decorator;


@ccclass('AnalyticsTest')
export class AnalyticsTest extends Component {

    @property(Button) btnSendLog: Button = null;


    protected onEnable(): void {
        AnalyticsManager.Inst.init();
        this.btnSendLog.clickEvents = [ccComponentEventHandler(this, this.onClickSendLog)]


    }

    @named
    onClickSendLog() {
        AnalyticsManager.Inst.logEvent("test");
    }

}


