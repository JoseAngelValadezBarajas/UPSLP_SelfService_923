/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IEmergencyContactSettings.ts */

export interface IEmergencyContactSettings {
    allowEdit: boolean;
    country: EmergencyContactSettingStatus;
    email: EmergencyContactSettingStatus;
    notes: EmergencyContactSettingStatus;
    primaryRequired: boolean;
    secondaryRequired: boolean;
    // UI
    isAllRequired: boolean;
    isAllVisible: boolean;
    isSomeRequired: boolean;
    isSomeVisible: boolean;
}

export enum EmergencyContactSettingStatus {
    None = '0',
    Visible = '1',
    Required = '2'
}