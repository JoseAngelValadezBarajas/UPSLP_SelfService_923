/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AddressSettings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAddressSettingsGlobal } from '../../../Types/InstitutionSettings/IAddressSettings';
import { IInstitutionSettingFilter, InstitutionSettingFilterType } from '../../../Types/InstitutionSettings/IInstitutionSettingFilter';
import { IInstitutionSettingFilterModel } from '../../../Types/InstitutionSettings/IInstitutionSettingFilterModel';
import { IAddressSetupResources } from '../../../Types/Resources/Administration/IAddressSetupResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/AddressSettings';
import AddressRequests from '../../../Requests/Administration/AddressRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
// #endregion Imports

// #region Types
interface IAddresSettingsState {
    addressFilterSettings?: IInstitutionSettingFilter[];
    addressSettings?: IAddressSettingsGlobal;
    anchorEl: any;
    componentError: boolean;
    deleteAddressRequests?: boolean;
    isLoading: boolean;
    openAddressTypesInfo: boolean;
    openApprovalRequiredInfo: boolean;
    requestsExist: boolean;
    resources?: IAddressSetupResources;
    saveSettings: IInstitutionSettingFilterModel;
    showApprovalRequiredWarning: boolean;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '20%'
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
class AddressSettings extends React.Component<PropsWithStyles, IAddresSettingsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IAddresSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'AddressSettings';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAddresSettingsState {
        let resources: IAddressSetupResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = LayoutStore.getResourcesByKey(this.idPage);
        }
        return {
            anchorEl: null,
            componentError: false,
            deleteAddressRequests: undefined,
            isLoading: true,
            openAddressTypesInfo: false,
            openApprovalRequiredInfo: false,
            resources: resources,
            requestsExist: false,
            saveSettings: { filter: InstitutionSettingFilterType.Address, adds: [] },
            showApprovalRequiredWarning: false
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                addressSettings
            } = this.state;

            if (event.target.id && addressSettings) {
                switch (event.target.id) {
                    case 'chkEnableRecurringAdd':
                        addressSettings.recurAnually = !addressSettings.recurAnually;
                        break;
                    case 'chkOverwriteAddRecord':
                        addressSettings.editFutureAddress = !addressSettings.editFutureAddress;
                        break;
                    case 'chkEnableAddFormatting':
                        addressSettings.enableFormatting = !addressSettings.enableFormatting;
                        break;
                    case 'chkAllowEdit':
                        addressSettings.allowChange = !addressSettings.allowChange;
                        addressSettings.approvalRequired = false;
                        break;
                    case 'chkApprovalRequired':
                        addressSettings.approvalRequired = !addressSettings.approvalRequired;
                        break;
                }
                this.setState({
                    addressSettings: addressSettings
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onCheckboxAddressTypesChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                addressFilterSettings,
                saveSettings
            } = this.state;

            const checked: boolean = event.target.checked;

            if (addressFilterSettings && saveSettings) {
                const id: string[] = event.target.id.split('_');
                let indexChecked: number;
                indexChecked = addressFilterSettings.findIndex(x => x.id === id[1]);
                addressFilterSettings[indexChecked].isInclude = checked;
                if (checked) {
                    saveSettings.adds.push(id[1]);
                }
                else {
                    let index: number;
                    index = saveSettings.adds.indexOf(id[1]);
                    saveSettings.adds.splice(index, 1);
                }

                this.setState({
                    addressFilterSettings: addressFilterSettings,
                    saveSettings: saveSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxAddressTypesChange.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openAddressTypesInfo: false,
                openApprovalRequiredInfo: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            this.setState({
                anchorEl: event.currentTarget,
                openAddressTypesInfo: event.currentTarget.id === 'btnAddressTypesInfo',
                openApprovalRequiredInfo: event.currentTarget.id === 'btnApprovalRequiredInfo'
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                addressSettings,
                deleteAddressRequests,
                requestsExist,
                saveSettings
            } = this.state;

            if (addressSettings?.initialApprovalRequired && !addressSettings.approvalRequired && !deleteAddressRequests && requestsExist) {
                this.setState({ showApprovalRequiredWarning: true });
            }
            else if (
                (saveSettings && deleteAddressRequests === undefined) ||
                (saveSettings && deleteAddressRequests)
            ) {
                LayoutActions.setLoading(true);
                Requests.postSaveFilterSettings(saveSettings, this.resolvePostSaveFilterSettings, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };

    private onConfirmationPrimary = (): void => this.setState({
        deleteAddressRequests: false,
        showApprovalRequiredWarning: false
    });

    private onConfirmationSecondary = (): void => this.setState({
        deleteAddressRequests: true,
        showApprovalRequiredWarning: false
    }, this.onSaveSettings);
    // #endregion Events

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
    private resolveGetRequests = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRequests.name, this.hideAllLoaders);
            if (result?.status && result?.data) {
                this.setState({
                    requestsExist: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRequests.name, e));
        }
    };

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

    private resolveGetFilterSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetFilterSettings.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    saveSettings
                } = this.state;
                const addressFilterSettings: IInstitutionSettingFilter[] = result.data;
                if (addressFilterSettings) {
                    addressFilterSettings.forEach(row => {
                        if (row.isInclude) {
                            saveSettings.adds.push(row.id);
                        }
                    });
                }
                this.setState({
                    addressFilterSettings: addressFilterSettings,
                    saveSettings: saveSettings
                }, () => Requests.getSettings(this.resolveGetSettings, this.logError));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetFilterSettings.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name, this.hideAllLoaders);

            if (result?.status) {
                const addressSettings: IAddressSettingsGlobal = result.data;
                addressSettings.initialApprovalRequired = addressSettings.approvalRequired;
                this.setState({
                    addressSettings: addressSettings
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveFilterSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveFilterSettings.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    addressSettings
                } = this.state;
                if (addressSettings) {
                    Requests.postSaveSettings(addressSettings, this.resolvePostSaveSettings, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveFilterSettings.name, e));
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
                    const {
                        addressSettings
                    } = this.state;
                    if (addressSettings) {
                        addressSettings.initialApprovalRequired = addressSettings.approvalRequired;
                    }
                    AddressRequests.getDeniedPendingRequestsExist(this.resolveGetRequests);

                    this.setState({
                        addressSettings
                    });
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
            Requests.getFilterSettings(InstitutionSettingFilterType.Address, this.resolveGetFilterSettings, this.logError);
            AddressRequests.getDeniedPendingRequestsExist(this.resolveGetRequests);
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
            addressFilterSettings,
            addressSettings,
            anchorEl,
            componentError,
            isLoading,
            openAddressTypesInfo,
            openApprovalRequiredInfo,
            resources,
            showApprovalRequiredWarning
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrSddressSettings" height="md" />);
            }
            else if (resources && addressFilterSettings && addressSettings) {
                contentPage = (
                    <>
                        <ConfirmationDialog
                            contentText={resources.lblConfirmationDialogContent}
                            open={showApprovalRequiredWarning}
                            primaryActionText={resources.lblConfirmationDialogPrimaryAction}
                            primaryActionOnClick={this.onConfirmationPrimary}
                            secondaryActionText={resources.lblConfirmationDialogSecondaryAction}
                            secondaryActionOnClick={this.onConfirmationSecondary}
                            title={resources.lblConfirmationDialogTitle}
                        />
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblAddressChangeSettings}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblGeneral}
                                </Text>
                                <Divider noMarginBottom />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkEnableRecurringAdd"
                                    checked={addressSettings.recurAnually}
                                    label={resources.lblEnableRecurringAdd}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkOverwriteAddRecord"
                                    checked={addressSettings.editFutureAddress}
                                    label={resources.lblOverwriteAddRecord}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkEnableAddFormatting"
                                    checked={addressSettings.enableFormatting}
                                    label={resources.lblEnableAddFormatting}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Text size="h3">
                                    {resources.lblRequestHandling}
                                </Text>
                                <Divider noMarginBottom />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12}>
                                <Checkbox
                                    id="chkAllowEdit"
                                    checked={addressSettings.allowChange}
                                    label={resources.lblAllowEdit}
                                    onChange={this.onCheckboxChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Checkbox
                                    disabled={!addressSettings.allowChange}
                                    id="chkApprovalRequired"
                                    checked={addressSettings.allowChange && addressSettings.approvalRequired}
                                    label={resources.lblApprovalRequired}
                                    onChange={this.onCheckboxChange}
                                />
                                <Tooltip
                                    id="tltApprovalRequiredInfo"
                                    placement="right"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblAddressTypesLegend}
                                        color="gray"
                                        id="btnApprovalRequiredInfo"
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
                                    id="popApprovalRequiredInfo"
                                    open={openApprovalRequiredInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblApprovalRequiredLegend}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid
                            container
                            alignItems="center"
                            spacing={0}
                            wrap="nowrap"
                        >
                            <Grid item>
                                <Text size="h3">
                                    {resources.lblAddressTypes}
                                </Text>
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    id="tltAddressTypesInfo"
                                    placement="top"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblAddressTypesLegend}
                                        color="gray"
                                        id="btnAddressTypesInfo"
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
                                    id="popAddressTypesInfo"
                                    open={openAddressTypesInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblAddressTypesLegend}
                                    transition={false}
                                    TextTypographyProps={{ className: classes.popperText }}
                                />
                            </Grid>
                        </Grid>
                        <Divider noMarginBottom />
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblCurrentAddressTypes"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblCurrentAddType}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblStatus}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {addressFilterSettings.map((row, i) =>
                                            (
                                                <React.Fragment key={`address_${row.id}_${i}`}>
                                                    <TableRow>
                                                        <TableCell columnName={resources.lblCurrentAddType}>
                                                            <Checkbox
                                                                id={`chkAddress_${row.id}`}
                                                                checked={row.isInclude}
                                                                label={row.description}
                                                                onChange={this.onCheckboxAddressTypesChange}
                                                            />
                                                        </TableCell>
                                                        <TableCell columnName={resources.lblStatus}>
                                                            <StatusLabel
                                                                id={`stsLbl_${i}_${row.id}`}
                                                                text={row.isActive ? resources.lblActive : resources.lblInactive}
                                                                type={row.isActive ? 'success' : 'draft'}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
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
export default withStyles(styles)(AddressSettings);