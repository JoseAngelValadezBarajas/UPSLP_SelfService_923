/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IPreferredNameMain.ts */

export interface IPreferredNameMain {
    description: string;
    displayName: string;
    id: number;
    pendingGenderIdentity: IPreferredNameMain;
    pronounDesc: string;
    pronounId: number;
    requestId: number;
}