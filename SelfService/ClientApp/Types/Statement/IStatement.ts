/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: IStatement.ts */

import { IOrganization } from './IOrganization';
import { IPeople } from './IPeople';
import { IStatementChargeCredit } from './IStatementChargeCredit';

export interface IStatement {
    anticipatedAids: IStatementChargeCredit[];
    anticipatedMessage: string;
    balanceTypeDesc: string;
    charges: IStatementChargeCredit[];
    creditCardTypes: string;
    credits: IStatementChargeCredit[];
    currentBalance: string;
    date: string;
    description: string;
    dueDate: string;
    generalMessage: string;
    lessAnticipatedCredits: string;
    installmentDue: string;
    mailTo: IPeople;
    number: number;
    organization: IOrganization;
    otherAmountDue: string;
    paymentDue: string;
    paymentPlanCharges: IStatementChargeCredit[];
    payplanFlag: string;
    posNegMessage: string;
    previousBalance: string;
    showPreviousBalance: boolean;
    student: IPeople;
    title: string;
    totalAnticipatedAid: string;
    totalCharges: string;
    totalCredits: string;
    type: string;
}