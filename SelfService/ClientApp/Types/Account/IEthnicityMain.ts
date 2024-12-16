/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IEthnicityMain.ts */

export interface IEthnicityMain {
    isSelected: boolean;
    ipedsEthnicityId?: number;
    ipedsFederalCategoryId: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    personEthnicityId: number;
    ipedsEthnicityDesc: number;
    ipedsFederalCategoryDesc: number;
}