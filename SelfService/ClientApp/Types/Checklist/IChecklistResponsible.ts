/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: IChecklistResponsible.ts */

import { IImpersonateInfo } from '../../Types/Account/IImpersonateInfo';

export interface IChecklistResponsible {
    actionId: string;
    impersonateInfo?: IImpersonateInfo;
    officeId: number;
}