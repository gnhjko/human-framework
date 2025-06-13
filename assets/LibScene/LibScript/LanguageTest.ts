import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { ccComponentEventHandler, named } from '../../HumanScript/core/HelperManeger';
import { LanguageManager } from '../../HumanScript/managers/LanguageManager';
const { ccclass, property } = _decorator;



@ccclass('LanguageTest')
export class LanguageTest extends Component {
    @property(Button) btnKorean: Button = null;
    @property(Button) btnEnglish: Button = null;
    @property(Button) btnJapanese: Button = null;

    protected onEnable(): void {
        LanguageManager.Inst.init(); // locale 설정.

        this.btnKorean.clickEvents = [ccComponentEventHandler(this, this.onClickKorean)];
        this.btnEnglish.clickEvents = [ccComponentEventHandler(this, this.onClickEnglish)];
        this.btnJapanese.clickEvents = [ccComponentEventHandler(this, this.onClickJapanese)];
    }


    @named
    onClickKorean() {
        LanguageManager.Inst.updateLocale("ko");
    }


    @named
    onClickEnglish() {
        LanguageManager.Inst.updateLocale("en");
    }

    @named
    onClickJapanese() {
        LanguageManager.Inst.updateLocale("jp");
    }
}




