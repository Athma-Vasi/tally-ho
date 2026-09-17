import z from "zod";

const data_result_schema = z.object(
    {
        descendantId: z.string(),
        dataResult: z.unknown(),
    },
);

export { data_result_schema };
