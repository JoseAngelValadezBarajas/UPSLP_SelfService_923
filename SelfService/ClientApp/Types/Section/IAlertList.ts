/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAlertList.ts */

// Types
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { IListOption } from '@hedtech/powercampus-design-system/types/IListOption';
import { ISectionViolation } from './ISectionViolation';

export interface IAlertList {
    createdBy: string;
    createdDate: string;
    emailSettings: IEmailSettings;
    sectionViolations: ISectionViolation[];
    violationTypes: IListOption[];
}