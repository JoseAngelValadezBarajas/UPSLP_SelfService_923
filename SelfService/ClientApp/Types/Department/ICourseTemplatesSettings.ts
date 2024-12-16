/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ICourseTemplatesSettings.ts */

export interface ICourseTemplatesSettings {
    checked: boolean;
    hasActivities: boolean;
    isAssigned: boolean;
    isAssignedByUser: boolean;
    isRestrictive: boolean;
    isShared: boolean;
    name: string;
    templateId: number;
    userIsOwner: boolean;
}