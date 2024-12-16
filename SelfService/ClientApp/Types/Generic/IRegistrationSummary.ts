/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: IRegistrationSummary.ts */

import { RegistrationSectionSummaryStatus } from '../Enum/RegistrationSectionSummaryStatus';

export interface IRegistrationSummary {
    blocks: IRegistrationBlockSummary[];
    creationDatetime: string;
    id: number;
    sections: IRegistrationSectionSummary[];
    term: string;
    title: string;
    year: string;
}
export interface IRegistrationSectionSummary {
    eventId: string;
    eventName: string;
    eventSubType: string;
    section: string;
    session: string;
    status: RegistrationSectionSummaryStatus;
    term: string;
    year: string;
}

export interface IRegistrationBlockSummary {
    blockDisplayName: string;
    groupDisplayName: string;
    sections: IRegistrationSectionSummary[];
}