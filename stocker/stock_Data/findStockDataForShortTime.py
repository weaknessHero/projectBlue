# -*- coding: utf-8 -*-
"""

주가 데이터를 stock_price_data.csv 로 비교적 빠르게 저장한다
update 설정 날짜는 실행한 날짜로 설정된다.

"""


"""

    실행방법
1. cmd 실행하여 파일이 설치된 위치로 이동한다.
2. pip install pykrx를 실행하여 같은 위치에 설치해준다
3. ifReloadStockData.py 를 먼저 실행해준다
4. 현재 파일을 실행해준다
5. 실행시 약 7분 이상의 시간이 소요된다. 실행이 완료되면 종료를 눌러준다.

"""

"""
    1.3.4
1. 파일속도 개선을 위해 print문 등의 메소드를 제거함
2. 구조를 최적화함
3. 주석 가독성 상승 및 구체화 
"""

import pandas as pd
from pykrx import stock
import numpy as np
from datetime import date
import time

firstTickerSymbol='000020'
firstSkockDate = '19900103'

def main():
    """
    주가 데이터 저장
    구조는 아래로 내려갈수록 숫자가 커지는 오름차순이다.
    주가 데이터중 그때 상장하지 않은 주식은 공백으로 설정
    """
    #시간 측정
    start = time.time()
    
    #모든 주가 데이터 종가 데이터로 변환
    df=pd.read_csv('stock_code_data.csv',header = 1 ,names = ['num','stockCodeData'])
    tickerSymbolList = df['stockCodeData'].values
    Day = date.today()
    
    #구조를 형성을 위한 첫데이터 받기
    Day = Day.strftime("%Y%m%d") 
    dataColumns=np.concatenate(([firstTickerSymbol], tickerSymbolList))    
    data = stock.get_market_ohlcv_by_date(firstSkockDate, Day , firstTickerSymbol)['종가']
    
    print('please wait for 10~20 minute')

    #주가 데이터 받기    
    for x in tickerSymbolList:
        df = stock.get_market_ohlcv_by_date(firstSkockDate, Day , x)    #주가 데이터 수집
        data = pd.concat([data,df['종가']],axis=1)                  #종가 데이터로 변환

    #상단 주식 종목 코드 달기
    data.columns=dataColumns
    data.to_csv("stock_Price_Data.csv", mode='w', encoding='utf-8-sig')
    
    #업데이트 시작점 날짜 저장
    updateTxt = open('update.txt','w')
    updateTxt.write(str(int(Day)+1)) #다음버전에는 그 이후날의 데이터 부터 받아온다
    updateTxt.close()

    print("time:", time.time() - start)
    
    
main()
    

