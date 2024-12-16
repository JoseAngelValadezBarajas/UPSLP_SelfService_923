/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationPermissions.ts */

export interface IBlockRegistrationPermissions {
    blocks: boolean;
    rules: boolean;
}

export enum BlockRegistrationOptions {
    Blocks = 0,
    Rules = 1
}