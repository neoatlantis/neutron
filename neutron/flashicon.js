var iconValue = true;
var iconResumeCountdown = 0;

function flashicon(){
    iconValue = !iconValue;
    browser.browserAction.setIcon({
        path: {
            16: "icons/neutron-enabled" + (iconValue?"-dot":"") + ".svg",
            32: "icons/neutron-enabled" + (iconValue?"-dot":"") + ".svg",
        }
    });
    iconResumeCountdown = 10;
}

setInterval(function(){
    if(iconResumeCountdown > 0){
        iconResumeCountdown -= 1;
        return;
    }
    browser.browserAction.setIcon({
        path: {
            16: "icons/neutron-enabled.svg",
            32: "icons/neutron-enabled.svg",
        }
    });
}, 100);
