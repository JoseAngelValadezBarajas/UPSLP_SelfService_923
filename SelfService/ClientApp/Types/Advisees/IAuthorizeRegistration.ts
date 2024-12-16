/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAuthorizeRegistration.ts */

export interface IAuthorizeRegistration {
    authorizationRegistrationId?: number;
    personId: number;
    sessionPeriodId: number;
}