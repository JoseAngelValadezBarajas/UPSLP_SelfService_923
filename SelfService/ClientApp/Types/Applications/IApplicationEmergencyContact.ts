/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationEmergencyContact.ts */

export interface IApplicationEmergencyContact {
    firstName: string;
    lastName: string;
    lastNamePrefix?: string;
    middleName?: string;
    phoneNumber: string;
    prefixId?: string;
    relationshipId?: string;
    suffixId?: string;
}