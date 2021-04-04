# -*- coding: utf-8 -*-
"""

날짜를 입력받고 저장된 날짜에서부터 입력받은 날짜까지 데이터를 저장함
초기 실행시 빠른 설치로 진행되고 새파일을 만든다 
다음 설치시 부분적인 업데이트 날짜로 이어져서 부분설치가 된다 

"""


"""

    실행방법
1. cmd 실행하여 파일이 설치된 위치로 이동한다.
2. pip install pykrx를 실행하여 같은 위치에 설치해준다
3. ifReloadStockData.py 를 먼저 실행해준다
4. 현재 파일을 실행하고 명령에 따른다. 
5. 실행시 약 7분 이상의 시간이 소요된다. 실행이 완료되면 종료를 눌러준다.

"""

"""

    1.4.4
1. 데이터 받을때 try excep문을 통해서 오류시에도 진행


"""


import pandas as pd
from pykrx import stock
import numpy as np
from datetime import date
import time
from tkinter import *
from pynput import mouse
from time import sleep

firstSkockDate = "20100101"
path = "data/"

#today 양식 변경
day = date.today()
todayDate = day.strftime("%Y%m%d") 

downloadSize = 0
end = False
u = 0


def main():
    """
    주가 데이터 저장
    구조는 아래로 내려갈수록 숫자가 커지는 오름차순이다.
    주가 데이터중 그때 상장하지 않은 주식은 공백으로 설정
    """
        
    #과거 업데이트 날짜 받아오기 
    updateTxt = open('update.txt','r')
    lastUpdateDate = updateTxt.readline()
    updateTxt.close()
    
    if len(lastUpdateDate) > 1 :    #주가 업데이트 날짜 확인후 
        print("It's has a history log")
    else :     
    #날짜 데이터가 없으면 초기값으로 지정
        lastUpdateDate = firstSkockDate

    
    print('***********************************\n\nplease wait for 10~20 minute\npress mousse show the download percent\n\n***********************************')

    start = time.time()
    
    download(lastUpdateDate)
    print("time:", time.time() - start)
    end = True   
        
def download(lastUpdateDate):
    """
    
    주가 데이터를 받아와서 csv파일을 새로 제작한다.
    
    """
    
    global u
    global end
    global x
    global downloadSize
    global path
    
    culumnList=[]
    downloadSize =0
    x=1

    if (int(lastUpdateDate) <= int(todayDate)) : 
     
        #모든 주가 데이터 종가 데이터로 변환
        df=pd.read_csv('resource/corpCodeData.csv',header = 0 ,names = ['stockCodeData','corpCodeData'])
        tickerSymbolList = df['stockCodeData'].values

        downloadSize = tickerSymbolList.size
        

        #마우스 클립 입력받아 다운로드 퍼센트 확인 
        listener = mouse.Listener(on_click=on_click)
        listener.start()
        df = pd.DataFrame(index=range(0,0))
        
        #주가 데이터 받기    
        for x in tickerSymbolList:
            u= u+1
            try:
                sleep(0.05)               
                x=str(x).zfill(6) #자릿수 맞추기
                df1 = stock.get_market_cap_by_date(lastUpdateDate, todayDate ,x)
                print('a')#주가 데이터 수집
                df = pd.concat([df , df1['시가총액']], axis=1)#시가총액 데이터로 변환
                print('b')
                culumnList.append(x)
            except:
                print('err')
                

        df.columns = culumnList

            #이전 버전이 없을시 새로 만들고 존재시 덧붙인다

        
        try: 
            if int(lastUpdateDate)<=int(firstSkockDate):
                df.to_csv('data/stock_price_data.csv', mode='w', header= True, encoding='utf-8-sig')            
            else :
                df.to_csv('data/stock_price_data.csv', mode='a', header =False, encoding='utf-8-sig')

            updateTxt = open('update.txt','w')
            updateTxt.write(str(int(todayDate)+1))#다음날의 데이터 부터 받아온다
            updateTxt.close()          

            #접근성 오류 : 데이터 저장 관련 오류 
        except PermissionError:
            print("ERR : check you open csv file")
            updateTxt = open('update.txt','w')
            updateTxt.write(lastUpdateDate)
            updateTxt.close()

    else:
        print('it already done')
                

def on_click(a,b,c,pressed):
    if (end):
        print("end")
        return False
    elif(pressed):
        print("stock Code :", x  ,"how mouch downloaded")
        print("\n", u, '/', downloadSize, '\n')


main()
