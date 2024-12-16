/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: IPasswordChange.ts */

export interface IPasswordChange {
    currentPassword?: string;
    newPassword: string;
    recoveryCode?: string;
    userName?: string;
}
