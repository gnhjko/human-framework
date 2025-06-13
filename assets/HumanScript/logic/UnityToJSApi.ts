
import { _decorator, Component, Node, Vec3, Label, RichText, director, UITransform } from 'cc';
import { EDITOR } from 'cc/env';
const { ccclass, property } = _decorator;


init();

function init() {

    if (EDITOR) return;
    //cc.d.ts  21674
    Node.prototype["SetActive"] = function (_active) {
        this.active = _active;
    }


    /*  //cc.d.ts  21674
     Object.defineProperty(Node.prototype, 'widthC', {
         get: function () {
             let uITransform: UITransform = this.getComponent(UITransform)
             return (uITransform) ? uITransform.width : 0;
         },
         set: function (val) {
             let uITransform: UITransform = this.getComponent(UITransform)
             if (uITransform) uITransform.width = val;
 
         }
     });
 
     //cc.d.ts  21674
     Object.defineProperty(Node.prototype, 'widthC', {
         get: function () {
             let uITransform: UITransform = this.getComponent(UITransform)
             return (uITransform) ? uITransform.height : 0;
         },
         set: function (val) {
             let uITransform: UITransform = this.getComponent(UITransform)
             if (uITransform) uITransform.height = val;
         }
     });
  */

    //cc.d.ts  21674
    Object.defineProperty(Node.prototype, 'x', {
        get: function () {
            return this.getPosition().x;
        },
        set: function (val) {
            this.setPosition(new Vec3(val, this.getPosition().y, this.getPosition().z))
        }
    });

    //cc.d.ts  21674
    Object.defineProperty(Node.prototype, 'y', {
        get: function () {
            return this.getPosition().y;
        },
        set: function (val) {
            this.setPosition(new Vec3(this.getPosition().x, val, this.getPosition().z))
        }
    });

    //cc.d.ts  21674
    Object.defineProperty(Node.prototype, 'z', {
        get: function () {
            return this.getPosition().z;
        },
        set: function (val) {
            this.setPosition(new Vec3(this.getPosition().x, this.getPosition().y, val))
        }
    });

    //cc.d.ts  21674
    Object.defineProperty(Node.prototype, 'localPosition', {
        get: function () {
            return this.getPosition();
        },
        set: function (val) {
            this.setPosition(new Vec3(val.x, val.y, val.z))
        }
    });

    //cc.d.ts  21674
    Object.defineProperty(Node.prototype, 'localScale', {
        get: function () {
            return this.getScale();
        },
        set: function (val) {
            this.setScale(new Vec3(val.x, val.y, val.z))
        }
    });


    //cc.d.ts  21674
    Object.defineProperty(Node.prototype, 'localEulerAngles', {
        get: function () {
            return this.eulerAngles;
        },
        set: function (val) {
            console.error(" UnityJSTOAPOlocalEulerAngles")

        }
    });


    //cc.d.ts  21674
    //해당 노드에 붙어 있는 스크립트의 함수 실행
    Node.prototype["SendMessage"] = function (funName: string, param?: any) {

        this['_components'].forEach((element: any) => {
            if (element[funName]) {
                if (param) {
                    element[funName](param);
                } else {
                    element[funName]();
                }
            }
        });
    }





    //cc.d.ts  2064
    Object.defineProperty(Label.prototype, 'text', {
        get: function () {
            return this.string;
        },
        set: function (val) {
            this.string = val;
        }
    });


    //cc.d.ts  1152
    Object.defineProperty(RichText.prototype, 'text', {
        get: function () {
            return this.string;
        },
        set: function (val) {
            this.string = val;
        }
    });





    /**
     * 노드.Find("") 일경우 해당 노드 자식을 찾아준다 
     * Utils.Find("") 전체 노드중 해당 노드를 찾아준다
     * Unity의 Find의 경우 2가지로 볼수 있는데 
     * GameObject.Find : 전체 노드중 해당 이름을 가진 노드를 찾아준다 
     * Tranform.Find : 기준되는 Tranform의 자식 노드를 찾아준다 
     * 
     * / 가 붙어 있을경우 자식노드 검색
     * 
     * allChild = true 일경우 해당 노드 자식에 해당 이름을 가진 노드를 찾아준다
     * forceVisible = true 일경우 active false인경우도 찾아준다
    */
    //cc.d.ts  21674
    Node.prototype["Find"] = function (name: string, allChild?: boolean, forceVisible?: boolean) {

        if (allChild != undefined && allChild) {

            let findNode: Node = null;
            map(this, name);
            function map(node: any, nameV: string) {

                if (forceVisible == undefined) {
                    //현재 노드와 받아온 노드의 부모를 찾아준다
                    if (node.active && node.name == nameV) {
                        findNode = node;
                        return;
                    }
                    //자식이 없으면 멈춤
                    if (!node.active || node.children.length == 0) {
                        return;
                    }
                    //각각의 노드의 자식이 있으면 재귀해준다
                    node.children.map((v: Node) => {
                        if (findNode) return;
                        if (v.active) {
                            map(v, nameV);
                        }
                    });
                } else {
                    //현재 노드와 받아온 노드의 부모를 찾아준다
                    if (node.name == nameV) {
                        findNode = node;
                        return;
                    }
                    //자식이 없으면 멈춤
                    if (node.children.length == 0) {
                        return;
                    }
                    //각각의 노드의 자식이 있으면 재귀해준다
                    node.children.map((v: Node) => {
                        if (findNode) return;

                        map(v, nameV);

                    });
                }



                return;
            }

            return findNode;

        } else {
            if (name.indexOf("/") >= 0) {
                return this.getChildByPath(name);
            } else {
                return this.getChildByName(name);
            }
        }
    }




    /**
    * 자신 포함 하위 노드의 붙어 있는 Component가  Param과 같으면 Node List를 뽑아 준다 
    * 만약 발견되 노드의 active false일경우 또는 부모 노드의 active false일경우 포함 되지 않는다 
    * * To do : 다만 현재는 발견된노드의 바로 위 부모의 active만 판단 
    */

    //cc.d.ts  21674
    Node.prototype["FindObjectsOfType"] = function (type: any, forceVisible?: boolean) {
        let nodes: Node[] = [];

        map(this, type);
        function map(node: Node, typeV: any) {
            //현재 노드와 받아온 노드의 부모를 찾아준다
            let components = node.getComponents(typeV);
            if (forceVisible == undefined) {

                if (node.active && components.length > 0) {
                    nodes.push(node);
                }

                //자식이 없으면 멈춤
                if (!node.active || node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v) => {
                    if (v.active) {
                        map(v, typeV);
                    }
                });
            } else {
                if (components.length > 0) {
                    nodes.push(node);
                }

                //자식이 없으면 멈춤
                if (node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v) => {
                    map(v, typeV);
                });
            }

            return;
        }

        return nodes;
    }


    /**
     * 자신 포함 하위 노드의 붙어 있는 Component가  Param과 같으면 Node 단일을 뽑아 준다 
     * 만약 발견되 노드의 active false일경우 또는 부모 노드의 active false일경우 포함 되지 않는다 
     * To do : 다만 현재는 발견된노드의 바로 위 부모의 active만 판단 
     */

    //cc.d.ts  21674
    Node.prototype["FindObjectOfType"] = function (type: any, forceVisible?: boolean) {
        let findNode: Node = null;

        map(this, type);

        function map(node: Node, typeV: any) {

            //현재 노드와 받아온 노드의 부모를 찾아준다
            let components = node.getComponents(typeV);

            if (forceVisible == undefined) {
                if (node.active && components.length > 0) {
                    findNode = node;
                }


                //자식이 없으면 멈춤
                if (!node.active || node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v) => {
                    if (findNode) return;
                    if (v.active) {
                        map(v, typeV);
                    }
                });
            } else {
                if (components.length > 0) {
                    findNode = node;
                }


                //자식이 없으면 멈춤
                if (node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v) => {
                    if (findNode) return;

                    map(v, typeV);

                });
            }
            return;
        }

        return findNode;
    }


}


/**
 * 유니티용 API
 */
export class GameObject {
    /**
     * Unity의 GameObject.Find("") 와 동일하며
     * 전체 노드중 해당 이름을 가진 노드를 찾아준다 
     * 만약 1개 이상일경우 최초 발견된 노드만 찾아준다 
     * @param name 
     * @returns 
     */
    static Find(name: string, forceVisible?: boolean) {
        let findNode: Node = null;
        let scene = director.getScene();
        let sceneChild = scene.children;

        map(scene, name);

        function map(node: any, nameV: string) {

            if (forceVisible == undefined) {
                //현재 노드와 받아온 노드의 부모를 찾아준다
                if (node.active && node.name == nameV) {
                    findNode = node;
                    return;
                }

                //자식이 없으면 멈춤
                if (!node.active || node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v: Node) => {
                    if (findNode) return;
                    if (v.active) {
                        map(v, nameV);
                    }
                });
            } else {
                //현재 노드와 받아온 노드의 부모를 찾아준다
                if (node.name == nameV) {
                    findNode = node;
                    return;
                }

                //자식이 없으면 멈춤
                if (node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v: Node) => {
                    if (findNode) return;
                    map(v, nameV);
                });
            }
            return;
        }

        return findNode;
    }


    static FindObjectsOfType(type: any, forceVisible?: boolean) {
        let nodes: Node[] = [];
        let scene = director.getScene();
        map(scene, type);
        function map(node: any, typeV: any) {
            //현재 노드와 받아온 노드의 부모를 찾아준다
            let components = node.getComponents(typeV);
            if (forceVisible == undefined) {

                if (node.active && components.length > 0) {
                    nodes.push(node);
                }

                //자식이 없으면 멈춤
                if (!node.active || node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v: Node) => {
                    if (v.active) {
                        map(v, typeV);
                    }
                });
            } else {
                if (components.length > 0) {
                    nodes.push(node);
                }

                //자식이 없으면 멈춤
                if (node.children.length == 0) {
                    return;
                }
                //각각의 노드의 자식이 있으면 재귀해준다
                node.children.map((v: Node) => {
                    map(v, typeV);
                });
            }

            return;
        }

        return nodes;
    }



}


/**
 * C# 큐 클래스
 */
export class Queue<T> {
    private _arr = [];
    constructor() {
        this._arr = [];
    }
    Enqueue(item: T) {
        this._arr.push(item);
    }
    Dequeue() {
        return this._arr.shift();
    }
    get Count() {
        return this._arr.length;
    }
}



/**
 * C# 스택 클래스
 */
export class Stack {
    private _arr = [];
    constructor() {
        this._arr = [];
    }
    Push(item) {
        this._arr.push(item);
    }
    Pop() {
        return this._arr.pop();
    }
    Peek() {
        return this._arr[this._arr.length - 1];
    }
}


/**
 * c#
 */
export class Convert {
    static toString(value: any) {
        return value.toString();
    }

    /**
     * 
     * @param value 
     * @param fromBase 진법을 10진법으로 변환
     * @returns 
     */
    static ToInt32(value: any, fromBase: number = 10) {
        return parseInt(value, fromBase);
    }


    static ToDouble(value: any) {
        return Number(value);
    }
    static ToBool(value: any) {
        return (value == "true" || value == 1) ? true : false;
    }

}







/**
 * Unity 호환 맵
 */
export class Dictionary<T, V> {
    private buffer: Map<T, V> = new Map<T, V>();

    public get(key: T): V {
        return this.buffer.get(key);
    }

    public set(key: T, value: V) {
        return this.buffer.set(key, value);
    }

    public get size(): number {
        return this.buffer.size;
    }

    public get Values(): V[] {
        let dataArray2: V[] = [];
        this.buffer.forEach((value, key, map) => {
            dataArray2.push(value);
        });

        return dataArray2
    }

    public get Keys(): T[] {
        let dataArray2: T[] = [];
        this.buffer.forEach((value, key, map) => {
            dataArray2.push(key);
        });
        return dataArray2
    }


    public clear() {
        this.buffer.clear();
    }

    public get dic(): Map<T, V> {
        return this.buffer;
    }


    /**
     * delete
     */
    public delete(key: T) {
        this.buffer.delete(key);
    }

    /**
     *  has
     */
    public has(key: T): boolean {
        return this.buffer.has(key);
    }

}


export class Mathf {
    ////Unity API

    public static inverseLerp(a: number, b: number, v: number) {
        return (v - a) / (b - a);
    }


    public static MoveTowards(out: Vec3, current: Vec3, target: Vec3, maxDistanceDelta: number) {
        // avoid vector ops because current scripting backends are terrible at inlining
        const toVector_x = target.x - current.x;
        const toVector_y = target.y - current.y;
        const toVector_z = target.z - current.z;
        const sqdist = toVector_x * toVector_x + toVector_y * toVector_y + toVector_z * toVector_z;
        if (sqdist == 0 || (maxDistanceDelta >= 0 && sqdist <= maxDistanceDelta * maxDistanceDelta)) {
            out.set(target);
            return true;
        }
        const dist = Math.sqrt(sqdist);
        out.set(current.x + toVector_x / dist * maxDistanceDelta,
            current.y + toVector_y / dist * maxDistanceDelta,
            current.z + toVector_z / dist * maxDistanceDelta)
        return false;
    }



    public static insideUnitSphere(x0: number, y0: number, z0: number, radius: number): Vec3 {
        var u = Math.random();
        var v = Math.random();
        var theta = 2 * Math.PI * u;
        var phi = Math.acos(2 * v - 1);
        var x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
        var y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
        var z = z0 + (radius * Math.cos(phi));
        return new Vec3(x, y, z);
    }
}
