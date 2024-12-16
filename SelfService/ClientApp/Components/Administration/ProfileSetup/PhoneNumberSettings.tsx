/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: PhoneNumberSettings.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IInstitutionSettingFilter, InstitutionSettingFilterType } from '../../../Types/InstitutionSettings/IInstitutionSettingFilter';
import { IPhoneNumberSettings } from '../../../Types/InstitutionSettings/IPhoneNumberSettings';
import { IInstitutionSettingFilterModel } from '../../../Types/InstitutionSettings/IInstitutionSettingFilterModel';
import { IPhoneNumberSettingsResources } from '../../../Types/Resources/Administration/IPhoneNumberSettingsResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/PhoneNumberSettings';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IPhoneNumberSettingsState {
    anchorEl: any;
    componentError: boolean;
    isLoading: boolean;
    openPhoneTypesInfo: boolean;
    phoneNumberFilterSettings?: IInstitutionSettingFilter[];
    phoneNumberSettings?: IPhoneNumberSettings;
    resources?: IPhoneNumberSettingsResources;
    saveSettings: IInstitutionSettingFilterModel;
}

const styles = ((theme: Theme) => createStyles({
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
class PhoneNumberSettings extends React.Component<PropsWithStyles, IPhoneNumberSettingsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IPhoneNumberSettingsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'PhoneNumberSettings';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPhoneNumberSettingsState {
        let resources: IPhoneNumberSettingsResources | undefined;
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
            openPhoneTypesInfo: false,
            resources: resources,
            saveSettings: { filter: InstitutionSettingFilterType.PhoneNumber, adds: [] }
        };
    }

    // #region Events
    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                phoneNumberSettings
            } = this.state;

            if (event.target.id && phoneNumberSettings) {
                switch (event.target.id) {
                    case 'chkAllowEdit':
                        phoneNumberSettings.allowEdit = !phoneNumberSettings.allowEdit;
                        break;
                }
                this.setState({
                    phoneNumberSettings: phoneNumberSettings
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onCheckboxPhoneTypeChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                phoneNumberFilterSettings,
                saveSettings
            } = this.state;

            const checked: boolean = event.target.checked;

            if (phoneNumberFilterSettings && saveSettings) {
                const id: string[] = event.target.id.split('_');
                let indexChecked: number;
                indexChecked = phoneNumberFilterSettings.findIndex(x => x.id === id[1]);
                phoneNumberFilterSettings[indexChecked].isInclude = checked;
                if (checked) {
                    saveSettings.adds.push(id[1]);
                }
                else {
                    let index: number;
                    index = saveSettings.adds.indexOf(id[1]);
                    saveSettings.adds.splice(index, 1);
                }

                this.setState({
                    phoneNumberFilterSettings: phoneNumberFilterSettings,
                    saveSettings: saveSettings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxPhoneTypeChange.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openPhoneTypesInfo: false
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
                openPhoneTypesInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                saveSettings
            } = this.state;

            if (saveSettings) {
                Requests.postSaveFilterSettings(saveSettings, this.resolvePostSaveFilterSettings, this.logError);
                LayoutActions.setLoading(true);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };
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

                const phoneNumberFilterSettings: IInstitutionSettingFilter[] = result.data;
                phoneNumberFilterSettings.forEach(row => {
                    if (row.isInclude) {
                        saveSettings.adds.push(row.id);
                    }
                });
                this.setState({
                    phoneNumberFilterSettings: phoneNumberFilterSettings,
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
                const phoneNumberSettings: IPhoneNumberSettings = result.data;
                this.setState({
                    phoneNumberSettings: phoneNumberSettings
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
                    phoneNumberSettings
                } = this.state;
                if (phoneNumberSettings) {
                    Requests.postSaveSettings(phoneNumberSettings, this.resolvePostSaveSettings, this.logError);
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
            Requests.getFilterSettings(InstitutionSettingFilterType.PhoneNumber, this.resolveGetFilterSettings, this.logError);
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
            openPhoneTypesInfo,
            phoneNumberFilterSettings,
            phoneNumberSettings,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrPhoneNumberSettings" height="md" />);
            }
            else if (resources && phoneNumberFilterSettings && phoneNumberSettings) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblPhoneNumberSettings}
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
                                    id="chkAllowEdit"
                                    checked={phoneNumberSettings.allowEdit}
                                    label={resources.lblAllowEdit}
                                    onChange={this.onCheckboxChange}
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
                                    {resources.lblPhoneTypes}
                                </Text>
                            </Grid>
                            <Grid item>
                                <Tooltip
                                    id="tltPhoneTypesInfo"
                                    placement="top"
                                    title={resources.btnMoreInfo}
                                >
                                    <IconButton
                                        aria-label={resources.lblPhoneTypesLegend}
                                        color="gray"
                                        id="btnPhoneTypesInfo"
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
                                    id="popPhoneTypesInfo"
                                    open={openPhoneTypesInfo}
                                    placement="bottom-start"
                                    anchorEl={anchorEl}
                                    onClickAway={this.onClosePopper}
                                    text={resources.lblPhoneTypesLegend}
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
                                                {resources.lblCurrentPhoneType}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblStatus}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {phoneNumberFilterSettings.map(row =>
                                            (
                                                <React.Fragment key={`phoneNumber_${row.id}`}>
                                                    <TableRow>
                                                        <TableCell columnName={resources.lblCurrentPhoneType}>
                                                            <Checkbox
                                                                checked={row.isInclude}
                                                                id={`chkPhone_${row.id}`}
                                                                label={row.description}
                                                                onChange={this.onCheckboxPhoneTypeChange}
                                                            />
                                                        </TableCell>
                                                        <TableCell columnName={resources.lblStatus}>
                                                            <StatusLabel
                                                                id={`stsLbl_${row.id}`}
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
export default withStyles(styles)(PhoneNumberSettings);