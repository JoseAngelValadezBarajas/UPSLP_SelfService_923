/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IManageAdvisee.ts */

import { IAdvisee } from './IAdvisee';
import { IAdviseeWarning } from './IAdviseeWarning';

export interface IManageAdvisee extends IAdvisee {
    warnings: IAdviseeWarning;
    hasPendingSchedules: boolean;
    isSharedAdvisee: boolean;
}