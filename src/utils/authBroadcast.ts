const CHANNEL = "auth";
const SIGN_OUT_EVENT = "signed-out";

export const broadcastSignOut = () => {
  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage({ type: SIGN_OUT_EVENT });
  ch.close();
};

export const listenForSignOut = (onSignOut: () => void) => {
  const ch = new BroadcastChannel(CHANNEL);
  ch.onmessage = ({ data }) => {
    if (data?.type === SIGN_OUT_EVENT) {
      onSignOut();
    }
  };
  return () => ch.close();
};
