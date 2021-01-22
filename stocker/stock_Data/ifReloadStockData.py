# -*- coding: utf-8 -*-
"""
Created on Fri Jan 15 02:26:54 2021

@author: user
"""
"""
    파일 양식 제작
    update.txt와 stock_code_data 생성
"""

import pandas as pd
import numpy as np
import csv

def reduceStockData():
    """
    데이터를 가볍게 하기 위해서 종목코드만 분할한다.
    신규 상장시에 가끔씩만 하면 됨
    """
    csv_Data = pd.read_csv('stock_Data.csv')
    

    data = csv_Data["종목코드"].sort_values()
    print(data.reset_index(drop=True))
    print(type(data.values))
    df=pd.DataFrame(data.values)
    df.to_csv('stock_code_data.csv', mode='w')
    f= open('update.txt','w')
    f.close()
    
reduceStockData()