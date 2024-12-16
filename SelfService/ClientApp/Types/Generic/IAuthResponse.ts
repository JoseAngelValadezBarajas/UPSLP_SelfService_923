/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IAuthResponse.ts */

export interface IAuthResponse {
    attempt: IAuthAttempt;
    status: number;
    success: boolean;
    changePasswordAtNextLogon: boolean;
}

export interface IAuthAttempt {
    remainingAttempts?: number;
    remainingLockedOutTime?: number;
}