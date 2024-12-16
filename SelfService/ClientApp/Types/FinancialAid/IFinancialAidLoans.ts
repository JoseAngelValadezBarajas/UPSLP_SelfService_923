/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: IFinancialAidLoans.ts */

export interface IFinancialAidLoans {
    applicationReceived: string;
    interestRate: string;
    lenderApprovedDate: string;
    lenderName: string;
    loanIdentifier: string;
    loanRequested: string;
    periodBeginDate: string;
    periodEndDate: string;
    signatureDate: string;
    status: string;
}