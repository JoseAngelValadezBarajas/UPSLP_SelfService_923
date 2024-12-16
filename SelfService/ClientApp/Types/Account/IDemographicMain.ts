/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IDemographicMain.ts */

import { IDemographicList } from './IDemographicList';

export interface IDemographicMain {
    allowChange: true;
    demographicFormId: number;
    editedDemographicViewModelList: IDemographicList[];
    demographicViewModelList: IDemographicList[];
    hasPending: boolean;
}