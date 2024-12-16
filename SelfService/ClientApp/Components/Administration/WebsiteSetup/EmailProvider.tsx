/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: EmailProvider.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { EmailProviderOption, Sender } from '../../../Types/Enum/EmailProviderOption';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailProviderResources } from '../../../Types/Resources/Administration/IEmailProviderResources';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { emailIsValid } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/EmailProvider';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IEmailProviderProps {
}

interface IEmailProviderState {
    anchorEl: any;
    componentError: boolean;
    emailRegExp?: string;
    openStaffPagesInfo: boolean;
    openStudentsPagesInfo: boolean;
    resources?: IEmailProviderResources;
    settings?: IEmailSettings;
}
// #endregion Types

// #region Component
class EmailProvider extends React.Component<IEmailProviderProps, IEmailProviderState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IEmailProviderState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'EmailProvider';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IEmailProviderState {
        let resources: IEmailProviderResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            componentError: false,
            openStaffPagesInfo: false,
            openStudentsPagesInfo: false,
            resources: resources
        };
    }

    // #region Events
    private onChangeTextfield = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                settings
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value.trim();
            if (settings) {
                switch (id) {
                    case 'txtEmailUrl':
                        settings.staffUrl = value;
                        settings.staffUrlModified = true;
                        break;
                    case 'txtEmailSeparator':
                        settings.staffSeparator = value;
                        settings.staffSeparatorModified = true;
                        break;
                    case 'txtStudentEmailUrl':
                        settings.studentUrl = value;
                        settings.studentUrlModified = true;
                        break;
                    case 'txtStudentEmailSeparator':
                        settings.studentSeparator = value;
                        settings.studentSeparatorModified = true;
                        break;
                    case 'txtSystemAdminEmail':
                        settings.email = value;
                        settings.emailModified = true;
                        settings.invalidEmail = false;
                        break;
                }
            }
            this.setState({
                settings: settings
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextfield.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string) => {
        try {
            const {
                settings
            } = this.state;

            if (settings) {
                switch (id) {
                    case 'ddlEmailProvider':
                        settings.emailProvider = Number(optionSelected.value);
                        if (settings.emailProvider === EmailProviderOption.External) {
                            settings.emailModified = false;
                            settings.senderModified = false;
                            settings.invalidEmail = false;
                        }
                        else {
                            settings.staffSeparatorModified = false;
                            settings.staffUrlModified = false;
                        }
                        break;
                    case 'ddlSender':
                        settings.sender = Number(optionSelected.value);
                        settings.senderModified = true;
                        break;
                }
            }

            this.setState({
                settings: settings
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));

        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                settings
            } = this.state;

            const id: string = event.target.id;
            if (settings) {
                switch (id) {
                    case 'chkCanEditSender':
                        settings.canEditSender = event.target.checked;
                        break;
                    case 'chkCanEditRecipient':
                        settings.canEditRecipient = event.target.checked;
                        break;
                }
            }
            this.setState({
                settings: settings
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onRestoreDefaultValues = (): void => {
        try {
            this.setState({
                settings: {
                    canEditRecipient: false,
                    canEditSender: false,

                    emailProvider: EmailProviderOption.External,
                    sender: 0,
                    email: '',

                    emailModified: false,
                    senderModified: false,
                    invalidEmail: false,

                    staffSeparator: ',',
                    staffUrl: 'mailto:{0}',

                    staffSeparatorModified: false,
                    staffUrlModified: false,

                    studentSeparator: ',',
                    studentUrl: 'mailto:{0}',

                    studentSeparatorModified: false,
                    studentUrlModified: false
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRestoreDefaultValues.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                emailRegExp,
                settings
            } = this.state;

            if (settings) {
                if (settings.emailProvider === EmailProviderOption.External) {
                    settings.staffSeparatorModified = true;
                    settings.staffUrlModified = true;
                    settings.emailModified = false;
                    settings.senderModified = false;
                    settings.invalidEmail = false;
                }
                else {
                    settings.staffSeparatorModified = false;
                    settings.staffUrlModified = false;
                    settings.senderModified = true;
                    if (settings.sender === Sender.SystemAdministrator) {
                        settings.emailModified = true;
                        if (emailRegExp && settings.email) {
                            settings.invalidEmail = !emailIsValid(settings.email, emailRegExp);
                        }
                    }
                    else {
                        settings.email = '';
                        settings.invalidEmail = false;
                    }
                }
                settings.studentUrlModified = true;
                settings.studentSeparatorModified = true;

                let sendRequest: boolean = false;
                if (settings.studentUrl && settings.studentSeparator) {
                    if (settings.emailProvider === EmailProviderOption.External
                        && settings.staffUrl && settings.staffSeparator) {
                        settings.email = '';
                        settings.sender = 0;
                        settings.canEditRecipient = false;
                        settings.canEditSender = false;
                        sendRequest = true;
                    }
                    else if (settings.emailProvider === EmailProviderOption.SelfService) {
                        settings.staffSeparator = ',';
                        settings.staffUrl = 'mailto:{0}';
                        if (settings.sender === Sender.SystemAdministrator && settings.email && !settings.invalidEmail) {
                            sendRequest = true;
                        }
                        else if (settings.sender === Sender.LoggedInUser || settings.sender === Sender.TypeEmailAddress) {
                            sendRequest = true;
                            if (settings.sender === Sender.TypeEmailAddress) {
                                settings.canEditSender = false;
                            }
                        }
                    }
                }

                if (sendRequest) {
                    LayoutActions.showPageLoader();
                    Requests.postSaveSettings(settings, this.resolvePostSaveSettings);
                }

                this.setState({
                    settings: settings
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            const targetId: string = event.currentTarget.id;
            switch (targetId) {
                case "btnStaffPagesInfo":
                    this.setState({
                        anchorEl: event.currentTarget,
                        openStaffPagesInfo: true,
                    });
                    break;
                case "btnStudentsPagesInfo":
                    this.setState({
                        anchorEl: event.currentTarget,
                        openStudentsPagesInfo: true
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openStaffPagesInfo: false,
                openStudentsPagesInfo: false,
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };
    // #endregion Events

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetResources.name);
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

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetSettings.name);
            if (result?.status) {
                const settings: IEmailSettings = result.data;
                if (settings) {
                    settings.staffSeparatorModified = false;
                    settings.staffUrlModified = false;
                    settings.studentSeparatorModified = false;
                    settings.studentUrlModified = false;
                }
                this.setState({
                    settings: settings
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolvePostSaveSettings.name);
            if (result?.status) {
                if (result.data) {
                    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
                    if (layoutResources) {
                        LayoutActions.setAlert({
                            message: layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                    LayoutActions.hidePageLoader();
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };

    private resolveGetEmailRegExp = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetEmailRegExp.name);
            if (result?.status) {
                this.setState({
                    emailRegExp: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEmailRegExp.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getSettings(this.resolveGetSettings);
            Requests.getEmailRegExp(this.resolveGetEmailRegExp);
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
            anchorEl,
            componentError,
            openStaffPagesInfo,
            openStudentsPagesInfo,
            resources,
            settings
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && settings) {
            const emailProviderOptions: IDropDownOption[] = [
                {
                    description: resources.lblExtEmailProvider,
                    value: EmailProviderOption.External
                },
                {
                    description: resources.lblEmailFromSS,
                    value: EmailProviderOption.SelfService
                }
            ];

            const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
            const emptyOption: IDropDownOption = {
                description: layoutResources ? layoutResources.lblDropDownEmptyText : '',
                value: 0
            };

            const senderOptions: IDropDownOption[] = [
                {
                    description: resources.lblSystemAdministrator,
                    value: Sender.SystemAdministrator
                },
                {
                    description: resources.lblLoggedInUser,
                    value: Sender.LoggedInUser
                },
                {
                    description: resources.lblTypeEmailAddress,
                    value: Sender.TypeEmailAddress
                }
            ];

            contentPage = (
                <>
                    <Grid container>
                        <Grid item xs={12}>
                            <Text size="large">
                                {resources.lblInstructions}
                            </Text>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text size="h2" weight="strong">
                                        {resources.lblStaff}
                                        <Tooltip
                                            id="tltStaffPagesInfo"
                                            placement="top"
                                            title={resources.lblMoreInformation}
                                        >
                                            <IconButton
                                                aria-label={resources.lblMoreInformation}
                                                color="gray"
                                                id="btnStaffPagesInfo"
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
                                            id="popStaffPagesInfo"
                                            open={openStaffPagesInfo}
                                            placement="right-start"
                                            anchorEl={anchorEl}
                                            onClickAway={this.onClosePopper}
                                        >
                                            <Grid container direction="column" spacing={2}>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblStaffPopperHeader}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblApproveGrades}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblManageAdvisees}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblProfileAdvisor}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblAuthorizeRegistration}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblCourseManagement}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                        </Popper>
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Divider noMarginTop />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <Grid item xs={12} sm={6}>
                                            <Dropdown
                                                id="ddlEmailProvider"
                                                label={resources.lblEmailProvider}
                                                options={emailProviderOptions}
                                                value={settings.emailProvider}
                                                required
                                                onChange={this.onChangeDropdown}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                {settings.emailProvider === EmailProviderOption.External ? (
                                    <>
                                        <Grid item xs={12}>
                                            <TextField
                                                error={settings.staffUrlModified && !Boolean(settings.staffUrl)}
                                                helperText={settings.staffUrlModified && !Boolean(settings.staffUrl)
                                                    ? resources.lblUrlRequired
                                                    : undefined}
                                                id="txtEmailUrl"
                                                label={resources.lblUrl}
                                                maxCharacters={2048}
                                                required
                                                value={settings.staffUrl}
                                                onChange={this.onChangeTextfield}
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={3}>
                                            <TextField
                                                error={settings.staffSeparatorModified && !Boolean(settings.staffSeparator)}
                                                helperText={settings.staffSeparatorModified && !Boolean(settings.staffSeparator)
                                                    ? resources.lblSeparatorRequired
                                                    : undefined}
                                                id="txtEmailSeparator"
                                                label={resources.lblSeparator}
                                                maxCharacters={1}
                                                required
                                                value={settings.staffSeparator}
                                                onChange={this.onChangeTextfield}
                                            />
                                        </Grid>
                                    </>
                                ) : (
                                    <>
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12} sm={6}>
                                                    <Dropdown
                                                        emptyOption={emptyOption}
                                                        error={settings.senderModified && !settings.sender}
                                                        helperText={settings.senderModified && !settings.sender
                                                            ? resources.lblSenderRequired : undefined}
                                                        id="ddlSender"
                                                        label={resources.lblSender}
                                                        onChange={this.onChangeDropdown}
                                                        options={senderOptions}
                                                        required
                                                        value={settings.sender}
                                                    />
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        {settings.sender === Sender.SystemAdministrator && (
                                            <Grid item xs={12}>
                                                <Grid container>
                                                    <Grid item xs={12} sm={6}>
                                                        <TextField
                                                            error={settings.invalidEmail || (settings.emailModified && !settings.email)}
                                                            helperText={settings.invalidEmail ? resources.lblInvalidEmail
                                                                : settings.emailModified && !settings.email
                                                                    ? resources.lblSystemAdminEmailRequired
                                                                    : undefined}
                                                            id="txtSystemAdminEmail"
                                                            label={resources.lblSystemAdminEmail}
                                                            onChange={this.onChangeTextfield}
                                                            required
                                                            value={settings.email}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        )}
                                        <Grid item xs={12}>
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <Grid container spacing={2}>
                                                        {(settings.sender === Sender.SystemAdministrator ||
                                                            settings.sender === Sender.LoggedInUser) && (
                                                                <Grid item xs={12}>
                                                                    <Checkbox
                                                                        checked={settings.canEditSender}
                                                                        id="chkCanEditSender"
                                                                        label={resources.lblCanEditSender}
                                                                        onChange={this.onChangeCheckbox}
                                                                    />
                                                                </Grid>
                                                            )}
                                                        <Grid item xs={12}>
                                                            <Checkbox
                                                                checked={settings.canEditRecipient}
                                                                id="chkCanEditRecipient"
                                                                label={resources.lblCanEditRecipient}
                                                                onChange={this.onChangeCheckbox}
                                                            />
                                                        </Grid>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <Text size="h2" weight="strong">
                                        {resources.lblStudent}
                                        <Tooltip
                                            id="tltStudentsPagesInfo"
                                            placement="top"
                                            title={resources.lblMoreInformation}
                                        >
                                            <IconButton
                                                aria-label={resources.lblMoreInformation}
                                                color="gray"
                                                id="btnStudentsPagesInfo"
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
                                            id="popStudentsPagesInfo"
                                            open={openStudentsPagesInfo}
                                            placement="right-start"
                                            anchorEl={anchorEl}
                                            onClickAway={this.onClosePopper}
                                        >
                                            <Grid container direction="column" spacing={2}>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblStudentsPopperHeader}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblStudentProfile}
                                                    </Text>
                                                </Grid>
                                                <Grid item>
                                                    <Text>
                                                        {resources.lblAcademicPlan}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                        </Popper>
                                    </Text>
                                </Grid>
                            </Grid>
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Divider noMarginTop />
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <TextField
                                        error={settings.studentUrlModified && !Boolean(settings.studentUrl)}
                                        helperText={settings.studentUrlModified && !Boolean(settings.studentUrl)
                                            ? resources.lblUrlRequired
                                            : undefined}
                                        id="txtStudentEmailUrl"
                                        label={resources.lblUrl}
                                        maxCharacters={2048}
                                        required
                                        value={settings.studentUrl}
                                        onChange={this.onChangeTextfield}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        error={settings.studentSeparatorModified && !Boolean(settings.studentSeparator)}
                                        helperText={settings.studentSeparatorModified && !Boolean(settings.studentSeparator)
                                            ? resources.lblSeparatorRequired
                                            : undefined}
                                        id="txtStudentEmailSeparator"
                                        label={resources.lblSeparator}
                                        maxCharacters={1}
                                        required
                                        value={settings.studentSeparator}
                                        onChange={this.onChangeTextfield}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <ButtonGroup id="btgEmailProvider">
                                <Button
                                    color="secondary"
                                    id="btnRestoreEmailProvider"
                                    onClick={this.onRestoreDefaultValues}
                                >
                                    {resources.btnRestore}
                                </Button>
                                <Button
                                    id="btnSaveEmailProvider"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.btnSave}
                                </Button>
                            </ButtonGroup>
                        </Grid>
                    </Grid>
                </>
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
export default (EmailProvider);