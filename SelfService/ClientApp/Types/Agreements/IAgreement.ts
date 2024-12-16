/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAgreement.ts */

export interface IAgreement {
    id: number;
    name: string;
    status: AgreementStatus;
    title: string;
}

export enum AgreementStatus {
    Active = 0,
    Publish = 1,
    Inactive = 2
}