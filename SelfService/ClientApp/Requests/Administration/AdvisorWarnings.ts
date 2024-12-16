/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AdvisorWarnings.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAdvisorWarningsSave } from '../../Types/InstitutionSettings/IAdvisorWarningsSave';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const AdvisorWarningsRequests = {
    getSettings(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getSettings.name, '/Settings/AdvisorWarnings', resolver, resolveError);
    },
    postSaveSettings(advisorWarnings: IAdvisorWarningsSave, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSaveSettings.name, '/Settings/AdvisorWarnings', advisorWarnings, resolver, resolveError);
    }
};

// Export object with the requests
export default AdvisorWarningsRequests;