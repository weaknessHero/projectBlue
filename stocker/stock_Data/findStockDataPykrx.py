# -*- coding: utf-8 -*-
"""

날짜를 입력받고 저장된 날짜에서부터 입력받은 날짜까지 데이터를 저장함


"""


"""

    실행방법
1. cmd 실행하여 파일이 설치된 위치로 이동한다.
2. pip install pykrx를 실행하여 같은 위치에 설치해준다
3. ifReloadStockData.py 를 먼저 실행해준다
4. 현재 파일을 실행하고 날짜를 입력한다.
5. 실행시 약 7분 이상의 시간이 소요된다. 실행이 완료되면 종료를 눌러준다.

"""

"""

    1.3.4
1. 기존 날짜 함수 삭제
2. 마지막 업데이트 날짜 저장으로 중복 다운로드시 시간을 줄임
3. try except를 통한 오류 제거
4. 혼동의 여지가 있는 실행 방법 문구 수정 
5. 전체적인 주석 가독성 상향
6. 고정 수치 함수화

"""

import pandas as pd
from pykrx import stock
import numpy as np
import datetime 
from datetime import date
import time

firstTickerSymbol='000020'
firstSkockDate = 19900103

def main():
    """
    주가 데이터 저장
    구조는 아래로 내려갈수록 숫자가 커지는 오름차순이다.
    주가 데이터중 그때 상장하지 않은 주식은 공백으로 설정
    """
    
    #언제까지 받아오는지 입력
    inputDate = input('날짜를 입력하세요 : YYYYMMDD\n')
    
    start = time.time() #걸리는 시간 측정 
    
    #과거 업데이트 날짜 받아오기 
    updateTxt = open('update.txt','r')
    lastUpdateDate = updateTxt.readline()
    updateTxt.close()
    
    if len(lastUpdateDate) > 1 :    #과거 날짜 데이터가 존재할경우
        print("It's has a history log")
    else : #날짜 데이터가 없으면 초기값으로 지정
        lastUpdateDate = str(firstSkockDate)
    
    #오늘 이상의 값을 받을경우 업데이트 공백이 생길수잇음을 방지
    if inputDate >date.today() :
        print("you want future stock price but we don't")
        inputDate = date.today()
        
    if (firstSkockDate-1<int(inputDate))& (lastUpdateDate < inputDate) : 
    #존재하는 데이터이고 원하는 데이터의 날짜가 마지막 업데이트 날짜 이후에 있으면 실행한다
        
        df=pd.read_csv('stock_code_data.csv',header = 1 ,names = ['num','stockCodeData']) #종목 코드 데이터 받아오기
        tickerSymbolList = df['stockCodeData'].values #리스트화
        
        dataColumns=np.concatenate(([firstTickerSymbol], tickerSymbolList))    
        data = stock.get_market_ohlcv_by_date(lastUpdateDate, inputDate , firstTickerSymbol)['종가']
        
        #다운로드 바 만들기
        i = 1
        downloadSize = dataColumns.size
        downloadStr = "[I          ]"

        #기간안의 모든 데이터를 데이터 프레임으로 만든다
        for x in tickerSymbolList:
            i= i + 1 #진행속도
            lastTime = time.time()  #시간측정
            df = stock.get_market_ohlcv_by_date(lastUpdateDate, inputDate , x)    #주가 데이터 반환
            data = pd.concat([data,df['종가']],axis=1)                  #종가 데이터 수집
            
            #다운로드 확인용
            if 0 == i%250 :                                         #업데이트 퍼센트 변경
                downloadStr=downloadStr.replace(' ','I' ,1)
                
            print("stock Code :", x  ,"The delay time of get the stock Data :", time.time() - lastTime)
            print("\n", i, '/', downloadSize, '\n', downloadStr, '\n')

        data.columns=dataColumns
    
        #이전 버전이 없을시 새로 만들고 존재시 덧붙인다 
        try:
            if int(lastUpdateDate)==firstSkockDate:
                print("im running")
                data.to_csv("stock_Price_Data.csv", mode='w', encoding='utf-8-sig')            
            else :
                data.to_csv("stock_Price_Data.csv", mode='a', header = False, encoding='utf-8-sig')
                
            #업데이트 다음 시작점 날짜 저장    
            updateTxt = open('update.txt','w')
            updateTxt.write(str(int(inputDate)+1)) #다음날의 데이터 부터 받아온다
            updateTxt.close()
    
        #접근성 오류 : 데이터 저장 관련 오류 
        except PermissionError:
            print("ERR : check open the csv file")
            
            #업데이트 다음 시작점 날짜 저장   
            updateTxt = open('update.txt','w')
            updateTxt.write(lastUpdateDate) #오류 수정용 이전 버전으로 저장
            updateTxt.close()
            
        print("time:", time.time() - start)
        
    else:
    #데이터가 없는 시기거나 이미있는 데이터라면
        print("it already done")
    
main()
    

