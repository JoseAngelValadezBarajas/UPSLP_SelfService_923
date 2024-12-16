/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: TranscriptCourses.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { ITranscriptOrganization } from '../../../Types/UnofficialTranscript/ITranscriptOrganization';
// #endregion

// #region Internal types
export interface ITranscriptOrganizationProps {
    showAlternateGrade: boolean;
    transcriptOrgs: ITranscriptOrganization[];
    transcriptYearTermOrg: string;
    resources: ITranscriptOrganizationResProps;
}

export interface ITranscriptOrganizationResProps {
    lblAlternateGrade: string;
    lblCourse: string;
    lblCourseComments: string;
    lblCredits: string;
    lblFinalGradeComments: string;
    lblGrade: string;
    lblQualityPoints: string;
    lblSubType: string;
    lblTitle: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '40%'
            }
        }
    },
    commentsLabel: {
        color: Tokens.colorBrandNeutral500
    },
    commentsRow: {
        height: Tokens.spacing40
    },
    noBottomBorder: {
        '& > th': {
            borderBottom: '0'
        },
        '& > td': {
            borderBottom: '0'
        }
    }
}));

type PropsWithStyles = ITranscriptOrganizationProps & WithStyles<typeof styles> & WithWidth;
// #endregion

// #region Component
const TranscriptOrganization: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        showAlternateGrade,
        transcriptOrgs,
        transcriptYearTermOrg
    } = props;

    let period: JSX.Element;
    period = (
        <Text size="h3" weight="strong">
            {transcriptYearTermOrg}
        </Text>
    );

    const transcriptOrganization: JSX.Element[] = [];
    transcriptOrgs.forEach((transOrg, i) => {
        if (transOrg.transcriptCourses.length > 0) {
            transcriptOrganization.push(
                <div key={`transcriptOrganization_${i}`}>
                    <br />
                    {period}
                    <Text weight="strong" key={`period_${i}`}>
                        {transOrg.organizationName}
                    </Text>
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="tblOrganization"
                        variant="expansionPanels"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell>
                                    {resources.lblCourse}
                                </TableCell>
                                <TableCell>
                                    {resources.lblTitle}
                                </TableCell>
                                <TableCell>
                                    {resources.lblSubType}
                                </TableCell>
                                <TableCell>
                                    {resources.lblGrade}
                                </TableCell>
                                {showAlternateGrade ?
                                    (
                                        <TableCell>
                                            {resources.lblAlternateGrade}
                                        </TableCell>
                                    ) : undefined}
                                <TableCell>
                                    {resources.lblCredits}
                                </TableCell>
                                <TableCell>
                                    {resources.lblQualityPoints}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {transOrg.transcriptCourses.map((transCourseItem, i) =>
                            (
                                <>
                                    <TableExpandableRow
                                        key={`transcriptCourses_${i}`}
                                        expandedRowContent={(transCourseItem.comments.length > 0
                                            || transCourseItem.finalGradeComments.length > 0) ? (
                                            <Grid container spacing={1} direction="column">
                                                {transCourseItem.comments.length > 0 && (
                                                    <Grid item>
                                                        <Text
                                                            className={classes.commentsLabel}
                                                            display="inline"
                                                            size="medium"
                                                            weight="strong"
                                                        >
                                                            {resources.lblCourseComments}
                                                        </Text>
                                                        <Text
                                                            display="inline"
                                                        >
                                                            {transCourseItem.comments}
                                                        </Text>
                                                    </Grid>
                                                )}
                                                {transCourseItem.finalGradeComments.length > 0 && (
                                                    <Grid item>
                                                        <Text
                                                            className={classes.commentsLabel}
                                                            display="inline"
                                                            size="medium"
                                                            weight="strong"
                                                        >
                                                            {resources.lblFinalGradeComments}
                                                        </Text>
                                                        <Text
                                                            display="inline"
                                                        >
                                                            {transCourseItem.finalGradeComments}
                                                        </Text>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        ) : undefined}
                                    >
                                        <TableCell
                                            component="th"
                                            scope="row"
                                        >
                                            <span>
                                                {transCourseItem.eventId}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblTitle}>
                                            <span>
                                                {transCourseItem.eventName}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblSubType}>
                                            <span>
                                                {transCourseItem.eventSubType}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblGrade}>
                                            <span>
                                                {transCourseItem.finalGrade}
                                            </span>
                                        </TableCell>
                                        {showAlternateGrade ?
                                            (
                                                <TableCell columnName={resources.lblAlternateGrade}>
                                                    <span>
                                                        {transCourseItem.alternateGrade}
                                                    </span>
                                                </TableCell>
                                            )
                                            : undefined}
                                        <TableCell columnName={resources.lblCredits}>
                                            <span>
                                                {transCourseItem.credits}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblQualityPoints}>
                                            <span>
                                                {transCourseItem.qualityPoints}
                                            </span>
                                        </TableCell>
                                    </TableExpandableRow>
                                </>
                            ))}
                        </TableBody>
                    </Table>
                    <br />
                </div>
            );
        }
    });

    return (
        <>
            {transcriptOrganization}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(withWidth()(TranscriptOrganization));