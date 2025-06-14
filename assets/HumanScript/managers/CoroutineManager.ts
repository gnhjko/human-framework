
/**
 * Scene에 해당 컴포넌트를 붙이면, 해당 Scene에 Coroutine을 사용할 수 있게 된다.
 * Coroutine은 다음과 같이 사용할 수 있다.
 * 
 */
import { Time } from "../core/Time";

import { _decorator, Component, Node } from 'cc';
import { Action0, Func0 } from "../logic/Define";
const { ccclass, property } = _decorator;
export class WaitForSeconds {
    sec: number;

    constructor(sec: number) {
        this.sec = sec;
    }
}


export class WaitForSecondsRealtime {
    sec: number;

    constructor(sec: number) {
        this.sec = sec;
    }
}


export type CoroutineValidator = Component | Func0<boolean> | null | Node;

//type CoroutineIterator = IterableIterator<undefined | WaitForSeconds | IterableIterator<any> | Coroutine>;
type CoroutineIterator = IterableIterator<any>;
export class Coroutine {
    private static idMaker = 1;

    id: number;
    iterator: CoroutineIterator;
    validator: CoroutineValidator;
    private _done: boolean;

    firstFrame?: boolean;
    availableTiming?: number;

    nestedCoroutine: Coroutine;
    nestedCoroutineDoneValue: any;
    private promiseResolves: Action0[] = [];

    constructor(iterator: CoroutineIterator, validator: CoroutineValidator) {
        this.id = Coroutine.idMaker++;

        this.iterator = iterator;
        this.validator = validator;

        this.done = false;
    }

    get done() { return this._done; }
    set done(value: boolean) {
        this._done = value;
        if (value === true) {
            this.promiseResolves.forEach(r => r());
            this.promiseResolves = [];
        }
    }

    getDonePromise() {
        return new Promise<void>(resolve => this._done ? resolve() : this.promiseResolves.push(resolve));
    }

}

@ccclass export class CoroutineManager extends Component {
    static instance: CoroutineManager;
    coroutines: Coroutine[] = [];
    totalElapsed = 0;

    constructor() {
        super();
        CoroutineManager.instance = this;
    }

    static startCoroutine(iterator: CoroutineIterator, validator: CoroutineValidator): Coroutine {
        // instance 가 생성되기 전에 불리면 안됨.
        if (this.instance == null) return;
        return this.instance._startCoroutine(iterator, validator);
    }

    static stopCoroutine(coroutine: Coroutine) {
        this.instance._removeCoroutine(coroutine);
    }

    static stopCoroutineTarget(target: Node) {
        for (let i = this.instance.coroutines.length - 1; i >= 0; --i) {
            if (target === this.instance.coroutines[i].validator) {
                this.stopCoroutine(this.instance.coroutines[i]);
            }
        }
    }

    static stopAllCoroutine() {
        this.instance._removeAllCoroutine();
    }

    update(dt: number) {

        if (Time.timeScale == 0) return;

        if (Time) {
            Time.updateTime(dt);
        }
        this.lateUpdateRender(dt);
    }

    lateUpdateRender(dt: number) {
        this.totalElapsed += dt;
        if (this.coroutines.length === 0) return;

        let coroutines = this.coroutines.slice(0);
        for (let i = 0; i < coroutines.length; i++) {
            let c = coroutines[i];
            let done = this.runOnce(c);
            if (done) {
                this._removeCoroutine(c);
            }
        }
    }

    protected _startCoroutine(iterator: CoroutineIterator, validator: CoroutineValidator) {
        let cs = new Coroutine(iterator, validator);
        let done = this.runOnce(cs);
        if (!done) {
            cs.firstFrame = true;
            this.coroutines.push(cs);
        }

        return cs;
    }

    protected _removeCoroutine(coroutine: Coroutine) {
        let coroutines = this.coroutines;
        for (let i = 0; i < coroutines.length; i++) {
            let c = coroutines[i];
            if (c === coroutine) {
                coroutines.splice(i, 1);
                break;
            }
        }
    }

    protected _removeAllCoroutine() {
        this.coroutines = [];
    }

    static hasCoroutine() {
        /*     let aaa = []
            this.instance.coroutines.forEach(element => {
                aaa.push(element.validator.name);
            });
    
            console.log(aaa); */
    }

    protected runOnce(c: Coroutine): { doneValue: any } | undefined {
        if (c.validator !== null) {
            if (c.validator instanceof Component) {
                if (!c.validator.node || !c.validator.node.activeInHierarchy) {
                    c.done = true;
                    return { doneValue: undefined }
                };
            } else if (typeof c.validator === "function" && !(c.validator as Func0<boolean>)()) {
                c.done = true;
                return { doneValue: undefined };
            } else if (c.validator instanceof Node) {
                if (!c.validator || !c.validator.activeInHierarchy) {
                    c.done = true;
                    return { doneValue: undefined }
                };
            }
        }
        if (c.nestedCoroutine) {
            let done = this.runOnce(c.nestedCoroutine);
            if (done) {
                delete c.nestedCoroutine;
                c.nestedCoroutineDoneValue = done.doneValue;
            } else {
                return;
            }
        }
        if (c.firstFrame) {
            c.firstFrame = false;
            return;
        }
        if (c.availableTiming && c.availableTiming > this.totalElapsed) {
            return;
        }

        let next = c.iterator.next(c.nestedCoroutineDoneValue);
        delete c.nestedCoroutineDoneValue;
        if (next.done) {
            c.done = true;
            return { doneValue: next.value };
        } else if (!next.value) {
            return;
        } else if (next.value instanceof WaitForSeconds) {
            c.availableTiming = this.totalElapsed + (next.value.sec / Time.timeScale);

        } else if (next.value instanceof WaitForSecondsRealtime) {
            c.availableTiming = this.totalElapsed + next.value.sec;
        } else if (next.value instanceof Coroutine) {
            this._removeCoroutine(next.value);
            c.nestedCoroutine = next.value;
        } else if (next.value.toString() === "[object Object]" || next.value.toString() === "[object Generator]") { // babel이 번역해준 것에서는 generator가 [object Generator]였는데 지금은typescript가 번역해 주며, [object Object]로 온다. 흠...
            let cs = new Coroutine(next.value, c.validator);
            let done = this.runOnce(cs);
            if (!done) {
                c.nestedCoroutine = cs;
            }
        } else {
            throw "Wrong yield";
        }
        return;
    }
}