/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationGroupDetailValidations.ts */

export interface IRegistrationGroupDetailValidations {
    endOffsetModified: boolean;
    endRegistrationDateModified: boolean;
    endRegistrationHourModified: boolean;
    endRegistrationMinuteModified: boolean;
    endRegistrationTypeModified: boolean;
    groupViewNameModified: boolean;
    nameModified: boolean;
    startOffsetModified: boolean;
    startRegistrationDateModified: boolean;
    startRegistrationHourModified: boolean;
    startRegistrationMinuteModified: boolean;
    startRegistrationTypeModified: boolean;
    sortModified: boolean;

    endOffsetInvalid: boolean;
    endRegistrationDateInvalid: boolean;
    endRegistrationDateWarning: boolean;
    endRegistrationDateWarningPre: boolean;
    nameDuplicated: boolean;
    sortDuplicated: boolean;
    sortInvalid: boolean;
    startOffsetInvalid: boolean;
    startRegistrationDateInvalid: boolean;
    startRegistrationDateRangeError: boolean;
    startRegistrationDateWarning: boolean;
    startRegistrationDateWarningPre: boolean;
    startRegistrationTimeRangeError: boolean;
}