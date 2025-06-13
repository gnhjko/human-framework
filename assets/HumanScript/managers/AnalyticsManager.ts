
import { _decorator, Component } from 'cc';
import { TargetPlatform } from '../common/Const_Define';
import { PlatformManager } from './PlatformManager';



const { ccclass, property } = _decorator;

@ccclass('AnalyticsManager')
export class AnalyticsManager extends Component {
    public static Inst: AnalyticsManager = null;

    onLoad(): void {
        AnalyticsManager.Inst = this;
    }


    public async init() {

    }


    public logEvent(eventName: string, data?: any) {
        PlatformManager.Inst.logEvent(eventName, data);
    }


}

