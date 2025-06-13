import { Label, Skeleton, Sprite, Vec2, Vec3 } from "cc";


type UnityAction = () => void;
type Action0 = () => void;
type Action1Or0<P1> = (p1?: P1) => void;
type Action1<P1> = (p1: P1) => void;
type Action2<P1, P2> = (p1: P1, p2: P2) => void;
type Action3<P1, P2, P3> = (p1: P1, p2: P2, p3: P3) => void;
type Action4<P1, P2, P3, P4> = (p1: P1, p2: P2, p3: P3, p4: P4) => void;

type Func0<R> = () => R;
type Func1<R, P1> = (p1: P1) => R;
type Func2<R, P1, P2> = (p1: P1, p2: P2) => R;
type Func3<R, P1, P2, P3> = (p1: P1, p2: P2, p3: P3) => R;
type Func4<R, P1, P2, P3, P4> = (p1: P1, p2: P2, p3: P3, p4: P4) => R;

type bool = boolean;
type float = number;
type long = number;
type int = number;
type uint = number;
type ushort = number;
type Transform = Node;
type RectTransform = Node;
type Text = Label;
type Vector3 = Vec3;
type Vector2 = Vec2;
//type GameObject = Node;
type MeshRenderer = Sprite;
type SpriteRenderer = Sprite;
type RawImage = Sprite;
type Image = Sprite
type ObscuredInt = number;
type ObscuredUInt = number;
type ObscuredFloat = number;
type ObscuredString = string;
type ObscuredBool = boolean;
type ObscuredLong = number;




/**
 * cc 모듈의 타입 확장
 */
declare module "cc" {
    /**
     * 노드 class의 확장 타입
     */
    export interface Node {

        //Custom Active
        SetActive(value: boolean): void;
        SendMessage(funName: string, param?: any): void;
        Find(value: string, allChild?: boolean, forceVisible?: boolean): Node | null;

        FindObjectsOfType<T>(type: any, forceVisible?: boolean): Node[];
        FindObjectOfType<T>(type: any, forceVisible?: boolean): Node;

        get localPosition(): Vec3;
        set localPosition(value: Vec3);

        get localScale(): Vec3;
        set localScale(value: Vec3);

        get x(): number;
        set x(value: number);
        get y(): number;
        set y(value: number);
        get z(): number;
        set z(value: number);

    }
}

