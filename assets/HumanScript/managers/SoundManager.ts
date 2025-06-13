
/**
 * $ npm i howler
 * 
 * api -> https://www.npmjs.com/package/howler
 * 
 * play([sprite/id])
 * pause([id])
 * stop([id])
 * mute([muted], [id])
 * volume([volume], [id])
 * fade(from, to, duration, [id])
 * rate([rate], [id])
 * seek([seek], [id])
 * loop([loop], [id])
 * state()
 * playing([id])
 * duration([id])
 * on(event, function, [id])
 * once(event, function, [id])
 * event: String Name of event to fire/set (load, loaderror, playerror, play, end, pause, stop, mute, volume, rate, seek, fade, unlock).
 * off(event, [function], [id])
 * load()
 * unload()
 * 
 * 나누어 플레이시 해당 고유 아이디가 생성되며 그 아이디의 음원을 컨트롤 할수 있다 
 */
import { Component, JsonAsset, _decorator } from 'cc';

import { AudioClip } from 'cc';

import { sys } from 'cc';
import howler from 'howler';
import { DEFINE } from '../common/Const_Define';

const { ccclass, property } = _decorator;


export enum E_SAVE_SOUND {
    KEY_SETTING_SOUND = "KEY_SETTING_SOUND",
    KEY_SETTING_SOUND_BGM_VOLUME = "volume_bgm_count_run",
    KEY_SETTING_SOUND_EFFECT_VOLUME = "volume_effect_count_run",
}






interface ISoundIndex {
    index: number,
    key: string,
}


@ccclass('SoundManager')
export class SoundManager<E_BGM, E_SFX> extends Component {
    @property({ type: AudioClip }) joinClip: AudioClip = null;  
    @property(JsonAsset) infoJson: JsonAsset = null;

    public static Inst: SoundManager<any, any> = null;


    public nowBgm: E_BGM

    private bgmHowler: howler = null;
    private effectHowler: howler = null;

    private bgmIndexBuffer: ISoundIndex[] = []
    private effectIndexBuffer: ISoundIndex[] = []

    onLoad() {
       SoundManager.Inst = this;
    }

    public async init() {

        let loadBGMVolume = sys.localStorage.getItem(E_SAVE_SOUND.KEY_SETTING_SOUND_BGM_VOLUME);
        let loadEffectVolume = sys.localStorage.getItem(E_SAVE_SOUND.KEY_SETTING_SOUND_EFFECT_VOLUME);

        DEFINE.volumeBGM = (loadBGMVolume != undefined) ? loadBGMVolume : 1;
        DEFINE.volumeEFFECT = (loadEffectVolume != undefined) ? loadEffectVolume : 1;


        this.initBGMHowler(this.joinClip);

        this.initEffectHowler(this.joinClip);


        console.log("isHiddenBrowser : ", window['isHiddenBrowser']);

        //게임 로드시 지연이 발생할수 있어서 cocos2d.js에서 hidden 이벤트 처리후 hidden상태면 뮤트
        if (window['isHiddenBrowser']) {
            this.MuteBGM(true);
            this.MuteEffect(true);
        } else {
            this.MuteBGM((DEFINE.volumeBGM == 0));
            this.MuteEffect((DEFINE.volumeEFFECT == 0));
        }
    }


    /**
     * BGM전용 하울러
     * @param audioClip 
     */
    private initBGMHowler(audioClip: AudioClip) {
        //각 사운드 시간별로 조각 

        if (this.bgmHowler == null) {
            this.bgmHowler = new howler.Howl({
                src: [audioClip.nativeUrl],
                sprite: this.infoJson.json['sprite'],

            });
        }

    }

    /**
     * 이펙트 전용 하울러
     * @param audioClip 
     */
    private initEffectHowler(audioClip: AudioClip) {
        //각 사운드 시간별로 조각 

        if (this.effectHowler == null) {
            this.effectHowler = new howler.Howl({
                src: [audioClip.nativeUrl],
                sprite: this.infoJson.json['sprite'],
            });
        }

    }



    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 해당 BGM 플레이 
     * @param _eType 
     * @param _isLoop 
     */
    public PlayBgm(_eType: E_BGM, _isLoop: boolean = false, _volume: number = 0.3) {
        this.nowBgm = _eType;

        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.bgmIndexBuffer.findIndex(soundIdxRx);

        //최초 BGM 플레이
        if (soundIdx == -1) {
            let sound: ISoundIndex = { key: _eType.toString(), index: 0 }
            sound.index = this.bgmHowler.play(_eType);
            this.bgmHowler.volume(_volume, sound.index);
            this.bgmHowler.loop(_isLoop, sound.index);
            this.bgmIndexBuffer.push(sound)

            //기존 BGM 플레이
        } else {

            //* loop([loop], [id])
            let soundIndex: number = this.bgmIndexBuffer[soundIdx].index;
            this.bgmHowler.stop(soundIndex);
            this.bgmHowler.play(_eType);
            this.bgmHowler.volume(_volume, soundIndex);
            this.bgmHowler.loop(_isLoop, soundIndex);
        }

    }



    /**
     * 해당 BGM 정지
     * @param _eType 
     */
    public StopBgm(_eType: E_BGM) {
        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.bgmIndexBuffer.findIndex(soundIdxRx);
        if (soundIdx != -1) this.bgmHowler.stop(this.bgmIndexBuffer[soundIdx].index);
    }


    /**
     * 해당 BGM 일시정지
     * @param _eType 
     */
    public PauseBgm(_eType: E_BGM) {

        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.bgmIndexBuffer.findIndex(soundIdxRx);
        if (soundIdx != -1) this.bgmHowler.pause(this.bgmIndexBuffer[soundIdx].index);
    }



    /**
     * 해당 BGM 볼륨 조절
     * @param volume 
     * @param _eType 
     */
    public SetBgmVolume(volume: number, _eType: E_BGM) {

        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.bgmIndexBuffer.findIndex(soundIdxRx);
        if (soundIdx != -1) this.bgmHowler.volume(volume, this.bgmIndexBuffer[soundIdx].index);

    }


    /**
     * 모든 BGM Stop
     */
    public StopAllBGM() {
        /* this.bgmIndexBuffer.forEach(element => {
            let index = element.index;
            this.bgmHowler.stop(index);
        }); */

        this.bgmIndexBuffer = [];
        this.bgmHowler.stop();
    }


    /**
     * 모든 BGM 뮤트
     * @param _isMute 
     */
    public MuteBGM(_isMute: boolean) {
        this.bgmHowler.mute(_isMute)
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////////////////////////////////////////

    /**
     * 해당 Effect 플레이 
     * @param _eType 
     * @param _isLoop 
     */
    public PlayEffect(_eType: E_SFX, _isLoop: boolean = false, _volume: number = 1) {

        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.effectIndexBuffer.findIndex(soundIdxRx);

        //최초 Effect 플레이
        if (soundIdx == -1) {
            let sound: ISoundIndex = { key: _eType.toString(), index: 0 }
            sound.index = this.effectHowler.play(_eType);
            this.effectHowler.volume(_volume, sound.index);
            this.effectHowler.loop(_isLoop, sound.index);
            this.effectIndexBuffer.push(sound)

            //기존 Effect 플레이
        } else {

            let soundIndex: number = this.effectIndexBuffer[soundIdx].index;
            this.effectHowler.stop(soundIndex);
            let returnIndex = this.effectHowler.play(soundIndex);

            //가끔 뮤트 후 플레이시 null을 반환하며 작동이 안되는데 그럴때는 다시 한번해준다 
            if (returnIndex == null) {
                this.effectIndexBuffer.splice(soundIdx, 1);
                this.PlayEffect(_eType, _isLoop, _volume)
                return;
            }

            this.effectHowler.volume(_volume, soundIndex);
            this.effectHowler.loop(_isLoop, soundIndex);
        }


    }


    /**
     * 한번 재생
     * @param _eType 
     */
    public PlayOneShot(_eType: E_SFX, _volume: number = 1) {
        let soundIndex = this.effectHowler.play(_eType);

        this.effectHowler.volume(_volume, soundIndex);
    }



    /**
     * 해당 BGM 정지
     * @param _eType 
     */
    public StopEffect(_eType: E_SFX) {
        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.effectIndexBuffer.findIndex(soundIdxRx);
        if (soundIdx != -1) this.effectHowler.stop(this.effectIndexBuffer[soundIdx].index);
    }


    /**
     * 해당 BGM 일시정지
     * @param _eType 
     */
    public PauseEffect(_eType: E_SFX) {

        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.effectIndexBuffer.findIndex(soundIdxRx);
        if (soundIdx != -1) this.effectHowler.pause(this.effectIndexBuffer[soundIdx].index);
    }



    /**
     * 해당 BGM 볼륨 조절
     * @param volume 
     * @param _eType 
     */
    public SetEffectVolume(volume: number, _eType: E_SFX) {

        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.effectIndexBuffer.findIndex(soundIdxRx);
        if (soundIdx != -1) this.effectHowler.volume(volume, this.effectIndexBuffer[soundIdx].index);

    }



    /**
     * 해당 이펙트 플레이 중인지 체크
     * @param _eType 
     * @returns 
     */
    public isPlayEffect(_eType: E_SFX) {
        let soundIdxRx = (sound: ISoundIndex) => sound.key == _eType.toString();
        let soundIdx = this.effectIndexBuffer.find(soundIdxRx);
        if (soundIdx != null) {
            let isPlaying = this.effectHowler.playing(soundIdx.index);
            return isPlaying;
        }

        return false;

    }



    /**
     * 모든 BGM Stop
     */
    public StopAllEffect() {
        this.effectHowler.stop();
    }


    /**
     * 모든 BGM 뮤트
     * @param _isMute 
     */
    public MuteEffect(_isMute: boolean) {
        this.effectHowler.mute(_isMute)
    }



    /**
     * 홈버튼 또는 브라우저 다운시에는 사운드가 작동하면 안된다
     * @param _active 
     */
    public CheckBrowserOnOff(_active: boolean) {
        if (DEFINE.volumeBGM != 0) {
            this.MuteBGM(_active);
        }

        if (DEFINE.volumeEFFECT != 0) {
            this.MuteEffect(_active);
        }
    }





}
