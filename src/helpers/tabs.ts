export async function getCurrentTab() {
  const list = await chrome.tabs.query({ active: true, currentWindow: true });

  return list[0];
}
