// response
let mql = window.matchMedia("(min-width:150px) and (max-width: 1024px)");
let mql2 = window.matchMedia("(max-width: 767px)");
// ㄴmatchMedia 반응형부분 들어갈 때 수정하는거, ture false 인지 확인해주는 역할
let breakPoint = true;
mql.addListener((e)=>{
    breakPoint = e.matches;
})





//roomlist
const elRoom_img = document.querySelectorAll('.room_img li');

elRoom_img.forEach(function(li){
    li.onclick = (e)=>{
        if(!li.classList.contains('active')){
            elRoom_img.forEach(function(removeLi){
                removeLi.classList.remove('active');
            })
        }
        li.classList.toggle('active');
        // if(mql2.matches){
        //     e.stopPropagation();
        // }
    }
})


//special
function init(){
    const elWrap = document.querySelector('.wrap');
    const elSpecial = document.querySelector('.special');
    const elSpecialCon_img = document.querySelectorAll('.con_img');
    const elSpecialCon_txt = document.querySelectorAll('.con1_text');
    const elTour = document.querySelector('.tour');
    const elReserv = document.querySelector('.reserve_popupbar');
    let start, end, isScrolled = false, intervalId;
    let n1=0,opacityNum=0,incriNum=0, decreNum=1,
        pos = {y1:0,y2:0,state:true};

        setTimeout(function(){document.body.style.height = (elWrap.offsetHeight) + 'px';},200);
        // window.onload = ()=>{
        //     document.body.style.height = (elWrap.offsetHeight) + 'px';
        // }
        

    function reserv(){
        if(elTour.offsetTop >= window.scrollY){
            elReserv.style.display = 'flex';
            if(mql2.matches){
                elReserv.style = 'flex-direction: column;';
            }
        }else{
            elReserv.style.display = 'none';
        }
    }
    
    function updown(){
        pos.y1 = window.scrollY;
        pos.state = pos.y1>pos.y2 ? true : false;
        pos.y2 = pos.y1;
        // true : 아래로 스크롤  false : 위로 스크롤
    }
    
    function specialAni(){
        window.onscroll = updown;
        
        let y = window.scrollY, t = elSpecial.offsetTop, c = elSpecial.offsetHeight;
        // offest : 오브젝트가 가지고 있는 크기를 기준으로 수치값을 가짐
        
        if(y > t+(c*0) && y < t+(c*1)){ 
            n1 = 0;  
            opacityNum = (window.scrollY - (t+(c*0))) * 0.0030;
        }
        else if(y > t+(c*1) && y < t+(c*2)){ 
            n1 = 1; 
            opacityNum = (window.scrollY - (t+(c*1))) * 0.0030;
        }
        else if(y > t+(c*2) && y < t+(c*3)){ 
            n1 = 2; 
            opacityNum= (window.scrollY - (t+(c*2))) * 0.0030;;
        }
        // 각 구간에서 적용할 애니메이션 구분을 위한거
        // t, t+c, t+2c, t+3c 는 각 섹션의 시작점, 1/4위치, 2/4위치, 3/4위치 지점을 의미함
        // 첫번째 영역에 들어오면 n1=0, 두번째 영역에 들어오면 n1=1, 세번째 영역에 들어오면 n1=2
        
        incriNum = opacityNum;
        incriNum = Math.max(0, Math.min(1, incriNum));
        // opacityNum값을 0~1 사이로 제한하는 역할
        // incriNum 현재 컨텐츠가 나타나는 정도 - 투명도 증가
        
        decreNum = 1 - opacityNum;
        decreNum = Math.max(0, Math.min(1, decreNum));
        // decreNum 이전 컨텐츠가 사라지는 정도 - 투명도 감소
        
        elSpecialCon_txt[n1].style = `opacity:${incriNum}; transition:0.8s;`; 
        // 현재 요소가 점점 나타남
        if(n1 != 0) {
            elSpecialCon_img[n1-1].style = `opacity:${decreNum};`;
            elSpecialCon_txt[n1-1].style = `opacity:${decreNum};`;
        }   
        // 이전 이미지,텍스트 요소가 점점 사라짐
        // 새로운 요소(n1=1)가 나타나는 동시에, 이전 요소(n1=0)가 점점 사라짐
    }    

    function specialFix(){
        clearInterval(intervalId);
        // 실행중인 setInterval 중단
        intervalId = setInterval(()=>{
            // 일정시간마다 화면을 갱신함
            start = window.scrollY > elSpecial.offsetTop;
            end = (elTour.offsetTop - window.innerHeight) > window.scrollY;
            // 섹션의 시작지점과 끝지점 찾기
            
            if(!breakPoint || !mql.matches){
                // 특정부분에서 반응형 설정이 적용되었는지 체크 || 반응형 조건과 맞는지 확인
                if(start && end){
                    elSpecial.style = `transform:translateY(${window.scrollY - elSpecial.offsetTop}px)`;
                    specialAni();
                    // 해당 섹션의 시작점을 지났고 끝지점을 안지났을때, translateY 값을 주고 specialAni에서 써둔 컨텐츠가 사라지고 나타나고 효과 발생시키기
                }else{
                    if(!start) elSpecial.style = `transform:translateY(0px)`;
                    if(window.scrollY < elSpecial.offsetTop){
                        elSpecialCon_img.forEach((o,i)=>{
                            elSpecialCon_img[i].style = `opacity:1;`;
                            elSpecialCon_txt[i].style = `opacity:0;`;
                        })
                    }
                    // 섹션의 탑값이 더 크다면 이미지를 보이게, 텍스트는 안보이게
                }
            }

            elWrap.style = `transform:translateY(-${window.scrollY}px)`;
            // body에 지정한 높이 값을 반대로 이동시켜 .wrap을 위로 당겨서 고정된 느낌을 주는 효과를 만든다
            // 스크롤값만큼 wrap 전체를 위로 이동시킴
            reserv();
        });
        
    }

    
    window.onscroll = ()=>{
        specialFix();
        
    }
    
}

window.onload = init;


//reserv-btn
const resAll = document.querySelector('.reserve_popupbar');
const resBtn = document.querySelector('.mb_reserv');
// const resLeft = document.querySelector('.reserve_popupbar .left');
if(mql2.matches){
    resBtn.onclick=()=>{
        resBtn.classList.toggle('active');
        resAll.classList.toggle('active');
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const resLeft = document.querySelector('.reserve_popupbar .left');
    const resRight = document.querySelector('.reserve_popupbar .right');
    // if (!resLeft || !resRight) return;
    const originalDisplay = getComputedStyle(resLeft).display; // 원래 display 값 저장
    let clicked = false; //클릭 상태 저장

    window.addEventListener("scroll", () => {
        if (window.scrollY !== 0) {
            resLeft.style.display = "none";
            clicked=false; // 스크롤 시 클릭 횟수 초기화
        } else {
            resLeft.style.display = originalDisplay; // 원래 상태로 복원
        }
        if(mql2.matches){
            resLeft.style.display = originalDisplay;
        }
    });
    resRight.onclick=(e)=>{
        if(!clicked){
            resLeft.style.display = originalDisplay;
            clicked=true;
            e.preventDefault(); // 첫 클릭에서는 링크 이동 막기
        }else{
            if(!num == 0){
                //1회성 localStorage
                roomData2 = {호실 : roomData, 입실날짜 : startDate01, 퇴실날짜 : endDate01, 성인 :num, 어린이 : num2}
                console.log(roomData2);
                localStorage.setItem('roomData2', JSON.stringify(roomData2));
                window.location.href="./reserv02.html" // 두 번째 클릭: 페이지 이동
            }else{
                e.preventDefault();
                alert('인원 수를 선택해주세요 !');
            }
        }
    }
    if(mql2.matches){
        resRight.onclick=()=>{
            resLeft.style.display = originalDisplay;
        }
    }
});



//메인슬라이드
var swiper = new Swiper(".mySwiper", {
    sildesPerview: 4,
    loop: true,
    autoplay:true
});

function swiperTxt(){
    const textElement01 = document.querySelectorAll(".swiper-slide-active span");

    textElement01.forEach((char, i) => {
        let random = Math.random()*0.12;
        char.style.animationDelay = i * random +'s';
    });
}

swiper.on('slideChangeTransitionStart', function (e) {
    swiperTxt();
});
swiperTxt();


//tour
var swiper2 = new Swiper(".tour-mySwiper", {
    slidesPerView: 1,
    loop: true,
    autoplay:true,
    pagination: {
        el: ".swiper-pagination",
        clickable: true,
    }
});

swiper2.on('slideChangeTransitionEnd', function (e) {
    let num = e.realIndex;
    // 0 1 2 3
    const elTourcon=document.querySelectorAll('.tour_content')
    elTourcon.forEach(function(con, i){
        if(num==i){
            con.style='opacity:1; transform:translateY(0%);'
        }else{
            con.style='opacity:0; transform:translateY(100%);'
            
        }
    });
});