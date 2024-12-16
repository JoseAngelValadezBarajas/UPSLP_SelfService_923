/* Copyright 2019 Ellucian Company L.P. and its affiliates.
* File: EthnicityMain.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IEthnicity } from '../../Types/Account/IEthnicity';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const EthnicityMainRequests = {
    getEthnicityInfo(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getEthnicityInfo.name, '/People/Ethnicity', resolver, resolveError);
    },
    postEthnicty(
        ethnicityInfo: IEthnicity[],
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postEthnicty.name, '/People/Ethnicity', ethnicityInfo, resolver, resolveError);
    }
};

// Export object with the requests
export default EthnicityMainRequests;