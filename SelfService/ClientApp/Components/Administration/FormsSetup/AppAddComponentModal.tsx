/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AppAddComponentModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import AppExtraComponentSetup from './AppExtraComponentSetup';
import AppIconSetup from './AppIconSetup';
import AppTextSetup from './AppTextSetup';
import AppUserDefinedSetup from './AppUserDefinedSetup';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import {
    IAppAddComponentModalResources,
    IAppExtraComponentSetupResources,
    IAppTextSetupResources,
    IAppUserDefinedSetupResources
} from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppAddComponentModalProps {
    availableColors: IDropDownOption[];
    availableComponents?: IDropDownOption[];
    availableDataTypes: IDropDownOption[];
    availableGridSize: IDropDownOption[];
    availableOptions?: IDropDownOption[];
    availableTextSizes: IDropDownOption[];
    availableTypes: IDropDownOption[];
    emptyAlt: boolean;
    emptyColor: boolean;
    emptyComponent: boolean;
    emptyDataType: boolean;
    emptyId: boolean;
    emptyGridSize: boolean;
    emptyLabel: boolean;
    emptyMaxLength: boolean;
    emptyRequiredMessage: boolean;
    emptySrc: boolean;
    emptyTextSize: boolean;
    emptyType: boolean;
    emptyValidatorOutRange: boolean;
    fieldIdToEdit?: string[];
    isWithLink: boolean;
    open: boolean;
    selectedColor?: string | number;
    selectedComponent?: string | number;
    selectedGridSize?: string | number;
    selectedTextSize?: string | number;
    selectedUserDefinedDataType?: string | number;
    selectedUserDefinedType?: string | number;
    textActionUrl?: string;
    textAlt?: string;
    textId?: string;
    textLabel?: string;
    textSrc?: string;
    userDefinedCustomScript?: string;
    userDefinedId?: string;
    userDefinedIsRequired: boolean;
    userDefinedIsUploading: boolean;
    userDefinedLabel?: string;
    userDefinedMaxLength?: string;
    validatorUserDefinedOutRangeMsg?: string;
    validatorUserDefinedRequiredMessage?: string;

    // events
    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: any) => void;
    onClickAddOptions: (event: any) => void;
    onClickRemoveOption: (event: any) => void;
    onClose: () => void;
    onRemove: () => void;
    onSave: () => void;

    resources: IAppAddComponentModalResources;
    resourcesExtraComponentsSetup: IAppExtraComponentSetupResources;
    resourcesTextSetup: IAppTextSetupResources;
    resourcesAppUserDefined: IAppUserDefinedSetupResources;
}
// #endregion Types

// #region Component
const AppAddComponentModal: React.FC<IAppAddComponentModalProps> = (props: IAppAddComponentModalProps): JSX.Element => {
    const {
        availableColors,
        availableComponents,
        availableDataTypes,
        availableGridSize,
        availableOptions,
        availableTextSizes,
        availableTypes,
        emptyAlt,
        emptyColor,
        emptyComponent,
        emptyDataType,
        emptyGridSize,
        emptyId,
        emptyLabel,
        emptyMaxLength,
        emptyRequiredMessage,
        emptySrc,
        emptyTextSize,
        emptyType,
        emptyValidatorOutRange,
        fieldIdToEdit,
        isWithLink,
        open,
        selectedColor,
        selectedComponent,
        selectedGridSize,
        selectedTextSize,
        selectedUserDefinedDataType,
        selectedUserDefinedType,
        textActionUrl,
        textAlt,
        textId,
        textLabel,
        textSrc,
        userDefinedCustomScript,
        userDefinedId,
        userDefinedIsRequired,
        userDefinedIsUploading,
        userDefinedMaxLength,
        userDefinedLabel,
        validatorUserDefinedOutRangeMsg,
        validatorUserDefinedRequiredMessage,

        onChangeCheckBox,
        onChangeDropDown,
        onChangeTextField,
        onClickAddOptions,
        onClickRemoveOption,
        onClose,
        onRemove,
        onSave,

        // resources
        resources,
        resourcesExtraComponentsSetup,
        resourcesTextSetup,
        resourcesAppUserDefined
    } = props;

    let removeButton: JSX.Element | undefined;
    if (fieldIdToEdit) {
        removeButton = (
            <Button
                color="secondary"
                id={'btnRemove'}
                onClick={onRemove}
            >
                {resources.btnRemove}
            </Button>
        );
    }

    const footerModal: JSX.Element = (
        <ButtonGroup id="bgModal">
            {removeButton}
            <Button
                id={'btnSave'}
                onClick={onSave}
            >
                {resources.btnSave}
            </Button>
        </ButtonGroup>
    );

    const appUserDefined: JSX.Element = (
        <AppUserDefinedSetup
            availableDataTypes={availableDataTypes}
            availableGridSize={availableGridSize}
            availableOptions={availableOptions}
            availableTypes={availableTypes}
            emptyDataType={emptyDataType}
            emptyId={emptyId}
            emptyGridSize={emptyGridSize}
            emptyLabel={emptyLabel}
            emptyMaxLength={emptyMaxLength}
            emptyRequiredMessage={emptyRequiredMessage}
            emptyType={emptyType}
            emptyValidatorOutRange={emptyValidatorOutRange}
            selectedGridSize={selectedGridSize}
            selectedUserDefinedDataType={selectedUserDefinedDataType}
            selectedUserDefinedType={selectedUserDefinedType}
            userDefinedCustomScript={userDefinedCustomScript}
            userDefinedId={userDefinedId}
            userDefinedIsRequired={userDefinedIsRequired}
            userDefinedIsUploading={userDefinedIsUploading}
            userDefinedLabel={userDefinedLabel}
            userDefinedMaxLength={userDefinedMaxLength}
            validatorUserDefinedOutRangeMsg={validatorUserDefinedOutRangeMsg}
            validatorUserDefinedRequiredMessage={validatorUserDefinedRequiredMessage}
            onChangeCheckBox={onChangeCheckBox}
            onChangeDropDown={onChangeDropDown}
            onChangeTextField={onChangeTextField}
            onClickAddOptions={onClickAddOptions}
            onClickRemoveOption={onClickRemoveOption}
            resources={resourcesAppUserDefined}
        />
    );

    const appTextSetup: JSX.Element = (
        <AppTextSetup
            availableColors={availableColors}
            availableTextSizes={availableTextSizes}
            emptyColor={emptyColor}
            emptyId={emptyId}
            emptyLabel={emptyLabel}
            emptyTextSize={emptyTextSize}
            isWithLink={isWithLink}
            selectedColor={selectedColor}
            selectedTextSize={selectedTextSize}
            textActionUrl={textActionUrl}
            textId={textId}
            textLabel={textLabel}
            onChangeCheckBox={onChangeCheckBox}
            onChangeDropDown={onChangeDropDown}
            onChangeTextField={onChangeTextField}
            resources={resourcesTextSetup}
        />
    );

    const appIconSetup: JSX.Element = (
        <AppIconSetup
            emptyId={emptyId}
            emptyLabel={emptyLabel}
            textActionUrl={textActionUrl}
            textId={textId}
            textLabel={textLabel}
            onChangeTextField={onChangeTextField}
            resources={resourcesTextSetup}
        />
    );

    const emptyOption: IDropDownOption = {
        description: String(resources.lblSelect),
        value: -1
    };

    let isHtlmElement: boolean = false;
    let isImage: boolean = false;

    let componetEditContent: JSX.Element | undefined;
    if (selectedComponent) {
        if (selectedComponent === 'UserDefined') {
            componetEditContent = (
                <>
                    {appUserDefined}
                </>
            );
        }
        if (selectedComponent === 'Text') {
            componetEditContent = (
                <>
                    {appTextSetup}
                </>
            );
        }
        if (selectedComponent === 'IconLinkEmail' ||
            selectedComponent === 'IconLinkPhone' ||
            selectedComponent === 'Button') {
            componetEditContent = (
                <>
                    {appIconSetup}
                </>
            );
        }
        if (selectedComponent === 'Divider') {
            isImage = false;
            isHtlmElement = false;
            componetEditContent = (
                <AppExtraComponentSetup
                    emptyAlt={emptyAlt}
                    emptyId={emptyId}
                    emptyLabel={emptyLabel}
                    emptySrc={emptySrc}
                    isHtlmElement={isHtlmElement}
                    isImage={isImage}
                    textAlt={textAlt}
                    textId={textId}
                    textSrc={textSrc}
                    onChangeTextField={onChangeTextField}
                    resources={resourcesExtraComponentsSetup}
                />
            );
        }
        if (selectedComponent === 'HtmlElement') {
            isImage = false;
            isHtlmElement = true;
            componetEditContent = (
                <AppExtraComponentSetup
                    emptyAlt={emptyAlt}
                    emptyId={emptyId}
                    emptyLabel={emptyLabel}
                    emptySrc={emptySrc}
                    isHtlmElement={isHtlmElement}
                    isImage={isImage}
                    textAlt={textAlt}
                    textId={textId}
                    textLabel={textLabel}
                    textSrc={textSrc}
                    onChangeTextField={onChangeTextField}
                    resources={resourcesExtraComponentsSetup}
                />
            );
        }
        if (selectedComponent === 'Image') {
            isImage = true;
            isHtlmElement = false;
            componetEditContent = (
                <AppExtraComponentSetup
                    emptyAlt={emptyAlt}
                    emptyId={emptyId}
                    emptyLabel={emptyLabel}
                    emptySrc={emptySrc}
                    isHtlmElement={isHtlmElement}
                    isImage={isImage}
                    textAlt={textAlt}
                    textId={textId}
                    textSrc={textSrc}
                    onChangeTextField={onChangeTextField}
                    resources={resourcesExtraComponentsSetup}
                />
            );
        }
    }

    let dropdownComponents: JSX.Element | undefined;
    if (!fieldIdToEdit) {
        dropdownComponents = (
            <Grid item xs={12} md={12}>
                <Dropdown
                    error={emptyComponent}
                    helperText={emptyComponent ?
                        resources.lblEnterComponent : ''}
                    emptyOption={emptyOption}
                    id="ddlComponents"
                    label={resources.lblAddComponent}
                    options={availableComponents}
                    required={true}
                    value={selectedComponent !== undefined ? selectedComponent : -1}
                    onChange={onChangeDropDown}
                />
            </Grid>
        );
    }

    return (
        <Modal
            disableBackdropClick
            footer={footerModal}
            id="appAddComponentModal"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                {dropdownComponents}
                {componetEditContent}
                <br />
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AppAddComponentModal;