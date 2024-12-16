/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: INotificationsEventsList.ts */

export interface INotificationsEventsList {
    area: number;
    eventCode: string;
    eventDescription: string;
    eventId: number;
    eventName: string;
    eventTypes: string[];
    isActive: boolean;
}