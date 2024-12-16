/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
* File: UnofficialTranscriptMain.tsx
* Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal components
import Stoplist from '../../Generic/Stoplist';
import UnofficialTranscriptInfo, { IUnofficialTranscriptInfoResProps } from './UnofficialTranscriptInfo';

// Types
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPrintResources } from '../../../Types/Resources/Generic/IPrintResources';
import { IUnofficialTranscriptMainResources } from '../../../Types/Resources/Grades/IUnofficialTranscriptMainResources';
import { IUnofficialTranscript } from '../../../Types/UnofficialTranscript/IUnofficialTranscript';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import RequestStudentRecords from '../../../Requests/Administration/StudentRecords';
import RequestUnofficialTranscript from '../../../Requests/Grades/UnofficialTranscript';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion

// #region Internal types
interface IUnofficialTranscriptMainProps {
    impersonateInfo?: IImpersonateInfo;
    inTab?: boolean
}

interface IUnofficialTranscriptMainRes extends IUnofficialTranscriptMainResources {
    printing: IPrintResources;
    unofficialTranscriptInfo: IUnofficialTranscriptInfoResProps;
}

interface IUnofficialTranscriptMainState {
    allowStudentOnStopList: boolean;
    componentError: boolean;
    isLoading: boolean;
    isOnStopList: boolean;
    resources?: IUnofficialTranscriptMainRes;
    unofficialTranscriptInformation?: IUnofficialTranscript;
}
// #endregion

// #region Component
class UnofficialTranscriptMain extends React.Component<IUnofficialTranscriptMainProps, IUnofficialTranscriptMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IUnofficialTranscriptMainState>;

    // Constructor
    public constructor(props) {
        super(props);

        // Init Variables
        this.idModule = 'Grades';
        this.idPage = 'UnofficialTranscriptMain';
        this.state = this.getInitialState();

        // Bind Resolvers
        this.resolveGetOnStopList = this.resolveGetOnStopList.bind(this);
        this.resolveGetStudentOnStopList = this.resolveGetStudentOnStopList.bind(this);
        this.resolveGetUnofficialTranscript = this.resolveGetUnofficialTranscript.bind(this);
    }

    // Init State
    private getInitialState(): IUnofficialTranscriptMainState {
        let resources: IUnofficialTranscriptMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            allowStudentOnStopList: false,
            componentError: false,
            isLoading: this.props.inTab ? true : false,
            isOnStopList: false,
            resources: resources,
            unofficialTranscriptInformation: undefined
        };
    }

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    if (impersonateInfo?.personId) {
                        RequestUnofficialTranscript.getUnofficialTranscript(this.resolveGetUnofficialTranscript, this.props.impersonateInfo);
                    }
                    else {
                        RequestStudentRecords.getSettings(this.resolveGetStudentOnStopList, this.logError);
                        RequestUnofficialTranscript.getStopList(this.resolveGetOnStopList, this.props.impersonateInfo);
                        RequestUnofficialTranscript.getUnofficialTranscript(this.resolveGetUnofficialTranscript, this.props.impersonateInfo);
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetOnStopList(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOnStopList.name, this.hideAllLoaders);
            let onStopList: boolean = false;

            if (result?.status) {
                if (result.data) {
                    result.data.forEach(function (item) {
                        if (item.isGradesStop) {
                            onStopList = true;
                        }
                    });
                    this.setState({
                        isOnStopList: onStopList
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOnStopList.name, e));
        }
    }

    private resolveGetStudentOnStopList(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStudentOnStopList.name, this.hideAllLoaders);
            if (result?.status) {
                const allowStudentOnStopList: boolean = result.data.allowStudentOnStopList;
                if (allowStudentOnStopList) {
                    this.setState({
                        allowStudentOnStopList: allowStudentOnStopList
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStudentOnStopList.name, e));
        }
    }

    private resolveGetUnofficialTranscript(json: string): void {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetUnofficialTranscript.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    unofficialTranscriptInformation: result.data
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetUnofficialTranscript.name, e));
        }
    }
    // #endregion Resolvers

    // Lifecycle
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

    // Render
    public render(): JSX.Element {
        const {
            allowStudentOnStopList,
            componentError,
            isLoading,
            isOnStopList,
            resources,
            unofficialTranscriptInformation
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emptyState: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrAttendance" height="md" />
            );
        }
        else if (!componentError && resources) {
            emptyState = (
                <Card>
                    <CardContent>
                        <Illustration
                            color="secondary"
                            name="under-maintenance"
                            text={resources.lblNoUnofficialTransAvailable}
                        />
                    </CardContent>
                </Card>
            );

            if (allowStudentOnStopList) {
                if (unofficialTranscriptInformation &&
                    unofficialTranscriptInformation.headerInformation &&
                    unofficialTranscriptInformation.headerInformation.length > 0) {
                    contentPage = (
                        <UnofficialTranscriptInfo
                            impersonateInfo={this.props.impersonateInfo}
                            printResources={resources.printing}
                            unofficialTranscript={unofficialTranscriptInformation}
                            resources={resources.unofficialTranscriptInfo}
                        />
                    );
                }
                else {
                    contentPage = emptyState
                }
            }
            else if (isOnStopList) {
                contentPage = (
                    <Stoplist
                        defaultExpandedDetails
                        showGrade={true}
                    />
                );
            }
            else if (unofficialTranscriptInformation &&
                unofficialTranscriptInformation.headerInformation &&
                unofficialTranscriptInformation.headerInformation.length > 0) {
                contentPage = (
                    <UnofficialTranscriptInfo
                        impersonateInfo={this.props.impersonateInfo}
                        printResources={resources.printing}
                        unofficialTranscript={unofficialTranscriptInformation}
                        resources={resources.unofficialTranscriptInfo}
                    />
                );
            }
            else {
                contentPage = emptyState;
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Component
export default UnofficialTranscriptMain;