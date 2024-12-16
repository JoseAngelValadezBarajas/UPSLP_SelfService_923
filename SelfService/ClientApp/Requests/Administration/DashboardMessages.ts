/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DashboardMessages.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IDashboardMessageDetail } from '../../Types/Dashboard/IDashboardMessageDetail';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const DashboardMessagesRequests = {
    getDashboardMessage(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getDashboardMessage.name, `/DashboardMessages/Details/${id}`, resolver, resolveError);
    },
    getDashboardMessages(startIndex: number, length: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getDashboardMessages.name, `/DashboardMessages/${startIndex}/${length}`, resolver, resolveError);
    },
    getGeneral(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getGeneral.name, '/DashboardMessages/General', resolver, resolveError);
    },
    postDeleteDashboardMessage(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteDashboardMessage.name, '/DashboardMessages/Delete', id, resolver, resolveError);
    },
    postPostSaveDashboardMessage(dashboardMessageDetail: IDashboardMessageDetail, process: boolean, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPostSaveDashboardMessage.name, '/DashboardMessages/Save', { dashboardMessageDetail, process }, resolver, resolveError);
    },
    postPostSaveGeneralMessage(message: string, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPostSaveGeneralMessage.name, '/DashboardMessages/SaveGeneral', message, resolver, resolveError);
    },
    postValidateName(name: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateName.name, '/DashboardMessages/ValidateName', name, resolver, resolveError);
    },
    postValidateSort(sortId: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateSort.name, '/DashboardMessages/ValidateSort', sortId, resolver, resolveError);
    }
};

// Export object with the requests
export default DashboardMessagesRequests;