/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdvancedSearchAdvising.ts */

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface IAdvancedSearchAdvising {
    advisors?: IDropDownOption[];
    advisorSelected: number;
    campus?: IDropDownOption[];
    campusSelected: number;
    classLevels?: IDropDownOption[];
    classLevelSelected: number;
    classYears?: IDropDownOption[];
    classYearSelected: number;
    colleges?: IDropDownOption[];
    collegeSelected: number;
    curriculums?: IDropDownOption[];
    curriculumSelected: number;
    degrees?: IDropDownOption[];
    degreeSelected: number;
    departments?: IDropDownOption[];
    departmentSelected: number;
    events?: IDropDownOption[];
    eventSelected: number;
    filterSelected: number;
    firstName?: string;
    hasScheduleRequestsClaim: boolean;
    id?: string;
    lastName?: string;
    lastNamePrefix?: string;
    middleName?: string;
    programs?: IDropDownOption[];
    programSelected: number;
    sections?: IDropDownOption[];
    sectionSelected: string;
    sessions?: IDropDownOption[];
    sessionSelected: number;
    status?: IDropDownOption[];
    statusSelected: number;
    subTypes?: IDropDownOption[];
    subTypeSelected: number;
    yearTerms?: IDropDownOption[];
    yearTermSelected: number;
}