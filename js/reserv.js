
let mql = window.matchMedia("(min-width:300px) and (max-width: 1024px)");
let mql2 = window.matchMedia("(max-width: 767px)");
// ㄴmatchMedia 반응형부분 들어갈 때 수정하는거, ture false 인지 확인해주는 역할
let breakPoint = true;
mql.addListener((e)=>{
    breakPoint = e.matches;
})
const elNull03 = document.querySelectorAll('.null')

//상단 배너 애니메이션
const textElement = document.querySelectorAll(".banner_text h2 span");
textElement.forEach((char, i) => {
    let random = Math.random()*0.15;
    char.style.animationDelay = i * random +'s';
});

function reserv01(){
         // 캘린더 요소 선택
        var calendarEl = document.getElementById('calendar01');
        var calendarEl = new FullCalendar.Calendar(calendarEl, {
            // 옵션 설정
            height: 'auto', 
            initialView: 'dayGridMonth', // 초기 뷰 설정
            headerToolbar: {
                left: 'prev',
                center: 'title',
                right: 'next',
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
            dayCellDidMount: function(info) {
                const currentMonth = info.view.currentStart.getMonth();// 현재 보이는 달의 월 가져오기
                if (info.date.getMonth() === currentMonth) {
                  // .fc-daygrid-day-frame 요소 찾기
                const dayFrame = info.el.querySelector(".fc-daygrid-day-frame");
                  if (dayFrame) { // 해당 요소가 있을 경우 실행
                    const container = document.createElement("div");
                    container.classList.add("fixed-text-container"); // 스타일을 위한 부모 div
                    // 추가할 텍스트 배열
                    const texts = [
                    "101호 / ₩129,000",
                    "102호 / ₩129,000",
                    "103호 / ₩149,000",
                    "104호 / ₩199,000"
                    ];
                    // 해야할것 => 방호수가 날짜에 일치 한다면 텍스트 보더 넣기
                    // 각 텍스트를 div로 만들어 추가
                    texts.forEach(text => {
                        const textEl = document.createElement("div");
                        textEl.classList.add("fixed-text");
                        textEl.textContent = text;
                        container.appendChild(textEl);
                        if(mql.matches){
                            textEl.style.display = 'none';
                            }
                    });
                    // .fc-daygrid-day-frame 안에 추가
                    dayFrame.appendChild(container);
                }
                }
            },
        });
        calendarEl.render();
};

function reserv02(){
    let page2Data = JSON.parse(localStorage.getItem('roomData2'));
    console.log(page2Data);

    let Pdate = page2Data.입실날짜;
    let Pdate01 = page2Data.퇴실날짜;
    
    //2025.02.22.의 형태를 표준 날짜로 변경
    let Pdatesub0 = new Date(Pdate);
    let Pdatesub1 = new Date(Pdate01);

    let formattedStartStr = formatDate(Pdatesub0);
    let formattedEndStr = formatDate(Pdatesub1);
    
    let day = Pdatesub1-Pdatesub0;
    
    let totalprice = roomPrice[page2Data.호실]*(day/oneDay);
    
    
    //전체 동의
    const agree01El = document.querySelector('#agree1');
    const agree02El = document.querySelector('#agree2');
    const agree03El = document.querySelector('#agree3');

    agree01El.addEventListener('change', function() {
        // 전체 동의 체크박스가 체크되면 아래 두 체크박스를 체크
        if (agree01El.checked) {
            agree02El.checked = true;
            agree03El.checked = true;
        }else{
            // 전체 동의 체크박스가 체크 해제되면 아래 두 체크박스도 체크 해제
            agree02El.checked = false;
            agree03El.checked = false;
        }
    });

    [agree02El, agree03El].forEach((checkbox) => {
        checkbox.addEventListener("change", function () {
            // 두 개의 개별 체크박스가 모두 체크되면 전체 동의 체크박스 체크
            if (agree02El.checked && agree03El.checked) {
                agree01El.checked = true;
            } else {
                agree01El.checked = false;
            }
        });
    });

    const roomNum02 = document.querySelector('.cash > .room > h3');
    const roomData02 = document.querySelectorAll('.room p');
    const total = document.querySelector('.total > p');

    roomNum02.innerHTML = 'Room '+ page2Data.호실 
    roomData02[0].innerHTML = `${formattedStartStr} - ${formattedEndStr}`
    roomData02[1].innerHTML = page2Data.성인
    roomData02[2].innerHTML = page2Data.어린이
    total.innerHTML = `₩${totalprice.toLocaleString("ko-KR")}`;
    
    const inputText = document.querySelectorAll('.input_icon');
    const paybtnEl = document.querySelector('.right_stick > a');

    inputText[1].addEventListener("input", function(event) {
        this.value = this.value.replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거
    });

    //결제하기 클릭하면 로컬스토리지에 저장꾸
    
    paybtnEl.onclick = function (e) {
        let roomDataAll = JSON.parse(localStorage.getItem("roomData2")) || {};
        // 사용자에 따라 공백이 있을 수 있으므로 .trim()메서드를 사용해서 공백 지움
        roomDataAll.이름 = inputText[0].value.replace(/\s+/g, "");
        roomDataAll.전화번호 = inputText[1].value.replace(/[^0-9]/g, "");
        roomDataAll.이메일 = inputText[2].value.replace(/\s+/g, "");
    
        // 입력값 확인
        if (!roomDataAll.이름) {
            e.preventDefault();
            elNull03.forEach((item)=>{
                item.style.display = 'block'
            })
            return; // 함수 종료
        }

        // 개인정보 동의 확인
        if (!agree01El.checked) {
            e.preventDefault();
            alert("개인정보 수집에 동의해야 예약이 가능합니다.");
            return; // 함수 종료
        }

        let duplicate = false;
        for (let key in reserveDeta) {
            let existingReservations = reserveDeta[key];
            // 중복 예약 체크: 호실, 입실 날짜, 퇴실 날짜가 같으면 중복
            duplicate = existingReservations.some((item) => {
                return item.호실 === roomDataAll.호실 && 
                item.입실날짜 === roomDataAll.입실날짜
            });
            if (duplicate) break; // 중복이 있다면 바로 종료
        }
    
        // 중복 예약이 있으면
        if (duplicate) {
            e.preventDefault();
            alert("이미 예약된 일정입니다. 다른 날짜나 호실을 선택해주세요.");
            return; // 함수 종료
        }
    
        reserveDeta[roomDataAll.호실].push(roomDataAll);
        console.log(reserveDeta);
        localStorage.setItem("reserveDeta", JSON.stringify(reserveDeta));
    
        alert("예약이 완료되었습니다 !");
    };
    
    //무통장 입금 클릭 시
    const cashEl = document.querySelectorAll('#cash,#card');
    const textEl = document.querySelector('.payment_methods02');
    const rightEl = document.querySelector('.right_stick');

    cashEl.forEach(function(ele, e){
        ele.addEventListener('change', function() {
            if (cashEl[1].checked) {
                textEl.classList.add("active");
            }else{
                textEl.classList.remove("active");
            }

            //무통장입금 클래스가 있을때, position : sticky; top값 수정하기
            if(textEl.classList.contains("active")){
                rightEl.style.top = "25px";
            }
        });
    })
}

function reserv03(){
    //resrev03.html
    JSON.parse(localStorage.getItem('reserveDeta'));

    //조회하기 팝업창
    const inputboxEl = document.querySelector('.reserv03_inputbox a')
    const checkEl = document.querySelector('.reserv03_check');
    const closeBtn = document.querySelector('.reserv03_check_top > .close');
    const reserv03BtnEL = document.querySelectorAll('.reserv03_btn > a');
    const Elroom03 = document.querySelector('.room_check')
    const inputText03 = document.querySelectorAll('.input_icon');
    
    inputText03[1].addEventListener("input", function(event) {
        this.value = this.value.replace(/[^0-9]/g, ""); // 숫자 이외의 문자 제거
    });

    let name = null;
    let phone = null;


    


    inputboxEl.onclick = function(e){
        e.preventDefault(); //새로고침 방지
        name = inputText03[0].value 
        phone = inputText03[1].value
        console.log(name);
        
        if(!name == false && !phone == false){
            let user=[];
            // 객체를 반복문으로 돌릴때 for~in 쓴다요
            for (let key in reserveDeta) {
                reserveDeta[key].forEach((item) => {
                    // 이름과 전화번호가 일치하는 항목을 user 배열에 추가
                    if (item.이름 == name && item.전화번호 == phone) {
                        user.push(item);
                    }
                });
            }
            // for(let key in reserveDeta){
            //     user = reserveDeta[key].Filter((item)=>{
            //                 return item.이름 == name && item.전화번호 == phone
            //             })
            //     if(user.length) break;
            // }
            if (user.length) {
                checkEl.classList.add('active');
                Elroom03.innerHTML = "";

                user.forEach((item, i) => {
                    // let formattedEndStr = null;
                    let a = new Date(item.입실날짜)
                    let b = new Date(item.퇴실날짜)
                    formattedStartStr = formatDate(a)
                    formattedEndStr = formatDate(b)

                    let checkboxId = `checkbox${i + 1}`; // 고유한 id 생성

                    // label 태그 생성
                    let label = document.createElement('label');
                    label.classList.add('checkbox03');
                    label.setAttribute('for', checkboxId); // for 속성 설정

                    label.innerHTML = `
                        <div class="room_name03">
                            <input id="${checkboxId}" type="checkbox">
                            <h2>Room ${item.호실}</h2>
                        </div>
                        <div class="room_num">
                            <ul>
                                <li>
                                    <p>숙박 기간</p>
                                    <p>${formattedStartStr} - ${formattedEndStr}</p>
                                </li>
                                <li>
                                    <p>예약자명</p>
                                    <p>${item.이름}</p>
                                </li>
                                <li>
                                    <p>전화 번호</p>
                                    <p>${item.전화번호}</p>
                                </li>
                                <li>
                                    <p>인원 수</p>
                                    <p>성인 ${item.성인}명, 어린이 ${item.어린이}명</p>
                                </li>
                                <li>
                                    <p>이메일</p>
                                    <p>${item.이메일}</p>
                                </li>
                            </ul>
                        </div>
                    `;

                    Elroom03.appendChild(label);
                    
                    reserv03BtnEL[0].onclick = (e) => {
                        e.preventDefault(); // 새로고침 방지
                        // 예약 정보가 2개 이상일 경우
                        if (user.length > 1) {
                            const inputchecked01 = document.querySelectorAll('.room_name03 input[type="checkbox"]:checked')
                            if (inputchecked01.length > 0 ){
                                let result = confirm("선택한 예약을 취소하시겠습니까?");
                    
                                if (result) {
                                    inputchecked01.forEach((checkbox) => {
                                        let label = checkbox.closest(".checkbox03");
                                        let roomNum = label.querySelector("h2").innerText.replace("Room ", ""); // 방 번호 가져오기
                    
                                        // reserveDeta에서 해당 예약 삭제
                                        
                                        for (let key in reserveDeta) {
                                            reserveDeta[key] = reserveDeta[key].filter((item) => 
                                                item.호실 !== roomNum ||
                                                item.입실날짜 !== checkInDate || 
                                                item.퇴실날짜 !== checkOutDate) ;
                                        }
                    
                                        // UI에서 제거
                                        label.remove();
                                    });
                    
                                    localStorage.setItem("reserveDeta", JSON.stringify(reserveDeta));
                                    alert("선택한 예약이 취소되었습니다!");
                                }
                            } else {
                                alert("삭제할 예약을 선택하세요.");
                            }
                        } 
                        // 예약이 1개일 경우 (체크 여부 상관없이 삭제)
                        else {
                            let result = confirm("예약을 취소하시겠습니까?");
                            if (result) {
                                for (let key in reserveDeta) {
                                    reserveDeta[key] = reserveDeta[key].filter((item) => item.이름 !== name);
                                }
                                alert("예약이 취소되었습니다!");
                                checkEl.classList.remove("active");
                                localStorage.setItem("reserveDeta", JSON.stringify(reserveDeta));
                                console.log(JSON.parse(localStorage.getItem("reserveDeta")));
                            }
                        }
                    };

                    // reserv03BtnEL[0].onclick = (e)=>{
                    //     e.preventDefault(); //새로고침 방지
                    //     // let result = confirm('정말로 취소 하시겠습니까?'); 
                    //     // console.log(result);
            
                    //     // if(result == true){
                    //     //     for(let key in reserveDeta){
                    //     //     let newKey = reserveDeta[key].filter((item)=>{
                    //     //                 //배열이 돌면서 적은 이름 값이 같은지 확인 하면서 같지 않을 때의 값을 가진다
                    //     //             return item.이름 != name
                    //     //         })
                    //     //         reserveDeta[key] = newKey;
                    //     //     }
                    //     //     checkEl.classList.remove('active');
            
                    //     //     localStorage.setItem("reserveDeta", JSON.stringify(reserveDeta))
                    //     //     console.log(JSON.parse(localStorage.getItem("reserveDeta")));
                    //     //     alert('예약이 취소되었습니다 !');
                    //     // }
                    // }
                    reserv03BtnEL[1].onclick = (e)=>{
                        e.preventDefault(); //새로고침 방지
                        checkEl.classList.remove('active');
                    }
                })
            }else{
                alert("해당 이름과 전화번호로 예약된 내역이 없습니다.");
            }
        }else{
            elNull03.forEach((item)=>{
                item.style.display = 'block'
            })
        }
    };

    closeBtn.onclick = function(e){
        e.preventDefault(); //새로고침 방지
        checkEl.classList.remove('active');
    };

    document.addEventListener('click', function(e){
        if (!checkEl.contains(e.target)) {
            checkEl.classList.remove('active')
        }
    },true);

    
}


let pathname = window.location.pathname;
//includes() : 괄호 안의 값이 존재 하는지 true | false 로 알려주는 매소드
if(pathname.includes('reserv01')){
    reserv01();
}else if(pathname.includes('reserv02')){
    reserv02();
}else if(pathname.includes('reserv03')){
    reserv03();
}







