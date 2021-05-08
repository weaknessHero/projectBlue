# -*- coding: utf-8 -*-
"""
    open api를 통한 파일 양식 제작
    데이터 받기 전 자료 요청
    update.txt와 파일 구조등 resource들 생성
"""
"""
     1.4.4
1. csv 데이터 형태를 검색에 용의하도록 변경

"""

import pandas as pd
import os
import urllib.request as urlreq
from io import BytesIO
from zipfile import ZipFile
import xml.etree.ElementTree as ET
import requests
import json


#url 요청 값
url = 'https://opendart.fss.or.kr/api'

corpCodeUrl='/corpCode.xml'


CTFCTKey = "?crtfc_key=d171bfc3588a2a2cf9defbee64bc3561de0dfe8a"#인증키


def getCorpCode():
    #with로 url닫기를 자동 진행
    with urlreq.urlopen(url+corpCodeUrl+CTFCTKey) as zipresp: #회사 정보 받아오기
       with ZipFile(BytesIO(zipresp.read())) as zfile: #2진 zip 정보를 변환
            zfile.extractall('resource')


    ### 압축파일 안의 xml 파일 읽기
    tree = ET.parse('resource/CORPCODE.xml')
    root = tree.getroot()
    
    DFList1 = []
    DFList2 = []
    DFList3 = []

    for corpCode in root.iter('list'):
        if(corpCode[2].text.strip()!='' and corpCode[2].text!='999980'): #상장회사일 경우 True            
            DFList1.append(corpCode[1].text.strip())
            DFList2.append(corpCode[2].text.strip())
            DFList3.append(corpCode[0].text.strip())

    series1 = pd.Series(DFList1)
    series2 = pd.Series(DFList2)
    series3 = pd.Series(DFList3)
    csv=pd.concat([series1, series2,series3] , axis=1 ,keys=["corpName","stockCode","corpCode"])

    csv.to_csv('resource/corpCodeData.csv', mode='w', index=False, header=True, encoding="utf-8-sig")

try:
    os.mkdir('resource')

except:
    print('폴더가 이미 생성되어있습니다.')

try:
    os.mkdir('data')

except:
    print('폴더가 이미 생성되어있습니다.')



try:
    os.mkdir('data/detailData')

except:
    print('폴더가 이미 생성되어있습니다.')

    


try:
    updateTxt = open('updateCorp.txt','w')
    updateTxt.close()

except:
    print("updateCorp.txt 가 열려있는지 확인 후 닫아주세요")

    
try:
    updateTxt = open('update.txt','w')
    updateTxt.close()

except:
    print("update.txt 가 열려있는지 확인 후 닫아주세요")
    
getCorpCode()
print("완료")
