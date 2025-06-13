import { Component, EventHandler, js } from "cc";


export function named(target: any, key: string) {
    target[key].functionName = key;
}



function getMethodName(a: Function): string {
    let name = (a as any).functionName;
    return name || "";
}

/**
 * 주의 : 람다 형식 안된다, 합성 API의 함수 연결 안된다 
 * @param component 
 * @param handler 
 * @param customParam 
 * @returns 
 */
export function ccComponentEventHandler(component: Component, handler: Function, customParam?: any) {

    let clickEventHandler = new EventHandler();
    clickEventHandler.target = component.node;
    clickEventHandler.component = js.getClassName(component);
    clickEventHandler.handler = getMethodName(handler);;

    clickEventHandler.customEventData = customParam;
    return clickEventHandler;

}