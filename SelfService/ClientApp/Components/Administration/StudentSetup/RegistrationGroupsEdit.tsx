/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: RegistrationGroupsEdit.tsx
 * Type: Presentation component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IRegistrationGroupDetail } from '../../../Types/RegistrationGroups/IRegistrationGroupDetail';
import { IRegistrationGroupDetailValidations } from '../../../Types/RegistrationGroups/IRegistrationGroupDetailValidations';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
// #endregion Imports

// #region Types
export interface IRegistrationGroupsEditProps {
    cultures: ICultures;
    dateBasesOptions: IDropDownOption[];
    groupViewsOptions: IDropDownOption[];
    hours?: IDropDownOption[];
    lblDropDownEmptyText: string;
    minutes?: IDropDownOption[];
    registrationGroup: IRegistrationGroupDetail;
    registrationGroupValidations: IRegistrationGroupDetailValidations;
    resources: IRegistrationGroupsEditResProps;
    onBlurName: () => void;
    onBlurSort: () => void;
    onCancel: () => void;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDatePicker: (date: string, id: string, _isValid: boolean) => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
}

export interface IRegistrationGroupsEditResProps {
    btnCancel: string;
    btnSave: string;
    formatDateOutOfRange: string;
    formatTitleEditing: string;
    lblActive: string;
    lblAdvisorApprovals: string;
    lblAdvisorAuthorization: string;
    lblBaseDate: string;
    lblBaseDateRequired: string;
    lblCourseAdvisorApproval: string;
    lblDate: string;
    lblDateRequired: string;
    lblDaysFromBaseDate: string;
    lblDaysFromBaseDateRequired: string;
    lblDropAdvisorApproval: string;
    lblEndHour: string;
    lblEndHourRequired: string;
    lblEndMinute: string;
    lblEndMinuteRequired: string;
    lblEndRegistrationCriteria: string;
    lblErrorDatesRange: string;
    lblErrorTimesRange: string;
    lblGeneralInformation: string;
    lblGroupName: string;
    lblGroupNameRequired: string;
    lblInvalidDaysFromBaseDate: string;
    lblInvalidSort: string;
    lblNameDuplicated: string;
    lblSort: string;
    lblSortDuplicated: string;
    lblSortRequired: string;
    lblRegistrationCriteria: string;
    lblStartHour: string;
    lblStartHourRequired: string;
    lblStartMinute: string;
    lblStartMinuteRequired: string;
    lblStartRegistrationCriteria: string;
    lblViewName: string;
    lblViewNameRequired: string;
    lblWarningPreRegistrationDate: string;
    lblWarningRegistrationDate: string;
}
// #endregion Types

// #region Component
const RegistrationGroupsEdit: React.FC<IRegistrationGroupsEditProps> = (props: IRegistrationGroupsEditProps): JSX.Element => {
    const {
        cultures,
        dateBasesOptions,
        groupViewsOptions,
        hours,
        lblDropDownEmptyText,
        minutes,
        registrationGroup,
        registrationGroupValidations,
        resources,
        onBlurName,
        onBlurSort,
        onCancel,
        onChangeCheckbox,
        onChangeDatePicker,
        onChangeDropdown,
        onChangeTextField,
        onSave
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
    if (registrationGroupValidations.nameModified) {
        errorName = !Boolean(registrationGroup.name)
            || registrationGroupValidations.nameDuplicated;
        errorTextName = !Boolean(registrationGroup.name) ?
            resources.lblGroupNameRequired :
            (registrationGroupValidations.nameDuplicated ?
                resources.lblNameDuplicated : undefined);
    }
    const valueName: string = registrationGroup.name || '';
    // #endregion Name

    // #region Group view
    let errorGroupView: boolean = false;
    let errorTextGroupView: string | undefined;
    if (registrationGroupValidations.groupViewNameModified) {
        errorGroupView = !Boolean(registrationGroup.groupViewName);
        errorTextGroupView = errorGroupView ?
            resources.lblViewNameRequired : undefined;
    }
    const valueGroupView: string = registrationGroup.groupViewName || '';
    // #endregion Group view

    // #region Sort
    let errorSort: boolean = false;
    let errorTextSort: string | undefined;
    if (registrationGroupValidations.sortModified) {
        errorSort = (
            (registrationGroup.sort === undefined
                || registrationGroup.sort === null
                || registrationGroup.sort === '')
            || registrationGroupValidations.sortInvalid
            || registrationGroupValidations.sortDuplicated
        );
        errorTextSort = (
            registrationGroup.sort === undefined
            || registrationGroup.sort === null
            || registrationGroup.sort === '') ?
            resources.lblSortRequired : (registrationGroupValidations.sortInvalid ?
                resources.lblInvalidSort : (registrationGroupValidations.sortDuplicated ?
                    resources.lblSortDuplicated : undefined)
            );
    }
    const valueSort: string = (
        (registrationGroup.sort !== undefined
            && registrationGroup.sort !== null
            && registrationGroup.sort !== '') ?
            registrationGroup.sort.toString() : ''
    );
    // #endregion Sort

    // #region Start Criteria

    // #region Start Type
    let errorStartType: boolean = false;
    let errorTextStartType: string | undefined;
    if (registrationGroupValidations.startRegistrationTypeModified) {
        errorStartType = !Boolean(registrationGroup.startRegistrationType);
        errorTextStartType = errorStartType ?
            resources.lblBaseDateRequired : undefined;
    }
    const valueStartType: string = registrationGroup.startRegistrationType;
    // #endregion Start Type

    // #region Start Date
    let errorStartDate: boolean = false;
    let errorTextStartDate: string | undefined;
    if (registrationGroupValidations.startRegistrationDateModified
        || registrationGroupValidations.endRegistrationDateModified) {
        errorStartDate = (
            !Boolean(registrationGroup.startRegistrationDate)
            || registrationGroupValidations.startRegistrationDateInvalid
            || registrationGroupValidations.startRegistrationDateRangeError
        );
        errorTextStartDate = (
            !Boolean(registrationGroup.startRegistrationDate) ?
                resources.lblDateRequired : (registrationGroupValidations.startRegistrationDateInvalid ?
                    Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                    : (registrationGroupValidations.startRegistrationDateRangeError ?
                        resources.lblErrorDatesRange : undefined))
        );
    }
    const valueStartDate: string = registrationGroup.startRegistrationDate;
    // #endregion Start Date

    // #region Start Days
    let errorStartDays: boolean = false;
    let errorTextStartDays: string | undefined;
    if (registrationGroupValidations.startOffsetModified) {
        errorStartDays = (
            (registrationGroup.startOffset === undefined
                || registrationGroup.startOffset === null
                || registrationGroup.startOffset === '')
            || registrationGroupValidations.startOffsetInvalid
        );
        errorTextStartDays = (
            (registrationGroup.startOffset === undefined
                || registrationGroup.startOffset === null
                || registrationGroup.startOffset === '') ?
                resources.lblDaysFromBaseDateRequired : (registrationGroupValidations.startOffsetInvalid ?
                    resources.lblInvalidDaysFromBaseDate : undefined)
        );
    }
    const valueStartDays: string = (
        (registrationGroup.startOffset !== undefined
            && registrationGroup.startOffset !== null
            && registrationGroup.startOffset !== '') ?
            registrationGroup.startOffset.toString() : ''
    );
    // #endregion Start Days

    // #region Start Hour
    let errorStartHour: boolean = false;
    let errorTextStartHour: string | undefined;
    if (registrationGroupValidations.startRegistrationHourModified
        || registrationGroupValidations.startRegistrationMinuteModified
        || registrationGroupValidations.endRegistrationHourModified
        || registrationGroupValidations.endRegistrationMinuteModified) {
        errorStartHour = (
            registrationGroup.startRegistrationHour === null
            || registrationGroup.startRegistrationHour === undefined
            || registrationGroup.startRegistrationHour < 0
            || registrationGroupValidations.startRegistrationTimeRangeError
        );
        errorTextStartHour = (
            (registrationGroup.startRegistrationHour === null
                || registrationGroup.startRegistrationHour === undefined
                || registrationGroup.startRegistrationHour < 0) ?
                resources.lblStartHourRequired : (registrationGroupValidations.startRegistrationTimeRangeError ?
                    resources.lblErrorTimesRange : undefined)
        );
    }
    const valueStartHour: string | number = (
        registrationGroup.startRegistrationHour !== null
            && registrationGroup.startRegistrationHour !== undefined ?
            registrationGroup.startRegistrationHour : ''
    );
    // #endregion Start Hour

    // #region Start Minute
    let errorStartMinute: boolean = false;
    let errorTextStartMinute: string | undefined;
    if (registrationGroupValidations.startRegistrationMinuteModified) {
        errorStartMinute = (
            registrationGroup.startRegistrationMinute === null
            || registrationGroup.startRegistrationMinute === undefined
            || registrationGroup.startRegistrationMinute < 0
        );
        errorTextStartMinute = errorStartMinute ?
            resources.lblStartMinuteRequired : undefined;
    }
    const valueStartMinute: string | number = (
        registrationGroup.startRegistrationMinute !== null
            && registrationGroup.startRegistrationMinute !== undefined ?
            registrationGroup.startRegistrationMinute : ''
    );
    // #endregion Start Minute

    // #endregion Start Criteria

    // #region End Criteria

    // #region End Type
    let errorEndType: boolean = false;
    let errorTextEndType: string | undefined;
    if (registrationGroupValidations.endRegistrationTypeModified) {
        errorEndType = !Boolean(registrationGroup.endRegistrationType);
        errorTextEndType = errorEndType ?
            resources.lblBaseDateRequired : undefined;
    }
    const valueEndType: string = registrationGroup.endRegistrationType;
    // #endregion End Type

    // #region End Date
    let errorEndDate: boolean = false;
    let errorTextEndDate: string | undefined;
    if (registrationGroupValidations.endRegistrationDateModified) {
        errorEndDate = (
            !Boolean(registrationGroup.endRegistrationDate)
            || registrationGroupValidations.endRegistrationDateInvalid
        );
        errorTextEndDate = (
            !Boolean(registrationGroup.endRegistrationDate) ?
                resources.lblDateRequired : (registrationGroupValidations.endRegistrationDateInvalid ?
                    Format.toString(resources.formatDateOutOfRange, [dateMinFormat, dateMaxFormat])
                    : undefined)
        );
    }
    const valueEndDate: string = registrationGroup.endRegistrationDate;
    // #endregion End Date

    // #region End Days
    let errorEndDays: boolean = false;
    let errorTextEndDays: string | undefined;
    if (registrationGroupValidations.endOffsetModified) {
        errorEndDays = (
            (registrationGroup.endOffset === undefined
                || registrationGroup.endOffset === null
                || registrationGroup.endOffset === '')
            || registrationGroupValidations.endOffsetInvalid
        );
        errorTextEndDays = (
            (registrationGroup.endOffset === undefined
                || registrationGroup.endOffset === null
                || registrationGroup.endOffset === '') ?
                resources.lblDaysFromBaseDateRequired : (registrationGroupValidations.endOffsetInvalid ?
                    resources.lblInvalidDaysFromBaseDate : undefined)
        );
    }
    const valueEndDays: string = (
        (registrationGroup.endOffset !== undefined
            && registrationGroup.endOffset !== null
            && registrationGroup.endOffset !== '') ?
            registrationGroup.endOffset.toString() : ''
    );
    // #endregion End Days

    // #region End Hour
    let errorEndHour: boolean = false;
    let errorTextEndHour: string | undefined;
    if (registrationGroupValidations.endRegistrationHourModified) {
        errorEndHour = (
            registrationGroup.endRegistrationHour === null
            || registrationGroup.endRegistrationHour === undefined
            || registrationGroup.endRegistrationHour < 0
        );
        errorTextEndHour = errorEndHour ?
            resources.lblEndHourRequired : undefined;
    }
    const valueEndHour: string | number = (
        registrationGroup.endRegistrationHour !== null
            && registrationGroup.endRegistrationHour !== undefined ?
            registrationGroup.endRegistrationHour : ''
    );
    // #endregion End Hour

    // #region End Minute
    let errorEndMinute: boolean = false;
    let errorTextEndMinute: string | undefined;
    if (registrationGroupValidations.endRegistrationMinuteModified) {
        errorEndMinute = (
            registrationGroup.endRegistrationMinute === null
            || registrationGroup.endRegistrationMinute === undefined
            || registrationGroup.endRegistrationMinute < 0
        );
        errorTextEndMinute = errorEndMinute ?
            resources.lblEndMinuteRequired : undefined;
    }
    const valueEndMinute: string | number = (
        registrationGroup.endRegistrationMinute !== null
            && registrationGroup.endRegistrationMinute !== undefined ?
            registrationGroup.endRegistrationMinute : ''
    );
    // #endregion End Minute

    // #endregion End Criteria

    return (
        <>
            {registrationGroup.id > 0 ? (
                <>
                    <Grid container>
                        <Grid item xs>
                            <Text size="h2">
                                {Format.toString(resources.formatTitleEditing, [registrationGroup.nameOriginal])}
                            </Text>
                        </Grid>
                    </Grid>
                    <br />
                </>
            ) : undefined}
            <Grid container>
                <Grid item xs>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Text size="h3">
                                {resources.lblGeneralInformation}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <TextField
                                error={errorName}
                                helperText={errorTextName}
                                id="txtGroupName"
                                label={resources.lblGroupName}
                                maxCharacters={30}
                                required
                                value={valueName}
                                onChange={onChangeTextField}
                                onBlur={onBlurName}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
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
                    </Grid>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={4} md={2}>
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
                        <Grid item xs={12} sm={8} md={10}>
                            <Checkbox
                                checked={registrationGroup.isActive}
                                id="chkActive"
                                label={resources.lblActive}
                                onChange={onChangeCheckbox}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Text size="h4">
                                {resources.lblAdvisorApprovals}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Checkbox
                                checked={registrationGroup.authorizationRequired}
                                id="chkAdvisorAuthorization"
                                label={resources.lblAdvisorAuthorization}
                                onChange={onChangeCheckbox}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Checkbox
                                checked={registrationGroup.advisorApprovalRequired}
                                id="chkAdvisorApproval"
                                label={resources.lblCourseAdvisorApproval}
                                onChange={onChangeCheckbox}
                            />
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Checkbox
                                checked={registrationGroup.dropApprovalRequired}
                                id="chkDropAdvisorApproval"
                                label={resources.lblDropAdvisorApproval}
                                onChange={onChangeCheckbox}
                            />
                        </Grid>
                    </Grid>
                    <Divider />
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Text size="h3">
                                {resources.lblRegistrationCriteria}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Text size="h4">
                                {resources.lblStartRegistrationCriteria}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={4}>
                            <Dropdown
                                error={errorStartType}
                                helperText={errorTextStartType}
                                id="ddlBaseDateStart"
                                label={resources.lblBaseDate}
                                options={dateBasesOptions}
                                required
                                value={valueStartType}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        {registrationGroup.startRegistrationType === 'EXACT' ? (
                            <Grid item xs={12} sm={6} md={4}>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    flip
                                    format={cultures.shortDatePattern}
                                    error={errorStartDate}
                                    helperText={errorTextStartDate}
                                    id="dtpStartDate"
                                    label={resources.lblDate}
                                    required
                                    value={valueStartDate}
                                    onChange={onChangeDatePicker}
                                />
                                {registrationGroupValidations.startRegistrationDateWarningPre ? (
                                    <Text
                                        color="textSecondary"
                                        display="inline"
                                    >
                                        {resources.lblWarningPreRegistrationDate}
                                    </Text>
                                ) : undefined}
                                {registrationGroupValidations.startRegistrationDateWarning ? (
                                    <Text
                                        color="textSecondary"
                                        display="inline"
                                    >
                                        {resources.lblWarningRegistrationDate}
                                    </Text>
                                ) : undefined}
                            </Grid>
                        ) : (
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        error={errorStartDays}
                                        helperText={errorTextStartDays}
                                        id="txtStartOffset"
                                        label={resources.lblDaysFromBaseDate}
                                        maxCharacters={11}
                                        required
                                        value={valueStartDays}
                                        onChange={onChangeTextField}
                                    />
                                </Grid>
                            )}
                        <Grid item xs={12} sm={3} md={2}>
                            <Dropdown
                                emptyOption={emptyNumericOption}
                                error={errorStartHour}
                                helperText={errorTextStartHour}
                                id="ddlStartHour"
                                label={resources.lblStartHour}
                                options={hours}
                                required
                                value={valueStartHour}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={2}>
                            <Dropdown
                                emptyOption={emptyNumericOption}
                                error={errorStartMinute}
                                helperText={errorTextStartMinute}
                                id="ddlStartMinute"
                                label={resources.lblStartMinute}
                                options={minutes}
                                required
                                value={valueStartMinute}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} md={6}>
                            <Text size="h4">
                                {resources.lblEndRegistrationCriteria}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={4}>
                            <Dropdown
                                error={errorEndType}
                                helperText={errorTextEndType}
                                id="ddlBaseDateEnd"
                                label={resources.lblBaseDate}
                                options={dateBasesOptions}
                                required
                                onChange={onChangeDropdown}
                                value={valueEndType}
                            />
                        </Grid>
                        {registrationGroup.endRegistrationType === 'EXACT' ? (
                            <Grid item xs={12} sm={6} md={4}>
                                <DatePicker
                                    culture={cultures.dateTimeCulture}
                                    flip
                                    format={cultures.shortDatePattern}
                                    error={errorEndDate}
                                    helperText={errorTextEndDate}
                                    id="dtpEndDate"
                                    label={resources.lblDate}
                                    required
                                    value={valueEndDate}
                                    onChange={onChangeDatePicker}
                                />
                                {registrationGroupValidations.endRegistrationDateWarningPre ? (
                                    <Text
                                        color="textSecondary"
                                        display="inline"
                                    >
                                        {resources.lblWarningPreRegistrationDate}
                                    </Text>
                                ) : undefined}
                                {registrationGroupValidations.endRegistrationDateWarning ? (
                                    <Text
                                        color="textSecondary"
                                        display="inline"
                                    >
                                        {resources.lblWarningRegistrationDate}
                                    </Text>
                                ) : undefined}
                            </Grid>
                        ) : (
                                <Grid item xs={12} sm={6} md={4}>
                                    <TextField
                                        error={errorEndDays}
                                        helperText={errorTextEndDays}
                                        id="txtEndOffset"
                                        label={resources.lblDaysFromBaseDate}
                                        maxCharacters={11}
                                        required
                                        value={valueEndDays}
                                        onChange={onChangeTextField}
                                    />
                                </Grid>
                            )}
                        <Grid item xs={12} sm={3} md={2}>
                            <Dropdown
                                emptyOption={emptyNumericOption}
                                error={errorEndHour}
                                helperText={errorTextEndHour}
                                id="ddlEndHour"
                                label={resources.lblEndHour}
                                options={hours}
                                required
                                value={valueEndHour}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                        <Grid item xs={12} sm={3} md={2}>
                            <Dropdown
                                emptyOption={emptyNumericOption}
                                error={errorEndMinute}
                                helperText={errorTextEndMinute}
                                id="ddlEndMinute"
                                label={resources.lblEndMinute}
                                options={minutes}
                                required
                                value={valueEndMinute}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs>
                    <ButtonGroup id="btgRegistrationGroup">
                        <Button
                            id="btnSaveRegistrationGroup"
                            onClick={onSave}
                        >
                            {resources.btnSave}
                        </Button>
                        <Button
                            color="secondary"
                            id="btnCancelRegistrationGroup"
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
export default RegistrationGroupsEdit;