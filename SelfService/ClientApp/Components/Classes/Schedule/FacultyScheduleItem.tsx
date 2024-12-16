/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FacultyScheduleItem.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar, { AvatarGroup } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { IFacultySchedule } from '../../../Types/Schedule/IFacultySchedule';
import { IYearTermSession } from '../../../Types/Generic/IYearTerm';
// #endregion

// #region Internal types
export interface IFacultyScheduleItemProps {
    id: string;
    resources: IFacultyScheduleItemResProps;
    section: IFacultySchedule;
    showClassListLink: boolean;
    onClassList: (period: IYearTermSession, id: number) => void;
}

export interface IFacultyScheduleItemPropsToExtend {
    onViewSectionDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IFacultyScheduleItemResProps {
    btnClassList: string;
    formatBuilding: string;
    formatDuration: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSession: string;
    formatSessionSectionSubtype: string;
    formatStartEndTime: string;
    formatTitleSection: string;
    formatType: string;
    lblMultipleInstructors: string;
    lblMultipleMeetingTimes: string;
    lblNoInstructor: string;
    lblNoSchedule: string;
}

const styles = ((theme: Theme) => createStyles({
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
        [theme.breakpoints.down('sm')]: {
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
    instructorName: {
        wordBreak: 'normal'
    },
    multipleInstructorName: {
        [theme.breakpoints.only('xs')]: {
            marginLeft: Tokens.spacing30
        }
    },
}));

type PropsWithStyles = IFacultyScheduleItemProps & IFacultyScheduleItemPropsToExtend & WithStyles<typeof styles>;
// #endregion

// #region Component
const FacultyScheduleItem: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        id,
        resources,
        section,
        showClassListLink,
        onClassList,
        onViewSectionDetails
    } = props;

    const onClassListClick = () => {
        const period: IYearTermSession = {
            session: section.session,
            term: section.term,
            year: Number(section.year)
        };
        onClassList(period, section.id);
    };

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
                    <div className={classes.multipleInstructorName}>
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
            <Grid item xs={12} md={4}>
                <Grid container spacing={1}>
                    <Grid item xs={12}>
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
                            {Format.toString(resources.formatType, [section.eventType])}
                        </Text>
                        <Text size="small">
                            {Format.toString(resources.formatDuration, [section.startDate, section.endDate])}
                        </Text>
                    </Grid>
                    {showClassListLink && (
                        <Grid item xs={12}>
                            <Grid container spacing={1} justifyContent="flex-start">
                                <Grid item>
                                    <Button
                                        IconProps={{
                                            name: 'daily-work'
                                        }}
                                        align="left"
                                        id={`btnViewClassList_${section.id}`}
                                        textVariantStyling="inherit"
                                        variant="text"
                                        onClick={onClassListClick}
                                    >
                                        {resources.btnClassList}
                                    </Button>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                </Grid>
            </Grid>
            <Grid item xs={12} md={4}>
                {schedules}
            </Grid>
            <Grid item xs={12} md={4} className={classes.centered}>
                {instructors}
            </Grid>
        </Grid>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(FacultyScheduleItem);