/* Copyright 2021 - 2023 Ellucian Company L.P. and its affiliates.
 * File: IFacultySchedule.ts */

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

export interface IFacultySchedule extends ISection {
    creditType: string;
    creditTypeDescription: string;
    instructorsCount: number;
    schedulesCount: number;
}