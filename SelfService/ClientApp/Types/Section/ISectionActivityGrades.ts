/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ISectionActivityGrades.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';

export interface ISectionActivityGrades {
    activities: IDropDownOption[];
    activityGrade: IActivityGrade;
    activitySelected: IDropDownOption;
    emailSettings: IEmailSettings;
    enableActivityGradeComments: boolean;
    isDateToday: boolean;
    isRestricted: boolean;
    studentsActivityGrade: IStudentActivityGrade[];
}

export interface IActivityGrade {
    description: string;
    dueDate: string;
    gradeDueDate: string;
    isExtraCredit: boolean;
    totalPoints: string;
    totalPointsValue: number;
}

export interface IStudentActivityGrade extends IAvatar {
    assignmentId: number;
    createDate: string;
    earnedPoints: string;
    email: string;
    enteredFullName: string;
    grade: string;
    gradeReceived: string;
    instructorComments: string;
    modifiedFullName: string;
    peopleId: string;
    percentaje: string;
    revisionDate: string;
    studentAssignmentId: number;
    withdrawn: boolean;
    // UI functionality
    checkbox: boolean;
    dateKey: number;
    // UI validations
    earnedPointsModified: boolean;
    earnedPointsInvalid: boolean;
    gradeInvalid: boolean;
    gradeModified: boolean;
    gradeReceivedInvalid: boolean;
    gradeReceivedModified: boolean;
}

export interface IStudentActivityGradeToSave {
    assignmentId: number;
    earnedPoints: number | null;
    grade: string;
    gradeReceived: string;
    instructorComments: string;
    studentAssignmentId: number;
    studentId: number;
}