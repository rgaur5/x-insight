# from pkg_resources import working_set
# import torch
# from nltk.corpus import stopwords
# from nltk.tokenize import word_tokenize
# import pandas as pd
# from collections import Counter
# import numpy as np
# from sklearn.model_selection import train_test_split 
# import re

import numpy as np # linear algebra

import pandas as pd # data processing, CSV file I/O (e.g. pd.read_csv)

import torch

import torch.nn as nn

import torch.nn.functional as F

from nltk.corpus import stopwords 

from nltk.tokenize import  word_tokenize

from collections import Counter

import string

from sklearn.preprocessing import OneHotEncoder
from sklearn.preprocessing import LabelBinarizer

import re

# import seaborn as sns

from tqdm import tqdm

# import matplotlib.pyplot as plt

from torch.utils.data import TensorDataset, DataLoader

from sklearn.model_selection import train_test_split


file_name = 'merge2.csv'
df = pd.read_csv(file_name)
df.head()
# print(df.head())
#creating test train datasets

x = df["text"].values
# print(x)
y_ = df["catag"]
y = df["catag"].values
x_train, x_test, y_train, y_test = train_test_split(x, y, stratify= y_)  
# print(x_train)
f = x.tolist()
# print(f[0])
# print("------------------------------------------------------------------------------")
# print(x_train)

def tokenize (x_train):
    word_list = []
    for s in x_train:
        s = re.sub(r"[^\w\s]", '', s)
        s = s.lower()
        word_list.append(word_tokenize(s))
    return word_list

x_train = tokenize(x_train)
x_test = tokenize(x_test)




# def preprocess_text_and_remove_stopwords(s):
#     # Remove all non-word characters (everything except numbers and letters)
#     s = re.sub(r"[^\w\s]", '', s)
#     # Replace all runs of whitespaces with no space
#     # replace digits with no space
#     s_new = ""
#     stop_words = set(stopwords.words('english'))
#     for word in s.lower().split():
#         if word not in stop_words and word != '':
#             s_new+=" " + word
#     return s_new

# print(preprocess_text_and_remove_stopwords(f[0]))


# def tokenize(x_train,y_train,x_val,y_val):
#     word_list = []


#     stop_words = set(stopwords.words('english'))
#     for sent in x_train:
#         for word in sent.lower().split():
#             word = preprocess_string(word)
#             if word not in stop_words and word != '':
#                 word_list.append(word)
 