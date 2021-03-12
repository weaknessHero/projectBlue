"""

    파일에서 원하는 subject읽고 다루는 시스템
    수치적으로 6개월 이후 이전으로 통계시의 값 계산

    
"""

import pandas as pd
import datetime
import os
import math



def seasonToDate(data):
    year=data[:4]
    code=data[4:]
    dataForm=[['err','err'],[0,4],[0,7],[0,10],[1,1]]

    result=datetime.datetime(int(year)+int(dataForm[int(code)][0]),int(dataForm[int(code)][1]),1,0,0,0)

    return result


def main():

    #주가 데이터 파일 읽기
    dataframePrice=pd.read_csv('data/stock_price_data.csv', index_col=0)

    #폴더 리스트에서 받아오기 
    pathData = 'data/detailData'
    dirList = os.listdir(pathData)
    stockCodeList=list(map(lambda x : x.replace('.csv',''), dirList))

    
    for stockCode in stockCodeList:
        #스톡 코드가 존재시 찾고 그것이 전년도 대비 요소들의 상승 하락에 비교하여 주가 변동 파악
        df=pd.read_csv(pathData+'/'+stockCode+".csv", index_col=0)

        #시즌을 날짜로 변경
        column=list(map(lambda x: seasonToDate(x),df.columns))
        df.columns=column

        #subject 당 해당 값을 찾아서 True False 연산
        for subject in df.index:
            df.loc[subject] = list(map(lambda x : str(x).replace(',', '') ,df.loc[subject]))

            for season in df.columns
                floatData = df[season][subject]

                #nan 값일경우 불가시
                if floatData=='nan':
                    floatDataBF=""
                else :
                    #수치 경량화
                    floatData=floatData.[:len(floatData)-6]

                    #경량화보다 값이 작을경우
                    if floatData==""
                        floatDataBF=0
                    else :
                        #이전값 존재시
                        if floatDataBF!="":
                            i+=1
                            if floatDataBF=<floatData:
                                #개월마다 변경
                                P+=1
                            elif floatDataBF>floatData:
                                P+=1

                                
                    
                    
                
                    

                """
                1. nan 의 경우 처리
                2. 0이 될 경우 처리
                """
                #if df.loc[subject][season]!='':
                    #df.loc[subject] = list(map(lambda x : x[:len(x)-6] ,df.loc[subject]))
                    
            #floatDataBF = df.loc[subject][season]
                #str 값을 int형으로 변환
                #if math.isnan(floatData):
                    #print(df.loc[subject][season])

main()
