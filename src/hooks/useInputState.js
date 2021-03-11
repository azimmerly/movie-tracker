import { useState } from "react";

const useInputState = (initialVal = "") => {
  const [value, setValue] = useState(initialVal);
  const update = (e) => setValue(e.target.value);
  const reset = () => setValue("");
  return [value, update, reset];
};

export default useInputState;
