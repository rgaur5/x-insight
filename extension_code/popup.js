function onWindowLoad() {
    var message = document.querySelector('#message');
    //getting info 
    chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
        console.log("This is a BOOM!");
        
        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
            func: DOMtoList,
            args: ['[data-testid="tweetText"]']  // you can use this to target what element to get the html for

            //data-testid="tweetText"
            // span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0
            // div.css-1dbjc4n
 
        });

    }).then(function (results) {
        console.log(results);
        console.log(results[0].result);

        var a = ""
        results[0].result.forEach(function(entry) {
            console.log(entry);
            a = a.concat(entry + "\n ----------- \n");
          });

        message.innerText = a;
       
    }).catch(function (error) {
        message.innerText = 'There was an error injecting script : \n' + error.message;
    });
}


window.onload = onWindowLoad;


function DOMtoList(selector) {
    var list_of_inner_texts = [];
    if (selector) {
        var elements = document.querySelectorAll(selector);
        if (elements.length === 0) return "ERROR: querySelector failed to find nodes";
        elements.forEach(function(element) {
            list_of_inner_texts.push(element.innerText);
        });
    } else {
        // If no selector is provided, consider the whole document
        list_of_inner_texts.push(document.documentElement.innerText);
    }
    return list_of_inner_texts;
}

function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.innerText;

}
