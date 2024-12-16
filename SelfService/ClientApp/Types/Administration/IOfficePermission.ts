/* Copyright 2019-2020 Ellucian Company L.P. and its affiliates.
 * File: IOfficePermission.ts */

export interface IOfficePermission {
    canEditTasks: boolean;
    canViewNotes: boolean;
    officeDesc?: string;
    officeId: number;
    staffMemberId?: number;

    //UI
    isSwitchViewNotesLoading?: boolean;
    isSwitchEditTasksLoading?: boolean;
}