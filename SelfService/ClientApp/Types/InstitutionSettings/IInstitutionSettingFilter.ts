/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IInstitutionSettingFilter.ts */

export interface IInstitutionSettingFilter {
    description: string;
    id: string;
    isActive: boolean;
    isInclude: boolean;
}

export enum InstitutionSettingFilterType {
    Address = 0,
    PhoneNumber = 1,
    Violation = 3,
    Campaign = 4
}