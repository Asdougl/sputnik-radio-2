export type OkResult<T> = {
  ok: true;
  result: T;
};

export type ErrResult = {
  ok?: false;
  error: string;
};

export type Result<T> = OkResult<T> | ErrResult;
