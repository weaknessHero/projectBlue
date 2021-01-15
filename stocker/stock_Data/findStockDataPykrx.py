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

def getTickerSymbol(stockCodeData):
    """
    주가 종목코드 반환
    
    
    """
    df=pd.read_csv(stockCodeData,header = 1 ,names = ['num','stockCodeData'])
    return df['stockCodeData'].values


    


def returnStockPriceData(tickerSymbol,Day):
    """
    종가를 반환한다 
    또한 데이터 량이 많기 때문에 맨위에 그 종목이 가장 최근에 업데이트한 날짜를 쓴다.
    하나의 주가 데이터를 받기까지 약 0.225초이고 2000개 이상의 종목 코드를 받기 위해서 400초 이상이 소모됨
    가장 마지막 주가 데이터를 읽고 
    """

    df = stock.get_market_ohlcv_by_date("19560303", Day , str(tickerSymbol))
    return df



def makeDataStructure():
    """
    데이터 구조체 반환
    각자의 데이터가 업데이트 날짜가 다를수 있으니 마지막 업데이트의 인덱스를 반환받음
    구조체의 모습은 가장 옛날기간을 맨위의 기준으로 그전에 상장되지 않은 회사는 비어있는 형태이다.
    라스트 인덱스의 길이가 설정 기간보다 짧을 경우 
    """

    start = time.time()
    tickerSymbolList = getTickerSymbol('stock_Code_Data.csv')
    
    Day = returnDay()
    dataColumns=np.concatenate(([firstTickerSymbol], tickerSymbolList))    
    data = returnStockPriceData(firstTickerSymbol,Day)['종가']
    print(dataColumns)
    for x in tickerSymbolList:
        lasttime = time.time()
        df = returnStockPriceData(x,Day)
        data = pd.concat([data,df['종가']],axis=1)
        print("The delay time of get the stock Data :", time.time() - lasttime ,"sec and stock Code :", x )
    
    data.columns=dataColumns
    print(data)
    data.to_csv("stock_Price_Data.csv", mode='w', encoding='utf-8-sig')
    print("time:", time.time() - start)

makeDataStructure()
    

