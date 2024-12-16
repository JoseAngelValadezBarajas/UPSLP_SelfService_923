/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SystemInformation.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISystemInformationResources } from '../../../Types/Resources/Administration/ISystemInformationResources';
import { ISystemInformation } from '../../../Types/SystemInformation/ISystemInformation';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import VersionInfo from '@hedtech/powercampus-design-system/helpers/VersionInfo';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/SystemInformation';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
interface ISystemInformationState {
    componentError: boolean;
    resources?: ISystemInformationResources;
    systemInformation?: ISystemInformation;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(2)': {
                width: '80%'
            }
        }
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SystemInformation extends React.Component<PropsWithStyles, ISystemInformationState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ISystemInformationState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'SystemInformation';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ISystemInformationState {
        let resources: ISystemInformationResources | undefined;
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
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSystemInformation = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSystemInformation.name);

            if (result?.status) {
                this.setState({
                    systemInformation: result.data
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSystemInformation.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);

            Requests.getSystemInformation(this.resolveGetSystemInformation, this.logError);
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
            classes
        } = this.props;

        const {
            componentError,
            resources,
            systemInformation
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && systemInformation) {
            contentPage = (
                <Grid container>
                    <Grid item xs={12}>
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblLegend}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblDatabaseSettings}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblDatabaseInfo"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblDatabase}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblConnection}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell columnName={resources.lblDatabase}>
                                                <span>
                                                    {resources.lblPowerCampus}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblConnection}>
                                                <span>
                                                    {systemInformation.connectionPowerCampus}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblProviderSettings}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblMembershipInfo"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblMemberShip}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblConnection}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell columnName={resources.lblDatabase}>
                                                <span>
                                                    {resources.lblPowerCampusAuth}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblConnection}>
                                                <span>
                                                    {systemInformation.connectionPowerCampusAuth}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid item xs={12}>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblRolesInfo"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblRoles}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblConnection}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell columnName={resources.lblDatabase}>
                                                <span>
                                                    {resources.lblPowerCampusAuth}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblConnection}>
                                                <span>
                                                    {systemInformation.connectionPowerCampusAuth}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                            <Grid item xs={12}>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblProfileInfo"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblProfile}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblConnection}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell columnName={resources.lblDatabase}>
                                                <span>
                                                    {resources.lblPowerCampusAuth}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblConnection}>
                                                <span>
                                                    {systemInformation.connectionPowerCampusAuth}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={12}>
                        <Grid container spacing={1}>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblVersionInformation}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblVersionsInfo"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblProduct}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblVersion}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblSelfService}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.selfServiceVersion}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblDsIcons}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.euiDsIcons}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblEpds}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.epds}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblMaterialUI}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.materialUiCore}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblPowerCampusDesignSystem}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.designSystem}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblUrlParams}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.urlParams}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblClassnames}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.classNames}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblCoreJs}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.coreJs}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblFlux}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.flux}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblICalGenerator}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.iCalGenerator}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblLodash}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.lodash}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblMoment}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.moment}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblQueryString}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.queryString}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblReact}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.react}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblDnd}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.reactBeautifulDnd}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblReactdom}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.reactDom}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblReactGoogleRecaptcha}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {VersionInfo.reactGoogleRecaptcha}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblReactMedia}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.reactMedia}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell columnName={resources.lblProduct}>
                                                <span>
                                                    {resources.lblTypeScript}
                                                </span>
                                            </TableCell>
                                            <TableCell columnName={resources.lblVersion}>
                                                <span>
                                                    {systemInformation.typescript}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            );
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
export default withStyles(styles)(SystemInformation);