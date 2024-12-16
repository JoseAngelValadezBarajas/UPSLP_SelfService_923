/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ManageAdvisees.ts */

// Types
import { IAdviseeBasicSearch } from '../../Types/Advisees/IAdviseeBasicSearch';
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';
import { IShareAdvisees } from '../../Types/Advisees/IShareAdvisees';
import { AdviseeList } from '../../Types/Enum/AdviseeList';
import { IAdviseeAdvancedSearch } from '../../Types/Advisees/IAdviseeAdvancedSearch';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const ManageAdviseesRequests = {
    getAdvisees(adviseeSearchModel: IAdviseeBasicSearch, resolver: (json: string) => void): void {
        Request.post(this.getAdvisees.name, '/Advisees/BasicSearch', adviseeSearchModel, resolver);
    },
    getAdviseeWarnings(resolver: (json: string) => void, signal: AbortSignal,
        impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getAdviseeWarnings.name, '/Advisees/Warnings', { impersonateInfo }, resolver, signal);
    },
    getProfileClaims(viewId: number, resolver: (json: string) => void): void {
        Request.post(this.getProfileClaims.name, '/Advisees/Profile/Claims', viewId, resolver);
    },
    getAdvancedSearchOptions(view: AdviseeList,
        resolver: (json: string) => void): void {
        Request.post(this.getAdvancedSearchOptions.name, '/Advisees/Search/Options', view, resolver);
    },
    postAdvancedSearch(adviseeAdvancedSearch: IAdviseeAdvancedSearch, resolver: (json: string) => void): void {
        Request.post(this.postAdvancedSearch.name, '/Advisees/Search', adviseeAdvancedSearch, resolver);
    },
    saveSharedAdvisees(shareAdvisees: IShareAdvisees, resolver: (json: string) => void): void {
        Request.post(this.saveSharedAdvisees.name, '/Advisees/Share', shareAdvisees, resolver);
    },
    getAdvisors(id: number, resolver: (json: string) => void): void {
        Request.post(this.getAdvisors.name, '/Advisees/Advisors', id, resolver);
    },
    getClaimSettings(view: AdviseeList, isAuthorizeRegistration: boolean, resolver: (json: string) => void): void {
        Request.post(this.getClaimSettings.name, '/Advisees/ClaimSettings', { view, isAuthorizeRegistration }, resolver);
    },
    removeAdvisees(advisees: number[], resolver: (json: string) => void): void {
        Request.post(this.removeAdvisees.name, '/Advisees/MyShared/Delete', advisees, resolver);
    }
};

// Export object with the requests
export default ManageAdviseesRequests;