/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: EmailProviderOption.ts */

export enum EmailProviderOption {
    External = 0,
    SelfService = 1
}

export enum Sender {
    SystemAdministrator = 1,
    LoggedInUser = 2,
    TypeEmailAddress = 3
}