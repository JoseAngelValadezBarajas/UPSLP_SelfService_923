/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IConEdCoursesResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IPermissionRequestStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IPermissionRequestStatusResources';
import { IStudentCourseMessagesResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseMessagesResources';
import { IStudentCourseStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseStatusResources';

export interface IConEdCoursesResources extends ILayoutResources {
    btnCompleteProfile: string;
    btnCreateAccount: string;
    btnReadAgreements: string;
    lblCompleteProfileMessage: string;
    lblCompleteProfileTitle: string;
    lblCreateAccountMessage: string;
    lblCreateAccountTitle: string;
    lblHeaderTitle: string;
    lblMessageAgreement: string;
    lblNoAcademicInfo: string;
    lblNoResults: string;
    lblPageTitle: string;
    lblRegistrationSuccess: string;
    permissionRequestStatus: IPermissionRequestStatusResources;
    studentCourseMessages: IStudentCourseMessagesResources;
    studentCourseStatus: IStudentCourseStatusResources;
}