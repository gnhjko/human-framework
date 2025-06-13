import { PanelContext } from "./PanelContext";

export class PanelStackController {
    stack: PanelContext[] = [];

    clear() {
        this.stack = [];
    }

    size(): number {
        return this.stack.length;
    }

    push(panelContext: PanelContext): void {
        // 동일한 panelContext가 존재하는지 확인
        const existingIndex = this.stack.findIndex(context => context === panelContext);

        // 동일한 panelContext가 존재하면 제거
        if (existingIndex !== -1) {
            this.stack.splice(existingIndex, 1);
        }

        // panelContext를 stack의 맨 뒤에 추가
        this.stack.push(panelContext);
    }

    splice(index: number): PanelContext | undefined {
        return this.stack.splice(index, 1)[0];
    }

    pop(): PanelContext | undefined {
        return this.stack.pop();
    }

    peek(): PanelContext | undefined {
        return this.stack.length > 0 ? this.stack[this.stack.length - 1] : undefined;
    }

    remove(panelContext: PanelContext) {
        let index = this.stack.findIndex((panel) => panel === panelContext);
        if (index >= 0) {
            this.stack.splice(index, 1);
        }
    }

    contains(panelContext: PanelContext): boolean {
        // 원래 로비가 항상 바닥이었으므로 아래와 같았으나, 에러 팝업은 로비없이도 나올 수 있음
        //return this.findIndex(panelContext) ? true : false;
        return 0 <= this.findIndex(panelContext);
    }

    containsName(name: string): boolean {
        for (let i = 0; i < this.stack.length; i++) {
            let panel = this.stack[i];
            if (panel.name === name) {
                return true;
            }
        }
        return false;
    }

    findIndex(panel: PanelContext): number | undefined {
        let index = this.stack.findIndex(p => p === panel);
        return index >= 0 ? index : undefined;
    }




    getAllPanels(): PanelContext[] {
        return this.stack.slice();
    }

    getPanel(panelName: string): PanelContext {
        let panel = this.stack.find(p => p.name === panelName);
        return panel;
    }

}