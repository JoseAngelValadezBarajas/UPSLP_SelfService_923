/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeClaimSetting.ts */

import { IEmailSettings } from "../InstitutionSettings/IEmailSettings";

export interface IAdviseeClaimSetting {
    emailSettings: IEmailSettings;
    hasAttendanceClaim: boolean;
    hasDossierClaim: boolean;
    hasGradeReportClaim: boolean;
    hasProfileClaim: boolean;
    hasScheduleClaim: boolean;
    hasScheduleRequestsClaim: boolean;
    hasShareClaim: boolean;
}