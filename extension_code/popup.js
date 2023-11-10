function onWindowLoad() {
    var message = document.querySelector('#message');
    trackTweets(message);
    // Options for the observer (which mutations to observe)
    // Set attributes to false if you do not care if existing nodes have changed,
    //  otherwise set it true. 
    const config = { attributes: false, childList: true, subtree: true };

    // Callback function to execute when mutations are observed
    const callback = function(mutationsList, observer) {
        trackTweets(message);
    };

    // Create an observer instance linked to the callback function
    const observer = new MutationObserver(callback);

    // Start observing the target node for configured mutations
    observer.observe(message, config);
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

function trackTweets (x) {
    console.log("TrackTweets Called.")
    chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
        console.log("This is a BOOM!");
        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
            func: DOMtoList,
            args: ['[data-testid="tweetText"]']  // you can use this to target what element to get the html for
        });

    }).then(function (results) {
        // console.log(results);
        // console.log(results[0].result);

        var a = ""
        results[0].result.forEach(function(entry) {
            // console.log(entry);
            a = a.concat(entry + "\n ----------- \n");
          });

        x.innerText = a;
       
    }).catch(function (error) {
        x.innerText = 'There was an error injecting script : \n' + error.x;
    });
    return x;
}


