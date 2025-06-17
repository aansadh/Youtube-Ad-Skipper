chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === "simulateClick") {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (!tabs.length) return;

      const tabId = tabs[0].id;
      const target = { tabId };

      chrome.debugger.attach(target, "1.3", () => {
        chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", {
          type: "mouseMoved",
          x: msg.x,
          y: msg.y,
        }, () => {
          chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", {
            type: "mousePressed",
            button: msg.button,
            x: msg.x,
            y: msg.y,
            clickCount: 1,
          }, () => {
            chrome.debugger.sendCommand(target, "Input.dispatchMouseEvent", {
              type: "mouseReleased",
              button: msg.button,
              x: msg.x,
              y: msg.y,
              clickCount: 1,
            }, () => {
              chrome.debugger.detach(target, () => {
                sendResponse({ status: "click simulated" });
              });
            });
          });
        });
      });
    });

    return true; // keep the message channel open
  }
});
