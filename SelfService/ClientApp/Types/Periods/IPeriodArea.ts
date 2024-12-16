/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPeriodArea.ts */

export interface IArea {
    id: number;
    name: string;
}

export interface IPeriodArea {
    subarea: number;
    areas: IArea[];
}