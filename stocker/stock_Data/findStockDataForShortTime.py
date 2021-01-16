# -*- coding: utf-8 -*-
"""
Created on Tue Jan 12 16:54:37 2021

 이번 nodejs 프로젝트의 총 작업 

1차 주가 데이터를 받아서 다루고
2차 주가 관련 정보를 통한 유의미한 수치 찾기 와
3차 영향성있는 수치를 재구성하고 수식화 하여 분석하기 입니다.

통계를 통해서 유의미한 결과를 도출하기 위해 통계에서 
노이즈를 줄이고 통계를 통해서 유의미한 수치를 찾아내고
시대상의 흐름과 문제등을 배제하여 주가의 본질성을 분석하는 것이다. 

"""


"""
*********** 필독 ************

cmd 를 이용하여 pip install pykrx을 같은 위치에 설치해준다

이번 프로그램 1차 주가 데이터를 받아온다

실행시 약 7분 이상의 시간이 소요된다.

"""


import pandas as pd
from pykrx import stock
import numpy as np
from datetime import date
import time

firstTickerSymbol='000020'


def main():
    """
    데이터 구조체 저장
    각자의 데이터가 업데이트 날짜가 다를수 있으니 마지막 업데이트의 인덱스를 반환받음
    구조체의 모습은 가장 옛날기간을 맨위의 기준으로 그전에 상장되지 않은 회사는 비어있는 형태이다.
    """

    start = time.time()
    df=pd.read_csv('stock_code_data.csv',header = 1 ,names = ['num','stockCodeData'])
    tickerSymbolList = df['stockCodeData'].values
    
    
    Day = date.today() # 1.3.4
    Day = Day.strftime("%Y%m%d") # 1.3.4 불필요한 함수 제거 날짜 양식 변경 
    
    dataColumns=np.concatenate(([firstTickerSymbol], tickerSymbolList))    
    data = stock.get_market_ohlcv_by_date("19560303", Day , firstTickerSymbol)['종가']
    print('please wait for 10~20 minute')
    
    for x in tickerSymbolList:
        df = stock.get_market_ohlcv_by_date("19560303", Day , x)    #주가 데이터 반환
        data = pd.concat([data,df['종가']],axis=1)                  #종가 데이터 수집


    data.columns=dataColumns
    print(data)
    data.to_csv("stock_Price_Data.csv", mode='w', encoding='utf-8-sig')
    print("time:", time.time() - start)
    
main()
    

