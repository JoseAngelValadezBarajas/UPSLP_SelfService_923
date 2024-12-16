/* Copyright 2018 - 2022 Ellucian Company L.P. and its affiliates.
 * File: ScheduleView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';

// Internal Components
import StudentSchedule from './StudentSchedule';

// Types
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IScheduleResources } from '../../../Types/Resources/Registration/IScheduleResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IScheduleState {
    componentError: boolean;
    resources?: IScheduleResources;
}
// #endregion Types

// #region Component
class ScheduleView extends React.Component<any, IScheduleState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IScheduleState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Registration';
        this.idPage = 'Schedule';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IScheduleState {
        let resources: IScheduleResources | undefined;
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
        const resources: IScheduleResources | undefined = LayoutStore.getResources();

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

    // #region Life-cycle
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
    // #endregion Life-cycle

    public render(): JSX.Element {
        const {
            componentError,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            contentPage = (
                <StudentSchedule
                    isStudentView
                    lblSuccessSave={resources.lblSuccessSave}
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
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        {contentPage}
                    </Grid>
                </Grid>
            </Layout>
        );
    }
}

const ScheduleViewWithLayout = withLayout(ScheduleView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ScheduleViewWithLayout />, document.getElementById('root'));