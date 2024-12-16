/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IInstitution.ts */

export interface IInstitution {
    city: string;
    countryDesc: string;
    countryId?: number;
    etsCode: string;
    ficeCode: string;
    name: string;
    stateDesc: string;
    stateProvinceId?: number;
    id: number;
}