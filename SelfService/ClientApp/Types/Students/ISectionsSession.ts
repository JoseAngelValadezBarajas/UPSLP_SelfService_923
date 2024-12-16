/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ISectionsSession.ts */

// Types
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';

export interface ISectionsSession {
    session: string;
    sessionDesc: string;
    sections?: IStudentSchedule[][];
}