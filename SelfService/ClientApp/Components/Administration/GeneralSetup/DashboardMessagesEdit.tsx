/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: DashboardMessagesEdit.tsx
 * Type: Presentation component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import DashboardMessageCard, { IDashboardMessageCardResProps } from '../../Generic/DashboardMessageCard';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import TimePicker from '@hedtech/powercampus-design-system/react/core/TimePicker';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IDashboardMessageDetail } from '../../../Types/Dashboard/IDashboardMessageDetail';
import { IDashboardMessageDetailValidations } from '../../../Types/Dashboard/IDashboardMessageDetailValidations';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// #endregion Imports

// #region Types
export interface IDashboardMessagesEditProps {
    cultures: ICultures;
    dashboardMessage: IDashboardMessageDetail;
    dashboardMessageValidations: IDashboardMessageDetailValidations;
    groupViewsOptions: IDropDownOption[];
    lblDropDownEmptyText: string;
    resources: IDashboardMessagesEditResProps;
    dashboardCardResources: IDashboardMessageCardResProps;
    typeOptions: IDropDownOption[];
    onBlurName: () => void;
    onBlurSort: () => void;
    onCancel: () => void;
    onChangeDatePicker: (date: string, id: string, _isValid: boolean) => void;
    onEndTimePickerChange: (value: string) => void;
    onStartTimePickerChange: (value: string) => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: (process: boolean) => void;
}

export interface IDashboardMessagesEditResProps {
    btnCancel: string;
    btnProcess: string;
    btnSave: string;
    formatDateOutOfRange: string;
    formatTitleEditing: string;
    lblEndDate: string;
    lblStartDate: string;
    lblEndDateRequired: string;
    lblStartDateRequired: string;
    lblEndTime: string;
    lblEndTimeRequired: string;
    lblEnterEndTime: string;
    lblEnterStartTime: string;
    lblErrorDatesRange: string;
    lblErrorTimesRange: string;
    lblInvalidSort: string;
    lblMessage: string;
    lblMessageRequired: string;
    lblName: string;
    lblNameDuplicated: string;
    lblNameRequired: string;
    lblPagination: string;
    lblPreview: string;
    lblSort: string;
    lblSortDuplicated: string;
    lblSortRequired: string;
    lblStartTime: string;
    lblStartTimeRequired: string;
    lblTitle: string;
    lblTitleRequired: string;
    lblType: string;
    lblTypeRequired: string;
    lblUrl: string;
    lblUrlText: string;
    lblViewName: string;
    lblViewNameRequired: string;
}

const styles = ((theme: Theme) => createStyles({
    statusCard: {
        [theme.breakpoints.up('md')]: {
            height: '250px'
        },
        height: 'auto'
    },
    statusContent: {
        height: '100%'
    }
}));
// #endregion Types

// #region Component
type PropsWithStyles = IDashboardMessagesEditProps & WithStyles<typeof styles> & WithWidth;

const DashboardMessagesEdit: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        cultures,
        dashboardCardResources,
        dashboardMessage,
        dashboardMessageValidations,
        groupViewsOptions,
        lblDropDownEmptyText,
        resources,
        typeOptions,
        onBlurName,
        onBlurSort,
        onCancel,
        onChangeDatePicker,
        onEndTimePickerChange,
        onChangeDropdown,
        onChangeTextField,
        onSave,
        onStartTimePickerChange
    } = props;

    const emptyOption: IDropDownOption = {
        description: lblDropDownEmptyText,
        value: ''
    };

    const emptyNumericOption: IDropDownOption = {
        description: lblDropDownEmptyText,
        value: -1
    };

    const dateMinFormat: string = moment().add(-100, 'years').format(cultures.shortDatePattern.toUpperCase());
    const dateMaxFormat: string = moment().add(100, 'years').format(cultures.shortDatePattern.toUpperCase());

    // #region Name
    let errorName: boolean = false;
    let errorTextName: string | undefined;
    if (dashboardMessageValidations.nameModified) {
        errorName = !Boolean(dashboardMessage.name)
            || dashboardMessageValidations.nameDuplicated;
        errorTextName = !Boolean(dashboardMessage.name) ?
            resources.lblNameRequired :
            (dashboardMessageValidations.nameDuplicated ?
                resources.lblNameDuplicated : undefined);
    }
    const valueName: string = dashboardMessage.name || '';
    // #endregion Name

    // #region Group view
    let errorGroupView: boolean = false;
    let errorTextGroupView: string | undefined;
    if (dashboardMessageValidations.groupViewNameModified) {
        errorGroupView = !Boolean(dashboardMessage.groupViewName);
        errorTextGroupView = errorGroupView ?
            resources.lblViewNameRequired : undefined;
    }
    const valueGroupView: string = dashboardMessage.groupViewName || '';
    // #endregion Group view

    // #region Sort
    let errorSort: boolean = false;
    let errorTextSort: string | undefined;
    if (dashboardMessageValidations.sortModified) {
        errorSort = (
            (dashboardMessage.sort === undefined
                || dashboardMessage.sort === null
                || dashboardMessage.sort === '')
            || dashboardMessageValidations.sortInvalid
            || dashboardMessageValidations.sortDuplicated
        );
        errorTextSort = (
            dashboardMessage.sort === undefined
            || dashboardMessage.sort === null
            || dashboardMessage.sort === '') ?
            resources.lblSortRequired : (dashboardMessageValidations.sortInvalid ?
                resources.lblInvalidSort : (dashboardMessageValidations.sortDuplicated ?
                    resources.lblSortDuplicated : undefined)
            );
    }
    const valueSort: string = (
        (dashboardMessage.sort !== undefined
            && dashboardMessage.sort !== null
            && dashboardMessage.sort !== '') ?
            dashboardMessage.sort.toString() : ''
    );
    // #endregion Sort

    // #region Type
    let errorType: boolean = false;
    let errorTextType: string | undefined;
    if (dashboardMessageValidations.typeModified) {
        errorType = (
            dashboardMessage.type === null
            || dashboardMessage.type === undefined
            || dashboardMessage.type < 0
        );
        errorTextType = errorType ?
            resources.lblTypeRequired : undefined;
    }
    const valueType: string | number = (
        dashboardMessage.type !== null
            && dashboardMessage.type !== undefined ?
            dashboardMessage.type : ''
    );
    // #endregion Type

    // #region Title
    let errorTitle: boolean = false;
    let errorTextTitle: string | undefined;
    if (dashboardMessageValidations.titleModified) {
        errorTitle = !Boolean(dashboardMessage.title);
        errorTextTitle = errorTitle ?
            resources.lblTitleRequired : undefined;
    }
    const valueTitle: string = dashboardMessage.title || '';
    // #endregion Title

    // #region Message
    let errorMessage: boolean = false;
    let errorTextMessage: string | undefined;
    if (dashboardMessageValidations.messageModified) {
        errorMessage = !Boolean(dashboardMessage.message);
        errorTextMessage = errorMessage ?
            resources.lblMessageRequired : undefined;
    }
    const valueMessage: string = dashboardMessage.message || '';
    // #endregion Message

    // #region Start Date
    let errorStartDate: boolean = false;
    let errorTextStartDate: string | undefined;
    if (dashboardMessageValidations.startDateModified
        || dashboardMessageValidations.endDateModified) {
        errorStartDate = (
            !Boolean(dashboardMessage.startDate)
            || dashboardMessageValidations.startDateInvalid
            || dashboardMessageValidations.startDateRangeError
        );
        errorTextStartDate = (
            !Boolean(dashboardMessage.startDate) ?
                resources.lblStartDateRequired : (dashboardMessageValidations.startDateInvalid ?
                    Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                    : (dashboardMessageValidations.startDateRangeError ?
                        resources.lblErrorDatesRange : undefined))
        );
    }
    const valueStartDate: string = dashboardMessage.startDate;
    // #endregion Start Date

    // #region End Date
    let errorEndDate: boolean = false;
    let errorTextEndDate: string | undefined;
    if (dashboardMessageValidations.endDateModified) {
        errorEndDate = (
            !Boolean(dashboardMessage.endDate)
            || dashboardMessageValidations.endDateInvalid
        );
        errorTextEndDate = (
            !Boolean(dashboardMessage.endDate) ?
                resources.lblEndDateRequired : (dashboardMessageValidations.endDateInvalid ?
                    Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                    : undefined)
        );
    }
    const valueEndDate: string = dashboardMessage.endDate;
    // #endregion End Date

    const callbackSaveProcess = function (): void { onSave(true); };
    const callbackSave = function (): void { onSave(false); };
    return (
        <>
            {dashboardMessage.id > 0 ? (
                <>
                    <Grid container>
                        <Grid item xs>
                            <Text size="h2">
                                {Format.toString(resources.formatTitleEditing, [dashboardMessage.nameOriginal])}
                            </Text>
                        </Grid>
                    </Grid>
                    <br />
                </>
            ) : undefined}
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                error={errorName}
                                helperText={errorTextName}
                                id="txtName"
                                label={resources.lblName}
                                maxCharacters={40}
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
                                options={groupViewsOptions}
                                required
                                value={valueGroupView}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={errorTitle}
                                helperText={errorTextTitle}
                                id="txtTitle"
                                label={resources.lblTitle}
                                maxCharacters={50}
                                required
                                value={valueTitle}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={errorMessage}
                                helperText={errorTextMessage}
                                id="txtMessage"
                                label={resources.lblMessage}
                                maxCharacters={100}
                                minRows={5}
                                multiline
                                required
                                value={valueMessage}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                        <br />
                        <Grid item xs={12}>
                            <TextField
                                id="txtUrl"
                                label={resources.lblUrl}
                                maxCharacters={2048}
                                value={dashboardMessage.url || ''}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                        <br />
                        <Grid item xs={12}>
                            <TextField
                                id="txtUrlText"
                                label={resources.lblUrlText}
                                maxCharacters={40}
                                value={dashboardMessage.urlText || ''}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container>
                        <Grid item xs={12} sm={6}>
                            <Dropdown
                                emptyOption={emptyNumericOption}
                                error={errorType}
                                helperText={errorTextType}
                                id="ddlType"
                                label={resources.lblType}
                                options={typeOptions}
                                required
                                value={valueType}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                error={errorSort}
                                helperText={errorTextSort}
                                id="txtSort"
                                label={resources.lblSort}
                                maxCharacters={3}
                                required
                                value={valueSort}
                                onChange={onChangeTextField}
                                onBlur={onBlurSort}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                format={cultures.shortDatePattern}
                                error={errorStartDate}
                                helperText={errorTextStartDate}
                                id="dtpStartDate"
                                label={resources.lblStartDate}
                                required
                                value={valueStartDate}
                                onChange={onChangeDatePicker}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TimePicker
                                error={dashboardMessageValidations.startTimeModified && !Boolean(dashboardMessage.startTime)}
                                format={cultures.shortTimePattern}
                                helperText={dashboardMessageValidations.startTimeModified && !Boolean(dashboardMessage.startTime) ?
                                    resources.lblEnterStartTime : ''}
                                fullWidth
                                id="tpStartTime"
                                label={resources.lblStartTime}
                                required
                                value={dashboardMessage.startTime}
                                onChange={onStartTimePickerChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                format={cultures.shortDatePattern}
                                error={errorEndDate}
                                helperText={errorTextEndDate}
                                id="dtpEndDate"
                                label={resources.lblEndDate}
                                required
                                value={valueEndDate}
                                onChange={onChangeDatePicker}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TimePicker
                                error={dashboardMessageValidations.endTimeModified && !Boolean(dashboardMessage.endTime)}
                                format={cultures.shortTimePattern}
                                helperText={dashboardMessageValidations.endTimeModified && !Boolean(dashboardMessage.endTime) ?
                                     resources.lblEnterEndTime : ''}
                                fullWidth
                                id="tpEndTime"
                                label={resources.lblEndTime}
                                required
                                value={dashboardMessage.endTime}
                                onChange={onEndTimePickerChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs>
                                    <Text size="h2">
                                        {resources.lblPreview}
                                    </Text>
                                    <Divider />
                                </Grid>
                            </Grid>
                            <Grid container justifyContent="center">
                                <Grid item>
                                    <DashboardMessageCard
                                        dashboardMessage={dashboardMessage}
                                        index={1}
                                        isPreview
                                        overallCount={1}
                                        resources={dashboardCardResources}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container>
            </Grid>
            <br />
            <br />
            <Grid container justifyContent='center' alignContent="flex-end">
                <Grid item xs alignContent="flex-end" justifyContent='center'>
                    <ButtonGroup id="btgDashboardMessage">
                        <Button
                            id="btnSaveDashboardMessage"
                            onClick={callbackSave}
                        >
                            {resources.btnSave}
                        </Button>
                        <Button
                            color="secondary"
                            id="btnProcessDashboardMessage"
                            onClick={callbackSaveProcess}
                        >
                            {resources.btnProcess}
                        </Button>
                        <Button
                            color="secondary"
                            id="btnCancelDashboardMessage"
                            onClick={onCancel}
                        >
                            {resources.btnCancel}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(DashboardMessagesEdit));