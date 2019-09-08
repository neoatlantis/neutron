console.log("Neutron started.");

const BASEURL = new URL(browser.runtime.getURL("/"));


const CSP = (function(){
    var ruleset = {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "blob:"],
        "script-src": [
            "'self'",
            BASEURL.origin
        ],
        "child-src":  ["blob:"],
        "style-src":  ["'self'", "'unsafe-inline'"],
        "img-src": ["http:", "https:", "data:", "blob:", "cid:"],
        "frame-src": ["'self'", "https://secure.protonmail.com"],
        "require-sri-for": ["script"],
//        "report-uri": ["https:/reports.protonmail.ch/reports/csp"],
    };

    /*for(var i in scriptWhitelist){
        ruleset["script-src"].push("'" + scriptWhitelist[i] + "'");
    }*/
    
    ruleset["script-src"].push("blob: 'sha256-eAhF1Kdccp0BTXM6nMW7SYBdV0c3fZwzcC177TQ692g='");

    var result = [];
    for(var rulename in ruleset){
        result.push(rulename + " " + ruleset[rulename].join(" "));
    };
    result = result.join("; ");
    return result;
})();



function findSecurityInfoProblem(securityInfo){
    // Decide if connection shall be terminated. If yes, return true.
    // Generally if this is not "secure", then it shall not be allowed.
    if(securityInfo.state != "secure") return true;
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

    var blockingResponse = {};

    if(findSecurityInfoProblem(securityInfo)){
        console.error(
            "ALERT! Security level insufficient: ", pathname, " -> abort!");
        blockingResponse.cancel = true;
        return blockingResponse;
    }

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

    blockingResponse.responseHeaders = [];
    for(var i in response.responseHeaders){
        if(response.responseHeaders[i].name != "Content-Security-Policy"){
            blockingResponse.responseHeaders.push(
                response.responseHeaders[i]);
        } else {
            blockingResponse.responseHeaders.push({
                "name": "Content-Security-Policy",
                "value": CSP,
            });
        }
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



/*browser.webRequest.onHeadersReceived.addListener(
    async function(response){
        console.log("*********************************1");
        console.log(await browser.webRequest.getSecurityInfo(response.requestId, { certificateChain: true }));
        console.log("*********************************2");
        return { cancel: false };
    },
    {
        urls: [
            "https://*.protonmail.com/*",
            "https://protonmail.com/*",
        ]
    },
    ["responseHeaders", "blocking"]
);*/
