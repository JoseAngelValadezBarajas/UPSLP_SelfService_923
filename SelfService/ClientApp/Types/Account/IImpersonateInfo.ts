/* Copyright 2022 Ellucian Company L.P. and its affiliates.
 * File: IImpersonateInfo.ts */

import { ImpersonateProcess } from "../Enum/ImpersonateProcess";

export interface IImpersonateInfo {
    personId: number;
    process: ImpersonateProcess;
    tabId?: number;
    viewId?: number;
}