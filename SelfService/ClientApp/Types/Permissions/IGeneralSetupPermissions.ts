/* Copyright 2019 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IGeneralSetupPermissions.ts */

export interface IGeneralSetupPermissions {
    dashboardMessages: boolean;
    periodFilters: boolean;
    dossier: boolean;
    checklist: boolean;
}

export enum GeneralSetupTabs {
    DashboardMessages = 1,
    PeriodFilters = 0,
    Dossier = 2,
    Checklist = 3
}