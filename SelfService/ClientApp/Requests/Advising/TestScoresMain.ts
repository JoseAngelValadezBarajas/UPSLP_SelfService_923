/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: TestScoresMain.ts */

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Functions for requests
const TestScoresMainRequests = {
    getTestScoresInfo(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo,): void {
        Request.post(this.getTestScoresInfo.name, '/People/TestScores', { impersonateInfo }, resolver);
    }
};

// Export object with the requests
export default TestScoresMainRequests;