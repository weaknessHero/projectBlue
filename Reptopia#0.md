## 피드백 20.12.12
### 게임 관련
 Q)
 
 초기 요소 게임 진행시 어떤 구조로 시작되는지 명시가 안되어 있음
 도마뱀이 1마리 있는 상태로 시작하고 초기 자본은 xx원이고 돈은 얼마가 어떻게 사용 되는지에 대해서 
 플레이어는 돈을 쓰는지 안쓰는지에 관해서 명시가 되어있어야함
 
 A)
 
 게임 구조: 초기 자본은 있을 수도 있고 없을 수도 있으며, 일을 해서 돈을. 버는 시스템. 그 돈으로 개체를 입양하거나 구조물을 구입하는 식임.
 
 자본: 이 시뮬레이터는 난이도 밸런스가 상당히 중요함. 돈이 난이도와 직결되어있는데, 그 자본을 지금 설정하는 것은 의미가 없다고 생각했음. 개발하면서 구조물, 생명체들의 가격, 사육 난이도가 어느 정도 정해지면 설정해야한다고 생각함.
 
 생활비?

# 컨셉
## 사이트 제목: REPTOPIA
 - 파충류들의 유토피아라는 뜻.
 - 동물에게 행복한 사육이 되어야 한다는 철학 내포.

## 아이디어
 - 이미지나 그래픽 효과를 통한 신비한 분위기의 웹 파충류 사육 시뮬레이터. ( 실제 내가 파충류를 기르면서 느낀 신비함을 유저에게 전달하고자 했다. 유저의 흥미를 발생시킨다. )
 - 리얼리티를 최대한 살려서 실제 교육이 되도록 함.
 - 키움의 힘듦을 체감시킴. (함부로 키우지 못하도록)
 - 일을 해서 돈을 얻는 시스템. 힘들게 번 돈으로 개체를 입양하거나 구조물을 구입.
 - 키움의 목적을 인지시킴. (돈, 개체 수가 목적이 되지 않도록)
 ; 키움의 목적은 순수하게 동물 자체를 좋아하기 때문만이어야 한다. 

## 포인트 기능
 - 외부(그래픽)
  생명체들의 움직임 구현(ac engine), 신비한 분위기의 웹 디자인(배경, 인덱스 배치)
 - Animate Creature 엔진
  자연의 생명체와 환경의 특성(변수)을 최대한 구현(javascript 프로토타입의 property)하여 리얼리티 향상
  생명체가 움직이는 의도를 다수 고려하여(의도마다 함수 작성 ex. hunt, chunk, wander, climb, sleep, excrete, etc) 자연스러운 움직임 구현.
  - 기본 난이도는 상당히 높게 적용한다.
  - 파충류의 외모와 습성에서 신비함을 느낄 수 있도록 디자인과 그래픽에 신경쓴다.
  - 여러 개체를 키울수록 난이도가 급격히 상승한다.
# 기능
## 돈
 - 입양(개체)
 - 구매(구조물, 바닥재, 먹이 등)
 - 판매(개체, 구조물, 바닥재 등) : 개체를 판매할 수 밖에 없는 상황이 어떻게 오는지 알게해서, 그 상황이 오지 않도록 키울 수 있는지 자각하게 함.

## 사육
 - 사육 환경변수 : 사육장 크기, 온도, 습도, 바닥재(촉감, 버로우, 습도), 구조물(은신, 자세 다양성, 활동 공간), 먹이(영양분), 합사(먹이 포함).

## 정 쌓기 !challengable
 - 이름 짓기
 - 친밀도에 따른 반응 설정
 - 점차 알아가는 개체의 특성(식성, 잠 습관, 행동 습관, ...)

## 생명체
 - 사망 가능성(스트레스, 질병), 질병 가능성(온습도, 위생, 질병 저항성), 나이, 크기, 성, 종(형태), 색, 선호 먹이, 선호 온습도/구조물, 번식 습성, 주/야행성, 선호 바닥재, 합사 여부 등의 특성 적용.

## 그래픽
 - 생명체, 구조물, 알, 사육장, 바닥재, 등 이미지 파일 확보.
 - 사이트 배경을 고화소 서식지 사진으로.
 - 배경 로드 0.3초 후 fade in blur
 - 이미지들 분위기(필터) 통일
 - AC engine 구현(1)

# 필요 자료
## 이미지
 - 생명체 모든 종의(먹이 포함) 이미지
 - 구조물, 바닥재, 알, 사육장 이미지
 - 영감 사이트 : https://www.lu42.co.kr/campaign/flowergarden.php 
 - 위 사이트와 같이 배경이 될 고화소 이미지

## 생명체
 - 먹이의 영양 만족도
  cricket http://www.craftcrickets.com/cricket-nutrition-facts.html

 - 영양/미네랄 비교

|       Nutrition       |   Cricket   |    Mealworm   |  Superworm  |   Waxworm   |
|-----------------------|------------:|--------------:|------------:|------------:|
| Weight (mg/insect)                 |  349 | 78  | 558 | 235 |
| Moisture (g/kg)                    |  725 | 689 | 630 | 641 |
| Crude Protein (g/kg)               |  165 | 186 | 186 | 144 |
| Crude Fat (g/kg)                   |  79  | 82  | 14.4| 19.4|
| Metabolizable Energy (kcal/kg)     | 1375 | 1520| 2069| 2322|
| Metabolizable Energy (kcal/insect) |  480 | 119 | 1154| 546 |
| Calcium (mg/kg)                    |  366 | 156 | 262 | 203 |


 - 케어 시트(생명체 프로토타입의 특성 모두 내포했는지 체크 할 것)
 https://www.reptilecentre.com/info-care-sheets
(Leopard, Crested, Snake, Monitor, Frog, Turtle)
 https://monitorlizards.org/care-sheet/
(Monitor)

 프로토타입 : Leopard gecko만.
 
## 구조물
 - 구조물들의 영향력 수치(습도 유지, 스트레스 해소도) 설정할 것.
  나무
  흙
  바크
  톱밥
  칩
  코코넛 fiber
  소일
  이끼
  모래
  돌
  돌 은신처
  나무 은신처
  
# 1*AC engine 중점 변경.
 기존 하드 코딩 방식을 버린다. (자연스러운 동작을 다양하게 구현하기 힘듦.)
 환경변수들과 실제 작용하는 힘을 엔진에 포함한다. 

 중점 변수 목록

  - 중력 (질량과 중력가속도)
  - 회전력
  - 공기저항
  - 마찰력 : 성질 마다 다르게 설정
  - +a 부력 (수중 생물 또는 날아다니는 생명체 구현)

* 게코 골격, 옆 모습 참고 사진

![gk1](/img/tokbone.jpg)
![gk2](/img/leoside.jpg)

2d physics engine collision source code:

https://github.com/RandyGaul/ImpulseEngine/blob/master/Collision.cpp

function spin(angle, joint){

    var jx = joint[0];
    var jy = joint[1];

    var mx = jx * Math.cos(angle) - jy * Math.sin(angle);
    var my = jx * Math.sin(angle) + jy * Math.cos(angle);

    ctx.translate(-mx, -my);
    ctx.rotate(angle);
}
회전에 의한 좌표 변환


mx, my 유도식

P’의 좌표의 –만큼 이미지를 이동시킨 후 θ만큼 회전함.
![spin](/img/spin.png)
https://m.blog.naver.com/dalsapcho/20144939371

결과
![hu](/img/headUp.gif)




## 웹 디자인 아이디어
![ds1](/img/design0.jpg)
![ds2](/img/design1.jpg)
![ds3](/img/design2.jpg)


## 웹 배경 사진 자료

- Jungle
![jg1](/img/green-trees.jpg)
![jg2](/img/Jungle.jpg)
![jg3](/img/Jungle-Book.jpg)
![jg4](/img/Waterfall.jpg)


- Rocky desert
![rd1](/img/rockd.jpg)
![rd2](/img/rockyd.jpg)


- Swamp
![sw1](/img/swamp.jpg)
![sw2](/img/swamp2.jpg)
![sw3](/img/swamp_alligator.jpg)


- Underwater
![uw1](/img/underwatjung.jpg)
![uw2](/img/underwater.jpg)
![uw3](/img/underwaterfish.jpg)




