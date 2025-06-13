import { PREVIEW } from "cc/env";
import * as CryptoJS from "crypto-js";
/**
 * 로컬 저장용 데이터
 */
export interface ISaveData {
    key: string,
    value: any,
}

export interface ILoadData {
    key: string,
    value: any,
}


export enum E_SAVE_KEY {

    KEY_SETTING_SHADOW = "KEY_SETTING_SHADOW",
    KEY_SETTING_VIBRATION = "KEY_SETTING_VIBRATION",
    KEY_SETTING_SOUND = "KEY_SETTING_SOUND",
    KEY_SETTING_SOUND_BGM_VOLUME = "volume_bgm_save_dog",
    KEY_SETTING_SOUND_EFFECT_VOLUME = "volume_effect_save_dog",

    USER_DATA = "USER_DATA",
    TUTORIAL_EXTEND_LINE = "TUTORIAL_EXTEND_LINE",
    TUTORIAL_DRAW_GUIDE = "TUTORIAL_DRAW_GUIDE",
    FREE_SKIN_OPEN_STAGE = "FREE_SKIN_OPEN_STAGE",
}




export class BaseStorageService {
    public isEncrypto: boolean = false;

    public keyPrefix: string = "project_";


    /**
     * 초기 암호화에 따른 키값이 틀려진다 
     */
    public async init(enableEncrypto: boolean, keyPrefix: string) {
        this.isEncrypto = enableEncrypto;
        this.keyPrefix = keyPrefix;
        for (var key in E_SAVE_KEY) {
            let value = E_SAVE_KEY[key]
            E_SAVE_KEY[key] = this.keyPrefix + value
        }
    }


    public loadValue(keys: string[], isLocal?: boolean): Promise<any> {
        return new Promise<any>(async (resolve, reject) => {
            resolve(null);
        });
    };
    public setValues(keys: ISaveData[], isLocal?: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            resolve(false);
        });
    };
    public deleteKey(key: string, isLocal?: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            resolve(false);
        });
    };
    public deleteAll(isLocal?: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            resolve(false);
        });
    };
    public hasKey(key: string, isLocal?: boolean): Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            resolve(false);
        });
    };


    



    //데이터 암호화 Client -> Server
    public setEncrypt(data: any) {

        let crypto: any = CryptoJS["default"];
        let key = crypto.enc.Hex.parse("0123456789abcdef0123456789abcdef");
        let iv = crypto.enc.Hex.parse("abcdef9876543210abcdef9876543210");


        var encrypted = crypto.AES.encrypt(data, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
        encrypted = encrypted.ciphertext.toString(crypto.enc.Base64);

        /* console.log("client request: " + data);
        console.warn("client request encrypted : " + encrypted);
        console.log("-----------------------------------------------------");
        */
        return encrypted;

    }

    //데이터 복호화 Server -> Client
    public setDecrypt(data: any) {
        let crypto: any = CryptoJS["default"];
        let key = crypto.enc.Hex.parse("0123456789abcdef0123456789abcdef");
        let iv = crypto.enc.Hex.parse("abcdef9876543210abcdef9876543210");

        var bytes = crypto.AES.decrypt(data, key, { iv: iv, mode: crypto.mode.CBC, padding: crypto.pad.Pkcs7 });
        var originalText = bytes.toString(crypto.enc.Utf8);

        /*  console.warn("client response : " + data);
         console.warn("client response decrypted : " + originalText);
         console.log("-----------------------------------------------------");
        */
        return originalText;
    }
}

