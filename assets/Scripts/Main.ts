import { _decorator, Component, Node } from 'cc';
import { ADManager } from '../HumanScript/managers/ADManager';
import { AnalyticsManager } from '../HumanScript/managers/AnalyticsManager';
import { LanguageManager } from '../HumanScript/managers/LanguageManager';
import { SoundManager } from '../HumanScript/managers/SoundManager';
import { ConnectManager } from '../HumanScript/managers/ConnectManager';

const { ccclass, property } = _decorator;

@ccclass('Main')
export class Main extends Component {
    onEnable(): void {
        this.init();
    }


    private async init() {
        await ADManager.Inst.init();
        await AnalyticsManager.Inst.init();
        await LanguageManager.Inst.init();
        await SoundManager.Inst.init();
        await ConnectManager.Inst.init();
    }
}


