/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdviseeSearchCriteria.ts */

export interface IAdviseeSearchCriteria {
    advisorId?: number;
    campus?: number;
    classLevel?: number;
    classYear?: number;
    college?: number;
    curriculum?: number;
    degree?: number;
    department?: number;
    displayName?: string;
    eventId?: number;
    eventSubtype?: number;
    fulltimePartTime?: number;
    lastName?: string;
    lastNamePrefix?: string;
    middleName?: string;
    peopleId?: string;
    program?: number;
    section?: string;
    sessionId?: number;
    termPeriodId?: number;
}