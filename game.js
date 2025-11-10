// 1. 기본 설정
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 캔버스 크기를 모바일 화면에 맞게 설정
canvas.width = window.innerWidth;
canvas.height = window.innerHeight - 100; // 제목 공간 확보

// 2. 게임 변수 설정
let score = 0;
let gameCleared = localStorage.getItem('gameCleared') === 'true'; // 클리어 여부 불러오기
let snackSpeed = 2; // 초기 간식 속도

// 바구니 (플레이어) 설정
const basket = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 40,
    width: 50,
    height: 20,
    color: '#8B4513' // 갈색
};

// 떨어지는 간식들 (배열)
let snacks = [];

// 3. 모바일 터치 컨트롤
// 손가락으로 바구니를 좌우로 움직임
canvas.addEventListener('touchmove', (e) => {
    e.preventDefault(); // 화면 스크롤 방지
    let touchX = e.touches[0].clientX;
    
    // 바구니가 캔버스 밖으로 나가지 않도록 함
    if (touchX > basket.width / 2 && touchX < canvas.width - basket.width / 2) {
        basket.x = touchX - basket.width / 2;
    }
}, { passive: false }); // 스크롤 방지를 위해 passive: false 설정

// 4. 간식 생성 함수
function spawnSnack() {
    const snack = {
        x: Math.random() * (canvas.width - 20), // 캔버스 내 랜덤 X 위치
        y: 0, // 하늘에서 시작
        width: 20,
        height: 20,
        color: `hsl(${Math.random() * 360}, 100%, 75%)` // 랜덤 색상
    };
    snacks.push(snack);
}

// 5. 게임 루프 (핵심)
function gameLoop() {
    // 5.1. 화면 지우기
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 5.2. 바구니 그리기
    ctx.fillStyle = basket.color;
    ctx.fillRect(basket.x, basket.y, basket.width, basket.height);
    // 바구니 위에 손잡이처럼 보이게 (장식)
    ctx.fillStyle = '#A0522D';
    ctx.fillRect(basket.x + 10, basket.y - 10, basket.width - 20, 10);

    // 5.3. 간식들 업데이트 및 그리기
    for (let i = snacks.length - 1; i >= 0; i--) {
        let snack = snacks[i];
        
        // 간식 이동
        snack.y += snackSpeed;
        
        // 간식 그리기
        ctx.fillStyle = snack.color;
        ctx.fillRect(snack.x, snack.y, snack.width, snack.height);
        
        // 5.4. 충돌 감지 (간식 잡기)
        if (
            snack.y + snack.height > basket.y &&
            snack.x < basket.x + basket.width &&
            snack.x + snack.width > basket.x
        ) {
            score++; // 점수 증가
            snackSpeed += 0.1; // 속도 증가 (난이도 상승!)
            snacks.splice(i, 1); // 잡힌 간식 제거
        } 
        // 5.5. 바닥에 떨어진 간식 제거
        else if (snack.y > canvas.height) {
            snacks.splice(i, 1);
            // (옵션) 바닥에 떨어지면 감점 또는 게임 오버 로직 추가
        }
    }
    
    // 5.6. 점수 표시
    ctx.fillStyle = 'black';
    ctx.font = '20px Arial';
    ctx.fillText(`점수: ${score}`, 10, 25);

    // 5.7. 클리어 여부 확인 및 저장
    const clearScore = 50; // 목표 점수 (예: 50점)
    
    if (score >= clearScore && !gameCleared) {
        gameCleared = true;
        // 🚨 여기가 중요! localStorage에 "true"라는 문자열을 저장
        localStorage.setItem('gameCleared', 'true'); 
        alert(`축하합니다! ${clearScore}점을 달성해서 게임을 클리어했습니다!`);
    }

    // 5.8. (참고) 클리어했다면 표시
    if (gameCleared) {
        ctx.fillStyle = 'green';
        ctx.fillText('CLEARED!', canvas.width - 100, 25);
    }

    // 5.9. 다음 프레임 요청
    requestAnimationFrame(gameLoop);
}

// 1초마다 새 간식 생성
setInterval(spawnSnack, 1000);

// 게임 시작!
gameLoop();