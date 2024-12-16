/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ApproveGradesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import OverallGrades from '../../Classes/CourseManagement/OverallGrades';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { IApproveGradesResources } from '../../../Types/Resources/Department/IApproveGradesResources';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Department/ApproveGrades';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IApproveGradesState {
    componentError: boolean;
    isLoading: boolean;
    isLoadingSections: boolean;
    periods?: IDropDownOption[];
    periodSelected?: IDropDownOption;
    sectionId: number;
    sectionDetail?: ISectionDetail;
    sectionDetailInformation?: ISection;
    sectionModalOpen: boolean;
    resources?: IApproveGradesRes;
    sections?: IDropDownOption[];
    sectionSelected?: IDropDownOption;
}

export interface IApproveGradesRes extends IApproveGradesResources {
    sectionDetailModal: ISectionDetailModalResProps;
}
// #endregion Types

// #region Component
class ApproveGradesView extends React.Component<any, IApproveGradesState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IApproveGradesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Department';
        this.idPage = 'ApproveGrades';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IApproveGradesState {
        let resources: IApproveGradesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isLoading: true,
            isLoadingSections: false,
            sectionId: 0,
            sectionModalOpen: false,
            resources: resources
        };
    }

    // #region Events
    private onChangePeriod = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                periods
            } = this.state;

            if (periods) {
                LayoutStore.abort();
                this.setState({
                    periodSelected: optionSelected,
                    sections: undefined,
                    sectionSelected: undefined
                });
                if (optionSelected.value) {
                    this.showLoaderSections();
                    Requests.getSections(Number(optionSelected.value), this.resolveGetSections);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onChangeSection = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            if (optionSelected.value) {
                this.showLoaderSections();
                Requests.getSection(Number(optionSelected.value), this.resolveGetSectionInformation);
                this.setState({
                    sectionSelected: optionSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSection.name, e));
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

    private onDetailsSection = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            LayoutActions.showPageLoader();
            RequestsSection.getSection(Number(event.currentTarget.id), false, this.resolveGetSection);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDetailsSection.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSections: false
        });
    };

    private hideLoaderSections = (): void => {
        this.setState({
            isLoadingSections: false
        });
    };

    private showLoaderSections = (): void => {
        this.setState({
            isLoadingSections: true
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
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data
                    && result.data.periods
                    && result.data.periods.length > 0
                    && result.data.defaultPeriod) {
                    const defaultPeriod: IDropDownOption = result.data.defaultPeriod;
                    this.setState({
                        isLoading: false,
                        periods: result.data.periods,
                        periodSelected: defaultPeriod,
                        sections: undefined,
                        sectionSelected: undefined
                    }, () => LayoutActions.setLoading(false));
                    this.showLoaderSections();
                    Requests.getSections(Number(defaultPeriod.value), this.resolveGetSections);
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => LayoutActions.setLoading(false));
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sections: result.data,
                    sectionSelected: undefined
                }, this.hideLoaderSections);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };

    private resolveGetSectionInformation = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionInformation.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionDetailInformation: result.data
                }, this.hideLoaderSections);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionInformation.name, e));
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
                else {
                    this.setState({
                        sectionDetail: undefined
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

    private resolveLayoutReady = () => {
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
        const resources: IApproveGradesRes | undefined = LayoutStore.getResources();

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
            componentError,
            isLoading,
            isLoadingSections,
            periods,
            periodSelected,
            resources,
            sections,
            sectionDetail,
            sectionDetailInformation,
            sectionModalOpen,
            sectionSelected
        } = this.state;

        const resourcesLayout = LayoutStore.getResourcesLayout();
        let emptyOption: IDropDownOption;
        emptyOption = {
            description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
            value: ''
        };

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (!isLoading) {
                let contentOptions: JSX.Element | undefined;
                if (periods && periods.length > 0) {
                    contentOptions = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    id="ddlPeriod"
                                    label={resources.lblPeriod}
                                    options={periods}
                                    value={periodSelected ? periodSelected.value : undefined}
                                    onChange={this.onChangePeriod}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6} md={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlCourse"
                                    label={resources.lblCourse}
                                    loading={isLoadingSections}
                                    options={sections}
                                    value={sectionSelected ? sectionSelected.value : undefined}
                                    onChange={this.onChangeSection}
                                />
                            </Grid>
                        </Grid>
                    );
                }

                let emptyContent: JSX.Element | undefined;
                let studentsTable: JSX.Element | undefined;
                let sectionDetails: JSX.Element | undefined;
                let sectionDetailModal: JSX.Element | undefined;
                if (periodSelected && periodSelected.value
                    && sectionSelected && sectionSelected.value) {
                    if (sectionModalOpen && sectionDetail) {
                        sectionDetailModal = (
                            <SectionDetailModal
                                open={sectionModalOpen}
                                resources={resources.sectionDetailModal}
                                section={sectionDetail}
                                onClose={this.onCloseSectionModal}
                            />
                        );
                    }
                    if (sectionDetailInformation) {
                        sectionDetails = (
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item>
                                            <Button
                                                TextProps={{
                                                    weight: 'strong'
                                                }}
                                                align="left"
                                                id={sectionDetailInformation.id}
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={this.onDetailsSection}
                                            >
                                                {`${sectionDetailInformation?.eventId} - ${sectionDetailInformation?.eventName}`}
                                            </Button>
                                            <Text
                                                color="textSecondary"
                                                size="small"
                                            >
                                                {Format.toString(resources.formatSectionSubtype, [sectionDetailInformation.eventSubType, sectionDetailInformation.section])}
                                            </Text>
                                            <Text
                                                color="textSecondary"
                                                size="small"
                                            >
                                                {Format.toString(resources.formatCreditType, [sectionDetailInformation.eventType, sectionDetailInformation.defaultCreditTypeDesc])}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        );
                    }
                    studentsTable = (
                        <Card>
                            <CardContent>
                                <OverallGrades
                                    key={`approveGrades_${Number(periodSelected.value)}_${Number(sectionSelected.value)}`}
                                    myPosition={0}
                                    periodDescription={periodSelected.description}
                                    sectionDescription={sectionSelected.description}
                                    sectionId={Number(sectionSelected.value)}
                                />
                            </CardContent>
                        </Card>
                    );
                }
                else if (contentOptions) {
                    emptyContent = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    name="no-search-results"
                                    text={resources.lblNoCourse}
                                />
                            </CardContent>
                        </Card>
                    );
                }
                else {
                    contentOptions = (
                        <Illustration
                            color="secondary"
                            name="no-search-results"
                            text={resources.lblNoOptions}
                        />
                    );
                }

                contentPage = (
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    {contentOptions}
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12}>
                            {sectionDetails}<br />
                            {sectionDetailModal}
                            {studentsTable}
                            {emptyContent}
                        </Grid>
                    </Grid>
                );
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
            </Layout>
        );
    }
}

const ApproveGradesViewWithLayout = withLayout(ApproveGradesView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ApproveGradesViewWithLayout />, document.getElementById('root'));