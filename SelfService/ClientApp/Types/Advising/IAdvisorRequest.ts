/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IAdvisorRequest.ts */

// Imports
import { IApprovalRequest } from './IApprovalRequest';

export interface IAdvisorRequest {
    awaitingDropList: ISectionCourse[];
    awaitingRegistrationList: ISectionCourse[];
    dropRequests: ISectionCourse[];
    registrationRequests: ISectionCourse[];
}

export interface ISectionCourse extends IApprovalRequest {
    blockName: string;
    decisionDate: string;
    decisionTime: string;
    eventId: number;
    eventName: string;
    eventCreditTypeDesc: string;
    eventSection: string;    
    eventSubTypeDesc: string;
    eventTypeDesc: string;
    groupName: string;
    requestDate: string;
    requestTime: string;
    sectionId: number;
}