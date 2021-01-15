# -*- coding: utf-8 -*-
"""
Created on Fri Jan 15 02:26:54 2021

@author: user
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
#    print(df)
    df.to_csv('stock_Code_Data.csv', mode='w')
    
reduceStockData()