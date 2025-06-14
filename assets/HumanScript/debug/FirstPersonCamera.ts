import { _decorator, Component, Quat, Vec2, Vec3, macro,  game, Touch, EventKeyboard, EventMouse, KeyCode, input, Input, EventTouch } from 'cc';
import { Time } from '../core/Time';
const { ccclass, property } = _decorator;

const v2_1 = new Vec2();
const v2_2 = new Vec2();
const v3_1 = new Vec3();
const qt_1 = new Quat();
const KEYCODE = {
    W: 'W'.charCodeAt(0),
    S: 'S'.charCodeAt(0),
    A: 'A'.charCodeAt(0),
    D: 'D'.charCodeAt(0),
    Q: 'Q'.charCodeAt(0),
    E: 'E'.charCodeAt(0),
    SHIFT: KeyCode.SHIFT_LEFT,
};

@ccclass
export class FirstPersonCamera extends Component {

    @property
    public moveSpeed = 1;

    @property
    public moveSpeedShiftScale = 5;

    @property({ slide: true, range: [0.05, 0.5, 0.01] })
    public damp = 0.2;

    @property
    public rotateSpeed = 1;

    private _euler = new Vec3();
    private _velocity = new Vec3();
    private _position = new Vec3();
    private _speedScale = 1;

    public onLoad() {
        input.on(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
        Vec3.copy(this._euler, this.node.eulerAngles);
        Vec3.copy(this._position, this.node.position);
    }

    public onDestroy() {
        input.off(Input.EventType.MOUSE_WHEEL, this.onMouseWheel, this);
        input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.off(Input.EventType.KEY_UP, this.onKeyUp, this);
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
        input.off(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        input.off(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }

    public update(dt: number) {

        if (Time.timeScale == 0) return;
        // position
        Vec3.transformQuat(v3_1, this._velocity, this.node.rotation);
        Vec3.scaleAndAdd(this._position, this._position, v3_1, this.moveSpeed * this._speedScale);
        Vec3.lerp(v3_1, this.node.position, this._position, dt / this.damp);
        this.node.setPosition(v3_1);
        // rotation
        Quat.fromEuler(qt_1, this._euler.x, this._euler.y, this._euler.z);
        Quat.slerp(qt_1, this.node.rotation, qt_1, dt / this.damp);
        this.node.setRotation(qt_1);
    }

    public onMouseWheel(e: EventMouse) {
        const delta = -e.getScrollY() * this.moveSpeed * 0.1; // delta is positive when scroll down
        Vec3.transformQuat(v3_1, Vec3.UNIT_Z, this.node.rotation);
        Vec3.scaleAndAdd(this._position, this.node.position, v3_1, delta);
    }

    public onKeyDown(e: EventKeyboard) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = this.moveSpeedShiftScale; }
        else if (e.keyCode === KEYCODE.W) { if (v.z === 0) { v.z = -1; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z === 0) { v.z = 1; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x === 0) { v.x = -1; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x === 0) { v.x = 1; } }
        else if (e.keyCode === KEYCODE.Q) { if (v.y === 0) { v.y = -1; } }
        else if (e.keyCode === KEYCODE.E) { if (v.y === 0) { v.y = 1; } }
    }

    public onKeyUp(e: EventKeyboard) {
        const v = this._velocity;
        if (e.keyCode === KEYCODE.SHIFT) { this._speedScale = 1; }
        else if (e.keyCode === KEYCODE.W) { if (v.z < 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.S) { if (v.z > 0) { v.z = 0; } }
        else if (e.keyCode === KEYCODE.A) { if (v.x < 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.D) { if (v.x > 0) { v.x = 0; } }
        else if (e.keyCode === KEYCODE.Q) { if (v.y < 0) { v.y = 0; } }
        else if (e.keyCode === KEYCODE.E) { if (v.y > 0) { v.y = 0; } }
    }

    public onTouchStart(e: EventTouch) {
        if (game.canvas.requestPointerLock) { game.canvas.requestPointerLock(); }
    }

    public onTouchMove(e: EventTouch) {
        e.getStartLocation(v2_1);
        if (v2_1.x > game.canvas.width * 0.4) { // rotation
            e.getDelta(v2_2);
            this._euler.y -= v2_2.x * this.rotateSpeed * 0.1;
            this._euler.x += v2_2.y * this.rotateSpeed * 0.1;
        } else { // position
            e.getLocation(v2_2);
            Vec2.subtract(v2_2, v2_2, v2_1);
            this._velocity.x = v2_2.x * 0.01;
            this._velocity.z = -v2_2.y * 0.01;
        }
    }

    public onTouchEnd(e: EventTouch) {
        if (document.exitPointerLock) { document.exitPointerLock(); }
        e.getStartLocation(v2_1);
        if (v2_1.x < game.canvas.width * 0.4) { // position
            this._velocity.x = 0;
            this._velocity.z = 0;
        }
    }
}
