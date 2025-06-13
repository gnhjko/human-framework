import { sys } from "cc";
import { Action1 } from "../../logic/Define";
import { AD_EVENT_STATE, AD_RESULT } from "../../managers/ADManager";
import { BaseStorageService, ISaveData} from "../storage/IStorageService";
import { IPlatform } from "./IPlatform";



// 플랫폼별 구현
export class LocalPlatform implements IPlatform {
    private storageService: BaseStorageService;

    constructor(storageService: BaseStorageService) {
        this.storageService = storageService;
    }

    public async initPlatform(): Promise<boolean> {
        return new Promise<boolean>((resolve: Action1<boolean>, reject: Action1<string>) => {
            resolve(true);
        });
    }

    public getLocale(): string {
        let locale = navigator.language || navigator['userLanguage'];

        switch (locale) {
            case 'ko':
            case 'ko-KR':
                locale = 'ko';
                break;
            case 'en':
            case 'en-US':
                locale = 'en';
                break;
        }
        return locale;
    }

    // 광고 관련
    public showInterstitial(adType: string): Promise<AD_RESULT> {
        return new Promise<AD_RESULT>((resolve: Action1<AD_RESULT>, reject: Action1<string>) => {
            let result: AD_RESULT = { STATE: AD_EVENT_STATE.VIDEO_COMPLETE_INTERSTITIAL, ERROR_CODE: 0 };
            resolve(result);
        });
    }

    public showRewardedVideo(adType: string): Promise<AD_RESULT> {
        return new Promise<AD_RESULT>((resolve: Action1<AD_RESULT>, reject: Action1<string>) => {
            let result: AD_RESULT = { STATE: AD_EVENT_STATE.VIDEO_COMPLETE_REWARD, ERROR_CODE: 0 };
            resolve(result);
        });
    }

    // 로그 관련
    public logEvent(eventName: string, params?: object): void {
        // 로그 이벤트 구현
    }

    // API 관련
    public login(): Promise<boolean> {
        return new Promise<boolean>((resolve: Action1<boolean>, reject: Action1<string>) => {
            resolve(true);
        });
    }

    // 데이터 관련 - 저장소 서비스 사용
    public async loadData(keys: string[], isLocal: boolean = false): Promise<any> {
        return this.storageService.loadValue(keys, isLocal);
    }

    public async saveData(keys: ISaveData[], isLocal: boolean = false): Promise<boolean> {
        return this.storageService.setValues(keys, isLocal);
    }

    public async removeData(key: string, isLocal: boolean = false): Promise<boolean> {
        return this.storageService.deleteKey(key, isLocal);
    }

    public async clearData(isLocal: boolean = false): Promise<boolean> {
        return this.storageService.deleteAll(isLocal);
    }

    public async hasKey(key: string, isLocal: boolean = false): Promise<boolean> {
        return this.storageService.hasKey(key, isLocal);
    }
}