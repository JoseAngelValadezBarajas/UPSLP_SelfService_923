/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AttendanceDetail.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel, { StatusLabelType } from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAdvisingAttendanceCourseDetails } from '../../../Types/Advising/IAdvisingAttendanceCourseDetails';
import { IAdvisingAttendanceDetails } from '../../../Types/Advising/IAdvisingAttendanceDetails';
import { IAttendanceResources } from '../../../Types/Resources/Classes/IAttendanceResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IAttendanceDetailProps {
    attendanceDetails: IAdvisingAttendanceDetails[];
    courseDetails: IAdvisingAttendanceCourseDetails;
    onClickAttendance: () => void;
    onViewDetailsSection: (id: number) => void;
    showLowAttendanceWarning: boolean;
    resources: IAttendanceRes;
}

interface IAttendanceRes extends IAttendanceResources {
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th': {
                width: '25%'
            }
        },
        // Fix: v4.0 (Break-all)
        [theme.breakpoints.only('xs')]: {
            '& tbody td:before, & tbody th:before': {
                minWidth: '8rem !important',
                wordBreak: 'break-word !important'
            }
        }
    }
}));

type PropsWithStyles = IAttendanceDetailProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AttendanceDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        attendanceDetails,
        classes,
        courseDetails,
        resources,
        showLowAttendanceWarning,
        onClickAttendance,
        onViewDetailsSection,
    } = props;

    const onViewSection = (): void => {
        onViewDetailsSection(courseDetails.sectionId);
    };

    const getStatusType = (category: number): StatusLabelType => {
        let type: StatusLabelType = 'default';
        switch (category) {
            case 1:
            case 3:
                type = 'pending';
                break;
            case 2:
            case 4:
                type = 'error';
                break;
            case 5:
                type = 'success';
                break;
        }
        return type;
    };

    let lblLowAttendance: JSX.Element | undefined;
    if (courseDetails.hasLowAttendance && showLowAttendanceWarning) {
        lblLowAttendance = (
            <StatusLabel
                id={`stsLowAttendance`}
                text={resources.lblLowAttendance}
                type="draft"
            />
        );
    }

    return (
        <>
            <Grid container>
                <Grid item>
                    <Paragraph
                        id="prgBreadcrumbs"
                        text={Format.toString(resources.formatBreadcrumbs,
                            [resources.lblAttendance, resources.lblOverallAttendance, resources.lblDailyAttendance]
                        )}
                        events={[onClickAttendance]}
                    />
                </Grid>
            </Grid>
            <br />
            <Card>
                <CardContent>
                    <Grid container justifyContent="space-between" spacing={1}>
                        <Grid item xs={12} sm={8}>
                            <Grid container spacing={1}>
                                <Grid item>
                                    <Button
                                        TextProps={{
                                            weight: 'strong'
                                        }}
                                        align="left"
                                        id={`courseName_${courseDetails.section}_AttendanceDetail`}
                                        onClick={onViewSection}
                                        textVariantStyling="inherit"
                                        variant="text"
                                    >
                                        {`${courseDetails.sectionEventId}: ${courseDetails.sectionLongName}`}
                                    </Button>
                                </Grid>
                                <Hidden smDown>
                                    <Grid item>
                                        {lblLowAttendance}
                                    </Grid>
                                </Hidden>
                            </Grid>
                            <Grid container direction="column" spacing={1}>
                                <Grid item>
                                    <Text color="textSecondary" size="small">
                                        {Format.toString(resources.formatYearTermSession, [courseDetails.year, courseDetails.term, courseDetails.session])}
                                    </Text>
                                    <Text color="textSecondary" size="small">
                                        {Format.toString(resources.formatSubtypeSection, [courseDetails.sectionEventSubType, courseDetails.section])}
                                    </Text>
                                    <Text color="textSecondary" size="small">
                                        {Format.toString(resources.formatTypeCreditType, [courseDetails.sectionType, courseDetails.sectionCreditType])}
                                    </Text>
                                </Grid>
                                <Hidden mdUp>
                                    <Grid item>
                                        {lblLowAttendance}
                                    </Grid>
                                </Hidden>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Text>
                                {resources.lblOverallStatus}
                                {courseDetails.overallStatus}
                            </Text>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>
            <br />
            <Card>
                <CardContent>
                    <Table
                        breakpoint="sm"
                        classes={{ root: classes.table }}
                        id="tblAttenndaceDetails"
                        variant="card"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    {resources.lblDate}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblTime}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblAttendanceStatus}
                                </TableCell>
                                <TableCell component="th">
                                    {resources.lblComments}
                                </TableCell>
                                <TableCell />
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {attendanceDetails.map((attendance, j) =>
                                (
                                    <TableRow
                                        key={`studentsList_${j}`}
                                    >
                                        <TableCell columnName={resources.lblDate}>
                                            <span>
                                                {attendance.date}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblTime}>
                                            <span>
                                                {attendance.startTime && attendance.endTime ?
                                                    Format.toString(resources.formatTime, [attendance.startTime, attendance.endTime])
                                                    : undefined}
                                            </span>
                                        </TableCell>
                                        <TableCell columnName={resources.lblAttendanceStatus}>
                                            <StatusLabel
                                                id={`stsAttendanceStatus`}
                                                text={attendance.status}
                                                type={getStatusType(attendance.category)}
                                            />
                                        </TableCell>
                                        <TableCell columnName={resources.lblComments}>
                                            <span>
                                                {attendance.comments}
                                            </span>
                                        </TableCell>
                                    </TableRow>
                                )
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    );

};
// #endregion Component

// Export: Component
export default withStyles(styles)(AttendanceDetail);