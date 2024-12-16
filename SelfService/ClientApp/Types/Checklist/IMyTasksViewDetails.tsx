/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IMyTasksViewDetails.ts */

import { IAvatar } from "../Account/IRelative";

export interface IMyTasksViewDetails {
    academicSession: string;
    academicTerm: string;
    academicYear: string;
    actionName: string;
    actionScheduledId: number;
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    addressLine4: string;
    assignedDate: string;
    assignedTime: string;
    avatar: IAvatar;
    avatarCompleted: IAvatar;
    avatarResp: IAvatar;
    cancelReason: string;
    canceled: boolean;
    city: string;
    completed: boolean;
    completedDate: string;
    country: string;
    difference: number;
    email: string;
    houseNumber: string;
    instruction: string;
    isImpersonate: boolean;
    notes: string;
    officeDesc: string;
    peopleCodeId: string;
    peopleOrgCodeId: string;
    phoneFormat: string;
    phoneNumber: string;
    priority: string;
    required: string;
    scheduleDate: string;
    scheduleTime: string;
    state: string;
    waived: boolean;
    waivedReason: string;
    zipCode: string;
}