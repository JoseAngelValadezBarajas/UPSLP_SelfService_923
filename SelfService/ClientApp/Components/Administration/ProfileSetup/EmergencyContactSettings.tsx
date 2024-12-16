/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: EmergencyContactSettings.tsx
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
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { EmergencyContactSettingStatus, IEmergencyContactSettings } from '../../../Types/InstitutionSettings/IEmergencyContactSettings';
import { IEmergencyContactSettingsResources } from '../../../Types/Resources/Administration/IEmergencyContactSettingsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/EmergencyContactSettings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IEmergencyContactSettingsState {
    anchorEl: any;
    componentError: boolean;
    isLoading: boolean;
    openPrimaryInfo: boolean;
    openSecondaryInfo: boolean;
    resources?: IEmergencyContactSettingsResources;
    settings?: IEmergencyContactSettings;
}

const styles = ((theme: Theme) => createStyles({
    fontSize: {
        fontSize: 'small'
    },
    marginFormSettings: {
        marginTop: Tokens.spacing40
    },
    marginLeft: {
        [theme.breakpoints.down('md')]: {
            marginTop: `-${Tokens.spacing30}`
        },
        marginLeft: Tokens.sizingXSmall
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
    },
    popperText: {
        maxWidth: '15rem'
    }
}));

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class EmergencyContactSettings extends React.Component<PropsWithStyles, IEmergencyContactSettingsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IEmergencyContactSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'EmergencyContactSettings';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IEmergencyContactSettingsState {
        let resources: IEmergencyContactSettingsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = LayoutStore.getResourcesByKey(this.idPage);
        }
        return {
            anchorEl: null,
            componentError: false,
            isLoading: true,
            openPrimaryInfo: false,
            openSecondaryInfo: false,
            resources: resources
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                settings
            } = this.state;

            const checked: boolean = event.target.checked;
            let newChecked: boolean;

            if (event.target.id && settings) {
                switch (event.target.id) {
                    case 'chkAllowEdit':
                        settings.allowEdit = checked;
                        break;
                    case 'chkPrimaryRequired':
                        settings.primaryRequired = checked;
                        break;
                    case 'chkSecondaryRequired':
                        settings.secondaryRequired = checked;
                        break;
                    case 'chkAllVisible':
                        newChecked = !(settings.isAllVisible || settings.isSomeVisible);
                        settings.isAllVisible = newChecked;
                        settings.isSomeVisible = newChecked;
                        settings.country = this.getVisibleSettingStatus(newChecked, settings.country);
                        settings.email = this.getVisibleSettingStatus(newChecked, settings.email);
                        settings.notes = this.getVisibleSettingStatus(newChecked, settings.notes);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkAllRequired':
                        newChecked = !(settings.isAllRequired || settings.isSomeRequired);
                        settings.isAllRequired = newChecked;
                        settings.isSomeRequired = newChecked;
                        settings.country = this.getRequiredSettingStatus(newChecked, settings.country);
                        settings.email = this.getRequiredSettingStatus(newChecked, settings.email);
                        settings.notes = this.getRequiredSettingStatus(newChecked, settings.notes);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        break;
                    case 'chkCountryVisible':
                        settings.country = this.getVisibleSettingStatus(checked, settings.country);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkCountryRequired':
                        settings.country = this.getRequiredSettingStatus(checked, settings.country);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkEmailVisible':
                        settings.email = this.getVisibleSettingStatus(checked, settings.email);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkEmailRequired':
                        settings.email = this.getRequiredSettingStatus(checked, settings.email);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkNotesVisible':
                        settings.notes = this.getVisibleSettingStatus(checked, settings.notes);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                    case 'chkNotesRequired':
                        settings.notes = this.getRequiredSettingStatus(checked, settings.notes);
                        settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                        settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                        settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                        settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                        break;
                }
                this.setState({
                    settings: settings
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
                settings
            } = this.state;

            if (settings) {
                LayoutActions.setLoading(true);
                Requests.postSaveSettings(settings, this.resolvePostSaveSettings, this.logError);
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            const targetId: string = event.currentTarget.id;
            let openPrimaryInfo: boolean = false;
            let openSecondaryInfo: boolean = false;

            switch (targetId) {
                case "btnPrimaryRequiredInfo":
                    openPrimaryInfo = true;
                    break;
                case "btnSecondaryRequiredInfo":
                    openSecondaryInfo = true;
                    break;
            }

            this.setState({
                anchorEl: event.currentTarget,
                openPrimaryInfo: openPrimaryInfo,
                openSecondaryInfo: openSecondaryInfo
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openPrimaryInfo: false,
                openSecondaryInfo: false,
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getAllRequiredSettingStatus(settings: IEmergencyContactSettings): boolean {
        return Boolean(settings.country === EmergencyContactSettingStatus.Required
            && settings.email === EmergencyContactSettingStatus.Required
            && settings.notes === EmergencyContactSettingStatus.Required);
    }

    private getSomeRequiredSettingStatus(settings: IEmergencyContactSettings): boolean {
        return Boolean(settings.country === EmergencyContactSettingStatus.Required
            || settings.email === EmergencyContactSettingStatus.Required
            || settings.notes === EmergencyContactSettingStatus.Required);
    }

    private getRequiredSettingStatus(checked: boolean, currentStatus: EmergencyContactSettingStatus): EmergencyContactSettingStatus {
        if (checked) {
            return EmergencyContactSettingStatus.Required;
        }
        else {
            if (currentStatus === EmergencyContactSettingStatus.Required) {
                return EmergencyContactSettingStatus.Visible;
            }
            else {
                return currentStatus;
            }
        }
    }

    private getAllVisibleSettingStatus(settings: IEmergencyContactSettings): boolean {
        return Boolean((settings.country === EmergencyContactSettingStatus.Required
            || settings.country === EmergencyContactSettingStatus.Visible)
            && (settings.email === EmergencyContactSettingStatus.Required
                || settings.email === EmergencyContactSettingStatus.Visible)
            && (settings.notes === EmergencyContactSettingStatus.Required
                || settings.notes === EmergencyContactSettingStatus.Visible));
    }

    private getSomeVisibleSettingStatus(settings: IEmergencyContactSettings): boolean {
        return Boolean((settings.country === EmergencyContactSettingStatus.Required
            || settings.country === EmergencyContactSettingStatus.Visible)
            || (settings.email === EmergencyContactSettingStatus.Required
                || settings.email === EmergencyContactSettingStatus.Visible)
            || (settings.notes === EmergencyContactSettingStatus.Required
                || settings.notes === EmergencyContactSettingStatus.Visible));
    }

    private getVisibleSettingStatus(checked: boolean, currentStatus: EmergencyContactSettingStatus): EmergencyContactSettingStatus {
        if (checked) {
            if (currentStatus !== EmergencyContactSettingStatus.Required) {
                return EmergencyContactSettingStatus.Visible;
            }
            else {
                return currentStatus;
            }
        }
        else {
            return EmergencyContactSettingStatus.None;
        }
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
                const settings: IEmergencyContactSettings = result.data;
                if (settings) {
                    settings.isAllVisible = this.getAllVisibleSettingStatus(settings);
                    settings.isAllRequired = this.getAllRequiredSettingStatus(settings);
                    settings.isSomeVisible = this.getSomeVisibleSettingStatus(settings);
                    settings.isSomeRequired = this.getSomeRequiredSettingStatus(settings);
                }
                this.setState({
                    settings: settings
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
            classes
        } = this.props;

        const {
            anchorEl,
            componentError,
            isLoading,
            openPrimaryInfo,
            openSecondaryInfo,
            settings,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrEmergencyContactSettings" height="md" />);
            }
            else if (resources && settings) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblLegend}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblGeneral}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item>
                                <Checkbox
                                    id="chkAllowEdit"
                                    checked={settings.allowEdit}
                                    label={resources.lblAllowEdit}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            spacing={0}
                            wrap="nowrap"
                        >
                            <Grid item>
                                <Checkbox
                                    id="chkPrimaryRequired"
                                    checked={settings.primaryRequired}
                                    label={resources.lblPrimaryRequired}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    id="tltPrimaryRequiredInfo"
                                    placement="top"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblPrimaryRequiredLegend}
                                        color="gray"
                                        id="btnPrimaryRequiredInfo"
                                        onClick={this.onOpenPopper}
                                    >
                                        <Icon
                                            name="info"
                                            type={ResultType.info}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Popper
                                    arrow
                                    id="popPrimaryRequiredInfo"
                                    open={openPrimaryInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblPrimaryRequiredLegend}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                />
                            </Grid>
                        </Grid>
                        <Grid
                            container
                            alignItems="center"
                            spacing={0}
                            wrap="nowrap"
                        >
                            <Grid item>
                                <Checkbox
                                    id="chkSecondaryRequired"
                                    checked={settings.secondaryRequired}
                                    label={resources.lblSecondaryRequired}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    id="tltSecondaryRequiredInfo"
                                    placement="top"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblSecondaryRequiredLegend}
                                        color="gray"
                                        id="btnSecondaryRequiredInfo"
                                        onClick={this.onOpenPopper}
                                    >
                                        <Icon
                                            name="info"
                                            type={ResultType.info}
                                        />
                                    </IconButton>
                                </Tooltip>
                                <Popper
                                    arrow
                                    id="popSecondaryRequiredInfo"
                                    open={openSecondaryInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblSecondaryRequiredLegend}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Text className={classes.marginFormSettings} size="h3">
                                    {resources.lblFormSettings}
                                </Text>
                                <Divider />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblEmergencyContactSettings"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblField}
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    className={classes.fontSize}
                                                    checked={settings.isAllVisible || settings.isSomeVisible}
                                                    id="chkAllVisible"
                                                    indeterminate={!settings.isAllVisible && settings.isSomeVisible}
                                                    inputProps={{
                                                        'aria-labelledby': 'lblVisible'
                                                    }}
                                                    onChange={this.onCheckboxChange}
                                                />
                                                <span id="lblVisible">
                                                    {resources.lblVisible}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <Checkbox
                                                    className={classes.fontSize}
                                                    checked={settings.isAllRequired || settings.isSomeRequired}
                                                    id="chkAllRequired"
                                                    indeterminate={!settings.isAllRequired && settings.isSomeRequired}
                                                    inputProps={{
                                                        'aria-labelledby': 'lblRequired'
                                                    }}
                                                    onChange={this.onCheckboxChange}
                                                />
                                                <span id="lblRequired">
                                                    {resources.lblRequired}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <Hidden mdUp>
                                            <TableRow>
                                                <TableCell columnName={resources.lblAllVisible}>
                                                    <div className={classes.marginLeft}>
                                                        <Checkbox
                                                            className={classes.fontSize}
                                                            checked={settings.isAllVisible || settings.isSomeVisible}
                                                            id="chkAllVisible"
                                                            indeterminate={!settings.isAllVisible && settings.isSomeVisible}
                                                            inputProps={{
                                                                'aria-label': resources.lblAllVisible
                                                            }}
                                                            onChange={this.onCheckboxChange}
                                                        />
                                                    </div>
                                                </TableCell>
                                                <TableCell columnName={resources.lblAllRequired}>
                                                    <div className={classes.marginLeft}>
                                                        <Checkbox
                                                            className={classes.fontSize}
                                                            checked={settings.isAllRequired || settings.isSomeRequired}
                                                            id="chkAllRequired"
                                                            indeterminate={!settings.isAllRequired && settings.isSomeRequired}
                                                            inputProps={{
                                                                'aria-label': resources.lblAllRequired
                                                            }}
                                                            onChange={this.onCheckboxChange}
                                                        />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        </Hidden>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblCountry}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.country === EmergencyContactSettingStatus.Visible
                                                            || settings.country === EmergencyContactSettingStatus.Required}
                                                        id="chkCountryVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblCountry])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.country === EmergencyContactSettingStatus.Required}
                                                        id="chkCountryRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblCountry])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblEmail}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.email === EmergencyContactSettingStatus.Visible
                                                            || settings.email === EmergencyContactSettingStatus.Required}
                                                        id="chkEmailVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblEmail])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.email === EmergencyContactSettingStatus.Required}
                                                        id="chkEmailRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblEmail])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell>
                                                {resources.lblNotes}
                                            </TableCell>
                                            <TableCell columnName={resources.lblVisible}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.notes === EmergencyContactSettingStatus.Visible
                                                            || settings.notes === EmergencyContactSettingStatus.Required}
                                                        id="chkNotesVisible"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldVisible, [resources.lblNotes])
                                                        }}
                                                        onChange={this.onCheckboxChange}
                                                    />
                                                </div>
                                            </TableCell>
                                            <TableCell columnName={resources.lblRequired}>
                                                <div className={classes.marginTop}>
                                                    <Checkbox
                                                        checked={settings.notes === EmergencyContactSettingStatus.Required}
                                                        id="chkNotesRequired"
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatFieldRequired, [resources.lblNotes])
                                                        }}
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
                                    {resources.btnSave}
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
export default withStyles(styles)(EmergencyContactSettings);