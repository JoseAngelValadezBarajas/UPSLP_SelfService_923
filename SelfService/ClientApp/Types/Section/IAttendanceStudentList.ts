/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAttendanceStudentList.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IAttendanceStudentList extends IAvatar {
    checkbox: boolean;
    dateKey: number;
    isInvalidDate: boolean;
    email: string;
    excusedAbsence: number;
    excusedTardiness: number;
    id: number;
    isModified: boolean;
    lastAttendedDate: string;
    overallAtendanceId: number;
    overallAtendanceSelected: number;
    peopleId: string;
    sectionAttendanceId: number;
    unexcusedAbsence: number;
    unexcusedTardiness: number;
    withdrawn: boolean;
}