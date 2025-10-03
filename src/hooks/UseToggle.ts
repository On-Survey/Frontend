//예시 ) 커스텀 훅
import { useState } from "react";

export function useToggle(initial = false) {
  const [state, setState] = useState(initial);
  const toggle = () => setState((prev) => !prev);
  return { state, toggle };
}
