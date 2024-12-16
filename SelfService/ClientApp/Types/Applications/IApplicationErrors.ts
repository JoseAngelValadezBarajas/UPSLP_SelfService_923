/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationErrors.ts */

export interface IApplicationErrors {
    groupErrors: IGroupErrors[];
    isStepError: boolean;
    stepTitle: string;
}

export interface IGroupErrors {
    groupId: string;
    isGroupError: boolean;
    sectionErrors: ISectionErrors[];
    firstSectionErrors: IFirstSectionErrors;
}

export interface IFirstSectionErrors {
    isFirstSectionErrors: boolean;
    firstFieldsErrors: IFieldErrors[];
}

export interface ISectionErrors {
    isSectionError: boolean;
    sectionIndex: number;
    fieldsErrors: IFieldErrors[];
}

export interface IFieldErrors {
    fieldId: string;
    isFieldError: boolean;
}