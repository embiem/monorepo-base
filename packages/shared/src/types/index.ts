import type * as ApiTypes from './api';
import type * as AuthTypes from './auth';
import type * as QueueTypes from './queue';
import type * as DbTypes from './db';

// Create namespaces
export namespace API {
  export type Response<T> = ApiTypes.ApiResponse<T>;
}

export namespace Auth {
  export type User = AuthTypes.User;
  export type Tokens = AuthTypes.AuthTokens;
  export type Payload = AuthTypes.JWTPayload;
  export type LoginInput = AuthTypes.LoginCredentials;
  export type RegisterInput = AuthTypes.RegisterData;
}

export namespace Queue {
  export type Job = QueueTypes.JobData;
  export type Result = QueueTypes.JobResult;
}

export namespace DB {
  export type User = DbTypes.User;
  export type NewUser = DbTypes.NewUser;
}