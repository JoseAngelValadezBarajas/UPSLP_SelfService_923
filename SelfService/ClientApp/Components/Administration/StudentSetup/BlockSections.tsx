/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockSections.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import ScheduleCalendar, { IScheduleCalendarResProps } from '@hedtech/powercampus-design-system/react/components/Section/ScheduleCalendar';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import BlockSectionInstructors, { IBlockSectionInstructorsResProps } from './BlockSectionInstructors';
import BlockSectionSchedules, { IBlockSectionSchedulesResProps } from './BlockSectionSchedules';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
// #endregion Imports

// #region Types
export interface IBlockSectionsProps {
    addedSectionsIds?: number[];
    isLoadingSave?: boolean;
    isLoadingSearch?: boolean;
    resources: IBlockSectionsResProps;
    sections: ISection[];
    selectedSectionsIds?: number[];
    showCalendar?: boolean;
    onDelete?: () => void;
    onSelect?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IBlockSectionsResProps {
    blockSectionInstructors: IBlockSectionInstructorsResProps;
    blockSectionSchedules: IBlockSectionSchedulesResProps;
    btnCalendarView: string;
    btnDelete: string;
    btnListView: string;
    formatCourseDescription: string;
    formatSelectCourse: string;
    lblCourse: string;
    lblCourseType: string;
    lblName: string;
    lblTimeConflicts: string;
    lblType: string;
    scheduleCalendar: IScheduleCalendarResProps;
}

const styles = (theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '40%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            }
        }
    }
});

type PropsWithStyles = IBlockSectionsProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const BlockSections: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        addedSectionsIds,
        classes,
        isLoadingSave,
        isLoadingSearch,
        resources,
        sections,
        selectedSectionsIds,
        showCalendar,
        width,
        onDelete,
        onSelect
    } = props;

    const [calendarView, setCalendarView] = useState(false);
    const onShowCalendar = (): void => {
        setCalendarView(true);
    };
    const onShowList = (): void => {
        setCalendarView(false);
    };

    let iconsHeader: JSX.Element | undefined;
    if (showCalendar) {
        iconsHeader = (
            <ButtonGroup id="btgScheduleView" toggle>
                <Tooltip
                    id="tltList"
                    title={resources.btnListView}
                >
                    <IconButton
                        aria-label={resources.btnListView}
                        color="secondary"
                        id="btnList"
                        selected={!calendarView}
                        onClick={onShowList}
                    >
                        <Icon name="list-view" />
                    </IconButton>
                </Tooltip>
                <Tooltip
                    id="tltCalendar"
                    title={resources.btnCalendarView}
                >
                    <IconButton
                        aria-label={resources.btnCalendarView}
                        color="secondary"
                        id="btnCalendar"
                        selected={calendarView}
                        onClick={onShowCalendar}
                    >
                        <Icon name="calendar" />
                    </IconButton>
                </Tooltip>
            </ButtonGroup>
        );
    }

    const sectionsTable: JSX.Element = (
        <Grid container>
            <Grid item xs>
                <Table
                    breakpoint="sm"
                    classes={{ root: classes.table }}
                    id="tblSections"
                    variant="expansionPanels"
                >
                    <TableHead>
                        <TableRow>
                            <TableCell component="th">
                                {resources.lblCourse}
                            </TableCell>
                            {isWidthUp('md', width) && (
                                <TableCell component="th">
                                    {resources.lblName}
                                </TableCell>
                            )}
                            {isWidthUp('md', width) && (
                                <TableCell component="th">
                                    {resources.lblType}
                                </TableCell>
                            )}
                            {isWidthUp('md', width) && (
                                <TableCell />
                            )}
                            <TableCell />
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {sections.map((row, i) => {
                            const courseFullname: string = Format.toString(resources.formatCourseDescription,
                                [row.eventId, row.eventSubType, row.section, row.sessionDesc]);

                            return (
                                <TableExpandableRow
                                    key={`${i}_${row.id}`}
                                    expandedRowContent={isLoadingSearch ? undefined : (
                                        <Grid container>
                                            {isWidthDown('sm', width) && (
                                                <Grid item xs={12}>
                                                    <Text weight="strong" gutterBottom>
                                                        {resources.lblCourseType}
                                                    </Text>
                                                    <Text>
                                                        {row.eventType}
                                                    </Text>
                                                </Grid>
                                            )}
                                            <Grid item xs>
                                                <BlockSectionSchedules
                                                    resources={resources.blockSectionSchedules}
                                                    section={row}
                                                />
                                            </Grid>
                                            <Grid item xs>
                                                <BlockSectionInstructors
                                                    resources={resources.blockSectionInstructors}
                                                    section={row}
                                                />
                                            </Grid>
                                        </Grid>
                                    )}
                                >
                                    <TableCell
                                        component="th"
                                        loading={isLoadingSearch}
                                        scope="row"
                                    >
                                        <Grid container justifyContent="space-between" wrap="nowrap">
                                            <Grid item xs>
                                                {onSelect && addedSectionsIds && selectedSectionsIds ? (
                                                    <AvatarText
                                                        CheckboxProps={{
                                                            checked: Boolean(selectedSectionsIds.find(ss => ss === row.id)),
                                                            disabled: Boolean(addedSectionsIds.find(ss => ss === row.id)),
                                                            id: `chkSelect_${i}`,
                                                            inputProps: {
                                                                'aria-label': Format.toString(resources.formatSelectCourse, [courseFullname])
                                                            },
                                                            onChange: onSelect
                                                        }}
                                                        autoHideSecondaryTextUp
                                                        avatarInfo={{
                                                            fullName: courseFullname,
                                                            peopleId: row.eventName
                                                        }}
                                                        withAvatar={false}
                                                    />
                                                ) : (
                                                    <AvatarText
                                                        autoHideSecondaryTextUp
                                                        avatarInfo={{
                                                            fullName: courseFullname,
                                                            peopleId: row.eventName
                                                        }}
                                                        withAvatar={false}
                                                    />
                                                )}
                                            </Grid>
                                            {isWidthDown('sm', width) && (
                                                <>
                                                    {row.hasTimeConflict && (
                                                        <Grid item>
                                                            <Tooltip
                                                                id={`tltTimeConflicts_${i}`}
                                                                title={resources.lblTimeConflicts}
                                                            >
                                                                <Icon
                                                                    marginTop2
                                                                    name="warning"
                                                                    type="warning"
                                                                />
                                                            </Tooltip>
                                                        </Grid>
                                                    )}
                                                    {onDelete && (
                                                        <Grid item>
                                                            <Tooltip
                                                                id={`tltDelete_${i}`}
                                                                title={resources.btnDelete}
                                                            >
                                                                <IconButton
                                                                    color="gray"
                                                                    id={`btnDelete_${row.id}`}
                                                                    onClick={onDelete}
                                                                >
                                                                    <Icon name="trash" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </Grid>
                                                    )}
                                                </>
                                            )}
                                        </Grid>
                                    </TableCell>
                                    {isWidthUp('md', width) && (
                                        <TableCell
                                            loading={isLoadingSearch}
                                        >
                                            <span>
                                                {row.eventName}
                                            </span>
                                        </TableCell>
                                    )}
                                    {isWidthUp('md', width) && (
                                        <TableCell
                                            loading={isLoadingSearch}
                                        >
                                            <span>
                                                {row.eventType}
                                            </span>
                                        </TableCell>
                                    )}
                                    {isWidthUp('md', width) && (
                                        <TableCell
                                            align="right"
                                            loading={isLoadingSearch}
                                        >
                                            <Grid container alignItems="center" justifyContent="flex-end" wrap="nowrap">
                                                {row.hasTimeConflict && (
                                                    <Grid item>
                                                        <Tooltip
                                                            id="tltTimeConflicts"
                                                            title={resources.lblTimeConflicts}
                                                        >
                                                            <Icon
                                                                marginTop
                                                                name="warning"
                                                                type="warning"
                                                            />
                                                        </Tooltip>
                                                    </Grid>
                                                )}
                                                {onDelete && (
                                                    <Grid item>
                                                        <Tooltip
                                                            id={`tltDelete_${i}`}
                                                            title={resources.btnDelete}
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnDelete}
                                                                color="secondary"
                                                                disabled={isLoadingSave}
                                                                id={`btnDelete_${row.id}`}
                                                                onClick={onDelete}
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Grid>
                                                )}
                                            </Grid>
                                        </TableCell>
                                    )}
                                </TableExpandableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </Grid>
        </Grid>
    );

    return (
        <Grid container>
            <Grid item xs={12}>
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        {iconsHeader}
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={12}>
                {calendarView ? (
                    <ScheduleCalendar
                        resources={resources.scheduleCalendar}
                        sections={sections}
                        withLegend
                    />
                ) : (
                        <>
                            {sectionsTable}
                        </>
                    )}
            </Grid>
        </Grid>
    );
};
BlockSections.defaultProps = {
    isLoadingSave: false,
    isLoadingSearch: false
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(BlockSections));