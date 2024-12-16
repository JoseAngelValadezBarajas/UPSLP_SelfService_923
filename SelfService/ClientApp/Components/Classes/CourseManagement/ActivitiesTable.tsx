/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ActivitiesTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ActionMenu from '@hedtech/powercampus-design-system/react/core/ActionMenu';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IActionMenuOption } from '@hedtech/powercampus-design-system/types/IActionMenuOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IActivitiesSetup } from '../../../Types/Section/IActivitiesSetup';

// #endregion

// #region Internal types
export interface IActivitiesTableProps {
    anchorEl: any;
    activitiesSetup: IActivitiesSetup;
    isRestricted: boolean;
    index: number;
    resources: IActivitiesTableResProps;
    onBlurTextField: (event: any) => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClosePopper: () => void;
    onCopy: (id: number, index: number, subIndex: number) => void;
    onDelete: (id: number) => void;
    onEditClick: (id: number, index: number, subIndex: number, disabled: boolean) => void;
    onOpenPopper: (event: any) => void;
    onTextFieldChange: (event: any) => void;
}

export interface IActivitiesTableResProps {
    btnCopy: string;
    btnDelete: string;
    btnEdit: string;
    btnFinish: string;
    btnView: string;
    formatPercentage: string;
    lblActivityWithExtraCredit: string;
    lblAssigned: string;
    lblAsterisk: string;
    lblBetweenOne: string;
    lblChooseSection: string;
    lblCopyActivities: string;
    lblCountsTowardFinal: string;
    lblCountsTowardMidterm: string;
    lblCourse: string;
    lblDescription: string;
    lblDropDownEmptyText: string;
    lblDropHighest: string;
    lblDropLowest: string;
    lblDropMessage: string;
    lblDue: string;
    lblExtraCredit: string;
    lblFinal: string;
    lblFinalWeight: string;
    lblGradesDue: string;
    lblMidterm: string;
    lblMidtermWeight: string;
    lblMoreInfo: string;
    lblPeriod: string;
    lblPossiblePoints: string;
    lblTitle: string;
    lblToStartWorking: string;
    lblType: string;
    lblWeight: string;
}

const styles = ((theme: Theme) => createStyles({
    marginLeft: {
        marginLeft: '-1rem'
    },
    marginLeftCheck: {
        marginLeft: Tokens.spacing60
    },
    marginLeftItem: {
        marginLeft: '-3rem'
    },
    marginTop: {
        marginTop: Tokens.sizingXSmall
    },
    marginTopAs: {
        marginLeft: '-1rem',
        marginTop: Tokens.sizingXSmall
    },
    marginTopOf: {
        [theme.breakpoints.up('md')]: {
            marginTop: Tokens.sizingSmall
        },
        marginTop: Tokens.sizingSmall
    },
    marginTopPercentage: {
        marginLeft: '-1rem',
        marginTop: Tokens.sizingXSmall
    },
    marginTopTool: {
        marginTop: Tokens.spacing30
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(6)': {
                width: '22%'
            },
            '& > thead > tr > th:nth-child(7)': {
                width: '22%'
            }
        }
    },
    textColor: {
        color: Tokens.colorTextAlertWarning
    },
    popperText: {
        maxWidth: '15rem'
    }
}));

type PropsWithStyles = IActivitiesTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ActivitiesTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        anchorEl,
        activitiesSetup,
        classes,
        index,
        isRestricted,
        resources,
        onBlurTextField,
        onCheckboxChange,
        onClosePopper,
        onCopy,
        onDelete,
        onEditClick,
        onOpenPopper,
        onTextFieldChange
    } = props;

    let actions: IActionMenuOption[];
    let actionView: IActionMenuOption[];
    const content: JSX.Element = (
        <React.Fragment key={`activities_${index}`}>
            <Hidden smDown>
                <Grid container>
                    {activitiesSetup.showMidterm ?
                        (
                            <Grid item md={5}>
                                <Text size="h3">
                                    {resources.lblMidterm}
                                </Text>
                            </Grid>
                        )
                        : undefined}
                    <Grid item md={5}>
                        <Text size="h3">
                            {resources.lblFinal}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    {activitiesSetup.showMidterm && (
                        <Grid item xs={12} md={5}>
                           <Grid container>
                                {activitiesSetup.isWeightByType && (
                                    <Grid item md={3}>
                                        <TextField
                                            disabled={isRestricted}
                                            id={`txtWeightMidterm_${index}`}
                                            label={resources.lblWeight}
                                            numeric
                                            type="text"
                                            value={activitiesSetup.assignmentTypes[index].midtermWeight}
                                            onBlur={onBlurTextField}
                                            onChange={onTextFieldChange}
                                        />
                                    </Grid>
                                )}
                                <Grid item md={3}>
                                    <TextField
                                        disabled={isRestricted}
                                        id={`txtDropLowestMidterm_${index}`}
                                        label={resources.lblDropLowest}
                                        numeric
                                        type="text"
                                        value={activitiesSetup.assignmentTypes[index].midtermDropLowest}
                                        onBlur={onBlurTextField}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                                <Grid item md={1} className={classes.marginTopOf}>
                                    <Text size="small">
                                        {Format.toString(resources.lblBetweenOne, [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                                    </Text>
                                </Grid>
                                <Grid item md={3}>
                                    <TextField
                                        disabled={isRestricted}
                                        id={`txtDropHighestMidterm_${index}`}
                                        label={resources.lblDropHighest}
                                        numeric
                                        type="text"
                                        value={activitiesSetup.assignmentTypes[index].midtermDropHighest}
                                        onBlur={onBlurTextField}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                                <Grid item md={1} className={classes.marginTopOf}>
                                    <Text size="small">
                                        {Format.toString(resources.lblBetweenOne, [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12} md={5}>
                        <Grid container>
                            {activitiesSetup.isWeightByType && (
                                <Grid item md={3}>
                                    <TextField
                                        disabled={isRestricted}
                                        id={`txtWeightFinal_${index}`}
                                        label={resources.lblWeight}
                                        numeric
                                        type="text"
                                        value={activitiesSetup.assignmentTypes[index].finalWeight}
                                        onBlur={onBlurTextField}
                                        onChange={onTextFieldChange}
                                    />
                                </Grid>
                            )}
                            <Grid item md={3}>
                                <TextField
                                    disabled={isRestricted}
                                    id={`txtDropLowestFinal_${index}`}
                                    label={resources.lblDropLowest}
                                    numeric
                                    type="text"
                                    value={activitiesSetup.assignmentTypes[index].finalDropLowest}
                                    onBlur={onBlurTextField}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                            <Grid item md={1} className={classes.marginTopOf}>
                                <Text size="small">
                                    {Format.toString(resources.lblBetweenOne, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                                </Text>
                            </Grid>
                            <Grid item md={3}>
                                <TextField
                                    disabled={isRestricted}
                                    id={`txtDropHighestFinal_${index}`}
                                    label={resources.lblDropHighest}
                                    numeric
                                    type="text"
                                    value={activitiesSetup.assignmentTypes[index].finalDropHighest}
                                    onBlur={onBlurTextField}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                            <Grid item md={1} className={classes.marginTopOf}>
                                <Text size="small">
                                    {Format.toString(resources.lblBetweenOne, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                    {isRestricted && (
                        <Grid item xs={12} md={2}>
                            <TextField
                                disabled
                                id={`txtGradesDue_${index}`}
                                label={resources.lblGradesDue}
                                type="text"
                                value={activitiesSetup.assignmentTypes[index].endDate}
                            />
                        </Grid>
                    )}
                </Grid>
            </Hidden>
            <Hidden mdUp>
                {activitiesSetup.showMidterm && (
                    <Grid container>
                        <Grid item xs={12}>
                            <Text size="h3">
                                {resources.lblMidterm}
                            </Text>
                        </Grid>
                    </Grid>
                )}
                {activitiesSetup.showMidterm && activitiesSetup.isWeightByType && (
                    <Grid container>
                        <Grid item xs={5} sm={4}>
                            <TextField
                                disabled={isRestricted}
                                id={`txtWeightMidterm_${index}`}
                                label={resources.lblWeight}
                                numeric
                                type="text"
                                value={activitiesSetup.assignmentTypes[index].midtermWeight}
                                onBlur={onBlurTextField}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                    </Grid>
                )}
                {activitiesSetup.showMidterm && (
                    <Grid container>
                        <Grid item xs={5}>
                            <TextField
                                disabled={isRestricted}
                                id={`txtDropLowestMidterm_${index}`}
                                label={resources.lblDropLowest}
                                numeric
                                type="text"
                                value={activitiesSetup.assignmentTypes[index].midtermDropLowest}
                                onBlur={onBlurTextField}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={1} className={classes.marginTopOf}>
                            <Text>
                                {Format.toString(resources.lblBetweenOne,
                                    [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                            </Text>
                        </Grid>
                        <Grid item xs={5}>
                            <TextField
                                disabled={isRestricted}
                                id={`txtDropHighestMidterm_${index}`}
                                label={resources.lblDropHighest}
                                numeric
                                type="text"
                                value={activitiesSetup.assignmentTypes[index].midtermDropHighest}
                                onBlur={onBlurTextField}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                        <Grid item xs={1} className={classes.marginTopOf}>
                            <Text>
                                {Format.toString(resources.lblBetweenOne,
                                    [activitiesSetup.assignmentTypes[index].midtermMaxDrop])}
                            </Text>
                        </Grid>
                    </Grid>
                )}

                <Grid container>
                    <Grid item xs={12}>
                        <Text size="h3">
                            {resources.lblFinal}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    {activitiesSetup.isWeightByType && (
                        <Grid item xs={5} sm={4}>
                            <TextField
                                disabled={isRestricted}
                                id={`txtWeightFinal_${index}`}
                                label={resources.lblWeight}
                                numeric
                                type="text"
                                value={activitiesSetup.assignmentTypes[index].finalWeight}
                                onBlur={onBlurTextField}
                                onChange={onTextFieldChange}
                            />
                        </Grid>
                    )}
                </Grid>
                <Grid container>
                    <Grid item xs={5}>
                        <TextField
                            disabled={isRestricted}
                            id={`txtDropLowestFinal_${index}`}
                            label={resources.lblDropLowest}
                            numeric
                            type="text"
                            value={activitiesSetup.assignmentTypes[index].finalDropLowest}
                            onBlur={onBlurTextField}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={1} className={classes.marginTopOf}>
                        <Text>
                            {Format.toString(resources.lblBetweenOne, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                        </Text>
                    </Grid>
                    <Grid item xs={5}>
                        <TextField
                            disabled={isRestricted}
                            id={`txtDropHighestFinal_${index}`}
                            label={resources.lblDropHighest}
                            numeric
                            type="text"
                            value={activitiesSetup.assignmentTypes[index].finalDropHighest}
                            onBlur={onBlurTextField}
                            onChange={onTextFieldChange}
                        />
                    </Grid>
                    <Grid item xs={1} className={classes.marginTopOf}>
                        <Text>
                            {Format.toString(resources.lblBetweenOne, [activitiesSetup.assignmentTypes[index].finalMaxDrop])}
                        </Text>
                    </Grid>
                </Grid>
                {isRestricted && (
                    <Grid container>
                        <Grid item xs={12} md={2}>
                            <TextField
                                disabled
                                id={`txtGradesDue_${index}`}
                                label={resources.lblGradesDue}
                                type="text"
                                value={activitiesSetup.assignmentTypes[index].endDate}
                            />
                        </Grid>
                    </Grid>
                )}
            </Hidden>
            <br />
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblActivitiesDetail"
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
                            {resources.lblDue}
                        </TableCell>
                        {isRestricted && (
                            <TableCell component="th">
                                {resources.lblGradesDue}
                            </TableCell>
                        )}
                        <TableCell component="th">
                            {resources.lblPossiblePoints}
                        </TableCell>
                        {activitiesSetup.showMidterm && (
                            activitiesSetup.weightMethod === 2 ?
                                (
                                    <TableCell component="th">
                                        {resources.lblMidtermWeight}
                                    </TableCell>
                                )
                                :
                                (
                                    <TableCell component="th">
                                        {resources.lblCountsTowardMidterm}
                                    </TableCell>
                                )
                        )}
                        {activitiesSetup.weightMethod === 2 ?
                            (
                                <TableCell component="th">
                                    {resources.lblFinalWeight}
                                </TableCell>
                            )
                            :
                            (
                                <TableCell component="th">
                                    {resources.lblCountsTowardFinal}
                                </TableCell>
                            )
                        }
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activitiesSetup.assignmentTypes[index].sectionAssignments.map((assignment, j) => {
                        actions = [
                            {
                                callback: () => {
                                    if (assignment && assignment.id) {
                                        onEditClick(assignment.id, index, j, false);
                                    }
                                },
                                id: 0,
                                label: resources.btnEdit
                            },
                            {
                                callback: () => {
                                    if (assignment && assignment.id) {
                                        onCopy(assignment.id, index, j);
                                    }
                                },
                                id: 1,
                                label: resources.btnCopy
                            },
                            {
                                callback: () => {
                                    if (assignment && assignment.id) {
                                        onDelete(assignment.id);
                                    }
                                },
                                id: 2,
                                label: resources.btnDelete
                            }
                        ];

                        actionView = [
                            {
                                callback: () => {
                                    if (assignment && assignment.id) {
                                        onEditClick(assignment.id, index, j, true);
                                    }
                                },
                                id: 2,
                                label: resources.btnView
                            }
                        ];

                        return (
                            <React.Fragment key={`activitiesTable_${j}`}>
                                <TableExpandableRow key={`rowActivity_${j}`}>
                                    <TableCell columnName={resources.lblTitle}>
                                        <Hidden smDown>
                                            <div>
                                                <ActionMenu
                                                    absolutePosition2
                                                    actions={isRestricted ? actionView : assignment.allowDelete ? actions : actions.splice(0, 2)}
                                                    id={`titleOp_${index}_${j}`}
                                                />
                                                {assignment.title}
                                            </div>
                                        </Hidden>
                                        <Hidden mdUp>
                                            <div>
                                                {assignment.title}
                                            </div>
                                        </Hidden>
                                    </TableCell>
                                    <Hidden mdUp>
                                        <TableCell>
                                            <div>
                                                <ActionMenu
                                                    absolutePosition2
                                                    actions={isRestricted ? actionView : assignment.allowDelete ? actions : actions.splice(0, 2)}
                                                    id={`titleOp_${index}_${j}`}
                                                />
                                            </div>
                                        </TableCell>
                                    </Hidden>
                                    {assignment.isExtraCredit ?
                                        (
                                            <TableCell>
                                                <Grid container>
                                                    <Grid item>
                                                        {resources.lblExtraCredit}
                                                    </Grid>
                                                    <Hidden smDown>
                                                        <Tooltip
                                                            id={`tltMoreInfo_${index}_${j}`}
                                                            title={resources.lblMoreInfo}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.lblActivityWithExtraCredit}
                                                                className={classes.marginTopTool}
                                                                color="gray"
                                                                id={`btnMoreInfo_${index}_${j}`}
                                                                name="info"
                                                                onClick={onOpenPopper}
                                                            >
                                                                <Icon
                                                                    name="info"
                                                                    type={ResultType.info}
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Hidden>
                                                    <Hidden mdUp>
                                                        <Tooltip
                                                            id={`tltMoreInfo_${index}_${j}`}
                                                            title={resources.lblMoreInfo}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.lblActivityWithExtraCredit}
                                                                color="gray"
                                                                id={`btnMoreInfo_${index}_${j}`}
                                                                name="info"
                                                                onClick={onOpenPopper}
                                                            >
                                                                <Icon
                                                                    name="info"
                                                                    type={ResultType.info}
                                                                />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Hidden>
                                                    <Popper
                                                        arrow
                                                        id={`popMoreInfo_${index}_${j}`}
                                                        open={assignment.isOpenInfo ?? false}
                                                        placement="bottom-start"
                                                        anchorEl={anchorEl}
                                                        onClickAway={onClosePopper}
                                                        text={resources.lblActivityWithExtraCredit}
                                                        transition={false}
                                                        TextTypographyProps={{ className: classes.popperText }}
                                                    />
                                                </Grid>
                                            </TableCell>
                                        )
                                        : <TableCell />}
                                    <TableCell columnName={resources.lblAssigned}>
                                        {assignment.assignedDate}
                                    </TableCell>
                                    <TableCell columnName={resources.lblDue}>
                                        {assignment.dueDate}
                                    </TableCell>
                                    {isRestricted && (
                                        <TableCell columnName={resources.lblGradesDue}>
                                            {assignment.assignmentEndDate}
                                        </TableCell>
                                    )}
                                    <TableEditableCell
                                        columnName={resources.lblPossiblePoints}
                                        editableComponent={
                                            (
                                                <div>
                                                    <Grid container spacing={1}>
                                                        <Grid item md={12}>
                                                            <TextField
                                                                cell
                                                                disabled={isRestricted}
                                                                id={`txtPossiblePoints_${index}_${j}`}
                                                                numeric
                                                                size="small"
                                                                type="text"
                                                                value={assignment.possiblePoints}
                                                                onChange={onTextFieldChange}
                                                                onBlur={onBlurTextField}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            )
                                        }
                                    />
                                    {activitiesSetup.showMidterm ?
                                        (
                                            <TableEditableCell
                                                columnName={activitiesSetup.weightMethod === 2 ? resources.lblMidtermWeight
                                                    : resources.lblCountsTowardMidterm}
                                                editableComponent={
                                                    (
                                                        <div>
                                                            {activitiesSetup.weightMethod === 2 ?
                                                                (
                                                                    <Grid container spacing={1}>
                                                                        <Grid item md={6}>
                                                                            <TextField
                                                                                cell
                                                                                disabled={isRestricted}
                                                                                id={`txtCountsTowardMidterm_${index}_${j}`}
                                                                                numeric
                                                                                size="small"
                                                                                type="text"
                                                                                value={assignment.midtermWeight}
                                                                                onBlur={onBlurTextField}
                                                                                onChange={onTextFieldChange}
                                                                            />
                                                                        </Grid>
                                                                        {!assignment.isExtraCredit ?
                                                                            (
                                                                                <>
                                                                                    <Grid item md={4} className={classes.marginTop}>
                                                                                        <Text
                                                                                            disabled={isRestricted}
                                                                                            id={`txtPercentageMidterm_${index}_${j}`}
                                                                                            color={'textSecondary'}
                                                                                        >
                                                                                            {assignment.midtermWeight ? assignment.midtermPercentage ?
                                                                                                Format.toString(resources.formatPercentage,
                                                                                                    [assignment.midtermPercentage])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                    {activitiesSetup.assignmentTypes[index].isMidtermDrop ||
                                                                                        activitiesSetup.assignmentTypes[index].midtermMaxDrop !== 0 &&
                                                                                        activitiesSetup.assignmentTypes[index].midtermDropLowest >
                                                                                        activitiesSetup.assignmentTypes[index].midtermMaxDrop ||
                                                                                        activitiesSetup.assignmentTypes[index].midtermDropHighest >
                                                                                        activitiesSetup.assignmentTypes[index].midtermMaxDrop ?
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
                                                                                disabled={isRestricted}
                                                                                id={`chkCountsTowardMidterm_${index}_${j}`}
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
                                                                                            disabled={isRestricted}
                                                                                            id={`txtPercentageMidterm_${index}_${j}`}
                                                                                            color={'textSecondary'}
                                                                                        >
                                                                                            {assignment.midtermWeight ? assignment.midtermPercentage ?
                                                                                                Format.toString(resources.formatPercentage,
                                                                                                    [assignment.midtermPercentage])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                                : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                    {activitiesSetup.assignmentTypes[index].isMidtermDrop ||
                                                                                        activitiesSetup.assignmentTypes[index].midtermMaxDrop !== 0 &&
                                                                                        activitiesSetup.assignmentTypes[index].midtermDropLowest >
                                                                                        activitiesSetup.assignmentTypes[index].midtermMaxDrop ||
                                                                                        activitiesSetup.assignmentTypes[index].midtermDropHighest >
                                                                                        activitiesSetup.assignmentTypes[index].midtermMaxDrop ?
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
                                        )
                                        : undefined}
                                    <TableEditableCell
                                        columnName={activitiesSetup.weightMethod === 2 ? resources.lblFinalWeight
                                            : resources.lblCountsTowardFinal}
                                        editableComponent={
                                            (
                                                <div>
                                                    {activitiesSetup.weightMethod === 2 ?
                                                        (
                                                            <Grid container spacing={1}>
                                                                <Grid item md={6}>
                                                                    <TextField
                                                                        cell
                                                                        disabled={isRestricted}
                                                                        id={`txtCountsTowardFinal_${index}_${j}`}
                                                                        numeric
                                                                        size="small"
                                                                        type="text"
                                                                        value={assignment.finalWeight}
                                                                        onBlur={onBlurTextField}
                                                                        onChange={onTextFieldChange}
                                                                    />
                                                                </Grid>
                                                                {!assignment.isExtraCredit ?
                                                                    (
                                                                        <>
                                                                            <Grid item md={4} className={classes.marginTop}>
                                                                                <Text
                                                                                    disabled={isRestricted}
                                                                                    id={`txtPercentageFinal_${index}_${j}`}
                                                                                    color={'textSecondary'}
                                                                                >
                                                                                    {assignment.finalWeight ? assignment.finalPercentage ?
                                                                                        Format.toString(resources.formatPercentage,
                                                                                            [assignment.finalPercentage])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                </Text>
                                                                            </Grid>
                                                                            {activitiesSetup.assignmentTypes[index].isFinalDrop ||
                                                                                activitiesSetup.assignmentTypes[index].finalMaxDrop !== 0 &&
                                                                                activitiesSetup.assignmentTypes[index].finalDropLowest >
                                                                                activitiesSetup.assignmentTypes[index].finalMaxDrop ||
                                                                                activitiesSetup.assignmentTypes[index].finalDropHighest >
                                                                                activitiesSetup.assignmentTypes[index].finalMaxDrop ?
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
                                                                        disabled={isRestricted}
                                                                        id={`chkCountsTowardFinal_${index}_${j}`}
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
                                                                                    disabled={isRestricted}
                                                                                    id={`txtPercentageFinal_${index}_${j}`}
                                                                                    color={'textSecondary'}
                                                                                >
                                                                                    {assignment.finalWeight ? assignment.finalPercentage ?
                                                                                        Format.toString(resources.formatPercentage,
                                                                                            [assignment.finalPercentage])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])
                                                                                        : Format.toString(resources.formatPercentage, ['0.00'])}
                                                                                </Text>
                                                                            </Grid>
                                                                            {activitiesSetup.assignmentTypes[index].isFinalDrop ||
                                                                                activitiesSetup.assignmentTypes[index].finalMaxDrop !== 0 &&
                                                                                activitiesSetup.assignmentTypes[index].finalDropLowest >
                                                                                activitiesSetup.assignmentTypes[index].finalMaxDrop ||
                                                                                activitiesSetup.assignmentTypes[index].finalDropHighest >
                                                                                activitiesSetup.assignmentTypes[index].finalMaxDrop ?
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
                                                        )}
                                                </div>
                                            )
                                        }
                                    />
                                </TableExpandableRow>
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
            <br />
            {
                (activitiesSetup.assignmentTypes[index].midtermMaxDrop !== 0 &&
                    activitiesSetup.assignmentTypes[index].midtermDropLowest >
                    activitiesSetup.assignmentTypes[index].midtermMaxDrop ||
                    activitiesSetup.assignmentTypes[index].midtermDropHighest >
                    activitiesSetup.assignmentTypes[index].midtermMaxDrop) ||
                    (activitiesSetup.assignmentTypes[index].finalMaxDrop !== 0 &&
                        activitiesSetup.assignmentTypes[index].finalDropLowest >
                        activitiesSetup.assignmentTypes[index].finalMaxDrop ||
                        activitiesSetup.assignmentTypes[index].finalDropHighest >
                        activitiesSetup.assignmentTypes[index].finalMaxDrop) ||
                    activitiesSetup.assignmentTypes[index].isFinalDrop ||
                    activitiesSetup.assignmentTypes[index].isMidtermDrop ?
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
        </React.Fragment>
    );

    return (
        <>
            {content}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ActivitiesTable);