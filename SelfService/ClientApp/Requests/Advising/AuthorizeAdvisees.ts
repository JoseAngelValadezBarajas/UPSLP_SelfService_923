/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AuthorizeAdvisees.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';
import { IAuthorizeRegistration } from '../../Types/Advisees/IAuthorizeRegistration';

// Functions for requests
const AuthorizeAdviseesRequests = {
    getPeriods(resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.get(this.getPeriods.name, '/Periods/AuthorizeRegistration', resolver, resolveError);
    },
    saveAuthorization(authorizeRegistrations: IAuthorizeRegistration[],
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.saveAuthorization.name,
            '/Advisees/AuthorizeRegistration/Save',
            authorizeRegistrations,
            resolver,
            resolveError
        );
    },
    deleteAuthorization(authorizeRegistrations: IAuthorizeRegistration[],
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.deleteAuthorization.name,
            '/Advisees/AuthorizeRegistration/Delete',
            authorizeRegistrations,
            resolver,
            resolveError
        );
    }
};

// Export object with the requests
export default AuthorizeAdviseesRequests;