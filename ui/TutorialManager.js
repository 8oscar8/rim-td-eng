/**
 * TutorialManager.js
 * Step-by-step guide system to help with initial game adaptation (Mission-type)
 */
export class TutorialManager {
    constructor(gameCore) {
        this.gameCore = gameCore;
        this.currentStep = 0;
        this.isActive = false;
        this.isStepTransitioning = false;

        // UI Element Reference
        this.fetchElements();

        // Tutorial Step Definitions
        this.steps = [
            {
                title: "Objective: 100 Days of Survival",
                desc: "You must defend the base for <b>100 Days (100 Waves)</b> until the rimworld rescue ship arrives. Maintain your defense line at all costs during every raid.",
                targetId: "wave-display",
                actionType: "click_next"
            },
            {
                title: "Defeat Condition: Defense Threshold",
                desc: "If the <b>Enemy Count</b> remaining on the field exceeds <b>100</b>, the defense line will collapse completely, resulting in a Game Over. Always watch the enemy count on the left.",
                targetId: "enemy-count",
                actionType: "click_next"
            },
            {
                title: "Resource Management: Dispatching Colonists",
                desc: "The basis of survival. In the dispatch management at the bottom, try assigning 1 colonist by clicking the <b>[+]</b> button next to <b>Logging (Wood)</b>.",
                targetId: "right-ui",
                actionType: "dispatch_worker"
            },
            {
                title: "Securing Weapons: Shop Purchase",
                desc: "You can hire random units with your starting 100 Silver. Click the <b>[🎁 Shop]</b> tab and then the <b>[Buy Random Unit]</b> button.",
                targetId: "tab-btn-shop",
                actionType: "buy_unit"
            },
            {
                title: "Specialization: Professional Skill Training",
                desc: "In the <b>Train</b> tab, you can permanently enhance your colonists' work efficiency. Increase Mining and Trading proficiency to prepare for the late game.",
                targetId: "tab-btn-train",
                actionType: "tab_train"
            },
            {
                title: "Enhancing Firepower: Technology Upgrades",
                desc: "The <b>Upgrades</b> at the bottom strengthen the attack power of Blunt, Sharp, and Ranged weapon types. Invest carefully as they consume equivalent <b>Silver</b>.",
                targetId: "upgrade-list",
                actionType: "click_next"
            },
            {
                title: "Tactical Manual: Unit Deployment",
                desc: "Scenario-issued weapons are waiting! Click on the white <b>buildable zones</b> on the battlefield to deploy your colonists. Total war begins once all weapons are deployed.",
                targetId: "tower-info", 
                actionType: "place_unit"
            }
        ];

        this.initEvents();
    }

    fetchElements() {
        this.overlay = document.getElementById('tutorial-overlay');
        this.titleEl = document.getElementById('tutorial-title');
        this.descEl = document.getElementById('tutorial-desc');
        this.stepTag = document.getElementById('tutorial-step-tag');
        this.pointer = document.getElementById('tutorial-pointer');
        this.btnNext = document.getElementById('btn-tutorial-next');
        this.btnSkip = document.getElementById('btn-tutorial-skip');
    }

    initEvents() {
        if (this.btnNext) {
            this.btnNext.onclick = () => this.nextStep();
        }
        if (this.btnSkip) {
            this.btnSkip.onclick = () => this.finish();
        }
    }

    start() {
        this.fetchElements();
        if (!this.overlay) return;
        
        console.log("Tutorial Starting...");
        this.isActive = true;
        this.currentStep = 0;
        this.isStepTransitioning = false;
        this.overlay.style.display = 'flex';
        this.overlay.style.justifyContent = 'center';
        this.overlay.style.alignItems = 'center';
        this.showStep();
    }

    showStep() {
        const step = this.steps[this.currentStep];
        if (!step) {
            this.finish();
            return;
        }

        this.btnNext.style.display = 'none';
        this.stepTag.innerText = `Guide ${this.currentStep + 1} / ${this.steps.length}`;
        this.titleEl.innerText = step.title;
        this.descEl.innerHTML = step.desc;

        if (step.targetId) {
            this.pointTo(step.targetId);
        } else {
            this.pointer.style.display = 'none';
        }

        const isMissionStep = ['dispatch_worker', 'buy_unit', 'tab_train', 'place_unit'].includes(step.actionType);

        if (isMissionStep) {
            this.btnNext.style.display = 'none';
            if (step.actionType === 'place_unit') {
                this.gameCore.processNextPlacement();
            }
        } else {
            this.btnNext.style.display = 'block';
            if (this.currentStep === this.steps.length - 1) {
                this.btnNext.innerText = "I understand";
            } else {
                this.btnNext.innerText = "Next Step";
            }
        }
    }

    nextStep() {
        const step = this.steps[this.currentStep];
        const isMissionStep = ['dispatch_worker', 'buy_unit', 'tab_train', 'place_unit'].includes(step.actionType);
        
        if (isMissionStep && this.isActive) return;

        this.currentStep++;
        this.showStep();
    }

    pointTo(elementId) {
        const target = document.getElementById(elementId);
        if (!target) {
            this.pointer.style.display = 'none';
            return;
        }

        const rect = target.getBoundingClientRect();
        this.pointer.style.display = 'block';
        this.pointer.style.top = (rect.top - 40) + 'px';
        this.pointer.style.left = (rect.left + rect.width / 2 - 15) + 'px';

        document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
        target.classList.add('tutorial-highlight');
    }

    onAction(type) {
        if (!this.isActive || this.isStepTransitioning) return;
        
        const step = this.steps[this.currentStep];
        if (type === step.actionType) {
            if (type === 'dispatch_worker') {
                this.isStepTransitioning = true;
                this.descEl.innerHTML = "<b style='color:#2ecc71'>Success!</b> The colonist has started working. Let's move on.";
                setTimeout(() => {
                    this.isStepTransitioning = false;
                    this.nextStep();
                }, 1500);
            }
            else if (type === 'buy_unit') {
                this.isStepTransitioning = true;
                this.descEl.innerHTML = "<b style='color:#2ecc71'>Success!</b> Weapon secured. Let's learn deployment.";
                setTimeout(() => {
                    this.isStepTransitioning = false;
                    this.nextStep();
                }, 1500);
            }
            else if (type === 'tab_train') {
                this.isStepTransitioning = true;
                this.descEl.innerHTML = "<b style='color:#2ecc71'>Success!</b> This is the Train tab. Check your weapon enhancements.";
                setTimeout(() => {
                    this.isStepTransitioning = false;
                    this.nextStep();
                }, 1500);
            }
            else if (type === 'place_unit') {
                const pending = this.gameCore.pendingPlacements.length;
                if (pending === 0 && !this.gameCore.pendingGachaResult) {
                    this.finish();
                } else {
                    const count = pending + (this.gameCore.pendingGachaResult ? 1 : 0);
                    this.descEl.innerHTML = `Great! Deploy the remaining units. (Remaining: <b>${count}</b>)`;
                }
            }
        }
    }

    finish() {
        this.isActive = false;
        this.overlay.style.display = 'none';
        this.pointer.style.display = 'none';
        document.querySelectorAll('.tutorial-highlight').forEach(el => el.classList.remove('tutorial-highlight'));
        
        localStorage.setItem('rim_td_tutorial_complete', 'true');
        this.gameCore.addNotification("Guide Complete", "Now build your settlement!", "success");

        if (this.gameCore.waveManager) {
            this.gameCore.waveManager.startNextWave();
        }
    }
}
