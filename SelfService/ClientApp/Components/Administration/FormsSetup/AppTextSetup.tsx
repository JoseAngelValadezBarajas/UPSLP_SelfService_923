/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppTextSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAppTextSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppTextSetupProps {
    availableColors: IDropDownOption[];
    availableTextSizes: IDropDownOption[];
    emptyColor: boolean;
    emptyId: boolean;
    emptyLabel: boolean;
    emptyTextSize: boolean;
    isWithLink: boolean;
    selectedColor?: string | number;
    selectedTextSize?: string | number;
    textActionUrl?: string;
    textId?: string;
    textLabel?: string;

    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;

    resources: IAppTextSetupResources;
}
// #endregion Types

// #region Component
const AppTextSetup: React.FC<IAppTextSetupProps> = (props: IAppTextSetupProps): JSX.Element => {
    const {
        availableColors,
        availableTextSizes,
        emptyColor,
        emptyId,
        emptyLabel,
        emptyTextSize,
        isWithLink,
        selectedColor,
        selectedTextSize,
        textActionUrl,
        textId,
        textLabel,

        onChangeCheckBox,
        onChangeDropDown,
        onChangeTextField,

        resources
    } = props;

    const emptyOption: IDropDownOption = {
        description: String(resources.lblSelect),
        value: ''
    };
    let content: JSX.Element | undefined;
    content = (
        <>
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyId}
                    helperText={emptyId ?
                        resources.lblEnterId : ''}
                    id="txtTextId"
                    label={resources.lblId}
                    required={true}
                    type="text"
                    value={textId || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyLabel}
                    helperText={emptyLabel ?
                        resources.lblEnterLabel : ''}
                    id="txtTextLabel"
                    label={resources.lblLabel}
                    multiline
                    required={true}
                    type="text"
                    value={textLabel || ''}
                    onChange={onChangeTextField}
                />
                <Text
                    color="textSecondary"
                    display="inline"
                >
                    {resources.lblLabelInstructions}
                </Text>
            </Grid>
            <Grid item xs={12} md={12}>
                <Checkbox
                    checked={isWithLink}
                    id="chkIsWithLink"
                    label={resources.lblIsWithLink}
                    onChange={onChangeCheckBox}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    id="txtTextActionUrl"
                    label={resources.lblActionUrl}
                    multiline
                    type="text"
                    value={textActionUrl || ''}
                    onChange={onChangeTextField}
                />
                <Text
                    color="textSecondary"
                    display="inline"
                >
                    {resources.lblActionUrlInstructions}
                </Text>
            </Grid>
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={emptyTextSize}
                    helperText={emptyTextSize ?
                        resources.lblEnterTextSize : ''}
                    id="ddlTextSize"
                    label={resources.lblTextSize}
                    options={availableTextSizes}
                    required={true}
                    value={selectedTextSize || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={emptyColor}
                    helperText={emptyColor ?
                        resources.lblEnterColor : ''}
                    id="ddlTextColor"
                    label={resources.lblColor}
                    options={availableColors}
                    required={true}
                    value={selectedColor || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
        </>
    );

    return (
        <>
            {content}
        </>
    );
};
// #endregion Component

// Export: Component
export default AppTextSetup;