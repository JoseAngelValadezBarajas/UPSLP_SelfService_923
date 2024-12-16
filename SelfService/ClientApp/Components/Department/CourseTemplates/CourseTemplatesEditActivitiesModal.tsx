/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File:CourseTemplatesEditActivitiesModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Generic components
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
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ICourseTemplateAddActivities } from '../../../Types/Department/ICourseTemplateAddActivities';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';

// #endregion

// #region Internal types
export interface IEditActivitiesModalProps {
    activitySetupItems: ICourseTemplateAddActivities;
    courseTemplateName: string;
    cultures: ICultures;
    gradeActivity: IDropDownOption[];
    isActivityTypeRequired: boolean;
    isMidterm: boolean;
    isPossiblePoints: boolean;
    isTitleRequired: boolean;
    isValidDueDate: boolean;
    isValidName: boolean;
    isViewActivity: boolean;
    open: boolean;
    weightType: number;
    onClose: () => void;
    onCheckboxChangeEdit: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDateTimeChangeEdit: (date: string, id: string, isValid: boolean) => void;
    onDropdownChangeEdit: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChangeEdit: (event: any) => void;
    onSaveEditActitiy: () => void;
    resources: ICourseTemplatesResources;
}

const styles = () => createStyles({
    marginErrorOne: {
        marginLeft: Tokens.sizingLarge,
        marginTop: `-${Tokens.spacing60}`
    },
    marginErrT: {
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
    marginTopT: {
        marginLeft: Tokens.sizingLarge,
        marginTop: `-${Tokens.spacing60}`
    },
    marginTopTextBox: {
        marginTop: '-1rem'
    }
});

type PropsWithStyles = IEditActivitiesModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const EditActivitiesModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        activitySetupItems,
        classes,
        courseTemplateName,
        cultures,
        gradeActivity,
        isActivityTypeRequired,
        isMidterm,
        isPossiblePoints,
        isTitleRequired,
        isValidDueDate,
        isValidName,
        isViewActivity,
        open,
        weightType,
        onCheckboxChangeEdit,
        onDateTimeChangeEdit,
        onDropdownChangeEdit,
        onTextFieldChangeEdit,
        onClose,
        onSaveEditActitiy,

        resources
    } = props;

    let emptyOption: IDropDownOption;
    emptyOption = {
        description: resources.addActivitiesModal.lblSelectActivity,
        value: ''
    };

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            disableHeaderTypography
            id="activitiesAddModal"
            footer={(
                <Button
                    disabled={isViewActivity}
                    id="btnSave"
                    onClick={onSaveEditActitiy}
                >
                    {resources.btnSave}
                </Button>
            )}
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.addActivitiesModal.formatEdit, [courseTemplateName])}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <>
                <Hidden mdDown>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                disabled={isViewActivity}
                                error={isValidName || isTitleRequired}
                                helperText={isValidName ?
                                    resources.addActivitiesModal.lblHelperText : isTitleRequired ?
                                        resources.addActivitiesModal.lblTitleRequired : undefined}
                                id="txtAssignmentTitle"
                                label={resources.lblTitle}
                                required
                                type="text"
                                value={activitySetupItems.assignmentTitle}
                                onChange={onTextFieldChangeEdit}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={5} className={classes.marginLeft}>
                            {isMidterm ?
                                weightType === 2 ?
                                    (
                                        <TextField
                                            disabled={isViewActivity}
                                            id="txtMidtermWeight"
                                            label={resources.addActivitiesModal.lblMidtermWeight}
                                            numeric
                                            type="text"
                                            value={activitySetupItems ? activitySetupItems.midtermWeight : undefined}
                                            onChange={onTextFieldChangeEdit}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkCountsTowardMidterm"
                                            checked={activitySetupItems ? activitySetupItems.countsForMidterm : false}
                                            label={resources.addActivitiesModal.lblCountsTowardMidterm}
                                            onChange={onCheckboxChangeEdit}
                                        />
                                    )
                                :
                                weightType === 2 ?
                                    (
                                        <TextField
                                            disabled={isViewActivity}
                                            id="txtFinalWeight"
                                            label={resources.addActivitiesModal.lblFinalWeight}
                                            numeric
                                            type="text"
                                            value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                            onChange={onTextFieldChangeEdit}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkCountsTowardFinal"
                                            checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                            label={resources.addActivitiesModal.lblCountsTowardFinal}
                                            onChange={onCheckboxChangeEdit}
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
                                helperText={isActivityTypeRequired ? resources.addActivitiesModal.lblActivityTypeRequired : undefined}
                                id="ddlActivityType"
                                label={resources.addActivitiesModal.lblActivityType}
                                required
                                options={gradeActivity}
                                value={activitySetupItems ? activitySetupItems.assignmentTypeId : undefined}
                                onChange={onDropdownChangeEdit}
                            />
                        </Grid>
                        {weightType === 2 ?
                            (
                                <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}>
                                    {isMidterm ?
                                        (
                                            <TextField
                                                disabled={isViewActivity}
                                                id="txtFinalWeight"
                                                label={resources.addActivitiesModal.lblFinalWeight}
                                                numeric
                                                type="text"
                                                value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                                onChange={onTextFieldChangeEdit}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                disabled={isViewActivity}
                                                id="chkExtraCredit"
                                                checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChangeEdit}
                                            />
                                        )
                                    }
                                </Grid>
                            )
                            :
                            (
                                <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginErrorOne : classes.marginOne}>
                                    {isMidterm ?
                                        (
                                            <Checkbox
                                                disabled={isViewActivity}
                                                id="chkCountsTowardFinal"
                                                checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                                label={resources.addActivitiesModal.lblCountsTowardFinal}
                                                onChange={onCheckboxChangeEdit}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                disabled={isViewActivity}
                                                id="chkExtraCredit"
                                                checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChangeEdit}
                                            />
                                        )}
                                </Grid>
                            )
                        }
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                disabled={isViewActivity}
                                id="txtDescription"
                                label={resources.addActivitiesModal.lblDescription}
                                multiline
                                type="text"
                                value={activitySetupItems ? activitySetupItems.description : undefined}
                                onChange={onTextFieldChangeEdit}
                            />
                        </Grid>
                        {isMidterm ?
                            weightType === 2 ?
                                (
                                    <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}>
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkExtraCredit"
                                            checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                            label={resources.lblExtraCredit}
                                            onChange={onCheckboxChangeEdit}
                                        />
                                    </Grid>
                                )
                                :
                                (
                                    <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginErrT : classes.marginTopT}>
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkExtraCredit"
                                            checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                            label={resources.lblExtraCredit}
                                            onChange={onCheckboxChangeEdit}
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
                                helperText={isPossiblePoints ? resources.addActivitiesModal.lblPossiblePointsValidate : undefined}
                                id="txtPossiblePoints"
                                label={resources.lblPossiblePoints}
                                numeric
                                type="text"
                                value={activitySetupItems ? activitySetupItems.possiblePoints : undefined}
                                onChange={onTextFieldChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                disabled={isViewActivity}
                                culture={cultures.dateTimeCulture}
                                flip
                                format={cultures.shortDatePattern}
                                id="dtpAssigned"
                                label={resources.lblAssigned}
                                value={activitySetupItems ?
                                    Format.toDatePicker(cultures.shortDatePattern, activitySetupItems.assignedDate) : undefined}
                                onChange={onDateTimeChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                disabled={isViewActivity}
                                flip
                                format={cultures.shortDatePattern}
                                error={isValidDueDate}
                                helperText={isValidDueDate ? resources.addActivitiesModal.lblDueValidate : undefined}
                                id="dtpDue"
                                label={resources.addActivitiesModal.lblDue}
                                value={activitySetupItems ? Format.toDatePicker(cultures.shortDatePattern, activitySetupItems.dueDate) : undefined}
                                onChange={onDateTimeChangeEdit}
                            />
                        </Grid>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                disabled={isViewActivity}
                                error={isValidName || isTitleRequired}
                                helperText={isValidName ? resources.addActivitiesModal.lblHelperText : isTitleRequired ?
                                    resources.addActivitiesModal.lblTitleRequired : undefined}
                                id="txtTitle"
                                label={resources.lblTitle}
                                required
                                type="text"
                                value={activitySetupItems.assignmentTitle}
                                onChange={onTextFieldChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <Dropdown
                                disabled={isViewActivity}
                                emptyOption={emptyOption}
                                error={isActivityTypeRequired}
                                helperText={isActivityTypeRequired ? resources.addActivitiesModal.lblActivityTypeRequired : undefined}
                                id="ddlActivityType"
                                label={resources.addActivitiesModal.lblActivityType}
                                required
                                options={gradeActivity}
                                value={activitySetupItems ? activitySetupItems.assignmentTypeId : undefined}
                                onChange={onDropdownChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                disabled={isViewActivity}
                                id="txtDescription"
                                label={resources.addActivitiesModal.lblDescription}
                                multiline
                                type="text"
                                value={activitySetupItems ? activitySetupItems.description : undefined}
                                onChange={onTextFieldChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                disabled={isViewActivity}
                                error={isPossiblePoints}
                                helperText={isPossiblePoints ? resources.addActivitiesModal.lblPossiblePointsValidate : undefined}
                                id="txtPossiblePoints"
                                label={resources.lblPossiblePoints}
                                type="text"
                                value={activitySetupItems ? activitySetupItems.possiblePoints : undefined}
                                onChange={onTextFieldChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                disabled={isViewActivity}
                                format={cultures.shortDatePattern}
                                id="dtpAssigned"
                                label={resources.lblAssigned}
                                value={activitySetupItems ?
                                    Format.toDatePicker(cultures.shortDatePattern, activitySetupItems.assignedDate) : undefined}
                                onChange={onDateTimeChangeEdit}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                disabled={isViewActivity}
                                format={cultures.shortDatePattern}
                                error={isValidDueDate}
                                helperText={isValidDueDate ? resources.addActivitiesModal.lblDueValidate : undefined}
                                id="dtpDue"
                                label={resources.addActivitiesModal.lblDue}
                                value={activitySetupItems ? Format.toDatePicker(cultures.shortDatePattern, activitySetupItems.dueDate) : undefined}
                                onChange={onDateTimeChangeEdit}
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
                                            label={resources.addActivitiesModal.lblMidtermWeight}
                                            type="text"
                                            value={activitySetupItems ? activitySetupItems.midtermWeight : undefined}
                                            onChange={onTextFieldChangeEdit}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            disabled={isViewActivity}
                                            id="chkCountsTowardMidterm"
                                            checked={activitySetupItems ? activitySetupItems.countsForMidterm : false}
                                            label={resources.addActivitiesModal.lblCountsTowardMidterm}
                                            onChange={onCheckboxChangeEdit}
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
                                        label={resources.addActivitiesModal.lblFinalWeight}
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                        onChange={onTextFieldChangeEdit}
                                    />
                                </Grid>
                            )
                            :
                            (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Checkbox
                                        id="chkCountsTowardFinal"
                                        checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                        label={resources.addActivitiesModal.lblCountsTowardFinal}
                                        onChange={onCheckboxChangeEdit}
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
                                        checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                        label={resources.lblExtraCredit}
                                        onChange={onCheckboxChangeEdit}
                                    />
                                </Grid>
                            )
                            :
                            (
                                <Grid item xs={12} sm={6} md={4}>
                                    <Checkbox
                                        disabled={isViewActivity}
                                        id="chkExtraCredit"
                                        checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                        label={resources.lblExtraCredit}
                                        onChange={onCheckboxChangeEdit}
                                    />
                                </Grid>
                            )
                        }
                    </Grid>
                </Hidden>
            </>

        </Modal>
    );
};
// #endregion

export default withStyles(styles)(EditActivitiesModal);