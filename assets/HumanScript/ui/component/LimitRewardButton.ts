import { _decorator, Component, Node, Button, Label, sys } from 'cc';
const { ccclass, property } = _decorator;

// 저장소 키 이름을 enum으로 관리
enum StorageKey {
    LAST_REWARD_TIME = 'last_reward_time'
}

// 버튼 상태 enum
enum ButtonState {
    ACTIVE = 'active',
    INACTIVE = 'inactive'
}


/**
 * Local Storage LAST_REWARD_TIME를 사용하여 마지막 보상 시간을 저장하여 제한 시간 내에 보상 획득을 위한 버튼
 * 1. interactableButton : 버튼 컴포넌트
 * 2. limitTimeLabel : 제한 시간 레이블
 * 3. limitTimeSeconds : 제한 시간(초)
 * 4. 외부코드에서 init 호출하여 초기화
 * 
 * this.adRewardButton.node.getComponent(LimitRewardButton).init( "+" + DEFINE.adRewardCount.toString());
 * this.adRewardButton.interactable = this.adRewardButton.node.getComponent(LimitRewardButton).isActive;
 */
@ccclass('LimitRewardButton')
export class LimitRewardButton extends Component {

    @property(Button)
    interactableButton: Button = null!;

    @property(Label)
    limitTimeLabel: Label = null!;

    @property({ tooltip: '제한 시간(초)' })
    limitTimeSeconds: number = 60;

    private _timer: number | null = null;
    private _currentState: ButtonState = ButtonState.INACTIVE;

    public rewardCountString: string = "AA";


    // 외부에서 활성화 상태를 확인할 수 있는 getter
    get isActive(): boolean {
        return this._currentState === ButtonState.ACTIVE;
    }

  


    public init(rewardCount: string) {
        this.rewardCountString = rewardCount.toString();
        this.checkButtonState();
        this._startTimer();
    }


    onDisable() {
        // 타이머 정리
        this._clearTimer();
    }

    // 버튼 상태 확인
    private checkButtonState() {
        const lastRewardTime = this._getLastRewardTime();
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastRewardTime;

        console.log(`마지막 보상 시간: ${new Date(lastRewardTime).toLocaleString()}`);
        console.log(`현재 시간: ${new Date(currentTime).toLocaleString()}`);
        console.log(`경과 시간: ${elapsedTime / 1000}초`);

        if (elapsedTime >= this.limitTimeSeconds * 1000 || lastRewardTime === 0) {
            this.onActive();
        } else {
            this.onDeActive();
            this._updateRemainingTime(elapsedTime);
        }
    }

    // 보상 받기 - 버튼 클릭 이벤트에 연결해야 함
    public onRewardClaimed() {
        // 현재 시간 저장
        this._saveLastRewardTime();
        // 버튼 비활성화
        this.onDeActive();
        // 타이머 시작
        this._startTimer();

        console.log("보상 받음! 타이머 시작");
    }

    // 활성화
    private onActive() {
        if (this._currentState === ButtonState.ACTIVE) return;

        this._currentState = ButtonState.ACTIVE;
        if (this.interactableButton) {
            this.interactableButton.interactable = true;
        }
        if (this.limitTimeLabel) {
            this.limitTimeLabel.string = this.rewardCountString;
        }

        console.log("버튼 활성화됨");
    }

    // 비활성화
    private onDeActive() {
        if (this._currentState === ButtonState.INACTIVE) return;

        this._currentState = ButtonState.INACTIVE;
        if (this.interactableButton) {
            this.interactableButton.interactable = false;
        }

        console.log("버튼 비활성화됨");
    }

    // 마지막 보상 시간 가져오기
    private _getLastRewardTime(): number {
        const timeStr = sys.localStorage.getItem(StorageKey.LAST_REWARD_TIME);
        return timeStr ? parseInt(timeStr) : 0;
    }

    // 현재 시간 저장하기
    private _saveLastRewardTime() {
        const now = Date.now();
        sys.localStorage.setItem(StorageKey.LAST_REWARD_TIME, now.toString());
        console.log(`저장된 시간: ${new Date(now).toLocaleString()}`);
    }

    // 타이머 시작
    private _startTimer() {
        this._clearTimer();
        this._updateTimer();
        this._timer = setInterval(() => {
            this._updateTimer();
        }, 1000) as unknown as number;
    }

    // 타이머 정리
    private _clearTimer() {
        if (this._timer !== null) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    // 타이머 업데이트
    private _updateTimer() {
        const lastRewardTime = this._getLastRewardTime();
        const currentTime = Date.now();
        const elapsedTime = currentTime - lastRewardTime;

        if (elapsedTime >= this.limitTimeSeconds * 1000) {
            this.onActive();
            this._clearTimer();
        } else {
            this._updateRemainingTime(elapsedTime);
        }
    }

    // 남은 시간 표시 업데이트
    private _updateRemainingTime(elapsedTime: number) {
        const remainingSeconds = Math.ceil((this.limitTimeSeconds * 1000 - elapsedTime) / 1000);
        const minutes = Math.floor(remainingSeconds / 60);
        const seconds = remainingSeconds % 60;

        // 00:00 형식으로 표시
        if (this.limitTimeLabel) {
            this.limitTimeLabel.string = `${minutes.toString()['padStart'](2, '0')}:${seconds.toString()['padStart'](2, '0')}`;
        }

        console.log(`남은 시간: ${minutes}분 ${seconds}초`);
    }
}
