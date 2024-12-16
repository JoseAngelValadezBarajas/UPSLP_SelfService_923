/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IStudentScheduleResources.ts */

import { IPermissionRequestStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IPermissionRequestStatusResources';

export interface IStudentScheduleResources {
    lblContinuingEducation: string;
    lblCoursesCart: string;
    lblDeniedCourses: string;
    lblNoCourses: string;
    lblWaitlistCourses: string;
    permissionRequestStatus: IPermissionRequestStatusResources;
}