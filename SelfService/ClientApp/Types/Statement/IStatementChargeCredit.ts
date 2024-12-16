/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IStatementChargeCredit.ts */

import { IChargeCredit } from '../Balance/IChargeCredit';

export interface IStatementChargeCredit extends IChargeCredit {
    statementMessage: string;
    lineType: string;
}