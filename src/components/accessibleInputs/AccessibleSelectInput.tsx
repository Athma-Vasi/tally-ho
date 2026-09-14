import { type JSX } from "react";

type AccessibleSelectInputAttributes<
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
        dataTestId?: string;
        disableValidationScreenreaderText?: boolean;
        dispatch: React.ActionDispatch<[dispatch: Dispatch]>;
        name: string;
        setValueAction: SetValueAction;
        value: Payload;
    };

type AccessibleSelectInputProps<
    SetValueAction extends string = string,
    Payload extends string = string,
    Dispatch = {
        action: SetValueAction;
        payload: Payload;
    },
> = {
    attributes: AccessibleSelectInputAttributes<
        SetValueAction,
        Payload,
        Dispatch
    >;
};

function AccessibleSelectInput<
    SetValueAction extends string = string,
    Payload extends string = string,
    Dispatch = {
        action: SetValueAction;
        payload: Payload;
    },
>(
    { attributes }: AccessibleSelectInputProps<
        SetValueAction,
        Payload,
        Dispatch
    >,
) {
    const {
        name,
        dispatch,
        dataTestId = `accessible-select-input-${name}`,
        onChange = () => {},
        onFocus = () => {},
        ref,
        setValueAction,
        value,
        ...nativeSelectProps
    } = attributes;

    const screenreaderTextId = `${name}-select-input__validation--valid`;
    const { screenreaderTextElement, describedById } =
        createAccessibleTextInputValidation({
            name,
            screenreaderTextId,
            value,
        });

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
        />
    );

    return (
        <div className="accessible-input">
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
export type { AccessibleSelectInputAttributes, AccessibleSelectInputProps };
