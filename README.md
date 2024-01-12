![Image Alt Text](https://github.com/rgaur5/x-insight/blob/main/extension/logo.png)


# Table of Contents
- [Objective](#objective)
- [Getting Started](#getting-started)
  - [Download uBlock Origin (dependency)](#download-ublock-origin-dependency)
  - [Installation Options](#installation-options)
  - [Setup Instructions](#setup-instructions)
- [Development Process + Future](#development-process--future)
  - [Custom NLP Model](#custom-nlp-model)
  - [Web-Scraping Chrome Extension](#web-scraping-chrome-extension)
  - [What's next?](#whats-next)

## Objective
Recommendation algorithms are designed to maximize user retention, often leading to polarizing viewpoints, sensational content, and half-true clickbait dominating social media feeds. X/Twitter, however, is uniquely positioned to function as a collective consciousness, being a primarily text-based platform to exchange perspectives on real-world issues. 

There's a conflict of interest here: X's role as a revenue-maximizing (& retention-maximizing) platform directly contradicts its primary functionality: providing a digital townsquare for people to discuss rationally and educate themselves. This project enables this key functionality of X/Twitter. Using NLP, X Insight identifies and highlights informative, intellectually stimulating, and well-crafted tweets; all other distractors are removed from your feed. 

## Getting Started

### Download uBlock Origin (dependency)
uBlock Origin is a "wide-spectrum content blocker with CPU and memory efficiency as a primary feature" with 33 million users. The extension (comparable to an ad blocker like [AdblockPlus](https://adblockplus.org/)) is free to install at the [Chrome Web Store](https://chromewebstore.google.com/detail/ublock-origin/cjpalhdlnbpafiamejdnhcphjbkeiagm). *Without uBlock Origin's ad removal features, X Insight will not function as expected.*

### Installation Options
Download the extension for free on the [Chrome Web Store](https://dummy.com).

Download the "extension" folder from this repository **AND** enable Chrome developer mode to use. Load the extension folder into your browser. Here's a [tutorial](https://www.youtube.com/watch?v=oswjtLwCUqg) on how to do this in Chrome.

### Setup Instructions
After installation, pin the extension to your browser.

To use the extension, simply click the colorful square icon (shown above). *The extension only filters your X/Twitter page if the popup is visible*.

**Note: Be aware that the popup may close when you interact with your X/Twitter homepage. For example, navigating to a profile will close the extension's popup. To quickly reopen the popup, consider setting a keyboard shortcut in "Manage Extensions" (navigate to chrome://extensions/shortcuts in your browser).**

## Development Process + Future

### Custom NLP Model
The basis of this tool is a custom PyTorch model, built to recognize and differentiate between tweets or pieces of text in the following categories.

- Category 1: Informative, intellectually stimulating, well-crafted, thoughtful & empathetic
- Category 2: Trolling, ad hominem, hateful remarks, malicious intent

The LSTM-based model is trained on a dataset I collected and processed myself -- over 25,000 tweets were used as input for the model's training. The final test accuracy of the model landed around 85%; final train accuracy was 92%.

### Web-Scraping Chrome Extension
The Chrome extension portion of this project enables the model to categorize tweets on a user's screen using web/screen scraping. Because X's API is no longer free, the extension utilizes a novel screen scraping functionality, which was built from scratch.

The extension also handles the padding, tokenizing, and pre-processing of screen-scraped tweets. The PyTorch model was ported to Javascript using ONNX and ONNXRuntime (the model runs on-device & solely on CPU resources).

All of X Insight's functionality fully follows Manifest v3's updated security guidelines.

### What's next?
Feel free to email rgaur2@illinois.edu if you'd like to contribute to this project. There's so much potential for this concept (integrating ML into social media web experiences) and I look forward to potentially expanding this extension to other platforms (i.e., Instagram, Reddit, etc.).
