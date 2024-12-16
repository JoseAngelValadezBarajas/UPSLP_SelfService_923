/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File:GradeMappingsCopyModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IGradeMappingsResources } from '../../../Types/Resources/Classes/IGradeMappingsResources';
import { ISectionCopyActivities } from '../../../Types/Section/ISectionCopyActivities';
// #endregion

// #region Internal types
export interface IGradeMappingsCopyModalProps {
    gradeMappingsCopy: ISectionCopyActivities;
    isCopyButton: boolean;
    open: boolean;
    sectionsCourses: IDropDownOption[];
    resources: IGradeMappingsResources;
    onClose: () => void;
    onCopyGradeMappings: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
}
// #endregion

// #region Component
const GradeMappingsCopyModal: React.FC<IGradeMappingsCopyModalProps> = (props: IGradeMappingsCopyModalProps): JSX.Element => {
    const {
        gradeMappingsCopy,
        isCopyButton,
        open,
        sectionsCourses,
        onClose,
        onCopyGradeMappings,
        onDropdownChange,

        resources
    } = props;

    let emptyOption: IDropDownOption | undefined;
    const resourcesLayout = LayoutStore.getResourcesLayout();
    if (resourcesLayout) {
        emptyOption = {
            description: resourcesLayout.lblDropDownEmptyText,
            value: 0
        };
    }

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            disableHeaderTypography
            id="gradeMappingsCopyModal"
            footer={(
                <Button
                    disabled={isCopyButton}
                    id="btnCopy"
                    onClick={onCopyGradeMappings}
                >
                    {resources.btnCopy}
                </Button>
            )}
            header={(
                <>
                    <Text size="h2">
                        {resources.lblCopyGradeMappings}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item>
                    <Text size="h4">
                        {resources.lblChooseSection}
                    </Text>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        id="ddlPeriod"
                        label={resources.lblPeriod}
                        options={gradeMappingsCopy.periods}
                        value={gradeMappingsCopy.defaultPeriod.value}
                        onChange={onDropdownChange}
                    />
                </Grid>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        id="ddlCourse"
                        label={resources.lblCourse}
                        options={sectionsCourses.length > 0 ? sectionsCourses : gradeMappingsCopy.sections}
                        value={gradeMappingsCopy.defaultSection ? gradeMappingsCopy.defaultSection.value : emptyOption}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
            <br />
        </Modal>
    );
};
// #endregion

export default GradeMappingsCopyModal;