/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ICoursesResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IPermissionRequestStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IPermissionRequestStatusResources';
import { IStudentCourseMessagesResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseMessagesResources';
import { IStudentCourseStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseStatusResources';
import { IPeriodLongStatus, IPeriodShortStatus } from '../Shared/IRegistrationPeriodStatus';
import { IRegistrationSummaryModalResources } from '../Generic/IRegistrationSummaryModalResources';

export interface ICoursesResources extends ILayoutResources {
    btnAdvancedSearch: string;
    btnBlockSearch: string;
    btnNewSearch: string;
    btnReadAgreements: string;
    btnSectionSearch: string;
    btnViewRegistrationSummary: string;
    formatNumberOfBlock: string;
    formatNumberOfBlocks: string;
    formatResult: string;
    formatResults: string;
    lblBlockRegistrationInstructions: string;
    lblBlockRegistrationTitle: string;
    lblCartSectionsRemoved: string;
    lblCompleted: string;
    lblCompletedTooltip: string;
    lblHeaderTitle: string;
    lblMessageAgreement: string;
    lblNoAcademicInfo: string;
    lblNoPeriods: string;
    lblNoResults: string;
    lblNoRuleGroups: string;
    lblPageTitle: string;
    lblProcessing: string;
    lblProcessingTooltip: string;
    lblRegistrationSuccess: string;
    lblSearchTitle: string;
    periodLongStatus: IPeriodLongStatus;
    periodShortStatus: IPeriodShortStatus;
    permissionRequestStatus: IPermissionRequestStatusResources;
    registrationSummaryModal: IRegistrationSummaryModalResources;
    studentCourseMessages: IStudentCourseMessagesResources;
    studentCourseStatus: IStudentCourseStatusResources;
}