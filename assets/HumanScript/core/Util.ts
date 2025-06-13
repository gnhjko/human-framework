//import { Coroutine, CoroutineValidator, CoroutineManager, WaitForSeconds } from "../HumanScript/logic/CoroutineManager";
import { Time } from "./Time";
import { TimeSpan } from "./TimeSpan";
import { Animation, Camera, Color, Component, director, EventHandler, js, Node, Sprite, SpriteFrame, sys, TextAsset, Texture2D, UIOpacity, UITransform, Vec2, Vec3 } from "cc";
import { Action0, Action1, Action2, Func0, Func1, Func2 } from "../logic/Define";
import { PersistNodeContainer } from "../logic/PersistNodeContainer";
import { AssetLoader } from "../logic/AssetLoader";
import { tween } from "cc";
import { Coroutine, CoroutineManager, CoroutineValidator, WaitForSeconds } from "../managers/CoroutineManager";




type NodeColorBackupMap = { [name: string]: Color }

export interface RollUpOption {
    decimalPoint?: number;
    easeFunc?: Func1<number, number>;
    finishCallback?: Action0;
}

export class Pair<K, V> {
    constructor(public key: K, public value: V) { }
}


export class MyMath {

    static MAX_VALUE = Number.MAX_VALUE || 9007199254740991;
    static MAX_SAFE_INTEGER = Number.MAX_SAFE_INTEGER || 9007199254740991;
    static MIN_SAFE_INTEGER = Number.MIN_SAFE_INTEGER || -9007199254740991;
    static NEGATIVE_INFINITY = Number.NEGATIVE_INFINITY || -9007199254740991;

    static Epsilon = 0;

    static Deg2Rad: number = (Math.PI * 2) / 360
    static Rad2Deg: number = (360 / (Math.PI * 2))

    static clamp(value: number, min: number = 0, max: number = 1): number {
        return Math.min(max, Math.max(min, value));
    }

    static clamp01(value: number): number {
        let result: number = 0;
        if (value <= 0) {
            result = 0
        } else if (value >= 1) {
            result = 1
        } else {
            result = value;
        }
        return result;
    }

    static lerp(min: number, max: number, ratio: number): number {
        return min * (1 - ratio) + max * ratio;
    }

    static lerpVector2(min: Vec2, max: Vec2, ratio: number,): Vec2 {
        return new Vec2(this.lerp(min.x, max.x, ratio), MyMath.lerp(min.y, max.y, ratio));
    }

    // [min, max] in Z-space
    static randomRangeIntMaxInclusive(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // [min, max) in Z-space
    static randomRangeInt(min: number, max: number): number {
        return Math.floor(Math.random() * (max - min)) + min;
    }

    // [min, max) in R-space
    static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    static weighted_random(_weights: number[]): number {
        let r = this.randomRangeInt(1, this.arrayReduceSum(_weights));
        for (let i = 0; i < _weights.length; i++) {
            r -= _weights[i];
            if (r < 1) return i;
        }
    }

    /**
     * 배열 합산
     * @param arr 
     * @returns 
     */
    static arrayReduceSum(arr: number[]) {
        let sum = 0;
        arr.forEach(element => {
            sum += element
        });

        return sum
    }


    /**
     * 점과 점사이의 거리
     * @param point1 
     * @param point2 
     * @returns 
     */
    static distance(point1: Vec2 | Vec3, point2: Vec2 | Vec3) {

        let x1 = point1.x
        let x2 = point2.x

        let y1 = point1.y
        let y2 = point2.y
        let deltaX = this.diff(x1, x2);
        let deltaY = this.diff(y1, y2);
        let dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        return (dist);
    };


    private static diff(num1: number, num2: number) {
        if (num1 > num2) {
            return (num1 - num2);
        } else {
            return (num2 - num1);
        }
    };


    /**
     * 소수점 반올림을 설정 할수 있다 
     * @param num 
     * @param scale 
     * @returns 
     * roundNumber(1.125,2) = 1.13
     * roundNumber(1.124,2) = 1.12
     */
    static roundNumber(num: number, scale: number) {
        let s = parseInt("1" + StringUtil.repeat("0", scale));
        return Math.round(num * s + Number.EPSILON) / s
    }


    /**
     * 숫자 검증기
     * @param s 
     * @returns 
     */
    static isNumeric(s: any) {
        if (typeof s === "number" || s instanceof Number) {
            return true;
        } else {
            return false;
        }
    }







}

export class Util {

    static persistNodeChange(target: Node): Node {
        let rootNode: any = director.getScene();
        let persistNode = PersistNodeContainer.Inst.node;
        target.parent = persistNode;

        return persistNode;
    }

    /**
     * 외부 스크립트 로드 
     * @param url 
     * @returns 
     */
    static loadScript(url: string): Promise<void> {
        return new Promise<void>((resolve: Action0, reject: Action1<string>) => {
            if (sys.isBrowser) {
                let script = document.createElement("script") as HTMLScriptElement;
                script.type = "text/javascript";
                script.onload = () => resolve();
                script.src = url;
                script.async = true;
                document.getElementsByTagName("head")[0].appendChild(script);
            } else {
                resolve();
            }
        });
    }





    /**
     * 부모 노드 이름
     * @param me 
     * @param parentName 
     * @returns 
     */
    static getParentNodeByName(me: Node, parentName: string): Node | undefined {
        while (me && me.name !== parentName) me = me.parent;

        return me;
    }


    /**
     * 부모 노드 컴포넌트 
     * @param me 
     * @param type 
     * @returns 
     */
    static getComponentInParent<T extends Component>(me: Node, type: any): T | undefined {
        while (me.parent) {
            me = me.parent;
            let comp = me.getComponent<T>(type) as T;

            if (comp) return comp;
        }

        return undefined;
    }


    /**
     * 동기 처리 
     * @param promise 
     * @param then 
     */
    static ensurePromise<T>(promise: Promise<T>, then: Action1<T>) {
        promise.then(then)
            .catch((reason: Action1<any>) => {
                //Global.onError(reason);
            });
    }

    /**
     * 애니메이션 종료 이벤트 
     * @param animation 
     * @returns 
     */
    static getPromiseForAnimationFinish(animation: Animation, animationEventType: Animation.EventType): Promise<void> {
        return new Promise<void>((resolve: Action1<void>) => {
            animation.once(animationEventType, resolve, this);
        });
    }



    static getAnimationClipNameEndsWith(animation: Animation, postFix: string) {
        return animation.clips.map(clip => clip.name).find(cName => cName.toLowerCase().endsWith(postFix));
    }

    //http://stackoverflow.com/questions/18082/validate-decimal-numbers-in-javascript-isnumeric
    static isNumeric(value?: any) {
        return !isNaN(parseFloat(value)) && isFinite(value);
    }



    // like Array.map()
    static objectMap<T>(obj: any, callbackfn: (key: string, value: any) => T): T[] {
        let array: T[] = [];
        for (let key in obj) {
            let value = obj[key];
            array.push(callbackfn(key, value));
        }

        return array;
    }

    // like Array.forEach()
    static objectForEach<V>(obj: { [key: string]: V }, callbackfn: Action2<string | number, V>) {
        for (let key in obj) {
            let value = obj[key];
            callbackfn(key, value);
        }
    }


    // like Array.filter()
    static objectFilter<V>(obj: { [id: string]: V }, callbackfn: (key: string, value: V) => boolean): Pair<string, V>[] {
        let array: Pair<string, V>[] = [];
        for (let key in obj) {
            let value = obj[key];
            if (callbackfn(key, value)) {
                array.push(new Pair(key, value));
            }
        }

        return array;
    }



    /**
     * export enum E_OBSTACLE_TYPE {
     *   Obstacle_Hammer = 1001,
     *   Obstacle_Knife = 1002
     * }
     * console.log(makeEnum(E_OBSTACLE_TYPE))
     * [
     *   {key: "Obstacle_Hammer", value: 1001...},
     *   {key: "Obstacle_Knife", value: 1002}
     * ]
     *  
     * @param enumObject 
     * @returns 
     */
    static convertEnumToArray(enumObject) {
        var all = [];
        for (var key in enumObject) {
            let enumKey = enumObject[key]
            all.push({ key: enumObject[enumKey], value: enumObject[key] });
        }
        return all;
    }



    static getPanelNameByContext(panelContextOrContextName: string | { new(): any }) {
        let panelName: string;
        if (typeof panelContextOrContextName !== "string") {
            panelName = js.getClassName(panelContextOrContextName);
        } else {
            panelName = panelContextOrContextName;
        }

        return panelName.substring(0, panelName.length - 7);    // remove last "Context"
    }


    /**
     * 객체 복사 
     * @param originalObject 
     * @param circular 
     * @returns 
     */
    static clone<T>(originalObject: T, circular?: boolean): T {
        // First create an empty object with
        // same prototype of our original source
        if (originalObject === null || originalObject === undefined) { return originalObject; }

        let propertyIndex: number,
            descriptor: PropertyDescriptor,
            keys: string[],
            current: { source: any, target: any } | undefined,
            nextSource: any,
            indexOf: number,
            copies = [{
                source: originalObject,
                target: Array.isArray(originalObject) ? [] : Object.create(Object.getPrototypeOf(originalObject))
            }],
            cloneObject = copies[0].target,
            sourceReferences = [originalObject],
            targetReferences = [cloneObject];

        // First in, first out
        while (current = copies.shift()) {
            keys = Object.getOwnPropertyNames(current.source);

            for (propertyIndex = 0; propertyIndex < keys.length; propertyIndex++) {
                // Save the source's descriptor
                descriptor = Object.getOwnPropertyDescriptor(current.source, keys[propertyIndex])!;

                if (!descriptor.value || typeof descriptor.value !== "object") {
                    Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                    continue;
                }

                nextSource = descriptor.value;
                descriptor.value = Array.isArray(nextSource) ? [] : Object.create(Object.getPrototypeOf(nextSource));

                if (circular) {
                    indexOf = sourceReferences.indexOf(nextSource);

                    if (indexOf !== -1) {
                        // The source is already referenced, just assign reference
                        descriptor.value = targetReferences[indexOf];
                        Object.defineProperty(current.target, keys[propertyIndex], descriptor);
                        continue;
                    }

                    sourceReferences.push(nextSource);
                    targetReferences.push(descriptor.value);
                }

                Object.defineProperty(current.target, keys[propertyIndex], descriptor);

                copies.push({ source: nextSource, target: descriptor.value });
            }
        }

        return cloneObject;
    }


    /**
     * 3D Object Follow 2D UI
     * @param cam 
     * @param obj2D 
     * @param obj3D 
     * @param offset 
     */
    static follow2DUI(cam: Camera, obj2D: Node, obj3D: Node, smooth: boolean = false, offset?: Vec3) {
        let _v3_0: Vec3 = new Vec3();
        obj3D.getWorldPosition(_v3_0);
        cam.convertToUINode(_v3_0, obj2D.parent, _v3_0);

        let aa = new Vec3();

        if (smooth) {
            if (offset != undefined) {
                Vec3.lerp(aa, obj2D.position, _v3_0.clone().add(offset), Time.deltaTime * 10)
            } else {
                Vec3.lerp(aa, obj2D.position, _v3_0, Time.deltaTime * 10)
            }

            obj2D.setPosition(aa);;
        } else {
            if (offset != undefined) {
                obj2D.setPosition(_v3_0.clone().add(offset));
            } else {
                obj2D.setPosition(_v3_0);

            }
        }
    }




    /**
     * 자식 노드의 위치를 월드 좌표로 변환해준다 
     * @param node canvas 
     * @param target child
     * @returns 
     */
    static getRelativeCoordinate(canvasNode: Node, targetNode: Node) {
        var pos1 = this.getWorldPosition(canvasNode.getComponent(UITransform));
        var pos2 = this.getWorldPosition(targetNode.getComponent(UITransform));
        return new Vec3(pos2.x - pos1.x, pos2.y - pos1.y);
    }


    static getRelativeCoordinatePoint(canvasNode: Node, worldPoint: Vec2) {
        return canvasNode.getComponent(UITransform).convertToNodeSpaceAR(new Vec3(worldPoint.x, worldPoint.y));
    }


    private static getWorldPosition(node: UITransform) {
        return node.convertToWorldSpaceAR(new Vec3(0, 0));
    }


    static fade(type: "in" | "out", duration: number, node: Node, validator: CoroutineValidator): Coroutine {
        return CoroutineManager.startCoroutine(this.fadeCoroutine(type, duration, node), validator);
    }

    private static *fadeCoroutine(type: "in" | "out", duration: number, node: Node) {
        let startA = type === "in" ? 0 : 255, endA = 255 - startA;
        let opacity = node.getComponent(UIOpacity);
        if (opacity) {
            yield this.rollUpNumber(null, duration, startA, endA, o => opacity.opacity = o);
        }
    }

    static blinkNode(duration: number, node: Node, validator: CoroutineValidator, fadeIn = true): Coroutine {
        return CoroutineManager.startCoroutine(this.blinkNodeCoroutine(duration, node, fadeIn), validator);
    }


    private static *blinkNodeCoroutine(duration: number, node: Node, fadeIn: boolean) {
        let startA = fadeIn ? 0 : 255, endA = fadeIn ? 255 : 0;
        let opacity = node.getComponent(UIOpacity);
        if (opacity) {
            yield this.rollUpNumber(null, duration / 2, startA, endA, (v) => { opacity.opacity = v; });
            yield this.rollUpNumber(null, duration / 2, endA, startA, (v) => { opacity.opacity = v; });
        }
    }


    /**
     * 일정 플레그 수신 이벤트 동기 
     * @param checkFunc 
     * @param executor 
     * @returns 
     */
    static waitForSignal(checkFunc: Func0<boolean>, executor: Component | null = null): Coroutine {
        return CoroutineManager.startCoroutine(this.waitForSignalCoroutine(checkFunc), executor);
    }

    private static *waitForSignalCoroutine<R>(checkFunc: Func0<boolean>): any {
        while (!checkFunc()) { yield; }
    }


    /**
     * Async To yield 
     * @param promise 
     * @param executor 
     * @returns 
     */
    static waitForPromise<T>(promise: Promise<T>, executor: Component | null = null): Coroutine {
        return CoroutineManager.startCoroutine(this.waitForPromiseCoroutine(promise), executor);
    }

    private static *waitForPromiseCoroutine<T>(promise: Promise<T>): any {
        let done = false;
        let ret: T | undefined;

        this.ensurePromise(promise, (v: T) => { ret = v; done = true; });
        while (!done) { yield; }
        return ret!;
    }


    /**
     * 애니메이션 동기 콜백
     * @param animation 애니메이션
     * @param animationEventType 애니메이션 종료후 이벤트 타입
     * @param onFinish 콜백
     * @param executor 코루틴
     * @returns 
     */
    static waitForAnimation(animation: Animation | Node, animationEventType: Animation.EventType, onFinish?: Action0, executor: Component | null = null): Coroutine {
        let _animation: Animation;

        if (animation instanceof Animation) {
            _animation = animation;
        } else {
            _animation = animation.getComponent(Animation);

            if (!_animation) {
                throw `node has not animation component. node name= ${animation.name}`;
            }
        }
        return CoroutineManager.startCoroutine(this.waitForAnimationCoroutine(_animation, animationEventType, onFinish), executor);
    }

    private static *waitForAnimationCoroutine(animation: Animation, animationEventType: Animation.EventType, finishCallback?: Action0) {
        let promise = this.getPromiseForAnimationFinish(animation, animationEventType);
        yield this.waitForPromiseCoroutine(promise);

        finishCallback && finishCallback();
    }

    /**
     * 다중 코루틴 동기 처리 콜백
     * @param coroutines 다중 코루틴
     * @param onFinish 종료 콜백
     * @param executor 코루틴 실행자
     * @returns 
     */
    static waitForCoroutines(coroutines: Coroutine[], onFinish?: Action0, executor: Component | null = null): Coroutine {
        return CoroutineManager.startCoroutine(this.waitForCoroutineCoroutine(coroutines, onFinish), executor);
    }

    private static *waitForCoroutineCoroutine(coroutines: Coroutine[], finishCallback?: Action0): any {
        while (coroutines.find(coroutine => !coroutine.done)) yield;

        finishCallback && finishCallback();
    }


    /**
     * 일정 시간 이후 콜백 실행 
     * @param seconds 
     * @param action 
     * @param executor 
     * @returns 
     */
    static delayedAction(seconds: number, action: Action0, executor: CoroutineValidator = null): Coroutine {
        return CoroutineManager.startCoroutine(this.delayedActionCoroutine(seconds, action), executor);
    }

    private static *delayedActionCoroutine(seconds: number, action: () => void) {
        yield new WaitForSeconds(seconds);

        action();
    }

    /**
     * 코로틴 롤 넘버 업데이트 
     * @param validator 
     * @param duration 
     * @param start 
     * @param end 
     * @param applyFunc 
     * @param option 
     * @returns 
     */
    static rollUpNumber(validator: CoroutineValidator, duration: number, start: number, end: number, applyFunc: Action1<number>, option?: RollUpOption): Coroutine {
        let decimalPoint = (option && option.decimalPoint) ? option.decimalPoint : 2;
        return CoroutineManager.startCoroutine(this._rollUpCoroutine(duration, start, end, (v) => {
            let shifter = Math.pow(10, decimalPoint);
            v = Math.floor(v * shifter) / shifter;
            applyFunc(v);
        }, option), validator);
    }

    /**
     * 코루틴 벡터 업데이트 
     * @param validator 
     * @param duration 
     * @param start 
     * @param end 
     * @param applyFunc 
     * @param option 
     * @returns 
     */
    static rollUpVec2(validator: CoroutineValidator, duration: number, start: Vec2, end: Vec2, applyFunc: Action1<Vec2>, option?: RollUpOption): Coroutine {
        return CoroutineManager.startCoroutine(this._rollUpCoroutine(duration, 0, 1, r => {
            let v: Vec2 = start.lerp(end, r);
            applyFunc(v);

        }, option), validator);
    }

    static *_rollUpCoroutine(duration: number, from: number, to: number, applyFunc: Action1<number>, option?: RollUpOption): any {
        let elapsedTime = -Time.deltaTime;

        while (elapsedTime <= duration) {
            elapsedTime += Time.deltaTime;
            let ratio = duration === 0 ? 1 : MyMath.clamp(elapsedTime / duration);
            if (option && option.easeFunc) { ratio = option.easeFunc(ratio); }
            let value = MyMath.lerp(from, to, ratio);
            applyFunc(value);

            yield;
        }

        option && option.finishCallback && option.finishCallback();
    }


    /**
     * Async 딜레이 
     * @param ms 
     * @returns 
     */
    static delay(ms: number) {
        return new Promise(function (resolve) {
            setTimeout(resolve, ms);
        });
    }




    /**
     * 외부 스크립트 포함
     * @param url 
     * @param callback 
     */
    static includeJS(url: string) {
        return new Promise<boolean>(async (resolve: Action1<boolean>, reject: Action1<string>) => {
            var head = document.getElementsByTagName('head')[0];
            var body = document.getElementsByTagName('head')[0];
            var script = document.createElement('script');

            script.type = 'text/javascript';

            script.src = url;
            script.async = true;
            script.onload = () => {
                resolve(true);
            };
            body.appendChild(script);
        });
    }



    static webCopyString(str: string) {
        if (!sys.isBrowser) return "";


        var input = str + '';
        const el = document.createElement('textarea');
        el.value = input;
        el.setAttribute('readonly', '');
        el.style.contain = 'strict';
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        el.style.fontSize = '12pt'; // Prevent zooming on iOS

        const selection = getSelection();
        var originalRange: any = false;
        if (selection.rangeCount > 0) {
            originalRange = selection.getRangeAt(0);
        }
        document.body.appendChild(el);
        el.select();
        el.selectionStart = 0;
        el.selectionEnd = input.length;

        var success = false;
        try {
            success = document.execCommand('copy');
        } catch (err) { }

        document.body.removeChild(el);

        if (originalRange) {
            selection.removeAllRanges();
            selection.addRange(originalRange);
        }

        console.log("Copy ", str);

        return success;
    }






    /**
  * 파일 생성 및 다운로드 해준다 
  * @param fileName 
  * @param content 
  */
    static saveToFile_Chrome(fileName: string, content: string) {
        var blob = new Blob([content], { type: 'text/plain' });
        let objURL = window.URL.createObjectURL(blob);

        // 이전에 생성된 메모리 해제
        if (window['__Xr_objURL_forCreatingFile__']) {
            window.URL.revokeObjectURL(window['__Xr_objURL_forCreatingFile__']);
        }
        window['__Xr_objURL_forCreatingFile__'] = objURL;
        var a = document.createElement('a');
        a.download = fileName;
        a.href = objURL;
        a.click();
    }



    /**
    * 외부 로컬 텍스트 파일을 로드해준다 
    * 로컬호스트는 보안상 안되는 경우가 존재함 
    * @param extension 
    * @param type 
    * @returns 
    */
    static localToFile_Chrome(extension: string = ".txt", type: string = "text"): Promise<string[]> {
        return new Promise(async (resolve, reject) => {
            let input = document.createElement('input');
            input.type = 'file';
            input.accept = "*";
            input.setAttribute("multiple", "multiple")
            input.onchange = (e: any) => {
                if (input.files.length < 1) {
                    return;
                }

                const files = input.files;
                console.log(files);
                let loadFile: string[] = [];
                for (let i = 0; i < files.length; i++) {
                    const file = files[i];
                    const reader = new FileReader();

                    reader.onload = async (e) => {
                        const fileData = e.target.result.toString();
                        // 파일 내 텍스트를 이용하여 원하는 작업 수행

                        let loadAsset = await AssetLoader.loadRemote<TextAsset>(fileData, extension, type)
                        loadFile.push(loadAsset.asset.toString());
                        console.log(loadAsset.asset.toString())
                        if (i == files.length - 1) {
                            resolve(loadFile);
                        }
                    };

                    reader.readAsDataURL(file);
                }


            }
            input.click();
        });
    }


    static getCookie(_name: string) {
        var values = document.cookie.split(";");
        for (var i = 0; i < values.length; i++) {
            var unit = values[i].trim();
            var value = unit.split('=');
            if (value[0] == _name) {
                return encodeURIComponent(value[1]);
            }
        }
        return null;
    }



    /** *
   * 
   *  @param target 
   *  @param {number} duration 
   *  @param {} c1 시작 위치
   *  @param {} c2 중간 위치
   *  @param {Vec3} to 도착 위치
   *  @param opts * @returns {any} 
   * */
    public static bezierTo(target: any, duration: number, c1: Vec3, c2: Vec3, c3: Vec3 = null, to: Vec3, opts: any) {
        opts = opts || Object.create(null);
        /** 2차 베지어 
         *  @param {number} t 当前百分比 
         *  @param {} p1 시작 위치
         *  @param {} cp 중간 위치
         *  @param {} p2 도착 위치
         *  @returns {any} */
        let twoBezier = (t: number, p1: Vec3, cp: Vec3, p2: Vec3) => {
            let x = (1 - t) * (1 - t) * p1.x + 2 * t * (1 - t) * cp.x + t * t * p2.x;
            let y = (1 - t) * (1 - t) * p1.y + 2 * t * (1 - t) * cp.y + t * t * p2.y;
            let z = (1 - t) * (1 - t) * p1.z + 2 * t * (1 - t) * cp.z + t * t * p2.z;
            return new Vec3(x, y, z);
        };

        /** 3차 베지어 
         *  @param {number} t 当前百分比 
         *  @param {} p1 시작 위치
         *  @param {} cp1 중간 위치
         *  @param {} cp2 중간 위치
         *  @param {} p2 도착 위치
         *  @returns {any} */
        let threeBezier = (t: number, p1: Vec3, cp1: Vec3, cp2: Vec3, p2: Vec3) => {
            let x = p1.x * (1 - t) * (1 - t) * (1 - t) + 3 * cp1.x * t * (1 - t) * (1 - t) + 3 * cp2.x * t * t * (1 - t) + p2.x * t * t * t;
            let y = p1.y * (1 - t) * (1 - t) * (1 - t) + 3 * cp1.y * t * (1 - t) * (1 - t) + 3 * cp2.y * t * t * (1 - t) + p2.y * t * t * t;
            let z = p1.z * (1 - t) * (1 - t) * (1 - t) + 3 * cp1.z * t * (1 - t) * (1 - t) + 3 * cp2.z * t * t * (1 - t) + p2.z * t * t * t;
            return new Vec3(x, y, z);
        };


        opts.onUpdate = (arg: Vec3, ratio: number) => {
            let postion: Vec3 = new Vec3();
            if (c3 != null) {
                postion = threeBezier(ratio, c1, c2, c3, to);
            } else {
                postion = twoBezier(ratio, c1, c2, to);
            }


            target.position = postion;
            opts(target, ratio)
        };

        return tween(target).to(duration, {}, opts);
    }

}

export class ColorUtil {
    static changeColor(node: Node, colorProvider: Color | Func2<Color, string, Color>, exceptNodes: Node[] | undefined = undefined, nevermind?: string) {
        if (!nevermind) nevermind = "";
        nevermind = nevermind + `/${node.name}`;

        let sprite = node.getComponent(Sprite);
        if (sprite) {
            sprite.color = colorProvider instanceof Color ? colorProvider : colorProvider(nevermind, sprite.color);
            node.children.forEach((child) => {
                if (exceptNodes && exceptNodes.indexOf(child) >= 0) return;
                ColorUtil.changeColor(child, colorProvider, exceptNodes, nevermind);
            });
        }
    }

    static colorBackup(node: Node): NodeColorBackupMap;
    static colorBackup(node: Node, prefix: string, map: NodeColorBackupMap): NodeColorBackupMap;
    static colorBackup(node: Node, prefix?: string, map?: NodeColorBackupMap): NodeColorBackupMap {
        if (!map) map = {};
        if (!prefix) prefix = "";

        let sprite = node.getComponent(Sprite);
        if (sprite) {
            prefix = prefix + `/${node.name}`;
            map[prefix] = sprite.color.clone();

            node.children.forEach(child => this.colorBackup(child, prefix!, map!));
        }
        return map;
    }

    /**
     * 
     * @param node 
     * @param map return value of ColorUtil.colorBackup
     * @param prefix not set. this is for recursive call
     */
    static colorRestore(node: Node, map: NodeColorBackupMap, prefix = "") {
        let sprite = node.getComponent(Sprite);
        if (sprite) {
            prefix = prefix + `/${node.name}`;
            sprite.color = map[prefix];

            node.children.forEach(child => this.colorRestore(child, map, prefix));
        }
    }

    static hexToColor(hexArr: string): Color {
        return new Color().fromHEX(hexArr);
    }

    static hexToColorArr(hexArr: string[]): Color[] {
        let result: Color[] = [];
        for (let i = 0; i < hexArr.length; i++) {
            result.push(new Color().fromHEX(hexArr[i]));
        }
        return result;
    }

    static rollUpColor(validator: CoroutineValidator, duration: number, start: Color, to: Color, applyFunc: Action1<Color>, option?: RollUpOption): Coroutine {
        return CoroutineManager.startCoroutine(Util._rollUpCoroutine(duration, 0, 1, r => {
            let c = start.lerp(to, r);
            applyFunc(c);
        }, option), validator);
    }

    static converterRGBColor(r: number, g: number, b: number) {
        r = (255 * r)
        g = (255 * g)
        b = (255 * b)
        return new Color(r, g, b);
    }


}

export class StringUtil {
    //false : not empty
    //true : empty or null
    static isNullOrEmpty(str?: string): boolean {
        return !str || str === "";
    }

    /**
    * 문자 검증기
    * @param s 
    * @returns 
    */
    static isString(s: any) {
        if (typeof s === "string" || s instanceof String) {
            return true;
        } else {
            return false;
        }
    }


    /**
     * 영문인지 검사
     * @param str 
     * @returns 
     */

    static isEnglishOrNumberLetter(inputtxt: string) {
        var letters = /^[A-Za-z0123456789]+$/;
        if (inputtxt.match(letters)) {
            return true;
        }
        else {
            return false;
        }
    }


    static isNumberLetter(inputtxt: string) {
        var letters = /^[.0123456789]+$/;
        if (inputtxt.match(letters)) {
            return true;
        }
        else {
            return false;
        }
    }




    /**
     * 마지막 문자열
     * @param str 
     * @returns 
     */
    static getLastChar(str: string): string {
        return str[str.length - 1];
    }

    /**
     * 문자열 치환
     * StringUtil.format("{0}",199) == 199
     * @param format 
     * @param args 
     * @returns 
     */
    static format(format: string, ...args: any[]): string {
        let s = format;
        for (let i = 0; i < args.length; i++) {
            let reg = new RegExp("\\{" + i + "\\}", "gm");
            s = s.replace(reg, args[i].toString());
        }

        return s;
    }

    static remainTimeReadableFormat(timeSpan: TimeSpan, dictionary?: { [id: string]: string }): string {
        let getWord = (key: string) => (dictionary && dictionary[key]) || "";
        let ret = "";

        if (timeSpan.days) {
            ret = timeSpan.days.toString() + " " + (timeSpan.days === 1 ? getWord("day") : getWord("days"));

            if (timeSpan.hours) {
                ret += " " + timeSpan.hours.toString() + " " + (timeSpan.hours === 1 ? getWord("hour") : getWord("hours"));
            }
        } else if (timeSpan.hours) {
            ret = timeSpan.hours.toString() + " " + (timeSpan.hours === 1 ? getWord("hour") : getWord("hours"));

            if (timeSpan.minutes) {
                ret += " " + timeSpan.minutes.toString() + " " + (timeSpan.minutes === 1 ? getWord("minute") : getWord("minutes"));
            }
        } else if (timeSpan.minutes) {
            ret = timeSpan.minutes.toString() + " " + (timeSpan.minutes === 1 ? getWord("minute") : getWord("minutes"));

            if (timeSpan.seconds) {
                ret += " " + timeSpan.seconds.toString() + " " + (timeSpan.seconds === 1 ? getWord("second") : getWord("seconds"));
            }
        } else {
            ret = timeSpan.seconds.toString() + " " + (timeSpan.seconds === 1 ? getWord("second") : getWord("seconds"));
        }

        return ret;
    }

    static remainTimeDigitFormat(timeSpan: TimeSpan, formatCon: string): string {

        let format = formatCon;
        /* 
         let format = "";
         if (scale === "auto" && timeSpan.days || scale === "days") {
            format = "{0}:{1}:{2}:{3}";
        } else if (scale === "auto" && timeSpan.hours || scale === "hours") {
            format = "{1}:{2}:{3}";
        } else {
            format = "{2}:{3}";
        } */

        return this.format(format, timeSpan.days, this.zeroPad(timeSpan.hours, 2), this.zeroPad(timeSpan.minutes, 2), this.zeroPad(timeSpan.seconds, 2));
    }



    /**
     * 밀리 세컨트 시간을 mm:ss로 변환해준다 
     * @param ms_time 
     * @returns 
     */
    static remainMsToFormat(ms_time: number) {

        // 밀리세컨드를 분과 초로 변환
        let seconds = Math.floor(ms_time / 1000);
        let minutes = Math.floor(seconds / 60);
        seconds = seconds % 60;

        // mm:ss 형식으로 변환
        let mm = minutes < 10 ? '0' + minutes : minutes;
        let ss = seconds < 10 ? '0' + seconds : seconds;

        let formattedTime = mm + ':' + ss;
        return formattedTime;

    }




    /**
     * 단위 약어 
     * K 1000
     * M 1,000,000
     * B 1,000,000,000
     * T 1,000,000,000,000
     * @param value 
     * @param precision 1000단위 이후 소수점 자리수 표기(1234 = 1.23k)
     * @returns 
     */
    static abbreviateNumber(value: number, precision = 2) {
        let suffixes = ["", "K", "M", "B", "T"];
        let suffix = '';

        let newValue = value;
        for (let i = suffixes.length - 1; i > 0; i--) {
            let basis = Math.pow(1000, i);
            if (value >= basis) {
                newValue = value / basis;
                suffix = suffixes[i];
                break;
            }
        }

        return (newValue).toFixed(precision).replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1') + suffix;
    }

    /**
     * 소수점 표기
     * @param number 
     * @param decimalPoint 
     * @returns 
     */
    static currencyFormat(number: number, decimalPoint = 2): string {
        if (number === 0) return "0";
        return number.toFixed(decimalPoint).replace(/(\d)(?=(\d{3})+(\.|$))/g, '$1,');
    }


    /**
     * 3 == 003
     * @param number 
     * @param size 자릿수 
     * @returns 
     */
    static zeroPad(number: number, size = 3): string {
        let s = StringUtil.repeat("0", size) + number;
        return s.substr(s.length - size);
    }


    /**
     * zeroPadIn("032") == 32
     * @param str 
     * @returns 
     */
    static zeroPadIn(str: string): number {
        let r = /\d+/;
        return Number(str.match(r));
    }

    /**
     * 문자열 만복
     * @param str 
     * @param size 
     * @returns 
     */
    static repeat(str: string, size: number) {
        let result = "";
        for (let i = 0; i < size; i++) {
            result += str;
        }
        return result;
    }



    private static readonly possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_";
    /**
     * 랜점 문자열
     * @param length 문자열 길이값 
     * @returns 
     */
    static randomString(length: number): string {
        let text = "";

        for (let i = 0; i < length; i++) {
            text += this.possible.charAt(Math.floor(Math.random() * this.possible.length));
        }

        return text;
    }

    /**
     * 유니크아이디
     * @returns 
     */
    static uuid() {
        let chars = '0123456789abcdef'.split('');

        let uuid = [], rnd = Math.random, r;
        uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
        uuid[14] = '4'; // version 4

        for (let i = 0; i < 36; i++) {
            if (!uuid[i]) {
                r = 0 | rnd() * 16;

                uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r & 0xf];
            }
        }

        return uuid.join('');
    }



    /**
     * getQueryString("http://localhost:7456/?key=ewewewe","key") 
     * @param url 도메인
     * @param paramName 키값 
     * @returns 
     */
    static getQueryString(url: string, paramName: string) {
        let domainSplit = url.split("?");
        if (domainSplit.length == 1) return null;


        let urlTemp = domainSplit[1];

        let tempArray = urlTemp.split('&');
        for (let i = 0; i < tempArray.length; ++i) {
            let pair = tempArray[i].split('=');

            if (pair[0] === paramName) {
                return pair[1];
            }
        }
        return null;
    }


    static convertQueryString(jsonString: any): string {
        return Object.keys(jsonString).reduce(function (str, key, i) {
            var delimiter, val;
            delimiter = (i === 0) ? '' : '&';
            key = encodeURIComponent(key);
            val = encodeURIComponent(jsonString[key]);
            return [str, delimiter, key, '=', val].join('');
        }, '');

    }



    /**
     * 
     * @param value second
     * @returns HH : MM : SS
     */
    static convertHMS(time: number) {
        // Hours, minutes and seconds
        var hrs = ~~(time / 3600);
        var mins = ~~((time % 3600) / 60);
        var secs = ~~time % 60;

        // Output like "1:01" or "4:03:59" or "123:03:59"
        var ret = "";

        ret += "" + this.zeroPad(hrs, 2) + ":" + (mins < 10 ? "0" : "");
        ret += "" + mins + ":" + (secs < 10 ? "0" : "");
        ret += "" + secs;
        return ret;
    }



    /**
     * day가 당일이면(0) HH:MM:SS
     * day가 1일 이상이면 D-Day DD
     * @param second 
     * @returns 
     */
    static dDayCounter(second: number) {
        let today = (Date.now() * 0.001);
        let gap = (second - today) * 1000;
        let day = Math.ceil(gap / (1000 * 60 * 60 * 24)) - 1;
        let hour = Math.ceil((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) - 1;
        let min = Math.ceil((gap % (1000 * 60 * 60)) / (1000 * 60)) - 1;
        let sec = Math.ceil((gap % (1000 * 60)) / 1000) - 1;

        let result: string = "";

        let newHour: number = hour + (day * 24);
        let newHourSize: number = (newHour >= 100) ? 3 : 2;
        /*  if (day == 0) { */
        result = StringUtil.zeroPad(hour + (day * 24), newHourSize) + ":" + StringUtil.zeroPad(min, 2) + ":" + StringUtil.zeroPad(sec, 2);;
        /*  } else {
             result = "D-Day " + day.toString();
         } */
        //let result: string = "D-DAY까지 " + (day - 1) + "일 " + (hour - 1) + "시간 " + (min - 1) + "분 " + sec + "초 남았습니다."
        return result
    }


    /**
     * 
     * @param value 전체 문자
     * @param split 변경되는 문자 a
     * @param replace 변경 할문자 b
     * @returns  a가 b로 전체 변경
     */
    static replaceAll(value: string, split: string, replace: string) {
        let str = value.split(split).join(replace);
        return str
    }

}


export class SerializeUtil {
    /*
    *Map<string, ItemUserData[]>
    *used types
    first ItemUserData -> fromJson
    */
    static serialazeMap(target: any): string {
        let convertJSONString;

        //해당 키에 존재하는 배열 데이터를 키를 가진 오브젝트로 변환
        let obj: any = {}
        target.forEach((element: any, key: string) => {
            //a : [object Object],[object Object]
            obj[key] = element;
        });

        //변환된 오브젝트를 문자열로 변환 
        convertJSONString = JSON.stringify(obj);
        // log(convertJSONString)
        //{"a":[{"id":0,"type":"AA","unique":0,"cnt":1,"lck":false},{"id":1,"type":"BB","unique":0,"cnt":2,"lck":false}]}

        return convertJSONString;
    }

    /*
    *convert json to map 
    *type: generic or default value type
    *
    */
    static deSerialazeMap(jsonString: string, type?: any): Map<any, any> {

        //Json을 디시리얼라이즈 해준다
        let deserializ: any = JSON.parse(jsonString)

        let maps: Map<any, any> = new Map<any, any>();
        //각각키에 들어있는 배열을 각각 클래스화 해준다
        for (const key in deserializ) {
            if (deserializ.hasOwnProperty(key)) {
                const element = deserializ[key];

                //값이 참조형
                if (type != undefined) {
                    //값이 배열
                    if (element instanceof Array) {
                        try {
                            let elementArray: any[] = [];
                            element.forEach(element => {
                                elementArray.push(type.fromJSON(element));
                                //log(ItemUserData.fromJSON(element));
                            });
                            maps.set(key, elementArray);

                        } catch (e) {
                            console.warn("class에 fromJSON 넣어주세요");
                            return;
                        }

                        //값이 단일
                    } else {
                        try {
                            maps.set(key, type.fromJSON(element))

                        } catch (e) {
                            console.warn("class에 fromJSON 넣어주세요");
                            return;
                        }

                    }
                    //값이 기본형
                } else {
                    maps.set(key, element)
                }
            }
        }

        return maps
    }


    //자료형이 맵이 아닐경우 
    static serialaze(target: any): string {
        return JSON.stringify(target);
    }


    //자료형이 맵이 아닐경우 
    static deSerialaze(jsonString: string, type?: any) {
        let deserializ: Object = JSON.parse(jsonString)

        //배열일경우 
        if (deserializ instanceof Array) {
            let elementArray = [];
            for (const key in deserializ) {
                try {
                    if (type != undefined) {
                        elementArray.push(type.fromJSON(deserializ[key]));
                    } else {
                        elementArray.push(deserializ[key]);
                    }

                } catch (e) {
                    console.warn("class에 fromJSON 넣어주세요");
                    return;
                }
            }

            return elementArray;
            //단일 일경우 
        } else {
            try {
                return type.fromJSON(deserializ);
            } catch (e) {
                console.warn("class에 fromJSON 넣어주세요");
                return;
            }
        }
    }



    /**
     * 맵을 넣고 돌리면 JSON으로 반환
     * @param inputMap Map
     * @returns Json
     */
    static mapToJson<T, V>(inputMap: Map<T, V>) {
        let obj: any = {};

        inputMap.forEach((value, key) => {
            obj[key] = value
        });

        return obj;
    }
}

export class ArrayUtil {
    static isNullOrEmpty<T>(array: T[]) {
        return !array || array.length === 0;
    }

    static shuffle<T>(array: T[]) {
        for (let i = 0; i < Math.floor(array.length / 2); ++i) {
            let targetIndex = MyMath.randomRangeInt(0, array.length);
            let tmp: T = array[i];
            array[i] = array[targetIndex];
            array[targetIndex] = tmp;
        }

        return array;
    }
    static getFirst<T>(array: T[]): T | undefined { return this.isNullOrEmpty(array) ? undefined : array[0]; }
    static getLast<T>(array: T[]): T | undefined { return this.isNullOrEmpty(array) ? undefined : array[array.length - 1]; }

    static randomGet<T>(array: T[]) { return array[MyMath.randomRangeInt(0, array.length)]; }

    static range(start: any, end: any) {
        let array = new Array();

        for (let i = start; i < end; ++i) {
            array.push(i);
        }

        return array;
    }

    static checkEquals<T>(array1: T[], array2: T[]) {
        if (array1.length !== array2.length) return false;
        for (let i = 0; i < array1.length; ++i) {
            if (array1[i] !== array2[i]) return false;
        }

        return true;
    }

    /**
     * 내림차순 정렬 5,4,3,2,1
     * @param data 
     * @param base 
     */
    static sortOnBase(data: any, base: any) {
        data.sort((a: any, b: any) => {
            if (a[base] > b[base]) {
                return -1;
            }
            if (a[base] < b[base]) {
                return 1;
            }
            return 0;
        });
    }

    /**
     * 오름 차순 정렬 1,2,3,4,5
     */
    static sortOnBaseAscending(data: any, base: any) {
        data.sort((a: any, b: any) => {
            if (a[base] > b[base]) {
                return 1;
            }
            if (a[base] < b[base]) {
                return -1;
            }
            return 0;
        });
    }



    /**
     * 맵을 배열로 만들어 반환
     * @param map 
     * @returns 
     */
    static flatMap<T, U>(map: Map<T, U>): Array<U> {

        let returnArray: Array<U> = [];
        map.forEach(element => {
            returnArray.push(element);
        });

        return returnArray;
    }


    /**
      * 배열의 일정 인덱스를 삭제 해준다 
      * @param target 원본 배열
      * @param condition number일경우 해당 인덱스 삭제 아닐경우 동일한 아이템이 있을경우 삭제 
      * 원본이 바뀐다 
      *  let condition = (p: Stage) => { return stage === p }
      *  ArrayUtil.removeAt(Game.stages, condition)
      */
    static removeAt(target: Array<any>, condition: any) {
        let idx: number = 0;

        //인덱스 일경우 해당 인덱스 삭제
        if (typeof (condition) == "number") {
            idx = condition;
        } else {
            idx = (target) ? target.findIndex(condition) : -1;
        }
        if (idx != -1)
            target.splice(idx, 1);
    }



    /**
     * 배열에서 해당 조건에 포함된 원소를 삭제 한다 
     * @param target 
     * @param condition 
     * 원본이 바뀐다 
     *  let condition = (p: UIPanel) => { return p.isPage == true }
     *  ArrayUtil.removeAll(this._openedStack, condition)
     */
    static removeAll(target: Array<any>, condition: any) {
        const result = target.filter(condition);

        let targetLength: number = target.length
        for (let index = targetLength - 1; index >= 0; index--) {
            ArrayUtil.removeAt(target, condition)
        }
    }

}

export class Base64Util {
    private static _keyStr: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/="

    public static encode(e: string) {
        let t = "";
        let n, r, i, s, o, u, a;
        let f = 0;
        e = this._utf8_encode(e);

        while (f < e.length) {
            n = e.charCodeAt(f++);
            r = e.charCodeAt(f++);
            i = e.charCodeAt(f++);
            s = n >> 2;
            o = (n & 3) << 4 | r >> 4;
            u = (r & 15) << 2 | i >> 6;
            a = i & 63;

            if (isNaN(r)) {
                u = a = 64;
            }
            else if (isNaN(i)) {
                a = 64;
            }

            t = t + this._keyStr.charAt(s) + this._keyStr.charAt(o) + this._keyStr.charAt(u) + this._keyStr.charAt(a);
        }

        return t;
    }

    public static decode(e: string) {
        let t = "";
        let n, r, i;
        let s, o, u, a;
        let f = 0;
        e = e.replace(/[^A-Za-z0-9+/=]/g, "");

        while (f < e.length) {
            s = this._keyStr.indexOf(e.charAt(f++));
            o = this._keyStr.indexOf(e.charAt(f++));
            u = this._keyStr.indexOf(e.charAt(f++));
            a = this._keyStr.indexOf(e.charAt(f++));
            n = s << 2 | o >> 4;
            r = (o & 15) << 4 | u >> 2;
            i = (u & 3) << 6 | a;
            t = t + String.fromCharCode(n);

            if (u != 64) {
                t = t + String.fromCharCode(r);
            }

            if (a != 64) {
                t = t + String.fromCharCode(i);
            }
        }

        t = this._utf8_decode(t);

        return t;
    }


    private static _utf8_encode(e: any) {
        e = e.replace(/rn/g, "n");
        let t = "";

        for (let n = 0; n < e.length; n++) {
            let r = e.charCodeAt(n);

            if (r < 128) {
                t += String.fromCharCode(r);
            }
            else if (r > 127 && r < 2048) {
                t += String.fromCharCode(r >> 6 | 192);
                t += String.fromCharCode(r & 63 | 128);
            }
            else {
                t += String.fromCharCode(r >> 12 | 224);
                t += String.fromCharCode(r >> 6 & 63 | 128);
                t += String.fromCharCode(r & 63 | 128);
            }
        }

        return t;
    }

    private static _utf8_decode(e: any) {
        let t = "";
        let n = 0;
        let r = 0;
        let c1 = 0;
        let c2 = 0;
        let c3 = 0;
        while (n < e.length) {
            r = e.charCodeAt(n);
            if (r < 128) {
                t += String.fromCharCode(r);
                n++;
            }
            else if (r > 191 && r < 224) {
                c2 = e.charCodeAt(n + 1);
                t += String.fromCharCode((r & 31) << 6 | c2 & 63);
                n += 2;
            }
            else {
                c2 = e.charCodeAt(n + 1);
                c3 = e.charCodeAt(n + 2);
                t += String.fromCharCode((r & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
                n += 3;
            }
        }
        return t;
    }
}





export class BrowserWakeLock {

    // Detect iOS browsers < version 10
    private oldIOS = typeof navigator !== 'undefined' && parseFloat(
        ('' + (/CPU.*OS ([0-9_]{3,4})[0-9_]{0,1}|(CPU like).*AppleWebKit.*Mobile/i.exec(navigator.userAgent) || [0, ''])[1])
            .replace('undefined', '3_2').replace('_', '.').replace('_', '')
    ) < 10


    private noSleepTimer: any = null
    private noSleepVideo: any = null
    constructor() {
        if (this.oldIOS) {
            this.noSleepTimer = null
        } else {
            // Set up no sleep video element
            this.noSleepVideo = document.createElement('video')

            this.noSleepVideo.setAttribute('muted', '')
            this.noSleepVideo.setAttribute('title', 'No Sleep')
            this.noSleepVideo.setAttribute('playsinline', '')

            this._addSourceToVideo(this.noSleepVideo, 'webm', "data:video/webm;base64,GkXfo0AgQoaBAUL3gQFC8oEEQvOBCEKCQAR3ZWJtQoeBAkKFgQIYU4BnQI0VSalmQCgq17FAAw9CQE2AQAZ3aGFtbXlXQUAGd2hhbW15RIlACECPQAAAAAAAFlSua0AxrkAu14EBY8WBAZyBACK1nEADdW5khkAFVl9WUDglhohAA1ZQOIOBAeBABrCBCLqBCB9DtnVAIueBAKNAHIEAAIAwAQCdASoIAAgAAUAmJaQAA3AA/vz0AAA=")
            this._addSourceToVideo(this.noSleepVideo, 'mp4', "data:video/mp4;base64,AAAAIGZ0eXBtcDQyAAACAGlzb21pc28yYXZjMW1wNDEAAAAIZnJlZQAACKBtZGF0AAAC8wYF///v3EXpvebZSLeWLNgg2SPu73gyNjQgLSBjb3JlIDE0MiByMjQ3OSBkZDc5YTYxIC0gSC4yNjQvTVBFRy00IEFWQyBjb2RlYyAtIENvcHlsZWZ0IDIwMDMtMjAxNCAtIGh0dHA6Ly93d3cudmlkZW9sYW4ub3JnL3gyNjQuaHRtbCAtIG9wdGlvbnM6IGNhYmFjPTEgcmVmPTEgZGVibG9jaz0xOjA6MCBhbmFseXNlPTB4MToweDExMSBtZT1oZXggc3VibWU9MiBwc3k9MSBwc3lfcmQ9MS4wMDowLjAwIG1peGVkX3JlZj0wIG1lX3JhbmdlPTE2IGNocm9tYV9tZT0xIHRyZWxsaXM9MCA4eDhkY3Q9MCBjcW09MCBkZWFkem9uZT0yMSwxMSBmYXN0X3Bza2lwPTEgY2hyb21hX3FwX29mZnNldD0wIHRocmVhZHM9NiBsb29rYWhlYWRfdGhyZWFkcz0xIHNsaWNlZF90aHJlYWRzPTAgbnI9MCBkZWNpbWF0ZT0xIGludGVybGFjZWQ9MCBibHVyYXlfY29tcGF0PTAgY29uc3RyYWluZWRfaW50cmE9MCBiZnJhbWVzPTMgYl9weXJhbWlkPTIgYl9hZGFwdD0xIGJfYmlhcz0wIGRpcmVjdD0xIHdlaWdodGI9MSBvcGVuX2dvcD0wIHdlaWdodHA9MSBrZXlpbnQ9MzAwIGtleWludF9taW49MzAgc2NlbmVjdXQ9NDAgaW50cmFfcmVmcmVzaD0wIHJjX2xvb2thaGVhZD0xMCByYz1jcmYgbWJ0cmVlPTEgY3JmPTIwLjAgcWNvbXA9MC42MCBxcG1pbj0wIHFwbWF4PTY5IHFwc3RlcD00IHZidl9tYXhyYXRlPTIwMDAwIHZidl9idWZzaXplPTI1MDAwIGNyZl9tYXg9MC4wIG5hbF9ocmQ9bm9uZSBmaWxsZXI9MCBpcF9yYXRpbz0xLjQwIGFxPTE6MS4wMACAAAAAOWWIhAA3//p+C7v8tDDSTjf97w55i3SbRPO4ZY+hkjD5hbkAkL3zpJ6h/LR1CAABzgB1kqqzUorlhQAAAAxBmiQYhn/+qZYADLgAAAAJQZ5CQhX/AAj5IQAD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")

            this.noSleepVideo.addEventListener('loadedmetadata', () => {
                if (this.noSleepVideo.duration <= 1) { // webm source
                    this.noSleepVideo.setAttribute('loop', '')
                } else { // mp4 source
                    this.noSleepVideo.addEventListener('timeupdate', () => {
                        if (this.noSleepVideo.currentTime > 0.5) {
                            this.noSleepVideo.currentTime = Math.random()
                        }
                    })
                }
            })
        }
    }

    _addSourceToVideo(element: any, type: any, dataURI: any) {
        let source = document.createElement('source')
        source.src = dataURI
        source.type = `video/${type}`
        element.appendChild(source)
    }

    enable() {
        if (this.oldIOS) {
            this.disable()
            console.warn(`
        NoSleep enabled for older iOS devices. This can interrupt
        active or long-running network requests from completing successfully.
        See https://github.com/richtr/NoSleep.js/issues/15 for more details.
      `)
            this.noSleepTimer = window.setInterval(() => {
                if (!document.hidden) {
                    window.location.href = window.location.href.split('#')[0]
                    window.setTimeout(window.stop, 0)
                }
            }, 15000)
        } else {
            this.noSleepVideo.play()
        }
    }

    disable() {
        if (this.oldIOS) {
            if (this.noSleepTimer) {
                console.warn(`
          NoSleep now disabled for older iOS devices.
        `)
                window.clearInterval(this.noSleepTimer)
                this.noSleepTimer = null
            }
        } else {
            this.noSleepVideo.pause()
        }
    }
}




/**
 * https://github.com/gre/bezier-easing
 * BezierEasing - use bezier curve for transition easing function
 * by Gaëtan Renaudeau 2014 - 2015 – MIT License
 */

// These values are established by empiricism with tests (tradeoff: performance VS precision)
let NEWTON_ITERATIONS = 4;
let NEWTON_MIN_SLOPE = 0.001;
let SUBDIVISION_PRECISION = 0.0000001;
let SUBDIVISION_MAX_ITERATIONS = 10;

let kSplineTableSize = 11;
let kSampleStepSize = 1.0 / (kSplineTableSize - 1.0);

let float32ArraySupported = typeof Float32Array === 'function';

function A(aA1: number, aA2: number) { return 1.0 - 3.0 * aA2 + 3.0 * aA1; }
function B(aA1: number, aA2: number) { return 3.0 * aA2 - 6.0 * aA1; }
function C(aA1: number) { return 3.0 * aA1; }

// Returns x(t) given t, x1, and x2, or y(t) given t, y1, and y2.
function calcBezier(aT: number, aA1: number, aA2: number) { return ((A(aA1, aA2) * aT + B(aA1, aA2)) * aT + C(aA1)) * aT; }

// Returns dx/dt given t, x1, and x2, or dy/dt given t, y1, and y2.
function getSlope(aT: number, aA1: number, aA2: number) { return 3.0 * A(aA1, aA2) * aT * aT + 2.0 * B(aA1, aA2) * aT + C(aA1); }

function binarySubdivide(aX: number, aA: number, aB: number, mX1: number, mX2: number) {
    let currentX, currentT, i = 0;
    do {
        currentT = aA + (aB - aA) / 2.0;
        currentX = calcBezier(currentT, mX1, mX2) - aX;
        if (currentX > 0.0) {
            aB = currentT;
        } else {
            aA = currentT;
        }
    } while (Math.abs(currentX) > SUBDIVISION_PRECISION && ++i < SUBDIVISION_MAX_ITERATIONS);
    return currentT;
}

function newtonRaphsonIterate(aX: number, aGuessT: number, mX1: number, mX2: number) {
    for (let i = 0; i < NEWTON_ITERATIONS; ++i) {
        let currentSlope = getSlope(aGuessT, mX1, mX2);
        if (currentSlope === 0.0) {
            return aGuessT;
        }
        let currentX = calcBezier(aGuessT, mX1, mX2) - aX;
        aGuessT -= currentX / currentSlope;
    }
    return aGuessT;
}





export class EasingUtil {
    // https://gist.github.com/gre/1650294
    /*
    * Easing Functions - inspired from http://gizma.com/easing/
    * only considering the t value for the range [0, 1] => [0, 1]
    */

    // no easing, no acceleration
    static linear(t: any) { return t }

    // accelerating from zero velocity
    static easeInQuad(t: any) { return t * t }

    // decelerating to zero velocity
    static easeOutQuad(t: any) { return t * (2 - t) }

    // acceleration until halfway, then deceleration
    static easeInOutQuad(t: any) { return t < .5 ? 2 * t * t : -1 + (4 - 2 * t) * t }

    // accelerating from zero velocity 
    static easeInCubic(t: any) { return t * t * t }

    // decelerating to zero velocity 
    static easeOutCubic(t: any) { return (--t) * t * t + 1 }

    // acceleration until halfway, then deceleration 
    static easeInOutCubic(t: any) { return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1 }

    // accelerating from zero velocity 
    static easeInQuart(t: any) { return t * t * t * t }

    // decelerating to zero velocity 
    static easeOutQuart(t: any) { return 1 - (--t) * t * t * t }

    // acceleration until halfway, then deceleration
    static easeInOutQuart(t: any) { return t < .5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t }

    // accelerating from zero velocity
    static easeInQuint(t: any) { return t * t * t * t * t }

    // decelerating to zero velocity
    static easeOutQuint(t: any) { return 1 + (--t) * t * t * t * t }

    // acceleration until halfway, then deceleration 
    static easeInOutQuint(t: any) { return t < .5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t }

    // elastic bounce effect at the beginning
    static easeInElastic(t: any) { return (.04 - .04 / t) * Math.sin(25 * t) + 1 }

    // elastic bounce effect at the end
    static easeOutElastic(t: any) { return .04 * t / (--t) * Math.sin(25 * t) }

    // elastic bounce effect at the beginning and end
    static easeInOutElastic(t: any) { return (t -= .5) < 0 ? (.01 + .01 / t) * Math.sin(50 * t) : (.02 - .01 / t) * Math.sin(50 * t) + 1 }

    static easeInSin(t: any) { return 1 + Math.sin(Math.PI / 2 * t - Math.PI / 2); }

    static easeOutSin(t: any) { return Math.sin(Math.PI / 2 * t); }

    static easeInOutSin(t: any) { return (1 + Math.sin(Math.PI * t - Math.PI / 2)) / 2; }

    static easeBezier(mX1: number, mY1: number, mX2: number, mY2: number): Function {
        if (!(0 <= mX1 && mX1 <= 1 && 0 <= mX2 && mX2 <= 1)) {
            throw new Error('bezier x values must be in [0, 1] range');
        }

        // Precompute samples table
        let sampleValues = float32ArraySupported ? new Float32Array(kSplineTableSize) : new Array(kSplineTableSize);
        if (mX1 !== mY1 || mX2 !== mY2) {
            for (let i = 0; i < kSplineTableSize; ++i) {
                sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
            }
        }

        function getTForX(aX: number) {
            let intervalStart = 0.0;
            let currentSample = 1;
            let lastSample = kSplineTableSize - 1;

            for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
                intervalStart += kSampleStepSize;
            }
            --currentSample;

            // Interpolate to provide an initial guess for t
            let dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
            let guessForT = intervalStart + dist * kSampleStepSize;

            let initialSlope = getSlope(guessForT, mX1, mX2);
            if (initialSlope >= NEWTON_MIN_SLOPE) {
                return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
            } else if (initialSlope === 0.0) {
                return guessForT;
            } else {
                return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
            }
        }

        return function BezierEasing(x: number): number {
            if (mX1 === mY1 && mX2 === mY2) {
                return x; // linear
            }

            // Because JavaScript number are imprecise, we should guarantee the extremes are right.
            if (x === 0) {
                return 0;
            }
            if (x === 1) {
                return 1;
            }
            return calcBezier(getTForX(x), mY1, mY2);
        };
    };
}