/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ScheduleItem.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar, { AvatarGroup } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
// #endregion

// #region Internal types
export interface IScheduleItemProps {
    id: string;
    resources: IScheduleItemResProps;
    section: IStudentSchedule;
}

export interface IScheduleItemPropsToExtend {
    getSectionStatus: (section: IStudentSchedule) => ISectionStatus;
    onViewSectionDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IScheduleItemResProps {
    formatBuilding: string;
    formatCreditType: string;
    formatDuration: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSession: string;
    formatSessionSectionSubtype: string;
    formatStartEndTime: string;
    formatTitleSection: string;
    formatTypeDuration: string;
    lblCeu: string;
    lblCredits: string;
    lblFees: string;
    lblMultipleInstructors: string;
    lblMultipleMeetingTimes: string;
    lblNoInstructor: string;
    lblNoSchedule: string;
    lblViewAttendance: string;
}

const styles = ((theme: Theme) => createStyles({
    attendanceIcon: {
        margin: Tokens.spacing30
    },
    avatar: {
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0rem!important'
        }
    },
    avatarContainer: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent: 'center'
        }
    },
    centered: {
        [theme.breakpoints.down('xs')]: {
            alignItems: 'center',
            display: 'flex'
        }
    },
    groupAvatarContainer: {
        [theme.breakpoints.up('sm')]: {
            display: 'flex',
            justifyContent: 'center'
        },
        marginLeft: Tokens.spacing30
    },
    iconStatusMessage: {
        display: 'inline-block',
        marginLeft: Tokens.spacing30,
        verticalAlign: 'middle'
    },
    instructorName: {
        wordBreak: 'normal'
    },
    multipleIinstructorName: {
        [theme.breakpoints.only('xs')]: {
            marginLeft: Tokens.spacing30
        }
    },
    meeting: {
        marginTop: Tokens.spacing30
    },
    statusContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
    },
    statusContent: {
        textAlign: 'right'
    },
    statusLabelMargin: {
        marginBottom: Tokens.spacing20,
        marginTop: Tokens.spacing20
    },
    statusMessage: {
        marginLeft: Tokens.spacing35
    }
}));

type PropsWithStyles = IScheduleItemProps & IScheduleItemPropsToExtend & WithStyles<typeof styles> & WithWidth;
// #endregion

// #region Component
const ScheduleItem: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        id,
        resources,
        section,
        width,
        getSectionStatus,
        onViewSectionDetails
    } = props;

    const sectionStatus: ISectionStatus = getSectionStatus(section);

    // #region Schedule(s)
    let schedules: JSX.Element | undefined;
    if (section.schedules) {
        if (section.schedules.length === 1) {
            schedules = (
                <>
                    <Text>
                        {Format.toString(resources.formatStartEndTime, [
                            section.schedules[0].startTime,
                            section.schedules[0].endTime
                        ])}
                    </Text>
                    <Text>
                        {section.schedules[0].dayDesc}
                    </Text>
                    <Text size="small">
                        {Format.toString(resources.formatOrganization, [section.schedules[0].orgName])}
                        {section.schedules[0].bldgName ?
                            Format.toString(resources.formatBuilding, [section.schedules[0].bldgName])
                            : ''}
                        {section.schedules[0].floorId ?
                            Format.toString(resources.formatFloor, [section.schedules[0].floorId])
                            : ''}
                        {section.schedules[0].roomId ?
                            Format.toString(resources.formatRoom, [section.schedules[0].roomId])
                            : ''}
                    </Text>
                </>
            );
        }
        else {
            schedules = (
                <Text>
                    {resources.lblMultipleMeetingTimes}
                </Text>
            );
        }
    }
    else {
        schedules = (
            <Text>
                {resources.lblNoSchedule}
            </Text>
        );
    }
    // #endregion Schedule

    // #region Instructor(s)
    let instructors: JSX.Element | undefined;
    if (section.instructors) {
        if (section.instructors.length === 1) {
            instructors = (
                <>
                    <div className={classes.avatarContainer}>
                        <Tooltip
                            id={`tltInstructor_${section.id}`}
                            title={section.instructors[0].fullName}
                            aria-label={section.instructors[0].fullName}
                        >
                            <Avatar
                                backgroundNumber={section.instructors[0].colorFirstLetter}
                                classes={{ root: classes.avatar }}
                                id={`avtInstructor_${section.id}`}
                                marginTopBottom={false}
                                marginTopBottom2
                                size="large"
                            >
                                {section.instructors[0].firstLetter || ''}
                            </Avatar>
                        </Tooltip>
                    </div>
                    <div>
                        <Text
                            align="center"
                            className={classes.instructorName}
                            size="small"
                        >
                            {section.instructors[0].fullName}
                        </Text>
                    </div>
                </>
            );
        }
        else {
            instructors = (
                <>
                    <div className={classes.groupAvatarContainer}>
                        <AvatarGroup
                            marginTopBottom={false}
                            marginTopBottom2
                            max={3}
                            size="large"
                            spacing="medium"
                        >
                            {section.instructors.map((instructor, iInstructor) => (
                                <Tooltip
                                    id={`tltInstructor_${section.id}_${iInstructor}`}
                                    key={`tltInstructor_${section.id}_${iInstructor}`}
                                    title={instructor.fullName}
                                    aria-label={instructor.fullName}
                                >
                                    <Avatar
                                        backgroundNumber={instructor.colorFirstLetter}
                                        id={`avtInstructor_${section.id}_${iInstructor}`}
                                        marginLeftRight={false}
                                        marginTopBottom={false}
                                        marginTopBottom2
                                        size="large"
                                    >
                                        {instructor.firstLetter || ''}
                                    </Avatar>
                                </Tooltip>
                            ))}
                        </AvatarGroup>
                    </div>
                    <div className={classes.multipleIinstructorName}>
                        <Text
                            align="center"
                            className={classes.instructorName}
                            size="small"
                        >
                            {resources.lblMultipleInstructors}
                        </Text>
                    </div>
                </>
            );
        }
    }
    else {
        instructors = (
            <>
                <div className={classes.avatarContainer}>
                    <Avatar
                        background="default"
                        classes={{ root: classes.avatar }}
                        id={`avtInstructor_${section.id}`}
                        marginTopBottom={false}
                        marginTopBottom2
                        size="large"
                        variant="default"
                    />
                </div>
                <div>
                    <Text
                        align="center"
                        className={classes.instructorName}
                        size="small"
                    >
                        {resources.lblNoInstructor}
                    </Text>
                </div>
            </>
        );
    }
    // #endregion Instructor(s)

    return (
        <Grid container>
            <Grid item xs={12} sm={4}>
                <Button
                    TextProps={{
                        size: 'h4',
                        weight: 'strong'
                    }}
                    align="left"
                    data-id={section.id}
                    id={`btnItemTitle_${id}_${section.id}`}
                    textVariantStyling="inherit"
                    variant="text"
                    onClick={onViewSectionDetails}
                >
                    {Format.toString(resources.formatTitleSection, [section.eventId, section.eventName])}
                </Button>
                {section.isConEd && (
                    <Text size="small">
                        {Format.toString(resources.formatSession, [section.sessionDesc])}
                    </Text>
                )}
                <Text size="small">
                    {Format.toString(resources.formatSessionSectionSubtype, [section.eventSubType, section.section])}
                </Text>
                <Text size="small">
                    {Format.toString(resources.formatCreditType, [section.eventType, section.creditTypeDescription ? section.creditTypeDescription : ''])}
                </Text>
                <Text size="small">
                    {Format.toString(resources.formatDuration, [section.startDate, section.endDate])}
                </Text>
                {section.areFeesApplicable ? (
                    <Text size="small">
                        {resources.lblFees}
                    </Text>
                ) : undefined}
                <div className={classes.meeting}>
                    {schedules}
                </div>
                {sectionStatus.importantMessage ? (
                    <>
                        <br />
                        <br />
                        <Text>
                            <div dangerouslySetInnerHTML={{ __html: sectionStatus.importantMessage }} />
                        </Text>
                    </>
                ) : undefined}
            </Grid>
            {width === 'xs' ? (
                <Grid
                    item
                    xs={12}
                    className={classes.centered}
                >
                    {instructors}
                </Grid>
            ) : undefined}
            <Grid item xs={12} sm={8}>
                <Grid
                    container
                    justifyContent={width === 'xs' ? 'flex-start' : 'space-around'}
                    spacing={1}
                >
                    {width === 'xs' ? undefined : (
                        <Grid item xs>
                            {instructors}
                        </Grid>
                    )}
                    {section.isConEd ? (
                        <Grid item xs>
                            <UpDownLabel
                                sizeTextDown="small"
                                sizeTextUp="h4"
                                textDown={resources.lblCeu}
                                textUp={section.ceu}
                                withMarginTextUp
                            />
                        </Grid>
                    ) : (
                        <Grid item xs>
                            <UpDownLabel
                                sizeTextDown="small"
                                sizeTextUp="h4"
                                textDown={resources.lblCredits}
                                textUp={section.credits}
                                withMarginTextUp
                            />
                        </Grid>
                    )}
                    <Grid item xs>
                        {section.hasAttendance && (
                            <UpDownLabel
                                colorTextDown="inherit"
                                colorTextUp="inherit"
                                indicatorUp={(
                                    <div className={classes.attendanceIcon}>
                                        <Icon name="clipboard-check" large />
                                    </div>
                                )}
                                sizeTextDown="small"
                                sizeTextUp="h4"
                                textDown={resources.lblViewAttendance}
                                textUp={''}
                                withMarginTextUp
                            />
                        )}
                    </Grid>
                    <Grid item xs className={classes.statusContainer}>
                        {sectionStatus.labelText ? (
                            <div className={classes.statusContent}>
                                <StatusLabel
                                    classes={{ root: classes.statusLabelMargin }}
                                    id={`stsLbl_${id}`}
                                    text={sectionStatus.labelText}
                                    type={sectionStatus.labelType}
                                />
                            </div>
                        ) : undefined}
                        {sectionStatus.message ? (
                            <div className={classes.statusContent}>
                                <Text
                                    align="right"
                                    className={classes.statusMessage}
                                >
                                    {sectionStatus.message}
                                </Text>
                                <div className={classes.iconStatusMessage}>
                                    {sectionStatus.statusIcon}
                                    {sectionStatus.statusInfo}
                                </div>
                            </div>
                        ) : undefined}
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(withWidth()(ScheduleItem));