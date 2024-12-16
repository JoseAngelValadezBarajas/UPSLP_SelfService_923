/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: MyTasksCompletedModal.tsx
 * Type: Presentation component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import TimePicker from '@hedtech/powercampus-design-system/react/core/TimePicker';

// Types
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';
import { ICheckListPermissions } from '../../../Types/Permissions/ICheckListPermissions';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IAlertDetailModalProps {
    checkListPermissions: ICheckListPermissions;
    cultures: ICultures;
    impersonateInfo?: IImpersonateInfo;
    isPeopleSearch: boolean;
    onChange: () => void;
    onClose: () => void;
    onCloseSearch: () => void;
    onDatePickerChange: (date: string, id: string, isValid: boolean) => void;
    onNext: () => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onTimePickerChange: (value: string) => void;
    onSaveCompleted: () => void;
    open: boolean;
    resources: IMyTasksMainResources;
    saveComplete: IMyTasksDetail;
}

const styles = createStyles({
    instructorName: {
        wordBreak: 'normal'
    }
});

type PropsWithStyles = IAlertDetailModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const MyTasksCompletedModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        checkListPermissions,
        cultures,
        impersonateInfo,
        isPeopleSearch,
        onChange,
        onClose,
        onCloseSearch,
        onDatePickerChange,
        onNext,
        onTextFieldChange,
        onTimePickerChange,
        onSaveCompleted,
        open,
        saveComplete,
        resources
    } = props;

    let contentModal: JSX.Element | undefined;
    let peopleSearch: JSX.Element | undefined;
    const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
    const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

    if (isPeopleSearch) {
        peopleSearch = (
            <>
                <PeopleSearch />

            </>
        );
    }
    else {
        contentModal = (
            <>
                <br />
                <Grid container>
                    <Grid item xs={12} md={5}>
                        <DatePicker
                            culture={cultures.dateTimeCulture}
                            flip
                            format={cultures.shortDatePattern}
                            error={saveComplete.completedDateModified && !Boolean(saveComplete.completedDate) || saveComplete.completedDateInvalid}
                            helperText={saveComplete.completedDateModified && !Boolean(saveComplete.completedDate) ? resources.lblEnterCompletedDate
                                : saveComplete.completedDateInvalid ?
                                    Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat]) : ''}
                            id="dpCompletedDate"
                            label={resources.lblCompletedDate}
                            required
                            value={saveComplete.completedDate}
                            onChange={onDatePickerChange}
                        />
                    </Grid>
                    <Grid item xs={12} md={5}>
                        <TimePicker
                            error={saveComplete.timeModified && !Boolean(saveComplete.completedTime)}
                            format={cultures.shortTimePattern}
                            helperText={saveComplete.timeModified && !Boolean(saveComplete.completedTime) ? resources.lblEnterCompletedTime : ''}
                            id="tpHour"
                            label={resources.lblCompletedTime}
                            required
                            value={saveComplete.completedTime}
                            onChange={onTimePickerChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <Text>
                            {resources.lblCompletedBy}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        {saveComplete.avatarComplete && saveComplete.avatarComplete.fullName !== '' && (
                            <AvatarText
                                avatarInfo={saveComplete.avatarComplete}
                            />
                        )}
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Button
                            id="btnChange"
                            color="secondary"
                            onClick={onChange}
                        >
                            {resources.lblChange}
                        </Button>
                    </Grid>
                </Grid>
                <br />
                {impersonateInfo?.personId === undefined || impersonateInfo?.personId === null ?
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
                                        id="txtCompleteNotes"
                                        label={resources.lblNotes}
                                        multiline
                                        value={saveComplete.notes}
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
                                                        <div dangerouslySetInnerHTML={{ __html: saveComplete.notes ? saveComplete.notes : '' }} />
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
                    saveComplete && saveComplete.canViewDetails && saveComplete.canViewNotes &&
                        saveComplete.canViewDetails > 0 && saveComplete.canViewNotes > 0 ?
                        (
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
                                            id="txtCompleteNotes"
                                            label={resources.lblNotes}
                                            multiline
                                            value={saveComplete.notes}
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
                                                            <div dangerouslySetInnerHTML={{ __html: saveComplete.notes ? saveComplete.notes : '' }} />
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
    }

    return (
        <Modal
            disableBackdropClick
            id="taskCompletedModal"
            header={Format.toString(resources.formatComplete, [saveComplete.actionName])}
            footer={(
                isPeopleSearch ?
                    (
                        <ButtonGroup id="btgPeopleSearch">
                            <Button
                                id="btnBack"
                                color="secondary"
                                onClick={onCloseSearch}
                            >
                                {resources.lblBack}
                            </Button>
                            <Button
                                id="btnNext"
                                onClick={onNext}
                            >
                                {resources.lblNext}
                            </Button>
                        </ButtonGroup>
                    )
                    :
                    (
                        <ButtonGroup id="btgComplete">
                            <Button
                                id="btnCancel"
                                color="secondary"
                                onClick={onClose}
                            >
                                {resources.lblCancel}
                            </Button>
                            <Button
                                id="btnSave"
                                onClick={onSaveCompleted}
                            >
                                {resources.lblSave}
                            </Button>
                        </ButtonGroup>
                    )
            )}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            {contentModal}
            {peopleSearch}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(MyTasksCompletedModal);