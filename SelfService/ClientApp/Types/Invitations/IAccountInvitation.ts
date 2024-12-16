/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAccountInvitation.ts */

export interface IAccountInvitation {
    email: string;
    firstName: string;
    fullName: string;
    hasAccount: boolean;
    lastName: string;
    personId?: number;
    peopleId: string;
    token?: string;
    userName?: string;
}