/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SectionCard.tsx
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
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
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
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
// #endregion Imports

// #region Internal types
export interface ISectionCardProps {
    allowChanges?: boolean;
    canAddToCart?: boolean;
    canAddToWaitlist?: boolean;
    canChangeCreditType?: boolean;
    canDrop?: boolean;
    canRemoveFromCart?: boolean;
    canRemoveFromWaitlist?: boolean;
    disableDrop?: boolean;
    id: string;
    ruleGroupBlockId?: number;
    section: ISection | IStudentSchedule;
    sectionStatus?: ISectionStatus;
    withCard?: boolean;
    showYearTermSession?: boolean;
}

export interface ISectionCardPropsToExtend {
    currencySymbol: string;
    numberCulture: string;
    resources: ISectionCardResProps;
    onAddToCart?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onAddToWaitlist?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onBeforeAddToCart?: () => void;
    onBeforeAddToWaitlist?: () => void;
    onDrop?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenCreditTypeModal?: (id: number) => void;
    onOpenPermissionRequestModal?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenViewCommentsModal?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onRemoveFromCart?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onRemoveFromWaitlist?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSelectSection?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onViewSectionDetails?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewSectionDetailsByBlock?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ISectionCardResProps {
    btnAdd: string;
    btnDrop: string;
    btnPermissionRequest: string;
    btnRemove: string;
    btnViewComments: string;
    btnWait: string;
    formatAddSectionToCart: string;
    formatBuilding: string;
    formatDuration: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSeatsWaiting: string;
    formatSelectSection: string;
    formatSession: string;
    formatStartEndTime: string;
    formatSubtypeSection: string;
    formatTitleSection: string;
    formatType: string;
    formatTypeChangeCreditType: string;
    formatTypeCreditType: string;
    formatYearTermSession: string;
    lblAddToWaitlist: string;
    lblCredits: string;
    lblFees: string;
    lblMultipleInstructors: string;
    lblMultipleMeetingTimes: string;
    lblNoInstructor: string;
    lblNoSchedule: string;
    lblSeats: string;
    lblToWaitlist: string;
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
    btnCentered: {
        textAlign: 'center'
    },
    btnPermissionRequest: {
        marginTop: Tokens.spacing30
    },
    buttonsContainer: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
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
    meeting: {
        marginTop: Tokens.spacing30
    },
    multipleIinstructorName: {
        [theme.breakpoints.only('xs')]: {
            marginLeft: Tokens.spacing30
        }
    },
    resultCardContainer: {
        marginTop: Tokens.spacing40
    },
    spacingHTMLMessage: {
        marginTop: Tokens.spacing60
    },
    statusLabelMargin: {
        marginBottom: Tokens.spacing20,
        marginTop: Tokens.spacing20
    },
    statusMessage: {
        marginLeft: Tokens.spacing35
    }
}));

type PropsWithStyles = ISectionCardProps & ISectionCardPropsToExtend & WithStyles<typeof styles> & WithWidth;
// #endregion Internal types

// #region Component
const SectionCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        allowChanges,
        canAddToCart,
        canAddToWaitlist,
        canChangeCreditType,
        canDrop,
        canRemoveFromCart,
        canRemoveFromWaitlist,
        classes,
        currencySymbol,
        disableDrop,
        id,
        numberCulture,
        resources,
        ruleGroupBlockId,
        section,
        sectionStatus,
        showYearTermSession,
        width,
        withCard,
        onAddToCart,
        onAddToWaitlist,
        onBeforeAddToCart,
        onBeforeAddToWaitlist,
        onDrop,
        onOpenCreditTypeModal,
        onOpenPermissionRequestModal,
        onOpenViewCommentsModal,
        onRemoveFromCart,
        onRemoveFromWaitlist,
        onSelectSection,
        onViewSectionDetails,
        onViewSectionDetailsByBlock
    } = props;

    const onClickAddToCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (onBeforeAddToCart) {
            onBeforeAddToCart();
        }
        if (onAddToCart) {
            onAddToCart(event);
        }
    };
    const onClickAddToWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
        if (onBeforeAddToWaitlist) {
            onBeforeAddToWaitlist();
        }
        if (onAddToWaitlist) {
            onAddToWaitlist(event);
        }
    };

    const onClickCreditType = () => {
        if (onOpenCreditTypeModal) {
            onOpenCreditTypeModal(section.id);
        }
    };
    const sectionTitle: string = Format.toString(resources.formatTitleSection, [
        section.eventId,
        section.eventName
    ]);

    const sectionAsStudentSchedule = section as IStudentSchedule;

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

    // #region Add Button
    const addButton: JSX.Element | undefined = canAddToCart ? (
        <Button
            aria-label={Format.toString(resources.formatAddSectionToCart, [section.eventName])}
            data-id={section.id}
            id={`btnAddToCart_${id}_${section.id}`}
            color="secondary"
            onClick={onClickAddToCart}
        >
            {resources.btnAdd}
        </Button>
    ) : (canAddToWaitlist ? (
        <>
            <Button
                data-id={section.id}
                id={`btnAddToWaitlist_${id}_${section.id}`}
                color="secondary"
                onClick={onClickAddToWaitlist}
            >
                {resources.btnWait}
            </Button>
            <Text>
                {resources.lblToWaitlist}
            </Text>
        </>
    ) : undefined);
    // #endregion Add Button

    // #region Remove/Drop Button
    let removeButton: JSX.Element | undefined;
    if (section.hasBlockRelated && allowChanges) {
        if (canRemoveFromCart) {
            removeButton = (
                <Tooltip
                    id="tltRemoveFromCart"
                    title={resources.btnRemove}
                >
                    <IconButton
                        aria-label={resources.btnRemove}
                        color="gray"
                        data-id={section.id}
                        id={`btnRemoveFromCart_${id}`}
                        onClick={onRemoveFromCart}
                    >
                        <Icon name="close" />
                    </IconButton>
                </Tooltip>
            );
        }
        else if (canRemoveFromWaitlist) {
            removeButton = (
                <Tooltip
                    id="tltRemoveFromWaitlist"
                    title={resources.btnRemove}
                >
                    <IconButton
                        aria-label={resources.btnRemove}
                        color="gray"
                        data-id={section.id}
                        id={`btnRemoveFromWaitlist_${id}`}
                        onClick={onRemoveFromWaitlist}
                    >
                        <Icon name="close" />
                    </IconButton>
                </Tooltip>
            );
        }
        else if (canDrop) {
            removeButton = (
                <Tooltip
                    id="tltDrop"
                    title={resources.btnDrop}
                >
                    <IconButton
                        aria-label={resources.btnDrop}
                        color="gray"
                        data-id={section.id}
                        data-name={sectionTitle}
                        disabled={disableDrop}
                        id={`btnDrop_${id}`}
                        onClick={onDrop}
                    >
                        <Icon name="trash" />
                    </IconButton>
                </Tooltip>
            );
        }
    }
    // #endregion Remove/Drop Button
    let permissionRequestButton: JSX.Element | undefined;
    let viewCommentsButton: JSX.Element | undefined;

    if (section.hasBlockRelated) {
        // #region Permission Request Button
        if (sectionAsStudentSchedule.isPermissionRequired) {
            permissionRequestButton = (
                <Button
                    className={classes.btnPermissionRequest}
                    data-id={section.id}
                    id={`btnPersmissionRequest_${id}`}
                    onClick={onOpenPermissionRequestModal}
                >
                    {resources.btnPermissionRequest}
                </Button>
            );
        }
        // #endregion Permission Request Button

        // #region View comments Button
        const showViewComments: boolean = Boolean(sectionAsStudentSchedule.advisorApprovalInfo ||
            (sectionAsStudentSchedule.permissionRequestInfo &&
                sectionAsStudentSchedule.permissionRequestInfo.length > 0
                && sectionAsStudentSchedule.permissionRequestInfo[0].id > 0));
        if (showViewComments) {
            viewCommentsButton = (
                <Button
                    TextProps={{
                        display: 'inline',
                        verticalAlign: 'middle'
                    }}
                    align="left"
                    data-id={section.id}
                    data-permissionrequest={!Boolean(sectionAsStudentSchedule.advisorApprovalInfo)}
                    id={`btnItemTitle_${section.id}`}
                    textVariantStyling="inherit"
                    variant="text"
                    onClick={onOpenViewCommentsModal}
                >
                    {resources.btnViewComments}
                </Button>
            );
        }
        // #endregion View comments Button
    }

    // #region Seats Left
    let percentageSeatsLeft: number = 0;
    let indicatorSeatsLeft: JSX.Element | undefined;
    if (section.seatsLeft > 0) {
        percentageSeatsLeft = Math.floor((section.seatsLeft * 100) / section.maximumSeats);
        indicatorSeatsLeft = percentageSeatsLeft > 50 ? undefined : (
            <Icon
                name="stopwatch"
                type={percentageSeatsLeft > 25 ? 'warning' : 'error'}
            />
        );
    }
    // #endregion Seats Left

    const sectionData: JSX.Element = (
        <Grid container>
            <Grid item xs={12} sm={withCard ? 4 : 6} lg={withCard ? 5 : 7}>
                <Button
                    TextProps={{
                        size: 'h4'
                    }}
                    align="left"
                    data-id={section.id}
                    id={`btnTitle_${id}_${section.id}`}
                    textVariantStyling="inherit"
                    variant="text"
                    onClick={section.hasBlockRelated
                        ? onViewSectionDetailsByBlock
                        : onViewSectionDetails}
                >
                    {sectionTitle}
                </Button>
                {sectionStatus && (
                    <>
                        {Boolean(sectionStatus.labelText) && (
                            <StatusLabel
                                classes={{ root: classes.statusLabelMargin }}
                                id={`stsLbl_${id}`}
                                text={sectionStatus.labelText}
                                type={sectionStatus.labelType}
                            />
                        )}
                        {Boolean(sectionStatus.message) && (
                            <Text
                                className={classes.statusMessage}
                                display="inline"
                            >
                                {sectionStatus.message}
                            </Text>
                        )}
                        <div className={classes.iconStatusMessage}>
                            {sectionStatus.statusIcon}
                            {sectionStatus.statusInfo}
                        </div>
                    </>
                )}
                {section.year && section.termDesc && showYearTermSession && (
                    <Text size="small">
                        {Format.toString(resources.formatYearTermSession, [section.year, section.termDesc, section.sessionDesc])}
                    </Text>
                )}
                <Text size="small">
                    {Format.toString(resources.formatSubtypeSection, [section.eventSubType, section.section])}
                </Text>
                {section.hasBlockRelated && canChangeCreditType ? (
                    <Paragraph
                        id={`prgCreditType_${section.id}`}
                        size="small"
                        text={Format.toString(resources.formatTypeChangeCreditType,
                            [section.eventType,
                            sectionAsStudentSchedule.creditTypeDescription
                            || section.defaultCreditTypeDesc])}
                        events={[onClickCreditType]}
                    />
                ) : (
                    <Text size="small">
                        {Format.toString(resources.formatTypeCreditType,
                            [section.eventType, section.defaultCreditTypeDesc])}
                    </Text>
                )
                }
                <Text size="small">
                    {Format.toString(resources.formatDuration, [section.startDate, section.endDate])}
                </Text>
                <div className={classes.meeting}>
                    {schedules}
                </div>
                {!withCard && section.areFeesApplicable && (
                    <Text size="small">
                        {resources.lblFees}
                    </Text>
                )}
                {sectionStatus && sectionStatus.importantMessage ? (
                    <Text className={classes.spacingHTMLMessage}>
                        <div dangerouslySetInnerHTML={{ __html: sectionStatus.importantMessage }} />
                    </Text>
                ) : undefined}
                {viewCommentsButton && !sectionAsStudentSchedule.hideActions && (
                    <>
                        {viewCommentsButton}
                    </>
                )}
            </Grid>
            {width === 'xs' && (
                <Grid
                    item
                    xs={12}
                    className={classes.centered}
                >
                    {instructors}
                </Grid>
            )}
            <Grid item xs={12} sm={withCard ? 8 : 6} lg={withCard ? 7 : 5} className={classes.buttonsContainer}>
                <Grid
                    container
                    justifyContent={width === 'xs' ? 'flex-start' : 'space-around'}
                    spacing={1}
                >
                    {width !== 'xs' && (
                        <Grid item xs>
                            {instructors}
                        </Grid>
                    )}
                    <Grid item xs>
                        <UpDownLabel
                            sizeTextDown="small"
                            sizeTextUp="h4"
                            textDown={resources.lblCredits}
                            textUp={section.credits}
                            withMarginTextUp
                        />
                    </Grid>
                    <Grid item xs>
                        <UpDownLabel
                            indicatorUp={indicatorSeatsLeft}
                            sizeTextDown="small"
                            sizeTextUp="h4"
                            textDown={resources.lblSeats}
                            textUp={section.seatsLeft.toLocaleString(numberCulture)}
                            withMarginTextUp
                        />
                        {section.seatsWaiting > 0 && (
                            <Text align="center" size="small">
                                {Format.toString(resources.formatSeatsWaiting, [section.seatsWaiting])}
                            </Text>
                        )}
                    </Grid>
                    {withCard && (
                        <Grid item xs>
                            {section.areFeesApplicable && (
                                <UpDownLabel
                                    sizeTextDown="small"
                                    sizeTextUp="h4"
                                    textDown={resources.lblFees}
                                    textUp={currencySymbol}
                                    withMarginTextUp
                                />
                            )}
                        </Grid>
                    )}
                    {(onAddToCart || onAddToWaitlist)
                        && width !== 'xs'
                        && (
                            <Grid item xs className={classes.btnCentered}>
                                {addButton}
                            </Grid>
                        )}
                </Grid>
                {permissionRequestButton && !sectionAsStudentSchedule.hideActions && (
                    <Grid container justifyContent="flex-end">
                        <Grid item xs={width === 'xs'}>
                            {permissionRequestButton}
                        </Grid>
                    </Grid>
                )}
            </Grid>
            {(onAddToCart || onAddToWaitlist)
                && width === 'xs'
                && (
                    <Grid item xs={12} className={classes.btnCentered}>
                        {addButton}
                    </Grid>
                )}
        </Grid>
    );

    if (withCard) {
        return (
            <Card className={classes.resultCardContainer}>
                <CardContent>
                    {sectionData}
                </CardContent>
            </Card>
        );
    }
    else {
        const checkDisabled: boolean = !(canAddToCart || canAddToWaitlist);
        return (
            <Grid container wrap="nowrap">
                <Grid item xs={2} md={1}>
                    <Grid container alignItems="center" direction="column" spacing={0}>
                        {allowChanges && (
                            <Grid item>
                                <Checkbox
                                    checked={checkDisabled ? false : Boolean(section.isSelected)}
                                    disabled={checkDisabled}
                                    id={`chkBlockSectionDetail_${ruleGroupBlockId}_${section.id}`}
                                    inputProps={{
                                        'data-blockid': ruleGroupBlockId,
                                        'data-id': section.id,
                                        'aria-label': Format.toString(resources.formatSelectSection, [sectionTitle])
                                    }}
                                    noMargin
                                    onChange={onSelectSection}
                                />
                            </Grid>
                        )}
                        {canAddToWaitlist && (
                            <Grid item>
                                <Text align="center">
                                    {resources.lblAddToWaitlist}
                                </Text>
                            </Grid>
                        )}
                    </Grid>
                </Grid>
                <Grid item xs>
                    {sectionData}
                </Grid>
                {section.hasBlockRelated && allowChanges && (
                    <Grid item className={classes.btnCentered}>
                        {sectionAsStudentSchedule.hideActions ? (
                            <Icon name="spinner" large spin />
                        ) : (
                            <>
                                {removeButton}
                            </>
                        )}
                    </Grid>
                )}
            </Grid>
        );
    }
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(SectionCard));