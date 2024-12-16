/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SectionDetailModal.tsx
 * Type: Presentation component */

// #region Imports
import classnames from 'classnames';
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import PermissionRequestDetail, {
    IPermissionRequestDetailPropsToExtend,
    IPermissionRequestDetailResProps
} from '@hedtech/powercampus-design-system/react/components/Section/PermissionRequestDetail';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text, { TextAlign } from '@hedtech/powercampus-design-system/react/core/Text';
import TextLink from '@hedtech/powercampus-design-system/react/core/TextLink';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { SectionStatus } from '@hedtech/powercampus-design-system/types/Section/SectionStatus';
import { ISectionDetail } from '../../Types/Section/ISectionDetail';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Internal types
export interface ISectionDetailModalProps {
    canAddToCart?: boolean;
    canAddToWaitlist?: boolean;
    canChangeCreditType?: boolean;
    canDrop?: boolean;
    canRemoveFromCart?: boolean;
    canRemoveFromWaitlist?: boolean;
    creditTypeDesc?: string;
    isStudentView?: boolean;
    open: boolean;
    PermissionRequestDetailProps?: IPermissionRequestDetailPropsToExtend;
    resources: ISectionDetailModalResProps;
    section: ISectionDetail;
    sectionStatus?: ISectionStatus;
    onAddToCart?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onAddToWaitlist?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDrop?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onOpenCreditTypeModal?: (id: number) => void;
    onRemoveFromCart?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onRemoveFromWaitlist?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClose: () => void;
}

export interface ISectionDetailModalResProps {
    btnAdd: string;
    btnDrop: string;
    btnRemove: string;
    btnWait: string;
    formatBuilding: string;
    formatChangeCreditTypes: string;
    formatCorequisite: string;
    formatCreditTypes: string;
    formatDuration: string;
    formatFees: string;
    formatFloor: string;
    formatOrganization: string;
    formatRoom: string;
    formatSeatsWaiting: string;
    formatSession: string;
    formatStartEndTime: string;
    formatSubtypeSection: string;
    formatTitleSection: string;
    formatTypeChangeCreditTypes: string;
    formatTypeCreditType: string;
    formatYearTermSession: string;
    lblAddToWaitlist: string;
    lblAdvisorApproval: string;
    lblCeu: string;
    lblCeuLong: string;
    lblContinuingEducation: string;
    lblCorequisites: string;
    lblCourse: string;
    lblCourseDescription: string;
    lblCredits: string;
    lblCreditTypes: string;
    lblDoesNotApply: string;
    lblFees: string;
    lblInstructors: string;
    lblNoComments: string;
    lblNoInstructor: string;
    lblNoSchedule: string;
    lblPermissionRequest: string;
    lblPrerequisits: string;
    lblRegistrationType: string;
    lblSchedules: string;
    lblSeats: string;
    lblTotalSeats: string;
    lblToWaitlist: string;
    lblTraditional: string;
    permissionRequestDetail: IPermissionRequestDetailResProps;
}

const styles = ((theme: Theme) => createStyles({
    avatar: {
        marginLeft: '0rem!important'
    },
    btnCentered: {
        textAlign: 'center'
    },
    centered: {
        alignItems: 'center',
        display: 'flex'
    },
    commentsContainer: {
        maxHeight: '200px',
        overflowX: 'hidden',
        overflowY: 'auto',
        width: 'auto'
    },
    courseContainer: {
        marginBottom: Tokens.spacing30
    },
    courseMaterialsContainer: {
        marginBottom: Tokens.spacing30
    },
    deniedDivider: {
        backgroundColor: Tokens.colorFillAlertError
    },
    iconStatusMessage: {
        display: 'inline-block',
        marginLeft: Tokens.spacing30,
        verticalAlign: 'middle'
    },
    inCartDivider: {
        backgroundColor: Tokens.saffron600
    },
    instructorAvatars: {
        display: 'flex'
    },
    instructorName: {
        wordBreak: 'normal'
    },
    instructorsContainer: {
        backgroundColor: Tokens.colorBrandNeutral200,
        marginBottom: Tokens.spacing50,
        marginLeft: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        marginTop: Tokens.sizingXxSmall,
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing40,
        width: 'auto'
    },
    listTyle: {
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },
    meeting: {
        [theme.breakpoints.down('sm')]: {
            padding: Tokens.spacing35
        },
        borderColor: Tokens.colorBrandNeutral300,
        borderStyle: 'solid',
        borderWidth: '1px',
        padding: Tokens.spacing40,
        width: '100%'
    },
    pendingDivider: {
        backgroundColor: Tokens.fountain600
    },
    registeredDivider: {
        backgroundColor: Tokens.meadow600
    },
    schedulesContainer: {
        marginBottom: Tokens.spacing40
    },
    separatorExpansionPanel: {
        marginBottom: Tokens.spacing40
    },
    statusLabelMargin: {
        marginBottom: Tokens.spacing20,
        marginTop: Tokens.spacing20
    },
    statusMessage: {
        marginLeft: Tokens.spacing35
    }
}));

type PropsWithStyles = ISectionDetailModalProps & WithStyles<typeof styles> & WithWidth;
// #endregion Internal types

// #region Component
const SectionDetailModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        canAddToCart,
        canAddToWaitlist,
        canChangeCreditType,
        canDrop,
        canRemoveFromCart,
        canRemoveFromWaitlist,
        classes,
        creditTypeDesc,
        isStudentView,
        open,
        PermissionRequestDetailProps,
        resources,
        section,
        sectionStatus,
        width,
        onAddToCart,
        onAddToWaitlist,
        onDrop,
        onOpenCreditTypeModal,
        onRemoveFromCart,
        onRemoveFromWaitlist,
        onClose
    } = props;

    const id: string = 'sectionDetailModal';
    const cultures: ICultures = LayoutStore.getCultures();

    const onClickCreditType = () => {
        if (onOpenCreditTypeModal) {
            onOpenCreditTypeModal(section.id);
        }
    };

    const sectionTitle: string = Format.toString(resources.formatTitleSection, [
        section.eventId,
        section.eventName
    ]);

    // #region Header
    // #region Status
    let classDivider: string | undefined;
    let status: JSX.Element | undefined;
    let statusMessage: JSX.Element | undefined;
    if (sectionStatus) {
        if (sectionStatus.status !== undefined) {
            switch (sectionStatus.status) {
                case SectionStatus.inCart:
                    classDivider = classnames(classDivider, classes.inCartDivider);
                    break;
                case SectionStatus.pending:
                    classDivider = classnames(classDivider, classes.pendingDivider);
                    break;
                case SectionStatus.registered:
                    classDivider = classnames(classDivider, classes.registeredDivider);
                    break;
                case SectionStatus.denied:
                    classDivider = classnames(classDivider, classes.deniedDivider);
                    break;
            }
        }

        status = (
            <Grid container spacing={2} alignItems="center">
                <Grid item>
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
                </Grid>
            </Grid>
        );
        if (sectionStatus.importantMessage) {
            statusMessage = (
                <Grid container>
                    <Grid item xs>
                        <div className={classes.instructorsContainer}>
                            <Text>
                                <div dangerouslySetInnerHTML={{ __html: sectionStatus.importantMessage }} />
                            </Text>
                        </div>
                    </Grid>
                </Grid>
            );
        }
    }
    // #endregion Status

    const headerModal: JSX.Element = (
        <>
            <Text size="h2">
                {sectionTitle}
            </Text>
            {status}
            <Divider classes={{ root: classDivider }} noMarginBottom noMarginTop />
        </>
    );
    // #endregion Header

    // #region Footer
    let footerModal: JSX.Element | undefined;
    if (isStudentView && !section.hasBlockRelated) {
        if (canAddToCart) {
            footerModal = (
                <Button
                    data-id={section.id}
                    IconProps={{
                        name: 'cart'
                    }}
                    id={`btnAddToCart_${id}_${section.id}`}
                    onClick={onAddToCart}
                >
                    {resources.btnAdd}
                </Button>
            );
        }
        else if (canAddToWaitlist) {
            footerModal = (
                <div className={classes.btnCentered}>
                    <Button
                        data-id={section.id}
                        IconProps={{
                            name: 'cart'
                        }}
                        id={`btnAddToWaitlist_${id}_${section.id}`}
                        onClick={onAddToWaitlist}
                    >
                        {resources.btnWait}
                    </Button>
                    <Text>
                        {resources.lblToWaitlist}
                    </Text>
                </div>
            );
        }
        else if (canDrop) {
            footerModal = (
                <Button
                    data-id={section.id}
                    data-name={sectionTitle}
                    IconProps={{
                        name: 'trash'
                    }}
                    id={`btnDrop_${id}_${section.id}`}
                    onClick={onDrop}
                >
                    {resources.btnDrop}
                </Button>
            );
        }
        else if (canRemoveFromCart) {
            footerModal = (
                <Button
                    data-id={section.id}
                    IconProps={{
                        name: 'close'
                    }}
                    id={`btnRemoveFromCart_${id}_${section.id}`}
                    onClick={onRemoveFromCart}
                >
                    {resources.btnRemove}
                </Button>
            );
        }
        else if (canRemoveFromWaitlist) {
            footerModal = (
                <Button
                    data-id={section.id}
                    IconProps={{
                        name: 'close'
                    }}
                    id={`btnRemoveFromWaitlist_${id}_${section.id}`}
                    onClick={onRemoveFromWaitlist}
                >
                    {resources.btnRemove}
                </Button>
            );
        }
    }
    // #endregion Footer

    // #region Body

    // #region Permission Request
    let permissionRequest: JSX.Element | undefined;
    if (PermissionRequestDetailProps
        && section.permissionRequestInfo
        && section.permissionRequestInfo.length > 0) {
        const headerPermissionRequest: JSX.Element = (
            <Grid container spacing={PermissionRequestDetailProps ? 0 : 2} alignItems="center">
                <Grid item>
                    <Text>
                        {resources.lblPermissionRequest}
                    </Text>
                </Grid>
                <Grid item xs className={classes.instructorAvatars}>
                    {section.permissionRequestInfo.map((pr, ipr) => (pr.facultyInfo ? (
                        <Avatar
                            key={`avatar_${ipr}`}
                            backgroundNumber={pr.facultyInfo.colorFirstLetter}
                        >
                            {pr.facultyInfo.firstLetter}
                        </Avatar>
                    ) : undefined))}
                </Grid>
            </Grid>
        );

        const contentPermissionRequest: JSX.Element = (
            <Grid container>
                <Grid item xs>
                    <PermissionRequestDetail
                        generalStatus={section.statusPermisionRequest}
                        id="permissionRequestDetail"
                        isStudent={isStudentView}
                        permissionRequestInfo={section.permissionRequestInfo}
                        resources={resources.permissionRequestDetail}
                        withChatTitle
                        withScroll
                        {...PermissionRequestDetailProps}
                    />
                </Grid>
            </Grid>
        );

        permissionRequest = (
            <>
                <ExpansionPanel
                    background="gray"
                    header={headerPermissionRequest}
                >
                    {contentPermissionRequest}
                </ExpansionPanel>
                <div className={classes.separatorExpansionPanel} />
            </>
        );
    }
    // #endregion Permission Request

    // #region Advisor approval
    let advisorApproval: JSX.Element | undefined;
    if (section.advisorApprovalInfo) {
        advisorApproval = (
            <>
                <Grid container>
                    <Grid item>
                        <Text size="h4">
                            {resources.lblAdvisorApproval}
                        </Text>
                    </Grid>
                </Grid>
                <div className={classes.instructorsContainer}>
                    {section.advisorApprovalInfo.facultyInfo.fullName
                        || section.advisorApprovalInfo.decisionDate ? (
                            <>
                                <Grid container justifyContent="space-between">
                                    <Grid item>
                                        <Text>
                                            {section.advisorApprovalInfo.facultyInfo.fullName}
                                        </Text>
                                    </Grid>
                                    <Grid item>
                                        <Text align="right">
                                            {section.advisorApprovalInfo.decisionDate}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <br />
                            </>
                        ) : undefined}
                    <Grid container>
                        <Grid item xs>
                            <div className={classes.commentsContainer}>
                                <Text>
                                    {section.advisorApprovalInfo.reason || resources.lblNoComments}
                                </Text>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </>
        );
    }
    // #endregion Advisor approval

    // #region Schedule(s)
    let schedules: JSX.Element | JSX.Element[] | undefined;
    if (section.schedules && section.schedules.length > 0) {
        schedules = section.schedules.map((schedule, i) => (
            <Grid item xs={12} className={classes.centered} key={`schedule_${i}`}>
                <div className={classes.meeting}>
                    <Grid container spacing={isWidthUp('md', width) ? 2 : 0}>
                        <Grid item xs={12} md={4} lg={3}>
                            <Text>
                                {Format.toString(resources.formatStartEndTime, [schedule.startTime, schedule.endTime])}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={4} lg={3}>
                            <Text>
                                {schedule.dayDesc}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={4} lg={6}>
                            <Text align={isWidthUp('md', width) ? 'right' : 'left'} size="small">
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
                    </Grid>
                </div>
            </Grid>
        ));
    }
    else {
        schedules = (
            <Grid item xs={12}>
                <div className={classes.meeting}>
                    <Text>
                        {resources.lblNoSchedule}
                    </Text>
                </div>
            </Grid>
        );
    }
    // #endregion Schedule(s)

    // #region Instructor(s)
    let instructors: JSX.Element | JSX.Element[] | undefined;
    if (section.instructors && section.instructors.length > 0) {
        instructors = section.instructors.map((instructor, i) => (
            <Grid item className={classes.centered} key={`instructor_${i}`}>
                <div>
                    <Avatar
                        id={`avatar_firstLetter_${i}`}
                        backgroundNumber={instructor.colorFirstLetter}
                        classes={{ root: classes.avatar }}
                    >
                        {instructor.firstLetter}
                    </Avatar>
                </div>
                <div>
                    <Text
                        className={classes.instructorName}
                    >
                        {instructor.fullName}
                    </Text>
                </div>
            </Grid>
        ));
    }
    else {
        instructors = (
            <Grid item xs className={classes.centered}>
                <div>
                    <Avatar id="avatar_noInstructor" background="default" classes={{ root: classes.avatar }} />
                </div>
                <div>
                    <Text className={classes.instructorName}>
                        {resources.lblNoInstructor}
                    </Text>
                </div>
            </Grid>
        );
    }
    // #endregion Instructor(s)

    // #region Seats Left
    let percentageSeatsLeft: number = 0;
    let indicatorSeatsLeft: JSX.Element | undefined;
    indicatorSeatsLeft = undefined;
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
    const detailAlignment: TextAlign = isWidthUp('md', width) ? 'right' : 'left';
    const bodyModal: JSX.Element = (
        <>
            {statusMessage}
            {advisorApproval}
            {permissionRequest}
            <Grid container>
                <Grid item xs={12} md={section.isConEd ? 7 : 6}>
                    <Grid container spacing={3}>
                        <Grid item>
                            <UpDownLabel
                                sizeTextDown="small"
                                sizeTextUp="h3"
                                textDown={resources.lblCredits}
                                textUp={section.credits}
                                withMarginTextUp
                            />
                        </Grid>
                        {section.isConEd && (
                            <Grid item>
                                <Tooltip
                                    id="tltCeu"
                                    title={resources.lblCeuLong}
                                    placement="bottom-start"
                                >
                                    <div>
                                        <UpDownLabel
                                            sizeTextDown="small"
                                            sizeTextUp="h3"
                                            textDown={resources.lblCeu}
                                            textUp={section.ceu}
                                            withMarginTextUp
                                        />
                                    </div>
                                </Tooltip>
                            </Grid>
                        )}
                        <Grid item>
                            <UpDownLabel
                                sizeTextDown="small"
                                sizeTextUp="h3"
                                textDown={resources.lblTotalSeats}
                                textUp={section.maximumSeats.toLocaleString(cultures.numberCulture)}
                                withMarginTextUp
                            />
                        </Grid>
                        <Grid item>
                            <UpDownLabel
                                indicatorUp={indicatorSeatsLeft}
                                sizeTextDown="small"
                                sizeTextUp="h3"
                                textDown={resources.lblSeats}
                                textUp={section.seatsLeft.toLocaleString(cultures.numberCulture)}
                                withMarginTextUp
                            />
                            {section.seatsWaiting > 0 ? (
                                <Text
                                    align="center"
                                    size="small"
                                >
                                    {Format.toString(resources.formatSeatsWaiting, [section.seatsWaiting])}
                                </Text>
                            ) : undefined}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={section.isConEd ? 5 : 6}>
                    <Text align={detailAlignment} size="small">
                        {section.isConEd ?
                            Format.toString(resources.formatSession, [section.sessionDesc])
                            : Format.toString(resources.formatYearTermSession, [section.academicYear, section.academicTermDesc, section.sessionDesc])}
                    </Text>
                    <Text align={detailAlignment} size="small">
                        {Format.toString(resources.formatSubtypeSection, [section.eventSubType, section.section])}
                    </Text>
                    {canChangeCreditType ? (
                        <Paragraph
                            align={detailAlignment}
                            id="prgCreditTypeDetail"
                            size="small"
                            text={Format.toString(resources.formatTypeChangeCreditTypes, [
                                section.eventType,
                                creditTypeDesc || section.defaultCreditTypeDesc
                            ])}
                            events={[onClickCreditType]}
                        />
                    ) : (
                            <Text align={detailAlignment} size="small">
                                {Format.toString(resources.formatTypeCreditType, [
                                    section.eventType,
                                    creditTypeDesc || section.defaultCreditTypeDesc
                                ])}
                            </Text>
                        )}
                    <Text align={detailAlignment} size="small">
                        {Format.toString(resources.formatDuration, [section.startDate, section.endDate])}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblInstructors}
                    </Text>
                </Grid>
            </Grid>
            <div className={classes.instructorsContainer}>
                <Grid container spacing={2}>
                    {instructors}
                </Grid>
            </div>
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblSchedules}
                    </Text>
                </Grid>
            </Grid>
            <div className={classes.schedulesContainer}>
                <Grid container spacing={1}>
                    {schedules}
                </Grid>
            </div>
            <Grid container>
                <Grid item>
                    <Text size="h3">
                        {resources.lblCourse}
                    </Text>
                </Grid>
            </Grid>
            {section.description ? (
                <div className={classes.courseContainer}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <Text>
                                {resources.lblCourseDescription}
                            </Text>
                        </Grid>
                        <Grid item xs={12}>
                            <Text>
                                <div dangerouslySetInnerHTML={{ __html: section.description }} />
                            </Text>
                        </Grid>
                    </Grid>
                </div>
            ) : undefined}
            {section.courseMaterials && section.courseMaterialsUrl ? (
                <div className={classes.courseMaterialsContainer}>
                    <Grid container spacing={1}>
                        <Grid item xs={12}>
                            <TextLink id="courseMaterialsTextLink"
                                href={section.courseMaterialsUrl}
                                target="_blank">
                                {section.courseMaterials}
                            </TextLink>
                        </Grid>
                    </Grid>
                </div>
            ) : undefined}
            <Grid container spacing={isWidthUp('md', width) ? 3 : 1}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblRegistrationType}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    <Text>
                        {section.isConEd ? resources.lblContinuingEducation
                            : resources.lblTraditional}
                    </Text>
                </Grid>
            </Grid>
            <Grid container spacing={isWidthUp('md', width) ? 3 : 1}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblPrerequisits}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    {section.prerequisiteConditionList
                        && section.prerequisiteConditionList.length > 0 ? (
                            <ul className={classes.listTyle}>
                                {section.prerequisiteConditionList.map((prerequisite, i) => (
                                    <li key={`prerequisite_${i}`}>
                                        <Text>
                                            {prerequisite}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Text>
                                {resources.lblDoesNotApply}
                            </Text>
                        )}
                </Grid>
            </Grid>
            <Grid container spacing={isWidthUp('md', width) ? 3 : 1}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblCorequisites}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    {section.corequisistes
                        && section.corequisistes.length > 0 ? (
                            <ul className={classes.listTyle}>
                                {section.corequisistes.map((corequisite, i) => (
                                    <li key={`corequisite_${i}`}>
                                        <Text>
                                            {Format.toString(resources.formatCorequisite,
                                                [corequisite.eventId, corequisite.subTypeDescription])}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Text>
                                {resources.lblDoesNotApply}
                            </Text>
                        )}
                </Grid>
            </Grid>
            <Grid container spacing={isWidthUp('md', width) ? 3 : 1}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblFees}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    {section.sectionFees
                        && section.sectionFees.length > 0 ? (
                            <ul className={classes.listTyle}>
                                {section.sectionFees.map((sectionFee, i) => (
                                    <li key={`sectionFee_${i}`}>
                                        <Text>
                                            {Format.toString(resources.formatFees,
                                                [sectionFee.amount, sectionFee.chargeDescription, sectionFee.feeGroupDescription])}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Text>
                                {resources.lblDoesNotApply}
                            </Text>
                        )}
                </Grid>
            </Grid>
            <Grid container spacing={isWidthUp('md', width) ? 3 : 1}>
                <Grid item xs={12} md={3}>
                    <Text>
                        {resources.lblCreditTypes}
                    </Text>
                </Grid>
                <Grid item xs={12} md={9}>
                    {section.creditTypes
                        && section.creditTypes.length > 0 ? (
                            <ul className={classes.listTyle}>
                                {section.creditTypes.map((creditType, i) => (
                                    <li key={`creditType_${i}`}>
                                        <Text>
                                            {creditType.description}
                                        </Text>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <Text>
                                {resources.lblDoesNotApply}
                            </Text>
                        )}
                </Grid>
            </Grid>
            {section.hasBlockRelated && canAddToWaitlist && (
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <Text align="right">
                            {resources.lblAddToWaitlist}
                        </Text>
                    </Grid>
                </Grid>
            )}
        </>
    );
    // #endregion Body

    return (
        <Modal
            disableHeaderTypography
            id={id}
            header={headerModal}
            footer={footerModal}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            {bodyModal}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(SectionDetailModal));