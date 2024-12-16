/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AccountMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import ChangePasswordModal, { IPasswordResetResProps } from './ChangePasswordModal';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ChangePasswordError } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/ChangePasswordError';
import { IAccountValidations } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IAccountValidations';
import { IChangePasswordResponse } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IChangePasswordResponse';
import { IUserPasswordPolicy } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IUserPasswordPolicy';
import { IAccountMain } from '../../../Types/Account/IAccountMain';
import { IAccountMainResources } from '../../../Types/Resources/Account/IAccountMainResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import PasswordValidation from '@hedtech/powercampus-design-system/helpers/PasswordValidation';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/AccountMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import PasswordConfirmationActions from '@hedtech/powercampus-design-system/flux/actions/PasswordConfirmationActions';
import PasswordConfirmationStore from '@hedtech/powercampus-design-system/flux/stores/PasswordConfirmationStore';
// #endregion

export interface IAccountMainProps {
    isChangePassword: boolean;
}

// #region Internal types
interface IAccountMainState {
    componentError: boolean;
    accountInformation?: IAccountMain;
    accountValidations?: IAccountValidations;
    changePassword: boolean;
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    errorConfirmNewPassword: boolean;
    errorCurrentPassword: boolean;
    errorNewPassword: boolean;
    errorMessageConfirmNewPassword: string;
    errorMessageCurrentPassword: string;
    errorMessageNewPassword: string;
    isLoading: boolean;
    passwordPolicy?: IUserPasswordPolicy;
    validCurrentPassword: boolean;
    validNewPassword: boolean;
    validConfirmNewPassword: boolean;

    resources?: IAccountMainRes;
}

export interface IAccountMainRes extends IAccountMainResources {
    passwordResetResources: IPasswordResetResProps;
}

const styles = createStyles({
    cardContainerTop: {
        marginTop: Tokens.spacing40
    }
});

type PropsWithStyles = IAccountMainProps & WithStyles<typeof styles>;
// #endregion

// #region component
class AccountMain extends React.Component<PropsWithStyles, IAccountMainState> {
    private idModule: string;
    private idPage: string;
    public readonly state: Readonly<IAccountMainState>;

    // Constructor
    public constructor(props: any) {
        super(props);

        // Init Variables
        this.idModule = 'Account';
        this.idPage = 'AccountMain';
        this.state = this.getInitialState();

        // #region Bind State Management Listeners
        PasswordConfirmationStore.addPasswordValidationListener(this.onChangePassword);
        // #endregion State Management Listeners
    }

    // Init State
    private getInitialState(): IAccountMainState {
        let resources: IAccountMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            changePassword: false,
            confirmNewPassword: '',
            currentPassword: '',
            errorConfirmNewPassword: false,
            errorCurrentPassword: false,
            errorMessageConfirmNewPassword: '',
            errorMessageCurrentPassword: '',
            errorMessageNewPassword: '',
            errorNewPassword: false,
            isLoading: true,
            newPassword: '',
            validConfirmNewPassword: true,
            validCurrentPassword: true,
            validNewPassword: true,

            componentError: false,
            resources: resources
        };
    }

    //#region Events
    private onChangeCurrentPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            if (event.target.value !== '') {
                this.setState({
                    currentPassword: event.target.value,
                    errorCurrentPassword: false,
                    validCurrentPassword: event.target.value.length > 0
                });
            }
            else {
                this.setState({
                    currentPassword: event.target.value,
                    errorCurrentPassword: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCurrentPassword.name, e));
        }
    };

    private onChangeNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {

            const { confirmNewPassword } = this.state;

            const error: boolean = confirmNewPassword !== event.target.value && confirmNewPassword.length > 0;

            this.setState({
                errorConfirmNewPassword: error,
                newPassword: event.target.value,
                validConfirmNewPassword: event.target.value.length > 0,
                validNewPassword: event.target.value.length > 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeNewPassword.name, e));
        }
    };

    private onChangeConfirmNewPassword = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {

            const { newPassword } = this.state;

            const error: boolean = newPassword !== event.target.value;

            this.setState({
                confirmNewPassword: event.target.value,
                errorConfirmNewPassword: error,
                validConfirmNewPassword: event.target.value.length > 0
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeConfirmNewPassword.name, e));
        }
    };

    private onChangePassword = () => {
        try {
            const {
                passwordPolicy
            } = this.state;
            if (passwordPolicy && (passwordPolicy.storeMode !== 3 && passwordPolicy.storeMode !== 4)) {
                const password = PasswordConfirmationStore.getPassword();
                this.setState({
                    accountValidations: PasswordConfirmationStore.getPasswordValidation(),
                    changePassword: true,
                    newPassword: password
                });
            }
            else {
                window.location.href = String(passwordPolicy?.changePasswordUrl);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePassword.name, e));
        }
    };

    private onCloseModal = () => {
        try {
            PasswordConfirmationActions.setPasswordValidation();
            this.setState({
                changePassword: false,
                confirmNewPassword: '',
                currentPassword: '',
                errorConfirmNewPassword: false,
                errorCurrentPassword: false,
                errorMessageConfirmNewPassword: '',
                errorMessageCurrentPassword: '',
                errorMessageNewPassword: '',
                errorNewPassword: false,
                newPassword: '',
                validConfirmNewPassword: true,
                validCurrentPassword: true,
                validNewPassword: true,
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onSavePassword = () => {
        try {
            const {
                accountValidations,
                currentPassword,
                errorConfirmNewPassword,
                newPassword,
            } = this.state;

            let isValid: boolean = true;
            let validCurrentPassword: boolean = true;
            let errorCurrentPassword: boolean = false;
            if (accountValidations) {
                let validations: IAccountValidations = PasswordValidation.validatePassword(accountValidations, newPassword,
                    PasswordConfirmationStore.getPasswordPolicy());
                validations = PasswordValidation.validateConfirmPassword(accountValidations, accountValidations.confirmPassword, newPassword);
                PasswordConfirmationActions.setPasswordValidation(newPassword, validations);
                if (currentPassword.length === 0) {
                    isValid = false;
                    errorCurrentPassword = true;
                }
                if (currentPassword === newPassword) {
                    isValid = false;
                    accountValidations.isCurrentPwdNewPwd = true;
                    PasswordConfirmationActions.setPasswordValidation(newPassword, validations);
                }
                if (validations.hasErrors) {
                    isValid = false;
                }
            }

            this.setState({
                errorCurrentPassword: errorCurrentPassword,
                errorMessageCurrentPassword: '',
                errorMessageNewPassword: '',
                errorNewPassword: false,
                validCurrentPassword
            });

            if (isValid && !errorConfirmNewPassword && !errorCurrentPassword) {
                LayoutActions.showPageLoader();
                Requests.changePassword(currentPassword, newPassword, this.resolveSavePassword, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSavePassword.name, e));
        }
    };
    //#endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Functions

    //#region Functions for errors
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({
            message: message,
            messageType: ResultType.error
        } as IAlert);
    }
    //#endregion Functions for errors

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getAccountInformation(
                        this.resolveGetAccountInfo,
                        this.logError);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetAccountInfo = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAccountInfo.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    accountInformation: result.data
                });
                Requests.passwordPolicy('Profile', this.resolveGetPasswordPolicy, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAccountInfo.name, e));
        }
    };

    private resolveGetPasswordPolicy = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPasswordPolicy.name, this.hideAllLoaders);
            if (result?.status) {
                const passwordPolicy: IUserPasswordPolicy | undefined = result.data;
                if (passwordPolicy) {
                    this.setState({
                        passwordPolicy: passwordPolicy
                    });
                }
            }
            this.hideAllLoaders();
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPasswordPolicy.name, e));
        }
    };

    private resolveSavePassword = (json: string): void => {
        try {
            const {
                accountValidations,
                newPassword,
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSavePassword.name, this.hideAllLoaders);

            if (result?.status) {
                if (resources) {
                    const response: IChangePasswordResponse = result.data;
                    if (response.updatedSuccessfully) {
                        LayoutActions.setAlert({
                            message: resources.passwordResetResources.lblSuccess,
                            messageType: ResultType.success
                        } as IAlert);
                        PasswordConfirmationActions.setPasswordValidation();
                        this.setState({
                            changePassword: false,
                            confirmNewPassword: '',
                            currentPassword: '',
                            errorConfirmNewPassword: false,
                            errorCurrentPassword: false,
                            errorMessageConfirmNewPassword: '',
                            errorMessageCurrentPassword: '',
                            errorMessageNewPassword: '',
                            errorNewPassword: false,
                            newPassword: '',
                            validConfirmNewPassword: true,
                            validCurrentPassword: true,
                            validNewPassword: true
                        });
                    }
                    else if (response.errors.length > 0) {
                        switch (response.errors[0]) {
                            case ChangePasswordError.CurrentPasswordInvalid:
                                this.setState({
                                    errorCurrentPassword: false,
                                    validCurrentPassword: false,
                                });
                                break;
                            case ChangePasswordError.AlreadyUsed:
                                if (accountValidations) {
                                    let validations: IAccountValidations = PasswordValidation.validatePassword(accountValidations, newPassword,
                                        PasswordConfirmationStore.getPasswordPolicy());
                                    validations.isNotPreviousPassword = true;
                                    PasswordConfirmationActions.setPasswordValidation(newPassword, validations);
                                }
                                this.setState({
                                    errorCurrentPassword: false,
                                    validCurrentPassword: true,
                                });
                                break;
                            default:
                                this.showError(resources.lblGenericError);
                                break;
                        }
                    }
                }
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSavePassword.name, e));
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

    // Render
    public render(): JSX.Element {
        const {
            accountInformation,
            componentError,
            changePassword,
            currentPassword,
            newPassword,
            confirmNewPassword,
            errorConfirmNewPassword,
            errorCurrentPassword,
            errorNewPassword,
            errorMessageNewPassword,
            errorMessageCurrentPassword,
            isLoading,
            passwordPolicy,
            validConfirmNewPassword,
            validCurrentPassword,
            validNewPassword,

            resources
        } = this.state;

        const {
            classes,
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let changePasswordModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {
            if (changePassword) {
                changePasswordModal = (
                    <ChangePasswordModal
                        currentPassword={currentPassword}
                        newPassword={newPassword}
                        confirmNewPassword={confirmNewPassword}
                        errorConfirmNewPassword={errorConfirmNewPassword}
                        errorCurrentPassword={errorCurrentPassword}
                        errorNewPassword={errorNewPassword}
                        errorMessageNewPassword={errorMessageNewPassword}
                        errorMessageCurrentPassword={errorMessageCurrentPassword}
                        validConfirmNewPassword={validConfirmNewPassword}
                        validCurrentPassword={validCurrentPassword}
                        validNewPassword={validNewPassword}
                        open={changePassword}
                        onChangeCurrentPassword={this.onChangeCurrentPassword}
                        onChangeConfirmNewPassword={this.onChangeConfirmNewPassword}
                        onChangeNewPassword={this.onChangeNewPassword}
                        onClose={this.onCloseModal}
                        onSavePassword={this.onSavePassword}
                        resources={resources.passwordResetResources}
                    />
                );
            }
            if (accountInformation) {
                contentPage = (
                    <>
                        <Grid container spacing={3} className={classes.cardContainerTop}>
                            <Grid item xs={12} sm={12} md={8} lg={8}>
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item>
                                                <Text
                                                    size="h2"
                                                    weight="strong"
                                                >
                                                    {resources.lblAccountInformation}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={6} md={3}>
                                                <Text weight="strong">
                                                    {resources.lblUserName}
                                                </Text>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Text>
                                                    {accountInformation.userName}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs={6} md={3}>
                                                <Text weight="strong">
                                                    {resources.lblSystemId}
                                                </Text>
                                            </Grid>
                                            <Grid item xs={6} md={3}>
                                                <Text>
                                                    {accountInformation.peopleId}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        {passwordPolicy && passwordPolicy.canChangePassword && (
                                            <Grid container>
                                                <Grid item xs={6} md={3}>
                                                    <Text weight="strong">
                                                        {resources.lblPassword}
                                                    </Text>
                                                </Grid>
                                                <Grid item xs={6} md={3}>
                                                    <Button
                                                        TextProps={{
                                                            weight: 'strong'
                                                        }}
                                                        align="left"
                                                        id="btnChangePwd"
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={this.onChangePassword}
                                                    >
                                                        {resources.passwordResetResources.lblChangePassword}
                                                    </Button>
                                                </Grid>
                                            </Grid>
                                        )}
                                    </CardContent>
                                </Card>
                                <br />
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text
                                                    size="h2"
                                                    weight="strong"
                                                >
                                                    {resources.lblTitleName}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                        <br />
                                        <Grid container spacing={3}>
                                            <Grid item xs={12} md={6}>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={6} md={6}>
                                                        <Text weight="strong">
                                                            {resources.lblPrefix}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        <Text>
                                                            {accountInformation.prefix}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={6} md={6}>
                                                        <Text weight="strong">
                                                            {resources.lblFirstName}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        <Text>
                                                            {accountInformation.firstName}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={6} md={6}>
                                                        <Text weight="strong">
                                                            {resources.lblMiddleName}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        <Text>
                                                            {accountInformation.middleName}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                            <Grid item xs={12} md={6}>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={6} md={6}>
                                                        <Text weight="strong">
                                                            {resources.lblLastNamePrefix}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        <Text>
                                                            {accountInformation.lastNamePrefix}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={6} md={6}>
                                                        <Text weight="strong">
                                                            {resources.lblLastName}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        <Text>
                                                            {accountInformation.lastName}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container justifyContent="space-between">
                                                    <Grid item xs={6} md={6}>
                                                        <Text weight="strong">
                                                            {resources.lblSuffix}
                                                        </Text>
                                                    </Grid>
                                                    <Grid item xs={6} md={6}>
                                                        <Text>
                                                            {accountInformation.suffix}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} sm={12} md={4} lg={4}>
                                {accountInformation.email
                                    || accountInformation.phone
                                    || accountInformation.address ? (
                                    <Grid item xs={12}>
                                        <Card>
                                            <CardContent>
                                                <Grid container>
                                                    <Grid item>
                                                        <Text
                                                            size="h2"
                                                            weight="strong"
                                                        >
                                                            {resources.lblContactInformation}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid item xs>
                                                        <Grid container>
                                                            <Grid item xs>
                                                                <Text
                                                                    IconProps={{
                                                                        name: 'email'
                                                                    }}
                                                                >
                                                                    {accountInformation.email}
                                                                </Text>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container>
                                                            <Grid item xs>
                                                                <Text
                                                                    IconProps={{
                                                                        name: 'phone'
                                                                    }}
                                                                >
                                                                    {accountInformation.phone}
                                                                </Text>
                                                            </Grid>
                                                        </Grid>
                                                        <Grid container>
                                                            <Grid item xs>
                                                                <Text
                                                                    IconProps={{
                                                                        name: 'location'
                                                                    }}
                                                                >
                                                                    {accountInformation.address}
                                                                </Text>
                                                            </Grid>
                                                        </Grid>

                                                    </Grid>
                                                </Grid>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ) : undefined}
                            </Grid>
                        </Grid>
                    </>
                );
            }

        }

        return (
            <>
                {contentPage}
                {changePasswordModal}
            </>
        );
    }
}
// #endregion component

// Component
export default withStyles(styles)(AccountMain);