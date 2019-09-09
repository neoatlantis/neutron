/*
Constants for our plugin.

*/

const BASEURL = new URL(browser.runtime.getURL("/"));
const CSP = (function(){
    /*
    Content-Security-Policy as given by ProtonMail.

    As a matter of precaution, we disallow ProtonMail to change this policy
    at server side. It's frozen as follows. Most importantly, script-src
    does not allow in-line scripts otherwise listed in this ruleset,
    making injection of script also impossible.
    */
    var ruleset = {
        "default-src": ["'self'"],
        "connect-src": ["'self'", "blob:"],
        "script-src": [
            "'self'",
//            BASEURL.origin // not necessary.
            "blob: 'sha256-eAhF1Kdccp0BTXM6nMW7SYBdV0c3fZwzcC177TQ692g='"
        ],
        "child-src":  ["blob:"],
        "style-src":  ["'self'", "'unsafe-inline'"],
        "img-src": ["http:", "https:", "data:", "blob:", "cid:"],
        "frame-src": ["'self'", "https://secure.protonmail.com"],
        "require-sri-for": ["script"], // ProtonMail doesn't set this. We do.
        "report-uri": ["https:/reports.protonmail.ch/reports/csp"],
    };

    var result = [];
    for(var rulename in ruleset){
        result.push(rulename + " " + ruleset[rulename].join(" "));
    };
    result = result.join("; ");
    return result;
})();
