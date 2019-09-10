var iconValue = true;
var iconResumeCountdown = {};

function flashicon(tabId){
    iconValue = !iconValue;
    browser.browserAction.setIcon({
        path: {
            16: "icons/neutron-enabled" + (iconValue?"-dot":"") + ".svg",
            32: "icons/neutron-enabled" + (iconValue?"-dot":"") + ".svg",
        },
        tabId: (tabId >= 0 ? tabId : undefined),
    });
    iconResumeCountdown[tabId] = 10;
}

setInterval(function(){
    for(var tabId in iconResumeCountdown){
        if(iconResumeCountdown[tabId] > 0){
            iconResumeCountdown[tabId] -= 1;
            continue;
        }
        browser.browserAction.setIcon({
            path: {
                16: "icons/neutron-enabled.svg",
                32: "icons/neutron-enabled.svg",
            },
            tabId: parseInt(tabId),
        });
    }
}, 100);

browser.webNavigation.onBeforeNavigate.addListener(function(details){
    delete iconResumeCountdown[details.tabId];
});
