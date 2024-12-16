/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ActivityGradeMidtermDetail.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IActivityGradesProgress } from '../../../Types/Grades/IActivityGradesProgress';
// #endregion

// #region Internal types
export interface IActivityGradesDetailProps {
    faculties?: string;
    lblYourMidtermProgress: string;
    midtermDetails: IActivityGradesProgress[];
    midtermScore?: string;
    resources: IActivityGradesDetailResProps;
}

export interface IActivityGradesDetailResProps {
    lblCumulativeGrade: string;
    lblDueDateDetail: string;
    lblEarnedPercentage: string;
    lblFinalGrade: string;
    lblGradeEntryDate: string;
    lblMaximumPoints: string;
    lblMidtermGrade: string;
    lblNa: string;
    lblNameDetail: string;
    lblPointsEarned: string;
    lblPotentialPercentage: string;
    lblSeparator: string;
    lblSlash: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            }
        }
    },
    textUp: {
        marginTop: '0rem!important'
    }
}));

type PropsWithStyles = IActivityGradesDetailProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ActivityGradesMidtermDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        lblYourMidtermProgress,
        midtermDetails,
        midtermScore,
        resources
    } = props;

    const header: JSX.Element = (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={7} md={4} lg={10}>
                    <Text size="h2">
                        {lblYourMidtermProgress}
                    </Text>
                </Grid>
                <Grid item xs={12} sm={5} md={4} lg={2}>
                    <UpDownLabel
                        classes={{ textUp: classes.textUp }}
                        sizeTextDown="small"
                        sizeTextUp="h3"
                        textDown={resources.lblCumulativeGrade}
                        textUp={midtermScore ? midtermScore + '%' : resources.lblNa}
                        withMarginTextUp
                    />
                </Grid>
            </Grid>
            <br />
        </>
    );

    const content: JSX.Element = (
        <Grid container spacing={3}>
            <Grid item xs>
                {midtermDetails.map((m, i) => (
                    <React.Fragment key={`midterm_${m.description}_${i}`}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Text size="h4">
                                    {m.description}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Table
                                breakpoint="sm"
                                classes={{ root: classes.table }}
                                id="tblActivityGradesMidterm"
                                variant="expansionPanels"
                            >
                                <TableHead>
                                    <TableRow key={resources.lblNameDetail}>
                                        <TableCell component="th">
                                            {resources.lblNameDetail}
                                        </TableCell>
                                        <TableCell component="th">
                                            {resources.lblDueDateDetail}
                                        </TableCell>
                                        <TableCell component="th" align="right">
                                            {resources.lblPointsEarned}
                                        </TableCell>
                                        <TableCell component="th" align="right">
                                            {resources.lblSlash}
                                        </TableCell>
                                        <TableCell component="th">
                                            {resources.lblMaximumPoints}
                                        </TableCell>
                                        <TableCell component="th" align="right">
                                            {resources.lblEarnedPercentage}
                                        </TableCell>
                                        <TableCell component="th" align="right">
                                            {resources.lblSlash}
                                        </TableCell>
                                        <TableCell component="th">
                                            {resources.lblPotentialPercentage}
                                        </TableCell>
                                        <TableCell component="th">
                                            {resources.lblGradeEntryDate}
                                        </TableCell>
                                        <TableCell />
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {m.studentAssignments.map(a => (
                                        <TableExpandableRow key={a.title}>
                                            <TableCell
                                                columnName={resources.lblNameDetail}
                                                component="th"
                                                scope="row"
                                            >
                                                <span>
                                                    {a.title}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblDueDateDetail}>
                                                <span>
                                                    {a.dueDate}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblPointsEarned} align="right">
                                                <span>
                                                    {a.earnedPoints}
                                                </span>
                                            </TableCell>
                                            <Hidden mdDown>
                                                <TableCell align="right">
                                                    <span>
                                                        {resources.lblSlash}
                                                    </span>
                                                </TableCell>
                                            </Hidden>
                                            <TableCell columnName={resources.lblMaximumPoints}>
                                                <span>
                                                    {a.possiblePoints}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblEarnedPercentage} align="right">
                                                <span>
                                                    {a.earnedPercentage}
                                                </span>
                                            </TableCell>
                                            <Hidden mdDown>
                                                <TableCell align="right">
                                                    <span>
                                                        {resources.lblSlash}
                                                    </span>
                                                </TableCell>
                                            </Hidden>
                                            <TableCell columnName={resources.lblPotentialPercentage}>
                                                <span>
                                                    {a.possiblePercentage}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblGradeEntryDate}>
                                                <span>
                                                    {a.gradeEntryDate}
                                                </span>
                                            </TableCell>
                                        </TableExpandableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Grid>
                        <br />
                    </React.Fragment>
                ))}
            </Grid>
        </Grid>
    );

    return (
        <ExpansionPanel
            header={header}
        >
            {content}
        </ExpansionPanel>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ActivityGradesMidtermDetail);