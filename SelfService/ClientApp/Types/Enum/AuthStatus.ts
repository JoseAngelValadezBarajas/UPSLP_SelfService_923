/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: AuthStatus.ts */

export enum AuthStatus {
    None = 0,
    Success = 1,
    InvalidCredentials = 2,
    InvalidPassword = 3,
    NoIdentity = 4,
    InvalidConfiguration = 5,
    NoStoreAssigned = 6,
    Unknown = 7,
    IsLocked = 8
}