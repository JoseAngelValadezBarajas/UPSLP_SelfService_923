/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockSectionSchedules.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
// #endregion Imports

// #region Types
export interface IBlockSectionSchedulesProps {
    resources: IBlockSectionSchedulesResProps;
    section: ISection;
}

export interface IBlockSectionSchedulesResProps {
    formatBuilding: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatStartEndTime: string;
    lblNoSchedule: string;
    lblSchedules: string;
    lblTimeConflicts: string;
}

const styles = createStyles({
    noSchedule: {
        marginTop: Tokens.spacing30
    }
});

type PropsWithStyles = IBlockSectionSchedulesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const BlockSectionSchedules: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        resources,
        section
    } = props;

    // #region Schedule(s)
    let schedules: JSX.Element | JSX.Element[] | undefined;
    if (section.schedules && section.schedules.length > 0) {
        schedules = section.schedules.map((schedule, i) => (
            <Grid item xs={12} key={`schedule_${section.id}_${i}`}>
                {schedule.hasTimeConflict && (
                    <StatusLabel
                        id={`slblConflict_${section.id}_${i}`}
                        text={resources.lblTimeConflicts}
                        type="draft"
                    />
                )}
                <Text>
                    {Format.toString(resources.formatStartEndTime, [
                        schedule.startTime,
                        schedule.endTime
                    ])}
                </Text>
                <Text>
                    {schedule.dayDesc}
                </Text>
                <Text size="small">
                    {Format.toString(resources.formatOrganization, [schedule.orgName])}
                    {schedule.bldgName ?
                        Format.toString(resources.formatBuilding, [schedule.bldgName])
                        : ''}
                    {schedule.floorId ?
                        Format.toString(resources.formatFloor, [schedule.floorId])
                        : ''}
                    {schedule.roomId ?
                        Format.toString(resources.formatRoom, [schedule.roomId])
                        : ''}
                </Text>
            </Grid>
        ));
    }
    else {
        schedules = (
            <Grid item xs={12}>
                <Text className={classes.noSchedule}>
                    {resources.lblNoSchedule}
                </Text>
            </Grid>
        );
    }
    // #endregion Schedule(s)

    return (
        <>
            <Grid container>
                <Grid item>
                    <Text weight="strong">
                        {resources.lblSchedules}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                {schedules}
            </Grid>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(BlockSectionSchedules);