/* Copyright 2018 Ellucian Company L.P. and its affiliates.
 * File: ICourseEvent.ts */

export interface ICourseEvent {
    credits: string;
    closeParens: string;
    concurrent: boolean | null | undefined;
    enrolledSeq: string;
    eventSubType: string;
    id: string;
    isInProgress: string;
    isComplete: string;
    isNotInProgress: string;
    isRequired: boolean;
    logicalOperator: string;
    minimumCredits: string;
    minGrade: string;
    name: string;
    openParens: string;
    spacesCount: number;
    subTypeDescription: string;
    takenEventId: string;
    takenSection: string;
    takenSession: string;
    takenSubtype: string;
    takenTerm: string;
    takenYear: string;
}