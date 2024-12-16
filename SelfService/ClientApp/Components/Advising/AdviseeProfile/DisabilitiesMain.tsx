/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: DisabilitiesMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IDisabilitiesMainResources } from '../../../Types/Resources/Advising/IDisabilitiesMainResources';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPeopleDisability } from '../../../Types/Students/IPeopleDisability';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Advising/DisabilitiesMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IDisabilitiesMainProps {
    impersonateInfo: IImpersonateInfo;
}

interface IDisabilitiesMainState {
    componentError: boolean;
    disabilities?: IPeopleDisability[];
    isLoading: boolean;
    resources?: IDisabilitiesMainResources;
}
// #endregion Types

// #region Component
class DisabilitiesMain extends React.Component<IDisabilitiesMainProps, IDisabilitiesMainState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IDisabilitiesMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Advising';
        this.idPage = 'DisabilitiesMain';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDisabilitiesMainState {
        let resources: IDisabilitiesMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            disabilities: undefined,
            isLoading: true,
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

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getDisabilitiesInfo(this.props.impersonateInfo, this.resolveGetDisabilitiesInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetDisabilitiesInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDisabilitiesInfo.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    disabilities: result.data
                }, () => {
                    this.hideAllLoaders();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDisabilitiesInfo.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
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
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            componentError,
            disabilities,
            isLoading,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {
            if (disabilities && disabilities.length > 0) {
                contentPage = (
                    <Grid container>
                        <Grid item xs={12}>
                            <Card>
                                <CardContent>
                                    <Grid container>
                                        <Grid item xs>
                                            <Text size="h2">
                                                {resources.lblDisabilitiesInfo}
                                            </Text>
                                        </Grid>
                                    </Grid>
                                    <br />
                                    <Table
                                        breakpoint="sm"
                                        id="tblDisabilitiesList"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th">
                                                    <span>
                                                        {resources.lblDisability}
                                                    </span>
                                                </TableCell>
                                                <TableCell component="th">
                                                    <span>
                                                        {resources.lblSpecialRequirement}
                                                    </span>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {disabilities.map((row, i) => (
                                                <TableRow key={`disabilitiesRow_${i}`}>
                                                    <TableCell
                                                        columnName={resources.lblDisability}
                                                        scope="row"
                                                    >
                                                        <span>
                                                            {row.disabilityDesc}
                                                        </span>
                                                    </TableCell>
                                                    <TableCell
                                                        columnName={resources.lblSpecialRequirement}
                                                        scope="row"
                                                    >
                                                        <span>
                                                            {row.disableRequireDesc}
                                                        </span>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </Grid >
                    </Grid>
                );
            }
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNoResults}
                            />
                        </CardContent>
                    </Card>
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
// #endregion Component

// Export: Component
export default DisabilitiesMain;