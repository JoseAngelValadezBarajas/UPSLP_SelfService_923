/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IOrganization.ts */

// Types
import { IStatementAddress } from './IStatementAddress';

export interface IOrganization {
    name: string;
    address: IStatementAddress;
}