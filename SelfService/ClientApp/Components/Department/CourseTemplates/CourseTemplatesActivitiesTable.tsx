/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplateActivitiesTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ICourseTemplate } from '../../../Types/Department/ICourseTemplate';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
import { IAssignmentTypes } from '../../../Types/Section/IAssignmentTypes';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion

// #region Internal types
export interface ICourseTemplateActivitiesTableProps {
    activityName: string;
    activitiesSetup: IAssignmentTypes;
    courseTemplateSetup: ICourseTemplate;
    confirmDeleteActivity: boolean;
    cultures: ICultures;
    index: number;
    isAssigned: boolean;
    isDisabled: boolean;
    isDisabledAll: boolean;
    isMidterm: boolean;
    onBlurTextField: (event: any) => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onCloseDeleteAllConfirmModal: () => void;
    onConfirmDeleteActivity: () => void;
    onDeleteActivity: (id: number, name: string) => void;
    onEditActivity: (id: number, index: number, subIndex: number, disabled: boolean) => void;
    onOpenDate: (index: number, subIndex: number) => void;
    onTextFieldChange: (event: any) => void;
    resources: ICourseTemplatesResources;
}

const styles = ((theme: Theme) => createStyles({
    containerDate: {
        paddingLeft: Tokens.spacing30
    },
    containerDateButton: {
        alignItems: 'center',
        display: 'flex',
        width: '100%'
    },
    containerDateMobile: {
        display: 'flex',
        flexDirection: 'column'
    },
    containerDateModal: {
        height: '320px'
    },
    marginTop: {
        marginTop: Tokens.sizingXSmall
    },
    marginTopAs: {
        marginLeft: '-1rem',
        marginTop: Tokens.sizingXSmall
    },
    marginTopPercentage: {
        marginTop: Tokens.sizingXSmall
    },
    marginTopTool: {
        marginTop: '0.8rem'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '18%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(5)': {
                width: '13%'
            },
            '& > thead > tr > th:nth-child(6)': {
                width: '13%'
            },
            '& > thead > tr > th:nth-child(7)': {
                width: '13%'
            },
            '& > thead > tr > th:nth-child(8)': {
                width: '14%'
            }
        }
    },
    textColor: {
        color: Tokens.colorTextAlertWarning
    }
}));

type PropsWithStyles = ICourseTemplateActivitiesTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const CourseTemplatesActivitiesTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        activityName,
        activitiesSetup,
        classes,
        courseTemplateSetup,
        confirmDeleteActivity,
        index,
        isAssigned,
        isDisabled,
        isDisabledAll,
        isMidterm,
        onBlurTextField,
        onCheckboxChange,
        onCloseDeleteAllConfirmModal,
        onConfirmDeleteActivity,
        onEditActivity,
        onDeleteActivity,
        onOpenDate,
        onTextFieldChange,

        resources
    } = props;

    let confirmationDeleteActivity: JSX.Element | undefined;

    if (confirmDeleteActivity) {
        confirmationDeleteActivity = (
            <ConfirmationDialog
                contentText={Format.toString(resources.formatDeleteActivity, [activityName])}
                open={confirmDeleteActivity}
                primaryActionOnClick={onCloseDeleteAllConfirmModal}
                primaryActionText={resources.btnCancel}
                secondaryActionOnClick={onConfirmDeleteActivity}
                secondaryActionText={resources.btnDelete}
                secondaryActionProps={{ id: `btnDeleteActivity` }}
                title={Format.toString(resources.formatTitleDeleteActivity, [activityName])}
            />
        );
    }
    const contentPage: JSX.Element = (
        <>
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblCourseTemplatesList"
                variant="expansionPanels"
            >
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {resources.lblTitle}
                        </TableCell>
                        <TableCell />
                        <TableCell component="th">
                            {resources.lblAssigned}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblDueDates}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblGradesDue}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblPossiblePoints}
                        </TableCell>
                        {isMidterm ?
                            (
                                <TableCell component="th">
                                    {courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 2 ?
                                        resources.lblMidterm : resources.lblCountsTowardMidterm}
                                </TableCell>
                            )
                            : undefined}
                        <TableCell component="th">
                            {courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 2 ?
                                resources.lblFinal : resources.lblCountsTowardFinal}
                        </TableCell>
                        <TableCell />
                        {!isAssigned && (
                            <TableCell />
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activitiesSetup ? activitiesSetup.sectionAssignments.map((assignment, i) => {
                        const callbackOpenDate = function (): void { onOpenDate(index, i); };
                        const onDelete = function (): void {
                            if (assignment && assignment.id && assignment.title) {
                                onDeleteActivity(assignment.id, assignment.title);
                            }
                        }
                        const onEdit = function (): void {
                            if (assignment && assignment.id) {
                                onEditActivity(assignment.id, index, i, false);
                            }
                        }
                        const onView = function (): void {
                            if (assignment && assignment.id) {
                                onEditActivity(assignment.id, index, i, true);
                            }
                        }

                        return (
                            <React.Fragment key={`activitiesTable_${index}_${i}`}>
                                <TableExpandableRow
                                    key={`activitiesList_${index}_${i}`}
                                >
                                    <TableCell>
                                        {isAssigned ?
                                            <Tooltip
                                                id="tltEdit"
                                                title={resources.lblView}
                                                placement="top"
                                            >
                                                <Button
                                                    align="left"
                                                    id={`titleOp_${index}_${i}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={onView}
                                                >
                                                    {assignment.title}
                                                </Button>
                                            </Tooltip>
                                            :
                                            <Tooltip
                                                id="tltEdit"
                                                title={resources.btnEdit}
                                                placement="top"
                                            >
                                                <Button
                                                    align="left"
                                                    id={`titleOp_${index}_${i}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={onEdit}
                                                >
                                                    {assignment.title}
                                                </Button>
                                            </Tooltip>
                                        }
                                    </TableCell>
                                    {assignment.isExtraCredit ?
                                        (
                                            <TableCell>
                                                <Grid container>
                                                    <Grid item>
                                                        {resources.lblExtraCredit}
                                                    </Grid>
                                                    <Hidden smDown>
                                                        <Tooltip
                                                            id={`tltExtraCredit_${i}`}
                                                            title={resources.lblActivityWithExtraCredit}
                                                            aria-label={resources.lblActivityWithExtraCredit}
                                                            placement="top"
                                                        >
                                                            <Icon
                                                                className={classes.marginTopTool}
                                                                name="info"
                                                                type={ResultType.info}
                                                            />
                                                        </Tooltip>
                                                    </Hidden>
                                                    <Hidden mdUp>
                                                        <Tooltip
                                                            id={`tltExtraCredit_${i}`}
                                                            title={resources.lblActivityWithExtraCredit}
                                                            aria-label={resources.lblActivityWithExtraCredit}
                                                            placement="top"
                                                        >
                                                            <Icon
                                                                name="info"
                                                                type={ResultType.info}
                                                            />
                                                        </Tooltip>
                                                    </Hidden>
                                                </Grid>
                                            </TableCell>
                                        )
                                        : <TableCell />}
                                    <TableCell columnName={resources.lblAssigned}>
                                        {assignment.assignedDate}
                                    </TableCell>
                                    <TableCell columnName={resources.lblDueDates}>
                                        {assignment.dueDate}
                                    </TableCell>
                                    <TableEditableCell
                                        columnName={resources.lblGradesDue}
                                        editableComponent={
                                            (
                                                <>
                                                    {!courseTemplateSetup.assignmentTemplate.isRestrictive ?
                                                        (
                                                            <div className={classes.containerDateMobile}>
                                                                <div className={classes.containerDateButton}>
                                                                    <Hidden smDown>
                                                                        <IconButton
                                                                            color="gray"
                                                                            disabled
                                                                            title={resources.lblGradesDue}
                                                                            id={`btnGradesDue_${i}`}
                                                                        >
                                                                            <Icon name="calendar" />
                                                                        </IconButton>
                                                                        <span className={classes.containerDate}>
                                                                            {assignment.assignmentEndDate}
                                                                        </span>
                                                                    </Hidden>
                                                                    <Hidden mdUp>
                                                                        <span>
                                                                            {assignment.assignmentEndDate}
                                                                        </span>
                                                                    </Hidden>
                                                                </div>
                                                            </div>
                                                        )
                                                        :
                                                        (courseTemplateSetup.assignmentTemplate.isDateByAssignmentType ||
                                                            courseTemplateSetup.assignmentTemplate.isDateByAssignmentType === undefined) ?
                                                            (
                                                                <div className={classes.containerDateMobile}>
                                                                    <div className={classes.containerDateButton}>
                                                                        <Hidden smDown>
                                                                            <IconButton
                                                                                color="gray"
                                                                                disabled
                                                                                title={resources.lblGradesDue}
                                                                                id={`btnGradesDue_${i}`}
                                                                            >
                                                                                <Icon name="calendar" />
                                                                            </IconButton>
                                                                            <span className={classes.containerDate}>
                                                                                {assignment.assignmentEndDate}
                                                                            </span>
                                                                        </Hidden>
                                                                        <Hidden mdUp>
                                                                            <span>
                                                                                {assignment.assignmentEndDate}
                                                                            </span>
                                                                        </Hidden>
                                                                    </div>
                                                                </div>
                                                            )
                                                            :
                                                            (
                                                                <div className={classes.containerDateMobile}>
                                                                    <div className={classes.containerDateButton}>
                                                                        <IconButton
                                                                            color="secondary"
                                                                            disabled={isDisabledAll ? isDisabledAll ?
                                                                                !courseTemplateSetup.assignmentTemplate.isDateByAssignmentType : true : false}
                                                                            title={resources.lblGradesDue}
                                                                            onClick={callbackOpenDate}
                                                                            id={`btnGradesDue_${i}`}
                                                                        >
                                                                            <Icon name="calendar" />
                                                                        </IconButton>
                                                                        <span className={classes.containerDate}>
                                                                            {assignment.assignmentEndDate}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                            )
                                                    }
                                                </>
                                            )
                                        }
                                    />
                                    <TableEditableCell
                                        columnName={resources.lblPossiblePoints}
                                        editableComponent={
                                            (
                                                <Grid container>
                                                    <Grid item md={6}>
                                                        <TextField
                                                            cell
                                                            disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                            id={`txtPossiblePoints_${index}_${i}`}
                                                            numeric
                                                            size="small"
                                                            type="text"
                                                            value={assignment.possiblePoints}
                                                            onChange={onTextFieldChange}
                                                            onBlur={onBlurTextField}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    />
                                    {isMidterm ?
                                        (
                                            <TableEditableCell
                                                columnName={resources.lblMidterm}
                                                editableComponent={
                                                    (
                                                        <div>
                                                            {courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 2 ?
                                                                (
                                                                    <Grid container>
                                                                        <Grid item md={5}>
                                                                            <TextField
                                                                                cell
                                                                                id={`txtCountsTowardMidterm_${index}_${i}`}
                                                                                numeric
                                                                                size="small"
                                                                                type="text"
                                                                                value={assignment.midtermWeight}
                                                                                onChange={onTextFieldChange}
                                                                                onBlur={onBlurTextField}
                                                                            />
                                                                        </Grid>
                                                                        {!assignment.isExtraCredit ?
                                                                            (
                                                                                <>
                                                                                    <Grid item md={5} className={classes.marginTop}>
                                                                                        <Text
                                                                                            id={`txtPercentageMidterm_${index}_${i}`}
                                                                                            color={'textSecondary'}
                                                                                        >
                                                                                            {assignment.midtermWeight ? assignment.midtermPercentage ?
                                                                                                Format.toString(resources.formatPercentage,
                                                                                                    [assignment.midtermPercentage])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                            }
                                                                                        </Text>
                                                                                    </Grid>
                                                                                    {activitiesSetup.isMidtermDrop ||
                                                                                        activitiesSetup.midtermMaxDrop !== 0 &&
                                                                                        activitiesSetup.midtermDropLowest >
                                                                                        activitiesSetup.midtermMaxDrop ||
                                                                                        activitiesSetup.midtermDropHighest >
                                                                                        activitiesSetup.midtermMaxDrop ?
                                                                                        (
                                                                                            <Grid item md={2} className={classes.marginTopAs}>
                                                                                                <Text>
                                                                                                    {resources.lblAsterisk}
                                                                                                </Text>
                                                                                            </Grid>
                                                                                        )
                                                                                        : undefined}
                                                                                </>
                                                                            )
                                                                            : undefined}
                                                                    </Grid>
                                                                )
                                                                :
                                                                (
                                                                    <Grid container>
                                                                        <Grid item>
                                                                            <Checkbox
                                                                                disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                                                id={`chkCountsTowardMidterm_${index}_${i}`}
                                                                                inputProps={{
                                                                                    'aria-label': assignment.title
                                                                                }}
                                                                                checked={assignment.midtermWeight === 1 ? true : false}
                                                                                onChange={onCheckboxChange}
                                                                            />
                                                                        </Grid>
                                                                        {!assignment.isExtraCredit ?
                                                                            (
                                                                                <>
                                                                                    <Grid item className={classes.marginTopPercentage}>
                                                                                        <Text
                                                                                            id={`txtPercentageMidterm_${index}_${i}`}
                                                                                            color={'textSecondary'}
                                                                                        >
                                                                                            {assignment.midtermWeight ? assignment.midtermPercentage ?
                                                                                                Format.toString(resources.formatPercentage,
                                                                                                    [assignment.midtermPercentage])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                    {activitiesSetup.isMidtermDrop ||
                                                                                        activitiesSetup.midtermMaxDrop !== 0 &&
                                                                                        activitiesSetup.midtermDropLowest >
                                                                                        activitiesSetup.midtermMaxDrop ||
                                                                                        activitiesSetup.midtermDropHighest >
                                                                                        activitiesSetup.midtermMaxDrop ?
                                                                                        (
                                                                                            <Grid item md={2} className={classes.marginTopAs}>
                                                                                                <Text>
                                                                                                    {resources.lblAsterisk}
                                                                                                </Text>
                                                                                            </Grid>
                                                                                        )
                                                                                        : undefined}
                                                                                </>
                                                                            )
                                                                            : undefined}
                                                                    </Grid>
                                                                )
                                                            }
                                                        </div>
                                                    )
                                                }
                                            />
                                        )
                                        : undefined}
                                    <TableEditableCell
                                        columnName={resources.lblFinal}
                                        editableComponent={
                                            (
                                                <div>
                                                    {courseTemplateSetup.assignmentTemplate.assignmentWeightingMethod === 2 ?
                                                        (
                                                            <Grid container>
                                                                <Grid item md={5}>
                                                                    <TextField
                                                                        cell
                                                                        disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                                        id={`txtCountsTowardFinal_${index}_${i}`}
                                                                        numeric
                                                                        size="small"
                                                                        type="text"
                                                                        value={assignment.finalWeight}
                                                                        onChange={onTextFieldChange}
                                                                        onBlur={onBlurTextField}
                                                                    />
                                                                </Grid>
                                                                {!assignment.isExtraCredit ?
                                                                    (
                                                                        <>
                                                                            <Grid item md={5} className={classes.marginTop}>
                                                                                <Text
                                                                                    id={`txtPercentageFinal_${index}_${i}`}
                                                                                    color={'textSecondary'}
                                                                                >
                                                                                    {assignment.finalWeight ? assignment.finalPercentage ?
                                                                                        Format.toString(resources.formatPercentage,
                                                                                            [assignment.finalPercentage])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                </Text>
                                                                            </Grid>
                                                                            {activitiesSetup.isFinalDrop ||
                                                                                activitiesSetup.finalMaxDrop !== 0 &&
                                                                                activitiesSetup.finalDropLowest >
                                                                                activitiesSetup.finalMaxDrop ||
                                                                                activitiesSetup.finalDropHighest >
                                                                                activitiesSetup.finalMaxDrop ?
                                                                                (
                                                                                    <Grid item md={2} className={classes.marginTopAs}>
                                                                                        <Text>
                                                                                            {resources.lblAsterisk}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                )
                                                                                : undefined}
                                                                        </>
                                                                    )
                                                                    : undefined}
                                                            </Grid>
                                                        )
                                                        :
                                                        (
                                                            <Grid container>
                                                                <Grid item>
                                                                    <Checkbox
                                                                        disabled={isDisabledAll ? isDisabledAll : isDisabled}
                                                                        id={`chkCountsTowardFinal_${index}_${i}`}
                                                                        inputProps={{
                                                                            'aria-label': assignment.title
                                                                        }}
                                                                        checked={assignment.finalWeight === 1 ? true : false}
                                                                        onChange={onCheckboxChange}
                                                                    />
                                                                </Grid>

                                                                {!assignment.isExtraCredit ?
                                                                    (
                                                                        <>
                                                                            <Grid item className={classes.marginTopPercentage}>
                                                                                <Text
                                                                                    id={`txtPercentageFinal_${index}_${i}`}
                                                                                    color={'textSecondary'}
                                                                                >
                                                                                    {assignment.finalWeight ? assignment.finalPercentage ?
                                                                                        Format.toString(resources.formatPercentage,
                                                                                            [assignment.finalPercentage])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                </Text>
                                                                            </Grid>
                                                                            {activitiesSetup.isFinalDrop ||
                                                                                activitiesSetup.finalMaxDrop !== 0 &&
                                                                                activitiesSetup.finalDropLowest >
                                                                                activitiesSetup.finalMaxDrop ||
                                                                                activitiesSetup.finalDropHighest >
                                                                                activitiesSetup.finalMaxDrop ?
                                                                                (
                                                                                    <Grid item md={2} className={classes.marginTopPercentage}>
                                                                                        <Text>
                                                                                            {resources.lblAsterisk}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                )
                                                                                : undefined}
                                                                        </>
                                                                    )
                                                                    : undefined}
                                                            </Grid>
                                                        )
                                                    }
                                                </div>
                                            )
                                        }
                                    />
                                    {!isAssigned && (
                                        <TableCell columnName={resources.btnDelete}>
                                            <Tooltip
                                                id="deleteCourseTemplate"
                                                title={resources.btnDelete}
                                                aria-label={resources.btnDelete}
                                            >
                                                <IconButton
                                                    color="secondary"
                                                    id={`titleOp_${index}_${i}`}
                                                    onClick={onDelete}
                                                >
                                                    <Icon name="trash" />
                                                </IconButton>
                                            </Tooltip>
                                        </TableCell>
                                    )}
                                </TableExpandableRow>
                            </React.Fragment>
                        );
                    })
                        : undefined}
                </TableBody>
            </Table>
            <br />
            {
                (activitiesSetup.midtermMaxDrop !== 0 &&
                    activitiesSetup.midtermDropLowest >
                    activitiesSetup.midtermMaxDrop ||
                    activitiesSetup.midtermDropHighest >
                    activitiesSetup.midtermMaxDrop) ||
                    (activitiesSetup.finalMaxDrop !== 0 &&
                        activitiesSetup.finalDropLowest >
                        activitiesSetup.finalMaxDrop ||
                        activitiesSetup.finalDropHighest >
                        activitiesSetup.finalMaxDrop) ||
                    activitiesSetup.isFinalDrop ||
                    activitiesSetup.isMidtermDrop ?
                    (
                        <Grid container>
                            <Grid item>
                                <Text
                                    className={classes.textColor}
                                >
                                    {resources.lblDropMessage}
                                </Text>
                            </Grid>
                        </Grid>
                    )
                    : undefined}
        </>
    );

    return (
        <>
            {contentPage}
            {confirmationDeleteActivity}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(CourseTemplatesActivitiesTable);