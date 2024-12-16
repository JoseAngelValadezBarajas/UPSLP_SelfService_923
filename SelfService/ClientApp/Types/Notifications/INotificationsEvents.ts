/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: INotificationsEvents.ts */

import { INotificationsEventsList } from './INotificationsEventsList';

export interface INotificationsEvents {
    area: number;
    notificationEvents: INotificationsEventsList[];

    // UI
    areaName?: string;
}