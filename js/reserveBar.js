const checkedtextEl = document.querySelector('.checkinout > p');

//방 금액
let roomPrice = {101 : 129000, 102 : 129000, 103 : 149000, 104 : 199000};

//예약하기 바에서 룸 선택
let roomData ="101";

//예약하기 바에서 날짜 선택
let startDate01 = null; //입실날짜 : 한국 기준 날짜 변환
let endDate01 = null; //퇴실날짜 : 한국 기준 날짜 변환

let startDate = null; //입실날짜
let endDate = null; //퇴실날짜
let formattedStartStr = null;
let formattedEndStr = null;

//입실날짜 - 퇴실날짜
let night = 0;

//2페이지에서 쓸 1회성 localStorage
let roomData2;

//어른, 어린이 인원 수
let num = 0;
let num2 = 0;

//오늘 표준 시간
let today = new Date();

//하루를 밀리초로 변환
//24시간(1일) * 60분(1시간) * 60초(1분) * 1000밀리초(1초) = 86400000
let oneDay = 24*60*60*1000;

const days = ["일", "월", "화", "수", "목", "금", "토"];

//날짜를 2025. 02. 22 토 모양으로 변환하기
function formatDate(date) {
    let year = date.getFullYear();
    let month = String(date.getMonth() + 1).padStart(2, "0");
    let day = String(date.getDate()).padStart(2, "0");
    let dayOfWeek = days[date.getDay()]; // 요일 가져오기

    return `${year}. ${month}. ${day} ${dayOfWeek}`;
}

//예약 명단
let reserveDeta = JSON.parse(localStorage.getItem('reserveDeta'))|| {101:[],102:[],103:[],104:[]};
console.log(reserveDeta);

function reserv01(){
    
         // 캘린더 요소 선택
        var calendarleftEl = document.getElementById('calender_left');

        if (!startDate || !endDate) {
            startDate = new Date(); // 오늘 날짜
            endDate = new Date();
            endDate.setDate(endDate.getDate() + 1); // 내일 날짜
        }
        
        function todayTWR(){
            
            startDate01 = startDate.toLocaleDateString("ko-KR");
            endDate01 = endDate.toLocaleDateString("ko-KR");
    
            formattedStartStr = formatDate(startDate);
            formattedEndStr = formatDate(endDate);
    
            checkedtextEl.innerHTML = `${formattedStartStr} - ${formattedEndStr}`;
        }
        todayTWR();
        
        var calendarleftEl = new FullCalendar.Calendar(calendarleftEl, {
            
            
            selectable: true,
            selectMirror: true,
            
            height: 'auto',
            initialView: 'dayGridMonth',
            locale: 'en',
            headerToolbar: {
                left: 'today',
                center: 'title',
                right: 'next',
            },
            initialDate: today, // 현재 날짜 기준 (이번 달)

            //드래그 옵션
            select: function(info) {
                startDate = new Date(info.startStr); //첫번째 선택 날짜
                endDate = new Date(info.endStr); //마지막 선택 날짜
                endDate.setDate(endDate.getDate() - 1); // 하루 빼기

                todayTWR();
                console.log(startDate01);
                calenderEl01.classList.remove('active');
            },
            views: {
                dayGridMonth: {
                    titleFormat: function(date) {
                        let year = date.date.year;
                        let month = String(date.date.month + 1).padStart(2, '0'); // 1월이 0으로 시작하므로 +1
                        return `${year}.${month}`; // "2025.02" 형식으로 변환
                    }
                }
            },
            datesSet: function(arg) {
                const Elyesterday = document.querySelectorAll(`#calender_left .fc-daygrid-day`)

                Elyesterday.forEach((ele)=>{
                    //Elyesterday의 data- 값 불러오기
                    let dateStr = ele.dataset.date;
                    if (dateStr) { 
                        let eleDate = new Date(dateStr);

                        if (eleDate < today) {
                            let numberCell = ele.querySelector('.fc-daygrid-day-number'); // 날짜 숫자 부분 선택
                            if (numberCell) {
                                numberCell.style.color = '#aaa'; // 글자 색 회색으로 변경
                            }
                        }
                    }
                });

                let disabledDate = reserveDeta[roomData];

                Elyesterday.forEach(function(cell) {
                    let dateStr = new Date(cell.dataset.date);
                    let Alldays = dateStr.toLocaleDateString("ko-KR");

                    console.log(Alldays);
                    console.log(reserveDeta[roomData][0]);
                    
                    console.log(disabledDate);
                    disabledDate.forEach(function(ele, i){
                        if (Alldays === ele.입실날짜){
                            let checkInDate = new Date(Date.parse(ele.입실날짜));
                                checkInDate.setHours(12, 0, 0, 0); // 정오(12:00)로 설정하여 표준시간 오류 방지

                            let checkOutDate = new Date(ele.퇴실날짜);  // 퇴실날짜
                                checkOutDate.setHours(12, 0, 0, 0); // 정오(12:00)로 설정하여 표준시간 오류 방지

                            // 퇴실날짜 하루 전으로 설정
                            checkOutDate.setDate(checkOutDate.getDate() - 1);
                        
                            // 날짜 범위 색칠
                            let currentDate = new Date(checkInDate);
                            
                            //while : 조건이 거짓이 될 때 까지 반복 | if : 조건이 참일 때 한번 실행
                            while (currentDate <= checkOutDate) {
                                let dateStr = currentDate.toISOString().split('T')[0];  // 'yyyy-mm-dd' 형식
                                let dayElement = document.querySelector(`#calender_left .fc-day[data-date="${dateStr}"]`);
                                
                                if (dayElement) {
                                    dayElement.style.backgroundColor = '#ccc';  // 회색 배경색 설정
                                }
                                
                                // 날짜 1일 추가
                                currentDate.setDate(currentDate.getDate() + 1);
                            }
                        }
                    });
                });
            },

            selectAllow: function(selectInfo) {
                today.setHours(0, 0, 0, 0);  // 시간을 자정으로 설정 (오늘 날짜만 비교)

                //오늘 이전 날짜는 선택 불가
                if (selectInfo.start < today) {
                    return false;
                }

                //배경색이 회색이면 선택 불가
                let dayEl = document.querySelector(`#calender_left .fc-day[data-date="${selectInfo.startStr}"]`); // td 요소 선택
                if (dayEl) {
                    let bgColor = window.getComputedStyle(dayEl).backgroundColor; // td의 실제 배경색 가져오기
                    if (bgColor === 'rgb(204, 204, 204)') { // 배경색이 회색이면 선택 불가
                        return false;
                    }
                }
                // 위 두 조건을 모두 만족할 경우 선택 가능 - return은 selectAllow 함수에서 날짜를 선택 할지 반환하여 적용됨
                return true;

                // let disabledDate = reserveDeta[roomData];
                // let date = selectInfo.start;

                // let a = disabledDate.filter((item)=>{
                //     let y = date.getFullYear(),
                //         m = date.getMonth()+1,
                //         d = date.getDate();

                //     if(d < 10){ d = '0'+d; }
                //     if(m < 10){ m = '0'+m; }

                //     return item.입실날짜 == `${y}-${m}-${d}`;
                // })

                // if(a.length){return false;}
                // else{ return true;}
            }
        });

        const Elgif = document.querySelector('.calender > .img')
            setTimeout(()=>{
                Elgif.style.display = 'none';
            },6500);

        // reserv01.html
        // 예약하기 바 룸 선택
        const roombtnEl = document.querySelectorAll('.room_name p, .room_select');
        const roomEl = document.querySelector('.room_list');
        const checkinoutEl = document.querySelector('.left .checkinout');
        const calenderEl01 = document.querySelector('.reserve_popupbar .calender');
        const adultEl = document.querySelectorAll('.left .adult, .left .children');
        const userEl = document.querySelector('.reserve_popupbar .user');
        const closeEl = document.querySelector(".calender_top > .close");
        const closeEl2 = document.querySelector(".user_top > .close");
        
        document.addEventListener('click', function(e){
            if (!roombtnEl[0].contains(e.target) && !roomEl.contains(e.target)) {
                roomEl.classList.remove('active')
            }
            if (!userEl.contains(e.target)){
                userEl.classList.remove('active')
            }
            if (!calenderEl01.contains(e.target)) {
                calenderEl01.classList.remove('active')
            }
        },true);

        roombtnEl.forEach(function(ele){
            ele.addEventListener('click', function(e){
                roomEl.classList.toggle('active');
                userEl.classList.remove('active');
                calenderEl01.classList.remove('active');
            });
        });
        
        checkinoutEl.onclick = function(){
            calenderEl01.classList.toggle('active');
            setTimeout(function(){
                calendarleftEl.render();
            },50)
        };

        closeEl.onclick = function(){
            calenderEl01.classList.remove('active');
        };

        closeEl2.onclick = function(){
            userEl.classList.remove('active');
        };

        adultEl.forEach(function(ele){
            ele.onclick = function(){
                userEl.classList.toggle('active');
            };
        });

        //룸 선택 내용 변경
        const roomNameEl = document.querySelector('.room_name> p');
        const roomListEl = document.querySelectorAll('.room_list p');

        const roomNum = Object.keys(reserveDeta);
        
        roomListEl.forEach(function(ele, i){
            ele.onclick = function(){
                roomNameEl.innerHTML = ele.innerHTML;
                //방의 데이터 갖기
                roomData = roomNum[i];
                calendarleftEl.render();
            }
        });

        //인원 수 변경
        const adultbtnEl = document.querySelectorAll(".button_num > .adult_btn");
        const childrenbtnEl = document.querySelectorAll(".button_num > .children_btn");
        const adultEl1 = document.querySelector(".user_adult .button_num > p");
        const childrenEl1 = document.querySelector(".user_children .button_num > p");
        
        adultbtnEl.forEach(function(ele,i){
            ele.onclick=function(){
                if(num<10 && i==1){
                    adultEl1.innerHTML=++num;
                }else if(num>0 && i==0){
                    adultEl1.innerHTML=--num;
                }
            }
        });

        childrenbtnEl.forEach(function(ele2,i2){
            ele2.onclick=function(){
                if(num2<10 && i2===1){
                    childrenEl1.innerHTML=++num2;
                }else if(num2>0 && i2===0){
                    childrenEl1.innerHTML=--num2;
                }
            }
        });

        const userbtnEl = document.querySelector('.user_btn');
        const adulttext = document.querySelector('.adult > p');
        const childrentext = document.querySelector('.children > p');
        const popupUser = document.querySelector('.user');
        const reserv01 = document.querySelector('.right a')
        
        userbtnEl.onclick=function(e){
            e.preventDefault(); //새로고침 방지
            adulttext.innerHTML = num;
            childrentext.innerHTML = num2;
            if(popupUser.classList.contains('active')){
                popupUser.classList.remove('active')
            }
        }
        




        document.addEventListener("DOMContentLoaded", () => {
            const resLeft = document.querySelector('.reserve_popupbar .left');
            const resRight = document.querySelector('.reserve_popupbar .right');
            // if (!resLeft || !resRight) return;
            const originalDisplay = getComputedStyle(resLeft).display; // 원래 display 값 저장
            let clicked = false; //클릭 상태 저장

            let pathname = window.location.pathname;
            window.addEventListener("scroll", () => {
                if(pathname.includes('resev01.html')){
                    if (window.scrollY !== 0) {
                        resLeft.style.display = "none";
                        clicked=false; // 스크롤 시 클릭 횟수 초기화
                    } else {
                        clicked=true;
                        resLeft.style.display = originalDisplay; // 원래 상태로 복원
                    }
                    if(mql2.matches){
                        resLeft.style.display = originalDisplay;
                    }
                }
            });

            
            resRight.onclick=(e)=>{
                if(!clicked && !resLeft.style.display == 'flex'){
                    resLeft.style.display = originalDisplay;
                
                    e.preventDefault(); // 첫 클릭에서는 링크 이동 막기
                }else{
                    if(!num == 0){
                        window.location.href="./reserv02.html" // 두 번째 클릭: 페이지 이동
                        //1회성 localStorage
                        roomData2 = {호실 : roomData, 입실날짜 : startDate01, 퇴실날짜 : endDate01, 성인 :num, 어린이 : num2}
                        console.log(roomData2);
                        localStorage.setItem('roomData2', JSON.stringify(roomData2));
                    }else{
                        e.preventDefault();
                        alert('인원 수를 선택해주세요 !');
                    }
                }
                if(mql2.matches){
                    resRight.onclick=()=>{
                        resLeft.style.display = originalDisplay;
                        resLeft.style.display == 'block'
                    }
                }
            }
        });

        // reserv01.onclick=function(e){
        // }
};
reserv01();