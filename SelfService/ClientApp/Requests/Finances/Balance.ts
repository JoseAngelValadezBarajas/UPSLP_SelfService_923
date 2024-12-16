/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Balance.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Functions for requests
const BalanceRequests = {
    getBalance(yearTermSession: string, option: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void, personId?: number): void {
        Request.post(this.getBalance.name, '/Students/Balance', { yearTermSession, option, personId }, resolver, resolveError);
    },
    getPeriods(resolver: (json: string) => void, resolveError: (logData: ILogData) => void, personId?: number): void {
        Request.get(this.getPeriods.name, `/Periods/BalanceReport/${personId}`, resolver, resolveError);
    },
    getUser(resolver: (json: string) => void, resolveError: (logData: ILogData) => void, personId?: number): void {
        
        Request.get(this.getUser.name, `/Periods/BalanceUser/${personId}`, resolver, resolveError);

    }
};

// Export object with the requests
export default BalanceRequests;