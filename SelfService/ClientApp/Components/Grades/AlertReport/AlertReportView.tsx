/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AlertReportView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
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
import { IAlertReportResources  } from '../../../Types/Resources/Grades/IAlertReportResources';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Grades/AlertReport';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// #endregion Imports

// #region Internal Types
interface IAlertReportState {
    alertReportList?: IAlertReport[];
    alertReportDetail: IAlertReportList;
    componentError: boolean;
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
class AlertReportView extends React.Component<any, IAlertReportState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IAlertReportState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Grades';
        this.idPage = 'AlertReport';
        this.state = this.getInitialState();
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAlertReportState {
        let resources: IAlertReportResProps | undefined
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            alertReportDetail: {
                sectionId: 0,
            },
            componentError: false,
            openAlertDetailModal: false,
            resources: resources,

            // Generic components
            sectionModalOpen: false,
        };
    }

    // #region Events
    private onDropdownChange = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            LayoutActions.showPageLoader();
            Requests.getAlertsReport(Number(optionSelected.value), this.resolveGetAlertsReport);

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
            RequestsSection.getSection(id, false, this.resolveGetSection, this.props.personId);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
        }
    };
    // #endregion Events

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    // #endregion Error Functions

    // #region Resolvers
    private resolveGetPeriods = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name);
            if (result?.status) {
                if (result.data && result.data.length > 0) {
                    Requests.getAlertsReport(result.data[0].value, this.resolveGetAlertsReport);
                    this.setState({
                        periods: result.data,
                        periodSelected: Number(result.data[0].value)
                    }, LayoutActions.hidePageLoader);
                }
                else {
                    LayoutActions.setLoading(false);
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
                = Resolver(json, this.resolveGetAlertsReport.name);
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

    private resolveGetSection = (json: string): void => {
        try {
            if (json !== undefined) {
                const result: IJsonResult | undefined
                    = Resolver(json, this.resolveGetSection.name);
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

    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                Requests.getPeriods(this.resolveGetPeriods);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IAlertReportResProps | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
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
        if (!componentError && resources) {
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
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
                {alertDetailModal}
                {sectionDetailModal}
            </Layout>
        );
    }
}

const AlertReportViewWithLayout = withLayout(AlertReportView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<AlertReportViewWithLayout />, document.getElementById('root'));