import z from "zod";

function capitalizeString(str: string): string {
    const trimmedStr = str.trim();
    return `${trimmedStr.charAt(0).toUpperCase()}${trimmedStr.slice(1)}`;
}

function createOptionSchema<Value extends any>(
    val: Value,
) {
    return z.object({
        none: z.boolean(),
        some: z.boolean(),
        val,
    });
}

export { capitalizeString, createOptionSchema };
