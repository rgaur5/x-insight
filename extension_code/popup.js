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

        // const callback = function (mutationsList, observer) {
        //     console.log("MUTATION");
        //     const hasMeaningfulMutations = mutationsList.some(mutation => {
        //         // Check for meaningful changes in the mutation
        //         console.log("prev_length: " + prev_length);
        //         console.log(mutation);
        //         console.log("addedNodes.length: " + mutation.addedNodes.length);
        //         if (mutation.addedNodes.length - prev_length > 0) {
        //             console.log(mutation.length >= prev_length);
        //             prev_length = mutation.addedNodes.length;
        //             return true;
        //         }
        //         return false;
            
        //     });
    
        //     if (hasMeaningfulMutations) {
        //         // console.log(this.prev_length);
        //         // console.log(mutation.addedNodes.length);
        //         trackTweets(message);
        //     }
        // };

        // const callback = function (mutationsList, observer) {
        //     console.log("MUTATION");
        
        //     const hasMeaningfulMutations = mutationsList.some(mutation => {
        //         console.log("prev_length: " + prev_length);
        //         console.log(mutation);
        //         console.log("addedNodes.length: " + mutation.addedNodes.length);
        
        //         const currentLength = mutation.addedNodes.length;
        
        //         if (currentLength != prev_length) {
        //             prev_length = currentLength;
        //             return true;
        //         }
        //         return false;
        //     });
        
        //     if (hasMeaningfulMutations) {
        //         trackTweets(message);
        //     }
        // };
        

        // Create an observer instance linked to the callback function
        const observer = new MutationObserver(callback);
        // Start observing the target node for configured mutations
        observer.observe(message, config);
        removeElementById(elementId);
        
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
        // console.log("TrackTweets Called.")
        chrome.tabs.query({ active: true, currentWindow: true }).then(function (tabs) {
            var activeTab = tabs[0];
            var activeTabId = activeTab.id;
            // console.log("This is a BOOM!");
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

