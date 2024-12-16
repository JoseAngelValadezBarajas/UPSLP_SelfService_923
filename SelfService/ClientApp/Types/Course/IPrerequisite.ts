/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: IPrerequisite.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { ICourseEvent } from './ICourseEvent';
import { ITestScore } from './ITestScore';

export interface IPrerequisite {
    id: number;
    prerequisiteType: string;
    prerequisiteCondition: string;
    course: ICourseEvent;
    instructor: IAvatar;
    testScore: ITestScore;
}