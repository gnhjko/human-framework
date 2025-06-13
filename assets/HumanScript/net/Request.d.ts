
type Permission = "Super" | "UserManage" | "LogView" | "MessageManage" | "EventManage" | "ServerManage" | "ShopManage" | "AdminManage" | "Developer";
type UserResultCode = "internalServerError" | "OK" | "duplicateId" | "deletedId" | "wrongId" | "wrongIp" | "noPermission" | "notReady" | "unpaid" | 'userBlocked' | 'serverBlocked';

type GameRequestType = "UpLoad" | "Act";

export interface UserBanStatus {
    id: string;
    startDtm: number;
    utilDtm: number;
    reason: string;
}


export interface RequestBase {
    fcode: string;
    flag?: string;
    proc?: string;
}


export interface ResponseInfo {
    flag: string;
    errcode: string;
}

export interface ResponseBase {
    tagAlongResponse?: boolean;                  // for runtime type checking
    __ta?: { [pakcetName: string]: any };         // tag along packet
    __mt?: boolean;                              // server maintenance
    __ban?: UserBanStatus;
    info: ResponseInfo,
    result: any,
}






export interface GameInfoRequest extends RequestBase {
    custno: string;
    fcode: string;

}


//추후 타입 정의 
export interface GameInfoResponse extends ResponseBase {
    user_info: any;
}

