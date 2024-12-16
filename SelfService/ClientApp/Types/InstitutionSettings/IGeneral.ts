/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IGeneral.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IGeneral {
    credits: string;
    cultureInfoList: IDropDownOption[];
    currencyCulture: string;
    dateTimeCulture: string;
    numberCulture: string;
    decimalDigits: string;
    decimalSeparator: string;
    governmentIdFormat: string;
    governmentIdMaxLength: number;
    gpa: string;
    groupSeparator: string;
    listOptionViewModel: IDropDownOption[];
    languageList?: IDropDownOption[];
    languageSelected: string;
    negativePattern: string;
    parentCurrencyCulture: string;
    parentDateTimeCulture: string;
    parentNumberCulture: string;
    peopleIdFormat: string;
    positivePattern: string;
    qualityPoints: string;
    showStudentPicture: boolean;
    symbol: string;
    symbolDescription: string;
    uiCulture: string;
}