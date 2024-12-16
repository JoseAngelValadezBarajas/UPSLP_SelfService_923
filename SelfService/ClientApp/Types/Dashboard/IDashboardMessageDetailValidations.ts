/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IDashboardMessageDetailValidations.ts */

export interface IDashboardMessageDetailValidations {
    endDateModified: boolean;
    endTimeModified: boolean;
    groupViewNameModified: boolean;
    messageModified: boolean;
    nameModified: boolean;
    sortModified: boolean;
    startDateModified: boolean;
    startTimeModified: boolean;
    titleModified: boolean;
    typeModified: boolean;

    endDateInvalid: boolean;
    nameDuplicated: boolean;
    sortDuplicated: boolean;
    sortInvalid: boolean;
    startDateInvalid: boolean;
    startDateRangeError: boolean;
    startTimeRangeError: boolean;
}