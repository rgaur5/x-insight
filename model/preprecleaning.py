import re
import csv
import pandas as pd
# import nltk
# nltk.download('punkt')
from nltk.tokenize import sent_tokenize

def cleanTweet (all_text):
    # regex = r"(?i)\b((?:[a-z][\w-]+:(?:/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:'".,<>?«»“”‘’]))"
    links = r'(?i)\b((?:[a-z][\w-]+:(?:/{1,3}|[a-z0-9%])|www\d{0,3}[.]|[a-z0-9.\-]+[.][a-z]{2,4}/)(?:[^\s()<>]+|\(([^\s()<>]+|(\([^\s()<>]+\)))*\))+(?:\(([^\s()<>]+|(\([^\s()<>]+\)))*\)|[^\s`!()\[\]{};:\'".,<>?«»“”‘’]))'
    all_text = re.sub(links, "", all_text)
    
    # tlds = ["com", "org", "net", "video", "channel", "social"]
    # tld_regex = r"(?i)\b(?:https?://|www\d{0,3}[.])[a-z0-9.\-]+\." + "|".join(tlds) + r"\/"
    # all_text = re.sub(tld_regex, "", all_text)
    
    # regex = r"(?i)\b(?:https?://|www\d{0,3}[.])[a-z0-9.\-]+\.(?:com|org|net|edu|gov|mil|social|aero|asia|biz|cat|coop|info|int|jobs|mobi|museum|name|post|pro|tel|travel|xxx|[a-z]{2}|xn--[a-z0-9]+[a-z]|app|blog|club|dev|film|game|io|news|shop|tech|wiki)\b/.+?"
    # all_text = re.sub(regex, "", all_text)

    #removing []
    l = r'\[[📹📸] [^\]]+\]|(\[[^]]+\])'
    all_text  = re.sub(l, " ", all_text)
    
    

    # all_text  = re.sub("#\S*\s", "", all_text)
    all_text = re.sub (r'#\w+', "", all_text)
    all_text  = re.sub("\n", " ", all_text)
    all_text = re.sub(r'@\w+',"",all_text)
    all_text = re.sub(r'\s+', ' ', all_text)
    all_text = re.sub(r'^"|"$', '', all_text, flags=re.MULTILINE)
    all_text = re.sub(r'piped\..*$', '', all_text)

    # if (all_text )
    # all_text  = re.sub("@\S*\s", "", all_text)
    # all_text  = re.sub("http\S*\s", "", all_text)   
    
    return all_text




def filter_short_data_points(input_csv_path, output_csv_path, min_length=3):
    with open(input_csv_path, 'r', encoding='utf-8') as infile, \
         open(output_csv_path, 'w', encoding='utf-8', newline='') as outfile:
        reader = csv.DictReader(infile)
        writer = csv.DictWriter(outfile, fieldnames=['text'])
        writer.writeheader()

        for row in reader:
            # Assuming 'text' is the field containing the text data
            text = row.get('text', '')
            
            # Check if the length of the text is greater than or equal to the minimum length
            if len(text.split()) >= min_length:
                writer.writerow(row)

# Example usage
input_csv_path = 'modified2.csv'
output_csv_path = 'modifiedwithshortremoved2.csv'

filter_short_data_points(input_csv_path, output_csv_path, min_length=4)




df = pd.read_csv("/Users/rishabhgaur/1twitextension/cautious-dollop/data2.csv")
df["text"] = df["text"].map(cleanTweet)
df['text'] = df['text'].apply(lambda x: re.split('https:\/\/.*', str(x))[0])
df.to_csv("modified2.csv", encoding='utf-8', index=False)

#SEPARATING CSV INTO INDIVIDUAL SENTENCES
# def csvToListOfSentences(inputCSV):
#     with open(inputCSV, newline='') as csvfile:
#         spamreader = csv.reader(csvfile, delimiter=' ', quotechar='|')
#         count = 0 
#         for row in spamreader:
#             count += 1
#             if (count > 10): 
#                 break;
#             sentences = sent_tokenize(' '.join(row))
#             print(sentences)
# csvToListOfSentences("modified.csv")