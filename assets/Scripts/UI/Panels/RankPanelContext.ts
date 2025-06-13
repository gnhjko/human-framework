import { _decorator, Component, Node } from 'cc';
import { MessageBoxPanelContext } from './MessageBoxPanelContext';
import { LobbyPanelContext } from './LobbyPanelContext';
import { PanelContext } from '../../../HumanScript/ui/panel/PanelContext';
import { E_LOADING_TYPE, PanelManager } from '../../../HumanScript/managers/PanelManager';
const { ccclass, property } = _decorator;

@ccclass('RankPanelContext')
export class RankPanelContext extends PanelContext {

    async onClickMessage() {
        await PanelManager.Inst.Open(MessageBoxPanelContext,
            messageBoxPanel => messageBoxPanel.initBeforeAppear("타이틀", "메세지", {
                button0Label: "로비오픈", button0ClickCallback: async () => {
                    PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
                    await PanelManager.Inst.Open(LobbyPanelContext);
                    PanelManager.Inst.hideLoadingPanel();
                }
            }));
    }

    onClickButtonX() {
        this.onClickBack();
    }
}


