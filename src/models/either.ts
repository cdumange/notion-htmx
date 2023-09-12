export type Value<T> = {
  value: T;
  error?: never;
};
export function makeValue<T>(value: T): Value<T> {
  return {
    value: value,
  };
}

export type Error<K> = {
  value?: never;
  error: K;
};
export function makeError<K>(error: K): Error<K> {
  return {
    error: error,
  };
}

export type Either<T, U> = NonNullable<Value<T> | Error<U>>;

export function isError<T, K>(either: Either<T, K>): boolean {
  return either.error != undefined;
}

export function isValue<T, K>(either: Either<T, K>): boolean {
  return either.value != undefined;
}

export function eitherValue<T, K>(either: Either<T, K>): T | K {
  if (either.value == null && either.error == null) {
    throw new Error("received an empty either");
  }

  if (isError(either)) {
    return either.error as NonNullable<K>;
  }

  if (isValue(either)) {
    return either.value as NonNullable<T>;
  }

  throw new Error("something weird happened with " + JSON.stringify(either));
}
