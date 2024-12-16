/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IOrganization.ts */

// Types
import { IAddress } from './IAddress';

export interface IOrganization {
    address: IAddress;
    id: number;
    name: string;
}