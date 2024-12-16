/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IDashboardNotification.ts */

// Types
import { DashboardMessageType } from './IDashboardMessage';

export interface IDashboardNotification {
    message: string;
    title: string;
    type: DashboardMessageType;
    url: string;
    urlText: string;
}