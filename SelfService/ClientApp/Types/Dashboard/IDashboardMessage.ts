/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IDashboardMessage.ts */

export interface IDashboardMessage {
    endDate: string;
    id: number;
    name: string;
    sort: string;
    startDate: string;
    type: DashboardMessageType;
}

export enum DashboardMessageType {
    Alert = 0,
    Congratulation = 1,
    News = 2,
    Reminder = 3,
    Schedule = 4
}