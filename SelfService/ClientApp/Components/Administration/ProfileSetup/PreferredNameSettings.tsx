/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PreferredNameSettings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPreferredNameSettings } from '../../../Types/InstitutionSettings/IPreferredNameSettings';
import { IPreferredNameSettingsResources } from '../../../Types/Resources/Administration/IPreferredNameSettingsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/PreferredNameSettings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IPreferredNameSettingsProps {
    lblSuccessSave: string;
}

interface IPreferredNameSettingsState {
    componentError: boolean;
    isLoading: boolean;
    preferredNameSettings?: IPreferredNameSettings;
    resources?: IPreferredNameSettingsResources;
}

const styles = ((theme: Theme) => createStyles({
    fontSize: {
        fontSize: 'small'
    },
    marginTop: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        }
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '30%'
            }
        }
    }
}));

type PropsWithStyles = IPreferredNameSettingsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class PreferredNameSettingsView extends React.Component<PropsWithStyles, IPreferredNameSettingsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IPreferredNameSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'PreferredNameSettings';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPreferredNameSettingsState {
        let resources: IPreferredNameSettingsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = LayoutStore.getResourcesByKey(this.idPage);
        }
        return {
            componentError: false,
            isLoading: true,
            resources: resources
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                preferredNameSettings
            } = this.state;

            const checked: boolean = event.target.checked;
            let newChecked: boolean;

            if (event.target.id && preferredNameSettings) {
                switch (event.target.id) {
                    case 'chkAllowChangeGender':
                        preferredNameSettings.allowChange = checked;
                        preferredNameSettings.approvalRequired = false;
                        break;
                    case 'chkApprovalRequired':
                        preferredNameSettings.approvalRequired = checked;
                        break;
                    case 'chkPreferredName':
                        preferredNameSettings.preferredName = checked;
                        preferredNameSettings.isAllVisible = this.getAllVisibleSettingStatus(preferredNameSettings);
                        preferredNameSettings.isSomeVisible = this.getSomeVisibleSettingStatus(preferredNameSettings);
                        break;
                    case 'chkGenderIdentity':
                        preferredNameSettings.genderIdentity = checked;
                        preferredNameSettings.isAllVisible = this.getAllVisibleSettingStatus(preferredNameSettings);
                        preferredNameSettings.isSomeVisible = this.getSomeVisibleSettingStatus(preferredNameSettings);
                        break;
                    case 'chkPronoun':
                        preferredNameSettings.pronoun = checked;
                        preferredNameSettings.isAllVisible = this.getAllVisibleSettingStatus(preferredNameSettings);
                        preferredNameSettings.isSomeVisible = this.getSomeVisibleSettingStatus(preferredNameSettings);
                        break;
                    case 'chkSelectAllVisible':
                        newChecked = !(preferredNameSettings.isAllVisible || preferredNameSettings.isSomeVisible);
                        preferredNameSettings.isAllVisible = newChecked;
                        preferredNameSettings.isSomeVisible = newChecked;
                        preferredNameSettings.preferredName = newChecked;
                        preferredNameSettings.genderIdentity = newChecked;
                        preferredNameSettings.pronoun = newChecked;
                        break;
                }
                this.setState({
                    preferredNameSettings: preferredNameSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                preferredNameSettings
            } = this.state;

            if (preferredNameSettings) {
                LayoutActions.setLoading(true);
                Requests.postSaveSettings(preferredNameSettings, this.resolvePostSaveSettings, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getAllVisibleSettingStatus(settings: IPreferredNameSettings): boolean {
        return (settings.preferredName && settings.genderIdentity && settings.pronoun);
    }

    private getSomeVisibleSettingStatus(settings: IPreferredNameSettings): boolean {
        return (settings.preferredName || settings.genderIdentity || settings.pronoun);
    }
    // #endregion Functions

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
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
                LayoutStore.setResourcesByKey(this.idPage, result.data);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name, this.hideAllLoaders);

            if (result?.status) {
                const settings: IPreferredNameSettings = result.data;
                if (settings) {
                    settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                    settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                }
                this.setState({
                    preferredNameSettings: settings
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name, this.hideAllLoaders);

            if (result?.status) {
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            if (!this.state.resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            Requests.getSettings(this.resolveGetSettings, this.logError);
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
            isLoading,
            preferredNameSettings,
            resources
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (!componentError) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrPreferredNameSettings" height="md" />);
            }
            else if (resources && preferredNameSettings) {
                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblLegend}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblGenderIdentityInformation}
                                </Text>
                                <Divider
                                    noMarginBottom
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkAllowChangeGender"
                                    checked={preferredNameSettings.allowChange}
                                    label={resources.lblAllowChangeGender}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Checkbox
                                    disabled={!preferredNameSettings.allowChange}
                                    id="chkApprovalRequired"
                                    checked={!preferredNameSettings.allowChange ? false : preferredNameSettings.approvalRequired}
                                    label={resources.lblApprovalRequired}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblFormSettings}
                                </Text>
                                <Divider
                                    noMarginBottom
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblPreferredNameSettings"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblField}
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    className={classes.fontSize}
                                                    checked={preferredNameSettings.isAllVisible || preferredNameSettings.isSomeVisible}
                                                    id="chkSelectAllVisible"
                                                    indeterminate={!preferredNameSettings.isAllVisible && preferredNameSettings.isSomeVisible}
                                                    inputProps={{
                                                        'aria-labelledby': 'lblVisible'
                                                    }}
                                                    onChange={this.onCheckboxChange}
                                                />
                                                <span id="lblVisible">
                                                    {resources.lblVisible}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <Hidden mdUp>
                                            <TableRow>
                                                <TableCell columnName={resources.lblAllVisible}>
                                                    <Checkbox
                                                        checked={preferredNameSettings.isAllVisible || preferredNameSettings.isSomeVisible}
                                                        id="chkSelectAllVisible"
                                                        indeterminate={!preferredNameSettings.isAllVisible && preferredNameSettings.isSomeVisible}
                                                        inputProps={{
                                                            'aria-label': resources.lblAllVisible
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        </Hidden>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblPreferredName}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        id="chkPreferredName"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblPreferredName])
                                                        }}
                                                        checked={preferredNameSettings.preferredName}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblGenderIdentity}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        id="chkGenderIdentity"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblGenderIdentity])
                                                        }}
                                                        checked={preferredNameSettings.genderIdentity}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblPronoun}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        id="chkPronoun"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblPronoun])
                                                        }}
                                                        checked={preferredNameSettings.pronoun}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Button
                                    id="btnSaveSettings"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.lblSave}
                                </Button>
                            </Grid>
                        </Grid>
                    </>
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
export default withStyles(styles)(PreferredNameSettingsView);