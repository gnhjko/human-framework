

import { _decorator, Component, Node, Sprite, Camera, RenderTexture, SpriteFrame, gfx, director, Size } from 'cc';
import { Util } from '../core/Util';
import { Action0, Action1 } from '../logic/Define';

const { ccclass, property } = _decorator;


export enum ECapturePosition {
    ResultPopup,
    Aquarium,
    FishBook
}


@ccclass('CaptureToBase64')
export class CaptureToBase64 extends Component {


    //캡쳐 확인용 Sprite
    @property(Sprite)
    public testViewSprite: Sprite = null!;


    //캡쳐용 Camera
    @property(Camera)
    public renderTextureCamera: Camera = null!;

    protected _renderTex: RenderTexture | null = null;

    private captureScreenCanvas: HTMLCanvasElement;
    private captureScreenCTX: CanvasRenderingContext2D

    //캡쳐할 데이터 사이즈 
    private _width: number = 720;
    private _height: number = 1280;

    //최종 캔버스 사이즈
    public captureCanvasSize: Size = new Size(720, 570)

    start() {
        this.captureScreenCanvas = document.createElement('canvas');
        this.captureScreenCTX = this.captureScreenCanvas.getContext('2d');

        this.setCaptureCanvasSize(this.captureCanvasSize);
    }


    public async getBase64Data(): Promise<string> {
        return new Promise<string>(async (resolve: Action1<string>, reject: Action0) => {
            let renderTexture = await this.getRenderTexture();
            await Util.delay(100);
            let base64String: string = await this.copyRenderTex(renderTexture);

            this.renderTextureCamera.node.active = false;
            resolve(base64String);
        });
    }



    /**
     * 카메라를 캡쳐 해준다 
     * @returns 
     */
    public async getRenderTexture() {
        this.renderTextureCamera.node.active = true;


        let renderTex = this._renderTex = new RenderTexture();
        renderTex.reset({
            width: this._width,
            height: this._height,
        });


        this.renderTextureCamera.targetTexture = renderTex;

        return renderTex;


    }


    /**
     * 캡쳐된 이미지
     * @param renderTex 
     * @returns 
     */
    private async copyRenderTex(renderTex: RenderTexture) {

        let arrayBuffer = new ArrayBuffer(renderTex.width * renderTex.height * 4);

        let region = new gfx.BufferTextureCopy();

        region.texOffset.x = 0;

        region.texOffset.y = 0;

        region.texExtent.width = renderTex.width;

        region.texExtent.height = renderTex.height;

        let frambuffer = renderTex.window?.framebuffer!;
        director.root?.device["copyFramebufferToBuffer"](frambuffer, arrayBuffer, [region]);


        return this.base64ToImage(arrayBuffer)
    }



    /**
     * 데이터 버퍼 -> base64이미지로 변환해준다
     * @param dataBuffer 
     * @returns 
     */
    private base64ToImage(dataBuffer: ArrayBuffer): string {

        let data: Uint8Array = new Uint8Array(dataBuffer);

        let rowBytes = this._width * 4;
        for (let row = 0; row < this._height; row++) {
            let srow = this._height - 1 - row;
            let imageData = this.captureScreenCTX.createImageData(this._width, 1);
            let start = srow * this._width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }

            this.captureScreenCTX.putImageData(imageData, 0, row);
        }

        let dataUrl = this.captureScreenCanvas.toDataURL("image/jpeg");


        return dataUrl;
    }


    /**
     * 최종 캡쳐용 캔버스 사이즈
     * 해당 사이즈 만큼 base64 데이터 추출
     * @param size 
     */
    setCaptureCanvasSize(size: Size) {
        this.captureScreenCanvas.width = size.width;
        this.captureScreenCanvas.height = size.height;
    }


}

