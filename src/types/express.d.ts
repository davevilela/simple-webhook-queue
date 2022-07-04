/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/prefer-namespace-keyword */
declare module Express {
  export interface Request {
    parsedRawBody?: Buffer;
  }
}
