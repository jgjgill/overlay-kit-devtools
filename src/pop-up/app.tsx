import { useEffect, useState } from "react";
import { getCurrentTab } from "../helpers/tabs";

type OverlayId = string;

export type OverlayItem = {
  id: OverlayId;
  isOpen: boolean;
};

export default function App() {
  const [overlayList, setOverlayList] = useState<OverlayItem[] | null>(null);
  const [currentId, setCurrentId] = useState();

  useEffect(() => {
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      chrome.storage.local.get("overlay-kit", (result) => {
        setOverlayList(result["overlay-kit"]["overlayList"]);
        setCurrentId(result["overlay-kit"]["currentId"]);
      });
    });

    chrome.storage.local.get("overlay-kit", (result) => {
      setOverlayList(result["overlay-kit"]["overlayList"]);
      setCurrentId(result["overlay-kit"]["currentId"]);
    });
  }, []);

  const isExistOverlayList = overlayList !== null && overlayList.length !== 0;
  const isexistOverlayData = isExistOverlayList || currentId;

  return (
    <div>
      {!isexistOverlayData && <span>Hello world!</span>}
      {currentId && <span>currentId: {currentId}</span>}
      {isExistOverlayList &&
        overlayList.map((item) => (
          <button
            key={item.id}
            style={{ borderColor: item.id === currentId ? "blue" : "" }}
            onClick={async () => {
              const tab = await getCurrentTab();

              if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                  type: "SEND_CUSTOM_EVENT",
                  data: item.id,
                });
              }
            }}>
            <div>{item.id}</div>
            <div>{item.isOpen}</div>
          </button>
        ))}
    </div>
  );
}
