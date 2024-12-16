/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IPeople.ts */

import { IStatementAddress } from './IStatementAddress';

export interface IPeople {
    fullName: string;
    peopleId: string;
    address: IStatementAddress;
}