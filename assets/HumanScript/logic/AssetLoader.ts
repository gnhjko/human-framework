import { assetManager, director, log, resources } from "cc";
import { Util } from "../core/Util";
import { Action1, Action1Or0, int } from "./Define";



export class AssetInfo<T> {
    constructor(public asset: T, public key?: any) { }
}


export interface ReTryData {
    path: string,
    type: int
}

export class AssetLoader {

    private static retryMax: number = 4;

    //scene preload     
    static loadBundle<T>(bundleName: string, targetName: string, assetType?: { new(): T }): Promise<AssetInfo<T>> {
        let promise: Promise<AssetInfo<T>> = new Promise((resolve: Action1<AssetInfo<T>>, reject: Action1Or0<any>) => {

            assetManager.loadBundle(bundleName, (err, bundle) => {
                bundle.load(targetName, assetType as any, (err, asset: any) => {

                    if (err) {
                        resolve(null);
                    } else {
                        resolve(new AssetInfo<T>(asset, targetName));
                    }

                })
            });

        });
        return promise;
    }



    static loadBundleDir(bundleName: string, dirPath: string): Promise<AssetInfo<any>> {
        let promise: Promise<AssetInfo<any>> = new Promise((resolve: Action1<AssetInfo<any>>, reject: Action1Or0<any>) => {

            assetManager.loadBundle(bundleName, (err, bundle) => {

                //경로를 ""할경우 하위 폴더의 모든 에셋이 로드된다 
                //경로를 지정 할경우 해당 폴더내의 모든것들이 로드 된다 
                bundle.loadDir(dirPath, (err: any, asset: any) => {
                    if (err) {
                        resolve(null);
                    } else {
                        resolve(new AssetInfo<any>(asset));
                    }
                })
            });

        });
        return promise;
    }


    /**
     * loadbundle로 대체
     * 다만 스테이지 정보의 경우 번들로 변경할경우 데이터가 모두 포함되므로 제외 
     * @param path 
     * @param assetType 
     */
    //로드 실패시 재로드 : 재로드 실패시 재로드
    static loadAsync<T>(path: string, assetType?: { new(): T }, key?: any): Promise<AssetInfo<T>> {
        let promise: Promise<AssetInfo<T>> = new Promise((resolve: Action1<AssetInfo<T>>, reject: Action1Or0<any>) => {
            if (assetType) {
                resources.load(path, assetType as any, async (err, asset: any) => {
                    if (err) {
                        log(err);
                        log(path);

                        for (let i = 0; i < this.retryMax; i++) {
                            log("re load try count : " + i, path);
                            await Util.delay(1000);

                            let assets = await AssetLoader.reLoadTry(path, assetType);
                            if (assets != null) {
                                log("reload sucess!")
                                resolve(assets);
                                return;
                            }
                        }



                        //로드 실패시 팝업 노출 또는 무시
                        log("reload fail!");
                        // PersistNodeContainer.instance().onSystemMSGPopup("Resources Load Fail!!\nClick To Refresh", () => {
                        //     cc.log("reload fail click")
                        //     location.reload();
                        // });
                        resolve(null);


                    } else {

                        resolve(new AssetInfo<T>(asset, key));
                    }
                })
            } else {
                resources.load(path, async (err, asset: any) => {
                    if (err) {
                        for (let i = 0; i < this.retryMax; i++) {
                            log("re load try count : " + i, path);
                            await Util.delay(1000);

                            let assets = await AssetLoader.reLoadTry(path, assetType);
                            log(assets)
                            if (assets != null) {
                                log("reload sucess!")

                                resolve(assets);
                                return;
                            }
                        }

                        log("reload fail!");
                        resolve(null);
                    } else {
                        resolve(new AssetInfo<T>(asset, key));
                    }
                });
            }

        });
        return promise;
    }

    static reLoadTry<T>(path: string, assetType?: { new(): T }) {
        let promise: Promise<AssetInfo<T>> = new Promise((resolve: Action1<AssetInfo<T>>, reject: Action1Or0<any>) => {
            assetManager.loadAny(path, assetType as any, (err, asset: T) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(new AssetInfo<T>(asset));
                }

            });
        });

        return promise;
    }


   





    //외부 로컬 파일 로드  
    static loadRemote<T>(url: string, ext: string, key: string, assetType?: { new(): T }): Promise<AssetInfo<T>> {
        let promise: Promise<AssetInfo<T>> = new Promise((resolve: Action1<AssetInfo<T>>, reject: Action1Or0<any>) => {

            assetManager.loadRemote(url, { ext: ext }, (err, asset: any) => {
                if (err) {
                    resolve(null);
                } else {
                    resolve(new AssetInfo<T>(asset, key));
                }

            });

        });
        return promise;
    }




    static loadExtenalJson<T>(path: string, key?: any): Promise<AssetInfo<T>> {
        let promise: Promise<AssetInfo<T>> = new Promise((resolve: Action1<AssetInfo<T>>, reject: Action1Or0<any>) => {

            let httpRequest = new XMLHttpRequest();
            httpRequest.open("POST", path + '?nocache=' + new Date().getTime(), true);
            httpRequest.timeout = 60000;// 5 seconds for timeout

            httpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
            httpRequest.send();


            httpRequest.ontimeout = (event: Event) => {
                reject("error");
            }

            httpRequest.onreadystatechange = (event: Event) => {
                if (httpRequest.readyState == 4) {
                    console.log(httpRequest.response);
                    let json = JSON.parse(httpRequest.response);
                    //cc.log(json["ArenaMgr.12"]);
                    resolve(new AssetInfo<T>(json, key));
                }
            }
        });

        return promise;
    }






    //only scene load
    static loadScene(sceneName: string): Promise<void> {
        let promise: Promise<void> = new Promise((resolve: Action1<void>, reject: Action1Or0<any>) => {
            director.loadScene(sceneName, () => {
                log(sceneName + " Scene load Launched");
                resolve();
            })
        });
        return promise;
    }



    static releaseAsset(path: string, type: any) {
        console.log("releaseAsset", path, "우선 배제");
        resources.release(path, type);
    }
}