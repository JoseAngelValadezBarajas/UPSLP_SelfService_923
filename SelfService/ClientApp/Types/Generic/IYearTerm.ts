/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IYearTerm.ts */

export interface IYearTerm {
    term: string;
    year: number;
}

export interface IYearTermSession extends IYearTerm {
    session: string;
}