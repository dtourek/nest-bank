export type Nullable<T> = T | null;

export interface ITokenUser {
  userId: number;
  username: string;
}

export interface ICommonAuthenticatedRequest {
  user: ITokenUser;
}
