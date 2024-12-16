/* Copyright 2018 - 2020 Ellucian Company L.P. and its affiliates.
 * File: LogInView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';

// Internal components
import SignIn from '../../Generic/SignIn';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ILogInResources } from '../../../Types/Resources/Home/ILogInResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface ILogInState {
    isLoading: boolean;
    resources?: ILogInResources;
}
// #endregion Types

// #region Component
class LogInView extends React.Component<any, ILogInState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ILogInState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Home';
        this.idPage = 'LogIn';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ILogInState {
        let isLoading: boolean = true;
        let resources: ILogInResources | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            isLoading: isLoading,
            resources: resources
        };
    }

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
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                this.setState({
                    isLoading: false
                }, LayoutActions.hidePageLoader);
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
        const resources: ILogInResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.logError(LogData.layoutNoReady(this.onLayoutReady.name));
            this.redirectError(500);
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            isLoading,
            resources
        } = this.state;

        let contentPage: JSX.Element | JSX.Element[] | undefined;

        if (resources && !isLoading) {
            contentPage = (
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8} lg={4}>
                        <SignIn />
                    </Grid>
                </Grid>
            );
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
                withBackgroundImage
                withFooter
            >
                {contentPage}
            </Layout>
        );
    }
}

const LogInViewWithLayout = withLayout(LogInView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<LogInViewWithLayout />, document.getElementById('root'));