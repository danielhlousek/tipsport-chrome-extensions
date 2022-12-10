console.log("This is a popup!");

chrome.runtime.onInstalled.addListener(() => {
    chrome.action.setBadgeText({
        text: "OFF",
    });
});

const tipsport = 'https://www.tipsport.cz/live'

chrome.action.onClicked.addListener(async (tab) => {
    if (tab.url.startsWith(tipsport)) {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        const prevState = await chrome.action.getBadgeText({tabId: tab.id});
        // Next state will always be the opposite
        const nextState = prevState === 'ON' ? 'OFF' : 'ON'

        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: tab.id,
            text: nextState,
        });

        if (nextState === "ON") {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: () => {
                    let video = document.querySelector("#js-liveMultiview div.m-scoreboardStream__streamBlock div > iframe");
                    video.requestFullscreen();
                }
            });
        } else if (nextState === "OFF") {
            await chrome.scripting.executeScript({
                target: {tabId: tab.id},
                func: () => {
                    let video = document.querySelector("#js-liveMultiview div.m-scoreboardStream__streamBlock div > iframe");
                    video.exitFullscreen();
                }
            });
        }
    }
});