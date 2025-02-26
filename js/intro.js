const textElement = document.querySelectorAll(".banner_text span");

textElement.forEach((char, i) => {
    let random = Math.random()*0.15;
    char.style.animationDelay = i * random +'s';
}); 

const elTab_btn =document.querySelectorAll('.tab-head button');
const elTab_contents =document.querySelectorAll('.tab-body div');



elTab_btn.forEach(function(btn,indexkey){
    btn.onclick=function(ele,k){

    elTab_btn.forEach(function(ele,k){
        elTab_btn[k].classList.remove('active');
        elTab_contents[k].classList.remove('active');
        });

        this.classList.add('active');
        elTab_contents[indexkey].classList.add('active');
        
        if(indexkey==1){
            kakaomap();
        }
    }
})


function kakaomap(){
    //카카오맵 api를 데려온 후 function kakaomap안으로 넣어둔후 if문으로
    //indexkey 1(tap 상세보기)일때 로딩 24 25
    

    //map
    var mapContainer = document.getElementById('map'), // 지도를 표시할 div 
    mapOption = {
        center: new kakao.maps.LatLng(33.450701, 126.570667), // 지도의 중심좌표
        level: 3 // 지도의 확대 레벨
    };  
    
    // 지도를 생성합니다    
    var map = new kakao.maps.Map(mapContainer, mapOption); 
    
    // 주소-좌표 변환 객체를 생성합니다
    var geocoder = new kakao.maps.services.Geocoder();
    
    // 주소로 좌표를 검색합니다
    geocoder.addressSearch('경기도 가평군 조종면 운악리 425-16', function(result, status) {
    
    // 정상적으로 검색이 완료됐으면 
    if (status === kakao.maps.services.Status.OK) {
    
        var coords = new kakao.maps.LatLng(result[0].y, result[0].x);
    
        // 결과값으로 받은 위치를 마커로 표시합니다
        var marker = new kakao.maps.Marker({
            map: map,
            position: coords
        });
    
        // 인포윈도우로 장소에 대한 설명을 표시합니다
        var infowindow = new kakao.maps.InfoWindow({
            content: '<div style="width:150px;text-align:center;padding:6px 0;color:#566418; font-family:Hakgyoansim Dunggeunmiso TTF">산그린 펜션</div>'
        });
        infowindow.open(map, marker);
    
        // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
        map.setCenter(coords);
    } 
    });    
}

