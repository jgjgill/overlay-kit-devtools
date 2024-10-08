window.addEventListener("sendToExtension", ((event: CustomEvent) => {
  const data = event.detail;
  chrome.storage.local.set({ "overlay-kit": data });
  chrome.runtime.sendMessage({ type: "SYNC_STATE" });
}) as EventListener);

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "SEND_CUSTOM_EVENT") {
    const customEvent = new CustomEvent("sendToApp", { detail: message.data });

    window.dispatchEvent(customEvent);
  }
});

window.addEventListener("beforeunload", function () {
  chrome.storage.local.remove("overlay-kit");
});
