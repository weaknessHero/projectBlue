"""

    파일에서 원하는 subject읽고 다루는 시스템
    수치적으로 6개월 이후 이전으로 통계시의 값 계산
    
"""

import pandas as pd
import datetime
import os
import math

#주가 데이터 파일 읽기
dataframePrice=pd.read_csv('data/stock_price_data.csv', index_col=0)

def seasonToDate(data):
    year=data[:4]
    code=data[4:]
    dataForm=[['err','err'],[0,4],[0,7],[0,10],[1,1]]

    result=datetime.datetime(int(year)+int(dataForm[int(code)][0]),int(dataForm[int(code)][1]),1,0,0,0)

    return result


def main():
    #재무제표적 요소가 주가에 미치는 영향 조사 



    A3=[]
    A6=[]
    B3=[]
    B6=[]
    N =[]

    #폴더 리스트에서 받아오기 
    pathData = 'data/detailData'
    dirList = os.listdir(pathData)
    stockCodeList=list(map(lambda x : x.replace('.csv',''), dirList))
    price=""
    floatData=""
    floatDataBF=""
    print(dataframePrice)
    print(type(dataframePrice))
    seasonDF=''

    for stockCode in stockCodeList:
        print('a')
        #스톡 코드가 존재시 찾고 그것이 전년도 대비 요소들의 상승 하락에 비교하여 주가 변동 파악
        df=pd.read_csv(pathData+'/'+stockCode+".csv", index_col=0)

        #시즌을 날짜로 변경
        column=list(map(lambda x: seasonToDate(x),df.columns))
        df.columns=column

        #subject 당 해당 값을 찾아서 비교후 True False 연산
        for subject in df.index:
            df.loc[subject] = list(map(lambda x : str(x).replace(',', '') ,df.loc[subject]))
            price=""
            
            for season in df.columns:
                
                #값 정의
                floatDataBF = floatData
                floatData = df[season][subject]
                #nan 값일경우 비처리
                if floatData=='nan':
                    floatData=""
                #수치 경량화 
                else :
                    floatData=floatData[:len(floatData)-6]
                    
                    #경량화보다 값이 작을경우
                    if floatData=="":
                        floatData=0

                #비교대상 존재시        
                if floatDataBF!="":
                    N+=1
                    seasonDF=season+datetime.timedelta(months=-6)
                    if (floatData>floatDataBF)==(dataframeData[stockCode][str(seasonDF)]>dataframeData[stockCode][str(season)]):
                        B6+=1

                    seasonDF=season+datetime.timedelta(months=-3)
                    if (floatData>floatDataBF)==(dataframeData[stockCode][str(seasonDF)]>dataframeData[stockCode][str(season)]):
                        B3+=1

                    seasonDF=season+datetime.timedelta(months=3)
                    if (floatData>floatDataBF)==(dataframeData[stockCode][str(seasonDF)]>dataframeData[stockCode][str(season)]):
                        A3+=1
        
                    seasonDF=season+datetime.timedelta(months=6)
                    if (floatData>floatDataBF)==(dataframeData[stockCode][str(seasonDF)]>dataframeData[stockCode][str(season)]):
                        A6+=1

                        


                        #요소 유지및 증가시
                        #값 비교 이후 크면 값을 증가시킨다 작을경우 
                        
                    :

                        
            #요소 변경시에 값변경
            floatData=""
                    

main()
