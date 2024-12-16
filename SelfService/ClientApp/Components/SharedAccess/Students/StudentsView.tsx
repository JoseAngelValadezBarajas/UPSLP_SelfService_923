/* Copyright 2020 -2021 Ellucian Company L.P. and its affiliates.
 * File: StudentsView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPerson } from '../../../Types/Account/IPerson';
import { IStudentsResources } from '../../../Types/Resources/SharedAccess/IStudentsResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Internal components
import StudentCard from './StudentCard';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/SharedAccess/Students';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IStudentsState {
    hasGrant: boolean;
    isLoading: boolean;
    resources?: IStudentsResources;
    sharedStudents: IPerson[];
}
// #endregion Types

// #region Component
class StudentsView extends React.Component<any, IStudentsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IStudentsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'SharedAccess';
        this.idPage = 'Students';

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IStudentsState {
        let resources: IStudentsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            hasGrant: false,
            isLoading: true,
            resources: resources,
            sharedStudents: []
        };
    }

    // #region Events
    private onViewStudentProfile(personId: number): void {
        LayoutActions.showPageLoader();
        window.location.assign(`${Constants.webUrl}/SharedAccess/StudentProfile/${personId}`);
    }
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
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

    private showError = (message?: string): void => {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
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
                Requests.getStudents(this.resolveGetStudents);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolveGetStudents = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetStudents.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sharedStudents: result.data.students,
                    hasGrant: result.data.hasSharedAccess
                }, this.hideAllLoaders);
            }
            else if (result?.code) {
                this.redirectError(result.code);
            }
            else if (result?.log) {
                this.showError();
            }
            else {
                this.logError(LogData.badJsonResult(this.resolveGetStudents.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStudents.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IStudentsResources | undefined = LayoutStore.getResources();

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
            hasGrant,
            isLoading,
            resources,
            sharedStudents
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {
            if (hasGrant) {
                if (sharedStudents && sharedStudents.length > 0) {
                    contentPage = (
                        <Card>
                            <CardContent>
                                <Grid container alignItems="center" justifyContent="center" spacing={3}>
                                    {sharedStudents.map((student, iStudent) => (
                                        <Grid item key={`studentCard${iStudent}`}>
                                            <StudentCard
                                                student={student}
                                                onViewStudentProfile={this.onViewStudentProfile}
                                            />
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                }
                else {
                    contentPage = (
                        <Card>
                            <CardContent>
                                <Illustration
                                    color="secondary"
                                    internalName="no-enrolled"
                                    text={resources.lblNoStudents}
                                />
                            </CardContent>
                        </Card>
                    );
                }
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNotAvailable}
                            />
                        </CardContent>
                    </Card>
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

const StudentsViewWithLayout = withLayout(StudentsView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<StudentsViewWithLayout />, document.getElementById('root'));