import { PlatformManager } from "../../managers/PlatformManager";
import { LocalPlatform } from "../platformProvider/LocalPlatform";
import { BaseStorageService, ISaveData } from "./IStorageService";



/**
 * 로컬 저장소 구현체
 * localStorage를 사용하여 데이터를 저장하고 로드합니다.
 * value의 타입 변환은 상위 단계에서 이루어진다 
 */
export class LocalStorageService extends BaseStorageService {



    private platform: LocalPlatform = null;

    constructor() {
        super();
    
    }



    public async init(enableEncrypto: boolean, keyPrefix: string) {
        super.init(enableEncrypto, keyPrefix);

        this.platform = PlatformManager.Inst.getPlatform() as LocalPlatform;
    }

    async loadValue(keys: string[], isLocal: boolean = false): Promise<any> {
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


    /**
     * value의 타입 변환은 상위 단계에서 이루어진다 
     * @param keys 
     * @param isLocal 
     * @returns 
     */
    async setValues(keys: ISaveData[], isLocal: boolean = false): Promise<boolean> {
        return new Promise(async (resolve, reject) => {
            for (let i = 0; i < keys.length; i++) {
                let key = keys[i].key;
                let value = keys[i].value;

                console.log("value : " + value, this.isEncrypto);
                if (value != "" && this.isEncrypto) {
                    value = this.setEncrypt(value);
                }

                localStorage.setItem(key, value);
            }
            resolve(true);
        });
    }

    async deleteKey(key: string, isLocal: boolean = false): Promise<boolean> {
        localStorage.removeItem(key);
        return true;
    }

    async deleteAll(isLocal: boolean = false): Promise<boolean> {
        localStorage.clear();
        return true;
    }

    async hasKey(key: string, isLocal: boolean = false): Promise<boolean> {
        return localStorage.getItem(key) != null;
    }
}
