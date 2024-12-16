/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ScheduleList.tsx
 * Type: Presentation component */

// #region Imports
import classnames from 'classnames';
import React, { useState } from 'react';
import Media from 'react-media';

// Core components
import ScheduleCalendar, { IScheduleCalendarResProps } from '@hedtech/powercampus-design-system/react/components/Section/ScheduleCalendar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardActions, CardContent, CardHeader } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Collapse from '@hedtech/powercampus-design-system/react/core/Collapse';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Drawer from '@hedtech/powercampus-design-system/react/core/Drawer';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { BoxesAlt } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
import { ScheduleListType } from '@hedtech/powercampus-design-system/types/Section/ScheduleListType';
import { IBlockStudentSchedule } from '../../../Types/Students/IStudentSchedule';

// Internal Components
import ScheduleListItem, { IScheduleListItemPropsToExtend, IScheduleListItemResProps } from './ScheduleListItem';
// #endregion Imports

// #region Internal types
export interface IScheduleListProps {
    canChangeCreditType?: (studentSchedule: IStudentSchedule) => boolean;
    canDropBlock?: (index: number) => boolean;
    canDropSection?: (section: ISection, includingBlocks?: boolean) => boolean;
    canRemoveBlock?: (index: number) => boolean;
    canRemoveFromCart?: (section: ISection, includingBlocks?: boolean) => boolean;
    canRemoveFromWaitlist?: (section: ISection, includingBlocks?: boolean) => boolean;
    countActions: number;
    enableRegister: boolean;
    errorLoading: boolean;
    getSectionStatus: (section: IStudentSchedule) => ISectionStatus;
    isLoading: boolean;
    myBlockSchedule?: IBlockStudentSchedule[];
    mySchedule?: IStudentSchedule[][];
    resources: IScheduleListResProps;
    ScheduleListItemProps: IScheduleListItemPropsToExtend;
    showCalendar: boolean;
    showDeniedCourses: boolean;
    onChangeShowDeniedCourses: () => void;
    onDropBlock?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onExpandBlockCartDetails?: () => void;
    onRefresh: () => void;
    onRegister: () => void;
    onRemoveBlock?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewBlockDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewSectionDetailsByCalendar?: (id: number) => void;
}

export interface IScheduleListResProps {
    btnCalendarView: string;
    btnDropBlock: string;
    btnListView: string;
    btnRegister: string;
    btnRemoveBlock: string;
    btnSwipeDown: string;
    btnSwipeUp: string;
    btnViewDetails: string;
    formatSectionsSelected: string;
    lblCountCart: string;
    lblCountPending: string;
    lblCountRegistered: string;
    lblDeniedCourses: string;
    lblEmpty: string;
    lblHideDetails: string;
    lblScheduleTitle: string;
    lblShowDetails: string;
    scheduleCalendar: IScheduleCalendarResProps;
    scheduleListItem: IScheduleListItemResProps;
}

const styles = (theme: Theme) => createStyles({
    blockButtonContainer: {
        textAlign: 'right'
    },
    blockCard: {
        marginBottom: Tokens.spacing50,
        overflow: 'hidden'
    },
    blockCardActions: {
        padding: `0 ${Tokens.spacing30} 0 ${Tokens.spacing30} !important`
    },
    blockCardContent: {
        padding: `0 ${Tokens.spacing40} 0 ${Tokens.spacing40} !important`
    },
    blockCardHeader: {
        padding: `${Tokens.spacing40}!important`,
        paddingBottom: `${Tokens.spacing30}!important`
    },
    bottomCard: {
        minHeight: Tokens.sizingXxLarge1
    },
    btnRegister: {
        marginBottom: Tokens.spacing40,
        marginLeft: 'auto',
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing40
    },
    cardHeaderActions: {
        marginTop: Tokens.spacing30
    },
    cardSections: {
        height: '100%',
        marginTop: Tokens.spacing70,
        overflowY: 'auto',
        padding: Tokens.spacing40,
        paddingBottom: 0,
        position: 'relative'
    },
    cartCard: {
        padding: 0,
        width: '100%'
    },
    cartCardActions: {
        backgroundColor: Tokens.colorBrandNeutral200,
        padding: Tokens.spacing40,
        paddingBottom: 0
    },
    cartCardContent: {
        height: '50vh',
        overflow: 'auto',
        padding: `${Tokens.spacing30} ${Tokens.spacing40} ${Tokens.spacing30} ${Tokens.spacing40} !important`,
        position: 'relative',
        width: '100%'
    },
    cartCardDrawerBottom: {
        [theme.breakpoints.down('md')]: {
            marginLeft: `-${Tokens.sizingXxLarge}`
        },
        [theme.breakpoints.only('xs')]: {
            marginLeft: `-${Tokens.spacing50}`
        },
        borderRadius: 0,
        bottom: '0',
        marginLeft: '-130px',
        padding: 0,
        position: 'fixed',
        width: '100%',
        zIndex: Tokens.zIndexActionMenu
    },
    cartCardDrawerTop: {
        borderRadius: 0,
        boxShadow: 'none',
        left: '0',
        overflowY: 'hidden',
        padding: 0,
        position: 'fixed',
        top: '0',
        width: '100%',
        zIndex: Tokens.zIndexActionMenu
    },
    cartCardHeader: {
        padding: `${Tokens.spacing30} ${Tokens.spacing40} ${Tokens.spacing30} ${Tokens.spacing40} !important`
    },
    cartIcon: {
        color: Tokens.colorTextPrimary
    },
    divActions: {
        borderBottomColor: 'transparent',
        borderBottomStyle: 'solid',
        borderBottomWidth: Tokens.borderWidthThickest,
        marginLeft: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        paddingBottom: Tokens.spacing40
    },
    divLoader: {
        marginLeft: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        paddingBottom: Tokens.spacing40
    },
    emptyLine: {
        animation: 'blinker 4s linear infinite',
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'block',
        height: Tokens.spacing40,
        width: '150px'
    },
    iconBtnSwipe: {
        marginLeft: Tokens.spacing50,
        marginRight: Tokens.spacing50
    },
    inCartAction: {
        borderBottomColor: Tokens.saffron600
    },
    myScheduleHeader: {
        display: 'flex'
    },
    pendingAction: {
        borderBottomColor: Tokens.fountain600
    },
    registeredAction: {
        borderBottomColor: Tokens.meadow600
    },
    topCard: {
        minHeight: Tokens.layout60
    }
});

type PropsWithStyles = IScheduleListProps & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const ScheduleList: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        canChangeCreditType,
        canDropBlock,
        canDropSection,
        canRemoveBlock,
        canRemoveFromCart,
        canRemoveFromWaitlist,
        classes,
        countActions,
        enableRegister,
        errorLoading,
        getSectionStatus,
        isLoading,
        myBlockSchedule,
        mySchedule,
        resources,
        ScheduleListItemProps,
        showCalendar,
        showDeniedCourses,
        onChangeShowDeniedCourses,
        onDropBlock,
        onExpandBlockCartDetails,
        onRefresh,
        onRegister,
        onRemoveBlock,
        onViewBlockDetails,
        onViewSectionDetailsByCalendar
    } = props;

    const [calendarView, setCalendarView] = useState(false);
    const onShowCalendar = (): void => {
        setCalendarView(true);
    };
    const onShowList = (): void => {
        setCalendarView(false);
    };
    const [isScheduleClicked, setIsScheduleClicked] = useState(false);
    const onSwipeScheduleList = (): void => {
        setIsScheduleClicked(!isScheduleClicked);
    };

    const onClickDropBlock = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (onDropBlock) {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onDropBlock(event);
        }
    };

    const onClickRegister = (): void => {
        if (isScheduleClicked) {
            onSwipeScheduleList();
        }
        onRegister();
    };

    const onClickRemoveBlock = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (onRemoveBlock) {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onRemoveBlock(event);
        }
    };

    const onClickViewBlockDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (onViewBlockDetails) {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onViewBlockDetails(event);
        }
    };

    const onClickViewSectionDetailsByCalendar = (id: number): void => {
        if (onViewSectionDetailsByCalendar) {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onViewSectionDetailsByCalendar(id);
        }
    };

    const disableRegister: boolean = !enableRegister || countActions > 0;
    const disableDrop: boolean = countActions > 0;

    let countRegistered: number = 0;
    let countInCart: number = 0;
    let countPending: number = 0;
    let countDenied: number = 0;

    const sectionElements: JSX.Element[] = [];
    const blockElements: JSX.Element[] = [];
    let blockSectionElements: JSX.Element[] = [];
    const sectionsForCalendar: IStudentSchedule[] = [];

    if (!errorLoading) {
        if (isLoading) {
            sectionElements.push(
                <ContainerLoader id="ldrScheduleList" key="ldrScheduleList" />
            );
        }
        else {
            // Set the counters
            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        countRegistered += block.studentSchedule[ScheduleListType.Registered] ?
                            block.studentSchedule[ScheduleListType.Registered].length : 0;
                        countInCart += block.studentSchedule[ScheduleListType.Cart] ?
                            block.studentSchedule[ScheduleListType.Cart].length : 0;
                        countPending += block.studentSchedule[ScheduleListType.Pending] ?
                            block.studentSchedule[ScheduleListType.Pending].length : 0;
                        if (block.studentSchedule[ScheduleListType.Waitlist]) {
                            block.studentSchedule[ScheduleListType.Waitlist].forEach(sectionInWaitlist => {
                                if (sectionInWaitlist.isPending && sectionInWaitlist.isWaitListPending) {
                                    countInCart++;
                                }
                                else {
                                    countPending++;
                                }
                            });
                        }
                        countDenied += block.studentSchedule[ScheduleListType.Denied] ?
                            block.studentSchedule[ScheduleListType.Denied].length : 0;
                    }
                });
            }
            if (mySchedule) {
                countRegistered += mySchedule[ScheduleListType.Registered] ? mySchedule[ScheduleListType.Registered].length : 0;
                countInCart += mySchedule[ScheduleListType.Cart] ? mySchedule[ScheduleListType.Cart].length : 0;
                countPending += mySchedule[ScheduleListType.Pending] ? mySchedule[ScheduleListType.Pending].length : 0;
                if (mySchedule[ScheduleListType.Waitlist]) {
                    mySchedule[ScheduleListType.Waitlist].forEach(sectionInWaitlist => {
                        if (sectionInWaitlist.isPending && sectionInWaitlist.isWaitListPending) {
                            countInCart++;
                        }
                        else {
                            countPending++;
                        }
                    });
                }
                countDenied += mySchedule[ScheduleListType.Denied] ? mySchedule[ScheduleListType.Denied].length : 0;
            }

            if (countRegistered > 0 || countInCart > 0 || countPending > 0 || countDenied > 0) {
                // Calendar view
                if (showCalendar && calendarView) {
                    if (myBlockSchedule) {
                        myBlockSchedule.forEach(block => {
                            if (block.studentSchedule) {
                                block.studentSchedule.forEach(sectionList => {
                                    if (sectionList) {
                                        sectionList.filter(sl => !sl.isLoading).forEach(section => {
                                            if (showDeniedCourses || !section.isDenied || section.isRegistered) {
                                                sectionsForCalendar.push(section);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    if (mySchedule) {
                        mySchedule.forEach(sectionList => {
                            if (sectionList) {
                                sectionList.filter(sl => !sl.isLoading).forEach(section => {
                                    if (showDeniedCourses || !section.isDenied || section.isRegistered) {
                                        sectionsForCalendar.push(section);
                                    }
                                });
                            }
                        });
                    }
                    sectionElements.push(
                        <ScheduleCalendar
                            key={'studentCalendar'}
                            resources={resources.scheduleCalendar}
                            sections={sectionsForCalendar}
                            onViewSectionDetailsById={onClickViewSectionDetailsByCalendar}
                        />
                    );
                }
                // List view
                else {
                    if (myBlockSchedule) {
                        myBlockSchedule.forEach((block, iBlock) => {
                            if (block.studentSchedule) {
                                blockSectionElements = [];
                                block.studentSchedule.forEach((sectionList, iSectionList) => {
                                    if (sectionList) {
                                        sectionList.forEach((section, iSection) => {
                                            if (showDeniedCourses || !section.isDenied || section.isRegistered) {
                                                blockSectionElements.push(
                                                    <ScheduleListItem
                                                        disableDrop={disableDrop}
                                                        id={`section_${iSectionList}_${iSection}`}
                                                        isScheduleClicked={isScheduleClicked}
                                                        key={`section_${iSectionList}_${iSection}`}
                                                        resources={resources.scheduleListItem}
                                                        section={section}
                                                        sectionStatus={getSectionStatus(section)}
                                                        canChangeCreditType={canChangeCreditType && canChangeCreditType(section)}
                                                        canDrop={canDropSection && canDropSection(section, true)}
                                                        canRemoveFromCart={canRemoveFromCart && canRemoveFromCart(section, true)}
                                                        canRemoveFromWaitlist={canRemoveFromWaitlist && canRemoveFromWaitlist(section, true)}
                                                        onSwipeScheduleList={onSwipeScheduleList}
                                                        {...ScheduleListItemProps}
                                                    />
                                                );
                                            }
                                        });
                                    }
                                });
                                blockElements.push(
                                    <Card key={`blockCardSchedule_${iBlock}`} className={classes.blockCard}>
                                        <CardHeader
                                            action={(
                                                <IconButton
                                                    color="gray"
                                                    data-index={iBlock}
                                                    id={`btnViewBlockSections_${iBlock}`}
                                                    aria-label={block.expanded ? resources.lblHideDetails
                                                        : resources.lblShowDetails}
                                                    onClick={onExpandBlockCartDetails}
                                                >
                                                    {block.expanded ? (<Icon name="chevron-up" />)
                                                        : (<Icon name="chevron-down" />)}
                                                </IconButton>
                                            )}
                                            className={classes.blockCardHeader}
                                            title={(
                                                <Grid container spacing={1} wrap="nowrap">
                                                    <Grid item>
                                                        <BoxesAlt />
                                                    </Grid>
                                                    <Grid item>
                                                        <Text size="h4">
                                                            {block.displayName}
                                                        </Text>
                                                        {block.isLoading ? (<div className={classes.emptyLine} />) : (
                                                            <>
                                                                <Text color="textSecondary" size="small">
                                                                    {Format.toString(resources.formatSectionsSelected,
                                                                        [
                                                                            block.numberOfSectionsSelected,
                                                                            block.numberOfSections
                                                                        ])}
                                                                </Text>
                                                                <Button
                                                                    TextProps={{
                                                                        display: 'inline',
                                                                        size: 'small'
                                                                    }}
                                                                    align="left"
                                                                    data-id={block.blockRegRuleGroupBlockId}
                                                                    id={`btnBlockDetailAdded_${block.blockRegRuleGroupBlockId}`}
                                                                    textVariantStyling="inherit"
                                                                    variant="text"
                                                                    onClick={onClickViewBlockDetails}
                                                                >
                                                                    {resources.btnViewDetails}
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Grid>
                                                </Grid>
                                            )}
                                        />
                                        <Collapse in={block.expanded}>
                                            <CardContent className={classes.blockCardContent}>
                                                {blockSectionElements}
                                            </CardContent>
                                        </Collapse>
                                        {!block.isLoading && (
                                            <CardActions className={classes.blockCardActions}>
                                                <Grid container justifyContent="flex-end">
                                                    <Grid item xs className={classes.blockButtonContainer}>
                                                        <ButtonGroup id={`btgRemoveBlock_${iBlock}`}>
                                                            {canDropBlock && canDropBlock(iBlock) && (
                                                                <Button
                                                                    color="secondary"
                                                                    data-index={iBlock}
                                                                    disabled={disableDrop}
                                                                    IconProps={{
                                                                        name: 'trash'
                                                                    }}
                                                                    id={`btnDropBlock_${iBlock}`}
                                                                    onClick={onClickDropBlock}
                                                                >
                                                                    {resources.btnDropBlock}
                                                                </Button>
                                                            )}
                                                            {canRemoveBlock && canRemoveBlock(iBlock) && (
                                                                <Button
                                                                    color="secondary"
                                                                    data-index={iBlock}
                                                                    IconProps={{
                                                                        name: 'close'
                                                                    }}
                                                                    id={`btnRemoveBlock_${iBlock}`}
                                                                    onClick={onClickRemoveBlock}
                                                                >
                                                                    {resources.btnRemoveBlock}
                                                                </Button>
                                                            )}
                                                        </ButtonGroup>
                                                    </Grid>
                                                </Grid>
                                            </CardActions>
                                        )}
                                    </Card>
                                );
                            }
                        });
                    }
                    if (mySchedule) {
                        mySchedule.forEach((sectionList, iSectionList) => {
                            if (sectionList) {
                                sectionList.forEach((section, iSection) => {
                                    if (showDeniedCourses || !section.isDenied || section.isRegistered) {
                                        sectionElements.push(
                                            <ScheduleListItem
                                                disableDrop={disableDrop}
                                                id={`section_${iSectionList}_${iSection}`}
                                                isScheduleClicked={isScheduleClicked}
                                                key={`section_${iSectionList}_${iSection}`}
                                                resources={resources.scheduleListItem}
                                                section={section}
                                                sectionStatus={getSectionStatus(section)}
                                                canChangeCreditType={canChangeCreditType && canChangeCreditType(section)}
                                                canDrop={canDropSection && canDropSection(section, true)}
                                                canRemoveFromCart={canRemoveFromCart && canRemoveFromCart(section, true)}
                                                canRemoveFromWaitlist={canRemoveFromWaitlist && canRemoveFromWaitlist(section, true)}
                                                onSwipeScheduleList={onSwipeScheduleList}
                                                {...ScheduleListItemProps}
                                            />
                                        );
                                    }
                                });
                            }
                        });
                    }
                }
            }

            if (sectionElements.length === 0) {
                sectionElements.push(
                    <Illustration
                        key="emptyScheduleList"
                        height="sm"
                        name="empty-calendar"
                        text={resources.lblEmpty}
                    />
                );
            }
        }
    }

    let iconsHeader: JSX.Element | undefined;
    if (showCalendar) {
        iconsHeader = (
            <ButtonGroup id="btgScheduleView" toggle className={classes.cardHeaderActions}>
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

    const indicators: JSX.Element = (
        <>
            <div className={classnames(classes.divActions, classes.registeredAction)}>
                <UpDownLabel
                    sizeTextDown="small"
                    sizeTextUp="h3"
                    textDown={resources.lblCountRegistered}
                    textUp={countRegistered}
                    weightTextUp="strong"
                />
            </div>
            {countInCart > 0 && (
                <div className={classnames(classes.divActions, classes.inCartAction)}>
                    <UpDownLabel
                        sizeTextDown="small"
                        sizeTextUp="h3"
                        textDown={resources.lblCountCart}
                        textUp={countInCart}
                        weightTextUp="strong"
                    />
                </div>
            )}
            {countPending > 0 && (
                <div className={classnames(classes.divActions, classes.pendingAction)}>
                    <UpDownLabel
                        sizeTextDown="small"
                        sizeTextUp="h3"
                        textDown={resources.lblCountPending}
                        textUp={countPending}
                        weightTextUp="strong"
                    />
                </div>
            )}
            {countActions > 0 && (
                <div className={classes.divLoader}>
                    <Icon large name="spinner" spin />
                </div>
            )}
        </>
    );

    const registrationButton: JSX.Element = (
        <Button
            className={classes.btnRegister}
            disabled={disableRegister
                || countInCart === 0
                || (mySchedule && mySchedule.length >= 5 && (
                    mySchedule[0].filter(s => s.hideActions || s.isLoading).length > 0
                    || mySchedule[1].filter(s => s.hideActions || s.isLoading).length > 0
                ))}
            id="btnRegister"
            fluid={false}
            onClick={onClickRegister}
        >
            {resources.btnRegister}
        </Button>
    );

    const buttonUpDown: JSX.Element = (
        <Tooltip
            id="tltSwipeMySchedule"
            title={isScheduleClicked ? resources.btnSwipeDown : resources.btnSwipeUp}
            aria-label={isScheduleClicked ? resources.btnSwipeDown : resources.btnSwipeUp}
        >
            <IconButton
                aria-label={isScheduleClicked ? resources.btnSwipeDown : resources.btnSwipeUp}
                className={classes.iconBtnSwipe}
                color="secondary"
                id="btnSwipeMySchedule"
                onClick={onSwipeScheduleList}
            >
                <Icon
                    name={isScheduleClicked ? 'chevron-down' : 'chevron-up'}
                />
            </IconButton>
        </Tooltip>
    );

    const cardHeader: JSX.Element = (
        <CardHeader
            action={iconsHeader}
            className={classes.cartCardHeader}
            title={(
                <Grid container spacing={1}>
                    <Grid item xs={12}>
                        <Grid container alignItems="center" spacing={1} wrap="nowrap">
                            <Grid item>
                                <IconButton
                                    color="gray"
                                    id="btnMySchedule"
                                    aria-label={resources.lblScheduleTitle}
                                    onClick={onRefresh}
                                >
                                    <Icon
                                        className={classes.cartIcon}
                                        large
                                        name="cart"
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item>
                                <Text size="h2">
                                    {resources.lblScheduleTitle}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Checkbox
                            id="chkCoursesCart"
                            checked={showDeniedCourses}
                            label={resources.lblDeniedCourses}
                            onChange={onChangeShowDeniedCourses}
                        />
                    </Grid>
                </Grid>
            )}
        />
    );

    return (
        <Media query={Tokens.mqSmallDown}>
            {(matches: boolean): JSX.Element => matches ?
                (
                    <>
                        <div className={classes.bottomCard} />
                        <Card
                            className={classes.cartCardDrawerBottom}
                            spacingOptions={{
                                spacing: 'none',
                                responsive: false,
                                outerSpacing: false
                            }}
                        >
                            <CardActions
                                className={classes.cartCardActions}
                                disableSpacing
                            >
                                {indicators}
                                {buttonUpDown}
                                {registrationButton}
                            </CardActions>
                        </Card>
                        <Drawer
                            anchor="bottom"
                            fullScreen
                            open={isScheduleClicked}
                            onClose={onSwipeScheduleList}
                        >
                            <Card
                                className={classes.cartCardDrawerTop}
                                spacingOptions={{
                                    spacing: 'none',
                                    responsive: false,
                                    outerSpacing: false
                                }}
                            >
                                <CardActions
                                    className={classes.cartCardActions}
                                    disableSpacing
                                >
                                    {indicators}
                                    {buttonUpDown}
                                    {registrationButton}
                                </CardActions>
                                {cardHeader}
                            </Card>
                            <div className={classes.topCard} />
                            <div className={classes.cardSections}>
                                {blockElements}
                                {sectionElements}
                            </div>
                        </Drawer>
                    </>
                ) :
                (
                    <Card
                        accent="secondary"
                        className="static-element"
                        spacingOptions={{
                            spacing: 'none',
                            responsive: false,
                            outerSpacing: false
                        }}
                    >
                        {cardHeader}
                        <CardContent className={classes.cartCardContent}>
                            {blockElements}
                            {sectionElements}
                        </CardContent>
                        <CardActions
                            className={classes.cartCardActions}
                            disableSpacing
                        >
                            {indicators}
                            {registrationButton}
                        </CardActions>
                    </Card>
                )
            }
        </Media>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ScheduleList);