/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: Form1098TView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import AgreementForm1098TModal, { IAgreementForm1098TModalResProps } from './AgreementForm1098TModal';
import TaxYears1098T, { ITaxYears1098TResProps } from './TaxYears1098T';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAgreementDetail } from '../../../Types/Agreements/IAgreementDetail';
import { IForm1098TResources } from '../../../Types/Resources/Finances/IForm1098TResources';
import { ITaxYearSetting } from '../../../Types/TaxYearSetting/ITaxYearSetting';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Finances/Form1098T';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IForm1098TRes extends IForm1098TResources {
    agreementForm1098TModal: IAgreementForm1098TModalResProps;
    taxYears1098T: ITaxYears1098TResProps;
}

interface IForm1098TState {
    agreement?: IAgreementDetail;
    agreementModal: boolean;
    agreementResponse: boolean;
    agreementResponseOriginal: boolean;
    isLoading: boolean;
    taxYears?: ITaxYearSetting[];
    componentError: boolean;
    peopleAgreementId: number;
    resources?: IForm1098TRes;
}
// #endregion Types

// #region Component
class Form1098TView extends React.Component<any, IForm1098TState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IForm1098TState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Finances';
        this.idPage = 'Form1098T';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IForm1098TState {
        let isLoading: boolean = true;
        let resources: IForm1098TRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            agreementModal: false,
            agreementResponse: false,
            agreementResponseOriginal: false,
            componentError: false,
            isLoading: isLoading,
            peopleAgreementId: 0,
            resources: resources
        };
    }

    // #region Events
    private onChangeAgreementResponse = (): void => {
        try {
            const {
                agreementResponse
            } = this.state;

            this.setState({
                agreementResponse: !agreementResponse
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeAgreementResponse.name, e));
        }
    };

    private onCloseAgreementModal = (): void => {
        try {
            this.setState({
                agreementModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAgreementModal.name, e));
        }
    };

    private onOpenAgreementModal = (): void => {
        try {
            const {
                agreementResponseOriginal
            } = this.state;

            this.setState({
                agreementModal: true,
                agreementResponse: agreementResponseOriginal
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenAgreementModal.name, e));
        }
    };

    private onSaveAgreement = (): void => {
        try {
            const {
                agreement,
                agreementResponse,
                peopleAgreementId
            } = this.state;

            if (agreement) {
                this.setState({
                    agreementModal: false
                });
                LayoutActions.setLoading(true);
                Requests.postSaveAgreement(peopleAgreementId, agreement.id, agreementResponse, this.resolvePostSaveAgreement, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAgreement.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                Requests.getAgreement(this.resolveGetAgreement, this.logError);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetAgreement = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAgreement.name, this.hideAllLoaders);
            if (result?.status) {
                const agreementDetail: IAgreementDetail = result.data.agreement;
                this.setState({
                    agreement: agreementDetail,
                    agreementResponse: result.data.isAccepted,
                    agreementResponseOriginal: result.data.isAccepted,
                    peopleAgreementId: result.data.peopleAgreementId
                });
                if (agreementDetail) {
                    Requests.getTaxYears(this.resolveGetTaxYears, this.logError);
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => {
                        LayoutActions.setLoading(false);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAgreement.name, e));
        }
    };

    private resolveGetTaxYears = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTaxYears.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    isLoading: false,
                    taxYears: result.data
                }, () => {
                    LayoutActions.setLoading(false);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTaxYears.name, e));
        }
    };

    private resolvePostSaveAgreement = (json: string): void => {
        try {
            const {
                agreementResponse,
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAgreement.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data.result) {
                    this.setState({
                        agreementResponseOriginal: agreementResponse,
                        peopleAgreementId: result.data.id
                    });
                    LayoutActions.setLoading(true);
                    if (resources) {
                        if (agreementResponse) {
                            LayoutActions.setAlert({ message: resources.lblAcceptedMessage, messageType: ResultType.success } as IAlert);
                        }
                        else {
                            LayoutActions.setAlert({ message: resources.lblNotAcceptedMessage, messageType: ResultType.success } as IAlert);
                        }
                    }
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAgreement.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IForm1098TRes | undefined = LayoutStore.getResources();

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
            agreement,
            agreementModal,
            agreementResponse,
            agreementResponseOriginal,
            componentError,
            isLoading,
            resources,
            taxYears
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (!isLoading) {
                if (agreement) {
                    contentPage = (
                        <>
                            <Card>
                                <CardContent>
                                    <Grid container alignItems="center">
                                        <Grid item>
                                            <Text size="h2">
                                                {resources.lblConsentTitle}
                                            </Text>
                                        </Grid>
                                        <Grid item>
                                            <StatusLabel
                                                id="lblStatus"
                                                text={agreementResponseOriginal ? resources.lblAccepted : resources.lblNotAccepted}
                                                type={agreementResponseOriginal ? 'success' : 'default'}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs>
                                            <Divider noMarginTop />
                                            <Text
                                                paragraph
                                                size="h4"
                                            >
                                                {resources.lblMainMessage}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <Grid container>
                                        <Grid item xs>
                                            <Button
                                                align="left"
                                                id="btnReadConsent"
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={this.onOpenAgreementModal}
                                            >
                                                {agreementResponseOriginal ? resources.btnReviewTerms : resources.btnReviewAndAccept}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                    {agreementResponseOriginal && (
                                        <>
                                            <Grid container>
                                                <Grid item xs>
                                                    <Text size="h2">
                                                        {resources.lblTaxYearsTitle}
                                                    </Text>
                                                    <Divider noMarginBottom />
                                                </Grid>
                                            </Grid>
                                            <TaxYears1098T
                                                resources={resources.taxYears1098T}
                                                taxYears={taxYears}
                                            />
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                            {agreementModal && (
                                <AgreementForm1098TModal
                                    agreement={agreement}
                                    agreementResponse={agreementResponse}
                                    resources={resources.agreementForm1098TModal}
                                    onChangeResponse={this.onChangeAgreementResponse}
                                    onClose={this.onCloseAgreementModal}
                                    onSave={this.onSaveAgreement}
                                />
                            )}
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
                                    text={resources.lblNoAgreement}
                                />
                            </CardContent>
                        </Card>
                    );
                }
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

const Form1098TViewWithLayout = withLayout(Form1098TView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<Form1098TViewWithLayout />, document.getElementById('root'));