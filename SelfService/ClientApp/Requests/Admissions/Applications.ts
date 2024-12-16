/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Applications.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { ISavedApplication } from '../../Types/Applications/ISavedApplication';
import { IApplicationForm } from '../../Types/Form/IApplicationForm';

// Functions for requests
const ApplicationsRequests = {
    getValidateCurp(resolver: (json: string) => void, resolveError: (logData: ILogData) => void, curp: string, IdForm: number): void {
        Request.get(this.getValidateCurp.name, `/Applications/GetValidateCurp?curp=${(curp)}&IdForm=${(IdForm)}`, resolver, resolveError);
    },
    // #region ApplicationHandler
    getApplications(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getApplications.name, '/Forms/List', 0 , resolver, resolveError);
    },
    // #endregion

    postDeleteSavedApplication(savedApplicationId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteSavedApplication.name, '/Forms/DeleteSavedApplication',
            savedApplicationId, resolver, resolveError);
    },

    postUpdateSavedApplication(savedApplication: ISavedApplication,
        components: IApplicationForm, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postUpdateSavedApplication.name, '/Forms/UpdateSavedApplication',
            {
                components: components,
                savedApplication: savedApplication
            },
            resolver, resolveError);
    },
    getStatusSettings(resolver: (json: string) => void): void {
        Request.post(this.getStatusSettings.name, '/Settings/ApplicationStatus', null, resolver);
    },
    getSubmittedApplications(resolver: (json: string) => void): void {
        Request.post(this.getSubmittedApplications.name, '/Applications/GetSubmittedApplications', null, resolver);
    },
};

// Export object with the requests
export default ApplicationsRequests;