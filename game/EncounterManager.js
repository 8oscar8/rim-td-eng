/**
 * EncounterManager.js
 * 림월드 스타일의 랜덤 이벤트(인카운터) 시스템을 관리합니다.
 */
import { GachaSystem } from './GachaSystem.js';
import { WEAPON_DB } from './WeaponData.js';
import { SoundManager } from '../engine/SoundManager.js';

export class EncounterManager {
  constructor(app) {
    this.app = app;
    this.nextEventTimer = this.getRandomInterval();
    this.activeEvents = []; // 현재 지속 중인 이벤트 (독성 낙진 등)
    
    // UI 캐싱
    this.modal = document.getElementById('encounter-modal');
    this.modalTitle = document.getElementById('event-modal-title');
    this.modalText = document.getElementById('event-modal-text');
    this.modalCloseBtn = document.getElementById('event-modal-close-btn');
    this.activeEventsContainer = document.getElementById('active-events-container');

    // [New] 선택 전용 버튼 캐싱
    this.choiceBtnContainer = document.getElementById('event-modal-choice-btns');
    this.acceptBtn = document.getElementById('event-modal-accept-btn');
    this.rejectBtn = document.getElementById('event-modal-reject-btn');

    // 모달 닫기 이벤트 (기본)
    if (this.modalCloseBtn) {
        this.modalCloseBtn.onclick = (e) => {
            if (e) e.stopPropagation();
            this.modal.classList.add('hidden');
            this.app.state.isPaused = false; // 일시정지 해제
        };
    }
  }

  getRandomInterval() {
    return 180 + Math.random() * 180;
  }

  update(dt) {
    // 게임이 일시정지 상태면 타이머 진행 안 함 (모달 열려있을 때 등)
    if (this.app.state.isPaused) return;

    // 1. 이벤트 주기 타이머 갱신 (100라운드 미만일 때만 새 이벤트 발생)
    this.nextEventTimer -= dt;
    if (this.nextEventTimer <= 0 && this.app.state.waveNumber < 100) {
      this.triggerRandomEvent();
      this.nextEventTimer = this.getRandomInterval();
    }

    // 2. 지속 이벤트 시간 갱신 및 UI 업데이트
    this.updateActiveEvents(dt);
  }

  // 글로벌 은화 배율 계산 (암브로시아 등 반영)
  getGlobalSilverMultiplier() {
    let multiplier = 1.0;
    if (this.activeEvents.some(e => e.id === 'ambrosia_sprout')) {
        multiplier *= 2.0;
    }
    return multiplier;
  }

  // 글로벌 작업량 배율 계산 (작업 영감 반영)
  getGlobalWorkMultiplier(jobType) {
    let multiplier = 1.0;
    const inspiration = this.activeEvents.find(e => e.id === 'work_inspiration' && e.targetJob === jobType);
    if (inspiration) {
        multiplier *= 3.0;
    }
    return multiplier;
  }

  // 글로벌 루시페륨 효과 배율 계산 (공속/데미지)
  getGlobalLuciferiumMultiplier() {
    let multiplier = 1.0;
    if (this.activeEvents.some(e => e.id === 'confused_wander')) {
        multiplier *= 0.9; // 정신 방황: 10% 감소
    }
    if (this.activeEvents.some(e => e.id === 'luciferium')) {
        multiplier *= 1.5; // 데미지 1.5배, 공속은 Tower.js에서 별도 처리
    }
    return multiplier;
  }

  // 글로벌 공격 속도 배율 계산 (정신적 안정파 등 반영)
  getGlobalAttackSpeedMultiplier() {
    let multiplier = 1.0;
    if (this.activeEvents.some(e => e.id === 'confused_wander')) {
        multiplier *= 0.9; // 정신 방황: 10% 감소
    }
    if (this.activeEvents.some(e => e.id === 'psychic_soothe')) {
        multiplier *= 1.5; // 정신적 안정파: 50% 공속 보너스
    }
    if (this.activeEvents.some(e => e.id === 'luciferium')) {
        multiplier *= 2.0; // 루시페륨: 100% 공속 보너스
    }
    return multiplier;
  }

  updateActiveEvents(dt) {
    // 1. 지속 시간 갱신 및 종료 이벤트 처리
    const finishedEvents = [];
    this.activeEvents.forEach(ev => {
      ev.duration -= dt;
      if (ev.duration <= 0) {
        finishedEvents.push(ev);
      }
    });

    // 2. 종료된 이벤트 처리
    finishedEvents.forEach(ev => {
      this.app.ui.addMiniNotification(`Event ended: ${ev.name}`, 'info');
      if (ev.id === 'luciferium') this.app.destroyRandomTower();
      
      // [New] 정신 이상 극복 시 카타르시스 보상 지급
      if (ev.isMentalBreak) {
          this.applyCatharsis();
      }
    });

    this.activeEvents = this.activeEvents.filter(e => e.duration > 0);

    // 3. UI 업데이트 (이벤트 목록 자체가 변했을 때만 전체 갱신)
    const currentEventIds = this.activeEvents.map(e => e.id).join(',');
    if (this._lastEventIds !== currentEventIds) {
        this._lastEventIds = currentEventIds;
        this.renderActiveEventsUI();
    }

    // 4. 시간만 업데이트 (innerHTML 교체 없이 텍스트만 갱신하여 흔들림 방지)
    this.updateEventTimers();
  }

  updateEventTimers() {
    if (!this.activeEventsContainer) return;
    this.activeEvents.forEach(ev => {
      const timerSpan = document.getElementById(`timer-${ev.id}`);
      if (timerSpan) {
        timerSpan.textContent = `${Math.max(0, Math.ceil(ev.duration))}s`;
      }
    });
  }

  renderActiveEventsUI() {
    if (!this.activeEventsContainer) return;
    
    let uiHtml = "";
    this.activeEvents.forEach(ev => {
      let borderColor = (ev.type === 'positive') ? "#a855f7" : "#ef4444";
      let bgColor = (ev.type === 'positive') ? "rgba(168, 85, 247, 0.2)" : "rgba(239, 68, 68, 0.2)";

      if (ev.id === 'psychic_soothe') { borderColor = "#22d3ee"; bgColor = "rgba(34, 211, 238, 0.2)"; }
      else if (ev.id === 'work_inspiration') { borderColor = "#facc15"; bgColor = "rgba(250, 204, 21, 0.2)"; }
      else if (ev.id === 'luciferium') { borderColor = "#991b1b"; bgColor = "rgba(153, 27, 27, 0.2)"; }
      else if (ev.id === 'solar_flare') { borderColor = "#ea580c"; bgColor = "rgba(234, 88, 12, 0.2)"; }

      uiHtml += `
        <div class="event-tag" 
             style="border-left-color: ${borderColor}; background: ${bgColor};"
             onmouseenter="window.app.ui.showEventTooltip(event, '${ev.id}')"
             onmousemove="window.app.ui.moveTooltip(event)"
             onmouseleave="window.app.ui.hideTooltip()">
            <div style="pointer-events: none;">
                <span class="event-pulse" style="color: ${borderColor}">●</span>
                <span class="name">${ev.name}</span>
            </div>
            <span id="timer-${ev.id}" class="time" style="color: ${borderColor}; pointer-events: none;">${Math.max(0, Math.ceil(ev.duration))}s</span>
        </div>
      `;
    });
    this.activeEventsContainer.innerHTML = uiHtml;
  }

  // [New] 카타르시스 보상 지급 (정신 이상 극복 시)
  applyCatharsis() {
    this.app.state.mood = Math.min(100, (this.app.state.mood || 0) + 60);
    this.app.ui.addMiniNotification("Catharsis! Mood greatly increased. (+60%)", "jackpot");
    SoundManager.playSuccess();
  }

  // [New] 정신 이상 이벤트 강제 발생 로직 (무드 25% 이하 시 체크)
  triggerMentalBreak() {
    // 25% 확률로 정신적 한계를 극복함 (이겨냄)
    if (Math.random() < 0.25) {
        // [New] 황금색 신화 등급 연출로 극복함 표시!
        this.app.ui.showNotification("잭팟", "불굴의 의지로 이겨냈습니다!", "Mythic");
        this.applyCatharsis();
        return;
    }

    const breakEvents = [
      { id: 'pyromaniac', name: 'Mental Break: Pyromaniac', desc: 'A colonist has reached their breaking point and is on a fire-starting spree! Some resources in storage have been burned.' },
      { id: 'labor_strike', name: 'Mental Break: Strike', desc: 'Severe depression has led to a total refusal of work! Shopping and deployment are prohibited for 60 seconds.' },
      { id: 'confused_wander', name: 'Mental Break: Confused Wander', desc: 'Mental shock has caused a dazed state! All tower firepower is reduced by 10% for 60 seconds.' }
    ];
    
    const selected = breakEvents[Math.floor(Math.random() * breakEvents.length)];
    
    // 효과음 및 모달 표시
    SoundManager.playSFX('assets/audio/LetterArrive.ogg', 1.0, SoundManager.PRIORITY.MEDIUM);
    setTimeout(() => {
        this.showEventModal({ name: selected.name, desc: selected.desc, type: 'negative' });
        this.executeEvent({ id: selected.id, desc: selected.desc, isMentalBreak: true });
    }, 500);
  }

  triggerRandomEvent() {
    const events = [
      { 
        name: 'Trade Ship', weight: 12, type: 'positive', id: 'trade_ship',
        desc: "A trade ship is passing in orbit and has dropped a preserved weapon crate! You have acquired a Rare or higher weapon."
      },
      { 
        name: 'Cargo Pods', weight: 15, type: 'positive', id: 'cargo_pods',
        desc: "Unknown cargo supplies have crashed from orbit! Useful resources have been secured."
      },
      { 
        name: 'Wanderer Joins', weight: 10, type: 'positive', id: 'wanderer_joins',
        desc: "A stray wanderer, attracted by the safety of our settlement, has requested to join! Population increased by 1."
      },
      { 
        name: 'Ambrosia Sprout', weight: 12, type: 'positive', id: 'ambrosia_sprout',
        desc: "Rare ambrosia trees have sprouted near the settlement! All Silver gain is doubled for 120 seconds."
      },
      { 
        name: 'Psychic Soothe', weight: 12, type: 'positive', id: 'psychic_soothe',
        desc: "A pleasant psychic soothe is flowing across the planet! All ally units gain a massive attack speed bonus for 60 seconds."
      },
      { 
        name: 'Ancient Relic', weight: 5, type: 'positive', id: 'ancient_relic',
        desc: "A powerful ancient relic has been discovered in the frontier! You have secured one of the legendary melee weapons."
      },
      { 
        name: 'Work Inspiration', weight: 10, type: 'positive', id: 'work_inspiration',
        desc: "Colonists have gained a deep inspiration for a specific task! Resource yield for a random task is tripled for 90 seconds."
      },
      { 
        name: 'Luciferium Administered', weight: 10, type: 'negative', id: 'luciferium',
        desc: "Everyone has been administered Luciferium! Gain explosive firepower for 60 seconds, but once the effect ends, a colonist will go insane and a random tower will be destroyed."
      },
      { 
        name: 'Toxic Fallout', weight: 10, type: 'negative', id: 'toxic_fallout',
        desc: "A thick toxic fallout has covered the atmosphere! Outdoor activities are impossible; all assignments are suspended for 60 seconds."
      },
      { 
        name: 'Solar Flare', weight: 15, type: 'negative', id: 'solar_flare',
        desc: "An intense solar flare has occurred! Electronic devices are malfunctioning; all ranged towers are disabled for 60 seconds."
      },
      { 
        name: 'Food Poisoning', weight: 15, type: 'negative', id: 'food_poisoning',
        desc: "Colonists have contracted food poisoning from spoiled food! Suffering and vomiting reduce all assignment efficiency by 50% for 45 seconds."
      },
      { 
        name: 'Psychic Drone', weight: 20, type: 'negative', id: 'psychic_drone',
        desc: "An unpleasant psychic drone is sweeping through the settlement! Colonists suffer from severe headaches; all tower ranges are reduced by 20% for 60 seconds."
      },
      { 
        name: 'Labor Strike', weight: 12, type: 'negative', id: 'labor_strike',
        desc: "Colonists have declared a strike, demanding better treatment and rest! You cannot use the shop or deploy new towers for 60 seconds."
      },
      { 
        name: 'Pyromaniac', weight: 10, type: 'negative', id: 'pyromaniac',
        desc: "A pyromaniac colonist has started a fire out of frustration! Some random resources in storage have been lost."
      },
      { 
        name: 'Food Rot', weight: 15, type: 'negative', id: 'food_rot',
        desc: "Food in storage has spoiled! Due to hot humid weather or poor management, a significant portion of food has rotted."
      },
      {
        name: 'Manhunter Pack', weight: 18, type: 'negative', id: 'manhunter_pack',
        desc: "A pack of crazed, hungry animals has raided the area! You must eliminate the animals rushing at very high speeds."
      },
      {
        name: 'Infestation', weight: 15, type: 'negative', id: 'infestation',
        desc: "An unpleasant scratching sound is heard from deep within the rock ceiling... Insects have tunneled through and raided the settlement!"
      },
      {
        name: 'Orbital Supply', weight: 5, type: 'positive', id: 'orbital_supply',
        desc: "An orbital strike targeter has arrived from space forces! You can clear the battlefield in a moment of crisis."
      },
      // [New] 정신 이상 전용 이벤트들 (isMentalBreak: true 마킹 필요)
      {
        name: 'Confused Wander', weight: 0, type: 'negative', id: 'confused_wander', isMentalBreak: true,
        desc: "Due to low mood, colonists are experiencing a confused wander! All units' attack power and speed are reduced by 10% for 60 seconds."
      }
    ];

    const totalWeight = events.reduce((sum, e) => sum + e.weight, 0);
    const rand = Math.random() * totalWeight;
    let cumulative = 0;
    let selected = events[0];

    for (const e of events) {
      cumulative += e.weight;
      if (rand <= cumulative) {
        selected = e;
        break;
      }
    }

    // [Sound] 이벤트 타입에 따라 사운드를 먼저 재생하여 긴장감 조성
    if (selected.type === 'negative') {
        SoundManager.playBadAlert();
    } else {
        SoundManager.playSuccess();
    }

    // 소리가 먼저 나고 약간(500ms) 뒤에 팝업 표시 및 게임 일시정지
    setTimeout(() => {
        this.showEventModal(selected);
        this.executeEvent(selected);
    }, 500);
  }

  showEventModal(event, onClose = null) {
    if (!this.modal) return;
    
    this.modalTitle.innerText = event.name;
    this.modalTitle.style.color = (event.type === 'positive') ? "#4ade80" : "#ef4444";
    if (event.id === 'victory') this.modalTitle.style.color = "#fbbf24"; // 승리 시 황금색
    
    this.modalText.innerText = event.desc;
    this.modal.classList.remove('hidden');
    
    this.app.state.isPaused = true; // 게임 일시정지

    // [New] 닫기 버튼에 콜백 바인딩 지원
    if (this.modalCloseBtn) {
        this.modalCloseBtn.onclick = (e) => {
            if (e) e.stopPropagation();
            this.modal.classList.add('hidden');
            if (onClose) {
                onClose();
            } else {
                this.app.state.isPaused = false; // 기본: 일시정지 해제
            }
        };
    }
  }

  /**
   * [New] 선택형 모달창 표시
   * @param {Object} event 이벤트 데이터
   * @param {Function} onAccept 수락 시 콜백
   * @param {Function} onReject 거절 시 콜백
   */
  showChoiceModal(event, onAccept, onReject) {
    if (!this.modal) return;
    
    // [Sound] 히든 인카운터 발생 알림
    SoundManager.playSFX('assets/audio/히든인카운터수락시.ogg', 0.9, SoundManager.PRIORITY.HIGH);
    
    this.modalTitle.innerText = event.name;
    this.modalTitle.style.color = "#fbbf24"; // 선택형은 황금색
    this.modalText.innerText = event.desc;
    
    // 일반 닫기 버튼 숨기기
    this.modalCloseBtn.classList.add('hidden');
    // 선택 버튼 보이기
    this.choiceBtnContainer.classList.remove('hidden');
    
    this.acceptBtn.onclick = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.closeModal();
        if (onAccept) onAccept();
    };
    
    this.rejectBtn.onclick = (e) => {
        if (e) {
            e.stopPropagation();
            e.preventDefault();
        }
        this.closeModal();
        if (onReject) onReject();
    };
    
    this.modal.classList.remove('hidden');
    this.app.state.isPaused = true;
  }

  closeModal() {
    this.modal.classList.add('hidden');
    this.choiceBtnContainer.classList.add('hidden');
    this.modalCloseBtn.classList.remove('hidden');
    this.app.state.isPaused = false;
  }

  executeEvent(event) {
    // [New] 긍정적/부정적 인카운터 시 무드 영향 (±15)
    if (event.type === 'positive') {
        this.app.state.mood = Math.min(100, (this.app.state.mood || 0) + 15);
        this.app.ui.addMiniNotification(`Good News: ${event.name}! (Mood +15%)`, "jackpot");
    } else if (event.type === 'negative') {
        this.app.state.mood = Math.max(0, (this.app.state.mood || 0) - 15);
        this.app.ui.addMiniNotification(`Bad News: ${event.name}... (Mood -15%)`, "failure");
    }

    switch (event.id) {
      case 'trade_ship':
        this.handleTradeShip();
        break;
      case 'cargo_pods':
        this.handleCargoPods(event);
        break;
      case 'wanderer_joins':
        this.handleWandererJoins();
        break;
      case 'ambrosia_sprout':
        this.handleAmbrosiaSprout(event);
        break;
      case 'psychic_soothe':
        this.handlePsychicSoothe(event);
        break;
      case 'ancient_relic':
        this.handleAncientRelic(event);
        break;
      case 'work_inspiration':
        this.handleWorkInspiration(event);
        break;
      case 'luciferium':
        this.handleLuciferium(event);
        break;
      case 'toxic_fallout':
        this.handleToxicFallout(event);
        break;
      case 'solar_flare':
        this.handleSolarFlare(event);
        break;
      case 'food_poisoning':
        this.handleFoodPoisoning(event);
        break;
      case 'psychic_drone':
        this.handlePsychicDrone(event);
        break;
      case 'pyromaniac':
        this.handlePyromaniac(event);
        break;
      case 'food_rot':
        this.handleFoodRot(event);
        break;
      case 'labor_strike':
        this.handleStrike(event);
        break;
      case 'manhunter_pack':
        this.handleManhunterPack();
        break;
      case 'infestation':
        this.handleInfestation();
        break;
      case 'orbital_supply':
        this.handleOrbitalSupply();
        break;
      case 'confused_wander':
        this.handleConfusedWander(event);
        break;
    }
  }

  // 1. 상선 통과 (상위 등급 무기 획득)
  handleTradeShip() {
    const isEpic = Math.random() < 0.3;
    const grade = isEpic ? 'Epic' : 'Rare';
    
    const result = GachaSystem.drawSpecificGrade(grade, this.app.state.upgrades.artisan || 0);
    if (result) {
      this.app.startPlacement(result);
    }
  }

  // 2. 화물 낙하기 (무작위 자원 보급)
  handleCargoPods(event) {
    const resources = [
        { key: 'steel', name: 'Steel', min: 40, max: 80 },
        { key: 'plasteel', name: 'Plasteel', min: 20, max: 50 },
        { key: 'uranium', name: 'Uranium', min: 15, max: 40 },
        { key: 'component', name: 'Component', min: 2, max: 6 },
        { key: 'silver', name: 'Silver', min: 100, max: 300 }
    ];

    const res = resources[Math.floor(Math.random() * resources.length)];
    const amount = Math.floor(res.min + Math.random() * (res.max - res.min));
    
    this.app.state.addResource(res.key, amount);
    
    // 모달 텍스트 업데이트 (실제 획득한 자원 표시)
    event.desc = `Cargo pods recovered from orbit! \n\nReward: ${res.name} +${amount}`;
    this.modalText.innerText = event.desc;
  }

  // 3. 공동체 합류 (인구 증가)
  handleWandererJoins() {
    this.app.state.population += 1;
    this.app.state.idlePopulation += 1;
    this.app.ui.addMiniNotification("New wanderer joined! (Population +1)");
  }

  // 4. 암브로시아 발아 (은환 2배)
  handleAmbrosiaSprout(event) {
    this.activeEvents.push({
        id: 'ambrosia_sprout',
        name: 'Ambrosia Sprout',
        desc: event.desc,
        type: 'positive',
        duration: 120 // 120초간 지속
    });
  }

  // 5. 정신적 안정파 (공속 상향)
  handlePsychicSoothe(event) {
    this.activeEvents.push({
        id: 'psychic_soothe',
        name: 'Psychic Soothe',
        desc: event.desc,
        type: 'positive',
        duration: 60 // 60초간 지속
    });
  }

  // 6. 고대의 유물 (전설템 획득)
  handleAncientRelic(event) {
    const relics = ['제우스망치', '플라즈마검', '단분자검'];
    const pName = relics[Math.floor(Math.random() * relics.length)];
    
    // 강제로 전설 품질로 생성
    const result = {
        weaponName: pName,
        weaponData: WEAPON_DB[pName],
        quality: 'legendary',
        material: '플라스틸'
    };

    if (result.weaponData) {
        this.app.startPlacement(result);
        event.desc = `You found a glowing crate deep within the ruins. \n\nAcquired: Legendary [${result.weaponData.label || pName}]`;
        this.modalText.innerText = event.desc;
        this.app.ui.showNotification("Ancient Relic Found", `${result.weaponData.label || pName} secured!`, "Legendary");
    }
  }

  // 7. 작업 영감 (특정 작업 3배 보너스)
  handleWorkInspiration(event) {
    const jobs = [
        { id: 'logging', name: 'Logging' },
        { id: 'mining', name: 'Mining' },
        { id: 'farming', name: 'Farming' },
        { id: 'research', name: 'Research' },
        { id: 'trading', name: 'Trading' }
    ];
    const job = jobs[Math.floor(Math.random() * jobs.length)];

    this.activeEvents.push({
        id: 'work_inspiration',
        targetJob: job.id,
        name: `${job.name} Inspiration`,
        desc: event.desc,
        type: 'positive',
        duration: 90
    });

    event.desc = `Colonists have started showing divine wisdom in [${job.name}] task! \n\n[${job.name}] resource yield is tripled for 90 seconds.`;
    this.modalText.innerText = event.desc;
  }

  // 8. 루시페륨 투여 (폭풍 공속/데미지 + 타워 파괴)
  handleLuciferium(event) {
    this.activeEvents.push({
        id: 'luciferium',
        name: 'Luciferium Administered',
        desc: event.desc,
        type: 'negative',
        duration: 60 // 60초간 지속
    });
  }

  // 9. 흑점 폭발 (원거리 공격 중단)
  handleSolarFlare(event) {
    this.activeEvents.push({
        id: 'solar_flare',
        name: 'Solar Flare',
        desc: event.desc,
        type: 'negative',
        duration: 60
    });
  }

  // 10. 식중독 (파견 효율 감소)
  handleFoodPoisoning(event) {
    this.activeEvents.push({
        id: 'food_poisoning',
        name: 'Food Poisoning',
        desc: event.desc,
        type: 'negative',
        duration: 45
    });
  }

  // 11. 정신적 파동 (사거리 감소)
  handlePsychicDrone(event) {
    this.activeEvents.push({
        id: 'psychic_drone',
        name: 'Psychic Drone',
        desc: event.desc,
        type: 'negative',
        duration: 60
    });
  }

  // 12. 방화광 (무작위 자원 소실)
  handlePyromaniac(event) {
    const s = this.app.state;
    const resources = [
        { key: 'silver', name: 'Silver' },
        { key: 'steel', name: 'Steel' },
        { key: 'plasteel', name: 'Plasteel' },
        { key: 'uranium', name: 'Uranium' },
        { key: 'component', name: 'Component' },
        { key: 'researchPoints', name: 'Research' }
    ];

    const target = resources[Math.floor(Math.random() * resources.length)];
    const currentAmount = s[target.key] || 0;
    
    // 최소 5개 이상 있을 때만 소실 발생 (너무 적으면 무시)
    if (currentAmount >= 5) {
        const lossPercent = 20 + Math.random() * 30;
        const lossAmount = Math.max(1, Math.ceil(currentAmount * (lossPercent / 100)));
        
        s.addResource(target.key, -lossAmount);

        event.desc = `A pyromaniac has started a fire in the storage and burned ${lossAmount} [${target.name}]! \n\nStored resources have been significantly lost.`;
        if (this.modalText) this.modalText.innerText = event.desc;
        this.app.ui.addMiniNotification(`Resource Lost: ${target.name} -${lossAmount}`, 'failure');
        
        // [New] 방화광은 즉시 사건이므로 바로 카타르시스(정신차림) 지급
        setTimeout(() => this.applyCatharsis(), 1000);
    } else {
        event.desc = `A pyromaniac tried to start a fire, but fortunately the target storage was empty or the amount was too small to cause damage.`;
        if (this.modalText) this.modalText.innerText = event.desc;
    }
  }

  // 13. 식량 부패 (식량 자원 소실)
  handleFoodRot(event) {
    const s = this.app.state;
    const currentFood = s.food || 0;
    
    // 최소 10개 이상 있을 때만 부패 발생
    if (currentFood >= 10) {
        const lossPercent = 30 + Math.random() * 40;
        const lossAmount = Math.max(1, Math.ceil(currentFood * (lossPercent / 100)));
        
        s.addResource('food', -lossAmount);

        event.desc = `Food in storage has rotted! \n\nFood lost: -${lossAmount}`;
        if (this.modalText) this.modalText.innerText = event.desc;
        this.app.ui.addMiniNotification(`Food Rot: -${lossAmount}`, 'failure');
    } else {
        event.desc = `Not enough food in storage to rot significantly, passing without damage.`;
        if (this.modalText) this.modalText.innerText = event.desc;
    }
  }

  // 14. 파업 (상점/배치 금지)
  handleStrike(event) {
    this.activeEvents.push({
        id: 'labor_strike',
        name: 'Labor Strike',
        desc: event.desc,
        type: 'negative',
        duration: 60,
        isMentalBreak: true // [New] 종료 시 무드 보너스 대상
    });
  }

  // [New] 14.5 정신 방황 (60초간 공속/데미지 패널티)
  handleConfusedWander(event) {
    this.activeEvents.push({
        id: 'confused_wander',
        name: 'Confused Wander',
        desc: event.desc,
        type: 'negative',
        duration: 60,
        isMentalBreak: true
    });
  }

  // 15. 식인 동물 무리 (적 추가 스폰)
  handleManhunterPack() {
    if (this.app.waveManager) {
        this.app.waveManager.spawnManhunterPack();
    }
  }

  // 16. 곤충 군락 (다양한 곤충형 적 스폰)
  handleInfestation() {
    if (this.app.waveManager) {
        SoundManager.playSFX('assets/audio/곤충군락소리.ogg', 0.8, SoundManager.PRIORITY.MEDIUM);
        this.app.waveManager.spawnInfestation();
    }
  }

  // 2. 독성 낙진 (파견 효율 감소)
  handleToxicFallout(event) {
    this.activeEvents.push({
      id: 'toxic_fallout',
      name: 'Toxic Fallout',
      desc: event.desc,
      type: 'negative',
      duration: 60 // 60초간 지속
    });

    this.app.ui.showNotification(
      "Toxic Fallout", 
      "The atmosphere is contaminated; assignment efficiency is reduced by 50%!", 
      "failure"
    );
  }

  // 글로벌 효율 보너스 계산 (독성 낙진 등 반영)
  getGlobalWorkEfficiency() {
    let efficiency = 1.0;

    // [New] 무드 상태에 따른 생산 효율 반영
    const mood = this.app.state.mood || 0;
    if (mood >= 85) {
        efficiency *= 1.1; // 매우 높음: +10% 보너스
    }

    // 독성 낙진: 파견 효율 0% (완전 중단)
    if (this.activeEvents.some(e => e.id === 'toxic_fallout')) {
      efficiency *= 0.0;
    }
    // 식중독: 파견 효율 50% 감소
    if (this.activeEvents.some(e => e.id === 'food_poisoning')) {
      efficiency *= 0.5;
    }
    return efficiency;
  }

  // 글로벌 사거리 배율 계산
  getGlobalRangeMultiplier() {
    let multiplier = 1.0;
    if (this.activeEvents.some(e => e.id === 'psychic_drone')) {
      multiplier *= 0.8; // 사거리 20% 감소
    }
    return multiplier;
  }

  // 파업 상태 확인
  isStrikeActive() {
    return this.activeEvents.some(e => e.id === 'labor_strike');
  }

  // 17. 궤도 폭격기 보급 (아이템 수량 증가)
  handleOrbitalSupply() {
    this.app.state.items.orbital_strike = (this.app.state.items.orbital_strike || 0) + 1;
    this.app.ui.addMiniNotification("Orbital Strike Targeter secured!", "Legendary");
    this.app.ui.updateDisplays(this.app.state);
  }
}
