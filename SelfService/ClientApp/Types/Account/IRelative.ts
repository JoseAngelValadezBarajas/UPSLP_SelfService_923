/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: IRelative.ts */

export interface IRelative {
    acceptedDate?: string;
    avatar: IAvatar;
    expiryDate: string;
    id: number;
    isInvited: boolean;
    relationshipDesc?: string;
}

export interface IAvatar {
    colorFirstLetter: number;
    firstLetter: string;
    fullName: string;
    hasPicture?: boolean;
    peopleId: string;
    personId?: number
}