/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IDashboardMessages.ts */

// Types
import { IDashboardMessage } from './IDashboardMessage';

export interface IDashboardMessages {
    overallCount: number;
    dashboardMessageList: IDashboardMessage[];
}