/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IConEdDefaults.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IConEdDefaults {
    applicationDecision: string;
    applicationDecisionViewModelList: IDropDownOption[];
    applicationStatus: string;
    applicationStatusViewModelList: IDropDownOption[];
    classLevelId: string;
    classLevelViewModelList: IDropDownOption[];
    collegeId: string;
    collegeViewModelList: IDropDownOption[];
    curriculumId: string;
    curriculumViewModelList: IDropDownOption[];
    degreeId: string;
    degreeViewModelList: IDropDownOption[];
    departmentId: string;
    departmentViewModelList: IDropDownOption[];
    nonTradProgramId: string;
    nonTradProgramViewModelList: IDropDownOption[];
    populationId: string;
    populationViewModelList: IDropDownOption[];
    programId: string;
    programViewModelList: IDropDownOption[];
    registrationType: RegistrationType;
}

export enum RegistrationType {
    Traditional = 0,
    ContinuingEducation = 1
}