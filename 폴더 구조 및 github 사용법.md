
# 폴더 구조

# GIT BASH로 GIT HUB 관리하기 ( 일괄 삭제 및 업로드 )

1. GIT BASH에 자신의 이름, 이메일 알리기.
git config --global user.name "your_name"
git config --global user.email "your_email@example.com"
 
2. git config --list (이름과 이메일 등 설정한 내용을 확인하기)

3. cd Desktop/CGT (로컬저장소로 설정할 프로젝트 위치로 이동한다.)

4. git init (현재 폴더에 깃 생성)

git status (현재 상태 보기)


데이터가 저장되는 곳.

폴더  ---	BASH ---	github
로컬		원격

### 로컬 -> 원격
로컬 저장소( 컴퓨터의 폴더 )의 변경사항을 원격 저장소( GIT HUB )에 적용하려면 변경사항을 BASH에 먼저 알려야 한다.

$git remote add origin https://github.com/weaknessHero/projectBlue/
 원격 저장소 추가( origin )

$ git add * (추가할 파일)(*은 모든 파일을 뜻한다)

$git commit
 변경사항을 확인하고 BASH에 적용
vi에디터에서 맨위 글자를 써야 추가가 된다 . (추가 방법 에디터에서 i를 눌러 추가후 Esc를 누르고 :wq)

$git push -u origin +master
 origin( 원격 저장소 )의 master branch에 변경사항 적용.



### 원격 -> 로컬
$git pull

오류
이미 한번 git add *을 통해서 올린것으로 기록된 자료라 다시 올리는게 안될 경우 rm -rf .git (init을 취소하고 다시 4번부터 실행)


Git 에러 CRLF will be replaced by LF 시
git config --global core.autocrlf true  (참고:https://blog.jaeyoon.io/2018/01/git-crlf.html)
