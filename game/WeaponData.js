// 무기와 재질의 상수 데이터
export const WEAPPON_CATEGORIES = ['blunt', 'sharp', 'ranged'];

export const WEAPON_DB = {
  // 둔기 (Blunt)
  'Fists/Wood': { label: 'Fists / Wood', type: 'blunt', tech: 'primitive', grade: 'Common', dmg: 10, spd: 0.5, ap: 0, effect: null, attackSound: 'assets/audio/weaponsound/맨손주먹.ogg', attackVolume: 0.7 },
  'Club': { label: 'Club', type: 'blunt', tech: 'primitive', grade: 'Common', dmg: 14, spd: 0.5, ap: 0, effect: null, attackSound: 'assets/audio/weaponsound/작은둔기휘두르는소리.ogg', attackVolume: 0.7 },
  'Mace': { label: 'Mace', type: 'blunt', tech: 'primitive', grade: 'Uncommon', dmg: 35, spd: 0.5, ap: 0, effect: null, attackSound: 'assets/audio/weaponsound/작은둔기휘두르는소리.ogg', attackVolume: 0.7 },
  'Warhammer': { label: 'Warhammer', type: 'blunt', tech: 'advanced', grade: 'Rare', dmg: 110, spd: 0.38, ap: 0.2, effect: 'melee_aoe', range: 60, attackSound: 'assets/audio/둔기휘두르는소리.ogg' },
  'Zeushammer': { label: 'Zeushammer', type: 'blunt', tech: 'advanced', grade: 'Legendary', dmg: 550, spd: 0.33, ap: 0.5, effect: 'stun', fixedMaterial: 'None', attackSound: 'assets/audio/둔기휘두르는소리.ogg' },
  'Eltex Staff': { label: 'Eltex Staff', type: 'blunt', tech: 'advanced', grade: 'Mythic', dmg: 35, spd: 0.38, ap: 0, range: 150, effect: 'aura_cd', fixedMaterial: 'None' },
  '999 Wood Club': { label: '+999 Wooden Club', type: 'blunt', tech: 'primitive', grade: 'Hidden', dmg: 9999, spd: 2.0, ap: 1.0, range: 180, effect: 'knockback', fixedMaterial: 'Wood', attackSound: 'assets/audio/weaponsound/맨손주먹.ogg' },

  // 날붙이 (Sharp)
  'Dagger': { label: 'Dagger', type: 'sharp', tech: 'primitive', grade: 'Common', dmg: 12, spd: 1.0, ap: 0, effect: null, attackSound: 'assets/audio/단검날붙이소리.ogg' },
  'Short Spear': { label: 'Short Spear', type: 'sharp', tech: 'primitive', grade: 'Common', dmg: 18, spd: 0.8, ap: 0.2, effect: null, attackSound: 'assets/audio/단검날붙이소리.ogg' },
  'Sword': { label: 'Sword', type: 'sharp', tech: 'primitive', grade: 'Common', dmg: 16, spd: 0.8, ap: 0, effect: null, attackSound: 'assets/audio/weaponsound/칼소리.ogg' },
  'Spear': { label: 'Spear', type: 'sharp', tech: 'primitive', grade: 'Uncommon', dmg: 23, spd: 0.6, ap: 0.3, effect: null, attackSound: 'assets/audio/창.ogg' },
  'Longsword': { label: 'Longsword', type: 'sharp', tech: 'primitive', grade: 'Rare', dmg: 40, spd: 0.7, ap: 0, effect: 'melee_aoe', range: 70, attackSound: 'assets/audio/weaponsound/칼소리.ogg' },
  'Breach Axe': { label: 'Breach Axe', type: 'sharp', tech: 'advanced', grade: 'Rare', dmg: 85, spd: 0.45, ap: 0.5, effect: 'armor_break', shred: 6, attackSound: 'assets/audio/weaponsound/칼소리.ogg' },
  'Thrumbo Horn': { label: 'Thrumbo Horn', type: 'sharp', tech: 'primitive', grade: 'Epic', dmg: 110, spd: 0.6, ap: 0.3, effect: 'knockback', fixedMaterial: 'None', attackSound: 'assets/audio/트럼보뿔.ogg' },
  'Plasma Sword': { label: 'Plasma Sword', type: 'sharp', tech: 'advanced', grade: 'Legendary', dmg: 95, spd: 0.7, ap: 0.3, effect: null, shred: 15, fixedMaterial: 'None', attackSound: 'assets/audio/플라즈마검.ogg' },
  'Mono Sword': { label: 'Mono Sword', type: 'sharp', tech: 'advanced', grade: 'Mythic', dmg: 135, spd: 0.9, ap: 0.95, effect: null, fixedMaterial: 'None', attackSound: 'assets/audio/단분자검.ogg' },
  'Alpha Thrumbo Horn': { label: 'Alpha Thrumbo Horn', type: 'sharp', tech: 'primitive', grade: 'Hidden', dmg: 250, spd: 1.1, ap: 0.5, effect: 'instakill', fixedMaterial: 'None', attackSound: 'assets/audio/트럼보뿔.ogg' },
  'Persona Mono Sword': { label: 'Persona Mono Sword', type: 'sharp', tech: 'advanced', grade: 'Hidden', dmg: 300, spd: 1.3, ap: 1.0, effect: 'max_hp_percent', fixedMaterial: 'None', attackSound: 'assets/audio/결속단분자검.ogg' },
  'Ancient Fish Sword': { label: 'Legendary Saury Sword', type: 'sharp', tech: 'advanced', grade: 'Hidden', dmg: 333, spd: 1.2, ap: 0.4, range: 200, effect: 'stun_long', fixedMaterial: 'None', attackSound: 'assets/audio/전설의꽁치검.ogg' },

  // 원거리 (Ranged)
  'Short Bow': { label: 'Short Bow', type: 'ranged', tech: 'primitive', grade: 'Common', dmg: 11, spd: 0.33, ap: 0.1, effect: 'arrow', range: 230, attackSound: 'assets/audio/weaponsound/BowA.ogg' },
  'Recurve Bow': { label: 'Recurve Bow', type: 'ranged', tech: 'primitive', grade: 'Common', dmg: 14, spd: 0.32, ap: 0.1, effect: 'arrow', range: 260, attackSound: 'assets/audio/weaponsound/BowA.ogg' },
  'Autopistol': { label: 'Autopistol', type: 'ranged', tech: 'advanced', grade: 'Common', dmg: 10, spd: 1.0, ap: 0.1, effect: null, range: 240, attackSound: 'assets/audio/weaponsound/GunShotA.ogg' },
  'Persona Core': { label: 'Persona Core', type: 'special', tech: 'ultra', grade: 'Mythic', dmg: 0, spd: 0, ap: 0, range: 200, effect: 'aura_persona', fixedMaterial: 'None' },
  "Cool Banker's Way": { label: "Cool Banker's Way", type: 'ranged', tech: 'advanced', grade: 'Hidden', dmg: 350, spd: 0.15, ap: 0.5, effect: 'capitalist_rocket', range: 280, attackSound: 'assets/audio/시원한 은행가는길 공격소리.ogg' },

  'Greatbow': { label: 'Greatbow', type: 'ranged', tech: 'primitive', grade: 'Uncommon', dmg: 17, spd: 0.28, ap: 0.2, effect: 'arrow', range: 300, attackSound: 'assets/audio/weaponsound/BowA.ogg' },
  'Revolver': { label: 'Revolver', type: 'ranged', tech: 'advanced', grade: 'Uncommon', dmg: 18, spd: 0.5, ap: 0.2, effect: 'knockback', range: 260, attackSound: 'assets/audio/revolver_a.ogg' },
  'Bolt-action Rifle': { label: 'Bolt-action Rifle', type: 'ranged', tech: 'advanced', grade: 'Uncommon', dmg: 24, spd: 0.3, ap: 0.3, effect: null, range: 370, attackSound: 'assets/audio/weaponsound/GunShotA.ogg' },
  'Pilum': { label: 'Pilum', type: 'ranged', tech: 'primitive', grade: 'Uncommon', dmg: 25, spd: 0.2, ap: 0.3, effect: 'arrow', range: 200, attackSound: 'assets/audio/weaponsound/BowA.ogg' },

  'Heavy SMG': { label: 'Heavy SMG', type: 'ranged', tech: 'advanced', grade: 'Rare', dmg: 20, burst: 3, spd: 0.45, ap: 0.15, range: 240, attackSound: 'assets/audio/샷건.ogg' },
  'Assault Rifle': { label: 'Assault Rifle', type: 'ranged', tech: 'advanced', grade: 'Rare', dmg: 40, burst: 3, spd: 0.4, ap: 0.25, effect: null, range: 310, attackSound: 'assets/audio/돌격소총.ogg' },
  'Chain Shotgun': { label: 'Chain Shotgun', type: 'ranged', tech: 'advanced', grade: 'Rare', dmg: 180, spd: 0.4, ap: 0.3, effect: 'aoe_knockback', range: 100, attackSound: 'assets/audio/전투산탄총.ogg' },

  'Sniper Rifle': { label: 'Sniper Rifle', type: 'ranged', tech: 'advanced', grade: 'Epic', dmg: 350, spd: 0.18, ap: 0.8, effect: 'armor_break', shred: 20, range: 480, attackSound: 'assets/audio/고급저격총.ogg' },
  'Charge Rifle': { label: 'Charge Rifle', type: 'ranged', tech: 'advanced', grade: 'Epic', dmg: 75, burst: 3, spd: 0.4, ap: 0.5, effect: null, range: 280, attackSound: 'assets/audio/차지라이플.ogg' },
  'Charge Lance': { label: 'Charge Lance', type: 'ranged', tech: 'advanced', grade: 'Epic', dmg: 280, spd: 0.2, ap: 0.9, effect: 'armor_break', shred: 15, range: 340, attackSound: 'assets/audio/weaponsound/ChargeShotA.ogg' },

  'Minigun': { label: 'Minigun', type: 'ranged', tech: 'advanced', grade: 'Legendary', dmg: 120, burst: 25, spd: 0.8, ap: 0.3, effect: null, range: 310, attackSound: 'assets/audio/미니건.ogg' },
  'Beam Grazer': { label: 'Beam Grazer', type: 'ranged', tech: 'advanced', grade: 'Legendary', dmg: 30, spd: 0.25, ap: 0.6, effect: 'multi_bullet', isTrueDamage: true, range: 9999, attackSound: 'assets/audio/weaponsound/ChargeShotA.ogg' },
  'Beam Repeater': { label: 'Beam Repeater', type: 'ranged', tech: 'advanced', grade: 'Mythic', dmg: 55, burst: 1, spd: 0.5, ap: 1.0, effect: 'instant_multi', isTrueDamage: true, range: 9999, attackSound: 'assets/audio/weaponsound/ChargeShotA.ogg' },
  'Needle Crossbow': { label: 'Needle Crossbow', type: 'ranged', tech: 'advanced', grade: 'Mythic', dmg: 120, spd: 0.4, ap: 0.4, effect: 'toxic_stun', range: 190, attackSound: 'assets/audio/신경석궁.ogg' }
};

// 소모성 아이템 DB (타워로 건설 불가, 인벤토리에서 사용)
export const ITEM_DB = {
  'frag_grenade': { 
    name: 'Frag Grenade', type: 'item', grade: 'Common', dmg: 250, ap: 0.2, effect: 'frag_stun', shred: 0, radius: 100, cooldown: 10,
    desc: 'Deals massive damage in an area. Stuns biological enemies for 4s.'
  },
  'pulse_grenade': { 
    name: 'EMP Grenade', type: 'item', grade: 'Uncommon', dmg: 50, ap: 0.5, effect: 'emp', shred: 0, radius: 120, cooldown: 12,
    desc: 'Emits a powerful electromagnetic pulse (EMP). Instantly removes shields and stuns mechanical enemies for 6s.'
  },
  'molotov': { 
    name: 'Molotovs', type: 'item', grade: 'Rare', dmg: 20, ap: 0.1, effect: 'burn_fear', radius: 80, cooldown: 15,
    desc: 'Creates fire that lasts for 7s. Biological units take burn damage and fall into panic.'
  },
  'smoke_launcher': { 
    name: 'Smoke Launcher', type: 'item', grade: 'Rare', dmg: 0, ap: 0, effect: 'smoke', radius: 150, cooldown: 20,
    desc: 'Creates a white smoke cloud for 8s. All enemies in the cloud have significantly reduced movement speed.'
  },
  'toxin_grenade': { 
    name: 'Tox Grenade', type: 'item', grade: 'Epic', dmg: 10, ap: 0.8, effect: 'toxin', shred: 50, radius: 120, cooldown: 25,
    desc: 'Forms a toxic gas cloud for 6s. Enemies in the area have their armor continuously corroded (up to 30%).'
  },
  'orbital_strike': { 
    name: 'Orbital Strike', type: 'item', grade: 'Legendary', dmg: 99999999, ap: 1.0, effect: 'orbital', radius: 0, cooldown: 60,
    desc: 'A devastating beam from a satellite. Instantly eliminates all enemies on the battlefield, except bosses.'
  },
  'psychic_lance': { 
    name: 'Shock Lance', type: 'item', grade: 'Legendary', dmg: 0, ap: 0, effect: 'psychic_stun', radius: 40, cooldown: 90,
    desc: 'Fires a concentrated psychic blast. Stuns bosses for 15s and pauses the boss timer during the stun.'
  },
  'go_juice': { 
    name: 'Go-juice', type: 'item', grade: 'Epic', dmg: 0, ap: 0, effect: 'buff_aura', radius: 120, cooldown: 80,
    desc: 'A powerful combat stimulant. Creates a stim zone for 20s that increases the Atk and Spd of all friendly towers by 50%.'
  }
};

export const SPECIAL_CRAFT_DB = {
    'frag_grenade': { silver: 300, steel: 150, component: 5 },
    'pulse_grenade': { silver: 500, steel: 250, plasteel: 20, component: 10 },
    'molotov': { silver: 350, wood: 100, component: 5 },
    'smoke_launcher': { silver: 400, steel: 180, component: 5 },
    'toxin_grenade': { silver: 1000, steel: 400, jade: 5, component: 15 },
    'psychic_lance': { silver: 1500, uranium: 100, plasteel: 50, jade: 10, component: 20 },
    'go_juice': { food: 500, herbalMedicine: 50, uranium: 20, component: 10 },
    'Persona Core': { 
        silver: 5000, 
        wood: 3000, 
        steel: 2000, 
        plasteel: 500, 
        uranium: 200, 
        jade: 50, 
        component: 50, 
        researchPoints: 3000 
    }
};

export const MATERIAL_DB = {
  'Wood': { displayName: 'Wood', matMul: 1.5, spdMul: 1.2, apMul: 0.1 },
  'Steel': { displayName: 'Steel', matMul: 1.0, spdMul: 1.0, apMul: 1.0 },
  'Plasteel': { displayName: 'Plasteel', matMul: 1.1, spdMul: 1.4, apMul: 1.2 },
  'Uranium': { displayName: 'Uranium', matMul: 1.8, spdMul: 0.6, apMul: 2.0 },
  'Jade': { displayName: 'Jade', matMul: 0.4, spdMul: 0.4, apMul: 0.05 },
  'Slate': { displayName: 'Slate', matMul: 1.1, spdMul: 0.9, apMul: 0.2 },
  'None': { displayName: 'None', matMul: 1.0, spdMul: 1.0, apMul: 1.0 }
};

export const QUALITY_COEFFS = {
  awful: 0.4,
  normal: 1.0,
  excellent: 1.35,
  legendary: 1.55
};

export const GRADE_PROBABILITIES = {
  Common: 53.45,
  Uncommon: 31.0,
  Rare: 13.0,
  Epic: 2.3,
  Legendary: 0.2,
  Mythic: 0.05 // 일반 뽑기에서 고등급 기대값을 낮춰 고급 상자의 메리트 강화
};

export const QUALITY_PROBABILITIES = {
  awful: 10,
  normal: 70,
  excellent: 18,
  legendary: 2
};

export const MATERIAL_PROBABILITIES = {
  'Wood': 40,
  'Steel': 30,
  'Plasteel': 15,
  'Uranium': 10,
  'Jade': 5
};
