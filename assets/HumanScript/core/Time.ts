import { _decorator, Component, Node, director, sys, Director, game, AnimationManager } from 'cc';
import { Action0 } from '../logic/Define';
const { ccclass, property } = _decorator;


@ccclass
export class Time {
    protected static _time = 0;
    protected static _timeScale = 1;

    public static timeScaleCallBack: Action0 = null;

    public static clientTime: number = 0;
    public static serverTime: number = 0;
    public static lackTime: number = 0;

    static get deltaTime() {
        return game.deltaTime;
    }

    static get time() {
        return Time._time;
    }

    static get utcNow(): number {

        //서버 시간도 동일하게 클라이언트 시간처럼 흘러야 한다 
        let addOnMsTime: number = Date.now() - this.clientTime;
        let ms = this.serverTime + addOnMsTime;
        return ms;
    }


    static updateTime(dt: number) {
        // cc.director.getDeltaTime() 와 dt는 항상 같은 값이 온다.
        Time._time += dt;
        this._frameCount++;
    }

    //The total number of frames that have passed (Read Only).
    // same as unity3D Time.frameCount
    private static _frameCount = 0;
    static get frameCount(): number {
        return this._frameCount;
    }


    //cc.d.ts  17967
    public static set timeScale(value: number) {

        this._timeScale = value;

        if (this.timeScaleCallBack)
            this.timeScaleCallBack();
    }

    //cc.d.ts  17967
    public static get timeScale() {
        return this._timeScale;
    }



    public static getNowLackTime() {
        let currentMSTime: number = Time.utcNow - this.lackTime;
        return currentMSTime;
    }


}