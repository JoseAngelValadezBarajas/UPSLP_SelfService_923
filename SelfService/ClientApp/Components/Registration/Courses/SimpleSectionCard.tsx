/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SimpleSectionCard.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar, { AvatarGroup } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface ISimpleSectionCardProps {
    allowChanges?: boolean;
    canAddToCart: boolean;
    canAddToWaitlist: boolean;
    resources: ISimpleSectionCardResProps;
    ruleGroupBlockId: number;
    section: ISection;
}

export interface ISimpleSectionCardPropsToExtend {
    onSelectSection: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onViewSectionDetailsByBlock: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ISimpleSectionCardResProps {
    formatBuilding: string;
    formatCreditsSeats: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSectionInfo: string;
    formatStartEndTime: string;
    lblAddToWaitlist: string;
    lblMultipleInstructors: string;
    lblMultipleMeetingLocations: string;
    lblMultipleMeetingTimes: string;
    lblNoInstructor: string;
    lblNoScheduleLocation: string;
    lblNoScheduleTime: string;
}

const styles = createStyles({
    avatarGridContainer: {
        marginBottom: Tokens.spacing30
    },
    cardContainer: {
        height: '100%'
    },
    instructorName: {
        wordBreak: 'normal'
    },
    groupAvatarGridContainer: {
        marginBottom: Tokens.spacing30
    },
    sectionCard: {
        marginRight: Tokens.spacing50,
        minWidth: '275px',
        width: '275px'
    }
});

type PropsWithStyles = ISimpleSectionCardProps & ISimpleSectionCardPropsToExtend & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const SimpleSectionCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        allowChanges,
        canAddToCart,
        canAddToWaitlist,
        classes,
        resources,
        ruleGroupBlockId,
        section,
        onSelectSection,
        onViewSectionDetailsByBlock
    } = props;

    // #region Schedule(s)
    let scheduleTime: JSX.Element | undefined;
    let scheduleLocation: JSX.Element | undefined;
    if (section.schedules) {
        if (section.schedules.length === 1) {
            scheduleTime = (
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
                </>
            );
            scheduleLocation = (
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
            );
        }
        else {
            scheduleTime = (
                <Text>
                    {resources.lblMultipleMeetingTimes}
                </Text>
            );
            scheduleLocation = (
                <Text>
                    {resources.lblMultipleMeetingLocations}
                </Text>
            );
        }
    }
    else {
        scheduleTime = (
            <Text>
                {resources.lblNoScheduleTime}
            </Text>
        );
        scheduleLocation = (
            <Text>
                {resources.lblNoScheduleLocation}
            </Text>
        );
    }
    // #endregion Schedule

    // #region Instructor(s)
    let instructors: JSX.Element | undefined;
    if (section.instructors) {
        if (section.instructors.length === 1) {
            instructors = (
                <Grid container className={classes.avatarGridContainer} alignItems="center" wrap="nowrap" spacing={2}>
                    <Grid item>
                        <Tooltip
                            id={`tltInstructor_${section.id}`}
                            title={section.instructors[0].fullName}
                            aria-label={section.instructors[0].fullName}
                        >
                            <Avatar
                                backgroundNumber={section.instructors[0].colorFirstLetter}
                                id={`avtInstructor_${section.id}`}
                                noMargin
                                size="large"
                            >
                                {section.instructors[0].firstLetter || ''}
                            </Avatar>
                        </Tooltip>
                    </Grid>
                    <Grid item>
                        <Text
                            align="center"
                            className={classes.instructorName}
                            size="small"
                        >
                            {section.instructors[0].fullName}
                        </Text>
                    </Grid>
                </Grid>
            );
        }
        else {
            instructors = (
                <Grid container className={classes.groupAvatarGridContainer} alignItems="center" wrap="nowrap" spacing={1}>
                    <Grid item>
                        <AvatarGroup
                            marginTopBottom={false}
                            marginTopBottom2
                            max={1}
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
                    </Grid>
                    <Grid item>
                        <Text
                            align="center"
                            className={classes.instructorName}
                            size="small"
                        >
                            {resources.lblMultipleInstructors}
                        </Text>
                    </Grid>
                </Grid>
            );
        }
    }
    else {
        instructors = (
            <Grid container className={classes.avatarGridContainer} alignItems="center" wrap="nowrap" spacing={2}>
                <Grid item>
                    <Avatar
                        background="default"
                        id={`avtInstructor_${section.id}`}
                        noMargin
                        size="large"
                        variant="default"
                    />
                </Grid>
                <Grid item>
                    <Text
                        align="center"
                        className={classes.instructorName}
                        size="small"
                    >
                        {resources.lblNoInstructor}
                    </Text>
                </Grid>
            </Grid>
        );
    }
    // #endregion Instructor(s)

    const checkDisabled: boolean = !(canAddToCart || canAddToWaitlist);

    return (
        <Card className={classes.sectionCard}>
            <CardContent className={classes.cardContainer}>
                <Grid
                    container
                    className={classes.cardContainer}
                    direction="column"
                    justifyContent="space-between"
                    wrap="nowrap"
                >
                    <Grid item>
                        <Grid container wrap="nowrap">
                            {allowChanges && (
                                <Grid item>
                                    <Checkbox
                                        checked={checkDisabled ? false : Boolean(section.isSelected)}
                                        disabled={checkDisabled}
                                        id={`chkBlockSection_${ruleGroupBlockId}_${section.id}`}
                                        inputProps={{
                                            'aria-labelledby': `sectionTitle_${section.id}`,
                                            'data-blockid': ruleGroupBlockId,
                                            'data-id': section.id
                                        }}
                                        noMargin
                                        onChange={onSelectSection}
                                    />
                                </Grid>
                            )}
                            <Grid item xs>
                                <Button
                                    TextProps={{
                                        size: 'h4',
                                        weight: 'strong'
                                    }}
                                    align="left"
                                    data-id={section.id}
                                    id={`sectionTitle_${section.id}`}
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onViewSectionDetailsByBlock}
                                >
                                    {section.eventName}
                                </Button>
                                <Text
                                    color="textSecondary"
                                    size="small"
                                >
                                    {Format.toString(resources.formatSectionInfo,
                                        [section.eventId, section.eventSubType, section.section])}
                                </Text>
                                <Text
                                    color="textSecondary"
                                    size="small"
                                >
                                    {section.sessionDesc}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                {instructors}
                                <Grid container wrap="nowrap">
                                    <Grid item>
                                        <Icon large name="clock" />
                                    </Grid>
                                    <Grid item>
                                        {scheduleTime}
                                    </Grid>
                                </Grid>
                                <Grid container wrap="nowrap">
                                    <Grid item>
                                        <Icon large name="location" />
                                    </Grid>
                                    <Grid item>
                                        {scheduleLocation}
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item>
                        <Text
                            align="right"
                            color="textSecondary"
                            size="small"
                        >
                            {Format.toString(resources.formatCreditsSeats, [section.credits, section.seatsLeft])}
                        </Text>
                        {canAddToWaitlist && (
                            <Text
                                align="right"
                                color="textSecondary"
                                size="small"
                            >
                                {resources.lblAddToWaitlist}
                            </Text>
                        )}
                    </Grid>
                </Grid>
            </CardContent>
        </Card>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(SimpleSectionCard);