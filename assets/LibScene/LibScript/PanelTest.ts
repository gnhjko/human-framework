import { _decorator, Component, Node } from 'cc';
import { LobbyPanelContext } from '../../Scripts/UI/Panels/LobbyPanelContext';
import { MessageBoxPanelContext } from '../../Scripts/UI/Panels/MessageBoxPanelContext';
import { RankPanelContext } from '../../Scripts/UI/Panels/RankPanelContext';
import { E_LOADING_TYPE, PanelManager } from '../../HumanScript/managers/PanelManager';
const { ccclass, property } = _decorator;

@ccclass('PanelTest')
export class PanelTest extends Component {
    async onClickLobby() {
        PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
        await PanelManager.Inst.Open(LobbyPanelContext);
        PanelManager.Inst.hideLoadingPanel();
    }

    async onClickMessage() {
        PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
        await PanelManager.Inst.Open(MessageBoxPanelContext,
            messageBoxPanel => messageBoxPanel.initBeforeAppear("타이틀", "메세지", {
                button0Label: "랭크오픈", button0ClickCallback: async () => {
                    PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);
                    await PanelManager.Inst.Open(RankPanelContext);
                    PanelManager.Inst.hideLoadingPanel();
                }
            }));
        PanelManager.Inst.hideLoadingPanel();
    }
}


