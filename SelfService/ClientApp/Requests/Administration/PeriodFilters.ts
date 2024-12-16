/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PeriodFilters.ts */

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import Request from '@hedtech/powercampus-design-system/helpers/Request';

// Types
import { ISessionPeriodFilter } from '../../Types/Periods/ISessionPeriodFilter';

// Functions for requests
const PeriodFiltersRequests = {
    getPeriodAreas(resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.get(this.getPeriodAreas.name, '/Periods/Areas', resolver, resolveError);
    },
    postPeriodFilters(id: number, year: string, resolver: (json: string) => void, resolveError: (logData: ILogData) => void): void {
        Request.post(this.postPeriodFilters.name, '/Periods/PeriodFilters', { id, year }, resolver, resolveError);
    },
    postSavePeriodFilter(sessionPeriodFilter: ISessionPeriodFilter,
        resolver: (json: string) => void,
        resolveError: (logData: ILogData) => void): void {
        Request.post(this.postSavePeriodFilter.name, '/Periods/SavePeriodFilter',
            sessionPeriodFilter, resolver, resolveError);
    }
};

// Export object with the requests
export default PeriodFiltersRequests;