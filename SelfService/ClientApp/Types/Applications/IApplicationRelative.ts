/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationRelative.ts */
export interface IApplicationRelative {
    applicationId?: number;
    relationPrefix?: number | null;
    relationSuffix?: number | null;
    relationFirstName: string;
    relationMiddleName?: string;
    relationLastNamePrefix?: string;
    relationLastName: string;
    relationType: number;
    attendedInstitution: boolean;
}