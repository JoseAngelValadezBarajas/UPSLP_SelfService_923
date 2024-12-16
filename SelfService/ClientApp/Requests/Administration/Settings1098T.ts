/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Settings1098TRequests.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { AgreementStatus, IAgreement } from '../../Types/Agreements/IAgreement';
import { ITaxYearSettingDetail } from '../../Types/TaxYearSetting/ITaxYearSettingDetail';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const Settings1098TRequests = {
    getAgreementForm1098T(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getAgreementForm1098T.name, '/Agreements/DetailsForm1098T', resolver, resolveError);
    },
    getTaxYearSetting(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getTaxYearSetting.name, `/TaxYearSettings/Details/${id}`, resolver, resolveError);
    },
    getTaxYearSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getTaxYearSettings.name, '/TaxYearSettings', resolver, resolveError);
    },
    postDeleteTaxYearSetting(id: number, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postDeleteTaxYearSetting.name, '/TaxYearSettings/Delete', id, resolver, resolveError);
    },
    postSaveAgreementForm1098T(agreementDetail: IAgreement,
        status: AgreementStatus,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        agreementDetail.status = status;
        Request.post(this.postSaveAgreementForm1098T.name, '/Agreements/SaveForm1098T', agreementDetail, resolver, resolveError);
    },
    postSaveTaxYearSetting(taxYearSettingDetail: ITaxYearSettingDetail, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveTaxYearSetting.name, '/TaxYearSettings/Save', taxYearSettingDetail, resolver, resolveError);
    },
    postPostStatusAgreementForm1098T(id: number, status: AgreementStatus,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPostStatusAgreementForm1098T.name, '/Agreements/StatusForm1098T', { id, status }, resolver, resolveError);
    },
    postValidateTaxYear(taxYear: string, resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postValidateTaxYear.name, '/TaxYearSettings/ValidateTaxYear', taxYear, resolver, resolveError);
    }
};

// Export object with the requests
export default Settings1098TRequests;