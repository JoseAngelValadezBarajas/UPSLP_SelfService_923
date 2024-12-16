/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAuthorizeAdviseesList.ts */

import { IAuthorizeAdvisee } from './IAuthorizeAdvisee';

export interface IAuthorizeAdviseesList {
    advisees: IAuthorizeAdvisee[];
    overallCount: number;
}