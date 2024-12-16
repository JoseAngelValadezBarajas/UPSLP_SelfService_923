/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: ITask.ts */

import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IResponsibleDetail } from '../../Components/Checklist/MyTasks/IResponsibleDetail';
import { IImpersonateInfo } from '../Account/IImpersonateInfo';

export interface ITask {
    academicSession?: string;
    academicTerm?: string;
    academicYear?: string;
    actionId?: string;
    actionScheduleId?: number;
    checklistTemplateId?: number;
    dueDate: string;
    option?: number;
    dueTime: string;
    impersonateInfo?: IImpersonateInfo;
    instruction: string;
    isActive?: boolean;
    isRequired: boolean;
    note: string;
    officeId?: number;
    offsetDays?: number;
    personId?: number;
    priority: string;
    responsible?: IAvatar;
    responsibleDetail?: IResponsibleDetail;
    responsibleId?: number;
    yearTermSelected?: string;

    // UI
    actionModified: boolean;
    actionInvalid: boolean;
    dateKey?: number;
    dueDateInvalid: boolean;
    dueDateModified: boolean;
    officeModified: boolean;
    offsetDaysModified: boolean;
    offsetDaysInvalid: boolean;
    optionModified: boolean;
    priorityInvalid: boolean;
    priorityModified: boolean;
    status?: TaskStatus;
    timeModified: boolean;
}

export enum TaskStatus {
    later,
    overdue,
    processed,
    today,
    upcoming
}