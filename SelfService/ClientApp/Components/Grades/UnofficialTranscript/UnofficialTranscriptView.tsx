/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: UnofficialTranscriptView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal Components
import UnofficialTranscriptMain from './UnofficialTranscriptMain';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IUnofficialTranscriptResources } from '../../../Types/Resources/Grades/IUnofficialTranscriptResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IUnofficialTranscriptState {
    componentError: boolean;
    resources?: IUnofficialTranscriptResources;
}
// #endregion Types

// #region Component
class UnofficialTranscriptView extends React.Component<any, IUnofficialTranscriptState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IUnofficialTranscriptState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Grades';
        this.idPage = 'UnofficialTranscript';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IUnofficialTranscriptState {
        let resources: IUnofficialTranscriptResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
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
        const resources: IUnofficialTranscriptResources | undefined = LayoutStore.getResources();

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
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            contentPage = (
                <UnofficialTranscriptMain
                />
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
            </Layout>
        );
    }
}

const UnofficialTranscriptViewWithLayout = withLayout(UnofficialTranscriptView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<UnofficialTranscriptViewWithLayout />, document.getElementById('root'));