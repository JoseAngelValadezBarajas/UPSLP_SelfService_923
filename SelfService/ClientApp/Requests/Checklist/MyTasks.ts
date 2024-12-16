/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
* File: MyTasks.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { IChecklistAction } from '../../Types/Checklist/IChecklistAction';
import { IMyTasksDetail } from '../../Types/Checklist/IMyTasksDetial';
import { IChecklistResponsible } from '../../Types/Checklist/IChecklistResponsible';
import { ITask } from '../../Types/Checklist/ITask';
import { IYearTerm } from '../../Types/Periods/IYearTerm';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Functions for requests
const MyTasksRequests = {
    getMyTasks(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getMyTasks.name, '/Checklists/MyTasks', { impersonateInfo }, resolver);
    },
    getMyEditTask(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo, actionScheduleId?: number): void {
        Request.post(this.getMyEditTask.name, '/Checklists/MyEditTask', { impersonateInfo, actionScheduleId }, resolver);
    },
    getMyProcessedTask(startIndex: number,
        length: number,
        resolver: (json: string) => void,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getMyProcessedTask.name,
            '/Checklists/MyTasks/Processed',
            { impersonateInfo, startIndex, length },
            resolver);
    },
    getCancelReasons(resolver: (json: string) => void): void {
        Request.post(this.getCancelReasons.name, '/Checklists/CancelReasons', null, resolver);
    },
    getWaiveReasons(resolver: (json: string) => void): void {
        Request.post(this.getWaiveReasons.name, '/Checklists/WaiveReasons', null, resolver);
    },
    getMyTasksDetails(actionScheduleId: number, resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getMyTasksDetails.name, '/Checklists/MyTasksDetail', { actionScheduleId, impersonateInfo }, resolver);
    },
    getYearTerm(year: string, term: string, resolver: (json: string) => void): void {
        Request.post(this.getYearTerm.name, '/Checklists/YearTermSessions', { year, term }, resolver);
    },
    updateEdit(checklistMyTask: IMyTasksDetail, isImpersonate: boolean, resolver: (json: string) => void): void {
        Request.post(this.updateEdit.name, '/Checklists/SaveEditMyTask', { checklistMyTask, isImpersonate }, resolver);
    },
    updateReasons(checklist: IChecklistAction, resolver: (json: string) => void): void {
        Request.post(this.updateReasons.name, '/Checklists/UpdateReasons', checklist, resolver);
    },
    updateCompletedStatus(checklistMyTask: IMyTasksDetail, resolver: (json: string) => void): void {
        Request.post(this.updateCompletedStatus.name, '/Checklists/UpdateCompletedStatus', checklistMyTask, resolver);
    },
    updateReassign(actionScheduleId: number, personId: number, resolver: (json: string) => void): void {
        Request.post(this.updateReassign.name, '/Checklists/UpdateReassign', { actionScheduleId, personId }, resolver);
    },
    // #region ChecklistTask
    getTemplateOffices(impersonateInfo: IImpersonateInfo, resolver: (json: string) => void): void {
        Request.post(this.getTemplateOffices.name, '/Checklists/Template/Offices', { impersonateInfo }, resolver);
    },
    getTemplateActions(id: number, resolver: (json: string) => void): void {
        Request.post(this.getTemplateActions.name, '/Checklists/Template/Actions', id, resolver);
    },
    getTemplateDetail(checklistResponsible: IChecklistResponsible, resolver: (json: string) => void): void {
        Request.post(this.getTemplateDetail.name, '/Checklists/Template/Detail', checklistResponsible, resolver);
    },
    getSessions(yearTerm: IYearTerm, resolver: (json: string) => void): void {
        Request.post(this.getSessions.name, '/Periods/Checklist/Sessions', yearTerm, resolver);
    },
    postSaveAction(checklist: ITask, resolver: (json: string) => void): void {
        Request.post(this.getSessions.name, '/Checklists/Template/Action', checklist, resolver);
    },
    getContactInformation(personId: number, resolver: (json: string) => void): void {
        Request.post(this.getContactInformation.name, '/Checklists/Template/ContactInformation', personId, resolver);
    },
    // #endregion ChecklistTask
};

// Export object with the requests
export default MyTasksRequests;