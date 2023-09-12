import { FizzBuzz, Stats, Either, makeError, makeValue } from "../../models";
import { StatManager } from "./common";

export class InMemoryStatManager implements StatManager {
  private stats: Map<string, Stats.RequestStat>;
  private max: number = 0;
  private maxRequest?: FizzBuzz.FizzbuzzRequest;

  constructor() {
    this.stats = new Map();
  }

  public Increment(request: FizzBuzz.FizzbuzzRequest): Promise<void> {
    const req = JSON.stringify(request);
    let s = this.stats.get(req);
    if (s === undefined) {
      s = {
        request: request,
        count: 0,
      };
    }

    s.count++;

    if (s.count > this.max) {
      this.max = s.count;
      this.maxRequest = s.request;
    }

    this.stats.set(req, s);

    return new Promise((resolve) => {
      resolve();
    });
  }

  public GetStat(
    request: FizzBuzz.FizzbuzzRequest,
  ): Promise<Either<Stats.RequestStat, Stats.ErrGetMostUsed>> {
    return new Promise((resolve) => {
      const s = this.stats.get(JSON.stringify(request));

      if (s === undefined) {
        resolve(makeError("no stat set"));
        return;
      }

      resolve(makeValue(JSON.parse(JSON.stringify(s))));
    });
  }

  public GetMostUsed(): Promise<
    Either<Stats.RequestStat, Stats.ErrGetMostUsed>
  > {
    return new Promise<Either<Stats.RequestStat, Stats.ErrGetMostUsed>>(
      (resolve) => {
        if (this.max == 0 || this.maxRequest === undefined) {
          resolve(makeError("no stat set"));
          return;
        }

        const stat = this.stats.get(JSON.stringify(this.maxRequest));
        resolve(makeValue(JSON.parse(JSON.stringify(stat))));
      },
    );
  }
}
