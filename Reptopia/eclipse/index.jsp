<%@ page language="java" contentType="text/html; charset=EUC-KR"
    pageEncoding="EUC-KR"%>
<html lang="ko">
<head>
   <meta charset="UTF-8">
   <title>Reptopia2021</title>
   <script src="background2.js" defer></script>
   <script src="main2.js" defer></script>
   <script src="slider2.js"></script>
   <script src="cage2.js"></script>  
   <script src="eyes.js"></script>
   <script src="object2.js"></script>
   <link rel="stylesheet" type="text/css" href="reptopia.css" />
</head>
<body>
	<form action="./userJoinAction.jsp" method="post">
		<input type="text" name="userID">
		<input type="password" name="userPassword">
		<input type="submit" value= "Sign Up">
	</form>
   <canvas id="background"></canvas>
   <div id="slides">
      <div id="overflow">
         <div class="inner">
            <input class="slide slide_3" type="button" value="Work" onclick="check(3)">
            <input class="slide slide_1" type="button" value="Creature" onclick="check(1)">
            <input class="slide slide_2" type="button" value="Store" onclick="check(2)">
         </div>
      </div>
   </div>
   <div id="cages">
      <canvas class="cage"></canvas>
      <canvas class="cage"></canvas>
      <canvas class="cage"></canvas>
      <canvas class="cage"></canvas>
      <canvas class="cage"></canvas>
      <canvas class="cage"></canvas>
   </div>
   <img id="arrow" style="opacity: 0;" src="imgs/arrow.png" onclick="showSlides()"></img>
</body>
</html>