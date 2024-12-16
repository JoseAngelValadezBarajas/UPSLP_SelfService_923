/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ISectionOverallGradeList.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../InstitutionSettings/IEmailSettings';
import { IOverallGradeList } from './IOverallGradeList';
import { ISectionOverallGradesAssignment } from './ISectionOverallGradesAssignment';

export interface ISectionOverallGradeList {
    assignmentDepartment: ISectionOverallGradesAssignment;
    emailSettings: IEmailSettings;
    gradeChangeReasons: IDropDownOption[];
    isChangeGradeDepartment: boolean;
    isChangeGradeFaculty: boolean;
    isFinaltermOpen: boolean;
    isMidtermOpen: boolean;
    isSubmit: boolean;
    overallGradeList: IOverallGradeList[];
    showFinaltermApply: boolean;
    showFinaltermCalculatedScore: boolean;
    showMidtermApply: boolean;
    showMidtermCalculatedScore: boolean;
    showMidtermGrade: boolean;
    showProjectedGrade: boolean;
    submitType: number;
}