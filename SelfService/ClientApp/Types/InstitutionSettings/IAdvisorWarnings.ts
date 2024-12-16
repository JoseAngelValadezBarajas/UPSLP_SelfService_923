/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdvisorWarnings.ts */

// Types
import { IListOption } from '@hedtech/powercampus-design-system/types/IListOption';
import { IInstitutionSettingFilter } from './IInstitutionSettingFilter';

export interface IAdvisorWarnings {
    excusedAbsences?: number;
    excusedTardiness?: number;
    creditTypes: ICreditType[];
    showAttendance: boolean;
    showGrades: boolean;
    showViolations: boolean;
    unexcusedAbsences?: number;
    unexcusedTardiness?: number;
    violations: IInstitutionSettingFilter[];
}

export interface ICreditType extends IListOption {
    grades: IListOption[];
}