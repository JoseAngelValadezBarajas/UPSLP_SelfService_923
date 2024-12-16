/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAlertsReport.ts */

import { IAlertReportList } from "./IAlertReportList";

export interface IAlertReport {
    academicSession: string;
    list: IAlertReportList[];
}