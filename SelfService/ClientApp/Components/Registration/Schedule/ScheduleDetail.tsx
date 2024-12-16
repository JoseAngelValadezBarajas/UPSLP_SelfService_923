/* Copyright 2018 - 2024 Ellucian Company L.P. and its affiliates.
 * File: ScheduleDetail.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import ScheduleCalendar, { IScheduleCalendarResProps } from '@hedtech/powercampus-design-system/react/components/Section/ScheduleCalendar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
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
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal Components
import Print from '../../Generic/Print';
import ScheduleItem, { IScheduleItemPropsToExtend, IScheduleItemResProps } from './ScheduleItem';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
import { IAcademicInformation } from '../../../Types/Students/IAcademicInformation';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { ISectionsSession } from '../../../Types/Students/ISectionsSession';
import { StudentReport } from '../../../Types/Enum/StudentReport';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IScheduleDetailProps {
    academicInformation: IAcademicInformation[];
    conEd: boolean;
    impersonateInfo?: IImpersonateInfo;
    inCart: boolean;
    inWaitlist: boolean;
    isLoadingConEd: boolean;
    isLoadingPeriods: boolean;
    isLoadingTrad: boolean;
    isStudentView?: boolean;
    myConEdSchedule?: IStudentSchedule[][];
    mySchedule?: ISectionsSession[];
    periods?: IDropDownOption[];
    periodValue?: string | number;
    printResources: IPrintResources;
    registeredCredits?: string;
    resources: IScheduleDetailResProps;
    showDenied: boolean;
    studyingCalendarColor: string;
    ScheduleItemProps: IScheduleItemPropsToExtend;
    onButtonViewCart?: () => void;
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDropdownChange: (optionSelected: IDropDownOption, id: string) => void;
    onViewSectionDetailsByCalendar: (id: number) => void;
}

export interface IScheduleDetailResProps {
    btnCalendarView: string;
    btnListView: string;
    btnViewCart: string;
    formatBreadcrumbs: string;
    formatBreadcrumbsNoName: string;
    formatRegisteredCourses: string;
    formatRegisteredCredits: string;
    formatSession: string;
    lblAdvisors: string;
    lblContinuingEducation: string;
    lblCoursesCart: string;
    lblDeniedCourses: string;
    lblEmailSchedule: string;
    lblNoConEdCoursesRegistered: string;
    lblNoTradCoursesRegistered: string;
    lblPeriod: string;
    lblScheduleTitle: string;
    lblTraditionalCourses: string;
    lblWaitlistCourses: string;
    scheduleCalendar: IScheduleCalendarResProps;
    scheduleItem: IScheduleItemResProps;
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
    marginIcons: {
        marginBottom: Tokens.spacing30,
        marginRight: Tokens.spacing30
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

type PropsWithStyles = IScheduleDetailProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
const ScheduleDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        academicInformation,
        classes,
        conEd,
        impersonateInfo,
        inCart,
        inWaitlist,
        isLoadingConEd,
        isLoadingPeriods,
        isLoadingTrad,
        isStudentView,
        myConEdSchedule,
        mySchedule,
        periods,
        periodValue,
        printResources,
        registeredCredits,
        resources,
        showDenied,
        studyingCalendarColor,
        ScheduleItemProps,
        width,
        onButtonViewCart,
        onCheckboxChange,
        onDropdownChange,
        onViewSectionDetailsByCalendar
    } = props;

    const [calendarView, setCalendarView] = useState(true);
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

    let countRegistered: number = 0;

    const yearTermSession: string[] = periodValue ? String(periodValue).split('/') : [];

    const myConEdScheduleElements: JSX.Element[] = [];
    const myScheduleElements: JSX.Element[] = [];
    const sectionsForCalendar: IStudentSchedule[] = [];
    let noSectionsElement: JSX.Element | undefined;
    let noConEdSectionsElement: JSX.Element | undefined;
    let filter: number = 0;

    const setFilter = (): number => {
        if (!inCart && !inWaitlist && !showDenied) {
            filter = StudentReport.None;
        }
        else if (inCart && !inWaitlist && !showDenied) {
            filter = StudentReport.InCart;
        }
        else if (!inCart && inWaitlist && !showDenied) {
            filter = StudentReport.InWaitList;
        }
        else if (!inCart && !inWaitlist && showDenied) {
            filter = StudentReport.Denied;
        }
        else if (inCart && inWaitlist && !showDenied) {
            filter = StudentReport.InCartAndInWaitlist;
        }
        else if (inCart && !inWaitlist && showDenied) {
            filter = StudentReport.InCartAndDenied;
        }
        else if (!inCart && inWaitlist && showDenied) {
            filter = StudentReport.InWaitlistAndDenied;
        }
        else if (inCart && inWaitlist && showDenied) {
            filter = StudentReport.All;
        }
        return filter;
    };
    let sectionListFiltered: IStudentSchedule[];

    if (isLoadingTrad) {
        noSectionsElement = (
            <Card key="noSections" classes={{ root: classes.separatorCard }}>
                <CardContent>
                    <ContainerLoader id="ldrTradCourses" height="sm" />
                </CardContent>
            </Card>
        );
    }
    else {
        if (mySchedule) {
            // Calendar view
            if (calendarView) {
                mySchedule.forEach(session => {
                    if (session.sections) {
                        // Set the counters
                        countRegistered = countRegistered + session.sections[3].length;

                        session.sections.forEach(sectionList => {
                            sectionList.filter(s => !s.isHidden).forEach(section => {
                                sectionsForCalendar.push(section);
                            });
                        });
                    }
                });
                myScheduleElements.push(
                    <React.Fragment
                        key="calendarSchedule"
                    >
                        <ScheduleCalendar
                            resources={resources.scheduleCalendar}
                            sections={sectionsForCalendar}
                            withLegend
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
                        // Set the counters
                        countRegistered = countRegistered + session.sections[3].length;
                        session.sections.forEach((sectionList, i) => {
                            sectionListFiltered = sectionList.filter(s => !s.isHidden);
                            sectionListFiltered.forEach((section, j) => {
                                subSectionElements.push(
                                    <ScheduleItem
                                        id={`section_${i}_${j}`}
                                        key={`section_${i}_${j}`}
                                        resources={resources.scheduleItem}
                                        section={section}
                                        {...ScheduleItemProps}
                                    />
                                );
                                subSectionElements.push(<Divider
                                    classes={{ root: classes.divider }}
                                    key={`subSectionElement_section_${i}_${j}`}
                                />);
                            });
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
    }

    if (isLoadingConEd) {
        noSectionsElement = (
            <Card key="noConEdSections" classes={{ root: classes.separatorCard }}>
                <CardContent>
                    <ContainerLoader id="ldrConEdCourses" height="sm" />
                </CardContent>
            </Card>
        );
    }
    else {
        if (myConEdSchedule) {
            myConEdSchedule.forEach((sectionList, isl) => {
                sectionListFiltered = sectionList.filter(s => !s.isHidden);
                sectionListFiltered.forEach((section, is) => {
                    myConEdScheduleElements.push(
                        <ScheduleItem
                            id={`section_${isl}_${is}`}
                            key={`section_${isl}_${is}`}
                            resources={resources.scheduleItem}
                            section={section}
                            {...ScheduleItemProps}
                        />
                    );
                    myConEdScheduleElements.push(<Divider
                        classes={{ root: classes.divider }}
                        key={`subSectionElement_section_${isl}_${is}`}
                    />);
                });
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
    }
    // #region Academic Information
    let academicInfoElement: JSX.Element[] | undefined = [];
    if (academicInformation) {
        academicInfoElement = academicInformation.map((element, i) => (
            <Grid item xs={12} md={6} key={`academicElement_${i}`}>
                <UpDownLabel
                    align="left"
                    sizeTextDown="h4"
                    sizeTextUp="h3"
                    textDown={element.programDegree}
                    textUp={element.curriculum}
                />
                {element.advisors ? (
                    <>
                        <Text display="inline">
                            {`${resources.lblAdvisors} `}
                        </Text>
                        <Text
                            color="inherit"
                            display="inline"
                        >
                            {element.advisors}
                        </Text>
                    </>
                ) : undefined}
            </Grid>
        ));
    }
    // #endregion Academic Information

    const showPrintButton: boolean = yearTermSession && yearTermSession.length > 0
        && (calendarView && sectionsForCalendar.length > 0 || !calendarView && myScheduleElements.length > 0);

    const printMandatoryParameters: string = `/${setFilter()}/${yearTermSession[0]}/${yearTermSession[1]}/${yearTermSession.length >= 3 ? yearTermSession[2] : '-'}`;
    const printOptionalParameters: string = impersonateInfo ? `/${impersonateInfo.process}/${impersonateInfo.personId}/${impersonateInfo.viewId}/${impersonateInfo.tabId}` : '';

    return (
        <Grid container>
            <Grid item xs={12}>
                <Card classes={{ root: classes.separatorCard }} style={{ borderTopColor: studyingCalendarColor }} accent="primary" >
                    <CardContent>
                        <Grid container>
                            <Hidden smUp>
                                <Grid item xs={12}>
                                    <Grid container justifyContent={isWidthUp('sm', width) || !showPrintButton ? 'flex-end' : 'space-between'}>
                                        <Hidden smUp>
                                            {yearTermSession
                                                && yearTermSession.length > 0
                                                && (calendarView && sectionsForCalendar.length > 0
                                                    || !calendarView && myScheduleElements.length > 0) && (
                                                    <Grid item>
                                                        <Print
                                                            classNameIconButton={classes.marginIcons}
                                                            resources={printResources}
                                                            link={`${Constants.webUrl}/Schedule/StudentReport${printMandatoryParameters}${printOptionalParameters}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                                                        />
                                                    </Grid>
                                                )}
                                        </Hidden>
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
                            <Grid item xs={12}>
                                <Grid container>
                                    <Grid item xs>
                                        <Grid container alignItems="center">
                                            <Grid item xs={12} md={4}>
                                                <Dropdown
                                                    emptyOption={emptyOption}
                                                    id="ddlPeriod"
                                                    label={resources.lblPeriod}
                                                    loading={isLoadingPeriods}
                                                    options={periods}
                                                    value={periodValue}
                                                    onChange={onDropdownChange}
                                                />
                                            </Grid>
                                            <Grid item xs={12} md={8}>
                                                <Grid container alignItems="center" spacing={2}>
                                                    <Grid item>
                                                        <Checkbox
                                                            id="chkCoursesCart"
                                                            checked={inCart}
                                                            label={resources.lblCoursesCart}
                                                            onChange={onCheckboxChange}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Checkbox
                                                            id="chkWaitListCourses"
                                                            checked={inWaitlist}
                                                            label={resources.lblWaitlistCourses}
                                                            onChange={onCheckboxChange}
                                                        />
                                                    </Grid>
                                                    <Grid item>
                                                        <Checkbox
                                                            id="chkShowDeniedCourses"
                                                            checked={showDenied}
                                                            label={resources.lblDeniedCourses}
                                                            onChange={onCheckboxChange}
                                                        />
                                                    </Grid>
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
                            <Grid item xs={12}>
                                <Grid container>
                                    {(isWidthUp('sm', width) || (academicInformation && academicInformation.length > 0)) && (
                                        <Grid item xs={isWidthUp('sm', width) ? true : 12}>
                                            <Grid container spacing={1}>
                                                {academicInfoElement}
                                            </Grid>
                                        </Grid>
                                    )}
                                    <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                        <Grid container spacing={2}>
                                            <Hidden xsDown>
                                                {yearTermSession
                                                    && yearTermSession.length > 0
                                                    && (calendarView && sectionsForCalendar.length > 0
                                                        || !calendarView && myScheduleElements.length > 0) && (
                                                        <Grid item xs={12} className={classes.alignRight}>
                                                            <Print
                                                                classNameIconButton={classes.marginIcons}
                                                                resources={printResources}
                                                                link={`${Constants.webUrl}/Schedule/StudentReport${printMandatoryParameters}${printOptionalParameters}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`}
                                                            />
                                                        </Grid>
                                                    )}
                                            </Hidden>
                                            {isStudentView && (
                                                <Grid item xs={12} className={classes.alignRight}>
                                                    <Button
                                                        id="btnViewCart"
                                                        color="secondary"
                                                        onClick={onButtonViewCart}
                                                    >
                                                        {resources.btnViewCart}
                                                    </Button>
                                                </Grid>
                                            )}
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
                {myScheduleElements}
                {noSectionsElement}
                {!calendarView && conEd && myConEdScheduleElements.length > 0 && (
                    <Card classes={{ root: classes.separatorCard }}>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text size="h3">
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
                {!calendarView && conEd && (
                    <>
                        {noConEdSectionsElement}
                    </>
                )}
                {Boolean(countRegistered) && countRegistered > 0 && (
                    <Card>
                        <CardContent>
                            <Grid
                                container
                                className={classes.marginList}
                                spacing={1}
                            >
                                <Grid item xs={12}>
                                    <Text size="h2">
                                        {resources.lblTraditionalCourses}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    <Text>
                                        {Format.toString(resources.formatRegisteredCourses, [countRegistered])}
                                    </Text>
                                    {registeredCredits && (
                                        <Text>
                                            {Format.toString(resources.formatRegisteredCredits, [registeredCredits])}
                                        </Text>
                                    )}
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}
            </Grid>
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(ScheduleDetail));