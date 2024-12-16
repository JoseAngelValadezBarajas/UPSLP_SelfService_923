/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ISectionDetail.ts */

import { IAdvisorApprovalInfo } from '@hedtech/powercampus-design-system/types/Student/IAdvisorApprovalInfo';
import { IPermissionRequestInfo } from '@hedtech/powercampus-design-system/types/Student/IPermissionRequestInfo';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ICorequisite } from '../Course/ICorequisite';
import { ICreditType } from '../Course/ICreditType';
import { IPrerequisite } from '../Course/IPrerequisite';
import { ISectionFee } from './ISectionFee';

export interface ISectionDetail extends ISection {
    academicYear: string;
    academicTermDesc: string;
    description: string;
    courseMaterials?: string;
    courseMaterialsUrl?: string;
    isConEd: boolean;
    prerequisiteConditionList: string[];
    prerequisites: IPrerequisite[];
    corequisistes: ICorequisite[];
    sectionFees: ISectionFee[];
    creditTypes: ICreditType[];
    finalGrade: string;
    // UI
    advisorApprovalInfo?: IAdvisorApprovalInfo;
    permissionRequestInfo?: IPermissionRequestInfo[];
    statusPermisionRequest?: number;
}