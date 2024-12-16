/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IBlockRegistrationRuleHeader.ts */

export interface IBlockRegistrationRuleHeader {
    blockRegistrationRuleId: number;
    isActive: boolean;
    name: string;
    priority: number;
}

export interface IBlockRegistrationRuleHeaders {
    blockRegistrationRuleHeaderList: IBlockRegistrationRuleHeader[];
    overallCount: number;
}