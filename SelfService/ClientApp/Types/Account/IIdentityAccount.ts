/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IIdentityAccount.ts */

import { ChangePasswordError } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/ChangePasswordError';

export interface IIdentityAccount {
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    personId?: number;
    peopleId: string;
    token?: string;
}

export interface IIdentityAccountValidations {
    emailInvalid: boolean;
    emailModified: boolean;
    existingUser: boolean;
    firstNameModified: boolean;
    lastNameModified: boolean;
}

export interface IResultSignUp {
    passwordValidation: ChangePasswordError;
    passwordMinLength: number;
    status: number;
    userName: string;
}