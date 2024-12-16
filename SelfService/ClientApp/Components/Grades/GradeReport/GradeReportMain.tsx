/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: GradeReportMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Stoplist from '../../Generic/Stoplist';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import UpDownLabel from '@hedtech/powercampus-design-system/react/core/UpDownLabel';

// Internal components
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import ActivityGradesFinalDetail from './ActivityGradesFinalDetail';
import ActivityGradesMidtermDetail, { IActivityGradesDetailResProps } from './ActivityGradesMidtermDetail';
import GradeReportDetail, { IGradeReportDetailResProps } from './GradeReportDetail';
import GradeReportOptions from './GradeReportOptions';

// Types
import { IActivityGrades } from '../../../Types/Grades/IActivityGrades';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IGradeReport } from '../../../Types/Grades/IGradeReport';
import { IGradeReportMainResources } from '../../../Types/Resources/Grades/IGradeReportMainResources';
import { IGradesPermissions } from '../../../Types/Permissions/IGradesPermissions';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Grades/GradeReport';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion

// #region Internal types
interface IGradeReportMainProps {
    advisingCourseworkClaim?: boolean;
    impersonateInfo?: IImpersonateInfo;
    isRelative?: boolean;
}

interface IGradeReportMainState {
    activityReportData?: IActivityGrades;
    componentError: boolean;
    gradesCourseworkClaim?: IGradesPermissions;
    credits?: string;
    creditType?: string;
    courseDetail?: IGradeReport;
    eventId?: string;
    eventType?: string;
    isLoading: boolean;
    isOnStopList: boolean;
    finalGrade?: string;
    midtermGrade?: string;
    periods?: IDropDownOption[];
    sectionDetail?: ISectionDetail;
    sectionId: number;
    sectionModalOpen: boolean;
    sectionName?: string;
    selectedPeriod?: string;
    selectedPeriodText?: string;
    selectedSequence?: string;
    sessionDesc: string;
    sequence?: IDropDownOption[];
    sequenceSelected: boolean;
    showMidTermGrade: boolean;
    showProjectedGrade: boolean;
    transcriptSequences?: IGradeReport[];

    resources?: IGradeReportMainRes;
}

export interface IGradeReportMainRes extends IGradeReportMainResources {
    activityGrades: IActivityGradesDetailResProps;
    gradeReport: IGradeReportDetailResProps;
    printing: IPrintResources;
    sectionDetailModal: ISectionDetailModalResProps;
}

const styles = createStyles({
    border: {
        marginRight: '5.5rem'
    }
});

type PropsWithStyles = IGradeReportMainProps & WithStyles<typeof styles>;
// #endregion

// #region component
class GradeReportMain extends React.Component<PropsWithStyles, IGradeReportMainState> {
    private idModule: string;
    private idPage: string;
    public readonly state: Readonly<IGradeReportMainState>;

    // Constructor
    public constructor(props: any) {
        super(props);

        // Init Variables
        this.idModule = 'Grades';
        this.idPage = 'GradeReportMain';
        this.state = this.getInitialState();
    }

    // Init State
    private getInitialState(): IGradeReportMainState {
        let resources: IGradeReportMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            activityReportData: undefined,
            componentError: false,
            credits: undefined,
            eventId: undefined,
            finalGrade: undefined,
            isLoading: true,
            isOnStopList: false,
            midtermGrade: undefined,
            periods: undefined,
            sectionDetail: undefined,
            sectionId: 0,
            sectionModalOpen: false,
            sectionName: undefined,
            selectedPeriod: undefined,
            selectedPeriodText: undefined,
            selectedSequence: undefined,
            sessionDesc: '',
            sequence: undefined,
            sequenceSelected: false,
            showMidTermGrade: false,
            showProjectedGrade: false,
            transcriptSequences: undefined,

            resources: resources
        };
    }

    //#region Events
    private onViewDetails = (courseDetail) => (): void => {
        try {
            LayoutActions.showPageLoader();
            this.setState({
                courseDetail: courseDetail,
                eventId: courseDetail.eventId,
                finalGrade: courseDetail.finalGrade,
                midtermGrade: courseDetail.midtermGrade,
                sectionId: courseDetail.sectionId,
                sessionDesc: courseDetail.session
            });
            Requests.postActivityGradesReport(courseDetail.sectionId, this.resolverPostActivityReport, this.props.impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDetails.name, e));
        }
    };

    private onClickGradeReport = (): void => {
        try {
            this.setState({
                activityReportData: undefined,
                sectionId: 0,
                sectionModalOpen: true
            });

        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickGradeReport.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionId: 0,
                sectionModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption, _id: string) => {
        try {
            if (optionSelected && optionSelected.value) {
                this.setState({
                    selectedPeriod: String(optionSelected.value),
                    selectedPeriodText: optionSelected.description,
                    selectedSequence: undefined,
                    sequence: undefined,
                    transcriptSequences: undefined
                });
                LayoutActions.showPageLoader();
                Requests.postReport(Number(optionSelected.value), this.resolverPostReport, this.props.impersonateInfo);
            }
            else {
                this.setState({
                    selectedPeriod: undefined,
                    selectedPeriodText: undefined,
                    selectedSequence: undefined,
                    sequence: undefined,
                    transcriptSequences: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeSequence = (optionSelected: IDropDownOption, _id: string) => {
        try {
            if (optionSelected && optionSelected.value) {
                this.setState({
                    selectedSequence: String(optionSelected.value),
                    sequenceSelected: true
                });
            }
            else {
                this.setState({
                    selectedSequence: undefined,
                    sequenceSelected: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSequence.name, e));
        }
    };

    private onDetailsSection = (id: number): void => {
        try {
            const {
                sectionId
            } = this.state;

            LayoutActions.showPageLoader();
            RequestsSection.getSection(sectionId ? sectionId : id, false, this.resolveGetSection, this.props.impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDetailsSection.name, e));
        }
    };
    //#endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };
    // #endregion Loader Functions

    // Functions for errors
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    if (impersonateInfo?.personId) {
                        Requests.getPeriod(this.resolveGetPeriods, impersonateInfo);
                    }
                    else {
                        Requests.getStopList(this.resolveGetOnStopList, this.props.impersonateInfo);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetPermissions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPermissions.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    gradesCourseworkClaim: result.data.viewDetails
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPermissions.name, e));
        }
    };

    private resolverPostActivityReport = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolverPostActivityReport.name, this.hideAllLoaders);
            if (result?.status) {
                LayoutActions.hidePageLoader();
                this.setState({
                    activityReportData: result.data,
                    sectionModalOpen: false
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolverPostActivityReport.name, e));
        }
    };

    private resolveGetOnStopList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOnStopList.name, this.hideAllLoaders);
            let onGradesStopList: boolean = false;

            if (result?.status) {
                const {
                    impersonateInfo
                } = this.props;
                if (result.data) {
                    result.data.forEach(item => {
                        if (item.isGradesStop) {
                            onGradesStopList = true;
                        }
                    });
                    if (onGradesStopList) {
                        this.setState({
                            isOnStopList: onGradesStopList
                        }, LayoutActions.hidePageLoader);
                    }
                    else {
                        Requests.getPeriod(this.resolveGetPeriods, impersonateInfo);
                    }
                }
                else {
                    Requests.getPeriod(this.resolveGetPeriods, impersonateInfo);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOnStopList.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data && result.data.length > 0) {
                    this.setState({
                        periods: result.data,
                        selectedPeriod: result.data[0].value,
                        selectedPeriodText: result.data[0].description
                    });
                    Requests.postReport(Number(result.data[0].value), this.resolverPostReport, this.props.impersonateInfo);
                }
                else {
                    this.setState({
                        isLoading: false
                    });
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolverPostReport = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolverPostReport.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                this.setState({
                    activityReportData: undefined,
                    isLoading: false,
                    selectedSequence: result.data.sequences[0].value,
                    sequence: result.data.sequences,
                    sequenceSelected: true,
                    showMidTermGrade: result.data.showMidTermGrades,
                    showProjectedGrade: result.data.showProjectedGrades,
                    transcriptSequences: result.data.transcriptSequences
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolverPostReport.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            if (json !== undefined) {
                const result: IJsonResult | undefined
                    = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);
                if (result?.status) {
                    this.setState({
                        sectionDetail: result.data,
                        sectionModalOpen: true
                    });
                }
                LayoutActions.hidePageLoader();
            }
            else {
                this.logError(LogData.badJsonResult(this.resolveGetSection.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            RequestsLayout.getPermissions(this.idModule, this.idPage,
                this.resolveGetPermissions,
                this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentDidCatch(error, info): void {
        this.setState({
            componentError: true
        }, () => {
            this.logError(LogData.fromComponentException(this.componentDidCatch.name, error, info));
            this.redirectError(500);
        });
    }
    // #endregion Lifecycle

    // Render
    public render(): JSX.Element {
        const {
            activityReportData,
            componentError,
            courseDetail,
            gradesCourseworkClaim,
            eventId,
            finalGrade,
            isLoading,
            isOnStopList,
            midtermGrade,
            periods,
            sectionDetail,
            sectionId,
            sectionModalOpen,
            selectedPeriod,
            selectedPeriodText,
            selectedSequence,
            sequence,
            sequenceSelected,
            sessionDesc,
            showMidTermGrade,
            showProjectedGrade,
            transcriptSequences,

            resources
        } = this.state;

        const {
            impersonateInfo
        } = this.props

        const {
            advisingCourseworkClaim,
            classes,
            isRelative
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let sectionDetails: JSX.Element | undefined;
        let sectionModal: JSX.Element | undefined;
        let activityGrades: JSX.Element | undefined;
        let yearPeriod: any = selectedPeriodText?.split('/');

        if (isLoading && isRelative) {
            return (
                <ContainerLoader id="ldrGradeReport" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (isOnStopList) {
                contentPage = (
                    <Stoplist
                        defaultExpandedDetails
                        showGrade={true}
                    />
                );
            }
            else if (periods) {
                let hasData: boolean = false;
                if (sequenceSelected && transcriptSequences) {
                    const transcriptSelected: IGradeReport = transcriptSequences.filter(seqNu => seqNu.sequenceNumber === selectedSequence)[0];
                    if (sectionDetail) {
                        sectionModal = (
                            <SectionDetailModal
                                open={sectionModalOpen}
                                resources={resources.sectionDetailModal}
                                section={sectionDetail}
                                onClose={this.onCloseSectionModal}
                            />
                        );
                    }

                    hasData = transcriptSelected.sessions && transcriptSelected.sessions.length > 0;

                    if (hasData) {
                        sectionDetails = (
                            <GradeReportDetail
                                advisingCourseworkClaim={advisingCourseworkClaim}
                                gradesCourseworkClaim={gradesCourseworkClaim}
                                impersonateInfo={impersonateInfo}
                                selectedPeriod={selectedPeriodText}
                                sequenceData={selectedSequence}
                                showMidTermGrade={showMidTermGrade}
                                showProjectedGrade={showProjectedGrade}
                                transcriptSequences={transcriptSelected}
                                onViewDetails={this.onViewDetails}
                                onDetailsSection={this.onDetailsSection}
                                resources={resources.gradeReport}
                            />
                        );
                    }
                    else {
                        sectionDetails = (
                            <Card>
                                <CardContent>
                                    <Illustration
                                        color="secondary"
                                        name="under-maintenance"
                                        text={resources.lblNoResults}
                                    />
                                </CardContent>
                            </Card>
                        );
                    }
                }

                contentPage = (
                    <>
                        <GradeReportOptions
                            disablePrint={!hasData}
                            impersonateInfo={impersonateInfo}
                            periods={periods}
                            printResources={resources.printing}
                            sequence={sequence}
                            selectedPeriod={selectedPeriod}
                            selectedSequence={selectedSequence}
                            onChangePeriod={this.onChangePeriod}
                            onChangeSequence={this.onChangeSequence}
                            resources={resources.gradeReport}
                        />
                        <br />
                        {sectionDetails}
                        {sectionModal}
                        {activityGrades}
                    </>
                );
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNoResults}
                            />
                        </CardContent>
                    </Card>
                );
            }

            if (activityReportData !== undefined) {
                if (activityReportData !== null) {
                    if (sectionDetail) {
                        sectionModal = (
                            <SectionDetailModal
                                open={sectionModalOpen}
                                resources={resources.sectionDetailModal}
                                section={sectionDetail}
                                onClose={this.onCloseSectionModal}
                            />
                        );
                    }
                    // #region Activity Grades
                    activityGrades = (
                        <>
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Text size="h4">
                                        {resources.lblActivityGrades}
                                        {resources.activityGrades.lblSlash}
                                        <Link
                                            id="lnkReturnGradeReport"
                                            onClick={this.onClickGradeReport}
                                        >
                                            {resources.lblGradeReport}
                                        </Link>
                                        {resources.activityGrades.lblSlash}
                                        <Text
                                            display="inline"
                                            weight="strong"
                                        >
                                            {resources.lblCoursework}
                                        </Text>
                                    </Text>
                                </Grid>
                            </Grid>
                            <br />
                            <Card>
                                <CardContent>
                                    <Grid container spacing={3}>
                                        <Grid item xs={12} sm={8} md={4} lg={8}>
                                            <Button
                                                TextProps={{
                                                    size: 'h3',
                                                    weight: 'strong'
                                                }}
                                                align="left"
                                                id={`btnSectionDetail_${sectionId}`}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={this.onDetailsSection}
                                            >
                                                {Format.toString(resources.gradeReport.formatSectionDetail,
                                                    [eventId, courseDetail?.name])}
                                            </Button>
                                            <Text
                                                color="textSecondary"
                                                size="small"
                                            >
                                                {Format.toString(resources.gradeReport.formatSectionYTS, [yearPeriod[0], yearPeriod[1], sessionDesc])}
                                            </Text>
                                            <Text
                                                color="textSecondary"
                                                size="small"
                                            >
                                                {Format.toString(resources.gradeReport.formatSectionSubType, [courseDetail?.subType, courseDetail?.section])}
                                            </Text>
                                            <Text
                                                color="textSecondary"
                                                size="small"
                                            >
                                                {Format.toString(resources.gradeReport.formatCreditType, [courseDetail?.eventTypeDesc, courseDetail?.creditTypeDesc])}
                                            </Text>
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={4} lg={2}>
                                            <UpDownLabel
                                                sizeTextDown="small"
                                                sizeTextUp="h3"
                                                textDown={resources.activityGrades.lblMidtermGrade}
                                                textUp={midtermGrade ? midtermGrade : resources.activityGrades.lblNa}
                                                withMarginTextUp
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={2} md={4} lg={2}>
                                            <Hidden smDown>
                                                <div className={classes.border}>
                                                    <UpDownLabel
                                                        sizeTextDown="small"
                                                        sizeTextUp="h3"
                                                        textDown={resources.activityGrades.lblFinalGrade}
                                                        textUp={finalGrade ? finalGrade : resources.activityGrades.lblNa}
                                                        withMarginTextUp
                                                    />
                                                </div>
                                            </Hidden>
                                            <Hidden mdUp>
                                                <UpDownLabel
                                                    sizeTextDown="small"
                                                    sizeTextUp="h3"
                                                    textDown={resources.activityGrades.lblFinalGrade}
                                                    textUp={finalGrade ? finalGrade : resources.activityGrades.lblNa}
                                                    withMarginTextUp
                                                />
                                            </Hidden>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                            <br />
                            {sectionModal}
                        </>
                    );
                    // #endregion
                    if (activityReportData.midtermAssignments) {
                        contentPage = (
                            <>
                                {activityGrades}
                                <ActivityGradesMidtermDetail
                                    faculties={activityReportData.faculties}
                                    lblYourMidtermProgress={resources.lblYourMidtermProgress}
                                    midtermDetails={activityReportData.midtermAssignments}
                                    midtermScore={activityReportData.midtermScore}
                                    resources={resources.activityGrades}
                                />
                                <br />
                                <ActivityGradesFinalDetail
                                    faculties={activityReportData.faculties}
                                    finalDetails={activityReportData.finaltermAssignments}
                                    finalScore={activityReportData.finalScore}
                                    lblYourFinalProgress={resources.lblYourFinalProgress}
                                    resources={resources.activityGrades}
                                />
                            </>
                        );
                    }
                    else {
                        contentPage = (
                            <>
                                {activityGrades}
                                <ActivityGradesFinalDetail
                                    faculties={activityReportData.faculties}
                                    finalDetails={activityReportData.finaltermAssignments}
                                    finalScore={activityReportData.finalScore}
                                    lblYourFinalProgress={resources.lblYourFinalProgress}
                                    resources={resources.activityGrades}
                                />
                            </>
                        );
                    }
                }
                else {
                    if (sectionDetail) {
                        sectionModal = (
                            <SectionDetailModal
                                open={sectionModalOpen}
                                resources={resources.sectionDetailModal}
                                section={sectionDetail}
                                onClose={this.onCloseSectionModal}
                            />
                        );
                    }
                    contentPage = (
                        <>
                            <Grid container spacing={3}>
                                <Grid item xs>
                                    <Text size="h4">
                                        {resources.lblActivityGrades}
                                        {resources.activityGrades.lblSlash}
                                        <Link
                                            id="lnkReturnGradeReport"
                                            onClick={this.onClickGradeReport}
                                        >
                                            {resources.lblGradeReport}
                                        </Link>
                                        {resources.activityGrades.lblSlash}
                                        <Text
                                            display="inline"
                                            weight="strong"
                                        >
                                            {resources.lblCoursework}
                                        </Text>
                                    </Text>
                                    <br />
                                    <Card>
                                        <CardContent>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Button
                                                        TextProps={{
                                                            size: 'h3',
                                                            weight: 'strong'
                                                        }}
                                                        align="left"
                                                        id={`btnSectionDetail_${sectionId}`}
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={this.onDetailsSection}
                                                    >
                                                        {Format.toString(resources.gradeReport.formatSectionDetail,
                                                            [courseDetail?.eventId, courseDetail?.name])}
                                                    </Button>
                                                    <Text
                                                        color="textSecondary"
                                                        size="small"
                                                    >
                                                        {Format.toString(resources.gradeReport.formatSectionYTS, [yearPeriod[0], yearPeriod[1], sessionDesc])}
                                                    </Text>
                                                    <Text
                                                        color="textSecondary"
                                                        size="small"
                                                    >
                                                        {Format.toString(resources.gradeReport.formatSectionSubType, [courseDetail?.subType, courseDetail?.section])}
                                                    </Text>
                                                    <Text
                                                        color="textSecondary"
                                                        size="small"
                                                    >
                                                        {Format.toString(resources.gradeReport.formatCreditType, [courseDetail?.eventTypeDesc, courseDetail?.creditTypeDesc])}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardContent>
                                            <Illustration
                                                color="secondary"
                                                name="under-maintenance"
                                                text={resources.lblNoActivityGrades}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            {sectionModal}
                        </>
                    );
                }
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion component

// Component
export default withStyles(styles)(GradeReportMain);