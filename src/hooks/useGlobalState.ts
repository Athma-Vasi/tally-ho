import { useContext } from "react";

import { GlobalContext } from "../context/globalProvider/GlobalProvider";
import type { GlobalDispatch } from "../context/globalProvider/dispatches";
import type { GlobalState } from "../context/globalProvider/state";

function useGlobalState(): {
    globalState: GlobalState;
    globalDispatch: React.Dispatch<GlobalDispatch>;
} {
    return useContext(GlobalContext);
}

export { useGlobalState };
