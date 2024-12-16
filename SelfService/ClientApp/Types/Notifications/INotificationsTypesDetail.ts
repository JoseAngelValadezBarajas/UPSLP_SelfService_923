/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: INotificationsTypesDetails.ts */

import { INotificationsTypesDetailsList } from './INotificationsTypesDetailsList';

export interface INotificationsTypesDetails {
    notificationTemplate: INotificationsTypesDetailsList[];
    typeCode: string;
}