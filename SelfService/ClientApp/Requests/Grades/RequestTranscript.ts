/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: RequestTranscript.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IRequestTranscript } from '../../Types/Grades/IRequestTranscript';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

const RequestTranscriptRequests = {
    getRequestOptions(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.getRequestOptions.name, '/RequestTranscript', null, resolver, resolveError);
    },
    createTranscriptRequest(requestTranscripts: IRequestTranscript[], resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.createTranscriptRequest.name, '/RequestTranscript/Create', requestTranscripts, resolver, resolveError);
    }
};

// Export object with the requests
export default RequestTranscriptRequests;