const textElement = document.querySelectorAll(".banner_text span");

textElement.forEach((char, i) => {
    let random = Math.random()*0.15;
    char.style.animationDelay = i * random +'s';
});


document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll(".tour ul li");

    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("show"); // ✅ show 클래스 추가 (위로 올라오면서 나타나는 애니메이션)
                observer.unobserve(entry.target); // ✅ 한 번만 실행되도록 설정
            }
        });
    }, { threshold: 0.2 });

    sections.forEach(section => observer.observe(section));

    // ✅ Swiper 슬라이드 설정
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


// ✅ 지도 변경 기능 추가
function changeImage(index) {
    const images = document.querySelectorAll("#imageBox .main-image");
    images.forEach(img => (img.style.display = "none"));
    images[index].style.display = "block";

    const buttons = document.querySelectorAll(".btn-group button");
    buttons.forEach(btn => btn.classList.remove("active"));
    buttons[index].classList.add("active");
}
