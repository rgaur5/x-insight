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
from tqdm import tqdm
from torch.utils.data import TensorDataset, DataLoader
from sklearn.model_selection import train_test_split


file_name = 'merge2.csv'
df = pd.read_csv(file_name)
df.head()

x = df["text"].values
y_ = df["catag"]
y = df["catag"].values
x_train, x_test, y_train, y_test = train_test_split(x, y, stratify= y_)  

def preprocess_string(s):
    # Remove all non-word characters (everything except numbers and letters)
    s = re.sub(r"[^\w\s]", '', s)
    # Replace all runs of whitespaces with no space
    s = re.sub(r"\s+", '', s)
    # replace digits with no space
    s = re.sub(r"\d", '', s)
    return s

def tokenize(x_train,y_train,x_val,y_val):
    word_list = []


    stop_words = set(stopwords.words('english'))
    for sent in x_train:
        for word in sent.lower().split():
            word = preprocess_string(word)
            if word not in stop_words and word != '':
                word_list.append(word)
 
    corpus = Counter(word_list)
    # sorting on the basis of most common words
    corpus_ = sorted(corpus,key=corpus.get,reverse=True)[:400] # type: ignore
    # creating a dict
    onehot_dict = {w:i+1 for i,w in enumerate(corpus_)}
   
    # tokenize
    final_list_train,final_list_test = [],[]
    for sent in x_train:
            final_list_train.append([onehot_dict[preprocess_string(word)] for word in sent.lower().split()
                                     if preprocess_string(word) in onehot_dict.keys()])
    for sent in x_val:
            final_list_test.append([onehot_dict[preprocess_string(word)] for word in sent.lower().split()
                                    if preprocess_string(word) in onehot_dict.keys()])
           
    encoded_train = [1 if label =='pos' else 0 for label in y_train]  
    encoded_test = [1 if label =='pos' else 0 for label in y_val]
    return final_list_train, encoded_train , final_list_test, encoded_test,onehot_dict

#-----

def padding_(sentences, seq_len):
    features = np.zeros((len(sentences), seq_len),dtype=int)
    for ii, review in enumerate(sentences):
        if len(review) != 0:
            features[ii, -len(review):] = np.array(review)[:seq_len]
    return features

#-----

x_train,y_train,x_test,y_test,vocab = tokenize(x_train,y_train,x_test,y_test)

x_train_pad = padding_(x_train,300)
print(x_train_pad[5].tolist())
x_test_pad = padding_(x_test,300)
y_train = np.array(y_train)
y_test = np.array(y_test)

# create Tensor datasets
train_data = TensorDataset(torch.from_numpy(x_train_pad), torch.from_numpy(y_train))
valid_data = TensorDataset(torch.from_numpy(x_test_pad), torch.from_numpy(y_test))
# dataloaders
batch_size = 50
# make sure to SHUFFLE your data
train_loader = DataLoader(train_data, shuffle=True, batch_size=batch_size)
valid_loader = DataLoader(valid_data, shuffle=True, batch_size=batch_size)
# obtain one batch of training data
dataiter = iter(train_loader)
sample_x, sample_y = next(dataiter)


# print('Sample input size: ', sample_x.size()) # batch_size, seq_length
# print('Sample input: \n', sample_x)
# print('Sample output: \n', sample_y)

input_size = 1
num_layers = 2 #number of lstm layers
hidden_size = 256
num_classes = 1
embedding_dim = 300 #???
vocab_size = len(vocab) + 1  #around 400 now, its the range of numbers that the one hot encoding can encode to
lr = 0.001
batch_size = 128
num_epochs = 1

class RNN(nn.Module):
     def __init__(self, input_size, num_layers, hidden_size, num_classes, embedding_dim, vocab_size):
        super(RNN, self).__init__()
        self.input_size = input_size
        self.num_layers = num_layers
        self.hidden_size = hidden_size
        self.num_classes = num_classes
        self.embedding_dim = vocab_size
        self.embed = nn.Embedding(num_embeddings = self.vocab_size, embedding_dim=self.embedding_dim)
        self.lstm = nn.LSTM(self.input_size, self.hidden_size, self.num_layers) #batch_first true ???
        self.lin = nn.Linear(self.hidden_size, self.num_classes)

    # def forward(self, sentence, words):
    #     return