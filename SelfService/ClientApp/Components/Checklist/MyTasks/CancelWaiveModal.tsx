/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CancelWaiveModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IChecklistAction } from '../../../Types/Checklist/IChecklistAction';
import { ICheckListPermissions } from '../../../Types/Permissions/ICheckListPermissions';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IAlertDetailModalProps {
    checkListPermissions: ICheckListPermissions;
    canViewNotes: number;
    onClose: () => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSaveReasons: () => void;
    open: boolean;
    isCancelReason: boolean;
    taskName: string;
    cancelWaivedReasons: IDropDownOption[];
    resources: IMyTasksMainResources;
    personId: number;
    saveReasons: IChecklistAction;
}

const styles = createStyles({
    instructorName: {
        wordBreak: 'normal'
    }
});

type PropsWithStyles = IAlertDetailModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const CancelWaiveModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        canViewNotes,
        checkListPermissions,
        onClose,
        onDropdownChange,
        onTextFieldChange,
        onSaveReasons,
        open,
        isCancelReason,
        taskName,
        cancelWaivedReasons,
        saveReasons,
        personId,
        resources
    } = props;

    const emptyOption: IDropDownOption = {
        description: resources.lblDropDownEmptyText,
        value: ''
    };
    let contentModal: JSX.Element | undefined;
    contentModal = (
        <>
            <br />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        emptyOption={emptyOption}
                        required
                        error={saveReasons.reasonRequired}
                        helperText={saveReasons.reasonRequired ? isCancelReason ? resources.lblErrorCanceledReason : resources.lblErrorWaivedReason : ''}
                        id="ddlCancelWaivedReason"
                        label={isCancelReason ? resources.lblCancellationReason : resources.lblWaivedReason}
                        options={cancelWaivedReasons}
                        value={saveReasons.reasonSelected ? saveReasons.reasonSelected : 0}
                        onChange={onDropdownChange}
                    />
                </Grid>
            </Grid>
<br />
            {personId === undefined || personId === null ?
                checkListPermissions.viewNotes && (
                    <>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Text
                                    size="h3"
                                >
                                    {resources.lblNotes}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} md={10}>
                                <TextField
                                    id="txtNotes"
                                    label={resources.lblNotes}
                                    multiline
                                    value={saveReasons.note}
                                    onChange={onTextFieldChange}
                                />
                                <Text
                                    color="textSecondary"
                                    display="inline"
                                >
                                    {resources.lblNotesLegend}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={10}>
                                <Text>
                                    {resources.lblPreview}
                                </Text>
                                <Divider />
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Text>
                                                    <div dangerouslySetInnerHTML={{ __html: saveReasons.note ? saveReasons.note : '' }} />
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
<br />
                    </>
                )
                :
                canViewNotes > 0 ? (
                    <>
                        <Grid container spacing={3}>
                            <Grid item>
                                <Text
                                    size="h3"
                                >
                                    {resources.lblNotes}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} md={10}>
                                <TextField
                                    id="txtNotes"
                                    label={resources.lblNotes}
                                    multiline
                                    value={saveReasons.note}
                                    onChange={onTextFieldChange}
                                />
                                <Text
                                    color="textSecondary"
                                    display="inline"
                                >
                                    {resources.lblNotesLegend}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={10}>
                                <Text>
                                    {resources.lblPreview}
                                </Text>
                                <Divider />
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Text>
                                                    <div dangerouslySetInnerHTML={{ __html: saveReasons.note ? saveReasons.note : '' }} />
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
<br />
                    </>
                  )
                    : undefined
            }
        </>
    );

    return (
        <Modal
            disableBackdropClick
            id="cancelWaiveModal"
            header={Format.toString(isCancelReason ? resources.formatCancelTitle : resources.formatWaiveTitle, [taskName])}
            footer={(
                <ButtonGroup id="btgCancelWaive">
                    <Button
                        id="btnCancel"
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.lblCancel}
                    </Button>
                    <Button
                        id="btnSave"
                        onClick={onSaveReasons}
                    >
                        {resources.lblSave}
                    </Button>
                </ButtonGroup>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            {contentModal}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(CancelWaiveModal);