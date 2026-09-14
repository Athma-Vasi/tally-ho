import ErrorSuspenseHOC from "../../error";
import TransactionForm from "./TransactionForm.tsx";
import { initialTransactionFormState } from "./state.ts";

function TransactionFormSuspenseBoundary() {
    // const TransactionForm = React.lazy(() => import("./TransactionForm.tsx"));
    return ErrorSuspenseHOC(TransactionForm)(initialTransactionFormState);
}

export { TransactionFormSuspenseBoundary };
