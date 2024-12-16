/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseStatisticsModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ICourseStatisticsList } from '../../../Types/Section/ICourseStatisticsList';
// #endregion Imports

// #region Types
export interface ICourseStatisticsModalProps {
    courseStatistics?: ICourseStatisticsList;
    open: boolean;
    periodDescription: string;
    resources: ICourseStatisticsModalResProps;
    sectionDescription: string;
    onClose: () => void;
    onDownloadModal: (defaultName: string) => void;
}

export interface ICourseStatisticsModalResProps {
    formatCourseSectionTitle: string;
    formatDownloadStatistics: string;
    formatTotalStudents: string;
    lblAverageScore: string;
    lblDownload: string;
    lblDownloadFileName: string;
    lblFinal: string;
    lblHighScore: string;
    lblLowScore: string;
    lblMidTerm: string;
    lblPeriod: string;
    lblPercentage: string;
    lblPercentIncluded: string;
    lblStandardDeviation: string;
    lblVariance: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child()': {
                width: '15%'
            }
        }
    },
    tableCell: {
        textAlign: 'center'
    }
}));

type PropsWithStyles = ICourseStatisticsModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const CourseStatisticsModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        courseStatistics,
        open,
        periodDescription,
        resources,
        sectionDescription,
        onClose,
        onDownloadModal
    } = props;

    const onDownloadStatistics = () => {
        onDownloadModal(resources.lblDownloadFileName);
    };

    return (
        <Modal
            disableHeaderTypography
            id="courseStatisticsModal"
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatCourseSectionTitle, [periodDescription, sectionDescription])}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblCourseStatisticsModal"
            >
                <TableHead>
                    <TableRow>
                        <TableCell>
                            <span>
                                {resources.lblPeriod}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span>
                                {resources.lblPercentIncluded}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span>
                                {resources.lblAverageScore}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span>
                                {resources.lblHighScore}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span>
                                {resources.lblLowScore}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span>
                                {resources.lblStandardDeviation}
                            </span>
                        </TableCell>
                        <TableCell align="right">
                            <span>
                                {resources.lblVariance}
                            </span>
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courseStatistics && courseStatistics.sectionStatistic ? courseStatistics.sectionStatistic.map((course, i) => (
                        course.isMidterm && courseStatistics.midtermGrades ?
                            (
                                <React.Fragment key={`courseStatisticsModal_${i}`}>
                                    <TableRow>
                                        <TableCell columnName={resources.lblPeriod}>
                                            <span>
                                                {resources.lblMidTerm}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblPercentIncluded} align="right">
                                            <span>
                                                {course.percentIncluded}
                                                {resources.lblPercentage}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblAverageScore} align="right">
                                            <span>
                                                {course.averageScore}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblHighScore} align="right">
                                            <span>
                                                {course.highScore}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblLowScore} align="right">
                                            <span>
                                                {course.lowScore}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblStandardDeviation} align="right">
                                            <span>
                                                {course.standardDeviation}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblVariance} align="right">
                                            <span>
                                                {course.variance}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                </React.Fragment>
                            )
                            : !course.isMidterm ?
                                (
                                    <React.Fragment key={`courseStatisticsModal_${i}`}>
                                        <TableRow>
                                            <TableCell columnName={resources.lblPeriod}>
                                                <span>
                                                    {resources.lblFinal}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblPercentIncluded} align="right">
                                                <span>
                                                    {course.percentIncluded}
                                                    {resources.lblPercentage}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblAverageScore} align="right">
                                                <span>
                                                    {course.averageScore}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblHighScore} align="right">
                                                <span>
                                                    {course.highScore}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblLowScore} align="right">
                                                <span>
                                                    {course.lowScore}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblStandardDeviation} align="right">
                                                <span>
                                                    {course.standardDeviation}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVariance} align="right">
                                                <span>
                                                    {course.variance}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </React.Fragment>
                                )
                                : undefined
                    )) : undefined}
                </TableBody>
            </Table>
            <br />
            <Grid container>
                <Grid item>
                    <Text>
                        {courseStatistics && courseStatistics.studentCount
                            ? Format.toString(resources.formatTotalStudents, [courseStatistics.studentCount]) : ''}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item>
                    <Button
                        IconProps={{
                            name: 'download'
                        }}
                        aria-label={Format.toString(resources.formatDownloadStatistics, [periodDescription, sectionDescription])}
                        id="btnDownloadStatistics"
                        align="left"
                        textVariantStyling="inherit"
                        variant="text"
                        onClick={onDownloadStatistics}
                    >
                        {resources.lblDownload}
                    </Button>
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

export default withStyles(styles)(CourseStatisticsModal);