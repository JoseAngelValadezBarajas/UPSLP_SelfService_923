/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: INotificationsEventsDetails.ts */

import { INotificationsTokenGroupDetail } from './INotificationsTokenGroupDetail';

export interface INotificationsEventsDetails {
    area: number;
    eventCode: string;
    eventDescription: string;
    eventId: number;
    eventName: string;
    eventTypes: string[];
    isActive: boolean;
    tokenGroupDetail: INotificationsTokenGroupDetail[];
}