/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: INotifications.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { INotificationsEvents } from './INotificationsEvents';

export interface INotifications {
    notificationApplications: IDropDownOption[];
    notificationAreas: INotificationsEvents[];
}