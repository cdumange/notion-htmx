import {
  FizzbuzzResponse,
  FizzbuzzRequest,
  FizzBuzzErrors,
} from "../../models/fizzbuzz";
import { Either, makeError, makeValue } from "../../models/either";

const MAX_LIMIT = 100000;

export function FizzBuzz(
  input: FizzbuzzRequest,
): Either<FizzbuzzResponse, FizzBuzzErrors> {
  const valid = validateInput(input);
  if (valid != null) {
    return makeError(valid);
  }

  return makeValue(doFizzbuzz(input));
}

function doFizzbuzz(input: FizzbuzzRequest): FizzbuzzResponse {
  const ret: string[] = [];

  for (let n = 1; n <= input.limit; n++) {
    const mod1 = n % input.int1,
      mod2 = n % input.int2;

    if (mod1 == 0 && mod2 == 0) {
      ret.push(input.str1 + input.str2);
      continue;
    }

    if (mod1 == 0) {
      ret.push(input.str1);
      continue;
    }

    if (mod2 == 0) {
      ret.push(input.str2);
      continue;
    }

    ret.push(n.toString());
  }

  return {
    result: ret,
  };
}

function validateInput(input: FizzbuzzRequest): null | FizzBuzzErrors {
  if (input.int1 <= 0 || input.int2 <= 0) {
    return "INTs can't be <= 0";
  }

  if (input.limit > MAX_LIMIT) {
    return "limit is too great";
  }

  return null;
}
