/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File:EditActivitiesModal.tsx
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
export interface IActivitiesEditModalProps {
    activityType: number;
    editActivitySetupItems: IAssignments;
    dateTimeCulture: string;
    gradeActivity: IDropDownOption[];
    isActivityTypeRequired: boolean;
    isMidterm: boolean;
    isPossiblePoints: boolean;
    isTitleRequired: boolean;
    isValidDueDate: boolean;
    isValidName: boolean;
    isViewActivity: boolean;
    open: boolean;
    resources: IActivitiesEditModalResProps;
    sectionId: string;
    sectionName: string;
    shortDatePattern: string;
    weightType: number;
    onClose: () => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDateTimeChange?: (date: string, id: string, isValid: boolean) => void;
    onDropdownChange: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChange: (event: any) => void;
    onSaveActivity: () => void;
}

export interface IActivitiesEditModalResProps {
    btnSave: string;
    formatEdit: string;
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
    lblGeneral: string;
    lblHelperText: string;
    lblMidtermWeight: string;
    lblPossiblePoints: string;
    lblPossiblePointsValidate: string;
    lblSelectActivity: string;
    lblSelectDate: string;
    lblTitle: string;
    lblTitleRequired: string;
}

const styles = () => createStyles({
    marginLeft: {
        marginLeft: Tokens.sizingLarge
    },
    marginLeftTextBox: {
        marginLeft: Tokens.sizingLarge
    },
    marginTopErrorOne: {
        marginLeft: Tokens.sizingLarge,
        marginTop: `-${Tokens.spacing60}`
    },
    marginTopErrorTwo: {
        marginLeft: Tokens.sizingLarge,
        marginTop: '-4rem'
    },
    marginTopOne: {
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

type PropsWithStyles = IActivitiesEditModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ActivitiesEditModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        activityType,
        editActivitySetupItems,
        classes,
        dateTimeCulture,
        gradeActivity,
        isActivityTypeRequired,
        isMidterm,
        isPossiblePoints,
        isTitleRequired,
        isValidDueDate,
        isValidName,
        isViewActivity,
        open,
        resources,
        sectionId,
        sectionName,
        weightType,
        shortDatePattern,
        onCheckboxChange,
        onDateTimeChange,
        onDropdownChange,
        onTextFieldChange,
        onClose,
        onSaveActivity
    } = props;

    const emptyOption: IDropDownOption = {
        description: resources.lblSelectActivity,
        value: ''
    };

    return (
        <Modal
            disableHeaderTypography
            id="activitiesEditModal"
            footer={(
                <Button
                    disabled={isViewActivity}
                    id="btnSave"
                    onClick={onSaveActivity}
                >
                    {resources.btnSave}
                </Button>
            )}
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatEdit, [sectionId, sectionName])}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Hidden smDown>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            disabled={isViewActivity}
                            error={isValidName || isTitleRequired}
                            helperText={isValidName ? resources.lblHelperText : isTitleRequired ? resources.lblTitleRequired : undefined}
                            id="txtTitle"
                            label={resources.lblTitle}
                            required
                            type="text"
                            value={editActivitySetupItems ? editActivitySetupItems.title : undefined}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6} md={5} className={classes.marginLeft}>
                        {isMidterm ?
                            weightType === 2 ?
                                (
                                    <TextField
                                        disabled={isViewActivity}
                                        id="txtMidtermWeight"
                                        label={resources.lblMidtermWeight}
                                        numeric
                                        type="text"
                                        value={editActivitySetupItems ? editActivitySetupItems.midtermWeight : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                )
                                :
                                (
                                    <Checkbox
                                        disabled={isViewActivity}
                                        id="chkCountsTowardMidterm"
                                        checked={editActivitySetupItems.midtermWeight === 1 ? true : false}
                                        label={resources.lblCountsTowardMidterm}
                                        onChange={onCheckboxChange}
                                    />
                                )
                            : weightType === 2 ?
                                (
                                    <TextField
                                        disabled={isViewActivity}
                                        id="txtFinalWeight"
                                        label={resources.lblFinalWeight}
                                        numeric
                                        type="text"
                                        value={editActivitySetupItems ? editActivitySetupItems.finalWeight : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                )
                                :
                                (
                                    <Checkbox
                                        disabled={isViewActivity}
                                        id="chkCountsTowardFinal"
                                        checked={editActivitySetupItems.finalWeight === 1 ? true : false}
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
                            disabled={isViewActivity}
                            emptyOption={emptyOption}
                            error={isActivityTypeRequired}
                            helperText={isActivityTypeRequired ? resources.lblActivityTypeRequired : undefined}
                            id="ddlActivityType"
                            label={resources.lblActivityType}
                            required
                            options={gradeActivity}
                            value={editActivitySetupItems.type ? editActivitySetupItems.type : activityType}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                    {weightType === 2 ?
                        (
                            <Grid
                                item
                                className={isValidName || isTitleRequired ? classes.marginTopOne : classes.marginLeftTextBox}
                                xs={12}
                                sm={6}
                                md={4}
                            >
                                {isMidterm ?
                                    (
                                        <TextField
                                            disabled={isViewActivity}
                                            id="txtFinalWeight"
                                            label={resources.lblFinalWeight}
                                            numeric
                                            type="text"
                                            value={editActivitySetupItems ? editActivitySetupItems.finalWeight : undefined}
                                            onChange={onTextFieldChange}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            id="chkExtraCredit"
                                            disabled={isViewActivity}
                                            checked={editActivitySetupItems ? editActivitySetupItems.isExtraCredit : false}
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
                                className={isValidName || isTitleRequired ? classes.marginTopErrorOne : classes.marginTopOne}
                                xs={12}
                                sm={6}
                                md={4}
                            >
                                {isMidterm ?
                                    (
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkCountsTowardFinal"
                                            checked={editActivitySetupItems.finalWeight === 1 ? true : false}
                                            label={resources.lblCountsTowardFinal}
                                            onChange={onCheckboxChange}
                                        />
                                    )
                                    : (
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkExtraCredit"
                                            checked={editActivitySetupItems ? editActivitySetupItems.isExtraCredit : false}
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
                            disabled={isViewActivity}
                            id="txtDescription"
                            label={resources.lblDescription}
                            multiline
                            type="text"
                            value={editActivitySetupItems ? editActivitySetupItems.description : undefined}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                    {isMidterm ?
                        weightType === 2 ?
                            (
                                <Grid
                                    item
                                    className={isValidName || isTitleRequired ? classes.marginTopOne : classes.marginLeftTextBox}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <Checkbox
                                        disabled={isViewActivity}
                                        id="chkExtraCredit"
                                        checked={editActivitySetupItems ? editActivitySetupItems.isExtraCredit : false}
                                        label={resources.lblExtraCredit}
                                        onChange={onCheckboxChange}
                                    />
                                </Grid>
                            )
                            :
                            (
                                <Grid
                                    item
                                    className={isValidName || isTitleRequired ? classes.marginTopErrorTwo : classes.marginTopTwo}
                                    xs={12}
                                    sm={6}
                                    md={4}
                                >
                                    <Checkbox
                                        disabled={isViewActivity}
                                        id="chkExtraCredit"
                                        checked={editActivitySetupItems ? editActivitySetupItems.isExtraCredit : false}
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
                            disabled={isViewActivity}
                            error={isPossiblePoints}
                            helperText={isPossiblePoints ? resources.lblPossiblePointsValidate : undefined}
                            id="txtPossiblePoints"
                            label={resources.lblPossiblePoints}
                            numeric
                            type="text"
                            value={editActivitySetupItems ? editActivitySetupItems.possiblePoints : undefined}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <DatePicker
                            culture={dateTimeCulture}
                            disabled={isViewActivity}
                            flip
                            format={shortDatePattern}
                            id="dtpAssigned"
                            label={resources.lblAssigned}
                            value={editActivitySetupItems ?
                                Format.toDatePicker(shortDatePattern, editActivitySetupItems.assignedDate) : resources.lblSelectDate}
                            onChange={onDateTimeChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <DatePicker
                            culture={dateTimeCulture}
                            disabled={isViewActivity}
                            flip
                            format={shortDatePattern}
                            error={!isValidDueDate}
                            helperText={!isValidDueDate ? resources.lblDueValidate : undefined}
                            id="dtpDue"
                            label={resources.lblDue}
                            value={editActivitySetupItems ?
                                Format.toDatePicker(shortDatePattern, editActivitySetupItems.dueDate) : resources.lblSelectDate}
                            onChange={onDateTimeChange}
                        />
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden mdUp>
                <Grid container>
                    <Grid item>
                        <Text size="h3">
                            {resources.lblGeneral}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            disabled={isViewActivity}
                            error={isValidName || isTitleRequired}
                            helperText={isValidName ? resources.lblHelperText : isTitleRequired ? resources.lblTitleRequired : undefined}
                            id="txtTitle"
                            label={resources.lblTitle}
                            required
                            type="text"
                            value={editActivitySetupItems ? editActivitySetupItems.title : undefined}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <Dropdown
                            disabled={isViewActivity}
                            emptyOption={emptyOption}
                            error={isActivityTypeRequired}
                            helperText={isActivityTypeRequired ? resources.lblActivityTypeRequired : undefined}
                            id="ddlActivityType"
                            label={resources.lblActivityType}
                            required
                            options={gradeActivity}
                            value={activityType}
                            onChange={onDropdownChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            disabled={isViewActivity}
                            id="txtDescription"
                            label={resources.lblDescription}
                            multiline
                            type="text"
                            value={editActivitySetupItems ? editActivitySetupItems.description : undefined}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <TextField
                            disabled={isViewActivity}
                            error={isPossiblePoints}
                            helperText={isPossiblePoints ? resources.lblPossiblePointsValidate : undefined}
                            id="txtPossiblePoints"
                            label={resources.lblPossiblePoints}
                            type="text"
                            value={editActivitySetupItems ? editActivitySetupItems.possiblePoints : undefined}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <DatePicker
                            culture={dateTimeCulture}
                            disabled={isViewActivity}
                            flip
                            format={shortDatePattern}
                            id="dtpAssigned"
                            label={resources.lblAssigned}
                            value={editActivitySetupItems ?
                                Format.toDatePicker(shortDatePattern, editActivitySetupItems.assignedDate) : resources.lblSelectDate}
                            onChange={onDateTimeChange}
                        />
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12} sm={6} md={6}>
                        <DatePicker
                            culture={dateTimeCulture}
                            disabled={isViewActivity}
                            flip
                            format={shortDatePattern}
                            error={!isValidDueDate}
                            helperText={!isValidDueDate ? resources.lblDueValidate : undefined}
                            id="dtpDue"
                            label={resources.lblDue}
                            value={editActivitySetupItems ?
                                Format.toDatePicker(shortDatePattern, editActivitySetupItems.dueDate) : resources.lblSelectDate}
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
                                        disabled={isViewActivity}
                                        id="txtMidtermWeight"
                                        label={resources.lblMidtermWeight}
                                        type="text"
                                        value={editActivitySetupItems ? editActivitySetupItems.midtermWeight : undefined}
                                        onChange={onTextFieldChange}
                                    />
                                )
                                :
                                (
                                    <Checkbox
                                        disabled={isViewActivity}
                                        id="chkCountsTowardMidterm"
                                        checked={editActivitySetupItems ? editActivitySetupItems.countsForMidterm : false}
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
                                    disabled={isViewActivity}
                                    id="txtFinalWeight"
                                    label={resources.lblFinalWeight}
                                    type="text"
                                    value={editActivitySetupItems ? editActivitySetupItems.finalWeight : undefined}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        )
                        :
                        (
                            <Grid item xs={12} sm={6} md={4}>
                                <Checkbox
                                    id="chkCountsTowardFinal"
                                    checked={editActivitySetupItems ? editActivitySetupItems.countsForFinal : false}
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
                                    disabled={isViewActivity}
                                    id="chkExtraCredit"
                                    checked={editActivitySetupItems ? editActivitySetupItems.isExtraCredit : false}
                                    label={resources.lblExtraCredit}
                                    onChange={onCheckboxChange}
                                />
                            </Grid>
                        )
                        :
                        (
                            <Grid item xs={12} sm={6} md={4}>
                                <Checkbox
                                    disabled={isViewActivity}
                                    id="chkExtraCredit"
                                    checked={editActivitySetupItems ? editActivitySetupItems.isExtraCredit : false}
                                    label={resources.lblExtraCredit}
                                    onChange={onCheckboxChange}
                                />
                            </Grid>
                        )
                    }
                </Grid>
            </Hidden>
        </Modal>
    );

};
// #endregion

export default withStyles(styles)(ActivitiesEditModal);