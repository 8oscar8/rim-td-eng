/**
 * TutorialManager.js
 * 게임 초반부 사용자 가이드를 단계별로 진행합니다.
 */
export class TutorialManager {
    constructor(app) {
        this.app = app;
        this.currentStep = 0;
        this.tutorialData = [
            {
                msg: "📡 [Emergency Transmission]\nWelcome, Overseer. You have crash-landed on a desolate planet in the Rim. \n\nYou must survive 100 waves until the ship can be rebooted. A large raid is coming soon. Defend the settlement to survive!",
                mission: null,
                canNext: true
            },
            {
                msg: "First, you need personnel to establish a defense line.\n\nClick the [Recruit Unit] button (Q) in the shop below to secure a unit, \nand click on the map (near the circular path) to deploy them.",
                mission: "Recruit and Deploy a unit (Q -> Click)",
                canNext: false,
                trigger: 'place_unit',
                pointer: '#btn-buy-random'
            },
            {
                msg: "Successful. Now you must put your colonists to work.\n\nScroll down the right sidebar to find the [Colonist Assignment] section.",
                mission: "Scroll down to find Assignment section",
                canNext: false,
                trigger: 'view_dispatch',
                pointer: '.work-management'
            },
            {
                msg: "Great. Assigning colonists here allows you to continuously produce survival resources such as Food, Research, Wood, and Steel.\n\nTry assigning all idle colonists until the count reaches 0 using the [+] buttons or shortcuts.",
                mission: "Assign all colonists to tasks (Reach 0 idle)",
                canNext: false,
                trigger: 'assign_all_workers',
                pointer: '.btn-circle.plus'
            },
            {
                msg: "Perfect! This is where you put your idle population to work.\n\nWhile they gather resources, let's increase our combat power. Click the [Train] tab.",
                mission: "Click the [Train] tab",
                canNext: false,
                trigger: 'switch_tab_train',
                pointer: '.tab-btn[data-tab="train"]'
            },
            {
                msg: "You can increase attack power for each weapon type (Blunt/Sharp/Ranged).\n\nTry upgrading your combat power by clicking the [Upgrade] button for any category.",
                mission: "Execute 1 unit upgrade",
                canNext: false,
                trigger: 'upgrade_unit',
                pointer: '#up-ranged' 
            },
            {
                msg: "You've established basic firepower through training. Excellent!\n\nBelow the weapon upgrades, you'll find [Production & Assignment Upgrades]. \n\nDon't forget that you can increase resource yield by enhancing efficiency here!",
                mission: "Check Production & Assignment Upgrades",
                canNext: true,
                pointer: '.prod-up'
            },
            {
                msg: "Once you've gathered enough resources, move to the [Craft] tab at the top.",
                mission: "Click the [Craft] tab",
                canNext: false,
                trigger: 'switch_tab_craft',
                pointer: '.tab-btn[data-tab="craft"]'
            },
            {
                msg: "Here, you can spend resources to guaranteed-obtain a tower of a specific grade.\n\nUse this when you need reliable power reinforcement instead of relying on luck. \n\nNext, let's move to the [Special] tab.",
                mission: "Click the [Special] tab",
                canNext: false,
                trigger: 'switch_tab_special',
                pointer: '.tab-btn[data-tab="special"]'
            },
            {
                msg: "You've reached the [Special] tab safely! This is the space where you can craft and use powerful [Consumables] that can decide the outcome of battle.",
                mission: "Check the Special Consumables section",
                canNext: true,
                pointer: '.tab-pane.active'
            },
            {
                msg: "Now, scroll down the left sidebar.\n\nYou can craft the items listed here to use in case of emergency.",
                mission: "Scroll down to find [Special Items]",
                canNext: false,
                trigger: 'view_special_items',
                pointer: '.item-section'
            },
            {
                msg: "Well done! Consumables are powerful tools to turn the tide in critical moments.\n\nFinally, check the [Settlement Mood] at the top left.",
                mission: "Check Colonist Mood status",
                canNext: true,
                pointer: '.mood-card'
            },
            {
                msg: "If Mood drops below 25%, colonists may go on strike or have mental breaks.\n\nAlways make sure to manage their mood. \n\n[End Transmission] Basic training complete. Good luck!",
                mission: null,
                canNext: true
            }
        ];
        
        this.overlay = document.getElementById('tutorial-overlay');
        this.msgEl = document.getElementById('tutorial-msg');
        this.missionEl = document.getElementById('tutorial-mission');
        this.missionText = document.getElementById('mission-text');
        this.nextBtn = document.getElementById('tutorial-next-btn');
        this.skipBtn = document.getElementById('tutorial-skip-btn');
        this.pointer = document.getElementById('tutorial-pointer');
        
        this.initEvents();
    }

    start() {
        this.currentStep = 0;
        this.showStep();
        this.overlay.classList.remove('hidden');
    }

    initEvents() {
        if (this.nextBtn) {
            this.nextBtn.onclick = () => this.nextStep();
        }
        if (this.skipBtn) {
            this.skipBtn.onclick = () => this.finish();
        }
    }

    showStep() {
        const step = this.tutorialData[this.currentStep];
        if (!step) {
            this.finish();
            return;
        }

        // 창이 숨겨져 있으면 다시 표시
        this.overlay.classList.remove('hidden');

        this.msgEl.textContent = step.msg;
        
        if (step.mission) {
            this.missionEl.classList.remove('hidden');
            this.missionText.textContent = step.mission;
        } else {
            this.missionEl.classList.add('hidden');
        }

        // '다음' 버튼 노출 여부는 canNext 속성에 따름
        if (this.nextBtn) {
            this.nextBtn.style.display = step.canNext ? 'block' : 'none';
        }

        // [New] 화살표 위치 업데이트
        this.updatePointer(step.pointer);

        // [New] 업그레이드 단계 진입 시 자원이 부족할 수 있으므로 최소량(1) 보충해줌
        if (step.trigger === 'upgrade_unit') {
            const s = this.app.state;
            s.silver = Math.max(s.silver, 1);
            s.wood = Math.max(s.wood, 1);
            s.steel = Math.max(s.steel, 1);
            s.plasteel = Math.max(s.plasteel, 1);
            this.app.ui.updateDisplays(s);
        }

        // 버튼 노출 및 텍스트 정밀 제어
        const isLastStep = this.currentStep === this.tutorialData.length - 1;

        // '다음' 버튼: 마지막 단계가 아니고 canNext가 true일 때만 표시
        if (this.nextBtn) {
            this.nextBtn.style.display = (step.canNext && !isLastStep) ? 'block' : 'none';
        }

        // '건너뛰기/완료' 버튼: 마지막 단계에서만 '완료'로 변경
        if (this.skipBtn) {
            this.skipBtn.textContent = isLastStep ? "Finish Tutorial" : "Skip Tutorial";
        }
    }

    /**
     * [New] 지시 화살표를 특정 요소 위에 배치 및 실시간 추적
     */
    updatePointer(selector) {
        this.currentTargetSelector = selector;
        if (!this.pointer) return;

        // 이전 하이라이트 제거
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        if (!selector) {
            this.pointer.classList.add('hidden');
            return;
        }

        // 실시간 추적 루프 시작
        this.startPointerLoop();
    }

    startPointerLoop() {
        if (this.pointerLoopId) return;
        
        const loop = () => {
            if (!this.currentTargetSelector) {
                this.stopPointerLoop();
                return;
            }

            const target = document.querySelector(this.currentTargetSelector);
            if (target) {
                // 타겟 하이라이트 중복 방지
                if (!target.classList.contains('tutorial-highlight')) {
                    target.classList.add('tutorial-highlight');
                }

                const rect = target.getBoundingClientRect();
                
                // [New] 파견 구역 혹은 특수 아이템 구역이 화면 중앙 근처에 보이면 자동으로 다음 단계로 진행
                if ((this.currentTargetSelector === '.work-management' || this.currentTargetSelector === '.item-section') && rect.top < window.innerHeight * 0.8) {
                     const step = this.tutorialData[this.currentStep];
                     if (step && (step.trigger === 'view_dispatch' || step.trigger === 'view_special_items')) {
                         this.trigger(step.trigger);
                     }
                }

                // 타겟이 화면 밖에 있으면 숨김 처리
                if (rect.top < 0 || rect.bottom > window.innerHeight) {
                    this.pointer.classList.add('hidden');
                } else {
                    this.pointer.classList.remove('hidden');
                    this.pointer.style.left = `${rect.left + rect.width / 2}px`;
                    this.pointer.style.top = `${rect.top - 55}px`;
                }
            } else {
                this.pointer.classList.add('hidden');
            }

            this.pointerLoopId = requestAnimationFrame(loop);
        };
        this.pointerLoopId = requestAnimationFrame(loop);
    }

    stopPointerLoop() {
        if (this.pointerLoopId) {
            cancelAnimationFrame(this.pointerLoopId);
            this.pointerLoopId = null;
        }
    }

    nextStep() {
        this.currentStep++;
        this.showStep();
    }

    /**
     * 외부(App)에서 특정 행동이 발생했을 때 호출
     */
    trigger(action) {
        const step = this.tutorialData[this.currentStep];
        if (!step) return;

        // [New Exception] 유닛 구매 시 창을 즉시 숨김 (통합 안내 단계에서)
        if (action === 'buy_unit' && step.trigger === 'place_unit') {
            this.hide();
            return;
        }

        if (step.trigger === action) {
            this.nextStep();
        }
    }

    finish() {
        this.overlay.classList.add('hidden');
        this.updatePointer(null); // 화살표 제거
        // 튜토리얼이 끝나면 게임 일시정지 해제
        this.app.state.isPaused = false;
        this.app.ui.addMiniNotification("Tutorial complete! Good luck.", "info");
    }

    /**
     * [New] 튜토리얼 창 일시 숨김 (배치 중 등)
     */
    hide() {
        this.overlay.classList.add('hidden');
        this.updatePointer(null);
    }

    /**
     * [New] 튜토리얼 창 다시 표시
     */
    show() {
        if (this.overlay.classList.contains('hidden')) {
            this.overlay.classList.remove('hidden');
            this.showStep();
        }
    }

    /**
     * 특정 행동이 현재 허용되는지 확인
     */
    isActionAllowed(action) {
        // 튜토리얼이 끝났거나(UI가 숨겨짐), 건너뛰었다면 모든 행동 허용
        if (this.overlay.classList.contains('hidden')) return true;

        const step = this.tutorialData[this.currentStep];
        if (!step) return true;

        // [Critical Fix] '다음' 버튼으로만 넘어가는 단순 안내 단계(예: 첫 인사)라면 모든 게임 행동 차단
        if (step.canNext && !step.mission) return false;

        // [New Exception] 배치 미션 중에는 구매 행동도 허용함
        if (action === 'buy_unit' && step.trigger === 'place_unit') return true;

        // [New Exception] 탭 전환 미션 중에는 탭 버튼 활성화 허용
        if (action === 'switch_tab' && step.trigger && step.trigger.startsWith('switch_tab_')) return true;

        // 현재 단계의 트리거가 없으면 자유로운 조작 허용 (미션이 완료된 마지막 안내 등)
        if (!step.trigger) return true;

        // 현재 단계의 트리거와 일치하는 행동만 허용
        return step.trigger === action;
    }
}
