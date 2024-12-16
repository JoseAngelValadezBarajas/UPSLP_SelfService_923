/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationEducation.ts */
import { IEnrollment } from './IEnrollment';
import { IInstitution } from './IInstitution';

export interface IApplicationEducation {
    institution: IInstitution;
    enrollment: IEnrollment;
}