/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationGroups.ts */

// Types
import { IRegistrationGroup } from './IRegistrationGroup';

export interface IRegistrationGroups {
    overallCount: number;
    registrationGroupList: IRegistrationGroup[];
}