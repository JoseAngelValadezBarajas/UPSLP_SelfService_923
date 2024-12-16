/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPeopleAgreements.ts */

export interface IPeopleAgreements {
    peopleAgreementList: IPeopleAgreement[];
    overallCount: number;
}

export interface IPeopleAgreement {
    peopleAgreementId: number;
    academicYear: string;
    academicTerm: string;
    title: string;
    createDatetime: string;
}