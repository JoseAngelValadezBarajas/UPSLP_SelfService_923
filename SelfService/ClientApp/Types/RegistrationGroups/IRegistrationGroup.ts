/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationGroup.ts */

export interface IRegistrationGroup {
    id: number;
    isActive: boolean;
    isActiveChanged: boolean;
    name: string;
    sort: string;
}