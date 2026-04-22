import { SoundManager } from '../engine/SoundManager.js';
/**
 * HiddenEventManager.js
 * Manages the legendary 'Hidden Encounter' system that occurs only 1-2 times per game.
 */
export class HiddenEventManager {
  constructor(app) {
    this.app = app;
    this.nextEventTimer = this.getRandomInterval();
    this.isWarningActive = false;
    this.warningTimer = 0;
    this.pityBonus = 0; // Pity probability that increases upon each failure to trigger
  }

  // Random interval between 30-50 minutes (1800-3000 seconds)
  getRandomInterval() {
    return 1800 + Math.random() * 1200;
  }

  update(dt) {
    const s = this.app.state;
    if (s.isPaused) return;

    // Accumulate game time
    s.gameTime += dt;

    // Limit to max 3 per session and block after wave 100
    if (s.hiddenEventCount >= 3 || s.waveNumber >= 100) return;

    // 1. Update event cycle timer
    this.nextEventTimer -= dt;

    // 2. Handle warning notification (10 seconds before occurrence)
    if (!this.isWarningActive && this.nextEventTimer <= 10) {
        // Check occurrence conditions (At least 30 min elapsed and wave 30 or higher)
        if (s.gameTime >= 1800 && s.waveNumber >= 30) {
            // [Fix] Check probability before warning (Base 35% + Pity Bonus)
            const chance = 0.35 + this.pityBonus;
            if (Math.random() < chance || s.gameTime > 2700) {
                this.startWarning();
            } else {
                // On failure, wait for next opportunity (Increase pity and reset timer)
                this.pityBonus += 0.15;
                this.nextEventTimer = 240 + Math.random() * 240; // Retry after 4-8 minutes
            }
        } else {
            // Reset timer if conditions not met (Retry with slightly shorter cycle)
            this.nextEventTimer = 60 + Math.random() * 60;
        }
    }

    if (this.isWarningActive) {
        this.warningTimer -= dt;
        if (this.warningTimer <= 0) {
            this.triggerHiddenEvent();
        }
    }
  }

  startWarning() {
    console.log("%c[Warning] A massive flow of destiny is felt...", "color: #ff00ff; font-weight: bold;");
    this.isWarningActive = true;
    this.warningTimer = 10;
    
    // Activate visual noise effect (Inject CSS class)
    document.body.classList.add('screen-noise');
    
    // Mini notification
    this.app.ui.addMiniNotification("A fatal premonition envelops the settlement...", "Legendary");
  }

  triggerHiddenEvent() {
    this.isWarningActive = false;
    document.body.classList.remove('screen-noise');

    // [Fix] Once warning ends, execute event deterministically (Already passed probability check)
    this.executeRandomHiddenEvent();
    this.app.state.hiddenEventCount++;
    this.nextEventTimer = this.getRandomInterval();
    this.pityBonus = 0;
  }

  executeRandomHiddenEvent() {
    const events = [
        { id: 'alpha_thrumbo', name: 'Alpha Thrumbo Appearance', type: 'boss' },
        { id: 'dark_monolith', name: 'Dark Monolith', type: 'object' },
        { id: 'imperial_guard', name: 'Ordeal of the Imperial Guard', type: 'combat' },
        { id: 'caravan_raid', name: 'Caravan Raid Opportunity', type: 'choice' },
        { id: 'howling_blade', name: 'Choice of the Howling Blade', type: 'choice' }
    ];

    const selected = events[Math.floor(Math.random() * events.length)];
    
    // Logic integration (WaveManager, etc.)
    if (this.app.waveManager) {
        console.log(`[Hidden Event] Triggering: ${selected.name}`);
        
        // [Fix] Choice-type events use dedicated modals, so exclude from general modal call
        if (selected.id !== 'howling_blade') {
            const eventData = {
                name: `[HIDDEN] ${selected.name}`,
                desc: this.getEventDescription(selected.id),
                type: 'negative' // Boss battle, so warning color
            };
            this.app.encounterManager.showEventModal(eventData);
        }
        
        // Call boss spawn and special event logic
        if (selected.id === 'alpha_thrumbo') this.triggerAlphaThrumbo();
        else if (selected.id === 'dark_monolith') this.triggerDarkMonolith();
        else if (selected.id === 'imperial_guard') this.triggerImperialGuard();
        else if (selected.id === 'caravan_raid') this.triggerCaravanRaid();
        else if (selected.id === 'howling_blade') this.triggerHowlingBlade();
    }
  }

  triggerCaravanRaid() {
      const eventData = {
          name: "Wealthy Caravan Passing",
          desc: "An Outlander Union caravan, laden with rare industrial resources and treasures, is passing nearby. \n\nRaiding them could yield massive resources and legendary weapons, but failure will result in severe imperial liability. \n\nWill you initiate the raid?"
      };

      this.app.encounterManager.showChoiceModal(
          eventData,
          () => {
              // [Accept] Start Raid
              SoundManager.playSFX('assets/audio/Quest_Concluded_01a.ogg');
              this.app.ui.addMiniNotification("The raid has begun! Secure all loot.", "Legendary");
              this.app.waveManager.spawnCaravanRaid();
          },
          () => {
              // [Reject] Grant random reward (Peaceful resolution reward)
              SoundManager.playSFX('assets/audio/Cancel5.ogg');
              const silver = 100 + Math.floor(Math.random() * 200);
              const food = 50 + Math.floor(Math.random() * 100);
              
              this.app.state.addResource('silver', silver);
              this.app.state.addResource('food', food);
              
              this.app.encounterManager.showEventModal({
                  name: "Peaceful Resolution",
                  desc: `The caravan expresses gratitude for the safe passage and tosses a bundle of supplies before leaving! \n\nReward: Silver +${silver}, Food +${food}`,
                  type: 'positive'
              });
              this.app.ui.updateDisplays(this.app.state);
          }
      );
  }

  triggerImperialGuard() {
      const eventData = {
          name: "Ordeal of the Imperial Guard",
          desc: "The settlement's fame has spread even to the galactic hideouts. \n\nThe Imperial Guard Captain has informed you that he will personally test your defensive capabilities. Will you prepare for the surprise attack and prove your strength? \n\nSuccess grants the Messenger's Blessing (Permanent Atk Speed +20%)."
      };

      this.app.encounterManager.showChoiceModal(
          eventData,
          () => {
              // [Accept] Start Guard Ambush
              SoundManager.playSFX('assets/audio/Quest_Concluded_01a.ogg');
              this.app.ui.addMiniNotification("Imperial elite troops have arrived!", "Legendary");
              this.app.waveManager.spawnImperialGuardAmbush();
          },
          () => {
              // [Reject]
              SoundManager.playSFX('assets/audio/Cancel5.ogg');
              this.app.encounterManager.showEventModal({
                  name: "Ordeal Refused",
                  desc: "The Empire expresses disappointment in your cowardice and quietly withdraws. There are no rewards or penalties.",
                  type: 'info'
              });
          }
      );
  }

  triggerAlphaThrumbo() {
      const eventData = {
          name: "Alpha Thrumbo Discovery",
          desc: "An extremely rare mutant variant, the 'Alpha Thrumbo', has been discovered near the settlement. \n\nThis beast is exceptionally dangerous, but successful hunting grants the legendary loot, the 'Alpha Thrumbo Horn'. \n\nWill you attack the Alpha Thrumbo and begin the hunt?"
      };

      this.app.encounterManager.showChoiceModal(
          eventData,
          () => {
              // [Accept] Spawn Alpha Thrumbo
              SoundManager.playSFX('assets/audio/Quest_Concluded_01a.ogg');
              this.app.ui.addMiniNotification("The hunt has begun!", "Legendary");
              this.app.waveManager.spawnSpecialBoss('AlphaThrumbo');
          },
          () => {
              // [Reject]
              SoundManager.playSFX('assets/audio/Cancel5.ogg');
              this.app.encounterManager.showEventModal({
                  name: "Declined",
                  desc: "The Alpha Thrumbo ignores the settlement and leisurely disappears over the horizon.",
                  type: 'info'
              });
          }
      );
  }

  triggerDarkMonolith() {
      const eventData = {
          name: "Void Disturbance: Dark Monolith",
          desc: "A massive Dark Monolith is about to rise from the void fissure. \n\nThis structure possesses a strange void shield that can only be destroyed by weapons of Epic grade or lower. Destroying it will allow colonists to absorb void knowledge and achieve a leap in technology. \n\nHowever, failure will shatter the colonists' minds. Will you accept the ordeal?"
      };

      this.app.encounterManager.showChoiceModal(
          eventData,
          () => {
              // [Accept] Spawn Monolith
              SoundManager.playSFX('assets/audio/Quest_Concluded_01a.ogg');
              this.app.ui.addMiniNotification("Void energy is manifesting!", "Legendary");
              this.app.waveManager.spawnSpecialBoss('DarkMonolith');
          },
          () => {
              // [Reject] Call common penalty function
              SoundManager.playSFX('assets/audio/Cancel5.ogg');
              if (this.app.applyVoidPunishment) {
                  this.app.applyVoidPunishment("Refusal");
              }
          }
      );
  }

  triggerHowlingBlade() {
      const eventData = {
          name: "Choice of the Howling Blade",
          desc: "A blade wailing with blood has emerged from the void fissure. \n\nThis blade desires the life force of 10 colonists as a sacrifice. \nAccepting it will instantly destroy 10 random towers, but you will gain the hidden weapon 'Persona Mono Sword'. \n\nWill you accept the ordeal?"
      };

      this.app.encounterManager.showChoiceModal(
          eventData,
          () => {
              // [Accept] Randomly destroy 10 units
              SoundManager.playSFX('assets/audio/Quest_Concluded_01a.ogg');
              this.app.ui.addMiniNotification("The blood contract has been fulfilled.", "failure");
              
              for (let i = 0; i < 10; i++) {
                  if (this.app.units.length > 0) {
                      const idx = Math.floor(Math.random() * this.app.units.length);
                      this.app.units.splice(idx, 1);
                  }
              }

              // [Fix] Call global reward function directly from main app (Ensures stability)
              if (typeof this.app.triggerHowlingBladeReward === 'function') {
                  this.app.triggerHowlingBladeReward();
              } else if (window.app && window.app.triggerHowlingBladeReward) {
                  window.app.triggerHowlingBladeReward();
              }
          },
          () => {
              // [Reject]
              SoundManager.playSFX('assets/audio/Cancel5.ogg');
              this.app.encounterManager.showEventModal({
                  name: "Temptation Repelled",
                  desc: "The blade, seemingly disappointed by your firm resolve, let out a grotesque scream and disappeared into the void.",
                  type: 'info'
              });
          }
      );
  }

  getEventDescription(id) {
    const descs = {
        alpha_thrumbo: "An 'Alpha Thrumbo', standing at the apex of the ecosystem, is charging toward the settlement! It possesses devastating resilience and hyper-regeneration. Legendary rewards are expected upon defeat.",
        dark_monolith: "An unknown void disturbance has occurred, and a 'Dark Monolith' has appeared on the field. If not destroyed within 60 seconds, the colonists' minds will be shattered!",
        imperial_guard: "The Imperial Guard Captain, who has been watching the settlement's growth, has come personally to issue an ordeal. Break through the ironclad defense of the guard and prove your strength.",
        howling_blade: "A blade wailing with blood has emerged from the void fissure. This blade desires the life force of 10 colonists as a sacrifice."
    };
    return descs[id] || "A massive unknown force is approaching.";
  }
}
