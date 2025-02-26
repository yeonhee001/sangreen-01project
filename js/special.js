const textElement = document.querySelectorAll(".banner_text span");

textElement.forEach((char, i) => {
    let random = Math.random()*0.15;
    char.style.animationDelay = i * random +'s';
});


document.addEventListener("DOMContentLoaded", () => {
  const sections = document.querySelectorAll(".special ul li");

  const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
          if (entry.isIntersecting) {
              entry.target.classList.add("show"); // ✅ show 클래스 추가
              observer.unobserve(entry.target);
          }
      });
  }, { threshold: 0.2 });

  sections.forEach(section => observer.observe(section));

  // Swiper 슬라이드 설정
  new Swiper(".swiper", {
      loop: true,
      pagination: {
          el: ".swiper-pagination",
          clickable: true,
      },
      autoplay: {
        delay: 3000,  // 초마다 자동 전환
        disableOnInteraction: false, // 유저가 조작해도 자동재생 유지
        },
  });
});
