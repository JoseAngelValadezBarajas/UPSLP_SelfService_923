/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IStudentPermissionRequest.ts */

// Types
import { IPermissionRequestInfo } from '@hedtech/powercampus-design-system/types/Student/IPermissionRequestInfo';
import { IStudentEnrollment } from './IStudentEnrollment';

export interface IStudentPermissionRequest extends IStudentEnrollment {
    statusPermisionRequest: number;
    hasOverride: boolean;
    permissionRequestInfo: IPermissionRequestInfo[];
    modified: boolean;
    showChat: boolean;
    statusPermisionRequestBackup: number;
}