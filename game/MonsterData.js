/**
 * MonsterData.js
 * 라운드별 고정 몬스터 명단 데이터 (1~50라운드)
 */
export const FIXED_MONSTER_LIST = [
    { name: "Rat", type: "organic", img: "1쥐.webp" },            // 1
    { name: "Squirrel", type: "organic", img: "2.다람쥐.webp" },         // 2
    { name: "Hare", type: "organic", img: "3.멧토끼.webp" },         // 3
    { name: "Snowhare", type: "organic", img: "4.눈토끼.webp" },         // 4
    { name: "Guinea pig", type: "organic", img: "5.기니피그.webp" },       // 5
    { name: "Boomrat", type: "organic", img: "6.폭탄쥐.webp" },         // 6
    { name: "Chinchilla", type: "organic", img: "7.털실쥐.webp" },         // 7
    { name: "Yorkshire Terrier", type: "organic", img: "8.요크셔테리어.webp" },   // 8
    { name: "Labrador Retriever", type: "organic", img: "9.리트리버.webp" },       // 9
    { name: "Wild Boar", type: "organic", boss: true, img: "10.멧돼지.webp" }, // 10
    { name: "Capybara", type: "organic", img: "11.카피바라.webp" },       // 11
    { name: "Alphabeaver", type: "organic", img: "12.비버.webp" },           // 12
    { name: "Deer", type: "organic", img: "13.사슴.webp" },           // 13
    { name: "Gazelle", type: "organic", img: "14.가젤.webp" },           // 14
    { name: "Boomalope", type: "organic", img: "15.폭탄사슴.webp" },       // 15
    { name: "Alpaca", type: "organic", img: "16.알파카.webp" },         // 16
    { name: "Donkey", type: "organic", img: "17.당나귀.webp" },         // 17
    { name: "Horse", type: "organic", img: "18.말.webp" },             // 18
    { name: "Moose", type: "organic", img: "19.말코손바닥사슴.webp" },  // 19
    { name: "Megasloth", type: "organic", boss: true, img: "20.거대늘보.webp" }, // 20
    { name: "Muffalo", type: "organic", img: "21.머팔로.webp" },         // 21
    { name: "Bison", type: "organic", img: "22.들소.webp" },           // 22
    { name: "Elephant", type: "organic", img: "23.코끼리.webp" },         // 23
    { name: "Wolf", type: "organic", img: "24.늑대.webp" },           // 24
    { name: "Wolverine", type: "organic", img: "25.울버린.webp" },         // 25
    { name: "Tiger", type: "organic", img: "26.호랑이.webp" },         // 26
    { name: "Bear", type: "organic", img: "27.곰.webp" },             // 27
    { name: "Sabretooth", type: "organic", img: "28.검치호.webp" },         // 28
    { name: "Warg", type: "organic", img: "29.와르그.webp" },         // 29
    { name: "Thrumbo", type: "organic", boss: true, img: "30.트럼보.webp" }, // 30
    { name: "Meatshield", type: "organic", img: "31.화살받이.webp" },       // 31 (화살받이 매칭)
    { name: "Archer", type: "organic", img: "32.궁수.webp" },           // 32
    { name: "Warrior", type: "organic", img: "33.전사.webp" },           // 33
    { name: "Hunter", type: "organic", img: "34.사냥꾼.webp" },         // 34
    { name: "Berserker", type: "organic", img: "35.광전사.webp" },         // 35
    { name: "Great Archer", type: "organic", img: "36.대궁수.webp" },         // 36
    { name: "Berserker Chief", type: "organic", img: "37.광전사대장.webp" },     // 37
    { name: "Archer Chief", type: "organic", img: "38.궁수대장.webp" },       // 38
    { name: "Slaver", type: "organic", img: "39.노예상.webp" },         // 39
    { name: "Ancient", type: "organic", boss: true, img: "40.고대인.webp" }, // 40
    { name: "Wanderer", type: "organic", img: "41.방랑자.webp" },         // 41
    { name: "Scavenger", type: "organic", img: "42.스케빈저.webp" },       // 42
    { name: "Grenadier", type: "organic", img: "43.척탄병.webp" },         // 43
    { name: "Mercenary Gunner", type: "organic", img: "44.용병사수.webp" },       // 44
    { name: "Mercenary Sniper", type: "organic", img: "45.용병저격수.webp" },     // 45
    { name: "Mercenary Slasher", type: "organic", img: "46.용병슬래셔.webp" },     // 46
    { name: "Heavy Mercenary", type: "organic", img: "47.중무장용병.webp" },     // 47
    { name: "Elite Mercenary", type: "organic", img: "48.엘리트용병.webp" },     // 48
    { name: "Veteran Mercenary", type: "organic", img: "49.정예용병.webp" },       // 49
    { name: "Mercenary Captain", type: "organic", boss: true, img: "50.용병대장.webp" }, // 50
    { name: "Militor", type: "mech", img: "51.밀리터.webp" },            // 51
    { name: "Legionary", type: "mech", img: "52.리저너리.webp" },         // 52
    { name: "Tesseron", type: "mech", img: "53.테서론.webp" },           // 53
    { name: "Scorcher", type: "mech", img: "54.스코처.webp" },           // 54
    { name: "Scyther", type: "mech", img: "55.사이더.webp" },           // 55
    { name: "Lancer", type: "mech", img: "56.랜서.webp" },             // 56
    { name: "Pikeman", type: "mech", img: "57.파이크맨.webp" },           // 57
    { name: "Centipede", type: "mech", img: "58.센티피드.webp" },         // 58
    { name: "Termite", type: "mech", img: "59.터마이트.webp" },         // 59
    { name: "Warqueen", type: "mech", boss: true, img: "60.워퀸.webp" },    // 60
    { name: "Tunneler", type: "mech", img: "61.터널러.webp" },           // 61
    { name: "Centurion", type: "mech", img: "62.센츄리온.webp" },         // 62
    { name: "Cyclops", type: "mech", img: "63.사이클롭스.webp" },         // 63
    { name: "Diabolus", type: "mech", img: "64.디아볼루스.webp" },         // 64
    { name: "Apocriton", type: "mech", img: "65.아포크리톤.webp" },         // 65
    { name: "Trooper", type: "organic", img: "66.돌격병.webp" },         // 66
    { name: "Imperial Grenadier", type: "organic", img: "67.제국척탄병.webp" },       // 67
    { name: "Imperial Guard", type: "organic", img: "68.제국친위대.webp" },       // 68
    { name: "Champion", type: "organic", img: "69.용사.webp" },            // 69
    { name: "Bestower", type: "organic", boss: true, img: "70.수여자.webp" }, // 70
    { name: "Heavy Trooper", type: "organic", img: "71.중무장병.webp" },         // 71
    { name: "Yeoman", type: "organic", img: "72.종사.webp" },            // 72
    { name: "Acolyte", type: "organic", img: "73.수련생.webp" },           // 73
    { name: "Knight", type: "organic", img: "74.기사.webp" },            // 74
    { name: "Praetor", type: "organic", img: "75.법무관.webp" },           // 75
    { name: "Baron", type: "organic", img: "76.남작.webp" },            // 76
    { name: "Duke", type: "organic", img: "77.공작.webp" },            // 77
    { name: "Stellic Warden", type: "organic", img: "78.별의감시자.webp" },       // 78
    { name: "Stellic Defender", type: "organic", img: "79.별의수호자.webp" },       // 79
    { name: "Stellarch", type: "organic", boss: true, img: "80.항성군주.webp" }, // 80
    { name: "High Subaltern", type: "organic", img: "81.상급하수인.webp" },       // 81
    { name: "Spiketongue", type: "organic", img: "82.쐐기촉수.webp" },         // 82
    { name: "Triffid", type: "organic", img: "83.삼발촉수.webp" },         // 83
    { name: "Bulwark", type: "organic", img: "84.갑옷촉수.webp" },         // 84
    { name: "Fleshbeast", type: "organic", img: "85.살종양.webp" },          // 85
    { name: "Fleshmass Heart", type: "organic", img: "86.살덩이심장.webp" },       // 86
    { name: "Noctol", type: "organic", img: "87.암귀.webp" },            // 87
    { name: "Ghoul", type: "organic", img: "88.구울.webp" },            // 88
    { name: "Shambler", type: "organic", img: "89.휘청이는자.webp" },       // 89
    { name: "Nociosphere", type: "organic", boss: true, img: "90.고통구체.webp" }, // 90
    { name: "Chimera", type: "organic", img: "91.키메라.webp" },           // 91
    { name: "Devourer", type: "organic", img: "92.걸신.webp" },            // 92
    { name: "Gorehulk", type: "organic", img: "93.가시괴인.webp" },         // 93
    { name: "Metalhorror", type: "none", img: "94.메탈호러.webp" },         // 94
    { name: "Death Pall", type: "none", img: "95.죽음안개.webp" },         // 95
    { name: "Blood Rain", type: "none", img: "96.피의비.webp" },           // 96
    { name: "Twisted Obelisk", type: "none", img: "97.뒤틀린오벨리스크.webp" }, // 97
    { name: "Corrupt Obelisk", type: "none", img: "98.타락한오벨리스크.webp" }, // 98
    { name: "Crooked Obelisk", type: "none", img: "99.비뚤어진오벨리스크.webp" }, // 99
    { name: "Tynan Sylvester", type: "none", boss: true, img: "100.타이난.webp" }
];
