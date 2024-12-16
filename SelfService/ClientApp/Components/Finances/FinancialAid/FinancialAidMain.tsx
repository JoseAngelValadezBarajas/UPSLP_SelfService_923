/* Copyright 2018 - 2021 Ellucian Company L.P. and its affiliates.
 * File: FinancialAidMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import FinancialAidAwards from '../../Finances/FinancialAid/FinancialAidAwards';
import FinancialAidDocuments from '../../Finances/FinancialAid/FinancialAidDocuments';
import FinancialAidLoans from '../../Finances/FinancialAid/FinancialAidLoans';
import FinancialAidMessages from '../../Finances/FinancialAid/FinancialAidMessages';
import FinancialAidPackaging from '../../Finances/FinancialAid/FinancialAidPackaging';
import FinancialAidPeriod from '../../Finances/FinancialAid/FinancialAidPeriod';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IFinancialAid } from '../../../Types/FinancialAid/IFinancialAid';
import { IFinancialAidMainResources } from '../../../Types/Resources/Finances/IFinancialAidMainResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Finances/FinancialAid';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';

// #endregion

// #region Internal types
interface IFinancialAidMainProps {
    awardYearToken?: string;
    isRelative?: boolean;
    personId?: number;
}

interface IFinancialAidMainState {
    componentError: boolean;
    financialAidInformation?: IFinancialAid;
    isLoading: boolean;
    periodSelected?: IDropDownOption;
    periods?: IDropDownOption[];

    resources?: IFinancialAidMainResources;
}

// #endregion

// #region Component
class FinancialAidMain extends React.Component<IFinancialAidMainProps, IFinancialAidMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFinancialAidMainState>;

    // Constructor
    public constructor(props) {
        super(props);

        // Init Variables
        this.idModule = 'Finances';
        this.idPage = 'FinancialAidMain';

        // Init State
        this.state = this.getInitialState();

        // Bind Events
        this.onChangePeriod = this.onChangePeriod.bind(this);

        // Bind Resolvers
        this.resolveGetPeriods = this.resolveGetPeriods.bind(this);
        this.resolveGetFinancialAid = this.resolveGetFinancialAid.bind(this);
    }

    // Init State
    private getInitialState(): IFinancialAidMainState {
        let resources: IFinancialAidMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            financialAidInformation: undefined,
            isLoading: true,
            periods: undefined,
            periodSelected: undefined,

            resources: resources
        };
    }

    //#region Events
    private onChangePeriod(optionSelected: IDropDownOption): void {
        try {
            const {
                periods
            } = this.state;

            const {
                awardYearToken
            } = this.props;

            if (optionSelected && periods) {
                let period: IDropDownOption | undefined;
                periods.forEach(item => {
                    if (item.value === optionSelected.value) {
                        period = item;
                        return;
                    }
                });

                if (awardYearToken) {
                    window.history.pushState(null, '', `?studentAwardYearToken=${optionSelected.description}`);
                }

                this.setState({
                    periodSelected: period
                });

                if (period) {
                    LayoutActions.showPageLoader();
                    Requests.getFinancialAidInformation(Number(optionSelected.value), this.resolveGetFinancialAid, this.logError, this.props.personId);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePeriod.name, e));
        }
    }
    //#endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        });
    };

    //#region Functions for errors
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }

    //#endregion errors

    //#region Resolvers
    private resolveGetPeriods(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data.length > 0) {
                    const {
                        awardYearToken,
                        personId
                    } = this.props;

                    const periods: IDropDownOption[] = result.data;
                    const periodSelected: IDropDownOption | undefined = awardYearToken ? periods.find(p => p.description == awardYearToken) : periods[0]
                    this.setState({
                        periods: periods,
                        periodSelected: periodSelected
                    });
                    if (periodSelected) {
                        Requests.getFinancialAidInformation(Number(periodSelected.value), this.resolveGetFinancialAid, this.logError, personId);
                    }
                    else {
                        LayoutActions.hidePageLoader();
                    }
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
    }

    private resolveGetFinancialAid(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetFinancialAid.name, this.hideAllLoaders);
            if (result?.status) {
                LayoutActions.hidePageLoader();
                this.setState({
                    financialAidInformation: result.data,
                    isLoading: false
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetFinancialAid.name, e));
        }
    }

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getFinancialAidPeriods(this.resolveGetPeriods, this.logError, this.props.personId);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };
    //#endregion Resolvers

    //#region Lifecycle
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
    //#endregion Lifecycle

    // Render
    public render(): JSX.Element {
        const {
            componentError,
            financialAidInformation,
            isLoading,
            periodSelected,
            periods,

            resources
        } = this.state;

        const {
            isRelative
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let contentDocuments: JSX.Element | undefined;
        let contentPackaging: JSX.Element | undefined;
        let contentLoans: JSX.Element | undefined;
        let contentAwards: JSX.Element | undefined;
        let contentMessages: JSX.Element | undefined;
        if (isLoading && isRelative) {
            return (
                <ContainerLoader id="ldrFinancialAid" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (periods && financialAidInformation) {
                if (financialAidInformation.documents) {
                    contentDocuments = (
                        <FinancialAidDocuments
                            FinancialAidDocumentsList={financialAidInformation.documents}
                            periodSelected={periodSelected}
                            resources={resources}
                        />
                    );
                }
                if (financialAidInformation.packaging) {
                    contentPackaging = (
                        <FinancialAidPackaging
                            displayUnmetNeed={financialAidInformation.displayUnmetNeed}
                            FinancialAidPackagingList={financialAidInformation.packaging}
                            resources={resources}
                        />
                    );
                }
                if (financialAidInformation.loans) {
                    contentLoans = (
                        <FinancialAidLoans
                            FinancialAidLoansList={financialAidInformation.loans}
                            resources={resources}
                        />
                    );
                }
                else {
                    contentLoans = (
                        <>
                            <br />
                            <Grid container>
                                <Grid item>
                                    <Text size="h3">
                                        {resources.lblLoans}
                                    </Text>
                                </Grid>
                            </Grid>
                            <MessageStyled
                                classMessage="noResults"
                                message={resources.lblNoLoansCurrently}
                            />
                        </>
                    );
                }
                if (financialAidInformation.awardTerms) {
                    contentAwards = (
                        <FinancialAidAwards
                            FinancialAidAwardsList={financialAidInformation.awardTerms}
                            resources={resources}
                        />
                    );
                }
                else {
                    contentAwards = (
                        <>
                            <br />
                            <Grid container>
                                <Grid item>
                                    <Text size="h3">
                                        {resources.lblAwardsByAcademicTerm}
                                    </Text>
                                </Grid>
                            </Grid>
                            <MessageStyled
                                classMessage="noResults"
                                message={resources.lblNoAwards}
                            />
                        </>
                    );
                }
                if (financialAidInformation.messages) {
                    contentMessages = (
                        <FinancialAidMessages
                            FinancialAidMessagesList={financialAidInformation.messages}
                            resources={resources}
                        />
                    );
                }
                else {
                    contentMessages = (
                        <>
                            <br />
                            <Grid container>
                                <Grid item>
                                    <Text size="h3">
                                        {resources.lblMessages}
                                    </Text>
                                </Grid>
                            </Grid>
                            <MessageStyled
                                classMessage="noResults"
                                message={resources.lblNoMessages}
                            />
                        </>
                    );
                }
                contentPage = (
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    <FinancialAidPeriod
                                        periods={periods}
                                        periodSelected={periodSelected}
                                        onChangePeriod={this.onChangePeriod}
                                        resources={resources}
                                    />
                                    {contentDocuments}
                                    {contentPackaging}
                                    {contentLoans}
                                    {contentAwards}
                                    {contentMessages}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
            }
            else {
                contentPage = (
                    <Grid container spacing={3}>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    <Illustration
                                        color="secondary"
                                        name="under-maintenance"
                                        text={resources.lblNoFinancialAid}
                                    />
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                );
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion

// RenderDOM: Component
export default FinancialAidMain;