# -*- coding: utf-8 -*-
"""
주가 데이터를 stock_price_data.csv에 빠르게 받아온다 
"""


"""
    실행방법
1. cmd 를 이용하여 pip install pykrx을 같은 위치에 설치해준다
2. 실행시 약 7분 이상의 시간이 소요된다.
"""

"""
    1.3.4
1. 파일속도 개선을 위해 print문 등의 메소드를 제거함
2. 구조를 최적화함
"""

import pandas as pd
from pykrx import stock
import numpy as np
import datetime 
from datetime import date
import time

firstTickerSymbol='000020'


def returnDay():
    """
    금일 날짜 반환 
    주말엔 주가 정보 변화가 없으니 주말을 제거하여 불필요한 데이터 움직임을 방지
    """
    now = date.today()
    if(time.localtime().tm_wday>4): #금요일보다 이후의 요일일 경우 금요일로 취급
        weekday = time.localtime().tm_wday - 4 #금요일에서 넘은 수치마다 증가시킴
        now = now + datetime.timedelta(days=-weekday) 
    
    formatData= now.strftime("%Y%m%d") #양식 변경 
    
    return formatData

def main():
    """
    데이터 구조체 저장
    각자의 데이터가 업데이트 날짜가 다를수 있으니 마지막 업데이트의 인덱스를 반환받음
    구조체의 모습은 가장 옛날기간을 맨위의 기준으로 그전에 상장되지 않은 회사는 비어있는 형태이다.
    """

    start = time.time()
    df=pd.read_csv('stock_code_data.csv',header = 1 ,names = ['num','stockCodeData'])
    tickerSymbolList = df['stockCodeData'].values
    
    
    Day = date.today() 
    Day = now.strftime("%Y%m%d") #1.3.4
    dataColumns=np.concatenate(([firstTickerSymbol], tickerSymbolList))    
    data = stock.get_market_ohlcv_by_date("19560303", Day , firstTickerSymbol)['종가']
    i = 1
    downloadSize = dataColumns.size
    downloadStr = "[I          ]"
    
    print(downloadStr)
    for x in tickerSymbolList:
        i= i + 1
        lastTime = time.time()
        df = stock.get_market_ohlcv_by_date("19560303", Day , x)    #주가 데이터 반환
        data = pd.concat([data,df['종가']],axis=1)                  #종가 데이터 수집
        
        if 0 == i%250 :
            downloadStr=downloadStr.replace(' ','I' ,1)
            
        print("stock Code :", x  ,"The delay time of get the stock Data :", time.time() - lastTime)
        print("\n", i, '/', downloadSize, '\n', downloadStr, '\n')

            


    data.columns=dataColumns
    print(data)
    data.to_csv("stock_Price_Data.csv", mode='w', encoding='utf-8-sig')
    print("time:", time.time() - start)
    
main()
    

