/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File:ActivitiesAddModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import DatePicker from '@hedtech/powercampus-design-system/react/core/DatePicker';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IAssignments } from '../../../Types/Section/IAssignments';
// #endregion

// #region Internal types
export interface IActivitiesAddModalProps {
    activitySetupItems: IAssignments;
    activityType: number;
    copyActivities: IAssignments;
    dateTimeCulture: string;
    gradeActivity: IDropDownOption[];
    isActivityTypeRequired: boolean;
    isCopyActivity: boolean;
    isMidterm: boolean;
    isPossiblePoints: boolean;
    isTitleRequired: boolean;
    isValidDueDate: boolean;
    isValidName: boolean;
    open: boolean;
    resources: IActivitiesAddModalResProps;
    sectionId: string;
    sectionName: string;
    shortDatePattern: string;
    weightType: number;
    onClose: () => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDateTimeChange?: (date: string, id: string, isValid: boolean) => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChange: (event: any) => void;
    onTextFieldChangeCopy: (event: any) => void;
    onSaveActivity: () => void;
    onSaveCopy: () => void;
}

export interface IActivitiesAddModalResProps {
    btnSave: string;
    formatAdd: string;
    lblActivityType: string;
    lblActivityTypeRequired: string;
    lblAssigned: string;
    lblCountsTowardFinal: string;
    lblCountsTowardMidterm: string;
    lblDescription: string;
    lblDue: string;
    lblDueValidate: string;
    lblExtraCredit: string;
    lblFinalWeight: string;
    lblHelperText: string;
    lblMidtermWeight: string;
    lblPossiblePoints: string;
    lblPossiblePointsValidate: string;
    lblSelectActivity: string;
    lblTitle: string;
    lblTitleRequired: string;
}

const styles = () => createStyles({
    marginErrorOne: {
        marginLeft: Tokens.sizingLarge,
        marginTop: `-${Tokens.spacing60}`
    },
    marginErrorTwo: {
        marginLeft: Tokens.sizingLarge,
        marginTop: '-4rem'
    },
    marginLeft: {
        marginLeft: Tokens.sizingLarge
    },
    marginLeftBox: {
        marginLeft: Tokens.sizingLarge
    },
    marginOne: {
        marginLeft: Tokens.sizingLarge,
        marginTop: '-1rem'
    },
    marginTopTextBox: {
        marginTop: '-1rem'
    },
    marginTopTwo: {
        marginLeft: Tokens.sizingLarge,
        marginTop: `-${Tokens.spacing60}`
    }
});

type PropsWithStyles = IActivitiesAddModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ActivitiesAddModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        activitySetupItems,
        activityType,
        classes,
        copyActivities,
        dateTimeCulture,
        gradeActivity,
        isActivityTypeRequired,
        isCopyActivity,
        isMidterm,
        isPossiblePoints,
        isTitleRequired,
        isValidDueDate,
        isValidName,
        open,
        resources,
        sectionId,
        sectionName,
        shortDatePattern,
        weightType,
        onCheckboxChange,
        onDateTimeChange,
        onDropdownChange,
        onTextFieldChange,
        onTextFieldChangeCopy,
        onClose,
        onSaveActivity,
        onSaveCopy
    } = props;

    const emptyOption: IDropDownOption = {
        description: resources.lblSelectActivity,
        value: ''
    };

    return (
        <Modal
            disableHeaderTypography
            id="activitiesAddModal"
            footer={(
                <Button
                    id="btnSave"
                    onClick={isCopyActivity ? onSaveCopy : onSaveActivity}
                >
                    {resources.btnSave}
                </Button>
            )}
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatAdd, [sectionId, sectionName])}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            {isCopyActivity ? (
                <>
                    <Hidden smDown>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    error={isValidName || isTitleRequired}
                                    helperText={isValidName ? resources.lblHelperText : isTitleRequired ? resources.lblTitleRequired : undefined}
                                    id="txtTitle"
                                    label={resources.lblTitle}
                                    required
                                    type="text"
                                    value={copyActivities ? copyActivities.title : undefined}
                                    onChange={onTextFieldChangeCopy}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={5} className={classes.marginLeft}>
                                {isMidterm ?
                                    weightType === 2 ?
                                        (
                                            <TextField
                                                id="txtMidtermWeight"
                                                label={resources.lblMidtermWeight}
                                                numeric
                                                type="text"
                                                value={copyActivities ? copyActivities.midtermWeight : undefined}
                                                onChange={onTextFieldChangeCopy}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                id="chkCountsTowardMidterm"
                                                checked={copyActivities ? copyActivities.countsForMidterm : false}
                                                label={resources.lblCountsTowardMidterm}
                                                onChange={onCheckboxChange}
                                            />
                                        )
                                    :
                                    weightType === 2 ?
                                        (
                                            <TextField
                                                id="txtFinalWeight"
                                                label={resources.lblFinalWeight}
                                                numeric
                                                type="text"
                                                value={copyActivities ? copyActivities.finalWeight : undefined}
                                                onChange={onTextFieldChangeCopy}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                id="chkCountsTowardFinal"
                                                checked={copyActivities ? copyActivities.countsForFinal : false}
                                                label={resources.lblCountsTowardFinal}
                                                onChange={onCheckboxChange}
                                            />
                                        )
                                }
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={isActivityTypeRequired}
                                    helperText={isActivityTypeRequired ? resources.lblActivityTypeRequired : undefined}
                                    id="ddlActivityType"
                                    label={resources.lblActivityType}
                                    required
                                    options={gradeActivity}
                                    value={copyActivities.type ? copyActivities.type : activityType}
                                    onChange={onDropdownChange}
                                />
                            </Grid>
                            {weightType === 2 ?
                                (
                                    <Grid
                                        item
                                        className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}
                                        xs={12}
                                        sm={6}
                                        md={4}
                                    >
                                        {isMidterm ?
                                            (
                                                <TextField
                                                    id="txtFinalWeight"
                                                    label={resources.lblFinalWeight}
                                                    numeric
                                                    type="text"
                                                    value={copyActivities ? copyActivities.finalWeight : undefined}
                                                    onChange={onTextFieldChangeCopy}
                                                />
                                            )
                                            : (
                                                <Checkbox
                                                    id="chkExtraCredit"
                                                    checked={copyActivities ? copyActivities.isExtraCredit : false}
                                                    label={resources.lblExtraCredit}
                                                    onChange={onCheckboxChange}
                                                />
                                            )
                                        }
                                    </Grid>
                                )
                                :
                                (
                                    <Grid
                                        item
                                        className={isValidName || isTitleRequired ? classes.marginErrorOne : classes.marginOne}
                                        xs={12}
                                        sm={6}
                                        md={4}
                                    >
                                        {isMidterm ?
                                            (
                                                <Checkbox
                                                    id="chkCountsTowardFinal"
                                                    checked={copyActivities ? copyActivities.countsForFinal : false}
                                                    label={resources.lblCountsTowardFinal}
                                                    onChange={onCheckboxChange}
                                                />
                                            )
                                            : (
                                                <Checkbox
                                                    id="chkExtraCredit"
                                                    checked={copyActivities ? copyActivities.isExtraCredit : false}
                                                    label={resources.lblExtraCredit}
                                                    onChange={onCheckboxChange}
                                                />
                                            )
                                        }
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    id="txtDescription"
                                    label={resources.lblDescription}
                                    multiline
                                    type="text"
                                    value={copyActivities ? copyActivities.description : undefined}
                                    onChange={onTextFieldChangeCopy}
                                />
                            </Grid>
                            {isMidterm ?
                                weightType === 2 ?
                                    (
                                        <Grid
                                            item
                                            className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}
                                            xs={12}
                                            sm={6}
                                            md={4}
                                        >
                                            <Checkbox
                                                id="chkExtraCredit"
                                                checked={copyActivities ? copyActivities.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChange}
                                            />
                                        </Grid>
                                    )
                                    :
                                    (
                                        <Grid
                                            item
                                            className={isValidName || isTitleRequired ? classes.marginErrorTwo : classes.marginTopTwo}
                                            xs={12}
                                            sm={6}
                                            md={4}
                                        >
                                            <Checkbox
                                                id="chkExtraCredit"
                                                checked={copyActivities ? copyActivities.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChange}
                                            />
                                        </Grid>
                                    )
                                : undefined}
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    error={isPossiblePoints}
                                    helperText={isPossiblePoints ? resources.lblPossiblePointsValidate : undefined}
                                    id="txtPossiblePoints"
                                    label={resources.lblPossiblePoints}
                                    numeric
                                    type="text"
                                    value={copyActivities ? copyActivities.possiblePoints : undefined}
                                    onChange={onTextFieldChangeCopy}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <DatePicker
                                    culture={dateTimeCulture}
                                    flip
                                    format={shortDatePattern}
                                    id="dtpAssigned"
                                    label={resources.lblAssigned}
                                    value={copyActivities ? Format.toDatePicker(shortDatePattern, copyActivities.assignedDate) : undefined}
                                    onChange={onDateTimeChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <DatePicker
                                    culture={dateTimeCulture}
                                    flip
                                    format={shortDatePattern}
                                    error={!isValidDueDate}
                                    helperText={!isValidDueDate ? resources.lblDueValidate : undefined}
                                    id="dtpDue"
                                    label={resources.lblDue}
                                    value={copyActivities ? Format.toDatePicker(shortDatePattern, copyActivities.dueDate) : undefined}
                                    onChange={onDateTimeChange}
                                />
                            </Grid>
                        </Grid>
                    </Hidden>
                    <Hidden mdUp>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    error={isValidName || isTitleRequired}
                                    helperText={isValidName ? resources.lblHelperText : isTitleRequired ? resources.lblTitleRequired : undefined}
                                    id="txtTitle"
                                    label={resources.lblTitle}
                                    required
                                    type="text"
                                    value={copyActivities ? copyActivities.title : undefined}
                                    onChange={onTextFieldChangeCopy}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={isActivityTypeRequired}
                                    helperText={isActivityTypeRequired ? resources.lblActivityTypeRequired : undefined}
                                    id="ddlActivityType"
                                    label={resources.lblActivityType}
                                    required
                                    options={gradeActivity}
                                    value={copyActivities.type ? copyActivities.type : activityType}
                                    onChange={onDropdownChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    id="txtDescription"
                                    label={resources.lblDescription}
                                    multiline
                                    type="text"
                                    value={copyActivities ? copyActivities.description : undefined}
                                    onChange={onTextFieldChangeCopy}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <TextField
                                    error={isPossiblePoints}
                                    helperText={isPossiblePoints ? resources.lblPossiblePointsValidate : undefined}
                                    id="txtPossiblePoints"
                                    label={resources.lblPossiblePoints}
                                    type="text"
                                    value={copyActivities ? copyActivities.possiblePoints : undefined}
                                    onChange={onTextFieldChangeCopy}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <DatePicker
                                    culture={dateTimeCulture}
                                    format={shortDatePattern}
                                    id="dtpAssigned"
                                    label={resources.lblAssigned}
                                    value={copyActivities ? Format.toDatePicker(shortDatePattern, copyActivities.assignedDate) : undefined}
                                    onChange={onDateTimeChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={6}>
                                <DatePicker
                                    culture={dateTimeCulture}
                                    format={shortDatePattern}
                                    error={!isValidDueDate}
                                    helperText={!isValidDueDate ? resources.lblDueValidate : undefined}
                                    id="dtpDue"
                                    label={resources.lblDue}
                                    value={copyActivities ? Format.toDatePicker(shortDatePattern, copyActivities.dueDate) : undefined}
                                    onChange={onDateTimeChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} md={4}>
                                {
                                    weightType === 2 ?
                                        (
                                            <TextField
                                                id="txtMidtermWeight"
                                                label={resources.lblMidtermWeight}
                                                type="text"
                                                value={copyActivities ? copyActivities.midtermWeight : undefined}
                                                onChange={onTextFieldChangeCopy}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                id="chkCountsTowardMidterm"
                                                checked={copyActivities ? copyActivities.countsForMidterm : false}
                                                label={resources.lblCountsTowardMidterm}
                                                onChange={onCheckboxChange}
                                            />
                                        )
                                }
                            </Grid>
                        </Grid>
                        <Grid container>
                            {weightType === 2 ?
                                (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <TextField
                                            id="txtFinalWeight"
                                            label={resources.lblFinalWeight}
                                            type="text"
                                            value={copyActivities ? copyActivities.finalWeight : undefined}
                                            onChange={onTextFieldChangeCopy}
                                        />
                                    </Grid>
                                )
                                :
                                (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Checkbox
                                            id="chkCountsTowardFinal"
                                            checked={copyActivities ? copyActivities.countsForFinal : false}
                                            label={resources.lblCountsTowardFinal}
                                            onChange={onCheckboxChange}
                                        />
                                    </Grid>
                                )
                            }
                        </Grid>
                        <Grid container>
                            {weightType === 2 ?
                                (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Checkbox
                                            id="chkExtraCredit"
                                            checked={copyActivities ? copyActivities.isExtraCredit : false}
                                            label={resources.lblExtraCredit}
                                            onChange={onCheckboxChange}
                                        />
                                    </Grid>
                                )
                                :
                                (
                                    <Grid item xs={12} sm={6} md={4}>
                                        <Checkbox
                                            id="chkExtraCredit"
                                            checked={copyActivities ? copyActivities.isExtraCredit : false}
                                            label={resources.lblExtraCredit}
                                            onChange={onCheckboxChange}
                                        />
                                    </Grid>
                                )
                            }
                        </Grid>
                    </Hidden>
                </>
            ) : (
                    <>
                        <Hidden smDown>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        error={isValidName || isTitleRequired}
                                        helperText={isValidName ? resources.lblHelperText : isTitleRequired ? resources.lblTitleRequired : undefined}
                                        id="txtTitle"
                                        label={resources.lblTitle}
                                        required
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.title : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6} md={5} className={classes.marginLeft}>
                                    {isMidterm ?
                                        weightType === 2 ?
                                            (
                                                <TextField
                                                    id="txtMidtermWeight"
                                                    label={resources.lblMidtermWeight}
                                                    numeric
                                                    type="text"
                                                    value={activitySetupItems ? activitySetupItems.midtermWeight : undefined}
                                                    onChange={onTextFieldChange}
                                                />
                                            )
                                            :
                                            (
                                                <Checkbox
                                                    id="chkCountsTowardMidterm"
                                                    checked={activitySetupItems ? activitySetupItems.countsForMidterm : false}
                                                    label={resources.lblCountsTowardMidterm}
                                                    onChange={onCheckboxChange}
                                                />
                                            )
                                        :
                                        weightType === 2 ?
                                            (
                                                <TextField
                                                    id="txtFinalWeight"
                                                    label={resources.lblFinalWeight}
                                                    numeric
                                                    type="text"
                                                    value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                                    onChange={onTextFieldChange}
                                                />
                                            )
                                            :
                                            (
                                                <Checkbox
                                                    id="chkCountsTowardFinal"
                                                    checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                                    label={resources.lblCountsTowardFinal}
                                                    onChange={onCheckboxChange}
                                                />
                                            )
                                    }
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        error={isActivityTypeRequired}
                                        helperText={isActivityTypeRequired ? resources.lblActivityTypeRequired : undefined}
                                        id="ddlActivityType"
                                        label={resources.lblActivityType}
                                        required
                                        options={gradeActivity}
                                        value={activitySetupItems ? activitySetupItems.type : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                                {weightType === 2 ?
                                    (
                                        <Grid item xs={12} sm={6} md={4} className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}>
                                            {isMidterm ?
                                                (
                                                    <TextField
                                                        id="txtFinalWeight"
                                                        label={resources.lblFinalWeight}
                                                        numeric
                                                        type="text"
                                                        value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                                        onChange={onTextFieldChange}
                                                    />
                                                )
                                                :
                                                (
                                                    <Checkbox
                                                        id="chkExtraCredit"
                                                        checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                        label={resources.lblExtraCredit}
                                                        onChange={onCheckboxChange}
                                                    />
                                                )
                                            }
                                        </Grid>
                                    )
                                    :
                                    (
                                        <Grid item xs={12} sm={6} md={4} className={isValidName || isTitleRequired ? classes.marginErrorOne : classes.marginOne}>
                                            {isMidterm ?
                                                (
                                                    <Checkbox
                                                        id="chkCountsTowardFinal"
                                                        checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                                        label={resources.lblCountsTowardFinal}
                                                        onChange={onCheckboxChange}
                                                    />
                                                )
                                                :
                                                (
                                                    <Checkbox
                                                        id="chkExtraCredit"
                                                        checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                        label={resources.lblExtraCredit}
                                                        onChange={onCheckboxChange}
                                                    />
                                                )}
                                        </Grid>
                                    )
                                }
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="txtDescription"
                                        label={resources.lblDescription}
                                        multiline
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.description : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                                {isMidterm ?
                                    weightType === 2 ?
                                        (
                                            <Grid item xs={12} sm={6} md={4} className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}>
                                                <Checkbox
                                                    id="chkExtraCredit"
                                                    checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                    label={resources.lblExtraCredit}
                                                    onChange={onCheckboxChange}
                                                />
                                            </Grid>
                                        )
                                        :
                                        (
                                            <Grid item xs={12} sm={6} md={4} className={isValidName || isTitleRequired ? classes.marginErrorTwo : classes.marginTopTwo}>
                                                <Checkbox
                                                    id="chkExtraCredit"
                                                    checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                    label={resources.lblExtraCredit}
                                                    onChange={onCheckboxChange}
                                                />
                                            </Grid>
                                        )
                                    : undefined}
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        error={isPossiblePoints}
                                        helperText={isPossiblePoints ? resources.lblPossiblePointsValidate : undefined}
                                        id="txtPossiblePoints"
                                        label={resources.lblPossiblePoints}
                                        numeric
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.possiblePoints : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <DatePicker
                                        culture={dateTimeCulture}
                                        flip
                                        format={shortDatePattern}
                                        id="dtpAssigned"
                                        label={resources.lblAssigned}
                                        value={activitySetupItems ? activitySetupItems.assignedDate : undefined}
                                        onChange={onDateTimeChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <DatePicker
                                        culture={dateTimeCulture}
                                        flip
                                        format={shortDatePattern}
                                        error={!isValidDueDate}
                                        helperText={!isValidDueDate ? resources.lblDueValidate : undefined}
                                        id="dtpDue"
                                        label={resources.lblDue}
                                        value={activitySetupItems ? activitySetupItems.dueDate : undefined}
                                        onChange={onDateTimeChange}
                                    />
                                </Grid>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        error={isValidName || isTitleRequired}
                                        helperText={isValidName ? resources.lblHelperText : isTitleRequired ? resources.lblTitleRequired : undefined}
                                        id="txtTitle"
                                        label={resources.lblTitle}
                                        required
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.title : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <Dropdown
                                        emptyOption={emptyOption}
                                        error={isActivityTypeRequired}
                                        helperText={isActivityTypeRequired ? resources.lblActivityTypeRequired : undefined}
                                        id="ddlActivityType"
                                        label={resources.lblActivityType}
                                        required
                                        options={gradeActivity}
                                        value={activitySetupItems ? activitySetupItems.type : undefined}
                                        onChange={onDropdownChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        id="txtDescription"
                                        label={resources.lblDescription}
                                        multiline
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.description : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <TextField
                                        error={isPossiblePoints}
                                        helperText={isPossiblePoints ? resources.lblPossiblePointsValidate : undefined}
                                        id="txtPossiblePoints"
                                        label={resources.lblPossiblePoints}
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.possiblePoints : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <DatePicker
                                        culture={dateTimeCulture}
                                        format={shortDatePattern}
                                        id="dtpAssigned"
                                        label={resources.lblAssigned}
                                        value={activitySetupItems ? activitySetupItems.assignedDate : undefined}
                                        onChange={onDateTimeChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={6}>
                                    <DatePicker
                                        culture={dateTimeCulture}
                                        format={shortDatePattern}
                                        error={!isValidDueDate}
                                        helperText={!isValidDueDate ? resources.lblDueValidate : undefined}
                                        id="dtpDue"
                                        label={resources.lblDue}
                                        value={activitySetupItems ? activitySetupItems.dueDate : undefined}
                                        onChange={onDateTimeChange}
                                    />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12} sm={6} md={4}>
                                    {isMidterm ?
                                        weightType === 2 ?
                                            (
                                                <TextField
                                                    id="txtMidtermWeight"
                                                    label={resources.lblMidtermWeight}
                                                    type="text"
                                                    value={activitySetupItems ? activitySetupItems.midtermWeight : undefined}
                                                    onChange={onTextFieldChange}
                                                />
                                            )
                                            :
                                            (
                                                <Checkbox
                                                    id="chkCountsTowardMidterm"
                                                    checked={activitySetupItems ? activitySetupItems.countsForMidterm : false}
                                                    label={resources.lblCountsTowardMidterm}
                                                    onChange={onCheckboxChange}
                                                />
                                            )
                                        : undefined}
                                </Grid>
                            </Grid>
                            <Grid container>
                                {weightType === 2 ?
                                    (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <TextField
                                                id="txtFinalWeight"
                                                label={resources.lblFinalWeight}
                                                type="text"
                                                value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                                onChange={onTextFieldChange}
                                            />
                                        </Grid>
                                    )
                                    :
                                    (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Checkbox
                                                id="chkCountsTowardFinal"
                                                checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                                label={resources.lblCountsTowardFinal}
                                                onChange={onCheckboxChange}
                                            />
                                        </Grid>
                                    )
                                }
                            </Grid>
                            <Grid container>
                                {weightType === 2 ?
                                    (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Checkbox
                                                id="chkExtraCredit"
                                                checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChange}
                                            />
                                        </Grid>
                                    )
                                    :
                                    (
                                        <Grid item xs={12} sm={6} md={4}>
                                            <Checkbox
                                                id="chkExtraCredit"
                                                checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChange}
                                            />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </Hidden>
                    </>
                )}
        </Modal>
    );
};
// #endregion

export default withStyles(styles)(ActivitiesAddModal);