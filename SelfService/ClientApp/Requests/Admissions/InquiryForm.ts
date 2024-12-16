/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
* File: InquiryForm.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IInquiry } from '../../Types/Inquiries/IInquiry';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const InquiryFormRequests = {
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
                type: 1
            },
            resolver, resolveError);
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
    getReCaptchaSettings(resolver: (json: string) => void): void {
        Request.post(this.getReCaptchaSettings.name, '/Inquiries/RecaptchaSettings', null, resolver);
    },
    // #endregion

    // #region InquiryForm
    postSubmit(inquiry: IInquiry, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSubmit.name, '/Inquiries/Create', inquiry, resolver, resolveError);
    }
    // #endregion
};

// Export object with the requests
export default InquiryFormRequests;