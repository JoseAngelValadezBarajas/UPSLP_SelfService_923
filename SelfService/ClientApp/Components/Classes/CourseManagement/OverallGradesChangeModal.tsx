/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: OverallGradesChangeModal.tsx
 * Type: Presentation component */

// #region Imports
import React, { RefObject } from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IOverallGradesResources } from '../../../Types/Resources/Classes/IOverallGradesResources';
import { IOverallGradesChange } from '../../../Types/Section/IOverallGradesChange';
import { IOverallGradesSaveChange } from '../../../Types/Section/IOverallGradesSaveChange';
// #endregion Imports

// #region Types
export interface IOverallGradesChangeModalProps {
    changeGradeCommentRef: RefObject<HTMLInputElement>;
    changeGradeOptions?: IOverallGradesChange;
    changeGradeValues: IOverallGradesSaveChange;
    creditTypeValues: IDropDownOption[];
    finalTerm: string;
    isMidterm: boolean;
    isModalOpen: boolean;
    isReasonError: boolean;
    isWithdrawn: boolean;
    person: IAvatar;
    peopleId: string;
    onCancel: () => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onCloseModal: () => void;
    onSubmit?: () => void;
    resources: IOverallGradesResources;
}

const styles = () => createStyles({
    font: {
        fontFamily: Tokens.fontFamilyDefault,
        fontSize: Tokens.fontSizeDefault
    }
});

type PropsWithStyles = IOverallGradesChangeModalProps & WithStyles<typeof styles>;

// #endregion Types

// #region Component
const OverallGradesChangeModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        changeGradeCommentRef,
        changeGradeOptions,
        changeGradeValues,
        classes,
        creditTypeValues,
        isMidterm,
        isModalOpen,
        isReasonError,
        isWithdrawn,
        finalTerm,
        person,
        peopleId,
        onCancel,
        onChangeDropdown,
        onCloseModal,
        onSubmit,

        resources
    } = props;

    let emptyOption: IDropDownOption = {
        description: '',
        value: 0
    };

    const resourcesLayout = LayoutStore.getResourcesLayout();
    if (resourcesLayout) {
        emptyOption = {
            description: resourcesLayout.lblDropDownEmptyText,
            value: 0
        };
    }

    let recallOption: IDropDownOption | undefined;
    recallOption = {
        description: resources.lblRecall,
        value: ''
    };

    const footerModal: JSX.Element = (
        <ButtonGroup id="btnChangeGradeModal">
            <Button
                id={'btnCancel'}
                color="secondary"
                onClick={onCancel}
            >
                {resources.btnCancel}
            </Button>
            <Button
                id={'btnSubmit'}
                onClick={onSubmit}
            >
                {resources.btnSubmit}
            </Button>
        </ButtonGroup>
    );

    person.peopleId = peopleId;
    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            footer={footerModal}
            header={resources.lblChangeGradeTitle}
            id="modalChangeGrade"
            maxWidth="md"
            open={isModalOpen}
            onClose={onCloseModal}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} className={classes.font}>
                    <AvatarText
                        avatarInfo={person}
                        complement={isWithdrawn && (
                            <StatusLabel
                                id="stsLabelWithdrawn"
                                text={resources.lblWithdrawn}
                                type="draft"
                            />
                        )}
                    />
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={recallOption}
                        id="ddlGrade"
                        label={resources.lblGrade}
                        options={creditTypeValues}
                        value={changeGradeValues.grade === '' ? recallOption.value : changeGradeValues.grade ? changeGradeValues.grade : finalTerm}
                        onChange={onChangeDropdown}
                    />
                </Grid>
                {isMidterm ?
                    (
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                error={isReasonError}
                                emptyOption={emptyOption}
                                helperText={isReasonError ? resources.lblReasonError : ''}
                                id="ddlReason"
                                label={resources.lblReason}
                                options={changeGradeOptions && changeGradeOptions.gradeChangeReasons}
                                required={changeGradeOptions && changeGradeOptions.isMidtermGradeChangeReasonRequired}
                                value={changeGradeValues ? changeGradeValues.reasonId : emptyOption.value}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    )
                    : (
                        <Grid item xs={12} md={6}>
                            <Dropdown
                                error={isReasonError}
                                emptyOption={emptyOption}
                                helperText={isReasonError ? resources.lblReasonError : ''}
                                id="ddlReason"
                                label={resources.lblReason}
                                options={changeGradeOptions && changeGradeOptions.gradeChangeReasons}
                                required={changeGradeOptions && changeGradeOptions.isFinalGradeChangeReasonRequired}
                                value={changeGradeValues ? changeGradeValues.reasonId : emptyOption.value}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    )
                }
            </Grid >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TextField
                        id="txtComment"
                        label={resources.lblComment}
                        multiline
                        ref={changeGradeCommentRef}
                        defaultValue={changeGradeValues.narrativeGrade}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(OverallGradesChangeModal);