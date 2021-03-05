"""
    파일에서 원하는 subject읽고 다루는 시스템
    
"""

import pandas as pd
import os
import matplotlib.pyplot as plt

#파일 읽기
pathData = 'data/detailData'
fileList = os.listdir(pathData)
subject = '유동자산'


dataframePrice=pd.read_csv('data/stock_price_data.csv', index_col=0)

print(dataframePrice)

df=pd.read_csv('data/detailData/'+"000020.csv", index_col=0)

#str 파일 int형으로 변환
df.loc[subject] = df.loc[subject].apply(lambda x: x.replace(',',''))
df.loc[subject] = df.loc[subject].apply(lambda x: x[:len(x)-6])
print(df.loc[subject])
df.loc[subject] =  pd.to_numeric(df.loc[subject])

print(type(dataframePrice.index))
print(dataframePrice.index)
s1 = df.loc[subject]
s2 = dataframePrice["000020"]

ax2 = s2.plot()
plt.show()
ax1 = s1.plot()
plt.show()
    
    #df[subject] = df.apply(lambda x:x[subject])
    #IndicatorDF=pd.to_numeric(df.loc[subject])7
    #print(IndicatorDF)

    #plt.plot(IndicatorDF)
