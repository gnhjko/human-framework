import { _decorator, Component, Node } from 'cc';
import { Button } from 'cc';
import { ccComponentEventHandler, named } from '../../HumanScript/core/HelperManeger';
import { SoundManager } from '../../HumanScript/managers/SoundManager';
const { ccclass, property } = _decorator;


@ccclass('SoundTest')
export class SoundTest extends Component {

    @property(Button) btnBGM: Button = null;
    @property(Button) btnEffect: Button = null;

    @property(Button) btnBGMMute: Button = null;
    @property(Button) btnEffectMute: Button = null;

    protected onEnable(): void {

        this.btnBGM.clickEvents = [ccComponentEventHandler(this, this.onClickBGM)]
        this.btnEffect.clickEvents = [ccComponentEventHandler(this, this.onClickEffect)]


        this.btnBGMMute.clickEvents = [ccComponentEventHandler(this, this.onClickBGMMute)]
        this.btnEffectMute.clickEvents = [ccComponentEventHandler(this, this.onClickEffectMute)]

        SoundManager.Inst.init();

    }

    @named
    onClickBGM() {
        //SoundManager.Inst.PlayBgm(E_SOUND_BGM.BGM_INTRO);
    }


    @named
    onClickEffect() {
        //SoundManager.Inst.PlayEffect(E_SOUND_EFFECT.BUTTON);
    }




    private activeBGM: boolean = false;
    @named
    onClickBGMMute() {
        this.activeBGM = !this.activeBGM;
        SoundManager.Inst.MuteBGM(this.activeBGM);
    }

    private activeEffect: boolean = false;
    @named
    onClickEffectMute() {
        this.activeEffect = !this.activeEffect;
        SoundManager.Inst.MuteEffect(this.activeEffect);
    }
}


