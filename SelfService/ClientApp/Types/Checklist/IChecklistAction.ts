/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IChecklistAction.ts */

export interface IChecklistAction {
    actionId: string;
    actionName: string;
    actionScheduleId?: number;    
    instruction: string;
    isCanceled?: boolean;
    isRequired: boolean;
    note: string;
    priority: string;
    status?: string;
    reason?: string;
    reasonRequired: boolean;
    reasonSelected: string;    
}