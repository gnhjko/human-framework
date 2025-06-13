import * as CryptoJS from "crypto-js";
import { ResponseBase } from "./Request";
import { Action1 } from "../logic/Define";
import { PostRequest } from "./PostRequest";
import { StringUtil } from "../core/Util";
import { ConnectManager } from "../managers/ConnectManager";

export class SimpleRequest {
    static readonly instance = new SimpleRequest();
}


export enum HTTP_STATUS {
    FAIL = 0, //페이지없음
    OK = 200, //요청 성공
    FORBIDDEN = 403, //접근 거부
    NOT_FOUND = 404, //페이지 없음
    INTERNAL_SERVER_ERROR = 500, //서버 오류 발생
}


export class PacketBase<RequestType, ResponseType extends ResponseBase> {
    static readonly GET: string = "GET";
    static readonly POST: string = "POST";

    static jsonWebToken: string;


    private packetName: string;
    private method: string;
    private httpRequest: XMLHttpRequest;
    private requestBody: RequestType;
    private requestJson: string;
    private responseBody: ResponseType;
    private responseCallback?: (response: ResponseType) => void;

    private promise: Promise<ResponseType>;
    private resolveFunc: Action1<ResponseType>;
    private errorCount = 0;

    static anyPanel: any;

    private isEncrypt: boolean = false;
    private key: string = "";
    private iv: string = "";


    protected constructor(exports_: any, requestBody: RequestType, method?: "GET" | "POST");
    protected constructor(packetName: string, requestBody: RequestType, method?: "GET" | "POST");
    protected constructor(responseBody: ResponseType);
    protected constructor(arg0: any, requestBody?: any, method?: "GET" | "POST") {

        this.packetName = arg0;
        this.method = method || PacketBase.POST;
        this.requestBody = requestBody!;


        this.packetName = requestBody.flag
        let crypto: any = CryptoJS['default']
        this.key = crypto.enc.Hex.parse("0123456789abcdef0123456789abcdef");
        this.iv = crypto.enc.Hex.parse("abcdef9876543210abcdef9876543210");

        if (this.isEncrypt) {
            this.requestJson = "myObject=" + this.setEncryptBody(requestBody);
        } else {
            this.requestJson = "myObject=" + JSON.stringify(requestBody);
        }
    }

    private debugLog(...args: any[]) {
        console.log(...args);
    }

    //패킷의 종류에따라 URL이 틀려진다
    private makeHostURI(): string {
        // TODO GET method uri making
        let host: string = "";
        host = ConnectManager.ACT_URL;
        return host;
    }

    get request(): RequestType {
        return this.requestBody;
    }

    get response(): ResponseType {
        return this.responseBody;
    }

    async send(receiveCallback?: (response: ResponseType) => void): Promise<ResponseType> {

        this.debugLog(`http request(${this.packetName}):  ${JSON.stringify(this.requestBody)}`);


        let self: PacketBase<RequestType, ResponseType> = this;
        this.responseCallback = receiveCallback;

        this.debugLog(`URI : ${this.makeHostURI()}`);

        this.httpRequest = new XMLHttpRequest();
        this.httpRequest.open(this.method, this.makeHostURI() + '?nocache=' + new Date().getTime(), true);
        this.httpRequest.timeout = 60000;// 5 seconds for timeout
        //해당 패킷만 폼데이터로 보내야 한다 
        if (this.packetName == "new_user_db" || this.packetName == "save_user_db") {
            let postRequest = new PostRequest();

            for (const key in this.requestBody) {
                postRequest.addFormData(key, this.requestBody[key]);
            }

            this.httpRequest.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + postRequest._main_boundary);
            let data = postRequest.getPostData();
            this.httpRequest.send(data);

        } else {

            this.httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            this.httpRequest.send(this.requestJson);
        }

        this.httpRequest.ontimeout = function (this: XMLHttpRequest, event: Event) {
            self.httpRequestTimeout(this, event);
        }

        this.httpRequest.onreadystatechange = function (this: XMLHttpRequest, event: Event) {
            self.httpRequestStateChanged(this, event);
        }

        this.httpRequest.onerror = function () {
            self.onError();
        }



        if (!this.promise) {
            this.promise = new Promise((resolve: Action1<ResponseType>, reject: (reason?: any) => void) => { this.resolveFunc = resolve; });
        }


        return this.promise;
    }



    private async httpRequestStateChanged(req: XMLHttpRequest, event: Event) {

        if (this.httpRequest.readyState == 4) {
            if (this.httpRequest.status === HTTP_STATUS.OK) {


                try {
                    if (this.isEncrypt) {
                        let decryptBody = this.setDecryptBody(this.httpRequest.response);
                        this.responseBody = JSON.parse(decryptBody) as ResponseType;
                    } else {
                        this.responseBody = JSON.parse(this.httpRequest.response) as ResponseType;
                    }
                    this.debugLog(`http response(${this.packetName}) body:  ${JSON.stringify(this.responseBody)}`);

                    this.onResponse(this.responseBody);
                    this.responseCallback && this.responseCallback(this.responseBody);

                    this.resolveFunc(this.responseBody);


                } catch (e) {
                    console.log(e.toString());
                }

            } else {
                console.log("packet error. code: " + this.httpRequest.status.toString());


            }
        }
    }

    protected httpRequestTimeout(req: XMLHttpRequest, event: Event) {
        console.log("time out");
    }


    protected onResponse(response: ResponseType): void { }

    protected onError(): void {
        console.log("request onError");
    }


    protected setEncryptBody(value) {
        let crypto: any = CryptoJS['default'];
        let encrypted = crypto.AES.encrypt(JSON.stringify(value), this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
        // this.debugLog(`http request encrypt (${this.packetName}):  ${encrypted}`);
        return encrypted;
    }

    protected setDecryptBody(value) {
        //this.debugLog(`http response encrypt (${this.packetName}):  ${value}`);

        let originalText = "";

        let crypto: any = CryptoJS['default'];
        let bytes = crypto.AES.decrypt(value, this.key, { iv: this.iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.ZeroPadding });
        originalText = bytes.toString(CryptoJS.enc.Utf8);

        return originalText;
    }

}