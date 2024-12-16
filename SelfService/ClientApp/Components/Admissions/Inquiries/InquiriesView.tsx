/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: InquiriesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Card from '@hedtech/powercampus-design-system/react/core/Card/Card';
import CardContent from '@hedtech/powercampus-design-system/react/core/Card/CardContent';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration/Illustration';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import List, { ListItem, ListItemText } from '@hedtech/powercampus-design-system/react/core/List';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IForm } from '../../../Types/Form/IForm';
import { IInquiriesResources } from '../../../Types/Resources/Admissions/IInquiriesResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsInquiries from '../../../Requests/Admissions/Inquiries';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IInquiriesViewState {
    componentError: boolean;
    resources?: IInquiriesResources;
    inquiries: IForm[];
}
// #endregion Types

// #region Component
class InquiriesView extends React.Component<any, IInquiriesViewState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IInquiriesViewState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Admissions';
        this.idPage = 'Inquiries';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IInquiriesViewState {
        let resources: IInquiriesResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            inquiries: [],
            resources: resources
        };
    }

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetInquiries = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetInquiries.name);

            if (result?.status) {
                const inqs: IForm[] = result.data;
                this.setState({
                    inquiries: inqs
                });

                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetInquiries.name, e));
        }
    };

    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
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
        const resources: IInquiriesResources | undefined = LayoutStore.getResources();

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
    public componentDidMount(): void {
        try {
            RequestsInquiries.getInquiries(this.resolveGetInquiries, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

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
            inquiries,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;

        const elements: JSX.Element[] = inquiries.map((inq, i) => {

            const linkToForm = (): void => {
                window.location.assign(`${Constants.webUrl}/Admissions/InquiryForm/${inq.formSettingId}`);
            };

            return (
                <ListItem
                    id={`applications_${i}`}
                    key={`applications_${i}`}
                >
                    <ListItemText
                        id={`application_${i}`}
                        primary={(
                            <Button
                                TextProps={{
                                    size: 'h3'
                                }}
                                align="left"
                                id={`lnkApplication_${i}`}
                                textVariantStyling="inherit"
                                variant="text"
                                onClick={linkToForm}
                            >
                                {inq.name}
                            </Button>
                        )}
                        secondary={inq.description}
                    />
                </ListItem>
            );
        })

        if (!componentError && resources) {
            if (inquiries && inquiries.length > 0) {
                contentPage = (
                    <List id="inquiryList">
                        {elements}
                    </List>
                );
            }
            else {
                contentPage = (
                    <Grid container>
                        <Grid item xs>
                            <Card>
                                <CardContent>
                                    <Illustration
                                        name="under-maintenance"
                                        text={resources.lblNoResults}
                                    />
                                </CardContent>
                            </Card>
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
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {contentPage}
                    </Grid>
                </Grid>
            </Layout>
        );
    }
}

const InquiriesViewWithLayout = withLayout(InquiriesView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<InquiriesViewWithLayout />, document.getElementById('root'));