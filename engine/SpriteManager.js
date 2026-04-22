import { FIXED_MONSTER_LIST } from '../game/MonsterData.js';

export class SpriteManager {
  static init() {
    this.images = {};
    const weaponImages = {
      'Dagger': 'assets/dagger.png',
      'Short Spear': 'assets/shortspear.webp',
      'Bolt-action Rifle': 'assets/rifle.png',
      'Greatbow': 'assets/longbow.webp',
      'Short Bow': 'assets/shortbow.png',
      'Club': 'assets/club.webp',
      'Fists/Wood': 'assets/wood_weapon.webp',
      'Warhammer': 'assets/warhammer.webp',
      'Zeushammer': 'assets/zeushammer.webp',
      'Eltex Staff': 'assets/eltexstaff.webp',
      'Sword': 'assets/sword.webp',
      'Spear': 'assets/spear.webp',
      'Longsword': 'assets/longsword.webp',
      'Breach Axe': 'assets/breachaxe.webp',
      'Thrumbo Horn': 'assets/thrumbohorn.webp',
      'Alpha Thrumbo Horn': 'assets/thrumbohorn.webp', // Alpha reuse normal horn if specific missing
      'Mono Sword': 'assets/monosword.webp',
      'Plasma Sword': 'assets/plasmasword.webp',
      'Pilum': 'assets/javelins.webp',
      'Recurve Bow': 'assets/recurvebow.webp',
      'frag_grenade': 'assets/fraggrenades.webp', 
      'molotov': 'assets/화염병.webp', 
      'Revolver': 'assets/revolver.webp',
      'Autopistol': 'assets/autopistol.webp',
      'Heavy SMG': 'assets/smg.webp',
      'Chain Shotgun': 'assets/combat_shotgun.webp',
      'pulse_grenade': 'assets/empgrenades.webp',
      'Assault Rifle': 'assets/assaultrifle.webp',
      'Sniper Rifle': 'assets/sniperrifle.webp',
      'Minigun': 'assets/minigun.webp',
      'toxin_grenade': 'assets/toxingrenade.webp',
      'Charge Rifle': 'assets/chargerifle.webp',
      'Charge Lance': 'assets/chargelance.webp',
      'Beam Grazer': 'assets/beamgrazer.webp',
      'Beam Repeater': 'assets/beamrepeater.webp',
      'Mace': 'assets/mace.webp',
      'smoke_launcher': 'assets/smokelauncher.webp',
      '999 Wood Club': 'assets/wood_weapon.webp',
      'Ancient Fish Sword': 'assets/saury_sword.png',
      'Persona Mono Sword': 'assets/monosword.webp',
      'Persona Core': 'assets/인공자아핵.webp',
      'Needle Crossbow': 'assets/신경석궁.webp',
      "Cool Banker's Way": 'assets/시원한은행가는길.webp',
      'orbital_strike': 'assets/궤도폭격기.webp',
      'psychic_lance': 'assets/정신충격창.webp',
      'go_juice': 'assets/고주스.webp'
    };

    // [Helper] 경로 인코딩 (한글 및 특수문자 대응)
    const encodePath = (p) => p.split('/').map(s => encodeURIComponent(s)).join('/').replace(/%3A/g, ':');

    // 무기/아이템 로드
    for (const [name, src] of Object.entries(weaponImages)) {
      const img = new Image();
      img.src = encodePath(src);
      img.onerror = () => this.handleError(img);
      this.images[name] = img;
    }

    // [New] 몬스터 이미지 로드
    FIXED_MONSTER_LIST.forEach(mon => {
      if (mon.img) {
          const img = new Image();
          const encodePath = (p) => p.split('/').map(s => encodeURIComponent(s)).join('/').replace(/%3A/g, ':');
          img.src = encodePath(`assets/monster/${mon.img}`);
          img.onerror = () => this.handleError(img);
          this.images[`monster_${mon.img}`] = img;
      }
    });

    // [New] 특수 인카운터 몬스터 이미지 로드
    const specialMonsters = [
        '메가스카라브.webp', '메가스파이더.webp', '스펠로피드.webp', 
        '알파트럼보.webp', '암흑모노리스.webp', '제국근위대장.webp', 
        '제국정예병.webp', '상단경호원.webp'
    ];
    specialMonsters.forEach(filename => {
        const img = new Image();
        const encodePath = (p) => p.split('/').map(s => encodeURIComponent(s)).join('/').replace(/%3A/g, ':');
        img.src = encodePath(`assets/specialmonster/${filename}`);
        img.onerror = () => this.handleError(img);
        this.images[`special_${filename}`] = img;
    });

    this.colors = {
      awful: '#808080',
      normal: '#ffffff',
      excellent: '#9b59b6',
      legendary: '#f1c40f',
      enemy: '#e74c3c',
      slate: '#7f8c8d'
    };
  }

  static handleError(img) {
    if (!img.dataset.triedFallback) {
        img.dataset.triedFallback = 'true';
        if (img.src.endsWith('.webp')) img.src = img.src.replace('.webp', '.png');
        else if (img.src.endsWith('.png')) img.src = img.src.replace('.png', '.webp');
    }
  }

  static getColor(gradeOrMaterial) {
    const key = String(gradeOrMaterial).toLowerCase();
    return this.colors[key] || this.colors[gradeOrMaterial] || '#ffffff';
  }

  static getImage(key) {
    return this.images[key] || null;
  }
}
