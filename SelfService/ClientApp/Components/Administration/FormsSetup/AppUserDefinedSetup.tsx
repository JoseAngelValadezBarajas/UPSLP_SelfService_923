/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppUserDefinedSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import List, { ListItem, ListItemIcon, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAppUserDefinedSetupResources } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppUserDefinedSetupProps {
    availableDataTypes: IDropDownOption[];
    availableGridSize: IDropDownOption[];
    availableOptions?: IDropDownOption[];
    availableTypes: IDropDownOption[];
    emptyDataType: boolean;
    emptyId: boolean;
    emptyGridSize: boolean;
    emptyLabel: boolean;
    emptyMaxLength: boolean;
    emptyRequiredMessage: boolean;
    emptyType: boolean;
    emptyValidatorOutRange: boolean;
    selectedGridSize?: string | number;
    selectedUserDefinedDataType?: string | number;
    selectedUserDefinedType?: string | number;
    userDefinedCustomScript?: string;
    userDefinedId?: string;
    userDefinedIsRequired: boolean;
    userDefinedIsUploading: boolean;
    userDefinedLabel?: string;
    userDefinedMaxLength?: string;
    validatorUserDefinedOutRangeMsg?: string;
    validatorUserDefinedRequiredMessage?: string;

    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;
    onClickAddOptions: (event: any) => void;
    onClickRemoveOption: (event: any) => void;

    resources: IAppUserDefinedSetupResources;
}
// #endregion Types

// #region Component
const AppUserDefinedSetup: React.FC<IAppUserDefinedSetupProps> = (props: IAppUserDefinedSetupProps): JSX.Element => {
    const {
        availableDataTypes,
        availableGridSize,
        availableOptions,
        availableTypes,
        emptyDataType,
        emptyGridSize,
        emptyId,
        emptyLabel,
        emptyMaxLength,
        emptyRequiredMessage,
        emptyType,
        emptyValidatorOutRange,
        selectedGridSize,
        selectedUserDefinedDataType,
        selectedUserDefinedType,
        userDefinedCustomScript,
        userDefinedId,
        userDefinedIsRequired,
        userDefinedIsUploading,
        userDefinedLabel,
        userDefinedMaxLength,
        validatorUserDefinedOutRangeMsg,
        validatorUserDefinedRequiredMessage,

        onChangeCheckBox,
        onChangeDropDown,
        onChangeTextField,
        onClickAddOptions,
        onClickRemoveOption,

        resources
    } = props;

    let addOptionsButton: JSX.Element | undefined;
    let options: JSX.Element[] = [];
    if (availableOptions) {
        options = availableOptions.map((item, i) => (
            <React.Fragment key={`optionsList_${i}`}>
                <ListItem
                    id={`optionItem_${i}`}
                    key={`optionItem_${i}`}
                >
                    <ListItemText
                        id={`optionItemText_${i}`}
                        key={`optionItemText_${i}`}
                        primary={(
                            <Text>
                                {item.description}
                            </Text>
                        )}
                        secondary={(
                            <Text>
                                {String(item.value)}
                            </Text>
                        )}
                    />
                    <ListItemIcon
                        id={`optionItemIcon_${i}`}
                    >
                        <Tooltip
                            id="DownFGIcon"
                            placement="top"
                            title={resources.lblRemove}
                        >
                            <IconButton
                                color="secondary"
                                id={`iconButton_${i}`}
                                onClick={onClickRemoveOption}
                            >
                                <Icon name="trash" />
                            </IconButton>
                        </Tooltip>
                    </ListItemIcon>
                </ListItem>
            </React.Fragment>
        ));
    }

    if (selectedUserDefinedType === 'Dropdown') {
        addOptionsButton = (
            <>
                <Grid container>
                    <Grid item xs={12}>
                        <List id="optionList">
                            {options}
                        </List>
                    </Grid>
                </Grid>
                <Grid
                    alignItems="flex-end"
                    container
                    direction="column"
                    justifyContent="flex-end"
                    spacing={3}
                >
                    <Grid item xs={12}>
                        <ButtonGroup id="btnAddOptions">
                            <Button
                                id={'btnSave'}
                                onClick={onClickAddOptions}
                            >
                                {resources.btnAddOptions}
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            </>
        );
    }
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
                    id="txtUserDefinedId"
                    label={resources.lblId}
                    required={true}
                    type="text"
                    value={userDefinedId || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyLabel}
                    helperText={emptyLabel ?
                        resources.lblEnterLabel : ''}
                    id="txtUserDefinedLabel"
                    label={resources.lblLabel}
                    required={true}
                    type="text"
                    value={userDefinedLabel || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={emptyGridSize}
                    helperText={emptyGridSize ?
                        resources.lblGridSizeRequired : ''}
                    id="ddlGridSize"
                    label={resources.lblGridSize}
                    options={availableGridSize}
                    required={true}
                    value={selectedGridSize || -1}
                    onChange={onChangeDropDown}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={emptyType}
                    helperText={emptyType ?
                        resources.lblEnterType : ''}
                    id="ddlUserDefinedType"
                    label={resources.lblType}
                    options={availableTypes}
                    required={true}
                    value={selectedUserDefinedType || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
            {addOptionsButton}
            <Grid item xs={12} md={12}>
                <Checkbox
                    checked={userDefinedIsUploading}
                    id="chkUserDefinedIsUploading"
                    label={resources.lblIsUploading}
                    onChange={onChangeCheckBox}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <Dropdown
                    emptyOption={emptyOption}
                    error={emptyDataType}
                    helperText={emptyDataType ?
                        resources.lblEnterDataType : ''}
                    id="ddlUserDefinedDataType"
                    label={resources.lblDataType}
                    options={availableDataTypes}
                    required={true}
                    value={selectedUserDefinedDataType || ''}
                    onChange={onChangeDropDown}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <Checkbox
                    checked={userDefinedIsRequired}
                    id="chkUserDefinedIsRequired"
                    label={resources.lblIsRequired}
                    onChange={onChangeCheckBox}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyRequiredMessage}
                    helperText={emptyRequiredMessage ?
                        resources.lblValidatorReqMsgError : ''}
                    id="txtUserDefinedRequired"
                    label={resources.lblValidatorRequired}
                    required={userDefinedIsRequired}
                    type="text"
                    value={validatorUserDefinedRequiredMessage || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyMaxLength}
                    helperText={emptyMaxLength ?
                        resources.lblValidatorMaxLength : ''}
                    id="txtUserDefinedMaxLength"
                    label={resources.lblMaxLength}
                    required={true}
                    type="text"
                    value={userDefinedMaxLength || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            <Grid item xs={12} md={12}>
                <TextField
                    error={emptyValidatorOutRange}
                    helperText={emptyValidatorOutRange ?
                        resources.lblValidatorOutRange : ''}
                    id="txtUserDefinedOutRange"
                    label={resources.lblValidatorOutRangeError}
                    required={true}
                    type="text"
                    value={validatorUserDefinedOutRangeMsg || ''}
                    onChange={onChangeTextField}
                />
            </Grid>
            {
                selectedUserDefinedType === 'Checkbox' ?
                    <Grid item xs={12} md={12}>
                        <TextField
                            id="txtUserDefinedCustomScript"
                            label={resources.lblCustomScript}
                            multiline
                            type="text"
                            value={userDefinedCustomScript || ''}
                            onChange={onChangeTextField}
                        />
                        <Text
                            color="textSecondary"
                            display="inline"
                        >
                            {resources.lblCustomScriptInstructions}
                        </Text>
                    </Grid>
                    : undefined
            }
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
export default AppUserDefinedSetup;