/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: People.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const PeopleRequests = {
    getFullName(id: number,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getFullName.name, `/People/FullName/${id}`, resolver, resolveError);
    }
};

// Export object with the requests
export default PeopleRequests;