

import { _decorator, Button, Label } from 'cc';
import { Action0 } from '../../../HumanScript/logic/Define';
import { PanelContext } from '../../../HumanScript/ui/panel/PanelContext';
const { ccclass, property } = _decorator;

export enum E_MESSAGE_BUTTON_TYPE {
    ONE,
    TWO,
}

@ccclass('MessageBoxPanelContext')
export class MessageBoxPanelContext extends PanelContext {
    @property(Label) title: Label = null;
    @property(Label) message: Label = null;
    @property(Button) button0: Button = null;
    @property(Button) button1: Button = null;

    @property(Label) button0Label: Label = null;
    @property(Label) button1Label: Label = null;

    private button0Callback?: Action0;
    private button1Callback?: Action0;

    public initBeforeAppear(title: string,
        message: string,
        option?: {
            buttonType?: E_MESSAGE_BUTTON_TYPE.ONE,
            button0Label?: string,
            button1Label?: string,
            button0ClickCallback?: Action0,
            button1ClickCallback?: Action0
        }) {

        this.title.string = title;
        this.message.string = message;


        if (option.buttonType) {
            switch (option.buttonType) {
                case E_MESSAGE_BUTTON_TYPE.ONE:
                    this.button0.node.x = 0;
                    this.button1.node.active = false;
                    break;
                case E_MESSAGE_BUTTON_TYPE.TWO:
                    this.button0.node.x = -210;
                    this.button1.node.active = true;
                    break;
            }
        }

        this.button0Callback = option && option.button0ClickCallback;
        this.button1Callback = option && option.button1ClickCallback;


        this.button0Label.string = "OK";
        this.button1Label.string = "Cancel";

        if (option) {
            if (option.button0Label) {
                this.button0Label.string = option.button0Label;
            }
            if (option.button1Label) {
                this.button1Label.string = option.button1Label;
            }
        }

    }


    /**
     * Override
     */
    public async onAppearStart() {
        await super.onAppearStart();
    }



    async onClickButton0() {
        this.onClickBack();

        if (this.button0Callback) {
            this.button0Callback();
        }



    }

    onClickButton1() {
        this.onClickBack();

        if (this.button1Callback) {
            this.button1Callback();
        }
    }

}