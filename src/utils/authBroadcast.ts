const CHANNEL = "auth";
const SIGN_IN_EVENT = "signed-in";
const SIGN_OUT_EVENT = "signed-out";
const ACCOUNT_UPDATED_EVENT = "account-updated";

const AUTH_EVENTS = [
  SIGN_IN_EVENT,
  SIGN_OUT_EVENT,
  ACCOUNT_UPDATED_EVENT,
] as const;

const broadcast = (type: (typeof AUTH_EVENTS)[number]) => {
  const ch = new BroadcastChannel(CHANNEL);
  ch.postMessage({ type });
  ch.close();
};

export const broadcastSignIn = () => broadcast(SIGN_IN_EVENT);
export const broadcastSignOut = () => broadcast(SIGN_OUT_EVENT);
export const broadcastAccountUpdate = () => broadcast(ACCOUNT_UPDATED_EVENT);

export const listenForAuthChange = (onChange: () => void) => {
  const ch = new BroadcastChannel(CHANNEL);
  ch.onmessage = ({ data }: MessageEvent) => {
    if (AUTH_EVENTS.includes(data?.type)) {
      onChange();
    }
  };
  return () => ch.close();
};
