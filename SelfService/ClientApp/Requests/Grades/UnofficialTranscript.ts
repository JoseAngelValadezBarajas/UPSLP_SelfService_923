/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: UnofficialTranscript.ts */

// Types
import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const UnofficialTranscriptRequest = {
    getStopList(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getStopList.name, `/People/StopList/`, { impersonateInfo} ,resolver);
    },
    getUnofficialTranscript(resolver: (json: string) => void, impersonateInfo?: IImpersonateInfo): void {
        Request.post(this.getUnofficialTranscript.name, `/Students/UnofficialTranscripts/`, { impersonateInfo } ,resolver);
    }
};
// Export object with the requests
export default UnofficialTranscriptRequest;