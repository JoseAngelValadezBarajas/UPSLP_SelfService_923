/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IDemographicList.ts */

export interface IDemographicList {
    description: string;
    firstLoad: boolean;
    id: string;
    isDifferent: boolean;
    isRequired: boolean;
    pendingDescription: string;
    value: number;
}