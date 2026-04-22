export class Renderer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    
    // 부모 컨테이너에 맞춤
    this.resize();
    window.addEventListener('resize', () => this.resize());

    // 인게임 배경 이미지 로드
    this.bgImage = new Image();
    this.bgImageLoaded = false;
    this.bgImage.onload = () => {
      this.bgImageLoaded = true;
    };
    
    // 초기 배경 설정 (기본 1번)
    this.changeBackground('assets/backgrounds/user_choice_1.png');
  }

  // 실시간 배경 교체 함수
  changeBackground(path) {
    this.bgImageLoaded = false;
    this.bgImage.src = path;
  }

  resize() {
    const parent = this.canvas.parentElement;
    if (parent) {
      // [Optimization] 고해상도 디스플레이(DPR) 대응
      const dpr = window.devicePixelRatio || 1;
      const rect = parent.getBoundingClientRect();
      
      this.canvas.width = rect.width * dpr;
      this.canvas.height = rect.height * dpr;
      
      this.ctx.scale(dpr, dpr);
      
      this.width = rect.width;
      this.height = rect.height;
      
      // CSS 크기는 부모에 맞춤
      this.canvas.style.width = rect.width + 'px';
      this.canvas.style.height = rect.height + 'px';
    }
  }

  clear() {
    // 배경 이미지가 있든 없든 일단 기본 배경색을 칠함 (검은 화면 방지)
    this.ctx.fillStyle = '#1e1e1e';
    this.ctx.fillRect(0, 0, this.width, this.height);

    if (this.bgImageLoaded) {
      // 배경 이미지가 로드되었으면 그 위에 덮어씌움
      this.ctx.drawImage(this.bgImage, 0, 0, this.width, this.height);
    }
  }

  drawMap(waypoints) {
    if (!waypoints || waypoints.length === 0) return;
    
    this.ctx.save();
    
    // 캔버스 중앙 계산
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    const radius = 320;

    // 원형 트랙 그리기 (림월드 스타일의 자연스러운 다져진 길/그림자 효과)
    this.ctx.beginPath();
    this.ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    
    // 1. 길의 바닥면 (흙이 다져진 듯한 어두운 느낌)
    this.ctx.strokeStyle = 'rgba(0, 0, 0, 0.08)'; 
    this.ctx.lineWidth = 60; // 폭을 넓혀서 안정감 부여
    this.ctx.stroke();

    // 2. 중앙 가이드 라인 (배치를 돕기 위한 아주 미세한 하이라이트)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.015)';
    this.ctx.lineWidth = 2;
    this.ctx.stroke();
    
    this.ctx.restore();
  }

  drawEntities(entities) {
    for (const entity of entities) {
      if (entity.render) {
        entity.render(this.ctx);
      }
    }
  }

  drawGrid(tileSize) {
    // 배경 이미지 위에서는 그리드를 아주 연하게 표현
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
    this.ctx.lineWidth = 1;
    for (let x = 0; x <= this.width; x += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.height);
      this.ctx.stroke();
    }
    for (let y = 0; y <= this.height; y += tileSize) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.width, y);
      this.ctx.stroke();
    }
  }
}
