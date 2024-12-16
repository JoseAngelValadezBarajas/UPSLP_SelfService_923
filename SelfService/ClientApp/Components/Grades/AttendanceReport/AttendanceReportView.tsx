/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AttendanceReportView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Types
import { IAttendanceReportResources } from '../../../Types/Resources/Grades/IAttendanceReportResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import AttendanceMain from '../../Advising/AdviseeProfile/AttendanceMain';
// #endregion Imports

// #region Types
interface IAttendanceReportState {
    isLoading: boolean;
    resources?: IAttendanceReportResources;
}
// #endregion Types

// #region Component
class AttendanceReportView extends React.Component<any, IAttendanceReportState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IAttendanceReportState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Grades';
        this.idPage = 'AttendanceReport';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IAttendanceReportState {
        let resources: IAttendanceReportResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            isLoading: true,
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
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    };
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
                });
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
        const resources: IAttendanceReportResources | undefined = LayoutStore.getResources();

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

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {
            contentPage = (
                <AttendanceMain
                    inAttendanceReport
                    key="AttendanceMain"
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

const AttendanceReportViewWithLayout = withLayout(AttendanceReportView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<AttendanceReportViewWithLayout />, document.getElementById('root'));