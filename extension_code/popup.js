function onWindowLoad() {
    var message = document.querySelector('#message');
    // var selector_before_querySelector = null
    // var selector_after_querySelector = null
    // var selector_before_docEl = null;
    // var selector_after_docEl = null;
    chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
        var activeTab = tabs[0];
        var activeTabId = activeTab.id;
        console.log("This is a BOOM!");
        // console.log("Selector's value before querySelector: " + selector_before_querySelector.innerText);
        // console.log("Selector's value after querySelector: " + selector_after_querySelector.innerText);
        // console.log("Selector's value before using document.documentElement: " + selector_before_docEl.innerText);
        // console.log("Selector's value after using document.documentElement: " + selector_after_docEl.innerText);
        return chrome.scripting.executeScript({
            target: { tabId: activeTabId },
            injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
            func: DOMtoString,
            args: ['span.css-901oao.css-16my406.r-poiln3.r-bcqeeo.r-qvutc0']  // you can use this to target what element to get the html for
            
            // basically all text data in a tweet (username, display name, etc) css-901oao css-16my406 r-poiln3 r-bcqeeo r-qvutc0
            // used to be div.css-1dbjc4n
            // div.css-1dbjc4n.r-1igl3o0.r-qklmqi.r-1adg3ll.r-1ny4l3l --> showed Loading... and show 70 tweets
            //css-1dbjc4n r-1igl3o0 r-qklmqi r-1adg3ll r-1ny4l3l == .css-1dbjc4n.r-1igl3o0.r-qklmqi.r-1adg3ll.r-1ny4l3l
        });

    }).then(function (results) {
        message.innerText = results[0].result;
    }).catch(function (error) {
        message.innerText = 'There was an error injecting script : \n' + error.message;
    });
}

window.onload = onWindowLoad;


// function DOMtoString(selector) {
//     if (selector) {
//         // selector_before_querySelector = selector;
//         selector = document.querySelector(selector);
//         // selector_after_querySelector = selector;
//         // console.log("Selector's value after querySelector: " + selector);
//         if (!selector) return "ERROR: querySelector failed to find node";
//     } else {
//         // selector_before_docEl = selector;
//         selector = document.documentElement;
//         // selector_after_docEl = selector;
//         // console.log("Selector's value after using document.documentElement: " + selector);
//     }
//     console.log("Returning selector.innerText: " + selector.innerText);
//     return selector.innerText;
// }


function DOMtoString(selector) {
    if (selector) {
        selector = document.querySelector(selector);
        if (!selector) return "ERROR: querySelector failed to find node"
    } else {
        selector = document.documentElement;
    }
    return selector.innerText;

    //CORRECT: used to be
}

// function BuildTweet(selector) {
//     if 
// }