import { type JSX } from "react";
import { splitCamelCase } from "../../utils";

type AccessibleSelectInputProps<
    SetValueAction extends string = string,
    Payload extends string = string,
    Dispatch = {
        action: SetValueAction;
        payload: Payload;
    },
> =
    & React.DetailedHTMLProps<
        React.InputHTMLAttributes<HTMLSelectElement>,
        HTMLSelectElement
    >
    & {
        dataOptions: string[];
        dataTestId?: string;
        disableValidationScreenreaderText?: boolean;
        dispatch: React.ActionDispatch<[dispatch: Dispatch]>;
        hideLabel?: boolean;
        name: string;
        setValueAction: SetValueAction;
        value: Payload;
    };

function AccessibleSelectInput<
    SetValueAction extends string = string,
    Payload extends string = string,
    Dispatch = {
        action: SetValueAction;
        payload: Payload;
    },
>(
    props: AccessibleSelectInputProps<
        SetValueAction,
        Payload,
        Dispatch
    >,
) {
    const {
        dataOptions,
        dispatch,
        name,
        dataTestId = `accessible-select-input-${name}`,
        hideLabel = false,
        onChange = () => {},
        onFocus = () => {},
        ref,
        setValueAction,
        value,
        ...nativeSelectProps
    } = props;

    const screenreaderTextId = `${name}-select-input__validation--valid`;
    const { screenreaderTextElement, describedById } =
        createAccessibleTextInputValidation({
            name,
            screenreaderTextId,
            value,
        });

    const labelElement = (
        <label
            className={hideLabel ? "visually-hidden" : ""}
            htmlFor={name}
        >
            {splitCamelCase(name)}
        </label>
    );

    const selectInput = (
        <select
            aria-describedby={describedById}
            data-testid={dataTestId}
            name={name}
            onChange={(
                event: React.ChangeEvent<HTMLSelectElement, Element>,
            ) => {
                dispatch({
                    action: setValueAction,
                    payload: event.currentTarget.value as Payload,
                } as Dispatch);

                onChange?.(event);
            }}
            onFocus={(event: React.FocusEvent<HTMLSelectElement, Element>) => {
                onFocus?.(event);
            }}
            ref={ref}
            value={value}
            {...nativeSelectProps}
        >
            {dataOptions.map((option, index) => (
                <option key={`${option}-${index}`} value={option}>
                    {splitCamelCase(option.split("_").join(" "))}
                </option>
            ))}
        </select>
    );

    return (
        <div className="accessible-select-input">
            {labelElement}
            {selectInput}
            {screenreaderTextElement}
        </div>
    );
}

function createAccessibleTextInputValidation(
    {
        name,
        screenreaderTextId,
        value,
    }: {
        name: string;
        screenreaderTextId: string;
        value: string;
    },
): {
    describedById: string;
    screenreaderTextElement: JSX.Element;
} {
    const validValueElement = (
        <p
            aria-live="polite"
            className={"visually-hidden"}
            id={screenreaderTextId}
        >
            {`You have selected : ${value} for ${name}`}
        </p>
    );

    return {
        describedById: screenreaderTextId,
        screenreaderTextElement: validValueElement,
    };
}

export { AccessibleSelectInput };
