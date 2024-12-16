/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ScheduleListItem.tsx
 * Type: Presentation component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { SectionStatus } from '@hedtech/powercampus-design-system/types/Section/SectionStatus';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
// #endregion Imports

// #region Internal types
export interface IScheduleListItemProps {
    canChangeCreditType?: boolean;
    canDrop?: boolean;
    canRemoveFromCart?: boolean;
    canRemoveFromWaitlist?: boolean;
    disableDrop: boolean;
    id: string;
    isScheduleClicked: boolean;
    resources: IScheduleListItemResProps;
    section: IStudentSchedule;
    sectionStatus: ISectionStatus;
    selectedPeriod?: string;
    onSwipeScheduleList: () => void;
}

export interface IScheduleListItemPropsToExtend {
    onDrop: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenCreditTypeModal: (id: number) => void;
    onOpenPermissionRequestModal: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenViewCommentsModal: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onRemoveFromCart: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onRemoveFromWaitlist: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewSectionDetails: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IScheduleListItemResProps {
    btnDrop: string;
    btnPermissionRequest: string;
    btnRemove: string;
    btnViewComments: string;
    formatBuilding: string;
    formatDuration: string;
    formatFloor: string;
    formatInstructor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSession: string;
    formatStartEndTimeDays: string;
    formatSubtypeSection: string;
    formatTitleSection: string;
    formatTypeChangeCreditTypeCredits: string;
    formatTypeCreditTypeCredits: string;
    formatYearTermSession: string;
    lblFees: string;
    lblMultipleInstructors: string;
    lblMultipleMeetingTimes: string;
    lblNoInstructor: string;
    lblNoSchedule: string;
}

const styles = (theme: Theme) => createStyles({
    btnContainer: {
        [theme.breakpoints.only('xs')]: {
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
        }
    },
    btnPermissionRequest: {
        marginTop: Tokens.spacing30,
        position: 'inherit'
    },
    btnViewComments: {
        [theme.breakpoints.only('xs')]: {
            paddingTop: Tokens.spacing40
        }
    },
    deniedCard: {
        borderLeftColor: Tokens.colorFillAlertError
    },
    emptyCardContent: {
        animation: 'blinker 4s linear infinite',
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'block',
        height: Tokens.spacing40,
        marginBottom: Tokens.spacing20,
        width: '90%'
    },
    emptyCardStatus: {
        animation: 'blinker 4s linear infinite',
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'inline-block',
        height: Tokens.spacing50,
        marginBottom: Tokens.spacing30,
        marginRight: Tokens.spacing30,
        width: '25%'
    },
    emptyCardTitle: {
        animation: 'blinker 4s linear infinite',
        backgroundColor: Tokens.colorBrandNeutral300,
        borderRadius: Tokens.borderRadiusMedium,
        display: 'block',
        height: Tokens.spacing60,
        marginBottom: Tokens.spacing30,
        width: '100%'
    },
    inCartCard: {
        borderLeftColor: Tokens.saffron600
    },
    itemBlockCard: {
        minHeight: '50px!important'
    },
    itemCard: {
        animation: 'slidein 1s',
        borderLeftStyle: 'solid',
        borderLeftWidth: Tokens.spacing30,
        marginBottom: Tokens.spacing50,
        minHeight: '200px',
        position: 'relative'
    },
    pendingCard: {
        borderLeftColor: Tokens.fountain600
    },
    registeredCard: {
        borderLeftColor: Tokens.meadow600
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
    },
    statusMessageIconContainer: {
        display: 'inline-flex',
        marginLeft: Tokens.spacing30,
        verticalAlign: 'middle'
    }
});

type PropsWithStyles = IScheduleListItemProps & IScheduleListItemPropsToExtend & WithStyles<typeof styles>;
// #endregion Internal types

// #region Component
const ScheduleListItem: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        canChangeCreditType,
        canDrop,
        canRemoveFromCart,
        canRemoveFromWaitlist,
        classes,
        disableDrop,
        id,
        isScheduleClicked,
        resources,
        section,
        sectionStatus,
        selectedPeriod,
        onDrop,
        onOpenCreditTypeModal,
        onOpenPermissionRequestModal,
        onOpenViewCommentsModal,
        onRemoveFromCart,
        onRemoveFromWaitlist,
        onSwipeScheduleList,
        onViewSectionDetails
    } = props;

    // #region Type of Card
    let classCard: string = classes.itemCard;
    if (section.hasBlockRelated) {
        classCard = classnames(classCard, classes.itemBlockCard);
    }
    if (sectionStatus.status !== undefined) {
        switch (sectionStatus.status) {
            case SectionStatus.inCart:
                classCard = classnames(classCard, classes.inCartCard);
                break;
            case SectionStatus.pending:
                classCard = classnames(classCard, classes.pendingCard);
                break;
            case SectionStatus.registered:
                classCard = classnames(classCard, classes.registeredCard);
                break;
            case SectionStatus.denied:
                classCard = classnames(classCard, classes.deniedCard);
                break;
        }
    }
    // #endregion Type of Card

    let yearTerm: string[];
    let yearSelected: string = '';
    let termSelected: string = '';
    if (selectedPeriod) {
        yearTerm = selectedPeriod?.split('/');
        yearSelected = yearTerm[0];
        termSelected = yearTerm[1];
    }

    let contentCard: JSX.Element;

    if (section.isLoading) {
        if (section.hasBlockRelated) {
            contentCard = (
                <>
                    <div className={classes.emptyCardTitle} />
                    <div className={classes.emptyCardStatus} />
                    <div className={classes.emptyCardStatus} />
                </>
            );
        }
        else {
            contentCard = (
                <>
                    <div className={classes.emptyCardTitle} />
                    <div className={classes.emptyCardStatus} />
                    <div className={classes.emptyCardStatus} />
                    <div className={classes.emptyCardContent} />
                    <div className={classes.emptyCardContent} />
                    <div className={classes.emptyCardContent} />
                    <div className={classes.emptyCardContent} />
                    <div className={classes.emptyCardContent} />
                </>
            );
        }
    }
    else {
        const sectionTitle: string = Format.toString(resources.formatTitleSection, [
            section.eventId,
            section.eventName
        ]);

        const onClickRemoveFromCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onRemoveFromCart(event);
        };

        const onClickRemoveFromWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onRemoveFromWaitlist(event);
        };

        const onClickDrop = (event: React.MouseEvent<HTMLButtonElement>): void => {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onDrop(event);
        };

        const onClickViewSectionDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onViewSectionDetails(event);
        };

        const onClickPermissionRequest = (event: React.MouseEvent<HTMLButtonElement>): void => {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onOpenPermissionRequestModal(event);
        };

        const onClickCreditType = (): void => {
            if (isScheduleClicked) {
                onSwipeScheduleList();
            }
            onOpenCreditTypeModal(section.id);
        };

        // #region Schedule(s)
        let schedules: JSX.Element | undefined;
        if (!section.hasBlockRelated) {
            if (section.schedules || section.schedulesCount > 0) {
                if (section.schedules && section.schedules.length === 1) {
                    schedules = (
                        <>
                            <Text size="small">
                                {Format.toString(resources.formatStartEndTimeDays,
                                    [
                                        section.schedules[0].startTime,
                                        section.schedules[0].endTime,
                                        section.schedules[0].dayDesc
                                    ])}
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
                        <Text size="small">
                            {resources.lblMultipleMeetingTimes}
                        </Text>
                    );
                }
            }
            else {
                schedules = (
                    <Text size="small">
                        {resources.lblNoSchedule}
                    </Text>
                );
            }
        }
        // #endregion Schedule

        // #region Instructor(s)
        let instructors: JSX.Element | undefined;
        if (!section.hasBlockRelated) {
            if (section.instructors || section.instructorsCount > 0) {
                if (section.instructors && section.instructors.length === 1) {
                    instructors = (
                        <Text size="small">
                            {Format.toString(resources.formatInstructor, [section.instructors[0].fullName])}
                        </Text>
                    );
                }
                else {
                    instructors = (
                        <Text size="small">
                            {resources.lblMultipleInstructors}
                        </Text>
                    );
                }
            }
            else {
                instructors = (
                    <Text size="small">
                        {resources.lblNoInstructor}
                    </Text>
                );
            }
        }
        // #endregion Instructor(s)

        // #region Remove/Drop Button
        let removeButton: JSX.Element | undefined;
        if (!section.hasBlockRelated || (section.hasBlockRelated && section.allowChanges)) {
            if (canRemoveFromCart) {
                removeButton = (
                    <Tooltip
                        id={`tltRemoveFromCart_${id}`}
                        title={resources.btnRemove}
                    >
                        <IconButton
                            aria-label={resources.btnRemove}
                            color="gray"
                            data-id={section.id}
                            id={`btnRemoveFromCart_${id}`}
                            onClick={onClickRemoveFromCart}
                        >
                            <Icon name="close" />
                        </IconButton>
                    </Tooltip>
                );
            }
            else if (canRemoveFromWaitlist) {
                removeButton = (
                    <Tooltip
                        id={`tltRemoveFromWaitlist_${id}`}
                        title={resources.btnRemove}
                    >
                        <IconButton
                            aria-label={resources.btnRemove}
                            color="gray"
                            data-id={section.id}
                            id={`btnRemoveFromWaitlist_${id}`}
                            onClick={onClickRemoveFromWaitlist}
                        >
                            <Icon name="close" />
                        </IconButton>
                    </Tooltip>
                );
            }
            else if (canDrop) {
                removeButton = (
                    <Tooltip
                        id={`tltDrop_${id}`}
                        title={resources.btnDrop}
                    >
                        <IconButton
                            aria-label={resources.btnDrop}
                            color="gray"
                            data-id={section.id}
                            data-name={sectionTitle}
                            disabled={disableDrop}
                            id={`btnDrop_${id}`}
                            onClick={onClickDrop}
                        >
                            <Icon name="trash" />
                        </IconButton>
                    </Tooltip>
                );
            }
        }
        // #endregion Remove/Drop Button

        // #region Permission Request Button
        let permissionRequestButton: JSX.Element | undefined;
        if (section.isPermissionRequired) {
            permissionRequestButton = (
                <Button
                    className={classes.btnPermissionRequest}
                    data-id={section.id}
                    id={`btnPersmissionRequest_${id}`}
                    onClick={onClickPermissionRequest}
                >
                    {resources.btnPermissionRequest}
                </Button>
            );
        }
        // #endregion Permission Request Button

        // #region View comments Button
        const showViewComments: boolean = Boolean(section.advisorApprovalInfo ||
            (section.permissionRequestInfo &&
                section.permissionRequestInfo.length > 0
                && section.permissionRequestInfo[0].id > 0));
        let viewCommentsButton: JSX.Element | undefined;
        if (showViewComments) {
            viewCommentsButton = (
                <Button
                    TextProps={{
                        className: classes.btnViewComments,
                        display: 'inline',
                        verticalAlign: 'middle'
                    }}
                    align="left"
                    data-id={section.id}
                    data-permissionrequest={!Boolean(section.advisorApprovalInfo)}
                    id={`btnItemViewComments_${section.id}`}
                    textVariantStyling="inherit"
                    variant="text"
                    onClick={onOpenViewCommentsModal}
                >
                    {resources.btnViewComments}
                </Button>
            );
        }
        // #endregion View comments Button

        contentCard = (
            <>
                <Grid container justifyContent="space-between" wrap="nowrap">
                    <Grid item>
                        <Button
                            TextProps={{
                                size: 'h4',
                                weight: 'strong'
                            }}
                            align="left"
                            data-id={section.id}
                            id={`btnItemTitle_${section.id}`}
                            textVariantStyling="inherit"
                            variant="text"
                            onClick={onClickViewSectionDetails}
                        >
                            {sectionTitle}
                        </Button>
                    </Grid>
                    <Grid item>
                        {section.hideActions ? (
                            <Icon name="spinner" large spin />
                        ) : (
                                <>
                                    {removeButton}
                                </>
                            )}
                    </Grid>
                </Grid>
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
                <div className={classes.statusMessageIconContainer}>
                    {sectionStatus.statusIcon}
                    {sectionStatus.statusInfo}
                </div>
                {!section.hasBlockRelated && (
                    <>
                        <Text size="small">
                            {section.isConEd ?
                                Format.toString(resources.formatSession, [section.sessionDesc])
                                : Format.toString(resources.formatYearTermSession, [yearSelected, termSelected, section.sessionDesc])}
                        </Text>
                        <Text size="small">
                            {Format.toString(resources.formatSubtypeSection, [section.eventSubType, section.section])}
                        </Text>
                        {canChangeCreditType ? (
                            <Paragraph
                                id={`prgCreditType_${section.id}`}
                                size="small"
                                text={Format.toString(resources.formatTypeChangeCreditTypeCredits, [
                                    section.eventType,
                                    section.creditTypeDescription || section.defaultCreditTypeDesc,
                                    section.isConEd ? section.ceu : section.credits
                                ])}
                                events={[onClickCreditType]}
                            />
                        ) : (
                                <Text size="small">
                                    {Format.toString(resources.formatTypeCreditTypeCredits, [
                                        section.eventType,
                                        section.creditTypeDescription || section.defaultCreditTypeDesc,
                                        section.isConEd ? section.ceu : section.credits
                                    ])}
                                </Text>
                            )}
                        <Text size="small">
                            {Format.toString(resources.formatDuration, [section.startDate, section.endDate])}
                        </Text>
                        {schedules}
                        {instructors}
                        {section.areFeesApplicable && (
                            <Text size="small">
                                {resources.lblFees}
                            </Text>
                        )}
                    </>
                )}
                {!section.hideActions && (
                    <div className={classes.btnContainer}>
                        {permissionRequestButton}
                        {!section.hasBlockRelated && (
                            <>
                                {viewCommentsButton}
                            </>
                        )}
                    </div>
                )}
                {sectionStatus.importantMessage ? (
                    <Text className={classes.spacingHTMLMessage}>
                        <div dangerouslySetInnerHTML={{ __html: sectionStatus.importantMessage }} />
                    </Text>
                ) : undefined}
            </>
        );
    }

    return (
        <Card className={classCard}>
            <CardContent>
                {contentCard}
            </CardContent>
        </Card >
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ScheduleListItem);