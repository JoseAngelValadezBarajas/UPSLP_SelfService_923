/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: IFieldForm.ts */

// Types
import { IDataForm } from './IDataForm';

export interface IFieldForm {
    actionUrl?: string;
    alt?: string;
    childEndPoint?: string;
    childField?: string;
    color?: 'default' | 'error' | 'inherit' | 'primary' | 'secondary' | 'textPrimary' | 'textSecondary';
    componentType: string;
    customScript?: string;
    data: IDataForm;
    dataType?: string;
    default?: any;
    disabled?: boolean;
    gridSize?: string;
    isExpansionPanelHeader?: boolean;
    isNumeric: boolean;
    isRequired: boolean;
    isUploading?: boolean;
    isUserDefined?: boolean;
    isWithLink?: boolean;
    maxLength?: number;
    onClick?: any;
    parentId?: string;
    size?: 'inherit' | 'h1' | 'h2' | 'h3' | 'h4' | 'default' | 'large' | 'small';
    src?: string;
    value?: any;
}