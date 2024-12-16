/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: IFacultyScheduleBySession.ts */

// Types
import { IFacultySchedule } from '@hedtech/powercampus-design-system/types/Faculty/IFacultySchedule';

export interface IFacultyScheduleBySession {
    session: string;
    sessionDesc: string;
    sections: IFacultySchedule[];
}