import { _decorator, Component, instantiate, Prefab } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Coin2D')
export class Coin2D extends Component {
    @property(Prefab) twinkleParticlePrefab: Prefab = null;


    public init() {
        if (this.twinkleParticlePrefab != null) {
            let clone = instantiate(this.twinkleParticlePrefab);
            clone.parent = this.node;
            clone.active = false;
        }
    }
}


