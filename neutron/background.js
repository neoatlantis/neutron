console.log("Neutron started.");


function findSecurityInfoProblem(securityInfo){
    // Decide if connection shall be terminated. If yes, return true.
    // Generally if this is not "secure", then it shall not be allowed.
    if("secure" !== securityInfo.state) return true;
    if(true === securityInfo.isUntrusted) return true;
    // Filter certificate chains
    for(var i in securityInfo.certificates){
        var cert = securityInfo.certificates[i];
        var found = false;
        for(var algo in certWhitelist){
            for(var j in certWhitelist[algo]){
                if(certWhitelist[algo][j] == cert.fingerprint[algo]){
                    found = true;
                    break;
                }
            }
            if(found) break;
        }
        if(!found){
            console.error("Unknown certificate:", cert);
            return true;
        } else {
            console.debug("Certficate check passed:", cert.fingerprint.sha256);
        }
    }
    console.debug(securityInfo);
    return false;
}






async function onHeadersReceived(response){
    const url = new URL(response.url);
    const pathname = url.pathname;
    const securityInfo = await browser.webRequest.getSecurityInfo(
        response.requestId, { certificateChain: true });

    flashicon(response.tabId);

    var blockingResponse = {};

    if(findSecurityInfoProblem(securityInfo)){
        console.error(
            "ALERT! Security level insufficient: ", pathname, " -> abort!");
        if(response.type == "main_frame"){
            blockingResponse.redirectUrl = browser.runtime.getURL(
                "pages/insecure-https.html");
        } else {
            blockingResponse.cancel = true;
        }
        return blockingResponse;
    }

    // Original response headers contain Content-Security-Policy(CSP), this
    // is replaced with our frozen version. See "headerfilter.js"
    blockingResponse.responseHeaders = changeResponseHeader(
        response.responseHeaders);

    if(response.type == "script"){
        for(var i in localServedScripts){
            if(localServedScripts[i] == pathname){
                blockingResponse.redirectUrl = browser.runtime.getURL(
                    "pmscripts" + pathname);
                console.warn("Redirecting to local:", pathname);
                return blockingResponse;
            }
        }

        console.warn("Unknown script:", pathname);
        blockingResponse.cancel = true;
        return blockingResponse;
    }

    return blockingResponse;
}

browser.webRequest.onHeadersReceived.addListener(
    onHeadersReceived,
    {
        urls: [
            "https://*.protonmail.com/*",
            "https://protonmail.com/*",
        ]
    },
    ["responseHeaders", "blocking"]
);

browser.webRequest.onBeforeRequest.addListener(
    function(){ return { cancel: true }; },
    {
        urls: [
            "http://*.protonmail.com/*",
            "http://protonmail.com/*",
        ]
    },
    ["blocking"]
);
