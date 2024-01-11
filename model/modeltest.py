from tkinter.constants import S
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
from nltk.stem import WordNetLemmatizer
import nltk
nltk.download('stopwords')
nltk.download('wordnet')
from modelcode import RNN
#-------
print("running")
def main():
    pytorch_model = RNN(input_size=1, num_layers=1, hidden_size=64, num_classes=1, 
                        embedding_dim=256, vocab_size=22501, batch_size=1)
    
    pytorch_model.load_state_dict(torch.load('pytorch-model.pt'))
    pytorch_model.eval()
    foo = torch.zeros([1, 300], dtype=torch.int)
    torch.onnx.export(pytorch_model, foo, 'onnx_model.onnx', verbose=True)
    print("done")
if __name__ == '__main__':
    main()
