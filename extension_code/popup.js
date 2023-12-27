    function onWindowLoad() {
        var message = document.querySelector('#message');
        var elementId = '[data-testid="tweet"]'; //cellInnerDiv removes tweet - crashes website
        //css-1dbjc4n r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu removes everything but pfp
        //css-1dbjc4n r-eqz5dr r-16y2uox r-1wbh5a2 removes everything but keeps a thin grey line
        trackTweets(message);
        // Options for the observer (which mutations to observe)
        // Set attributes to false if you do not care if existing nodes have changed,
        //  otherwise set it true. 
        const config = { attributes: false, childList: true, subtree: false };
        let prev_length = 0;
        // Callback function to execute when mutations are observed
        const callback = function(mutationsList, observer) {
            // console.log("MUTATION");
            // const hasMeaningfulMutations = mutationsList.some(mutation => console.log(mutation.addedNodes));
            trackTweets(message);
        };

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(message, config);
        // removeElementById(elementId);
        
    }
    window.onload = onWindowLoad;

    // function DOMtoList(selector) {
    //     var list_of_inner_texts = [];
    //     if (selector) {
    //         var elements = document.querySelectorAll(selector);
    //         if (elements.length === 0) return "ERROR: querySelector failed to find nodes";
    //         elements.forEach(function(element) {
    //             list_of_inner_texts.push(element.innerText);
    //         });
    //     } else {
    //         // If no selector is provided, consider the whole document
    //         list_of_inner_texts.push(document.documentElement.innerText);
    //     }
    //     return list_of_inner_texts;
    // }


    function DOMtoList(selector) {
        var list_of_inner_texts = [];
        var list_of_ids = [];
        var list_of_data = [];
        // var list_of_data2 = {};
        var elements = document.querySelectorAll('article[aria-labelledby]');
        var elements2 = document.querySelectorAll('[data-testid="tweet"]')
        //[class="css-175oi2r r-1iusvr4 r-16y2uox r-1777fci r-kzbkwu"]
        // css-1rynq56 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-bnwqim
        if (elements.length == 0) return "ERROR: querySelector failed to find nodes";
        if (elements2.length == 0) return "ERROR: querySelector failed to find nodes";
        // elements.forEach(function(element) {
        //     const id = element.getAttribute('aria-labelledby')
        //     var elewithtext = element.querySelector('[data-testid="tweetText"]')
        //     // const tweet_text_elements = element.getElementsByClassName("css-1rynq56 r-8akbws r-krxsd3 r-dnmrzs r-1udh08x r-bcqeeo r-qvutc0 r-37j5jr r-a023e6 r-rjixqe r-16dba41 r-bnwqim")
        //     // const text = tweet_text_elements[0].innerText
        //     list_of_ids.push(id);
        // }); 
        // elements2.forEach(function(element2) {
        //     const text = element2.innerText
        //     list_of_inner_texts.push(text);
        // }); 
        // var dict = {};

        var maxLength = Math.min(elements.length, elements2.length);

        for (var i = 0; i < maxLength; i++) {
            const id = elements[i].getAttribute('aria-labelledby');
            // const text_elems = elements2[i].getElementsByClassName("css-175oi2r")
            // const text = text_elems.innerText
            // const text_query = elements[i].querySelector('[data-testid="tweetText"]');
            // const text = text_query.outerHTML
            var text = "";

            const text2 = elements2[i].querySelector('[data-testid="tweetText"]')
            if (text2 == null) {
                text = "NO TEXT"
            }
            else {
            text = text2.querySelector('[class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3"]') //getting text span
            if (text == null) {
                text = "EMOJIS - NO TEXT"
                // text = text2.querySelector('[class="r-4qtqp9 r-dflpy8 r-zw8f10 r-sjv1od r-10akycc r-h9hxbl"]') //getting emoji (img) span
            }
            else {
                var temp = ""
                text = text2.querySelectorAll('[class="css-1qaijid r-bcqeeo r-qvutc0 r-poiln3"]')
                text.forEach(function(element) {
                    temp += element.innerText;
                });
                text = temp
            }
        }
            
            list_of_ids.push(id);
            list_of_inner_texts.push(text);
            list_of_data.push(id.slice(0, 10) + " " + text);
        }

        // if (text == null) {
        //     text = text2.querySelector('class="r-4qtqp9 r-dflpy8 r-zw8f10 r-sjv1od r-10akycc r-h9hxbl"')
        // }
        // else {
        //     text = text.outerHTML
        // }

        return list_of_data
        // return ["IDS: "+ list_of_ids.length, "TEXTS: "+ list_of_inner_texts.length];
        // return ["IDS: "+ list_of_ids[0], "TEXTS: "+ list_of_inner_texts[0]];
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
        // console.log("TrackTweets Called.")
        chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
            var activeTab = tabs[0];
            var activeTabId = activeTab.id;
            // console.log("This is a BOOM!");
            return chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,  // uncomment this to make it execute straight away, other wise it will wait for document_idle
                func: DOMtoList,
                args: ['article[aria-labelledby]']  // you can use this to target what element to get the html for
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

    function removeElementById(elementId) {
        var x;
        chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
            var activeTab = tabs[0];
            var activeTabId = activeTab.id;
    
            chrome.scripting.executeScript({
                target: { tabId: activeTabId },
                injectImmediately: true,
                func: function(elementId) {
                    var elementToRemove = document.querySelector(elementId);
                    if (elementToRemove) {
                        x = elementToRemove;
                        elementToRemove.remove();
                        return true; // Indicates success
                    }
                    return false; // Indicates element not found
                },
                args: [elementId],
            }, function(results) {
                if (results[0]) {
                    console.log(`Element with id ${elementId} removed from the DOM.`);
                    console.log(x);
                } else {
                    console.log(`Element with id ${elementId} not found.`);
                }
            });
        });
        
    }

    //WORKS BUT DOES NOT PRINT LOG MSGS
    // function removeElementById(elementId) {
    //     chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    //         var activeTab = tabs[0];
    //         var activeTabId = activeTab.id;
    
    //         chrome.scripting.executeScript({
    //             target: { tabId: activeTabId },
    //             func: function(elementId) {
    //                 var elementToRemove = document.querySelector(elementId);
    //                 if (elementToRemove) {
    //                     console.log(`Element with id ${elementId} removed from the DOM.`);
    //                     elementToRemove.remove();
    //                 } else {
    //                     console.log(`Element with id ${elementId} not found.`);
    //                 }
    //             },
    //             args: [elementId],
    //         });
    //     });
    // }    

