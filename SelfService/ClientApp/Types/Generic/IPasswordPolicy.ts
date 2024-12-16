/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: IPasswordPolicy.ts */

export interface IPasswordPolicy {
    changePasswordUrl: string
    isLowerCaseRequired: boolean;
    isNumbersRequired: boolean;
    isSpecialCharacterRequired: boolean;
    isUpperCaseRequired: boolean;
    minimumLength: number;
}

export interface IValidatePassword {
    areaName: string;
    password: string;
}

export interface IPasswordPolicyResult {
    passwordValidation: IPasswordPolicyErrors;
    passwordMinLength: number;
    userAccountStatus: IPasswordPolicyErrors;
    status: number;
    userName: string;
}

export enum IPasswordPolicyErrors {
    digits = 0,
    isEmpty = 1,
    lowerCase = 2,
    minLength = 3,
    specialCharacters = 4,
    upperCase = 5,
    newPasswordValid = 6,
    currentPasswordInvalid = 7,
    success = 8,
    unableToDefineUserName = 15,
    userAlreadyExists = 17,
}