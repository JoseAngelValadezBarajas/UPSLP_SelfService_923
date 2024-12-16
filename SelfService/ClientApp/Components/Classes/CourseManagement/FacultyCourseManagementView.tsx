/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: FacultyCourseManagementView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';

// Internal components
import CourseManagementMain from './CourseManagementMain';

// Types
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IFacultyCourseManagementResources } from '../../../Types/Resources/Classes/IFacultyCourseManagementResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IFacultyCourseManagementState {
    componentError: boolean;
    cultures: ICultures;
    resources?: IFacultyCourseManagementResources;
}
// #endregion Types

// #region Component
class FacultyCourseManagementView extends React.Component<any, IFacultyCourseManagementState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IFacultyCourseManagementState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'FacultyCourseManagement';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IFacultyCourseManagementState {
        let resources: IFacultyCourseManagementResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            cultures: LayoutStore.getCultures(),
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
        const cultures: ICultures = LayoutStore.getCultures();
        const resources: IFacultyCourseManagementResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                cultures: cultures,
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
            cultures,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            contentPage = (
                <CourseManagementMain
                    cultures={cultures}
                    isFaculty
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

const FacultyCourseManagementViewWithLayout = withLayout(FacultyCourseManagementView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<FacultyCourseManagementViewWithLayout />, document.getElementById('root'));