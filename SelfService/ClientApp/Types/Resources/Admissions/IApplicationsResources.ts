/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IApplicationsResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

export interface IApplicationsResources extends ILayoutResources {
    lblApplications: string;
    lblHeaderTitle: string;
    lblNoResults: string;
    lblPageTitle: string;
    savedApplicationsResources: ISavedApplicationsResources;
    submittedApplicationsResources: ISubmittedApplicationsResources;
}

export interface ISavedApplicationsResources {
    lblAcceptConfirmation: string;
    lblCancelConfirmation: string;
    lblCreated: string;
    lblLastModified: string;
    lblRemove: string;
    lblRemoveConfirmation: string;
    lblSavedApplications: string;
    lblTitle: string;
}

export interface ISubmittedApplicationsResources {
    formatAdmitPeriod: string;
    formatDecisionDate: string;
    formatPeriod: string;
    formatProgramDegreeCurriculum: string;
    formatStatusDate: string;
    lblAdmitPeriod: string;
    lblCollege: string;
    lblCollegeAttendance: string;
    lblDecision: string;
    lblPeriod: string;
    lblReceiptDate: string;
    lblStatus: string;
    lblSubmittedApplications: string;
}