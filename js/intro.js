// 이미지/문구/버튼 정의
const slides = [
  {
    bg: 'images/intro/intro1-1.jpg',
    img: 'images/intro/intro1-2.png',
    text: '<span class="text-bold">당신의 하루가 머무는 향,</span><br>그 첫번째 이야기',
    btn: 'NEXT'
  },
  {
    bg: 'images/intro/intro2-1.png',
    img: 'images/intro/intro2-2.png',
    text: '<span class="text-bold">당신의 취향을 향으로</span><br>기록해보세요.',
    btn: 'NEXT'
  },
  {
    bg: 'images/intro/intro3-1.jpg',
    img: 'images/intro/intro3-2.png',
    text: '<span class="text-bold">지금, 향으로 여행을</span><br>시작하세요.',
    btn: 'START'
  }
];

const bgDiv = document.querySelector('.intro-bg');
const cards = document.querySelectorAll('.intro-card');
let current = 0;

function showSlide(idx) {
  // 배경 이미지 변경
  bgDiv.style.backgroundImage = `url('${slides[idx].bg}')`;

  // 카드 순환
  cards.forEach((card, i) => {
    if (i === idx) {
      card.style.display = '';
      card.querySelector('.card-image').src = slides[i].img;
      card.querySelector('.card-text').innerHTML = slides[i].text;
      card.querySelector('.card-button').textContent = slides[i].btn;
    } else {
      card.style.display = 'none';
    }

    // dot 상태 변경
    const dots = card.querySelectorAll('.dot');
    dots.forEach((dot, dotIdx) => {
      dot.classList.toggle('active', dotIdx === idx);
    });
  });

  // 브랜드로고(2,3번째) 보이기
  document.querySelector('.logo').style.opacity = idx > 0 ? 1 : 0;
}

// 버튼 이벤트
cards.forEach((card, i) => {
  card.querySelector('.card-button').addEventListener('click', () => {
    if (current < slides.length - 1) {
      current++;
      showSlide(current);
    } else {
      // 마지막페이지에서 동작, 예시: location.href = 'main.html'
    }
  });
});

showSlide(0);

