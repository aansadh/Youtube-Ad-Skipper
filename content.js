(function () {
  "use strict";

  const CHECK_INTERVAL = 150;
  let lastAction = 0;
  let alreadySent = false;

  function simulateClick(x, y) {
    chrome.runtime.sendMessage(
      {
        action: "simulateClick",
        x: Math.round(x),
        y: Math.round(y),
        button: "left",
      },
      (res) => {
        console.log("Simulate click response:", res);
      }
    );
  }

  function handleAd() {
    const video = document.querySelector("video");
    const adShowing = document.querySelector(".ad-showing");
    const thumbnailOverlay = document.querySelector(
      "div.ytp-image-background--gradient-vertical"
    );
    const skipButton = document.querySelector(
      "button.ytp-skip-ad-button, button.ytp-ad-skip-button-modern"
    );

    if (!adShowing || !video) return;

    // const now = Date.now();
    // if (now - lastAction < 2000) return; 

    if (thumbnailOverlay && skipButton && !alreadySent) {
      skipButton.style.display = "flex";
      console.log(
        "Thumbnail end-screen ad detected — simulating trusted click..."
      );
      const rect = skipButton.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      alreadySent = true;
      simulateClick(x, y);
      setTimeout(() => {
        alreadySent = false;
      }, 700);
      // lastAction = now;
    } else {
      console.log("Normal video ad — skipping via video.currentTime");
      video.currentTime = video.duration;
      // lastAction = now;
    }
  }

  const observer = new MutationObserver(handleAd);
  observer.observe(document.body, { childList: true, subtree: true });

  // setInterval(handleAd, CHECK_INTERVAL);
})();
