
import { Component, _decorator } from 'cc';
import * as i18n from 'db://i18n/LanguageData'

const { ccclass, property } = _decorator;

/**
 * resources -> i18n -> ko.json
 * 각 Label에 LocalizedLabel컴포넌트를 추가하고 key값을 입력하면 해당 키값에 맞는 언어로 변경된다.
 * 이미지 변경시 해당 노드에 LocalizedImage컴포넌트를 추가하고 key값을 입력하면 해당 키값에 맞는 이미지로 변경된다.
 */

@ccclass('LanguageManager')
export class LanguageManager extends Component {

    public static Inst: LanguageManager = null;

    onLoad() {
        LanguageManager.Inst = this;
    }


    public static LANG: string = "en";	// 언어처리


    public async init() {
        this.setLocale();
    }



    // 시스템의 기본 지역설정을 가져와서 한국어 혹은 영어로 언어를 설정한다.
    public setLocale() {

        try {
            let lang: string = (navigator.language) ? navigator.language : "en_US";
            if (lang.indexOf("ko") > -1) { // en-US, ko-KR
                LanguageManager.LANG = "ko"; // 한글
            } else if (lang.indexOf("jp") > -1) {
                LanguageManager.LANG = "jp"; // 일본어.
            } else {
                LanguageManager.LANG = "en"; // 한글 아니면 다 영어로.
            }
        } catch {
            LanguageManager.LANG = "ko";
        }



        i18n.init(LanguageManager.LANG)
        i18n.updateSceneRenderers()
    }


    public updateLocale(lang: string) {
        LanguageManager.LANG = lang
        i18n.init(lang)
        i18n.updateSceneRenderers()
    }


    //각 언어별 텍스트 가져오기
    public static getString(key: string): string {
        return i18n.t(key)
    }

}
