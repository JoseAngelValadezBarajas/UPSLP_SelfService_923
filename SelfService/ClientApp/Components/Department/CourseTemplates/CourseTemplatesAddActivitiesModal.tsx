/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File:CourseTemplatesAddActivitiesModal.tsx
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
export interface IAddActivitiesModalProps {
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
    open: boolean;
    weightType: number;
    onClose: () => void;
    onCheckboxChangeModal: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDateTimeChangeModal?: (date: string, id: string, isValid: boolean) => void;
    onDropdownChangeModal: (optionSelected: IDropDownOption, _id: string) => void;
    onTextFieldChangeModal: (event: any) => void;
    onSaveAddActivity: () => void;
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

type PropsWithStyles = IAddActivitiesModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AddActivitiesModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
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
        open,
        weightType,
        onCheckboxChangeModal,
        onDateTimeChangeModal,
        onDropdownChangeModal,
        onTextFieldChangeModal,
        onClose,
        onSaveAddActivity,

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
                    id="btnSave_activitiesAddModal"
                    onClick={onSaveAddActivity}
                >
                    {resources.btnSave}
                </Button>
            )}
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.addActivitiesModal.formatAdd, [courseTemplateName])}
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
                                error={isValidName || isTitleRequired}
                                helperText={isValidName ?
                                    resources.addActivitiesModal.lblHelperText : isTitleRequired ?
                                        resources.addActivitiesModal.lblTitleRequired : undefined}
                                id="txtAssignmentTitle"
                                label={resources.lblTitle}
                                required
                                type="text"
                                value={activitySetupItems ? activitySetupItems.assignmentTitle : undefined}
                                onChange={onTextFieldChangeModal}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6} md={5} className={classes.marginLeft}>
                            {isMidterm ?
                                weightType === 2 ?
                                    (
                                        <TextField
                                            id="txtMidtermWeight"
                                            label={resources.addActivitiesModal.lblMidtermWeight}
                                            numeric
                                            type="text"
                                            value={activitySetupItems ? activitySetupItems.midtermWeight : undefined}
                                            onChange={onTextFieldChangeModal}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            id="chkCountsTowardMidterm"
                                            checked={activitySetupItems ? activitySetupItems.countsForMidterm : false}
                                            label={resources.addActivitiesModal.lblCountsTowardMidterm}
                                            onChange={onCheckboxChangeModal}
                                        />
                                    )
                                :
                                weightType === 2 ?
                                    (
                                        <TextField
                                            id="txtFinalWeight"
                                            label={resources.addActivitiesModal.lblFinalWeight}
                                            numeric
                                            type="text"
                                            value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                            onChange={onTextFieldChangeModal}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            id="chkCountsTowardFinal"
                                            checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                            label={resources.addActivitiesModal.lblCountsTowardFinal}
                                            onChange={onCheckboxChangeModal}
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
                                helperText={isActivityTypeRequired ? resources.addActivitiesModal.lblActivityTypeRequired : undefined}
                                id="ddlActivityType"
                                label={resources.addActivitiesModal.lblActivityType}
                                required
                                options={gradeActivity}
                                value={activitySetupItems ? activitySetupItems.assignmentTypeId : undefined}
                                onChange={onDropdownChangeModal}
                            />
                        </Grid>
                        {weightType === 2 ?
                            (
                                <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}>
                                    {isMidterm ?
                                        (
                                            <TextField
                                                id="txtFinalWeight"
                                                label={resources.addActivitiesModal.lblFinalWeight}
                                                numeric
                                                type="text"
                                                value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                                onChange={onTextFieldChangeModal}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                id="chkExtraCredit"
                                                checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChangeModal}
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
                                                id="chkCountsTowardFinal"
                                                checked={activitySetupItems ? activitySetupItems.countsForFinal : false}
                                                label={resources.addActivitiesModal.lblCountsTowardFinal}
                                                onChange={onCheckboxChangeModal}
                                            />
                                        )
                                        :
                                        (
                                            <Checkbox
                                                id="chkExtraCredit"
                                                checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                                label={resources.lblExtraCredit}
                                                onChange={onCheckboxChangeModal}
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
                                label={resources.addActivitiesModal.lblDescription}
                                multiline
                                type="text"
                                value={activitySetupItems ? activitySetupItems.description : undefined}
                                onChange={onTextFieldChangeModal}
                            />
                        </Grid>
                        {isMidterm ?
                            weightType === 2 ?
                                (
                                    <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginOne : classes.marginLeftBox}>
                                        <Checkbox
                                            id="chkExtraCredit"
                                            checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                            label={resources.lblExtraCredit}
                                            onChange={onCheckboxChangeModal}
                                        />
                                    </Grid>
                                )
                                :
                                (
                                    <Grid item xs={12} sm={6} md={5} className={isValidName || isTitleRequired ? classes.marginErrT : classes.marginTopT}>
                                        <Checkbox
                                            id="chkExtraCredit"
                                            checked={activitySetupItems ? activitySetupItems.isExtraCredit : false}
                                            label={resources.lblExtraCredit}
                                            onChange={onCheckboxChangeModal}
                                        />
                                    </Grid>
                                )
                            : undefined}
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                error={isPossiblePoints}
                                helperText={isPossiblePoints ? resources.addActivitiesModal.lblPossiblePointsValidate : undefined}
                                id="txtPossiblePoints"
                                label={resources.lblPossiblePoints}
                                numeric
                                type="text"
                                value={activitySetupItems ? activitySetupItems.possiblePoints : undefined}
                                onChange={onTextFieldChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                flip
                                format={cultures.shortDatePattern}
                                id="dtpAssigned"
                                label={resources.lblAssigned}
                                value={activitySetupItems ? activitySetupItems.assignedDate : undefined}
                                onChange={onDateTimeChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                flip
                                format={cultures.shortDatePattern}
                                error={isValidDueDate}
                                helperText={isValidDueDate ? resources.addActivitiesModal.lblDueValidate : undefined}
                                id="dtpDue"
                                label={resources.addActivitiesModal.lblDue}
                                value={activitySetupItems ? activitySetupItems.dueDate : undefined}
                                onChange={onDateTimeChangeModal}
                            />
                        </Grid>
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                error={isValidName || isTitleRequired}
                                helperText={isValidName ? resources.addActivitiesModal.lblHelperText : isTitleRequired ?
                                    resources.addActivitiesModal.lblTitleRequired : undefined}
                                id="txtTitle"
                                label={resources.lblTitle}
                                required
                                type="text"
                                value={activitySetupItems ? activitySetupItems.assignmentTitle : undefined}
                                onChange={onTextFieldChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <Dropdown
                                emptyOption={emptyOption}
                                error={isActivityTypeRequired}
                                helperText={isActivityTypeRequired ? resources.addActivitiesModal.lblActivityTypeRequired : undefined}
                                id="ddlActivityType"
                                label={resources.addActivitiesModal.lblActivityType}
                                required
                                options={gradeActivity}
                                value={activitySetupItems ? activitySetupItems.assignmentTypeId : undefined}
                                onChange={onDropdownChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                id="txtDescription"
                                label={resources.addActivitiesModal.lblDescription}
                                multiline
                                type="text"
                                value={activitySetupItems ? activitySetupItems.description : undefined}
                                onChange={onTextFieldChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <TextField
                                error={isPossiblePoints}
                                helperText={isPossiblePoints ? resources.addActivitiesModal.lblPossiblePointsValidate : undefined}
                                id="txtPossiblePoints"
                                label={resources.lblPossiblePoints}
                                type="text"
                                value={activitySetupItems ? activitySetupItems.possiblePoints : undefined}
                                onChange={onTextFieldChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                format={cultures.shortDatePattern}
                                id="dtpAssigned"
                                label={resources.lblAssigned}
                                value={activitySetupItems ? activitySetupItems.assignedDate : undefined}
                                onChange={onDateTimeChangeModal}
                            />
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={6}>
                            <DatePicker
                                culture={cultures.dateTimeCulture}
                                format={cultures.shortDatePattern}
                                error={isValidDueDate}
                                helperText={isValidDueDate ? resources.addActivitiesModal.lblDueValidate : undefined}
                                id="dtpDue"
                                label={resources.addActivitiesModal.lblDue}
                                value={activitySetupItems ? activitySetupItems.dueDate : undefined}
                                onChange={onDateTimeChangeModal}
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
                                            label={resources.addActivitiesModal.lblMidtermWeight}
                                            type="text"
                                            value={activitySetupItems ? activitySetupItems.midtermWeight : undefined}
                                            onChange={onTextFieldChangeModal}
                                        />
                                    )
                                    :
                                    (
                                        <Checkbox
                                            id="chkCountsTowardMidterm"
                                            checked={activitySetupItems ? activitySetupItems.countsForMidterm : false}
                                            label={resources.addActivitiesModal.lblCountsTowardMidterm}
                                            onChange={onCheckboxChangeModal}
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
                                        label={resources.addActivitiesModal.lblFinalWeight}
                                        type="text"
                                        value={activitySetupItems ? activitySetupItems.finalWeight : undefined}
                                        onChange={onTextFieldChangeModal}
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
                                        onChange={onCheckboxChangeModal}
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
                                        onChange={onCheckboxChangeModal}
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
                                        onChange={onCheckboxChangeModal}
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

export default withStyles(styles)(AddActivitiesModal);