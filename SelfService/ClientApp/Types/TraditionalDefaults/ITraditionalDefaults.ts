/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ITraditionalDefaults.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface ITraditionalDefaults {
    allowDefaultRegistration: boolean;
    classLevelId: string;
    classLevelViewModelList: IDropDownOption[];
    collegeId: string;
    collegeViewModelList: IDropDownOption[];
    creditLimit: string;
    curriculumId: string;
    curriculumViewModelList: IDropDownOption[];
    degreeId: string;
    degreeViewModelList: IDropDownOption[];
    departmentId: string;
    departmentViewModelList: IDropDownOption[];
    populationId: string;
    populationViewModelList: IDropDownOption[];
    programId: string;
    programViewModelList: IDropDownOption[];
    registrationType: RegistrationType;
    settingId: number;
}

export enum RegistrationType {
    Traditional = 0,
    ContinuingEducation = 1
}