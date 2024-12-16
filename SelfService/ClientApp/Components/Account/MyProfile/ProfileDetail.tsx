/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ProfileDetail.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Stoplist from '../../Generic/Stoplist';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IProfileMain } from '../../../Types/Account/IProfileMain';
import { IAdviseeWarning } from '../../../Types/Advisees/IAdviseeWarning';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';

// #endregion

// #region Internal types
export interface IProfileDetailProps {
    impersonateInfo: IImpersonateInfo;
    profileInformation?: IProfileMain;
    resources: IProfileDetailResProps;
    stopListshowOthers?: boolean;
    warnings?: IAdviseeWarning;
}

export interface IProfileDetailResProps {
    lblApplied: string;
    lblCampus: string;
    lblCertified: string;
    lblClassLevel: string;
    lblCollege: string;
    lblCollegeAttend: string;
    lblContactAdvisor: string;
    lblCurriculum: string;
    lblCurriculumGpa: string;
    lblDegree: string;
    lblDepartment: string;
    lblEnrolledCredits: string;
    lblExpectedGraduation: string;
    lblFullPartTime: string;
    lblGraduated: string;
    lblGraduation: string;
    lblGraduationStatus: string;
    lblHistoricalGpa: string;
    lblLowAttendance: string;
    lblLowGrades: string;
    lblMatriculated: string;
    lblMatriculationDate: string;
    lblNo: string;
    lblNonTraditional: string;
    lblNotApplied: string;
    lblOverallGpa: string;
    lblPopulation: string;
    lblPrimaryProgram: string;
    lblProgram: string;
    lblRemainingCredits: string;
    lblTermCreditLimit: string;
    lblViolation: string;
    lblYearTerm: string;
    lblYes: string;
    lblProfilePicture: string;
}

const styles = (theme: Theme) => createStyles({
    cardContainerBottom: {
        marginBottom: Tokens.spacing40
    },
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    cardContainerXBottom: {
        marginBottom: Tokens.spacing30
    },
    iconLink: {
        marginLeft: Tokens.spacing40
    },
    iconLoading: {
        margin: Tokens.spacing40
    },
    nameIconContainer: {
        alignItems: 'center',
        display: 'inline-flex'
    },
    statusLabel: {
        marginLeft: Tokens.spacing40,
        [theme.breakpoints.down('sm')]: {
            marginLeft: 0,
            marginRight: Tokens.spacing30
        }
    }
});

type PropsWithStyles = IProfileDetailProps & WithStyles<typeof styles>;
// #endregion types

// #region Component
const ProfileDetail: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        impersonateInfo,
        profileInformation,
        resources,
        stopListshowOthers,
        warnings
    } = props;

    function checkEmptyText(textValue: string): string {
        let finalText: string = '-';
        if (textValue) {
            finalText = textValue;
        }
        return finalText;
    }

    function setGraduationStatus(status: string): string {
        let finalText: string = '';
        switch (status) {
            case 'G':
                finalText = resources.lblGraduated;
                break;
            case 'C':
                finalText = resources.lblCertified;
                break;
            case 'A':
                finalText = resources.lblApplied;
                break;
            case 'N':
                finalText = resources.lblNotApplied;
                break;
        }
        return finalText;
    }

    const warningsContent: JSX.Element[] | undefined = [];
    let warningLoading: JSX.Element | undefined;
    if (warnings) {
        if (warnings.hasViolationWarning) {
            warningsContent.push(
                <StatusLabel
                    className={classes.statusLabel}
                    id="stsLbl_violation"
                    key="stsLbl_violation"
                    text={resources.lblViolation}
                    type="draft"
                />
            );
        }

        if (warnings.hasGradesWarning) {
            warningsContent.push(
                <StatusLabel
                    className={classes.statusLabel}
                    id="stsLbl_lowGrades"
                    key="stsLbl_lowGrades"
                    text={resources.lblLowGrades}
                    type="draft"
                />
            );
        }

        if (warnings.hasAttendanceWarning) {
            warningsContent.push(
                <StatusLabel
                    className={classes.statusLabel}
                    id="stsLbl_lowAttendance"
                    key="stsLbl_lowAttendance"
                    text={resources.lblLowAttendance}
                    type="draft"
                />
            );
        }
    }
    else {
        warningLoading = (
            <Icon
                large
                name="spinner"
                spin
                verticalAlign="middle"
            />
        );
    }

    let academicContent: JSX.Element | undefined;
    if (profileInformation) {
        const onClickEmail = () => {
            window.open(Format.toString(profileInformation.emailSettings.studentUrl, [profileInformation.academic.advisor.email]),
                profileInformation.emailSettings.studentUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
        };

        {profileInformation.academic ?
            academicContent = (
                <>
                    <Grid container spacing={3} className={classes.cardContainerTop}>
                        <Grid item xs={12} md={4}>
                            {profileInformation.academic ? (
                                <Grid container spacing={3}>
                                    <Grid item xs={6} md={6}>
                                        <Card id="crdEnrolledCredits">
                                            <CardContent>
                                                <UpDownLabel
                                                    sizeTextUp="h3"
                                                    sizeTextDown="small"
                                                    textDown={resources.lblEnrolledCredits}
                                                    textUp={checkEmptyText(profileInformation.enrolledCredits)}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <Card id="crdRemainingCredits">
                                            <CardContent>
                                                <UpDownLabel
                                                    sizeTextUp="h3"
                                                    sizeTextDown="small"
                                                    textDown={resources.lblRemainingCredits}
                                                    textUp={checkEmptyText(profileInformation.remainingCredits)}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid >
                                    <Grid item xs={6} md={6}>
                                        <Card id="crdOverallGpa">
                                            <CardContent>
                                                <UpDownLabel
                                                    sizeTextUp="h3"
                                                    sizeTextDown="small"
                                                    textDown={resources.lblOverallGpa}
                                                    textUp={checkEmptyText(profileInformation.overallGpa)}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} md={6}>
                                        <Card id="crdCurriculumGpa">
                                            <CardContent>
                                                <UpDownLabel
                                                    sizeTextUp="h3"
                                                    sizeTextDown="small"
                                                    textDown={resources.lblCurriculumGpa}
                                                    textUp={checkEmptyText(profileInformation.curriculumGpa)}
                                                />
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            ) : undefined}
                            <Grid container spacing={3}>
                                {profileInformation.academic &&
                                    profileInformation.academic.historicalGpa &&
                                    profileInformation.academic.historicalGpa.length > 0 ? (
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <Grid container className={classes.cardContainerXBottom}>
                                                        <Grid item xs>
                                                            <Text size="h2">
                                                                {resources.lblHistoricalGpa}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    {profileInformation.academic.historicalGpa.map((historical, i) => (
                                                        <React.Fragment key={`historical_gpa_${i}`}>
                                                            <Grid
                                                                container
                                                                spacing={3}
                                                                justifyContent="space-between"
                                                            >
                                                                <Grid item xs={6}>
                                                                    <Text weight="strong">
                                                                        {historical.yearTerm}
                                                                    </Text>
                                                                </Grid>
                                                                <Grid item xs={6}>
                                                                    <Text>
                                                                        {historical.gpa}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </React.Fragment>
                                                    ))}
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    ) : <Grid item xs={12} />}
                            </Grid>
                        </Grid>
                        <Grid item xs={12} md={8}>
                            {profileInformation.academic && profileInformation.academic.advisor &&
                                (!impersonateInfo || !impersonateInfo.personId) ? (
                                    <Grid container spacing={3}>
                                        <Grid item xs={12}>
                                            <Card>
                                                <CardContent>
                                                    <Grid container className={classes.cardContainerXBottom}>
                                                        <Grid item xs>
                                                            <Text
                                                                id="lblContactAdvisor"
                                                                size="h2">
                                                                {resources.lblContactAdvisor}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        alignItems="center"
                                                        container
                                                        spacing={0}
                                                    >
                                                        <Grid item>
                                                            {profileInformation.academic.advisor.hasPicture ? (
                                                                <Avatar
                                                                    size="xLarge"
                                                                    src={`${Constants.peoplePictureUrl}${profileInformation.academic.advisor.personId}`}
                                                                />
                                                            ) : (
                                                                    <Avatar
                                                                        size="xLarge"
                                                                        backgroundNumber={profileInformation.academic.advisor.colorFirstLetter}
                                                                    >
                                                                        {profileInformation.academic.advisor.firstLetter}
                                                                    </Avatar>
                                                                )}
                                                        </Grid>
                                                        <Grid item>
                                                            <Text size="h4">
                                                                {profileInformation.academic.advisor.fullName}
                                                            </Text>
                                                            {profileInformation.academic.advisor.email ? (
                                                                <Button
                                                                    IconProps={{
                                                                        name: 'email'
                                                                    }}
                                                                    id="btnSendEmail"
                                                                    align="left"
                                                                    textVariantStyling="inherit"
                                                                    variant="text"
                                                                    onClick={onClickEmail}
                                                                >
                                                                    {profileInformation.academic.advisor.email}
                                                                </Button>
                                                            ) : undefined}
                                                        </Grid>
                                                    </Grid>
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                ) : undefined}
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Grid
                                                container
                                                className={classes.cardContainerBottom}
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Grid item>
                                                    <div className={classes.nameIconContainer}>
                                                        <Text
                                                            size="h2"
                                                            display="inline"
                                                            id= "lblPrimaryProgram">
                                                            {resources.lblPrimaryProgram}
                                                        </Text>
                                                        {impersonateInfo?.personId &&
                                                            profileInformation.academic.graduationStatus &&
                                                            profileInformation.academic.graduationStatus === 'G' ? (
                                                                <Tooltip
                                                                    id="tltCheckGraduated"
                                                                    title="check graduated"
                                                                >
                                                                    <Icon
                                                                        className={classes.iconLink}
                                                                        large
                                                                        name="check-feedback"
                                                                        type="success"
                                                                        verticalAlign="middle"
                                                                    />
                                                                </Tooltip>
                                                            ) : undefined}
                                                    </div>
                                                </Grid>
                                                <Grid item>
                                                    {warningLoading}
                                                    {warningsContent}
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                className={classes.cardContainerBottom}
                                                alignItems="center"
                                                justifyContent="space-between"
                                            >
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblYearTerm}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {`${profileInformation.academic.year}/${profileInformation.academic.term}`}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblProgram}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.program}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblDegree}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.degree}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblCurriculum}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.curriculum}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblCollege}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.college}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblDepartment}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.department}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblClassLevel}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.classLevel}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblPopulation}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.population}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblFullPartTime}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.fullPart}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                                <Grid item xs={12} sm={12} md={6}>
                                                    <Grid container>
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblNonTraditional}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.nonTradProgram}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblCollegeAttend}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.collegeAttend}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblCampus}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.campus}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblTermCreditLimit}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.termCreditLimit}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblMatriculated}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.matriculationPeriod ?
                                                                    `${resources.lblYes} - ${profileInformation.academic.matriculationPeriod}`
                                                                    : resources.lblNo}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblMatriculationDate}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {profileInformation.academic.matriculationDate}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        {profileInformation.academic.graduationStatus === 'G' ?
                                                            (
                                                                <>
                                                                    <Grid item xs={6}>
                                                                        <Text weight="strong">
                                                                            {resources.lblGraduation}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Text>
                                                                            {`${profileInformation.academic.graduationYear}/${
                                                                                profileInformation.academic.graduationTerm}/${
                                                                                profileInformation.academic.graduationSession}`}
                                                                        </Text>
                                                                    </Grid>
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Grid item xs={6}>
                                                                        <Text weight="strong">
                                                                            {resources.lblExpectedGraduation}
                                                                        </Text>
                                                                    </Grid>
                                                                    <Grid item xs={6}>
                                                                        <Text>
                                                                            {profileInformation.academic.expectedGraduation}
                                                                        </Text>
                                                                    </Grid>
                                                                </>
                                                            )}
                                                    </Grid>
                                                    <Grid
                                                        container
                                                        spacing={3}
                                                        justifyContent="space-between"
                                                    >
                                                        <Grid item xs={6}>
                                                            <Text weight="strong">
                                                                {resources.lblGraduationStatus}
                                                            </Text>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Text>
                                                                {setGraduationStatus(profileInformation.academic.graduationStatus)}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </>
            )
        : undefined}
    }

    return (
        <>
            <Stoplist
                impersonateInfo={impersonateInfo}
                showGrade={true}
                showOthers={stopListshowOthers ? stopListshowOthers : false}
                showRegistration={true}
            />
            {academicContent}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ProfileDetail);