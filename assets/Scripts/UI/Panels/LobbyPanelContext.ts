import { _decorator, Component, Node } from 'cc';
import { PanelContext } from '../../../HumanScript/ui/panel/PanelContext';
const { ccclass, property } = _decorator;

@ccclass('LobbyPanelContext')
export class LobbyPanelContext extends PanelContext {
    onClickButtonX() {
        this.onClickBack();
    }
}


