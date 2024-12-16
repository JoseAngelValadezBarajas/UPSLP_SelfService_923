/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ISectionSearchOption.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

export interface ISectionSearchOption {
    campus: IDropDownOption[];
    classLevels: IDropDownOption[];
    colleges: IDropDownOption[];
    creditTypes: IDropDownOption[];
    curriculums: IDropDownOption[];
    departments: IDropDownOption[];
    endsBy: IDropDownOption[];
    eventTypes: IDropDownOption[];
    generalEducationList: IDropDownOption[];
    hours: IDropDownOption[];
    instructors: IDropDownOption[];
    meetings: IDropDownOption[];
    nontraditionalPrograms: IDropDownOption[];
    periods: IDropDownOption[];
    populations: IDropDownOption[];
    programs: IDropDownOption[];
    sessions: IDropDownOption[];
    status: IDropDownOption[];
    startsFrom: IDropDownOption[];
    subTypes: IDropDownOption[];
}