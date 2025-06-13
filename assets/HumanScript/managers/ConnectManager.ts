
import { Component, _decorator } from 'cc';

const { ccclass, property } = _decorator;

/**
 * 프로토콜 추가시 
 * packetMap에 추가
 */

@ccclass('ConnectManager')
export class ConnectManager extends Component {

    public static Inst: ConnectManager = null;

    onLoad() {
        ConnectManager.Inst = this;
    }


    public static ACT_URL: string = "";

    public async init() {
        let devFlag: boolean = true;
        devFlag = (location.host.indexOf("192.168.0") >= 0 || location.host.indexOf("localhost") >= 0 || location.host.indexOf("demogame.co.kr") != -1) ? true : false;

        if (devFlag) {
            ConnectManager.ACT_URL = "https://mgame.gamen.com/game/01_dinobot/samsung_dev/dev_action_v1.103.php";
            console.log("개발 도메인")

        }
        else {
            ConnectManager.ACT_URL = "https://mgame.gamen.com/game/01_dinobot/samsung/dev_action_v1.103.php";
            console.log("상용 도메인")
        }
    }



    //게임서버에 해당 유저가 존재 하는지 체크
    public async gameInfo() {
        /* PanelManager.Inst.showLoadingPanel(E_LOADING_TYPE.SIMPLE);

        let data: GameInfoResponse = await new Packet.GameInfo({
            flag: "gameInfo",
            fcode: "",
            custno: "",
        }).send();


        PanelManager.Inst.hideLoadingPanel();
        return data; */

    }



}
