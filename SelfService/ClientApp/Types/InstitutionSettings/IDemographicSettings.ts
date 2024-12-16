/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: IDemographicSettings.ts */

export interface IDemographicSettings {
    allowChange: boolean;
    countryOfBirth: DemographicSettingsStatus;
    ethnicity: DemographicSettingsStatus;
    gender: DemographicSettingsStatus;
    maritalStatus: DemographicSettingsStatus;
    monthsInCountry: DemographicSettingsStatus;
    primaryCitizenship: DemographicSettingsStatus;
    primaryLanguage: DemographicSettingsStatus;
    religion: DemographicSettingsStatus;
    requireApproval: boolean;
    retirementStatus: DemographicSettingsStatus;
    secondaryCitizenship: DemographicSettingsStatus;
    secondaryLanguage: DemographicSettingsStatus;
    veteranStatus: DemographicSettingsStatus;
    visa: DemographicSettingsStatus;
    // UI
    isAllRequired: boolean;
    isAllVisible: boolean;
    isSomeRequired: boolean;
    isSomeVisible: boolean;
}

export enum DemographicSettingsStatus {
    None = '0',
    Visible = '1',
    Required = '2'
}