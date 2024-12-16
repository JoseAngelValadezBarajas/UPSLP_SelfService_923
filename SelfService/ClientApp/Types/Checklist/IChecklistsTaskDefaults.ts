/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IChecklistTaskDefaults.ts */

export interface ITaskDefaultOffice {
    officeDesc: string;
    officeId: number;
    actions: ITaskDefault[];

    // UI
    expanded: boolean;
}

export interface ITaskDefault {
    academicTerm: string;
    academicYear: string;
    academicSession: string;
    actionId: string;
    actionName: string;
    checklistTemplateId: number;
    createDate: string;
    isActive: boolean;
    officeId: number;

    // UI
    isSwitchLoading: boolean;
}