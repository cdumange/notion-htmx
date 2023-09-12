import { Either } from "../../models";
import { RequestStat, ErrGetMostUsed } from "../../models/Stats";
import { FizzbuzzRequest } from "../../models/fizzbuzz";
import { FizzStatsRepository } from "../../repositories/FizzStats";
import { StatManager } from "./common";

export class DBStatManager implements StatManager {
  private readonly db: FizzStatsRepository;
  constructor(dbRepo: FizzStatsRepository) {
    this.db = dbRepo;
  }

  Increment(request: FizzbuzzRequest): Promise<void> {
    return this.db.UpsertRequest({
      request: request,
      count: 1,
    });
  }

  GetMostUsed(): Promise<Either<RequestStat, ErrGetMostUsed>> {
    return this.db.GetMostUsed();
  }
}
