import ErrorSuspenseHOC from "../../components/error";
import { GlobalProvider } from "./GlobalProvider.tsx";
import { initialGlobalState } from "./state.ts";

function GlobalProviderSuspenseBoundary() {
    // const GlobalProvider = React.lazy(() => import("./GlobalProvider.tsx"));
    return ErrorSuspenseHOC(GlobalProvider)(initialGlobalState);
}

export { GlobalProviderSuspenseBoundary };
