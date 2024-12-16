/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IDashboardEvent.ts */

export interface IDashboardEvent {
    academicSession: string;
    academicTerm: string;
    academicYear: string;
    buildingName: string;
    color: number;
    endHour: string;
    endHourValue: string;
    eventId: string;
    eventName: string;
    eventSubType: string;
    eventSubTypeDesc: string;
    floorId: string;
    isStudent: boolean;
    notes: string;
    orgName: string;
    roomId: string;
    roomName: string;
    sectionId: number;
    startHour: string;
    startHourValue: string;

    // UI
    anchorElNotes: any;
    openNotes: boolean;
}