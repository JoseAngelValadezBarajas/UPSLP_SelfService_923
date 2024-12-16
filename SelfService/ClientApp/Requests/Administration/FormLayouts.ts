/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FormLayouts.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IApplicationSettings } from '../../Types/Applications/IApplicationSettings';
import { IApplicationStatus } from '../../Types/Form/IApplicationStatus';

import { IAppSetupForm } from '../../Types/Form/IAppSetupForm';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const FormLayoutsRequests = {
    getApplicationFormLayouts(startIndex: number, length: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getApplicationFormLayouts.name,
            '/FormLayouts',
            {
                length: length,
                startIndex: startIndex,
                type: 0
            }, resolver, resolveError);
    },
    getFormLayoutDefault(type: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getFormLayoutDefault.name,
            '/FormLayouts/Default', type, resolver, resolveError);
    },
    getFormLayoutDetails(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getFormLayoutDetails.name,
            '/FormLayouts/Details', id, resolver, resolveError);
    },
    postSaveLayout(appSetupFormLayout: IAppSetupForm, formType: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveLayout.name, '/FormLayouts/Save',
            {
                appSetupFormLayout,
                formType
            },
            resolver, resolveError);
    },
    postLayoutNameExists(name: string, type: number,
        resolver: (json: string) => void,
        resolverError: (logData: ILogData) => void): void {
        Request.post(this.postLayoutNameExists.name,
            '/FormLayouts/Exists',
            {
                name: name,
                type: type
            }, resolver, resolverError);
    },
    getCountries(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getCountries.name,
            '/CodeTables/Country', resolver, resolveError);
    },
    getCounties(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getCountries.name,
            '/CodeTables/County', resolver, resolveError);
    },
    getStateProvinces(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getCountries.name,
            '/CodeTables/StateProvince', resolver, resolveError);
    },
    getPrograms(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getCountries.name,
            '/CodeTables/ProgramOfStudy', resolver, resolveError);
    },
    getInquiryFormLayouts(startIndex: number, length: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(
            this.getApplicationFormLayouts.name,
            '/FormLayouts',
            {
                length: length,
                startIndex: startIndex,
                type: 1
            }, resolver, resolveError);
    },
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/Application', null, resolver, resolveError);
    },
    getStatusSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getSettings.name, '/Settings/ApplicationStatus', null, resolver, resolveError);
    },
    postSaveSettings(application: IApplicationSettings, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/Application/Save', application, resolver, resolveError);
    },
    postSaveStatusSettings(applicationStatus: IApplicationStatus, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveStatusSettings.name, '/Settings/ApplicationStatus/Save', applicationStatus, resolver, resolveError);
    }
};

// Export object with the requests
export default FormLayoutsRequests;