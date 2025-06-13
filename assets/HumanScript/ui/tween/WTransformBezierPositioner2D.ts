
import { _decorator, Component, Node, Enum, Vec2, CCFloat, Vec3 } from 'cc';
import { Easing, WTransformTweener } from './WTransformTweener';
const { ccclass, property } = _decorator;

export enum E_AXIS {
    XY,
    XZ,
    YZ,
}

export enum E_WORLD_TYPE {
    WORLD,
    LOCAL,
}

@ccclass('WTransformBezierPositioner2D')
export class WTransformBezierPositioner2D extends WTransformTweener {

    @property({ type: Enum(E_AXIS) }) m_axis: E_AXIS = E_AXIS.XY;

    @property({ type: Enum(E_WORLD_TYPE) }) m_type: E_WORLD_TYPE = E_WORLD_TYPE.WORLD;

    @property(Vec3) m_startPosition: Vec3 = new Vec3(0, 0);
    @property(Vec3) m_targetPosition: Vec3 = new Vec3(1, 1);


    @property(CCFloat) m_controlDistanceRateMin: number = -1;
    @property(CCFloat) m_controlDistanceRateMax: number = 0;
    @property(CCFloat) m_controlWidthRateMin: number = -1;
    @property(CCFloat) m_controlWidthRateMax: number = 1;

    private m_controlPosition: Vec3 = new Vec3(0, 0, 0);
    private m_targetPoint: Node = null;



    protected OnBegin() {
        let vDistance: Vec3 = this.m_targetPosition.clone().subtract(this.m_startPosition);

        let vHalfWidth: Vec3 = new Vec3(vDistance.y, -vDistance.x).multiplyScalar(0.5);

        let controlDistanceRate: number = Easing.randomRange(this.m_controlDistanceRateMin, this.m_controlDistanceRateMax);

        let controlWidthRate: number = Easing.randomRange(this.m_controlWidthRateMin, this.m_controlWidthRateMax);

        this.m_controlPosition = this.m_startPosition.clone().add(vDistance.clone().multiplyScalar(controlDistanceRate)).clone().add(vHalfWidth.clone().multiplyScalar(controlWidthRate));
    }

    public UpdateValue(t: number) {
        if (this.m_targetPoint != null) this.m_targetPosition = (this.m_type == E_WORLD_TYPE.WORLD) ? this.m_targetPoint.worldPosition : this.m_targetPoint.position;

        this.SetTransformPosition(this.GetVezierPosition(this.m_startPosition, this.m_targetPosition, this.m_controlPosition, t));
    }

    GetVezierPosition(from: Vec3, to: Vec3, control: Vec3, t: number): Vec3 {
        let a: Vec3 = from.clone().multiplyScalar(1 - t).clone().add(control.clone().multiplyScalar(t));

        let b: Vec3 = control.clone().multiplyScalar(1 - t).clone().add(to.clone().multiplyScalar(t));

        return a.clone().multiplyScalar(1 - t).clone().add(b.clone().multiplyScalar(t));
    }

    SetTransformPosition(pos: Vec3) {
        if (this.m_type == E_WORLD_TYPE.WORLD) {
            switch (this.m_axis) {
                case E_AXIS.XY: this.node.setWorldPosition(new Vec3(pos.x, pos.y, 0)); break;
                case E_AXIS.XZ: this.node.setWorldPosition(new Vec3(pos.x, 0, pos.y)); break;
                case E_AXIS.YZ: this.node.setWorldPosition(new Vec3(0, pos.x, pos.y)); break;
            }
        }
        else {
            switch (this.m_axis) {
                case E_AXIS.XY: this.node.setPosition(new Vec3(pos.x, pos.y, 0)); break;
                case E_AXIS.XZ: this.node.setPosition(new Vec3(pos.x, 0, pos.y)); break;
                case E_AXIS.YZ: this.node.setPosition(new Vec3(0, pos.x, pos.y)); break;
            }
        }
    }

    public SetPositionType(type: E_WORLD_TYPE): WTransformBezierPositioner2D {
        this.m_type = type;

        return this;
    }

    public SetStartPoint(point: Node): WTransformBezierPositioner2D {
        this.m_startPosition = (this.m_type == E_WORLD_TYPE.WORLD) ? point.worldPosition : point.position;

        return this;
    }

    public SetStartPosition(pos: Vec3): WTransformBezierPositioner2D {
        this.m_startPosition = pos;

        return this;
    }

    public SetTargetPoint(point: Node): WTransformBezierPositioner2D {
        this.m_targetPoint = point;

        this.m_targetPosition = (this.m_type == E_WORLD_TYPE.WORLD) ? point.worldPosition : point.position;

        return this;
    }

    public SetTargetPosition(pos: Vec3): WTransformBezierPositioner2D {
        this.m_targetPoint = null;

        this.m_targetPosition = pos;

        return this;
    }




    public setControlDistanceRateMin(value: number) {
        this.m_controlDistanceRateMin = value;
    }
    public setControlDistanceRateMax(value: number) {
        this.m_controlDistanceRateMax = value;
    }
    public setControlWidthRateMin(value: number) {
        this.m_controlWidthRateMin = value;
    }
    public setControlWidthRateMax(value: number) {
        this.m_controlWidthRateMax = value;
    }




}


