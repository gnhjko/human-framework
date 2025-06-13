import { _decorator, Component, Node } from 'cc';
import { TargetPlatform } from '../../HumanScript/common/Const_Define';
import { DEFINE } from '../../HumanScript/common/Const_Define';
import { PlatformManager } from '../../HumanScript/managers/PlatformManager';
const { ccclass, property } = _decorator;

@ccclass('PlatformTest')
export class PlatformTest extends Component {

    onEnable(): void {
        this.init();
    }

    init(): void {
        DEFINE.CURRENT_PLATFORM = TargetPlatform.Local;
        PlatformManager.Inst.initPlatform();
    }
}


