const CHANNEL = "auth";
const SIGN_IN_EVENT = "signed-in";
const SIGN_OUT_EVENT = "signed-out";

const broadcast = (type: typeof SIGN_IN_EVENT | typeof SIGN_OUT_EVENT) => {
  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage({ type });
  ch.close();
};

export const broadcastSignIn = () => broadcast(SIGN_IN_EVENT);
export const broadcastSignOut = () => broadcast(SIGN_OUT_EVENT);

export const listenForAuthChange = (onChange: () => void) => {
  const ch = new BroadcastChannel(CHANNEL);
  ch.onmessage = ({ data }: MessageEvent) => {
    if ([SIGN_IN_EVENT, SIGN_OUT_EVENT].includes(data?.type)) {
      onChange();
    }
  };
  return () => ch.close();
};
