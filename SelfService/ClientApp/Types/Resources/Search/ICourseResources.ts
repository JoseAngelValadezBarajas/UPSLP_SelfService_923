/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseResources.ts */

import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ICourseDetailModalResProps } from '../../../Components/Generic/CourseDetailModal';

export interface ICourseResources extends ILayoutResources {
    courseCardResources: ICourseCardResources;
    courseDetailModal: ICourseDetailModalResProps;
    courseSearchOptionsResources: ICourseSearchOptionsResources;
    formatResultsShowing: string;
    lblHeaderTitle: string;
    lblNewSearch: string;
    lblNoResults: string;
    lblPageTitle: string;
    shareSearchCourseLinkModalResources: IShareSearchCourseLinkModalResources;
}

export interface ICourseSearchOptionsResources {
    btnSearch: string;
    lblClassLevel: string;
    lblClearAll: string;
    lblCollege: string;
    lblCourseCode: string;
    lblCreditType: string;
    lblCurriculum: string;
    lblDepartment: string;
    lblFilters: string;
    lblNonTraditional: string;
    lblPopulation: string;
    lblProgram: string;
    lblSelect: string;
    lblShareSearch: string;
    lblSubtype: string;
}

export interface ICourseCardResources {
    formatTitleSection: string;
    formatTitleSectionShort: string;
    lblDescription: string;
    lblFindSections: string;
    lblSubtypes: string;
}

export interface IShareSearchCourseLinkModalResources {
    btnOk: string;
    lblTitle: string;
    lblUrlToShare: string;
}