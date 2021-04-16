"""
    데이터분석 두번째 4분기 이상치를 1~3분기로 빼는 값으로 계산
    값 계산시 +시 양적 요소 및 음적 요소의 확률성으로 구함  
    
    
"""

"""
    1.3.11
1.데이터 정리방식 변경

"""

import pandas as pd
import datetime
import os
import math



exceptionSubject=['매출액', '영업이익', '법인세차감전 순이익', '당기순이익','매출액1', '영업이익1', '법인세차감전 순이익1', '당기순이익1']
exceptionData1=['nan']
exceptionData2=['-','']
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

    loop=0
    while (price=="")|(price=="nan"):
        if loop >30:
            break
        
        try:
            price=dataframePrice[stockCode][str(seasonDF)]
        except:
            seasonDF=seasonDF+datetime.timedelta(days=1)
            loop+=1


    return seasonDF
    
            


def main():
    #재무제표적 개별적 요소가 주가에 미치는 영향 조사 


    err1=0
    err2=0
    i=0
    err4=0
    
    dataArrP=[[0]*26 for i in range(5)]
    dataArrM=[[0]*26 for i in range(5)]
    dataArrPN=[[0]*26 for i in range(5)]
    dataArrMN=[[0]*26 for i in range(5)]
    #통계적 값 
    nomalProcess=0
    errProcess=0
    #폴더 리스트에서 받아오기
    pathData = 'data/detailData'
    dirList = os.listdir(pathData)
    stockCodeList=list(map(lambda x : x.replace('.csv',''), dirList))


    #과목이름 정렬및 맞추기 
    subjectList=[]
    i=0
    while len(subjectList)!=26:
        print(len(subjectList))
        df=pd.read_csv(pathData+'/'+dirList[i], index_col=0)
        subjectList=df.index
        i+=1

        
    #스톡 코드가 존재시 찾고 그것이 전년도 대비 요소들의 상승 하락에 비교하여 주가 변동 파악
    for stockCode in stockCodeList:
        print(stockCode)
        df=pd.read_csv(pathData+'/'+stockCode+".csv", index_col=0)
        i=0
        y=0

        #subject 확인
        for subject in df.index:            
            df.loc[subject] = list(map(lambda x : str(x).replace(',', '') ,df.loc[subject]))

            floatData=""
            floatDataBF=""


            
            for season in df.columns:
                #예외처리
                if season[4:]=='4':
                    year=season[:4]
                    if subject in exceptionSubject:
                        try:
                            for i in ["1","2","3"]:
                                df[season][subject]=int(df[season][subject])-int(df[year+i][subject])
                        except:
                            err4+=1
                            df[season][subject]=""

                            
                #값 정의
                floatDataBF = floatData
                floatData = df[season][subject]

                
                #예외값 처리
                if floatData in exceptionData1 :
                    floatData=""
                elif floatData in exceptionData2 : 
                    floatData=floatDataBF
                    if floatDataBF in exceptionData2:
                        floatData=''
                else :
                    #경량화
                    floatData=str(floatData)[:len(str(floatData))-6]

                    
                    if floatData in exceptionData2:
                        floatData=0

                seasonDate=seasonToDate(season)

                
                #비교대상 존재시   
                if (floatDataBF!="")&(floatData!=""):
                    for i in range(0,5,1):
                        try:
                            seasonDF1=str(stockDateLoop(seasonDate,stockCode, 91*(i-1)))
                            seasonDF2=str(stockDateLoop(seasonDate,stockCode, 91*(i-2)))
                            if int(floatData)>int(floatDataBF):
                                if int(dataframePrice[stockCode][seasonDF1])>int(dataframePrice[stockCode][seasonDF2]):
                                    dataArrP[i][y]+=int(dataframePrice[stockCode][seasonDF1])/int(dataframePrice[stockCode][seasonDF2])
                                    dataArrPN[i][y]+=1
                                elif int(dataframePrice[stockCode][seasonDF1])<int(dataframePrice[stockCode][seasonDF2]) :
                                    dataArrM[i][y]+=int(dataframePrice[stockCode][seasonDF1])/int(dataframePrice[stockCode][seasonDF2])
                                    dataArrMN[i][y]+=1
                                else:
                                    nomalProcess+=1
                                    
                                

                        except:
                            print(int(floatData),int(floatDataBF),'one file has the err:',dataframePrice[stockCode][str(seasonDF1)],dataframePrice[stockCode][str(seasonDF2)])
                            errProcess+=1
                

    
            y+=1


    #상태 표시
    print(dataArrP)
    print(dataArrPN)
    print(dataArrM)
    print(dataArrMN)
    y=0
    z=0
    for subject in subjectList:
        print('subject:',subject)
        for z in range(0,5,1):
            print(dataArrP[z][y]/dataArrPN[z][y]*100,'%로 증가하며',dataArrPN[z][y]/(dataArrPN[z][y]+dataArrMN[z][y])*100,'의 확률입니다.')
            print(dataArrM[z][y]/dataArrMN[z][y]*100,'%로 감소하며',dataArrMN[z][y]/(dataArrPN[z][y]+dataArrMN[z][y])*100,'의 확률입니다.')
            print(((dataArrP[z][y]/dataArrPN[z][y]*dataArrPN[z][y]/(dataArrPN[z][y]+dataArrMN[z][y]))-(1/(dataArrM[z][y]/dataArrMN[z][y]))*dataArrMN[z][y]/(dataArrPN[z][y]+dataArrMN[z][y]))*100,": 기대값")
            
        y+=1


    print('nomalCount:',nomalProcess)
    print('errCount:',errProcess)
    print("err4Count:",err4)
                        
main()
