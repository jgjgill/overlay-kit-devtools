import { useEffect, useState } from "react";
import { getCurrentTab } from "../helpers/tabs";

type OverlayId = string;

export type OverlayItem = {
  id: OverlayId;
  isOpen: boolean;
};

export default function App() {
  const [overlayList, setOverlayList] = useState<OverlayItem[] | null>(null);

  useEffect(() => {
    chrome.storage.local.get("overlay-kit", (result) => {
      setOverlayList(result["overlay-kit"]);
    });
  }, []);

  const isExistOverlayList = overlayList !== null && overlayList.length !== 0;

  return (
    <h1>
      {!isExistOverlayList && <span>Hello world!</span>}
      {isExistOverlayList &&
        overlayList.map((item) => (
          <button
            key={item.id}
            onClick={async () => {
              const tab = await getCurrentTab();

              if (tab.id) {
                chrome.tabs.sendMessage(tab.id, {
                  type: "SEND_CUSTOM_EVENT",
                  data: item.id,
                });
              }

              setOverlayList((prev) =>
                prev ? prev.filter((prevItem) => prevItem.id !== item.id) : null
              );
            }}>
            <div>{item.id}</div>
            <div>{item.isOpen}</div>
          </button>
        ))}
    </h1>
  );
}
