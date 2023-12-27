import torch
import numpy as np # linear algebra
import re
import torch.nn as nn
PATH = "/Users/rishabhgaur/1twitextension/cautious-dollop/xyz.pt"
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
##################################
batch_size = 50
class RNN(nn.Module):
     def __init__(self, input_size, num_layers, hidden_size, num_classes, embedding_dim, vocab_size):
        super(RNN, self).__init__()
        self.input_size = input_size
        self.num_layers = num_layers
        self.hidden_size = hidden_size
        self.num_classes = num_classes
        self.embedding_dim = embedding_dim
        self.vocab_size = vocab_size
        self.embed = nn.Embedding(num_embeddings = self.vocab_size, embedding_dim=self.embedding_dim)
        self.lstm = nn.LSTM(self.embedding_dim, self.hidden_size, self.num_layers, batch_first=True) #batch_first true ???
        self.dropout = nn.Dropout(0.3)
        # self.sm = nn.Softmax(self.num_classes)
        self.lin = nn.Linear(self.hidden_size, self.num_classes)
        self.sigmoid = nn.Sigmoid()

     def forward(self, x):
        embeds = self.embed(x)
        out, _ = self.lstm(embeds)
        out = out.contiguous().view(-1, self.hidden_size)
        out = self.dropout(out)
        out = self.lin(out)
        out = self.sigmoid(out)
        # out = self.sm(out)
        out = out.view(batch_size, -1)
        out = out[:, -1]
        return out
##################################
model = RNN(1,1,64,1,256,22501)
model.to(device)
model.load_state_dict(torch.load(PATH, map_location=torch.device('cpu')))
model.eval()

def preprocess_input(s):
    # Remove all non-word characters (everything except numbers and letters)
    s = re.sub(r"[^\w\s]", '', s)
    # Replace all runs of whitespaces with no space
    s = re.sub(r"\s+", '', s)
    # replace digits with no space
    s = re.sub(r"\d", '', s)
    # Lemmatize the words
    return s

# Define the function to tokenize and pad the input
def tokenize_and_pad(input_text, vocab, max_seq_len):
    word_list = [vocab[word] for word in input_text.lower().split() if word in vocab.keys()]
    features = np.zeros((1, max_seq_len), dtype=int)
    if len(word_list) != 0:
        features[0, -len(word_list):] = np.array(word_list)[:max_seq_len]
    return torch.from_numpy(features)

# Define the function to classify a single input string
def classify_input(input_text):
    # Preprocess the input string   
    preprocessed_text = preprocess_input(input_text)
    
    # Tokenize and pad the input
    input_tensor = tokenize_and_pad(preprocessed_text, model.vocab, 300)
    
    # Make prediction
    with torch.no_grad():
        output = model(input_tensor)
    
    # Convert the output to a probability (since you are using Sigmoid activation)
    probability = output.item()
    
    # Classify based on a threshold (you can adjust this threshold)
    threshold = 0.5
    if probability > threshold:
        return "Positive"
    else:
        return "Negative"

# Example usage
input_string = "Your input string goes here"
result = classify_input(input_string)
print("Classification Result:", result)