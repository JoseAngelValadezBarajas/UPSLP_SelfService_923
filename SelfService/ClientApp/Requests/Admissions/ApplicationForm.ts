/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
* File: ApplicationForm.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IApplication } from '../../Types/Applications/IApplication';
import { IApplicationAttachment } from '../../Types/Applications/IApplicationAttachment';
import { ISavedApplication } from '../../Types/Applications/ISavedApplication';
import { IApplicationForm } from '../../Types/Form/IApplicationForm';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ApplicationFormRequests = {
    // #region Addresses
    getAddresses(startIndex: number, length: number, zipCode?: string, resolver?: (json: string) => void,
        resolveError?: (logData: ILogData) => void): void {
        Request.post(this.getAddresses.name, '/Address',
            {
                length,
                startIndex,
                zipCode
            },
            resolver, resolveError);
    },
    // #endregion Addresses

    // #region ApplicationHandler
    getComponents(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getComponents.name, '/Forms/Details',
            {
                id: id,
                type: 0
            },
            resolver, resolveError);
    },

    getSavedApplicationComponents(savedApplicationToken: string,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getComponents.name, '/Forms/Saved',
            savedApplicationToken,
            resolver, resolveError);
    },

    postSubmit(application: IApplication,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSubmit.name, '/Applications/Create', application, resolver, resolveError);
    },

    postCreateSavedApplication(savedApplication: ISavedApplication,
        components: IApplicationForm, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postCreateSavedApplication.name,
            '/Applications/CreateSavedApplication',
            {
                components,
                savedApplication
            },
            resolver,
            resolveError);
    },

    postCreateSaveApplicationNotification(urlToSend: string, email: string,
        formApplicationName: string, resolver: (json: string) => void, resolveError: (ILogData: ILogData) => void): void {
        Request.post(this.postCreateSaveApplicationNotification.name,
            '/Applications/CreateSaveApplicationNotification',
            {
                email: email,
                formApplicationName: formApplicationName,
                urlToSend: urlToSend
            },
            resolver,
            resolveError);
    },

    postCreateApplicationAttachment(applicationAttachment: IApplicationAttachment,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postCreateApplicationAttachment.name,
            '/Applications/CreateApplicationAttachment',
            applicationAttachment,
            resolver,
            resolveError);
    },

    postListApplicationAttachments(applicationId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postListApplicationAttachments.name,
            '/Applications/ListApplicationAttachments',
            applicationId,
            resolver,
            resolveError);
    },

    postDeleteApplicationAttachment(attachmentId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postListApplicationAttachments.name,
            '/Applications/DeleteApplicationAttachment',
            attachmentId,
            resolver,
            resolveError);
    },

    getApplicationAttachments(applicationId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getApplicationAttachments.name,
            '/Applications/DeleteApplicationAttachment',
            applicationId,
            resolver,
            resolveError);
    },

    GetApplicationAttachmentTotals(applicationId: number,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.getApplicationAttachments.name,
            '/Applications/GetApplicationAttachmentTotals',
            applicationId,
            resolver,
            resolveError);
    },
    // #endregion

    // #region TestScores
    getChildOptions(url: string, id: number, step: string, group: string, targetId: string, isApplicationForm: boolean,
        resolver: (json: string) => void, resolveError: (logData: ILogData) => void,
        formId?: number): void {
        if (!formId) {
            Request.post(this.getChildOptions.name, `/${url}`, {
                group,
                id,
                step,
                targetId
            }, resolver, resolveError);
        }
        else {
            Request.post(this.getChildOptions.name, `/${url}`, {
                formId,
                group,
                id,
                step,
                targetId,
                isApplicationForm
            }, resolver, resolveError);
        }
    },
    getValidateScoreType(
        applicationId: number,
        test: any,
        group: string,
        componentId: string,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getValidateScoreType.name,
            '/TestScores/ScoreType',
            { formId: applicationId, testId: test, group, componentId },
            resolver,
            resolveError);
    },
    // #endregion

    // #region Institutions
    getCountries(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getCountries.name, '/Institutions/Countries', resolver, resolveError);
    },
    getStates(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getCountries.name, '/Institutions/States', resolver, resolveError);
    },
    getInstitutions(startIndex: number, length: number, institutionName?: string, etsCode?: string,
        city?: string, stateId?: number, countryId?: number, resolver?: (json: string) => void,
        resolveError?: (logData: ILogData) => void): void {
        Request.post(this.getInstitutions.name, '/Institutions',
            {
                length,
                startIndex,
                institution: {
                    city,
                    countryId,
                    etsCode,
                    name: institutionName,
                    stateProvinceId: stateId
                }
            },
            resolver, resolveError);
    },
    // #endregion

    // #region Settings
    getGeneralSettings(resolver: (json: string) => void): void {
        Request.get(this.getGeneralSettings.name, '/Settings/General', resolver);
    },
    getReCaptchaSettings(resolver: (json: string) => void): void {
        Request.post(this.getReCaptchaSettings.name, '/Applications/RecaptchaSettings', null, resolver);
    },
    // #endregion Settings

};

// Export object with the requests
export default ApplicationFormRequests;