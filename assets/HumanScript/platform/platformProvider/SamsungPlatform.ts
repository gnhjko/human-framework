import { sys } from "cc";
import { Action1 } from "../../logic/Define";
import { AD_EVENT_STATE, AD_RESULT } from "../../managers/ADManager";
import { IPlatform } from "./IPlatform";
import { BaseStorageService, ISaveData } from "../storage/IStorageService";

/**
 * 삼성 플랫폼 구현체
 * 삼성 게임 서비스(GSInstant)를 활용한 플랫폼 구현
 */
export class SamsungPlatform implements IPlatform {
    private storageService: BaseStorageService;

    constructor(storageService: BaseStorageService) {
        this.storageService = storageService;
    }

    public async initPlatform(): Promise<boolean> {
        return new Promise<boolean>((resolve: Action1<boolean>, reject: Action1<string>) => {
            try {
                // 삼성 플랫폼 초기화 코드
                // 실제 구현 시 삼성 문서 참조하여 GSInstant API 호출
                console.log("삼성 플랫폼 초기화");
                resolve(true);
            } catch (error) {
                console.error("삼성 플랫폼 초기화 실패:", error);
                resolve(false);
            }
        });
    }

    public getLocale(): string {
        try {
            // 삼성 플랫폼에서 로케일 가져오기
            // 실제 구현 시 GSInstant.getLocale() 등의 API 사용
            // const locale = GSInstant.getLocale();

            // 임시 구현
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
        } catch (error) {
            console.error("로케일 가져오기 실패:", error);
            return 'en'; // 기본값
        }
    }

    // 광고 관련
    public showInterstitial(adType: string): Promise<AD_RESULT> {
        return new Promise<AD_RESULT>((resolve: Action1<AD_RESULT>, reject: Action1<string>) => {
            try {
                // 삼성 플랫폼 전면 광고 표시
                // 실제 구현 시 GSInstant.showInterstitialAd() 등의 API 사용
                console.log("삼성 플랫폼 전면 광고 표시:", adType);

                // 임시 구현
                setTimeout(() => {
                    let result: AD_RESULT = { STATE: AD_EVENT_STATE.VIDEO_COMPLETE_INTERSTITIAL, ERROR_CODE: 0 };
                    resolve(result);
                }, 1000);
            } catch (error) {
                console.error("전면 광고 표시 실패:", error);
                let result: AD_RESULT = { STATE: AD_EVENT_STATE.AD_ERROR, ERROR_CODE: 1 };
                resolve(result);
            }
        });
    }

    public showRewardedVideo(adType: string): Promise<AD_RESULT> {
        return new Promise<AD_RESULT>((resolve: Action1<AD_RESULT>, reject: Action1<string>) => {
            try {
                // 삼성 플랫폼 리워드 광고 표시
                // 실제 구현 시 GSInstant.showRewardedVideo() 등의 API 사용
                console.log("삼성 플랫폼 리워드 광고 표시:", adType);

                // 임시 구현
                setTimeout(() => {
                    let result: AD_RESULT = { STATE: AD_EVENT_STATE.VIDEO_COMPLETE_REWARD, ERROR_CODE: 0 };
                    resolve(result);
                }, 1000);
            } catch (error) {
                console.error("리워드 광고 표시 실패:", error);
                let result: AD_RESULT = { STATE: AD_EVENT_STATE.AD_ERROR, ERROR_CODE: 1 };
                resolve(result);
            }
        });
    }

    // 로그 관련
    public logEvent(eventName: string, params?: object): void {
        try {
            // 삼성 플랫폼 로그 이벤트 전송
            // 실제 구현 시 GSInstant.logEvent() 등의 API 사용
            console.log("삼성 플랫폼 로그 이벤트 전송:", eventName, params);
        } catch (error) {
            console.error("로그 이벤트 전송 실패:", error);
        }
    }

    // API 관련
    public login(): Promise<boolean> {
        return new Promise<boolean>((resolve: Action1<boolean>, reject: Action1<string>) => {
            try {
                // 삼성 플랫폼 로그인
                // 실제 구현 시 GSInstant.login() 등의 API 사용
                console.log("삼성 플랫폼 로그인");
                resolve(true);
            } catch (error) {
                console.error("로그인 실패:", error);
                resolve(false);
            }
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
