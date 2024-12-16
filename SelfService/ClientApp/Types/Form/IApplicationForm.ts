/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IApplicationForm.ts */

// Types
import { IAvailableFileType } from './IAvailableFileType';
import { IExpansionPanel } from './IExpansionPanel';
import { IFieldsGroup } from './IFieldsGroup';
import { IPersonInformation } from './IPersonInformation';
import { IStep } from './IStep';

export interface IApplicationForm {
    allowAttachment: boolean;
    applicationFormId: number;
    canSaveApplication: boolean;
    confirmationSaveMessage: string;
    dateTimeMax: string;
    dateTimeMin: string;
    emailRegExpression: string;
    enableOnlinePayment: boolean;
    expansionPanel: IExpansionPanel;
    feeAmount: string;
    fieldsGroups: IFieldsGroup[];
    fileTypes: IAvailableFileType[];
    footerSaveMessage: string;
    governmentIdMask: string;
    governmentIdMaxLength: number;
    isCompletedApplication: boolean;
    isFlatFee: string;
    layoutId?: number;
    maxApplicationAttachmentSize: number;
    maxAttachmentSize: number;
    name: string;
    numberOfAttachments: number;
    person?: IPersonInformation;
    savedApplicationId?: number;
    steps: IStep[];
}