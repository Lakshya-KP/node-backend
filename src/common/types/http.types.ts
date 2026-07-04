import { Request } from "express";

export type TypedRequest<
    Body = {},
    Params = {},
    Query = {}
> = Request <
    Params,
    any,
    Body,
    Query
>;