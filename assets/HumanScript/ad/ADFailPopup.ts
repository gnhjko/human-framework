
import { _decorator, Component, Node } from 'cc';
import { Action0 } from '../logic/Define';
const { ccclass, property } = _decorator;



@ccclass('ADFailPopup')
export class ADFailPopup extends Component {

    private completeCallFn: Action0 = null;

    public init(_complteCall: Action0) {
        this.completeCallFn = _complteCall;
    }

    onClose() {
        if (this.completeCallFn) this.completeCallFn();

        //팝업 끄기
        this.node.destroy();
    }
}

