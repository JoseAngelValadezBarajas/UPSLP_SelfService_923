/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IAlertReportList.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

export interface IAlertReportList {
    academicSession?: string;
    academicTerm?: number;
    academicYear?: number;
    avatar?: IAvatar;
    creditTypeDesc?: string;
    dateEdited?: string;
    description?: string;
    eventId?: string;
    eventName?: string;
    eventSubType?: string;
    eventSubTypeDesc?: string;
    eventTypeDesc?: string;
    hasPostedGrades?: boolean;
    period?: string;
    section?: string;
    sectionId: number;
    sessionDesc?: string;
    violationCategoryDesc?: string;
    violationDate?: string;
    violationDesc?: string;
}