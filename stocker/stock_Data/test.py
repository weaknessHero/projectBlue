import urllib.request as urlreq
from io import BytesIO
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import requests
import json
import pandas as pd
import csv
from time import sleep

#url 요청 url 
url = 'https://opendart.fss.or.kr/api'

#요청 값
getCorpCode='/corpCode.xml'
getCorpData='/fnlttSinglAcnt.json'

CTFCTKey = "?crtfc_key=d171bfc3588a2a2cf9defbee64bc3561de0dfe8a"#인증키

corpCodeNA= "&corp_code="

BSNSYearNA = "&bsns_year=" #NA = Need argument => year

reptyCodeNA = "&reprt_code=1101"# 1:사업 보고서, 2:분기, 3:1분기, 4:3분기 보고서 번호

fd_div = "&fs_div=CFS"

seasonList=[0,4,2,1,3]

deleteStrList=[' ', '및','기타포괄손익-', '의', '(증가)','(감소)']


def main():
     #데이터 받아오기


     #코드 받기
     corpCodeData = pd.read_csv('resource/corpCodeData.csv', header=0)

     #업데이트 파일 확인
     updateCorpTxt = open('updateCorp.txt','r')
     lastUpdateCorp=updateCorpTxt.readline()
     updateCorpTxt.close()

     #업데이트 위치 찾기 
     if(len(str(lastUpdateCorp)) >1):
          findIndexList = corpCodeData['stockCode'].tolist()
          startIndex=findIndexList.index(int(lastUpdateCorp))
          corpCodeData=corpCodeData.iloc[startIndex:]


     for num, corpCode in corpCodeData.iterrows():
          #데이터프레임 열 탐색
          
          print(str(corpCode[0]))
          year = 2015
          onCorpData = 0
          baseDF = pd.DataFrame(index=range(0,0))
          columnList= []

          while year < 2020 :
               #api 차단 방지용
               sleep(1)
               #데이터 존재 확인을 위해 연간보고서를 받는다
               res= requests.get(url+getCorpData+CTFCTKey+corpCodeNA+str(corpCode[1]).zfill(8)+BSNSYearNA+ str(year) +reptyCodeNA + str(1))
               item=json.loads(res.text)


               if(item['status']=='000'):#정상 값인지 확인
                    sleep(0.5)
                    firstSeries=resSeries(item, baseDF)
                    onCorpData += 1
                    
                    for code in [3,2,4]:
                         #api 차단 방지용
                         sleep(1)
                         #분기별 보고서 받기
                         res= requests.get(url+getCorpData+CTFCTKey+corpCodeNA+str(corpCode[1]).zfill(8)+BSNSYearNA+ str(year) +reptyCodeNA + str(code))
                         item=json.loads(res.text)
                         
                         if(item['status']=='000'):
                              series=resSeries(item, baseDF)
                              onCorpData += 1

                              #분기별 보고서 추가
                              columnList.append(str(year)+str(seasonList[code]))
                              baseDF=pd.concat([baseDF,series], axis=1)

                    #연간보고서 추가
                    columnList.append(str(year)+str(seasonList[1]))
                    baseDF=pd.concat([baseDF,firstSeries], axis=1)
                    
                    #탐색위치 저장
                    updateTxt = open('updateCorp.txt','w')
                    updateTxt.write(str(corpCode[0]))
                    updateTxt.close()
                    
               elif(item['status']=='020'):
                    #사용한도 초과시
                    break
               else:
                    #탐색위치 저장
                    updateTxt = open('updateCorp.txt','w')
                    updateTxt.write(str(corpCode[0]))
                    updateTxt.close()

               year +=1
               

          if(item['status']=='020'):
               print('사용한도 초과')
               break

          #회사내용 존재시
          if(onCorpData>0):
               baseDF.columns=columnList
               baseDF.to_csv('data/'+str(corpCode[0]).zfill(6)+'.csv', mode='w', header=True, index=True, encoding='utf-8-sig')
               updateTxt = open('updateCorp.txt','w')
               updateTxt.write(str(corpCode[0]))
               updateTxt.close()

     
def resSeries(item, baseDF):
     #데이터 받아서 시리얼로  변환

     getDataList= []
     indexList= []
     countIndexList=[]

     for itemList in item['list']: #데이터 프레임 제작후 csv화
          indexCount=""
          
          #중복 제거
          if countIndexList.count(itemList['account_nm']):#중복 확인
               indexCount = countIndexList.count(itemList['account_nm'])                          

          getDataList.append(itemList['thstrm_amount'])
          countIndexList.append(itemList['account_nm'])
          indexList.append(itemList['account_nm']+str(indexCount))
               
     df=pd.Series(getDataList,index=indexList)

     return df

def erase(getStr, deleteList):


     for deleteStr in deleteList:
          getStr=getStr.replace(deleteStr,'')
     getStr=getStr.replace('유사증자','유상증자')
     getStr=getStr.replace('종기업','종속기업')
     getStr=getStr.replace('차입금감소','차입금상')
     getStr=getStr.replace('증권','금융자산')
     getStr=getStr.replace('처분','취득')     
     return getStr

main()
