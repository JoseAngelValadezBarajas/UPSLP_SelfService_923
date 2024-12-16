/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ISavedApplication.ts */

import { IApplicationForm } from '../Form/IApplicationForm';

export interface ISavedApplication {
    applicationFormDescription?: string;
    applicationFormName?: string;
    applicationFormSettingId: number;
    createDatetime?: string;
    email: string;
    formLayoutId?: number;
    jsonDetail?: IApplicationForm;
    personId?: number;
    revisionDatetime?: string;
    savedApplicationId?: number;
    token?: string;
}