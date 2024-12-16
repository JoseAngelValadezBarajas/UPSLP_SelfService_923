/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ChecklistSetup.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { ITask } from '../../Types/Checklist/ITask';
import { IYearTerm } from '../../Types/Periods/IYearTerm';

// Functions for requests
const ChecklistSetup = {
    getOptions(resolver: (json: string) => void): void {
        Request.get(this.getOptions.name, '/Settings/Checklist', resolver);
    },
    saveOptions(showSummaryDashboard, thresholdDays, startDate, resolver: (json: string) => void): void {
        Request.post(this.saveOptions.name, '/Settings/Checklist/Save', { showSummaryDashboard, thresholdDays, startDate }, resolver);
    },
    getChecklistOptions(resolver: (json: string) => void): void {
        Request.post(this.getChecklistOptions.name, '/Checklists', null, resolver);
    },
    getActions(id: number, resolver: (json: string) => void): void {
        Request.post(this.getActions.name, '/Checklists/Actions', id, resolver);
    },
    postSaveChecklist(checklist: ITask, resolver: (json: string) => void): void {
        Request.post(this.postSaveChecklist.name, '/Checklists/Save', checklist, resolver);
    },
    getSessions(yearTerm: IYearTerm, resolver: (json: string) => void): void {
        Request.post(this.getSessions.name, '/Periods/Checklist/Sessions', yearTerm, resolver);
    },
    postTaskDefaultStatus(id: number, isActive: boolean, resolver: (json: string) => void): void {
        Request.post(this.postTaskDefaultStatus.name, '/Checklists/Status', { id, isActive }, resolver);
    },
    postTaskDetails(id: number, resolver: (json: string) => void): void {
        Request.post(this.postTaskDetails.name, '/Checklists/Details', id, resolver);
    },
    deleteTaskDefault(checklistTemplateId: number, resolver: (json: string) => void): void {
        Request.post(this.deleteTaskDefault.name, '/Checklists/Delete', checklistTemplateId, resolver);
    }
};

// Export object with the requests
export default ChecklistSetup;