/* Copyright 2021 - 2024 Ellucian Company L.P. and its affiliates.
 * File: FacultyScheduleDetail.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import ScheduleCalendar, { IScheduleCalendarResProps } from '@hedtech/powercampus-design-system/react/components/Section/ScheduleCalendar';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal Components
import Print from '../../Generic/Print';
import FacultyScheduleItem, { IFacultyScheduleItemPropsToExtend, IFacultyScheduleItemResProps } from './FacultyScheduleItem';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IFacultySchedule } from '@hedtech/powercampus-design-system/types/Faculty/IFacultySchedule';
import { IFacultyScheduleBySession } from '../../../Types/Schedule/IFacultyScheduleBySession';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { IYearTermSession } from '../../../Types/Generic/IYearTerm';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IFacultyScheduleDetailProps {
    conEd: boolean;
    isLoadingConEd: boolean;
    isLoadingTrad: boolean;
    myConEdSchedule?: IFacultySchedule[];
    mySchedule?: IFacultyScheduleBySession[];
    onlyConEd: boolean;
    periods?: IDropDownOption[];
    periodValue?: string | number;
    printResources: IPrintResources;
    resources: IFacultyScheduleDetailResProps;
    ScheduleItemProps: IFacultyScheduleItemPropsToExtend;
    showClassListLink: boolean;
    teachingCalendarColor: string;
    onButtonViewCart?: () => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClassList: (period: IYearTermSession, id: number) => void;
    onDropdownChange: (optionSelected: IDropDownOption, id: string) => void;
    onViewSectionDetailsByCalendar: (id: number) => void;
}

export interface IFacultyScheduleDetailResProps {
    btnCalendarView: string;
    btnListView: string;
    facultyScheduleItem: IFacultyScheduleItemResProps;
    formatRegisteredCourses: string;
    formatRegisteredCredits: string;
    formatSession: string;
    lblContinuingEducation: string;
    lblNoConEdCoursesRegistered: string;
    lblNoTradCoursesRegistered: string;
    lblPeriod: string;
    lblTraditionalCourses: string;
    scheduleCalendar: IScheduleCalendarResProps;
}

const styles = (() => createStyles({
    alignRight: {
        display: 'flex',
        justifyContent: 'flex-end'
    },
    divider: {
        marginBottom: Tokens.spacing40,
        marginTop: Tokens.spacing40
    },
    marginList: {
        marginTop: '0'
    },
    separatorCard: {
        marginBottom: Tokens.spacing40
    },
    sessionTitle: {
        marginBottom: Tokens.spacing40
    }
}));

type PropsWithStyles = IFacultyScheduleDetailProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const FacultyScheduleDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        conEd,
        isLoadingConEd,
        isLoadingTrad,
        myConEdSchedule,
        mySchedule,
        onlyConEd,
        periods,
        periodValue,
        printResources,
        resources,
        ScheduleItemProps,
        showClassListLink,
        teachingCalendarColor,
        width,
        onCheckboxChange,
        onClassList,
        onDropdownChange,
        onViewSectionDetailsByCalendar
    } = props;

    const [calendarView, setCalendarView] = useState(!onlyConEd);
    const onShowCalendar = (): void => {
        setCalendarView(true);
    };
    const onShowList = (): void => {
        setCalendarView(false);
    };

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
    const emptyOption: IDropDownOption = {
        description: layoutResources ? layoutResources.lblDropDownEmptyText : '',
        value: ''
    };

    const yearTermSession: string[] = periodValue ? String(periodValue).split('/') : [];

    const myConEdScheduleElements: JSX.Element[] = [];
    const myScheduleElements: JSX.Element[] = [];
    const sectionsForCalendar: IFacultySchedule[] = [];
    let noSectionsElement: JSX.Element | undefined;
    let noConEdSectionsElement: JSX.Element | undefined;

    if (isLoadingTrad) {
        myScheduleElements.push(
            <Card key="ldrFacultyScheduleDetailCard" classes={{ root: classes.separatorCard }}>
                <CardContent>
                    <ContainerLoader id="ldrFacultyScheduleDetail" height={calendarView ? 'md' : 'sm'} />
                </CardContent>
            </Card>
        );
    }
    else if (mySchedule) {
        // Calendar view
        if (calendarView) {
            mySchedule.forEach(session => {
                if (session.sections) {
                    session.sections.forEach(section => {
                        sectionsForCalendar.push(section);
                    });
                }
            });
            myScheduleElements.push(
                <React.Fragment
                    key="calendarSchedule"
                >
                    <ScheduleCalendar
                        calendarColor={teachingCalendarColor}
                        resources={resources.scheduleCalendar}
                        sections={sectionsForCalendar}
                        onViewSectionDetailsById={onViewSectionDetailsByCalendar}
                    />
                    <div className={classes.separatorCard} />
                </React.Fragment>
            );
        }
        // List view
        else {
            let subSectionElements: JSX.Element[] = [];
            mySchedule.forEach((session, is) => {
                if (session.sections) {
                    session.sections.forEach((section, i) => {
                        subSectionElements.push(
                            <FacultyScheduleItem
                                id={`section_${i}`}
                                key={`section_${i}`}
                                resources={resources.facultyScheduleItem}
                                section={section}
                                showClassListLink={showClassListLink}
                                onClassList={onClassList}
                                {...ScheduleItemProps}
                            />
                        );
                        subSectionElements.push(<Divider
                            classes={{ root: classes.divider }}
                            key={`subSectionElement_section_${i}`}
                        />);
                    });

                    if (subSectionElements.length > 0) {
                        subSectionElements.pop();
                        myScheduleElements.push(
                            <Card key={`session_${is}`} classes={{ root: classes.separatorCard }}>
                                <CardContent>
                                    <Text
                                        id={`lblSessionTitle_${is}`}
                                        className={classes.sessionTitle}
                                        size="h2"
                                        weight="strong"
                                    >
                                        {Format.toString(resources.formatSession, [session.sessionDesc])}
                                    </Text>
                                    {subSectionElements}
                                </CardContent>
                            </Card>
                        );
                        subSectionElements = [];
                    }
                    else {
                        noSectionsElement = (
                            <Card key="noSections" classes={{ root: classes.separatorCard }}>
                                <CardContent>
                                    <Illustration
                                        color="secondary"
                                        name="calendar"
                                        height="xs"
                                        text={resources.lblNoTradCoursesRegistered}
                                    />
                                </CardContent>
                            </Card>
                        );
                    }
                }
            });
        }
    }

    if (myScheduleElements.length === 0) {
        noSectionsElement = (
            <Card key="noSections" classes={{ root: classes.separatorCard }}>
                <CardContent>
                    <Illustration
                        color="secondary"
                        name="calendar"
                        height="xs"
                        text={resources.lblNoTradCoursesRegistered}
                    />
                </CardContent>
            </Card>
        );
    }

    if (myConEdSchedule) {
        myConEdSchedule.forEach((section, is) => {
            myConEdScheduleElements.push(
                <FacultyScheduleItem
                    id={`section_${is}`}
                    key={`section_${is}`}
                    resources={resources.facultyScheduleItem}
                    section={section}
                    showClassListLink={showClassListLink}
                    onClassList={onClassList}
                    {...ScheduleItemProps}
                />
            );
            myConEdScheduleElements.push(<Divider
                classes={{ root: classes.divider }}
                key={`subSectionElement_section_${is}`}
            />);
        });

        if (myConEdScheduleElements.length > 0) {
            myConEdScheduleElements.pop();
        }
    }

    if (myConEdScheduleElements.length === 0) {
        noConEdSectionsElement = (
            <Card key="noConEdSections" classes={{ root: classes.separatorCard }}>
                <CardContent>
                    <Illustration
                        color="secondary"
                        name="calendar"
                        height="xs"
                        text={resources.lblNoConEdCoursesRegistered}
                    />
                </CardContent>
            </Card>
        );
    }

    const enablePrintButton: boolean = !isLoadingTrad && !isLoadingConEd
        && ((!!myConEdSchedule && myConEdSchedule.length > 0) || (!!mySchedule && mySchedule.length > 0));

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card classes={{ root: classes.separatorCard }} style={{ borderTopColor: teachingCalendarColor }} accent="primary" >
                    <CardContent>
                        <Grid container spacing={1}>
                            <Hidden smUp>
                                <Grid item xs={12}>
                                    <Grid container justifyContent={isWidthUp('sm', width) ? 'flex-end' : 'space-between'}>
                                        <Hidden smUp>
                                            <Grid item>
                                                <Print
                                                    disabled={!enablePrintButton}
                                                    resources={printResources}
                                                    link={`${Constants.webUrl}/Schedule/FacultyReport/${conEd ? 1 : 0}/${yearTermSession[0] ?? 0}/${yearTermSession[1] ?? 0}${yearTermSession.length >= 3 ? '/' + yearTermSession[2] : ''}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                                                />
                                            </Grid>
                                        </Hidden>
                                        {!onlyConEd && (
                                            <Grid item>
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
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                            </Hidden>
                            {!onlyConEd && (
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs>
                                            <Grid container alignItems="center">
                                                <Grid item xs={12} md={4}>
                                                    <Dropdown
                                                        emptyOption={emptyOption}
                                                        id="ddlPeriod"
                                                        label={resources.lblPeriod}
                                                        options={periods}
                                                        value={periodValue}
                                                        onChange={onDropdownChange}
                                                    />
                                                </Grid>
                                                <Grid item xs={12} md={8}>
                                                    <Grid container alignItems="center" spacing={2}>
                                                        <Grid item>
                                                            {!calendarView && (
                                                                <Checkbox
                                                                    id="chkConEd"
                                                                    checked={conEd}
                                                                    label={resources.lblContinuingEducation}
                                                                    onChange={onCheckboxChange}
                                                                />
                                                            )}
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Hidden xsDown>
                                            <Grid item>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item>
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
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Hidden>
                                    </Grid>
                                </Grid>
                            )}
                            <Hidden xsDown>
                                <Grid item xs={12} className={classes.alignRight}>
                                    <Print
                                        disabled={!enablePrintButton}
                                        resources={printResources}
                                        link={`${Constants.webUrl}/Schedule/FacultyReport/${conEd ? 1 : 0}/${yearTermSession[0] ?? 0}/${yearTermSession[1] ?? 0}${yearTermSession.length >= 3 ? '/' + yearTermSession[2] : ''}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                                    />
                                </Grid>
                            </Hidden>
                        </Grid>
                    </CardContent>
                </Card>
                {myScheduleElements}
                {noSectionsElement}
                {isLoadingConEd && conEd && (
                    <Card>
                        <CardContent>
                            <ContainerLoader id="ldrFacultyScheduleDetail" height={calendarView ? 'md' : 'sm'} />
                        </CardContent>
                    </Card>
                )}
                {!isLoadingConEd && !calendarView && conEd && myConEdScheduleElements.length > 0 && (
                    <Card classes={{ root: classes.separatorCard }}>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text size="h2" weight="strong">
                                        {resources.lblContinuingEducation}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    {myConEdScheduleElements}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
                {!isLoadingConEd && !calendarView && conEd && (
                    <>
                        {noConEdSectionsElement}
                    </>
                )}
            </Grid>
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(FacultyScheduleDetail));