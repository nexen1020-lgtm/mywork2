/* ============================================================
   JavaScript: 폼 데이터를 읽어서 화면에 보여주기
   - 서버 없이도 동작하도록 e.preventDefault()로 새로고침을 막습니다.
   - FormData / querySelector로 입력값을 읽는 기본 패턴을 익힙니다.
   ============================================================ */

// 결과 박스에 텍스트를 넣고 보여주는 공용 함수
function showResult(id, text) {
  const box = document.getElementById(id);
  box.textContent = text;
  box.classList.add('show');
}

// ---------- 예제 1: 학식 주문 ----------
const prices = { '제육덮밥': 5500, '치즈돈까스': 6000, '마라탕': 7500, '샐러드': 4500 };

document.getElementById('lunchForm').addEventListener('submit', function (e) {
  e.preventDefault();                      // 페이지 새로고침 방지
  const data = new FormData(this);          // 폼의 모든 값을 한 번에 가져오기
  const name  = data.get('name');
  const menu  = data.get('menu');
  const count = Number(data.get('count'));
  const spicy = data.get('spicy');
  const total = prices[menu] * count;

  showResult('lunchResult',
    `🧾 ${name}님의 주문서\n` +
    `메뉴: ${menu} × ${count}개 (${spicy})\n` +
    `총 금액: ${total.toLocaleString()}원\n` +
    (spicy === '불닭급' ? '🔥 우유 한 잔은 서비스로 드릴게요!' : '😊 맛있게 드세요!')
  );
});

// ---------- 예제 2: 동아리 가입 ----------
document.getElementById('clubForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(this);
  const clubs = data.getAll('club');        // 체크박스는 getAll로 여러 개 가져오기

  if (clubs.length === 0) {
    showResult('clubResult', '⚠️ 동아리를 최소 1개는 골라주세요!');
    return;
  }

  showResult('clubResult',
    `✅ 가입 신청 완료!\n` +
    `학번: ${data.get('studentId')}\n` +
    `이메일: ${data.get('email')}\n` +
    `생년월일: ${data.get('birthday') || '(미입력)'}\n` +
    `관심 동아리: ${clubs.join(', ')}\n` +
    `자기소개: ${data.get('intro') || '(없음)'}`
  );
});

// ---------- 예제 3: 밸런스 게임 ----------
document.getElementById('balanceForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(this);
  const q1 = data.get('q1'), q2 = data.get('q2'), q3 = data.get('q3');
  const conf = data.get('confidence');

  // 간단한 성향 분석 (재미용!)
  let type = '';
  if (q1 === '치킨' && q3 === '9교시') type = '🌙 야행성 치킨러';
  else if (q1 === '피자' && q3 === '1교시') type = '🌅 아침형 피자러';
  else if (q2 === '팀플') type = '🐺 고독한 늑대형';
  else type = '🤝 협동 만렙형';

  showResult('balanceResult',
    `당신의 선택: ${q1} / ${q2} / ${q3}\n` +
    `확신도: ${conf}%\n` +
    `👉 당신은 「${type}」 대학생입니다!`
  );
});

// ---------- 예제 4: 하루 만들기 ----------
document.getElementById('dayForm').addEventListener('submit', function (e) {
  e.preventDefault();
  const data = new FormData(this);
  const file = data.get('photo');

  // 기상~취침 시간 계산
  const [wh, wm] = data.get('wake').split(':').map(Number);
  const [sh, sm] = data.get('sleep').split(':').map(Number);
  let awake = (sh * 60 + sm) - (wh * 60 + wm);
  if (awake < 0) awake += 24 * 60;   // 자정을 넘기는 경우

  const box = document.getElementById('dayResult');
  box.style.background = data.get('mood') + '22';  // 색깔 + 투명도
  box.style.borderLeft = `6px solid ${data.get('mood')}`;

  showResult('dayResult',
    `⏰ 깨어있는 시간: ${Math.floor(awake / 60)}시간 ${awake % 60}분\n` +
    `🎨 오늘의 색: ${data.get('mood')}\n` +
    `📍 가고 싶은 곳: ${data.get('place') || '(미정)'}\n` +
    `📷 사진: ${file && file.name ? file.name : '(없음)'}`
  );
});

document.getElementById('confidence').addEventListener('input', function () {
  document.getElementById('confOut').value = this.value;
});
