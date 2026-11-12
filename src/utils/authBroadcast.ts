const CHANNEL = "auth";
const AUTH_CHANGED = "auth-changed";

const isSupported = () => typeof BroadcastChannel !== "undefined";

export const broadcastAuthChange = () => {
  if (!isSupported()) {
    return;
  }

  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage(AUTH_CHANGED);
  ch.close();
};

export const listenForAuthChange = (onChange: () => void) => {
  if (!isSupported()) {
    return () => {};
  }

  const ch = new BroadcastChannel(CHANNEL);
  ch.onmessage = ({ data }: MessageEvent) => {
    if (data === AUTH_CHANGED) {
      onChange();
    }
  };
  return () => ch.close();
};
