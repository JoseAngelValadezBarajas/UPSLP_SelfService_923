/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IDashboardMessageDetail.ts */

// Types
import { IDashboardMessage } from './IDashboardMessage';

export interface IDashboardMessageDetail extends IDashboardMessage {
    endDate: string;
    endTime: string;
    groupViewName: string;
    message: string;
    startDate: string;
    startTime: string;
    title: string;
    url: string;
    urlText: string;
    // UI validations
    nameOriginal: string;
    sortOriginal: string;
}