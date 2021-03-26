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


def stockDateLoop(season, stockCode,latedays):
    seasonDF= season+datetime.timedelta(days=latedays)
    price=""
    while price== "":
        try:
            price=dataframePrice[stockCode][str(seasonDF)]
        except:
            seasonDF=seasonDF+datetime.timedelta(days=1)


    return seasonDF
    
            


def main():
    #재무제표적 요소가 주가에 미치는 영향 조사 

    err=0

    N =[0 for y in range(26)]
    A3=[0 for y in range(26)]
    A6=[0 for y in range(26)]
    B3=[0 for y in range(26)]
    B6=[0 for y in range(26)]
    #폴더 리스트에서 받아오기 
    pathData = 'data/detailData'
    dirList = os.listdir(pathData)
    stockCodeList=list(map(lambda x : x.replace('.csv',''), dirList))
    price=""
    floatData=""
    floatDataBF=""
    seasonDF=''
    nomal=0
    i=0
    
    df=pd.read_csv(pathData+'/'+'000020'+".csv", index_col=0)
    subjectList=[]
    subjectList=df.index
    for stockCode in stockCodeList:
        #스톡 코드가 존재시 찾고 그것이 전년도 대비 요소들의 상승 하락에 비교하여 주가 변동 파악

        print(stockCode)
        df=pd.read_csv(pathData+'/'+stockCode+".csv", index_col=0)

        i=0
        
        #subject 당 해당 값을 찾아서 비교후 True False 연산
        for subject in df.index:
            
            df.loc[subject] = list(map(lambda x : str(x).replace(',', '') ,df.loc[subject]))
            price=""

            for season in df.columns:


                #예외처리
                if season[4:]=='4':
                    if subject in ['매출액', '영업이익', '법인세차감전 순이익', '당기순이익','매출액1', '영업이익1', '법인세차감전 순이익1', '당기순이익1']:
                        try:#예외값 처리                        
                            df[season][subject]=int(df[season][subject])//4
                        except:
                            err
                #값 정의
                floatDataBF = floatData
                floatData = df[season][subject]

                
                #시즌을 날짜로 변경
                season=seasonToDate(season)
                
                #예외값 처리
                if floatData=='nan':
                    floatData=""
                elif floatData=="-":
                    floatData=floatDataBF
                    if floatDataBF=="-":
                        floatData=''
                else :
                    floatData=str(floatData)[:len(str(floatData))-6]
                    
                    
                    #경량화보다 값이 작을경우 좌 양수 기준 우 음수 기준 
                    if (floatData=="")|(floatData=="-"):
                        floatData=0


                seasonNow=season
                

                price=""
                while price=="":
                    try:
                        price=dataframePrice[stockCode][str(seasonNow)]
                    except:
                        seasonNow=seasonNow+datetime.timedelta(days=1)
                        
                #비교대상 존재시        
                if (floatDataBF!="")&(floatData!=""):
                    try:
                        seasonDF1=stockDateLoop(season,stockCode, -182)
                        seasonDF2=stockDateLoop(season,stockCode, -91)
                        seasonDF3=stockDateLoop(season,stockCode, 91)
                        seasonDF4=stockDateLoop(season,stockCode, 182)
                        
                        if (int(floatData)>int(floatDataBF))==(int(dataframePrice[stockCode][str(seasonDF2)])>int(dataframePrice[stockCode][str(seasonDF1)])):
                            B6[i]+=1


                        if (int(floatData)>int(floatDataBF))==(int(dataframePrice[stockCode][str(seasonNow)])>int(dataframePrice[stockCode][str(seasonDF2)])):
                            B3[i]+=1                    


                        if (int(floatData)>int(floatDataBF))==(int(dataframePrice[stockCode][str(seasonDF3)])>int(dataframePrice[stockCode][str(seasonNow)])):
                            A3[i]+=1

                        if (int(floatData)>int(floatDataBF))==(int(dataframePrice[stockCode][str(seasonDF4)])>int(dataframePrice[stockCode][str(seasonDF3)])):
                            A6[i]+=1
                        N[i]+=1
                        nomal+=1

                    except:
                        print(int(floatData),int(floatDataBF),'one file has the err:',dataframePrice[stockCode][str(seasonDF1)],dataframePrice[stockCode][str(seasonDF2)],dataframePrice[stockCode][str(seasonNow)],dataframePrice[stockCode][str(seasonDF3)],dataframePrice[stockCode][str(seasonDF4)])
                        err+=1

                
            #요소 변경시에 값변경
            floatData=""  
            i+=1

            
    y=0
    for subject in subjectList:
        print('subject:',subject)
        print(B6[y]/N[y]*100)
        print(B3[y]/N[y]*100)
        print(A3[y]/N[y]*100)
        print(A6[y]/N[y]*100)
        y+=1
    print('nomalCount:',nomal)
    print('errCount:',err)
        

    print(N)
    print(A3)
    print(A6)
    print(B3)
    print(B6)
                        #요소 유지및 증가시
                        #값 비교 이후 크면 값을 증가시킨다 작을경우 
                        
                    

                        

                    

main()
