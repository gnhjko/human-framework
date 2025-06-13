import { _decorator } from 'cc';
const { ccclass, property } = _decorator;

export enum TargetOS {
    ANDROID = "android",
    IOS = "ios",
    MOBILE_WEB = "mobile",
    PC_WEB = "pc",
    PC_WEB_PREVIEW = "pc_preview",
}


export enum TargetPlatform {
    None = "None",
    FaceBook = "FaceBook",
    Samsung = "Samsung",
    GameN = "GameN",
    Local = "Local",
}




//플렛폼이 타입
export enum E_PLATFORM_TYPE {
    LOCAL,
    DEV,
    PRODUCT
}


export class DEFINE {

    public static Version: string = "Ver.0.0.1";

    public static currentPlatFormType: E_PLATFORM_TYPE = E_PLATFORM_TYPE.LOCAL;
    public static CURRENT_PLATFORM: TargetPlatform;
    public static CURRENT_OS: TargetOS;

    public static WIDTH: number = 720;
    public static HEIGHT: number = 1280;

    public static isUseCheat: boolean = false;


    public static volumeBGM: number = 1;
    public static volumeEFFECT: number = 1;
    public static vibration: number = 1;
    public static shadowEffect: number = 0;
   
}


