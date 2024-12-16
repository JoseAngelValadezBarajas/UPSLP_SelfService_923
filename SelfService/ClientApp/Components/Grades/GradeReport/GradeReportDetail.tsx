/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: GradeReportDetail.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IGradeReport } from '../../../Types/Grades/IGradeReport';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';

// #endregion

// #region Internal types
export interface IGradeReportDetailProps {
    advisingCourseworkClaim?: boolean;
    gradesCourseworkClaim?: boolean;
    impersonateInfo?: IImpersonateInfo;
    selectedPeriod?: string;
    sequenceData?: string;
    showMidTermGrade: boolean;
    showProjectedGrade: boolean;
    transcriptSequences: IGradeReport;
    onViewDetails: (courseDetail: IGradeReport) => void;
    onDetailsSection: (id: number) => void;

    resources: IGradeReportDetailResProps;
}

export interface IGradeReportDetailResProps {
    formatCreditType: string;
    formatProjectedGrade: string;
    formatSectionDetail: string;
    formatSectionSubType: string;
    formatSectionYTS: string;
    lblAction: string;
    lblAttempted: string;
    lblAwards: string;
    lblCourseComments: string;
    lblCourseDetail: string;
    lblCredits: string;
    lblCreditsDetail: string;
    lblEarned: string;
    lblFinalGradeComments: string;
    lblFinalGradeDetail: string;
    lblGpa: string;
    lblGradeReport: string;
    lblMidGradeComments: string;
    lblMidtermGradeDetail: string;
    lblNameDetail: string;
    lblOverall: string;
    lblOverallAward: string;
    lblPeriod: string;
    lblPrintReport: string;
    lblProjectedGradeDetail: string;
    lblQualityPointsDetail: string;
    lblSectionDetail: string;
    lblSeparator: string;
    lblSequence: string;
    lblSequenceDrop: string;
    lblSessionDetail: string;
    lblSubtype: string;
    lblTerm: string;
    lblTermAward: string;
    lblViewActivities: string;
}

const styles = ((theme: Theme) => createStyles({
    commentsRow: {
        height: Tokens.spacing70,
    },
    iconPosition: {
        marginLeft: `${Tokens.sizingSmall}!important`
    },
    noBottomBorder: {
        '& > th': {
            borderBottom: '0'
        },
        '& > td': {
            borderBottom: '0'
        }
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '15%'
            }
        }
    },
    textUp: {
        marginTop: '0rem!important'
    }
}));

type PropsWithStyles = IGradeReportDetailProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const GradeReportDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        advisingCourseworkClaim,
        gradesCourseworkClaim,
        classes,
        impersonateInfo,
        showMidTermGrade,
        showProjectedGrade,
        transcriptSequences,
        onViewDetails,
        onDetailsSection,

        resources
    } = props;

    return (
        <>
            <Hidden smDown>
                <Grid container>
                    <Grid item md={6} lg={6}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h3">
                                            {resources.lblCredits}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblAttempted}
                                            textUp={transcriptSequences.creditsAttempted}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblEarned}
                                            textUp={transcriptSequences.creditsEarned}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item md={6} lg={6}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h3">
                                            {resources.lblGpa}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblTerm}
                                            textUp={transcriptSequences.gpaTerm}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblOverall}
                                            textUp={transcriptSequences.gpaOverall}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Hidden>
            <Hidden mdUp>
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h3">
                                            {resources.lblCredits}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblAttempted}
                                            textUp={transcriptSequences.creditsAttempted}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblEarned}
                                            textUp={transcriptSequences.creditsEarned}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item xs={12}>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h3">
                                            {resources.lblGpa}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblTerm}
                                            textUp={transcriptSequences.gpaTerm}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                    <Grid item xs>
                                        <UpDownLabel
                                            classes={{ textUp: classes.textUp }}
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblOverall}
                                            textUp={transcriptSequences.gpaOverall}
                                            withMarginTextUp
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Hidden>
            <br />
            <Grid container spacing={2}>
                <Grid item xs>
                    {transcriptSequences.sessions?.map((session, i) => (
                        <React.Fragment key={`cardSession_${session.sessionDesc}_${i}`}>
                            <Card key={`session_${session.sessionDesc}_${i}`}>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs>
                                            <Text size="h3">
                                                <span>
                                                    {session.sessionDesc}
                                                </span>
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs>
                                            <Table
                                                breakpoint="sm"
                                                classes={{ root: classes.table }}
                                                id="tblActivityGradesMidterm"
                                                variant="expansionPanels"
                                            >
                                                <TableHead>
                                                    <TableRow>
                                                        <TableCell
                                                            id="lblCourseDetail"
                                                            component="th">
                                                            {resources.lblCourseDetail}
                                                        </TableCell>
                                                        <TableCell
                                                            id="lblCreditsDetail"
                                                            component="th" align="right">
                                                            {resources.lblCreditsDetail}
                                                        </TableCell>
                                                        <TableCell
                                                            id="lblQualityPointsDetail"
                                                            component="th" align="right">
                                                            {resources.lblQualityPointsDetail}
                                                        </TableCell>
                                                        {showMidTermGrade ? (
                                                            < TableCell
                                                                id="lblMidtermGradeDetail"
                                                                component="th" align="right">
                                                                {resources.lblMidtermGradeDetail}
                                                            </TableCell>
                                                        ) : undefined}
                                                        {showProjectedGrade ? (
                                                            <TableCell
                                                                id="lblProjectedGradeDetail"
                                                                component="th" align="right">
                                                                {resources.lblProjectedGradeDetail}
                                                            </TableCell>
                                                        ) : undefined}
                                                        <TableCell
                                                            id="lblFinalGradeDetail"
                                                            component="th" align="right">
                                                            {resources.lblFinalGradeDetail}
                                                        </TableCell>
                                                        {((impersonateInfo?.personId && advisingCourseworkClaim) || (!impersonateInfo?.personId && gradesCourseworkClaim)) ? (
                                                            <TableCell
                                                                id="lblAction"
                                                                component="th" align="right">
                                                                {resources.lblAction}
                                                            </TableCell>
                                                        ) : undefined}
                                                    </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                    {session.courses.map((course, j) => {
                                                        const onClickDetails = (): void => {
                                                            onDetailsSection(course.sectionId);
                                                        };
                                                        return (
                                                            <>
                                                                <TableExpandableRow key={`gradeReportList_${course.sectionId}_${j}`}
                                                                    TableRowProps={(course.courseComments && course.courseComments.length > 0 ||
                                                                        course.midGradeComments && course.midGradeComments.length > 0 ||
                                                                        course.finalGradeComments && course.finalGradeComments.length > 0) ? {
                                                                        classes: { root: classes.noBottomBorder }
                                                                    } : undefined}>
                                                                    <TableCell>
                                                                        {course.sectionId ? (
                                                                            <Button
                                                                                TextProps={{
                                                                                    weight: 'strong'
                                                                                }}
                                                                                align="left"
                                                                                id={`btnSectionDetail_${course.sectionId}_${j}`}
                                                                                textVariantStyling="inherit"
                                                                                variant="text"
                                                                                onClick={onClickDetails}
                                                                            >
                                                                                {Format.toString(resources.formatSectionDetail,
                                                                                    [course.eventId, course.name])}
                                                                            </Button>
                                                                        ) : (
                                                                            <Text
                                                                                weight="strong"
                                                                            >
                                                                                {Format.toString(resources.formatSectionDetail,
                                                                                    [course.eventId, course.name])}
                                                                            </Text>
                                                                        )}
                                                                        <Text
                                                                            color="textSecondary"
                                                                            size="small"
                                                                        >
                                                                            {Format.toString(resources.formatSectionSubType, [course.subType, course.section])}
                                                                        </Text>
                                                                        <Text
                                                                            color="textSecondary"
                                                                            size="small"
                                                                        >
                                                                            {Format.toString(resources.formatCreditType, [course.eventTypeDesc, course.creditTypeDesc])}
                                                                        </Text>
                                                                        <Hidden mdUp>
                                                                            <TableCell columnName={resources.lblFinalGradeDetail} align="right">
                                                                                <span>
                                                                                    {course.finalGrade}
                                                                                </span>
                                                                            </TableCell>
                                                                        </Hidden>
                                                                    </TableCell>
                                                                    <TableCell columnName={resources.lblCreditsDetail} align="right">
                                                                        <span>
                                                                            {course.credits}
                                                                        </span>
                                                                    </TableCell>
                                                                    <TableCell columnName={resources.lblQualityPointsDetail} align="right">
                                                                        <span>
                                                                            {course.qualityPoints}
                                                                        </span>
                                                                    </TableCell>
                                                                    {showMidTermGrade ? (
                                                                        <TableCell columnName={resources.lblMidtermGradeDetail} align="right">
                                                                            <span>
                                                                                {course.midtermGrade}
                                                                            </span>
                                                                        </TableCell>
                                                                    ) : undefined}
                                                                    {showProjectedGrade ? (
                                                                        <TableCell columnName={resources.lblProjectedGradeDetail} align="right">
                                                                            {course.projectedGrade ? (
                                                                                <span>
                                                                                    {Format.toString(resources.formatProjectedGrade,
                                                                                        [course.projectedGradePercentage, course.projectedGrade])}
                                                                                </span>
                                                                            ) : undefined}
                                                                        </TableCell>
                                                                    ) : undefined}
                                                                    <Hidden smDown>
                                                                        <TableCell columnName={resources.lblFinalGradeDetail} align="right">
                                                                            <span>
                                                                                {course.finalGrade}
                                                                            </span>
                                                                        </TableCell>
                                                                    </Hidden>
                                                                    {((impersonateInfo?.personId && advisingCourseworkClaim)
                                                                        || (!impersonateInfo?.personId && gradesCourseworkClaim)) ? (
                                                                        <TableCell columnName={resources.lblAction} align="right">
                                                                            {course.sectionId ?
                                                                                (
                                                                                    <>
                                                                                        <Button
                                                                                            align="right"
                                                                                            id={`viewDetails_${course.sectionId}_${j}`}
                                                                                            textVariantStyling="inherit"
                                                                                            variant="text"
                                                                                            onClick={onViewDetails(course)}
                                                                                        >
                                                                                            {resources.lblViewActivities}
                                                                                        </Button>
                                                                                    </>
                                                                                ) : undefined}
                                                                        </TableCell>
                                                                    ) : undefined}
                                                                    <Hidden smUp>
                                                                        <>
                                                                            {(course.courseComments && course.courseComments.length > 0 ||
                                                                                course.midGradeComments && course.midGradeComments.length > 0 ||
                                                                                course.finalGradeComments && course.finalGradeComments.length > 0) ? (
                                                                                <>
                                                                                    {course.courseComments.length > 0 ? (
                                                                                        <TableCell columnName={resources.lblCourseComments}>
                                                                                            <span>
                                                                                                {course.courseComments}
                                                                                            </span>
                                                                                        </TableCell>
                                                                                    ) : undefined}
                                                                                    {course.midGradeComments.length > 0 ? (
                                                                                        <TableCell columnName={resources.lblMidGradeComments}>
                                                                                            <span>
                                                                                                {course.midGradeComments}
                                                                                            </span>
                                                                                        </TableCell>
                                                                                    ) : undefined}
                                                                                    {course.finalGradeComments.length > 0 ? (
                                                                                        <TableCell columnName={resources.lblFinalGradeComments}>
                                                                                            <span>
                                                                                                {course.finalGradeComments}
                                                                                            </span>
                                                                                        </TableCell>
                                                                                    ) : undefined}
                                                                                </>
                                                                            ) : undefined}
                                                                        </>
                                                                    </Hidden>
                                                                </TableExpandableRow>
                                                                <Hidden smDown>
                                                                    <>
                                                                        {(course.courseComments && course.courseComments.length > 0 ||
                                                                            course.midGradeComments && course.midGradeComments.length > 0 ||
                                                                            course.finalGradeComments && course.finalGradeComments.length > 0) ? (
                                                                            <TableCell className={classes.noBottomBorder} colSpan={7}>
                                                                                {course.courseComments.length > 0 ? (
                                                                                    <Grid item>
                                                                                        <Text
                                                                                            display="inline"
                                                                                            variant="h5"
                                                                                            weight="strong"
                                                                                        >
                                                                                            {resources.lblCourseComments}
                                                                                        </Text>
                                                                                        <Text
                                                                                            className={classes.commentsRow}
                                                                                            display="inline"
                                                                                        >
                                                                                            {course.courseComments}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                ) : undefined}
                                                                                {course.midGradeComments.length > 0 ? (
                                                                                    <Grid item>
                                                                                        <Text
                                                                                            display="inline"
                                                                                            variant="h5"
                                                                                            weight="strong"
                                                                                        >
                                                                                            {resources.lblMidGradeComments}
                                                                                        </Text>
                                                                                        <Text
                                                                                            className={classes.commentsRow}
                                                                                            display="inline"
                                                                                        >
                                                                                            {course.midGradeComments}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                ) : undefined}
                                                                                {course.finalGradeComments.length > 0 ? (
                                                                                    <Grid item>
                                                                                        <Text
                                                                                            display="inline"
                                                                                            variant="h5"
                                                                                            weight="strong"
                                                                                        >
                                                                                            {resources.lblFinalGradeComments}
                                                                                        </Text>
                                                                                        <Text
                                                                                            className={classes.commentsRow}
                                                                                            display="inline"
                                                                                        >
                                                                                            {course.finalGradeComments}
                                                                                        </Text>
                                                                                    </Grid>
                                                                                ) : undefined}
                                                                            </TableCell>
                                                                        ) : undefined}
                                                                    </>
                                                                </Hidden>
                                                            </>
                                                        );
                                                    })}
                                                </TableBody>
                                            </Table>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <br />
                        </React.Fragment>
                    ))}
                </Grid>
            </Grid>
            <Card>
                <CardContent>
                    <Grid container>
                        <Grid item xs>
                            <Text size="h3">
                                {resources.lblAwards}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12} sm={6} md={4}>
                            <Text>
                                {resources.lblTermAward}
                                {transcriptSequences.awardsTerm}
                            </Text>
                        </Grid>
                        <Grid item xs={12} sm={6} md={4}>
                            <Text>
                                {resources.lblOverallAward}
                                {transcriptSequences.awardsOverall}
                            </Text>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(GradeReportDetail);