/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: DossierSetupEditCustom.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { DossierDisplayMode } from '@hedtech/powercampus-design-system/types/Dossier/DossierDisplayMode';
import { IDossierSetupValidations, IDossierSetupAdmin } from '../../../Types/Dossier/IDossierSetupAdmin';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IDossierSetupEditCustomProps {
    isLoadingViews: boolean;
    open: boolean;
    resources: IDossierSetupEditCustomResProps;
    setup: IDossierSetupAdmin;
    setupValidations: IDossierSetupValidations;
    viewsOptions?: IDropDownOption[];
    onApply: () => void;
    onBlurName: () => void;
    onCancel: () => void;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IDossierSetupEditCustomResProps {
    btnApply: string;
    btnCancel: string;
    lblDisplayMode: string;
    lblDisplayModeRequired: string;
    lblList: string;
    lblName: string;
    lblNameDuplicated: string;
    lblNameRequired: string;
    lblTable: string;
    lblTitleAdd: string;
    lblTitleEditing: string;
    lblViewName: string;
    lblViewNameRequired: string;
    lblVisible: string;
}
// #endregion Types

// #region Component
const DossierSetupEditCustom: React.FC<IDossierSetupEditCustomProps> = (props: IDossierSetupEditCustomProps): JSX.Element => {
    const {
        isLoadingViews,
        open,
        resources,
        setup,
        setupValidations,
        viewsOptions,
        onApply,
        onBlurName,
        onCancel,
        onChangeCheckbox,
        onChangeDropdown,
        onChangeTextField
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: layoutResources ? layoutResources.lblDropDownEmptyText : '',
        value: ''
    };

    // #region Name
    let errorName: boolean = false;
    let errorTextName: string | undefined;
    if (setupValidations.blockNameModified) {
        errorName = !Boolean(setup.blockName)
            || setupValidations.blockNameDuplicated;
        errorTextName = !Boolean(setup.blockName) ?
            resources.lblNameRequired :
            (setupValidations.blockNameDuplicated ?
                resources.lblNameDuplicated : undefined);
    }
    const valueName: string = setup.blockName || '';
    // #endregion Name

    // #region Group view
    let errorGroupView: boolean = false;
    let errorTextGroupView: string | undefined;
    if (setupValidations.viewNameModified) {
        errorGroupView = !Boolean(setup.viewName);
        errorTextGroupView = errorGroupView ?
            resources.lblViewNameRequired : undefined;
    }
    const valueGroupView: string = setup.viewName || '';
    // #endregion Group view

    // #region Display Mode
    let errorDisplayMode: boolean = false;
    let errorTextDisplayMode: string | undefined;
    if (setupValidations.displayModeModified) {
        errorDisplayMode = !Boolean(setup.displayMode);
        errorTextDisplayMode = errorDisplayMode ?
            resources.lblDisplayModeRequired : undefined;
    }
    const valueDisplayMode: number = setup.displayMode || DossierDisplayMode.List;
    // #endregion Display Mode

    const displayModes: IDropDownOption[] = [{
        description: resources.lblList,
        value: DossierDisplayMode.List
    },
    {
        description: resources.lblTable,
        value: DossierDisplayMode.Table
    }];

    return (
        <Modal
            id="dossierSetupEditCustomModal"
            header={setup.dossierSetupId !== 0 ? resources.lblTitleEditing : resources.lblTitleAdd}
            footer={(
                <ButtonGroup id="btgDossierSetupEditCustom">
                    <Button
                        color="secondary"
                        id="btnCancelCustom"
                        onClick={onCancel}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        id="btnApplyCustom"
                        onClick={onApply}
                    >
                        {resources.btnApply}
                    </Button>
                </ButtonGroup>
            )}
            maxWidth="md"
            open={open}
            onClose={onCancel}
        >
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        error={errorName}
                        helperText={errorTextName}
                        id="txtName"
                        label={resources.lblName}
                        maxCharacters={50}
                        required
                        value={valueName}
                        onChange={onChangeTextField}
                        onBlur={onBlurName}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Dropdown
                        emptyOption={emptyOption}
                        error={errorGroupView}
                        helperText={errorTextGroupView}
                        id="ddlViewName"
                        label={resources.lblViewName}
                        loading={isLoadingViews}
                        options={viewsOptions}
                        required
                        value={valueGroupView}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12} sm={8}>
                    <Dropdown
                        error={errorDisplayMode}
                        helperText={errorTextDisplayMode}
                        id="ddlDisplayMode"
                        label={resources.lblDisplayMode}
                        options={displayModes}
                        required
                        value={valueDisplayMode}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Checkbox
                        checked={setup.isActive}
                        id="chkActive"
                        label={resources.lblVisible}
                        required
                        onChange={onChangeCheckbox}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default DossierSetupEditCustom;