/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: ICourseMaterialsSettings.ts */

export interface ICourseMaterialsSettings {
    url: string;
    textToDisplay: string;

    //UI Validations
    urlIsValid?: boolean;
    textToDisplayIsValid?: boolean;
}