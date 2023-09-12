import { FizzbuzzRequest } from "./fizzbuzz";

export type ErrGetMostUsed = "error retrieving stats" | "no stat set";

export type RequestStat = {
  request: FizzbuzzRequest;
  count: number;
};
