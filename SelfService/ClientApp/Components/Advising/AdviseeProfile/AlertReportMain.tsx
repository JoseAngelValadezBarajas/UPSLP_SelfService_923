/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AlertReportMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal components
import AlertDetailModal from '../../Grades/AlertReport/AlertDetailModal';
import AlertReportDetail from '../../Grades/AlertReport/AlertReportDetail';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';

// Types
import { IAlertReport } from '../../../Types/Grades/IAlertReport';
import { IAlertReportList } from '../../../Types/Grades/IAlertReportList';
import { IAlertReportResources } from '../../../Types/Resources/Grades/IAlertReportResources';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Grades/AlertReport';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';

// #endregion Imports

// #region Internal Types
export interface IAlertsMainProps {
    impersonateInfo?: IImpersonateInfo;
}

interface IAlertReportMainState {
    alertReportList?: IAlertReport[];
    alertReportDetail: IAlertReportList;
    componentError: boolean;
    isLoading: boolean;
    openAlertDetailModal: boolean;
    periods?: IDropDownOption[];
    periodSelected?: number;
    resources?: IAlertReportResProps;

    // Generic components
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
}

interface IAlertReportResProps extends IAlertReportResources {
    sectionDetailModal: ISectionDetailModalResProps;
}

// #endregion Internal Types

// #region Component
class AlertReportMain extends React.Component<IAlertsMainProps, IAlertReportMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IAlertReportMainState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Advising';
        this.idPage = 'AlertReportMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAlertReportMainState {
        let resources: IAlertReportResProps | undefined
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            alertReportDetail: {
                sectionId: 0,
            },
            componentError: false,
            isLoading: true,
            openAlertDetailModal: false,
            resources: resources,

            // Generic components
            sectionModalOpen: false,
        };
    }

    // #region Events
    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;
            LayoutActions.showPageLoader();
            Requests.getAlertsReport(Number(optionSelected.value), this.resolveGetAlertsReport, impersonateInfo);

            this.setState({
                periodSelected: Number(optionSelected.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onCloseAlertModal = (): void => {
        try {
            this.setState({
                openAlertDetailModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAlertModal.name, e));
        }
    }

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

    private onViewAlertDetails = (index: number, id: number, violationCategoryDesc: string, date: string): void => {
        try {
            const {
                alertReportList,
                periods,
                periodSelected
            } = this.state;

            if (alertReportList && periods) {
                let alertReportDetail: IAlertReportList | undefined =
                    alertReportList[index].list.find(l => l.sectionId === id
                        && l.violationCategoryDesc === violationCategoryDesc
                        && l.violationDate === date);
                if (alertReportDetail) {
                    const period: any = periods.find(p => p.value == periodSelected);
                    alertReportDetail.period = period.description;
                    alertReportDetail.sectionId = id;
                    this.setState({
                        alertReportDetail: alertReportDetail,
                        openAlertDetailModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewAlertDetails.name, e));
        }
    }

    private onViewSectionDetails = (id: number): void => {
        try {
            LayoutActions.showPageLoader();
            RequestsSection.getSection(id, false, this.resolveGetSection, this.props.impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
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
    private resolveGetPeriods = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data && result.data.length > 0) {
                    Requests.getAlertsReport(result.data[0].value, this.resolveGetAlertsReport, impersonateInfo);
                    this.setState({
                        periods: result.data,
                        periodSelected: Number(result.data[0].value)
                    }, this.hideLoader);
                }
                else {
                    this.hideLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetAlertsReport = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAlertsReport.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                const alertReportList: IAlertReport[] = result.data;
                this.setState({
                    alertReportList: alertReportList
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAlertsReport.name, e));
        }
    };

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
                    Requests.getPeriods(this.resolveGetPeriods, impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
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
                    }, LayoutActions.hidePageLoader);
                }
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
            alertReportDetail,
            alertReportList,
            componentError,
            isLoading,
            periods,
            periodSelected,
            openAlertDetailModal,
            resources,

            //Generic component
            sectionDetail,
            sectionModalOpen
        } = this.state;


        let contentPage: JSX.Element | JSX.Element[] | undefined;
        let contentPageDetail: JSX.Element | JSX.Element[] | undefined;
        let emptyContent: JSX.Element | undefined;
        let alertDetailModal: JSX.Element | undefined;
        let sectionDetailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrAttendance" height="md" />
            );
        }
        else if (!componentError && resources) {
            emptyContent = (
                <Illustration
                    color="secondary"
                    name="under-maintenance"
                    text={resources.lblNoAlerts}
                />
            );

            if (openAlertDetailModal) {
                alertDetailModal = (
                    <AlertDetailModal
                        alertReportDetail={alertReportDetail}
                        open={openAlertDetailModal}
                        onClose={this.onCloseAlertModal}
                        onViewSectionDetails={this.onViewSectionDetails}
                        resources={resources}
                    />
                );
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

            if (alertReportList && alertReportList.length > 0) {
                contentPageDetail = (
                    <AlertReportDetail
                        alertReportDetails={alertReportList}
                        onDetailsAlert={this.onViewAlertDetails}
                        onDetailsSection={this.onViewSectionDetails}
                        resources={resources}
                    />
                );
            }
            else {
                contentPageDetail = (
                    <Card>
                        <CardContent>
                            {emptyContent}
                        </CardContent>
                    </Card>
                );
            }

            contentPage = (
                <>
                    <Card>
                        <CardContent>
                            <br />
                            {periods && periods?.length > 0 ?
                                < Grid container spacing={3}>
                                    <Grid item xs={12} md={4}>
                                        <Dropdown
                                            id="ddlAlertType"
                                            label={resources.lblPeriod}
                                            options={periods}
                                            value={periodSelected}
                                            onChange={this.onDropdownChange}
                                        />
                                    </Grid>
                                </Grid>
                                :
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        {emptyContent}
                                    </Grid>
                                </Grid>
                            }
                        </CardContent>
                    </Card>
                    <br />
                    {periods && periods?.length > 0 ?
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {contentPageDetail}
                            </Grid>
                        </Grid>
                        : undefined}
                </>
            );
        }

        return (
            <>
                {contentPage}
                {alertDetailModal}
                {sectionDetailModal}
            </>
        );
    }
}
// #endregion Component
// Export: Component
export default AlertReportMain;