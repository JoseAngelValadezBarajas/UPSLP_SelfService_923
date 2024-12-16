/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AdviseesContent.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import { HandPaper } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { IAdviseeWarning } from '../../../Types/Advisees/IAdviseeWarning';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import { AdviseeProfileTab } from '../../../Types/Enum/AdviseeProfileTab';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Internal types
export interface IAdviseesContentProps {
    hasAttendanceClaim: boolean;
    hasGradeReportClaim: boolean;
    hasPendingSchedule: boolean;
    hasProfileClaim: boolean;
    hasScheduleClaim: boolean;
    hasScheduleRequestsClaim: boolean;
    hasStopList: boolean;
    id: number;
    isSharedAdvisee: boolean;
    personId: number;
    resources: IAdviseesContentResProps;
    showAttendanceWarning: boolean;
    showGradesWarning: boolean;
    showViolationWarning: boolean;
    listOptionSelected: number;
    warnings?: IAdviseeWarning;
    onAbortPrevRequest: () => void;
    onClickGetAdvisors: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export interface IAdviseesContentResProps {
    lblAttendance: string;
    lblGrades: string;
    lblLowAttendance: string;
    lblLowGrades: string;
    lblPending: string;
    lblSchedule: string;
    lblScheduleRequests: string;
    lblSharedWith: string;
    lblStopListAlert: string;
    lblViewProfile: string;
    lblViolation: string;
}
const styles = ((theme: Theme) => createStyles({
    alert: {
        marginBottom: Tokens.spacing30
    },
    card: {
        width: Tokens.widthFluid
    },
    iconError: {
        fill: Tokens.colorTextAlertError,
        height: Tokens.spacing50,
        marginBottom: Tokens.spacing50,
        marginTop: Tokens.spacing50,
        width: Tokens.spacing50,
        [theme.breakpoints.up('xs')]: {
            marginLeft: Tokens.spacing60,
            marginRight: Tokens.spacing40
        },
        [theme.breakpoints.down('xs')]: {
            marginLeft: Tokens.spacing30,
            marginRight: Tokens.spacing30
        }
    },
    infoMobile: {
        background: Tokens.colorCtaBlueBase,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginLeft: Tokens.spacing30,
        verticalAlign: 'middle',
        width: Tokens.spacing40
    },
    link: {
        alignItems: 'center',
        display: 'flex',
        marginRight: Tokens.spacing20,
        [theme.breakpoints.up('xs')]: {
            marginBottom: Tokens.spacing30
        },
        [theme.breakpoints.down('xs')]: {
            marginBottom: Tokens.spacing40
        }
    },
    pending: {
        marginLeft: Tokens.spacing30
    },
    statusLabel: {
        [theme.breakpoints.up('xs')]: {
            marginBottom: Tokens.spacing30
        },
        [theme.breakpoints.down('xs')]: {
            marginBottom: Tokens.spacing40
        }
    },
    stoplist: {
        alignContent: 'center',
        backgroundColor: Tokens.colorBackgroundAlertError,
        borderTop: `${Tokens.borderRadiusXSmall} solid ${Tokens.colorTextAlertError}`,
        color: Tokens.colorTextAlertError,
        display: 'inline-flex',
        left: 'auto',
        marginBottom: Tokens.spacing30,
        right: 'auto',
        top: 'auto',
        verticalAlign: 'middle',
        width: Tokens.widthFluid
    },
    stopText: {
        alignItems: 'center',
        display: 'inline-flex'
    },
    successMobile: {
        background: Tokens.colorFillAlertSuccess,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginLeft: Tokens.spacing30,
        verticalAlign: 'middle',
        width: Tokens.spacing40
    }

}));

type PropsWithStyles = IAdviseesContentProps & WithStyles<typeof styles> & WithWidth;
// #endregion Internal types

// #region Component
const AdviseesContent: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        hasAttendanceClaim,
        hasGradeReportClaim,
        hasPendingSchedule,
        hasProfileClaim,
        hasScheduleClaim,
        hasScheduleRequestsClaim,
        hasStopList,
        id,
        isSharedAdvisee,
        personId,
        resources,
        showAttendanceWarning,
        showGradesWarning,
        showViolationWarning,
        listOptionSelected,
        warnings,
        width,
        onAbortPrevRequest,
        onClickGetAdvisors
    } = props;

    const linkToScheduleTab = (): void => {
        onAbortPrevRequest();
        window.location.assign(`${Constants.webUrl}/Advising/ManageAdvisees/${listOptionSelected}/AdviseeProfile/${personId}/${AdviseeProfileTab.schedule}`);
    };

    const linkToScheduleRequestsTab = (): void => {
        onAbortPrevRequest();
        window.location.assign(
            `${Constants.webUrl}/Advising/ManageAdvisees/${listOptionSelected}/AdviseeProfile/${personId}/${AdviseeProfileTab.scheduleRequests}`);
    };

    const linkToGradesTab = (): void => {
        onAbortPrevRequest();
        window.location.assign(`${Constants.webUrl}/Advising/ManageAdvisees/${listOptionSelected}/AdviseeProfile/${personId}/${AdviseeProfileTab.grades}`);
    };

    const linkToProfileTab = (): void => {
        onAbortPrevRequest();
        LayoutActions.hidePageLoader();
        window.location.assign(`${Constants.webUrl}/Advising/ManageAdvisees/${listOptionSelected}/AdviseeProfile/${personId}/${AdviseeProfileTab.profile}`);
    };

    const linkToAttendanceTab = (): void => {
        onAbortPrevRequest();
        window.location.assign(`${Constants.webUrl}/Advising/ManageAdvisees/${listOptionSelected}/AdviseeProfile/${personId}/${AdviseeProfileTab.attendance}`);
    };

    const warningsContent: JSX.Element[] | undefined = [];
    let warningLoading: JSX.Element | undefined;
    if (showAttendanceWarning || showGradesWarning || showViolationWarning) {
        if (warnings) {
            if (warnings.hasViolationWarning) {
                warningsContent.push(
                    <div key={`stsLbl_violation_${id}`}>
                        <StatusLabel
                            className={classes.statusLabel}
                            id={`stsLbl_violation_${id}`}
                            text={resources.lblViolation}
                            type="draft"
                        />
                    </div>
                );
            }

            if (warnings.hasGradesWarning) {
                warningsContent.push(
                    <div key={`stsLbl_lowGrades_${id}`}>
                        <StatusLabel
                            className={classes.statusLabel}
                            id={`stsLbl_lowGrades_${id}`}
                            text={resources.lblLowGrades}
                            type="draft"
                        />
                    </div>
                );
            }

            if (warnings.hasAttendanceWarning) {
                warningsContent.push(
                    <div key={`stsLbl_lowAttendance_${id}`}>
                        <StatusLabel
                            className={classes.statusLabel}
                            id={`stsLbl_lowAttendance_${id}`}
                            text={resources.lblLowAttendance}
                            type="draft"
                        />
                    </div>
                );
            }
        }
        else {
            warningLoading = (
                <Icon
                    large
                    marginBottom
                    marginLeft
                    marginRight
                    marginTop
                    name="spinner"
                    spin
                />
            );
        }
    }

    return (

        <Card
            className={classes.card}
            key={`card_${id}`}
        >
            <CardContent>
                <Hidden smDown>
                    {hasStopList ? (
                        <Grid container>
                            <Grid item xs={12}>
                                <div className={classes.stoplist}>
                                    <HandPaper
                                        className={classes.iconError}
                                        viewBoxWidth={448}
                                    />
                                    <Text
                                        className={classes.stopText}
                                        color="error"
                                        id="txtStopText"
                                        size="large"
                                    >
                                        {resources.lblStopListAlert}
                                    </Text>
                                </div>
                            </Grid>
                        </Grid>
                    ) : undefined}
                    <Grid container justifyContent="space-between" alignItems="flex-start" >
                        <Grid item xs lg={hasPendingSchedule ? 8 : 7}>
                            <Grid container spacing={isWidthUp('sm', width) ? 3 : 0}>
                                {warningLoading || warningsContent.length > 0 ? (
                                    <Grid item xs={isWidthUp('xs', width) ? false : 12}>
                                        {warningLoading}
                                        {warningsContent}
                                    </Grid>
                                ) : undefined}
                                {hasProfileClaim && (hasScheduleRequestsClaim || hasScheduleClaim) ? (
                                    <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                        {hasProfileClaim && hasScheduleRequestsClaim ? (
                                            <div className={classes.link}>
                                                <Button
                                                    align="left"
                                                    id={`lnk_scheduleRequests_${id}`}
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={linkToScheduleRequestsTab}
                                                >
                                                    {resources.lblScheduleRequests}
                                                </Button>
                                                {hasPendingSchedule && (
                                                    <StatusLabel
                                                        className={classes.pending}
                                                        id={`stsLbl_Pending_${id}`}
                                                        text={resources.lblPending}
                                                        type="success"
                                                    />
                                                )}
                                            </div>
                                        ) : undefined}
                                        {hasProfileClaim && hasScheduleClaim && (
                                            <Button
                                                align="left"
                                                className={classes.link}
                                                id={`lnk_schedule_${id}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={linkToScheduleTab}
                                            >
                                                {resources.lblSchedule}
                                            </Button>
                                        )}
                                    </Grid>
                                ) : undefined}
                                {hasProfileClaim && (hasGradeReportClaim || hasAttendanceClaim) && (
                                    <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                        {hasProfileClaim && hasGradeReportClaim && (
                                            <Button
                                                align="left"
                                                className={classes.link}
                                                id={`lnk_grades_${id}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={linkToGradesTab}
                                            >
                                                {resources.lblGrades}
                                            </Button>
                                        )}
                                        {hasProfileClaim && hasAttendanceClaim && (
                                            <Button
                                                align="left"
                                                className={classes.link}
                                                id={`lnk_attendance_${id}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={linkToAttendanceTab}
                                            >
                                                {resources.lblAttendance}
                                            </Button>
                                        )}
                                    </Grid>
                                )}
                                {isSharedAdvisee && (
                                    <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                        <div className={classes.link}>
                                            <Button
                                                align="left"
                                                id={`lnk_shareWith_${id}`}
                                                data-person-id={personId}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={onClickGetAdvisors}
                                            >
                                                {resources.lblSharedWith}
                                            </Button>
                                            <span className={classes.infoMobile} />
                                        </div>
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        {hasProfileClaim ? (
                            <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                <Button
                                    color="secondary"
                                    id={`btnViewProfile_${id}`}
                                    onClick={linkToProfileTab}
                                >
                                    {resources.lblViewProfile}
                                </Button>
                            </Grid>
                        ) : undefined}
                    </Grid>
                </Hidden>
                <Hidden mdUp>
                    {hasStopList && (
                        <Grid container>
                            <Grid item xs={12}>
                                <div className={classes.stoplist}>
                                    <HandPaper
                                        className={classes.iconError}
                                        viewBoxWidth={448}
                                    />
                                    <Text
                                        className={classes.stopText}
                                        color="error"
                                        id="txtStopText"
                                        size="large"
                                    >
                                        {resources.lblStopListAlert}
                                    </Text>
                                </div>
                            </Grid>
                        </Grid>
                    )}
                    {hasProfileClaim && (hasScheduleRequestsClaim || hasScheduleClaim) && (
                        <>
                            {hasProfileClaim && hasScheduleRequestsClaim && (
                                <Grid container justifyContent="space-between" alignItems="flex-start">
                                    <Grid item>
                                        <div className={classes.link}>
                                            <Button
                                                align="left"
                                                id={`lnk_scheduleRequests_${id}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={linkToScheduleRequestsTab}
                                            >
                                                {resources.lblScheduleRequests}
                                            </Button>
                                            {hasPendingSchedule && (
                                                <span className={classes.successMobile} />
                                            )}
                                        </div>
                                    </Grid>
                                </Grid>
                            )}
                            {hasProfileClaim && hasScheduleClaim && (
                                <Grid container justifyContent="space-between" alignItems="flex-start">
                                    <Grid item>
                                        <Button
                                            align="left"
                                            className={classes.link}
                                            id={`lnk_schedule_${id}`}
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={linkToScheduleTab}
                                        >
                                            {resources.lblSchedule}
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}
                    {warningLoading || warningsContent.length > 0 && (
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                            <Grid item xs={isWidthUp('xs', width) ? false : 12}>
                                {warningLoading}
                                {warningsContent}
                            </Grid>
                        </Grid>
                    )}
                    {hasProfileClaim && (hasGradeReportClaim || hasAttendanceClaim) && (
                        <>
                            {hasProfileClaim && hasGradeReportClaim && (
                                <Grid container justifyContent="space-between" alignItems="flex-start">
                                    <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                        <Button
                                                align="left"
                                                className={classes.link}
                                                id={`lnk_grades_${id}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={linkToGradesTab}
                                            >
                                                {resources.lblGrades}
                                            </Button>
                                    </Grid>
                                </Grid>
                            )}
                            {hasProfileClaim && hasAttendanceClaim && (
                                <Grid container justifyContent="space-between" alignItems="flex-start">
                                    <Grid item>
                                        <Button
                                            align="left"
                                            className={classes.link}
                                            id={`lnk_attendance_${id}`}
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={linkToAttendanceTab}
                                        >
                                            {resources.lblAttendance}
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    )}
                    {isSharedAdvisee && (
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                            <Grid item xs={isWidthUp('sm', width) ? false : 12}>
                                <div className={classes.link}>
                                    <Button
                                        align="left"
                                        id={`lnk_shareWith_${id}`}
                                        data-person-id={personId}
                                        textVariantStyling="inherit"
                                        variant="text"
                                        onClick={onClickGetAdvisors}
                                    >
                                        {resources.lblSharedWith}
                                    </Button>
                                    <span className={classes.infoMobile} />
                                </div>
                            </Grid>
                        </Grid>
                    )}
                    {hasProfileClaim && (
                        <Grid container justifyContent="space-between" alignItems="flex-start">
                            <Grid item>
                                <Button
                                    color="secondary"
                                    id={`btnViewProfile_${id}`}
                                    onClick={linkToProfileTab}
                                >
                                    {resources.lblViewProfile}
                                </Button>
                            </Grid>
                        </Grid>
                    )}
                </Hidden>
            </CardContent>
        </Card>
    );
};
// #endregion Component

export default withStyles(styles)(withWidth()(AdviseesContent));