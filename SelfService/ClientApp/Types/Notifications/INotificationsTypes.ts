/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: INotificationsTypes.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { INotificationsTypesDetails } from './INotificationsTypesDetail';

export interface INotificationsTypes {
    notificationTypes: IDropDownOption[];
    notificationTypesDetails: INotificationsTypesDetails[];
}