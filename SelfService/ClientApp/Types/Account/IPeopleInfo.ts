/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IPeopleInfo.ts */

export interface IPeopleInfo {
    birthDate: string;
    displayName: string;
    email: string;
    firstName: string;
    formerName: string;
    governmentId: string;
    lastName: string;
    lastNamePrefix: string;
    middleName: string;
    nickname: string;
    prefix: string;
    prefixId?: number;
    pronoun: string;
    suffix: string;
    suffixId?: number;
}