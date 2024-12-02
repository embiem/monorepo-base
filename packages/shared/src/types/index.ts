import type * as ApiTypes from "./api";
import type * as AuthTypes from "./auth";
import type * as QueueTypes from "./queue";
import type * as DbTypes from "./db";

// API Namespace
export namespace API {
  export type Response<T> = ApiTypes.ApiResponse<T>;
}

// Auth Namespace
export namespace Auth {
  export type User = AuthTypes.User;
  export type Tokens = AuthTypes.AuthTokens;
  export type Payload = AuthTypes.JWTPayload;
  export type LoginInput = AuthTypes.LoginCredentials;
  export type RegisterInput = AuthTypes.RegisterData;
}

// Queue Namespace
export namespace Queue {
  export type Job = QueueTypes.JobData;
  export type Result = QueueTypes.JobResult;
}

// DB Namespace
export namespace DB {
  export type User = DbTypes.User;
  export type NewUser = DbTypes.NewUser;
}

