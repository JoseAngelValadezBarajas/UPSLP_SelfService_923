/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IPersonalInformation.ts */

import { IAddress } from './IAddress';
import { IPeopleInfo } from './IPeopleInfo';
import { IPhone } from './IPhone';

export interface IPersonalInformation {
    address: IAddress;
    people: IPeopleInfo;
    phones: IPhone[];
}

export interface IPersonalInfoValidations {
    addressLine1Modified: boolean;
    addressTypeModified: boolean;
    birthDateInvalid: boolean;
    birthDateModified: boolean;
    cityModified: boolean;
    countryModified: boolean;
    countyModified: boolean;
    dateOfBirth: boolean;
    emailInvalid: boolean;
    emailModified: boolean;
    firstNameModified: boolean;
    governmentIdInvalid: boolean;
    lastNameModified: boolean;
}