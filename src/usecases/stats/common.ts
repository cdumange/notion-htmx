import { ErrGetMostUsed, RequestStat } from "../../models/Stats";
import { Either } from "../../models/either";
import { FizzbuzzRequest } from "../../models/fizzbuzz";

export interface StatManager {
  Increment(request: FizzbuzzRequest): Promise<void>;
  GetMostUsed(): Promise<Either<RequestStat, ErrGetMostUsed>>;
}
