[0] 컨셉
1. 사이트 제목: REPTOPIA
 - 파충류들의 유토피아라는 뜻.
 - 동물에게 행복한 사육이 되어야 한다는 철학 내포.

2. 아이디어
 - 신비한 분위기의 웹 파충류 사육 시뮬레이터.
 - 리얼리티를 최대한 살려서 실제 교육이 되도록 함.
 - 키움의 힘듦을 체감시킴. (함부로 키우지 못하도록)
 - 키움의 목적을 인지시킴. (돈, 개체 수가 목적이 되지 않도록)
 ; 키움의 목적은 순수하게 동물 자체를 좋아하기 때문만이어야 한다. 

3. 포인트 기능
 - 외부(그래픽)
  생명체들의 움직임 구현(ac engine), 신비한 분위기의 웹 디자인(배경, 인덱스 배치)
 - Animate Creature 엔진
  자연의 생명체와 환경의 특성(변수)을 최대한 구현(javascript 프로토타입의 property)하여 리얼리티 향상
  생명체가 움직이는 의도를 다수 고려하여(의도마다 함수 작성 ex. hunt, chunk, wander, climb, sleep, excrete, etc) 자연스러운 움직임 구현.
  - 기본 난이도는 상당히 높게 적용한다.
  - 파충류의 신비함을 느낄 수 있도록 디자인과 그래픽에 신경쓴다.
  - 여러 개체를 키울수록 난이도가 급격히 상승한다.
[1] 기능
1. 돈
 - 입양, 구매, 판매

2. 사육
 - 사육 환경변수 : 사육장 크기, 온도, 습도, 바닥재(촉감, 버로우, 습도), 구조물(은신, 자세 다양성, 활동 공간), 먹이(영양분), 합사(먹이 포함).

2.5 정 쌓기
 - 이름 짓기
 - 친밀도에 따른 반응 설정
 - 점차 알아가는 개체의 특성(식성, 잠 습관, 행동 습관, ...)

3. 생명체
 - 사망 가능성(스트레스, 질병), 질병 가능성(온습도, 위생, 질병 저항성), 나이, 크기, 성, 종(형태), 색, 선호 먹이, 선호 온습도/구조물, 번식 습성, 주/야행성, 선호 바닥재, 합사 여부 등의 특성 적용.

4. 그래픽
 - 생명체, 구조물, 알, 사육장, 바닥재, 등 이미지 파일 확보.
 - 사이트 배경을 고화소 서식지 사진으로.
 - 배경 로드 0.3초 후 fade in blur
 - 이미지들 분위기(필터) 통일
 - AC engine 구현(1)

[2] 필요 자료
1. 이미지
 - 생명체 모든 종의(먹이 포함) 이미지
 - 구조물, 바닥재, 알, 사육장 이미지
 - 영감 사이트 : https://www.lu42.co.kr/campaign/flowergarden.php 
 - 위 사이트와 같이 배경이 될 고화소 이미지

2. 생명체
 - 먹이의 영양 만족도
  cricket http://www.craftcrickets.com/cricket-nutrition-facts.html

영양/미네랄 비교
Cricket
Mealworm
Superworm
Waxworm
Weight (mg/insect)
349
78
558
235
Moisture (g/kg)
725
689
630
641
Crude Protein (g/kg)
165
186
186
144
Crude Fat (g/kg)
79
82
14.4
19.4
NFE (g/kg)
1
9
7
-2
Total Dietary Fiber (g/kg)
10.9
12.9
14.4
<7.5
Acid Detergent Fiber (g/kg)
17.8
22.3
23.4
15.2
Ash (g/kg)
12.2
11.3
9.3
8.0
Metabolizable Energy (kcal/kg)
1375
1520
2069
2322
Metabolizable Energy (kcal/insect)
480
119
1154
546
Calcium (mg/kg)
366
156
262
203
Phosphorus (mg/kg)
2,190
2,640
2,090
1,930
Magnesium (mg/kg)
193
620
435
266
Sodium (mg/kg)
1,110
225
385
<123
Potassium (mg/kg)
2,850
3,350
2,860
2,310
Chloride (mg/kg)
2,210
1,760
1,630
760
Iron (mg/kg)
17.5
20.7
19.9
9.6
Zinc (mg/kg)
54.3
49.5
30.2
25.9
Copper (mg/kg)
6.3
8.3
3.6
3.3
Manganese (mg/kg)
8.7
3.2
3.7
2.7
Iodine (mg/kg)
0.145
<0.10
<0.10
<0.10
Selenium (mg/kg)
0.133
0.123
0.103
0.177



: 주요 양분
 - 케어 시트(생명체 프로토타입의 특성 모두 내포했는지 체크 할 것)
 https://www.reptilecentre.com/info-care-sheets
(Leopard, Crested, Snake, Monitor, Frog, Turtle)
 https://monitorlizards.org/care-sheet/
(Monitor)
 프로토타입 : Leopard gecko만.
3. 구조물
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
1*AC engine 중점 변경.
 기존 하드 코딩 방식을 버린다. (자연스러운 동작을 다양하게 구현하기 힘듦.)
 환경변수들과 실제 작용하는 힘을 엔진에 포함한다. 

 중점 변수 목록

  - 중력 (질량과 중력가속도)
  - 회전력
  - 공기저항
  - 마찰력 : 성질 마다 다르게 설정
  - +a 부력 (수중 생물 또는 날아다니는 생명체 구현)

* 게코 골격, 옆 모습 참고 사진






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

https://m.blog.naver.com/dalsapcho/20144939371
결과





*웹 디자인 아이디어


*웹 배경 사진 자료

- Jungle
![jg1](/img/green-trees.jpg)
![jg2](/img/Jungle.jpg)
![jg3](/img/Jungle-Book.jpg)
![jg4](/img/Waterfall.jpg)


- Rocky desert
![rd1](/img/rock desert.jpg)
![rd2](/img/rocky desert.jpg)


- Swamp
![sw1](/img/swamp.jpg)
![sw2](/img/swamp2.jpg)
![sw3](/img/swamp_alligator.jpg)


- Underwater
![uw1](/img/underwatjung.jpg)
![uw2](/img/underwater.jpg)
![uw3](/img/underwaterfish.jpg)




