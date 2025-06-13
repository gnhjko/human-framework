import { _decorator, Component, Node } from 'cc';
import { CoroutineManager, WaitForSeconds } from '../../HumanScript/managers/CoroutineManager';
const { ccclass, property } = _decorator;

@ccclass('CoroutineTest')
export class CoroutineTest extends Component {
    async start() {
        CoroutineManager.startCoroutine(this.testCoroutine(),this);

        await this.testAsync();

        
    }

    public async testAsync() {
        await new Promise((resolve) => {
            setTimeout(() => {
                resolve(true);
            }, 1000);
        });
    }


    public *testCoroutine() {
        let count = 0;
        while (count < 10) {
            yield new WaitForSeconds(1);
            count++;
            console.log("testCoroutine", count);
        }
    }

 
}


