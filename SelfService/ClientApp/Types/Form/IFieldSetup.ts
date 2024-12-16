/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: IFieldSetup.ts */

import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IValidatorMessage } from './IValidatorMessage';

export interface IFieldSetup {
    actionUrl?: string;
    gridSize?: string;
    id: string;
    isWithLink?: boolean;
    label: string;
    type: string;
    validatorMessages: IValidatorMessage[];
    maxLength?: number;
    sortOrder: number;
    options?: IDropDownOption[];
    isRequired?: boolean;
    isUserDefined?: boolean;
    isUploading?: boolean;
    customScript?: string;
    dataType?: string;
    default?: string;
    color?: string;
    size?: string;
    alt?: string;
    src?: string;
    value?: string;
    isExpansionPanelHeader?: boolean;
}