import { _decorator } from 'cc';
import { DEFINE, TargetPlatform } from '../common/Const_Define';
import { BaseStorageService, ISaveData } from '../platform/storage/IStorageService';
import { LocalStorageService } from '../platform/storage/LocalStorageService';
import { AD_RESULT } from './ADManager';
import { SamsungStorageService } from '../platform/storage/SamsungStorageService';
import { IPlatform } from '../platform/platformProvider/IPlatform';
import { LocalPlatform } from '../platform/platformProvider/LocalPlatform';
import { SamsungPlatform } from '../platform/platformProvider/SamsungPlatform';
const { ccclass, property } = _decorator;


export class PlatformManager implements IPlatform {
    private static _instance: PlatformManager = null;

    public static get Inst(): PlatformManager {
        if (!PlatformManager._instance) {
            PlatformManager._instance = new PlatformManager();
        }

        return PlatformManager._instance;
    }

    private platform: IPlatform;

    private constructor() {

    }



    public getPlatform(): IPlatform {
        return this.platform;
    }




    public async initPlatform(): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            if (DEFINE.CURRENT_PLATFORM === TargetPlatform.Local) {
                // 저장소 서비스 생성 및 주입
                const storageService: BaseStorageService = new LocalStorageService();

                this.platform = new LocalPlatform(storageService);


                await storageService.init(false, 'SAVEPET_');
                await this.platform.initPlatform();

            } else if (DEFINE.CURRENT_PLATFORM === TargetPlatform.Samsung) {
                // 삼성 플랫폼 구현 시 여기에 추가
                const storageService: BaseStorageService = new SamsungStorageService();

                this.platform = new SamsungPlatform(storageService);

                await storageService.init(false, 'SAVEPET_');
                await this.platform.initPlatform();
            }

            resolve(true);
        });
    }


    /**
     * 광고 관련
     * @param adType 
     * @returns 
     */
    public async showInterstitial(adType: string) {
        let isComplete: AD_RESULT = await this.platform.showInterstitial(adType);
        return isComplete;
    }

    /**
     * 리워드 광고 관련
     * @param adType 
     * @returns 
     */
    public async showRewardedVideo(adType: string) {
        let isComplete: AD_RESULT = await this.platform.showRewardedVideo(adType);
        return isComplete;
    }



    /**
     * 현재 언어 반환
     * @returns 
     */
    public getLocale(): string {
        return this.platform.getLocale();
    }


    // 로그 관련
    public logEvent(eventName: string, params?: object): void {
        this.platform.logEvent(eventName, params);
    }





    // 데이터 관련
    public async loadData(keys: string[], isLocal: boolean = false) {
        return await this.platform.loadData(keys, isLocal);
    }

    public async saveData(keys: ISaveData[], isLocal: boolean = false) {
        return await this.platform.saveData(keys, isLocal);
    }

    public async hasKey(key: string, isLocal: boolean = false) {
        return await this.platform.hasKey(key, isLocal);
    }

    public async removeData(key: string, isLocal: boolean = false) {
        return await this.platform.removeData(key, isLocal);
    }

    public async clearData(isLocal: boolean = false) {
        return await this.platform.clearData(isLocal);
    }

}
