import { PlatformManager } from "../../managers/PlatformManager";
import { SamsungPlatform } from "../platformProvider/SamsungPlatform";
import { BaseStorageService, ISaveData } from "./IStorageService";

/**
 * 삼성 플랫폼 저장소 구현체
 * isLocal 매개변수에 따라 로컬 저장소 또는 삼성 클라우드 API를 사용합니다.
 */
export class SamsungStorageService extends BaseStorageService {


    private platform: SamsungPlatform = null;

    constructor() {
        super();

    }


    public async init(enableEncrypto: boolean, keyPrefix: string) {
        super.init(enableEncrypto, keyPrefix);
        this.platform = PlatformManager.Inst.getPlatform() as SamsungPlatform;

    }

    async loadValue(keys: string[], isLocal: boolean = false): Promise<any> {
        if (isLocal) {
            // 로컬 저장소에서 데이터 로드
            return this.loadLocalData(keys);
        } else {
            // 삼성 클라우드 API를 사용하여 서버에서 데이터 로드
            return this.loadServerData(keys);
        }
    }

    /**
     * value의 타입 변환은 상위 단계에서 이루어진다 
     * @param keys 
     * @returns 
     */
    private async loadLocalData(keys: string[]): Promise<any> {
        return new Promise(async (resolve, reject) => {
            let result = {};
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i];

                let loadOrignData = localStorage.getItem(key);

                if (loadOrignData) {
                    let value = (this.isEncrypto) ? this.setDecrypt(loadOrignData) : loadOrignData;
                    result[key] = value;
                } else {
                    result[key] = null
                }

            }
            resolve(result);
        });
    }

    private async loadServerData(keys: string[]): Promise<any> {
        // 삼성 클라우드 저장소 API 호출
        try {
            // 예시: 삼성 API 호출 (실제 API는 삼성 문서 참조)
            // const response = await GSInstant.player.getDataAsync(keys);
            // return response;

            // 임시 구현 (실제 구현 시 삼성 API로 대체)
            console.log("삼성 클라우드에서 데이터 로드:", keys);
            return {};
        } catch (error) {
            console.error("서버 데이터 로드 실패:", error);
            return {};
        }
    }

    async setValues(keys: ISaveData[], isLocal: boolean = false): Promise<boolean> {
        if (isLocal) {
            // 로컬 저장소에 데이터 저장
            return this.saveLocalData(keys);
        } else {
            // 삼성 클라우드 API를 사용하여 서버에 데이터 저장
            return this.saveServerData(keys);
        }
    }


    /**
     * value의 타입 변환은 상위 단계에서 이루어진다 
     * @param keys 
     * @returns 
     */
    private async saveLocalData(keys: ISaveData[]): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i].key;
                let value = keys[i].value;

                console.log("value : " + value, this.isEncrypto);
                if (this.isEncrypto) {
                    value = this.setEncrypt(value);
                }

                localStorage.setItem(key, value);
            }
            resolve(true);
        });
    }

    private async saveServerData(keys: ISaveData[]): Promise<boolean> {
        // 삼성 클라우드 저장소 API 호출
        try {
            // 키-값 쌍으로 변환
            const data = {};
            for (let i = 0; i < keys.length; i++) {
                data[keys[i].key] = keys[i].value;
            }

            // 예시: 삼성 API 호출 (실제 API는 삼성 문서 참조)
            // await GSInstant.player.setDataAsync(data);

            // 임시 구현 (실제 구현 시 삼성 API로 대체)
            console.log("삼성 클라우드에 데이터 저장:", data);
            return true;
        } catch (error) {
            console.error("서버 데이터 저장 실패:", error);
            return false;
        }
    }

    async deleteKey(key: string, isLocal: boolean = false): Promise<boolean> {
        if (isLocal) {
            // 로컬 저장소에서 키 삭제
            localStorage.removeItem(key);
            return true;
        } else {
            // 삼성 클라우드 API를 사용하여 서버에서 키 삭제
            try {
                // 예시: 삼성 API 호출 (실제 API는 삼성 문서 참조)
                // await GSInstant.player.deleteDataAsync([key]);

                // 임시 구현 (실제 구현 시 삼성 API로 대체)
                console.log("삼성 클라우드에서 키 삭제:", key);
                return true;
            } catch (error) {
                console.error("서버 데이터 삭제 실패:", error);
                return false;
            }
        }
    }

    async deleteAll(isLocal: boolean = false): Promise<boolean> {
        if (isLocal) {
            // 로컬 저장소 전체 삭제
            localStorage.clear();
            return true;
        } else {
            // 삼성 클라우드 API를 사용하여 서버 데이터 전체 삭제
            try {
                // 예시: 삼성 API 호출 (실제 API는 삼성 문서 참조)
                // 모든 키를 가져온 후 삭제하는 로직이 필요할 수 있음
                // const keys = await this.getAllKeys();
                // await GSInstant.player.deleteDataAsync(keys);

                // 임시 구현 (실제 구현 시 삼성 API로 대체)
                console.log("삼성 클라우드에서 모든 데이터 삭제");
                return true;
            } catch (error) {
                console.error("서버 데이터 전체 삭제 실패:", error);
                return false;
            }
        }
    }

    async hasKey(key: string, isLocal: boolean = false): Promise<boolean> {
        if (isLocal) {
            // 로컬 저장소에서 키 확인
            return localStorage.getItem(key) != null;
        } else {
            // 삼성 클라우드 API를 사용하여 서버에서 키 확인
            try {
                // 예시: 삼성 API 호출 (실제 API는 삼성 문서 참조)
                // const data = await GSInstant.player.getDataAsync([key]);
                // return data[key] !== undefined;

                // 임시 구현 (실제 구현 시 삼성 API로 대체)
                console.log("삼성 클라우드에서 키 확인:", key);
                return false;
            } catch (error) {
                console.error("서버 데이터 키 확인 실패:", error);
                return false;
            }
        }
    }
}
