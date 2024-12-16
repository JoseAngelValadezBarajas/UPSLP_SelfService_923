/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ITaxYearSettingDetail.ts */

// Types
import { ITaxYearSetting } from './ITaxYearSetting';

export interface ITaxYearSettingDetail extends ITaxYearSetting {
    pdfFileName: string;
    xmlFileName: string;
    // UI
    taxYearDuplicated: boolean;
    pdfFileNameModified: boolean;
    taxYearModified: boolean;
    xmlFileNameModified: boolean;
}