/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AttendanceMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal Components
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import AttendanceDetail from './AttendanceDetail';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAdvisingAttendance } from '../../../Types/Advising/IAdvisingAttendance';
import { IAdvisingAttendanceCourseDetails } from '../../../Types/Advising/IAdvisingAttendanceCourseDetails';
import { IAdvisingAttendanceDetails } from '../../../Types/Advising/IAdvisingAttendanceDetails';
import { IAttendanceResources } from '../../../Types/Resources/Classes/IAttendanceResources';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Advising/AttendanceMain';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IAttendanceMainProps {
    dailyAttendanceClaim?: boolean;
    impersonateInfo?: IImpersonateInfo;
    inAttendanceReport?: boolean;
    myPosition: number;
    sectionId: number;
    onDownloadModal: () => void;
}

interface IAttendanceRes extends IAttendanceResources {
    sectionDetailModal: ISectionDetailModalResProps;
}

interface IAttendanceMainState {
    attendanceDetails?: IAdvisingAttendanceDetails[];
    attendanceList?: IAdvisingAttendance[];
    courseDetails?: IAdvisingAttendanceCourseDetails;
    componentError: boolean;
    isAttendanceDetails: boolean;
    isLoading: boolean;
    periods?: IDropDownOption[];
    periodSelected?: number;
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
    showLowAttendanceWarning?: boolean;
    showOverallAttendance?: boolean;
    showDailyAttendance?: boolean;
    resources?: IAttendanceRes;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '25%'
            }
        },
        // Fix: v4.0 (Break-all)
        [theme.breakpoints.only('xs')]: {
            '& tbody td:before, & tbody th:before': {
                minWidth: '8rem !important',
                wordBreak: 'break-word !important'
            }
        }
    }
}));

type PropsWithStyles = IAttendanceMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class AttendanceMain extends React.Component<PropsWithStyles, IAttendanceMainState> {
    private idModule: string;
    private idPage: string;
    private courseDetails?: IAdvisingAttendanceCourseDetails;
    private year: number;
    private term: string;

    public readonly state: Readonly<IAttendanceMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Advising';
        this.idPage = 'AttendanceMain';
        this.year = -1;
        this.term = '';

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAttendanceMainState {
        let resources: IAttendanceRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            componentError: false,
            isAttendanceDetails: false,
            isLoading: this.props.inAttendanceReport ? false : true,
            sectionModalOpen: false,
            resources: resources
        };
    }

    // #region Events
    private onClickAttendance = (): void => {
        try {
            this.setState({
                isAttendanceDetails: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAttendance.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onChangePeriod = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                periods
            } = this.state;

            const {
                impersonateInfo
            } = this.props;

            if (optionSelected && periods) {
                const yearTerm: string[] = optionSelected.description.split('/');
                LayoutActions.setLoading(true);
                Requests.getAttendance(Number(optionSelected.value), this.resolveGetAttendance, impersonateInfo);
                this.setState({
                    periodSelected: Number(optionSelected.value)
                });
                this.year = Number(yearTerm[0]);
                this.term = yearTerm[1];
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onViewDetailsSection = (id: number): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            LayoutActions.setLoading(true);
            RequestsSection.getSection(id, false, this.resolveGetSection, impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDetailsSection.name, e));
        }
    };

    private onViewDailyAttendance = (id: number, hasLowAttendance: boolean,
        overallStatus: string, section: string,
        sectionCreditType: string,
        sectionEventId: string, sectionEventSubType: string,
        sectionId: number, sectionLongName: string,
        sectionType: string, session: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            this.isLoading();
            this.courseDetails = {
                hasLowAttendance,
                overallStatus,
                section,
                sectionCreditType,
                sectionEventId,
                sectionEventSubType,
                sectionId,
                sectionLongName,
                sectionType,
                session,
                term: this.term,
                year: this.year
            }
            Requests.getAttendanceDetails(id, this.resolveGetAttendanceDetails, impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDailyAttendance.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private isLoading = (): void => {
        this.setState({
            isLoading: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetAttendance = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttendance.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        attendanceList: result.data,
                        showLowAttendanceWarning: result.data[0].showLowAttendanceWarning,
                        showOverallAttendance: result.data[0].showOverallAttendance,
                        showDailyAttendance: result.data[0].showDailyAttendance
                    }, this.hideAllLoaders);
                }
                else {
                    this.setState({
                        attendanceList: undefined
                    }, this.hideAllLoaders);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttendance.name, e));
        }
    };

    private resolveGetAttendanceDetails = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAttendanceDetails.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    attendanceDetails: result.data,
                    isAttendanceDetails: true
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAttendanceDetails.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionDetail: result.data,
                    sectionModalOpen: true
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                const periods: IDropDownOption[] | undefined = result.data.periods;
                if (result.data && periods && periods.length > 0) {
                    const value: any = periods.findIndex(x => x.value === Number(result.data.currentPeriodId));
                    let yearTerm: string[];
                    if (value > 0) {
                        yearTerm = periods[value].description.split('/');
                        this.setState({
                            periods: result.data.periods,
                            periodSelected: result.data.currentPeriodId
                        });
                        Requests.getAttendance(result.data.currentPeriodId, this.resolveGetAttendance, impersonateInfo);
                    }
                    else {
                        yearTerm = periods[0].description.split('/');
                        this.setState({
                            periods: result.data.periods,
                            periodSelected: Number(periods[0].value),
                        });
                        Requests.getAttendance(Number(periods[0].value), this.resolveGetAttendance, impersonateInfo);
                    }
                    this.year = Number(yearTerm[0]);
                    this.term = yearTerm[1];
                }
                else {
                    this.hideAllLoaders();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                Store.setResources(this.props.myPosition, result.data);
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                impersonateInfo
            } = this.props;
            const {
                resources
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            Requests.getPeriods(this.resolveGetPeriods, impersonateInfo);
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

    public render(): JSX.Element {
        const {
            attendanceDetails,
            attendanceList,
            componentError,
            isAttendanceDetails,
            isLoading,
            periods,
            periodSelected,
            resources,
            sectionDetail,
            sectionModalOpen,
            showLowAttendanceWarning,
            showOverallAttendance,
            showDailyAttendance,
        } = this.state;

        const {
            classes,
            dailyAttendanceClaim,
            inAttendanceReport
        } = this.props;

        const attendancePage: JSX.Element[] = [];
        let attendancePageDetail: JSX.Element | undefined;
        let content: JSX.Element | undefined;
        let header: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        let sectionDetailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrAttendance" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (attendanceList && attendanceList.length > 0) {
                {
                    attendanceList.forEach((section, i) => {
                        header = (
                            <React.Fragment key={`sessionSection_${section.sessionDesc}_${i}`}>
                                <Grid container>
                                    <Grid item xs>
                                        <Text size="h3">
                                            <span>
                                                {section.sessionDesc}
                                            </span>
                                        </Text>
                                    </Grid>
                                </Grid>
                            </React.Fragment>
                        );

                        content = (
                            <React.Fragment key={`attendanceSection_${section.sessionDesc}_${i}`}>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id={`tblAdviseeAttendanceList_${i}`}
                                    variant="expansionPanels"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblCourse}
                                            </TableCell>
                                            {showDailyAttendance && (
                                                <>
                                                    <TableCell component="th" align="right">
                                                        {resources.lblPresent}
                                                    </TableCell>
                                                    <TableCell component="th" align="right">
                                                        {resources.lblAbsenceExcused}
                                                    </TableCell>
                                                    <TableCell component="th" align="right">
                                                        {resources.lblAbsenceUnexcused}
                                                    </TableCell>
                                                    <TableCell component="th" align="right">
                                                        {resources.lblTardinessExcused}
                                                    </TableCell>
                                                    <TableCell component="th" align="right">
                                                        {resources.lblTardinessUnexcused}
                                                    </TableCell>
                                                </>
                                            )}
                                            {showOverallAttendance && (
                                                <>
                                                    <TableCell component="th">
                                                        {resources.lblOverallAttendance}
                                                    </TableCell>
                                                    <TableCell component="th">
                                                        {resources.lblLastDateAttended}
                                                    </TableCell>
                                                </>
                                            )}
                                            {showDailyAttendance && (dailyAttendanceClaim || inAttendanceReport) && (
                                                <TableCell component="th">
                                                    {resources.lblDailyAttendance}
                                                </TableCell>
                                            )}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {section.attendanceCourses.map((attendance, j) => {
                                            const courseName: string = `${attendance.sectionEventId}: ${attendance.sectionLongName}`;

                                            const onViewSection = (): void => {
                                                this.onViewDetailsSection(attendance.sectionId);
                                            };

                                            const onViewDetails = (): void => {
                                                this.onViewDailyAttendance(attendance.transcriptDetailId,
                                                    attendance.hasLowAttendance,
                                                    attendance.overallAttendance,
                                                    attendance.section,
                                                    attendance.sectionCreditType,
                                                    attendance.sectionEventId,
                                                    attendance.sectionEventSubType,
                                                    attendance.sectionId,
                                                    attendance.sectionLongName,
                                                    attendance.sectionType,
                                                    section.sessionDesc
                                                );
                                            };

                                            return (
                                                <TableExpandableRow
                                                    key={`studentsList_${courseName}${j}`}
                                                >
                                                    <TableCell>
                                                        <Button
                                                            TextProps={{
                                                                weight: 'strong'
                                                            }}
                                                            align="left"
                                                            id={`courseName_${courseName}_${j}`}
                                                            textVariantStyling="inherit"
                                                            variant="text"
                                                            onClick={onViewSection}
                                                        >
                                                            {courseName}
                                                        </Button>
                                                        <Text color="textSecondary" size="small">
                                                            {Format.toString(resources.formatSubtypeSection, [attendance.sectionEventSubType, attendance.section])}
                                                        </Text>
                                                        <Text color="textSecondary" size="small">
                                                            {Format.toString(resources.formatTypeCreditType, [attendance.sectionType, attendance.sectionCreditType])}
                                                        </Text>
                                                        {attendance.hasLowAttendance && showLowAttendanceWarning && (
                                                            <div>
                                                                <StatusLabel
                                                                    id={`stsLowAttendanceRow_${j}`}
                                                                    text={resources.lblLowAttendance}
                                                                    type="draft"
                                                                />
                                                            </div>
                                                        )}
                                                    </TableCell>
                                                    {showDailyAttendance && (
                                                        <>
                                                            <TableCell columnName={resources.lblPresent} align="right">
                                                                <span>
                                                                    {attendance.present}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell columnName={resources.lblAbsenceExcused} align="right">
                                                                <span>
                                                                    {attendance.excusedAbsences}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell columnName={resources.lblAbsenceUnexcused} align="right">
                                                                <span>
                                                                    {attendance.unexcusedAbsences}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell columnName={resources.lblTardinessExcused} align="right">
                                                                <span>
                                                                    {attendance.excusedTardiness}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell columnName={resources.lblTardinessUnexcused} align="right">
                                                                <span>
                                                                    {attendance.unexcusedTardiness}
                                                                </span>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    {showOverallAttendance && (
                                                        <>
                                                            <TableCell columnName={resources.lblOverallAttendance}>
                                                                <span>
                                                                    {attendance.overallAttendance}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell columnName={resources.lblLastDateAttended}>
                                                                <span>
                                                                    {attendance.lastDateAttended}
                                                                </span>
                                                            </TableCell>
                                                        </>
                                                    )}
                                                    {showDailyAttendance && (
                                                        <>
                                                            {dailyAttendanceClaim || inAttendanceReport ? (
                                                                <TableCell columnName={resources.lblDailyAttendance}>
                                                                    <Button
                                                                        align="left"
                                                                        id={`viewDetails_${courseName}_${j}`}
                                                                        textVariantStyling="inherit"
                                                                        variant="text"
                                                                        onClick={onViewDetails}
                                                                    >
                                                                        {resources.lblViewDetails}
                                                                    </Button>
                                                                </TableCell>
                                                            ) : undefined}
                                                        </>
                                                    )}
                                                </TableExpandableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                                <br />
                            </React.Fragment>
                        );

                        attendancePage.push(
                            <ExpansionPanel
                                key={`advisingAttendanceExpansion_${i}`}
                                defaultExpanded
                                header={header}
                                variant="card"
                            >
                                {content}
                            </ExpansionPanel>
                        );
                    });
                }
            }

            if (isAttendanceDetails) {
                if (attendanceDetails) {
                    attendancePageDetail = (
                        <AttendanceDetail
                            attendanceDetails={attendanceDetails}
                            courseDetails={this.courseDetails}
                            showLowAttendanceWarning={showLowAttendanceWarning}
                            resources={resources}
                            onClickAttendance={this.onClickAttendance}
                            onViewDetailsSection={this.onViewDetailsSection}
                        />
                    );
                }
                else {
                    attendancePageDetail = (
                        <>
                            <Grid container>
                                <Grid item>
                                    <Paragraph
                                        id="prgBreadcrumbs"
                                        text={Format.toString(resources.formatBreadcrumbs,
                                            [resources.lblAttendance, resources.lblOverallAttendance, resources.lblDailyAttendance]
                                        )}
                                        events={[this.onClickAttendance]}
                                    />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Grid item xs>
                                    <Card>
                                        <CardContent>
                                            <Illustration
                                                color="secondary"
                                                name="under-maintenance"
                                                text={resources.lblNoAttendanceDailyDetail}
                                            />
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </>
                    );
                }
            }

            if (sectionDetail) {
                sectionDetailModal = (
                    <SectionDetailModal
                        open={sectionModalOpen}
                        resources={resources.sectionDetailModal}
                        section={sectionDetail}
                        onClose={this.onCloseSectionModal}
                    />
                );
            }

            contentPage = (
                periods && periods.length > 0 ? (
                    <>
                        {!isAttendanceDetails ? (
                            <>
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs={12} md={4}>
                                                <Dropdown
                                                    id="ddlPeriod"
                                                    label={resources.lblPeriod}
                                                    options={periods}
                                                    value={periodSelected}
                                                    onChange={this.onChangePeriod}
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                                <br />
                                {attendanceList && attendanceList.length > 0 ? attendancePage : (
                                    <Grid container>
                                        <Grid item xs>
                                            <Card>
                                                <CardContent>
                                                    <Illustration
                                                        color="secondary"
                                                        name="under-maintenance"
                                                        text={resources.lblNoAttendance}
                                                    />
                                                </CardContent>
                                            </Card>
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        ) : attendancePageDetail}
                        {sectionDetailModal}
                    </>
                ) : (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNoResults}
                            />
                        </CardContent>
                    </Card>
                )
            );
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(AttendanceMain);