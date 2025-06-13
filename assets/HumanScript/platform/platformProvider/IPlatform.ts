

/**
 * 플랫폼 인터페이스
 * 플랫폼 관련 기능을 정의한 인터페이스
 * 플렛폼 추가시 별도 클래스 생성 후 구현
 * 플렛폼 선택은 GameMain.ts에서 선택
 */

import { AD_RESULT } from "../../managers/ADManager";
import { ISaveData } from "../storage/IStorageService";

// 기본 플랫폼 인터페이스 정의
export interface IPlatform {

    initPlatform(): Promise<boolean>;

    getLocale(): string;

    // 광고 관련
    showInterstitial(adType: string): Promise<AD_RESULT>;
    showRewardedVideo(adType: string): Promise<AD_RESULT>;

    // 로그 관련
    logEvent(eventName: string, params?: object): void;

    // 데이터 관련
    loadData(keys: string[], isLocal: boolean): Promise<any>;
    saveData(keys: ISaveData[], isLocal: boolean): Promise<any>;
    removeData(key: string, isLocal: boolean): Promise<any>;
    hasKey(key: string, isLocal: boolean): Promise<boolean>;
    clearData(isLocal: boolean): Promise<boolean>;
}