/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAuthorizeAdvisee.ts */

import { IAdvisee } from './IAdvisee';

export interface IAuthorizeAdvisee extends IAdvisee {
    registrationAuthorizationId?: number;
    isApproved: boolean;
}