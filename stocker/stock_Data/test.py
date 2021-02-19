import urllib.request as urlreq
from io import BytesIO
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import requests
import json
import pandas as pd

#url 요청 url 
url = 'https://opendart.fss.or.kr/api'

#요청 값
getCorpCode='/corpCode.xml'
getCorpData='/fnlttSinglAcntAll.json'

CTFCTKey = "?crtfc_key=d171bfc3588a2a2cf9defbee64bc3561de0dfe8a"#인증키

corpCodeNA= "&corp_code="

BSNSYearNA = "&bsns_year=" #NA = Need argument => year

reptyCodeNA = "&reprt_code=1101"# 1:사업 보고서, 2:분기, 3:1분기, 4:3분기 보고서 번호

fd_div = "&fs_div=OFS"

year = 2016

corpCodeData = pd.read_csv('resource/corpCodeData.csv', names=['stockCode', 'corpCode'])

### xml 데이터 확인
for num, corpCode in corpCodeData.iterrows(): #데이터프레임 열 탐색
     print(str(corpCode[1]))
     year = 2015
     while year < 2021 :
          for code in [1]:
               sortList= list()
               clumnList= list()
               res= requests.get(url+getCorpData+CTFCTKey+corpCodeNA+str(corpCode[1]).zfill(8)+BSNSYearNA+ str(year) +reptyCodeNA + str(code)+fd_div)
               item=json.loads(res.text)
               if(item['status']=='000'):
                    for itemList in item['list']:
                         sortList.append(itemList['thstrm_amount'])
                         clumnList.append(itemList['account_nm'])

                    print(clumnList)
                    
               
          year +=1
