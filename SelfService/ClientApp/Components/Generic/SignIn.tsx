/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SignIn.tsx
 * Type: Container component */

// #region Imports
import URLSearchParams from '@ungap/url-search-params';
import React, { RefObject } from 'react';
import { setTimeout } from 'timers';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import PasswordConfirmation from '@hedtech/powercampus-design-system/react/components/PasswordConfirmation';
import ReCAPTCHA from '@hedtech/powercampus-design-system/react/core/ReCaptcha';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { StoreMode } from '@hedtech/powercampus-design-system/types/Account/StoreMode';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ChangePasswordError } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/ChangePasswordError';
import { IAccountValidations } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IAccountValidations';
import { IChangePasswordResponse } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IChangePasswordResponse';
import { IPasswordChange } from '../../Types/Account/IPasswordChange';
import { AuthStatus } from '../../Types/Enum/AuthStatus';
import { IAuthResponse } from '../../Types/Generic/IAuthResponse';
import { ISignInResources } from '../../Types/Resources/Generic/ISignInResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import PasswordValidation from '@hedtech/powercampus-design-system/helpers/PasswordValidation';
import Redirect from '@hedtech/powercampus-design-system/helpers/Redirect';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Generic/SignIn';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PasswordConfirmationActions from '@hedtech/powercampus-design-system/flux/actions/PasswordConfirmationActions';
import PasswordConfirmationStore from '@hedtech/powercampus-design-system/flux/stores/PasswordConfirmationStore';
// #endregion Imports

// #region Types
export interface ISignInProps {
    open?: boolean;
    userName?: string;
    onAfterSignIn?: () => void;
    onClose?: () => void;
    onGoSignUp?: () => void;
}

interface ISignInState {
    accountValidations?: IAccountValidations;
    alert?: IAlert;
    authMode?: number;
    isLoading: boolean;
    isLoadingNext: boolean;
    isLoadingSignIn: boolean;
    password: string;
    passwordModified: boolean;
    resources?: ISignInResources;
    stepNumber: number;
    uiCulture: string;
    userName: string;
    userNameModified: boolean;
    variation: number;

    // #region Change Password
    errorCurrentPassword: boolean;
    isLoadingChangePassword: boolean;
    newPassword?: string;
    openChangePassword: boolean;
    // #endregion Change Password

    // #region Forgot Password
    emailSent: boolean;
    isForgotPasswordEnabled: boolean;
    isLoadingSendEmail: boolean;
    isReCaptchaEnabled: boolean;
    openForgotPassword: boolean;
    reCaptchaError: boolean;
    reCaptchaSiteKey: string;
    userNameRecovery: string;
    userNameRecoveryModified: boolean;
    // #endregion Forgot Password
}

const styles = createStyles({
    forgotPasswordLink: {
        paddingTop: Tokens.spacing30
    },
    forgotText: {
        marginBottom: `${Tokens.spacing40}!important`
    },
    loginCard: {
        animation: 'slidein 1s',
        marginTop: Tokens.spacing80,
        maxWidth: '800px'
    },
    loginText: {
        marginTop: `${Tokens.spacing40}!important`
    },
    reCaptchaContent: {
        paddingBottom: Tokens.spacing30
    },
    reCaptchaErrorText: {
        paddingBottom: Tokens.spacing30
    },
    signInButton: {
        paddingTop: Tokens.spacing20
    },
    spacingAlert: {
        paddingBottom: Tokens.spacing20
    },
    spacingTitle: {
        paddingBottom: Tokens.spacing30
    }
});

type PropsWithStyles = ISignInProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class SignIn extends React.Component<PropsWithStyles, ISignInState> {
    private idModule: string;
    private idPage: string;
    private passwordRef: RefObject<HTMLInputElement>;
    private reCaptchaRef: RefObject<any>;
    private userNameRecoveryRef: RefObject<HTMLInputElement>;
    private userNameRef: RefObject<HTMLInputElement>;

    public readonly state: Readonly<ISignInState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'SignIn';
        this.passwordRef = React.createRef();
        this.reCaptchaRef = React.createRef();
        this.userNameRecoveryRef = React.createRef();
        this.userNameRef = React.createRef();
        this.state = this.getInitialState(this.props.userName);
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        PasswordConfirmationStore.addPasswordValidationListener(this.onChangePasswordValidation);
        // #endregion State Management Listeners
    }

    private getInitialState(userName?: string): ISignInState {
        let isLoading: boolean = true;
        let resources: ISignInResources | undefined;
        let isForgotPasswordEnabled: boolean = false;
        let isReCaptchaEnabled: boolean = false;
        let reCaptchaSiteKey: string;
        if (this.state) {
            isForgotPasswordEnabled = this.state.isForgotPasswordEnabled;
            isLoading = this.state.isLoading;
            isReCaptchaEnabled = this.state.isReCaptchaEnabled;
            reCaptchaSiteKey = this.state.reCaptchaSiteKey;
            resources = this.state.resources;
        }
        else {
            reCaptchaSiteKey = '';
            resources = LayoutStore.getResourcesByKey(`${this.idModule}.${this.idPage}`);
        }
        return {
            accountValidations: undefined,
            alert: undefined,
            authMode: undefined,
            isLoading: isLoading,
            isLoadingNext: false,
            isLoadingSignIn: false,
            password: '',
            passwordModified: false,
            resources: resources,
            stepNumber: 1,
            uiCulture: LayoutStore.getCultures().uiCulture,
            userName: userName || '',
            userNameModified: false,
            variation: 0,

            // #region Change Password
            errorCurrentPassword: false,
            isLoadingChangePassword: false,
            openChangePassword: false,
            // #endregion Change Password

            // #region Forgot Password
            emailSent: false,
            isForgotPasswordEnabled: isForgotPasswordEnabled,
            isLoadingSendEmail: false,
            isReCaptchaEnabled: isReCaptchaEnabled,
            openForgotPassword: false,
            reCaptchaError: false,
            reCaptchaSiteKey: reCaptchaSiteKey,
            userNameRecovery: '',
            userNameRecoveryModified: false
            // #endregion Forgot Password
        };
    }

    // #region Events

    private OnFinishSignIn = (): void => {
        try {
            LayoutStore.setIsAuthenticated(true);
            LayoutStore.setMenuOptions(undefined);
            LayoutActions.showPageLoader();
            const {
                onAfterSignIn
            } = this.props;
            if (onAfterSignIn) {
                onAfterSignIn();
            }
            else {
                const urlParams: URLSearchParams = new URLSearchParams(window.location.search);
                const returnUrl: string | null = urlParams.get('ReturnUrl');
                const newState: ISignInState = this.getInitialState();
                newState.isLoading = true;
                this.setState(newState);
                if (returnUrl && !returnUrl.includes('LogOut')) {
                    window.location.assign(returnUrl);
                }
                else {
                    Redirect.toHome();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.OnFinishSignIn.name, e));
        }
    };

    private onChangePassword = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                alert: undefined,
                password: event.target.value,
                passwordModified: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePassword.name, e));
        }
    };

    private onChangeUserName = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                alert: undefined,
                userName: event.target.value,
                userNameModified: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeUserName.name, e));
        }
    };

    private onCloseModal = (): void => {
        try {
            const {
                onClose
            } = this.props;
            const {
                isLoadingNext,
                isLoadingSignIn
            } = this.state;

            if (onClose && !isLoadingNext && !isLoadingSignIn) {
                this.setState(this.getInitialState());
                onClose();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onGoSignUpModal = (): void => {
        try {
            const {
                onGoSignUp
            } = this.props;

            const {
                isLoadingNext
            } = this.state;

            if (onGoSignUp && !isLoadingNext) {
                this.setState(this.getInitialState());
                onGoSignUp();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onGoSignUpModal.name, e));
        }
    };

    private onNext = (): void => {
        try {
            const {
                userName
            } = this.state;

            this.setState({
                userNameModified: true
            });

            if (userName) {
                this.showLoaderNext();
                Requests.getAuthenticationMode(userName, this.resolveGetAuthenticationMode);
            }
            else if (this.userNameRef?.current) {
                this.userNameRef.current.focus();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNext.name, e));
        }
    };

    private onSignIn = (): void => {
        try {
            const {
                authMode,
                password,
                userName,
                variation
            } = this.state;

            this.setState({
                passwordModified: true
            });

            if (userName && password) {
                this.showLoaderSignIn();
                if (variation === 2 && authMode) {
                    Requests.authenticateUser(userName, password, this.resolveAuthenticateUser);
                }
                else {
                    const timeout: number = Math.floor(Math.random() * 5 + 1) * 1000;
                    setTimeout(() => {
                        const {
                            resources
                        } = this.state;

                        if (resources) {
                            const alert: IAlert = {
                                message: resources.lblInvalidCredentials,
                                messageType: ResultType.error
                            };
                            this.setState({
                                alert: alert
                            });
                        }
                        else {
                            this.showError();
                        }
                        this.hideLoaderSignIn();
                    }, timeout);
                }
            }
            else if (this.passwordRef?.current) {
                this.passwordRef.current.focus();
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onSignIn.name, e));
        }
    };

    private onUseAnotherAccount = (): void => {
        try {
            this.setState(this.getInitialState(), () => {
                if (this.userNameRef?.current) {
                    this.userNameRef.current.focus();
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onUseAnotherAccount.name, e));
        }
    };

    // #region Change Password
    private onChangePasswordButton = (): void => {
        try {
            const {
                accountValidations,
                errorCurrentPassword,
                newPassword,
                password,
                userName
            } = this.state;

            let isValid: boolean = true;
            if (accountValidations) {
                let validations: IAccountValidations = PasswordValidation.validatePassword(accountValidations, newPassword,
                    PasswordConfirmationStore.getPasswordPolicy());
                validations = PasswordValidation.validateConfirmPassword(accountValidations, accountValidations.confirmPassword, newPassword);
                PasswordConfirmationActions.setPasswordValidation(newPassword, validations);

                if (validations.hasErrors || errorCurrentPassword) {
                    validations.isCurrentPwdNewPwd = errorCurrentPassword;
                    PasswordConfirmationActions.setPasswordValidation(newPassword, validations);
                    isValid = false;
                }
            }

            if (isValid && newPassword) {
                this.showLoaderChangePassword();
                const passwordChange: IPasswordChange = {
                    userName: userName,
                    currentPassword: password,
                    newPassword: newPassword
                };
                Requests.changePassword(passwordChange, this.resolveChangePassword);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePasswordButton.name, e));
        }
    };

    private onCloseChangePassword = (): void => {
        try {
            this.setState(this.getInitialState(), () => {
                if (this.userNameRef?.current) {
                    this.userNameRef.current.focus();
                }
            });
            PasswordConfirmationActions.setPasswordValidation();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseChangePassword.name, e));
        }
    };

    private onChangePasswordValidation = (): void => {
        try {
            const {
                password
            } = this.state;

            this.setState({
                accountValidations: PasswordConfirmationStore.getPasswordValidation(),
                errorCurrentPassword: PasswordConfirmationStore.getPassword() === password,
                newPassword: PasswordConfirmationStore.getPassword()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePasswordValidation.name, e));
        }
    };
    // #endregion Change Password

    // #region Forgot Password
    private onChangeUserNameRecovery = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                userNameRecovery: event.target.value,
                userNameRecoveryModified: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeUserNameRecovery.name, e));
        }
    };

    private onClickForgotPassword = (): void => {
        try {
            this.setState({
                emailSent: false,
                openForgotPassword: true,
                userNameRecovery: '',
                userNameRecoveryModified: false
            }, () => {
                if (this.userNameRecoveryRef?.current) {
                    this.userNameRecoveryRef.current.focus();
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickForgotPassword.name, e));
        }
    };

    private onCloseForgotPassword = (): void => {
        try {
            const {
                authMode,
                stepNumber
            } = this.state;

            this.setState({
                openForgotPassword: false,
                reCaptchaError: false
            }, () => {
                if (stepNumber === 2 && (authMode === StoreMode.Identity || authMode === StoreMode.ActiveDirectory)) {
                    if (this.passwordRef?.current) {
                        this.passwordRef.current.focus();
                    }
                }
                else {
                    if (this.userNameRef?.current) {
                        this.userNameRef.current.focus();
                    }
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseForgotPassword.name, e));
        }
    };

    private onRecaptchaChange = (token: any): void => {
        try {
            this.setState({
                reCaptchaError: !Boolean(token)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRecaptchaChange.name, e));
        }
    };

    private onReCaptchaError = (): void => {
        try {
            this.setState({
                reCaptchaError: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onReCaptchaError.name, e));
        }
    };

    private onSendEmail = (): void => {
        try {
            const {
                isReCaptchaEnabled,
                userNameRecovery
            } = this.state;

            let reCaptchaResponse: string = '';
            if (isReCaptchaEnabled && this.reCaptchaRef?.current) {
                reCaptchaResponse = this.reCaptchaRef.current.getValue();
                this.setState({
                    reCaptchaError: !Boolean(reCaptchaResponse),
                    userNameRecoveryModified: true
                });
            }

            if (!isReCaptchaEnabled || reCaptchaResponse) {
                this.setState({
                    reCaptchaError: false,
                    userNameRecoveryModified: true
                });

                if (userNameRecovery) {
                    this.showLoaderSendEmail();
                    Requests.sendForgotPasswordEmail(userNameRecovery, reCaptchaResponse, this.resolveSendForgotPasswordEmail);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSendEmail.name, e));
        }
    };
    // #endregion Forgot Password

    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingChangePassword: false,
            isLoadingNext: false,
            isLoadingSendEmail: false,
            isLoadingSignIn: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderChangePassword = (): void => {
        this.setState({
            isLoadingChangePassword: false
        });
    };

    private hideLoaderNext = (): void => {
        this.setState({
            isLoadingNext: false
        });
    };

    private hideLoaderSendEmail = (): void => {
        this.setState({
            isLoadingSendEmail: false
        });
    };

    private hideLoaderSignIn = (): void => {
        this.setState({
            isLoadingSignIn: false
        });
    };

    private showLoaderChangePassword = (): void => {
        this.setState({
            isLoadingChangePassword: true
        });
    };

    private showLoaderNext = (): void => {
        this.setState({
            isLoadingNext: true
        });
    };

    private showLoaderSendEmail = (): void => {
        this.setState({
            isLoadingSendEmail: true
        });
    };

    private showLoaderSignIn = (): void => {
        this.setState({
            isLoadingSignIn: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }

    private showSignInError = (): void => {
        const {
            resources
        } = this.state;

        if (resources) {
            const alert: IAlert = {
                message: resources.lblGenericError,
                messageType: ResultType.error
            };
            this.setState({
                alert: alert
            });
        }
        else {
            this.showError();
        }
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    isLoading: false,
                    resources: result.data
                });
                LayoutStore.setResourcesByKey(`${this.idModule}.${this.idPage}`, result.data);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetAuthenticationMode = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAuthenticationMode.name, this.hideAllLoaders);
            if (result?.status) {
                const mode: StoreMode = result.data.mode;
                const userName: string = result.data.userName;
                const variation: number = result.data.variation;

                this.setState({
                    authMode: mode,
                    variation: variation
                });

                if (variation === 2) {
                    this.setState({
                        stepNumber: 2
                    }, () => {
                        if (this.passwordRef?.current) {
                            this.passwordRef.current.focus();
                        }
                        this.hideLoaderNext();
                    });
                    if (mode === StoreMode.ADFS) {
                        Redirect.toADFSLogin(userName);
                    }
                    else if (mode === StoreMode.SAML) {
                        Redirect.toSAMLLogin(userName);
                    }
                }
                else if (variation === 1) {
                    this.showSignInError();
                    this.hideLoaderNext();
                }
                else {
                    this.setState({
                        stepNumber: 2
                    }, () => {
                        if (this.passwordRef?.current) {
                            this.passwordRef.current.focus();
                        }
                        this.hideLoaderNext();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAuthenticationMode.name, e));
        }
    };

    private resolveAuthenticateUser = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveAuthenticateUser.name, this.hideAllLoaders);
            if (result?.status) {
                const authResponse: IAuthResponse = result.data;

                if (authResponse && authResponse.success) {
                    if (authResponse.status === AuthStatus.Success && authResponse.changePasswordAtNextLogon) {
                        this.setState({
                            openChangePassword: true
                        });
                    }
                    else {
                        this.OnFinishSignIn();
                    }
                }
                else {
                    const {
                        resources
                    } = this.state;

                    if (resources) {
                        let message: string = '';
                        if (authResponse) {
                            if (authResponse.status === AuthStatus.InvalidCredentials) {
                                message = resources.lblInvalidCredentials;
                            }
                            else if (authResponse.status === AuthStatus.IsLocked) {
                                if (authResponse.attempt?.remainingLockedOutTime) {
                                    message = Format.toString(resources.formatLockedAccount, [authResponse.attempt.remainingLockedOutTime]);
                                }
                                if (!message) {
                                    message = resources.lblLocked;
                                }
                            }
                            else if (authResponse.status === AuthStatus.InvalidPassword) {
                                if (authResponse.attempt?.remainingAttempts) {
                                    message = Format.toString(resources.formatInvalidAttempts, [authResponse.attempt.remainingAttempts]);
                                }
                                if (!message) {
                                    message = resources.lblInvalidCredentials;
                                }
                            }
                        }

                        if (!message) {
                            message = resources.lblGenericError;
                        }

                        const alert: IAlert = {
                            message: message,
                            messageType: ResultType.error
                        };
                        this.setState({
                            alert: alert
                        });
                    }
                    else {
                        this.showError();
                    }
                    this.hideLoaderSignIn();
                }

            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveAuthenticateUser.name, e));
        }
    };

    // #region Change Password
    private resolveChangePassword = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveChangePassword.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    accountValidations,
                    newPassword
                } = this.state;

                const response: IChangePasswordResponse = result.data;
                if (response.updatedSuccessfully) {
                    PasswordConfirmationActions.setPasswordValidation();
                    this.OnFinishSignIn();
                }
                else if (response.errors.length > 0) {
                    switch (response.errors[0]) {
                        case ChangePasswordError.AlreadyUsed:
                            if (accountValidations) {
                                accountValidations.isNotPreviousPassword = true;
                                PasswordConfirmationActions.setPasswordValidation(newPassword, accountValidations);
                            }
                            break;
                        default:
                            this.showSignInError();
                            break;
                    }
                    this.hideLoaderChangePassword();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveChangePassword.name, e));
        }
    };
    // #endregion Change Password

    // #region Forgot Password
    private resolveIsForgotPasswordEnabled = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveIsForgotPasswordEnabled.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        isForgotPasswordEnabled: result.data.isForgotPasswordEnabled,
                        isReCaptchaEnabled: result.data.isReCaptchaEnabled,
                        reCaptchaSiteKey: result.data.reCaptchaSiteKey || ''
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveIsForgotPasswordEnabled.name, e));
        }
    };

    private resolveSendForgotPasswordEmail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSendForgotPasswordEmail.name, this.hideAllLoaders);
            if (result?.status) {
                if (!result.data) {
                    const timeout: number = Math.floor(Math.random() * 15 + 1) * 1000;
                    setTimeout(() => {
                        this.setState({
                            emailSent: true
                        }, this.hideLoaderSendEmail);
                    }, timeout);
                }
                else {
                    this.setState({
                        emailSent: true
                    }, this.hideLoaderSendEmail);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSendForgotPasswordEmail.name, e));
        }
    };
    // #endregion Forgot Password

    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                resources,
                userName
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
            }
            else {
                this.hideLoader();
            }
            Requests.isForgotPasswordEnabled(this.resolveIsForgotPasswordEnabled);

            if (userName) {
                this.onNext();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        PasswordConfirmationStore.removePasswordValidationListener(this.onChangePasswordValidation);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            open,
            width,
            onClose,
            onGoSignUp
        } = this.props;

        const {
            alert,
            authMode,
            isLoading,
            isLoadingChangePassword,
            isLoadingNext,
            isLoadingSignIn,
            password,
            passwordModified,
            resources,
            stepNumber,
            uiCulture,
            userName,
            userNameModified,

            // #region Change Password
            openChangePassword,
            // #endregion Change Password

            // #region Forgot Password
            emailSent,
            isForgotPasswordEnabled,
            isLoadingSendEmail,
            isReCaptchaEnabled,
            openForgotPassword,
            reCaptchaSiteKey,
            reCaptchaError,
            userNameRecovery,
            userNameRecoveryModified
            // #endregion Forgot Password
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {

            if (openChangePassword) {
                contentPage = (
                    <Modal
                        disableBackdropClick
                        disableEscapeKeyDown
                        footer={(
                            <ButtonGroup id="btgChangePassword">
                                <Button
                                    disabled={isLoadingChangePassword}
                                    id="btnCancelChangePassword"
                                    color="secondary"
                                    onClick={this.onCloseChangePassword}
                                >
                                    {resources.btnCancel}
                                </Button>
                                <Button
                                    id="btnChangePassword"
                                    loading={isLoadingChangePassword}
                                    onClick={this.onChangePasswordButton}
                                >
                                    {resources.btnChangePassword}
                                </Button>
                            </ButtonGroup>
                        )}
                        id="changePasswordModal"
                        header={resources.lblChangePassword}
                        maxWidth="md"
                        open={openChangePassword}
                        onClose={this.onCloseChangePassword}
                    >
                        <Grid container>
                            <Grid item xs={12}>
                                <Text>
                                    {resources.lblChangePasswordInstructions}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <PasswordConfirmation
                                    data={{ userName: userName }}
                                    disabled={isLoadingChangePassword}
                                    route="/Password/PolicyByUserName"
                                />
                            </Grid>
                        </Grid>
                    </Modal>
                );
            }
            else {
                let title: JSX.Element | undefined;
                let content: JSX.Element | JSX.Element[] | undefined;
                let button: JSX.Element | undefined;

                if (openForgotPassword) {
                    title = (
                        <Grid container justifyContent="center" className={classes.spacingTitle}>
                            <Grid item>
                                <Text
                                    align="center"
                                    size="h1"
                                    weight="strong"
                                >
                                    {resources.lblForgotPasswordTitle}
                                </Text>
                            </Grid>
                        </Grid>
                    );

                    button = emailSent ? (
                        <Button
                            id="btnCloseForgotPassword"
                            loading={isLoadingSendEmail}
                            onClick={this.onCloseForgotPassword}
                        >
                            {resources.btnClose}
                        </Button>
                    )
                        : (
                            <ButtonGroup id="btgForgotPassword">
                                <Button
                                    disabled={isLoadingSendEmail}
                                    id="btnCancelForgotPassword"
                                    color="secondary"
                                    onClick={this.onCloseForgotPassword}
                                >
                                    {resources.btnCancel}
                                </Button>
                                <Button
                                    id="btnSendEmail"
                                    loading={isLoadingSendEmail}
                                    onClick={this.onSendEmail}
                                >
                                    {resources.btnSendEmail}
                                </Button>
                            </ButtonGroup>
                        );

                    content = (
                        <div role="form">
                            <Grid container spacing={2}>
                                <Grid item xs={12} >
                                    {!onClose && (
                                        <>
                                            {title}
                                        </>
                                    )}
                                    <Text aria-live="polite" role="alert">
                                        {emailSent ?
                                            Format.toString(resources.formatEmailSent, [userNameRecovery])
                                            : resources.lblForgotPasswordInstructions}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    {!emailSent && (
                                        <TextField
                                            autoComplete="username"
                                            className={classes.forgotText}
                                            disabled={isLoadingSendEmail}
                                            error={userNameRecoveryModified && !Boolean(userNameRecovery)}
                                            helperText={userNameRecoveryModified && !Boolean(userNameRecovery) ?
                                                resources.lblUserNameRequired : undefined}
                                            id="txtUserNameRecovery"
                                            label={resources.lblUserName}
                                            ref={this.userNameRecoveryRef}
                                            value={userNameRecovery}
                                            onChange={this.onChangeUserNameRecovery}
                                        />
                                    )}
                                </Grid>
                            </Grid>
                            {isReCaptchaEnabled && Boolean(reCaptchaSiteKey) && !emailSent && !isLoadingSendEmail && (
                                <Grid
                                    className={classes.reCaptchaContent}
                                    container
                                    alignItems="flex-end"
                                    direction="column"
                                    spacing={1}
                                >
                                    <Grid item>
                                        <ReCAPTCHA
                                            hl={uiCulture}
                                            ref={this.reCaptchaRef}
                                            sitekey={reCaptchaSiteKey}
                                            onChange={this.onRecaptchaChange}
                                            onExpired={this.onReCaptchaError}
                                            onErrored={this.onReCaptchaError}
                                        />
                                    </Grid>
                                    {reCaptchaError && (
                                        <Grid item>
                                            <Text className={classes.reCaptchaErrorText} color="error" size="small">
                                                {resources.lblReCaptchaRequired}
                                            </Text>
                                        </Grid>
                                    )}
                                </Grid>
                            )}
                            {!onClose && (
                                <Grid
                                    container
                                    justifyContent="flex-end"
                                >
                                    <Grid item xs={width === 'xs' ? 12 : false}>
                                        {button}
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                    );
                }
                else {
                    title = (
                        <>
                            <Grid container justifyContent="center" className={classes.spacingTitle}>
                                <Grid item>
                                    <Text
                                        align="center"
                                        size="h1"
                                        weight="strong"
                                    >
                                        {resources.lblLogInTitle}
                                    </Text>
                                </Grid>
                            </Grid>
                            {alert && (
                                <Grid container justifyContent="center" className={classes.spacingAlert}>
                                    <Grid item xs={12}>
                                        <Alert
                                            id="msgSignInAlert"
                                            open={Boolean(alert)}
                                            overModal={Boolean(onClose)}
                                            text={alert.message}
                                            type={alert.messageType}
                                            variant="inline"
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {Boolean(onGoSignUp && stepNumber === 1) && (
                                <Grid container justifyContent="center">
                                    <Grid item xs={12}>
                                        <Paragraph
                                            align="center"
                                            id="prgSignUp"
                                            text={resources.lblInstructions}
                                            events={[this.onGoSignUpModal]}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {stepNumber === 2 && (
                                <Grid container justifyContent="center">
                                    <Grid item>
                                        <Button
                                            disabled={isLoadingSignIn}
                                            id="btnAnotherAccount"
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={this.onUseAnotherAccount}
                                        >
                                            {resources.lblUseAnotherAccount}
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                        </>
                    );

                    button = stepNumber === 1 ? (
                        <Button
                            id="btnNext"
                            loading={isLoadingNext}
                            onClick={this.onNext}
                        >
                            {resources.btnNext}
                        </Button>
                    ) : (stepNumber === 2
                        && (!authMode || authMode === StoreMode.Identity || authMode === StoreMode.ActiveDirectory) ? (
                        <Button
                            id="btnSignIn"
                            loading={isLoadingSignIn}
                            onClick={this.onSignIn}
                        >
                            {resources.btnSingIn}
                        </Button>
                    ) : undefined);

                    content = (
                        <div role="form">
                            <Grid container>
                                <Grid item xs={12}>
                                    {!onClose && (
                                        <>
                                            {title}
                                        </>
                                    )}
                                    <TextField
                                        autoComplete="username"
                                        className={classes.loginText}
                                        disabled={Boolean(authMode || isLoadingNext || stepNumber === 2)}
                                        error={userNameModified && !Boolean(userName)}
                                        helperText={userNameModified && !Boolean(userName) ?
                                            resources.lblUserNameRequired : undefined}
                                        id="txtUserName"
                                        label={resources.lblUserName}
                                        ref={this.userNameRef}
                                        value={userName || ''}
                                        onChange={this.onChangeUserName}
                                        onEnterPress={this.onNext}
                                    />
                                    {stepNumber === 2
                                        && (!authMode || authMode === StoreMode.Identity || authMode === StoreMode.ActiveDirectory) && (
                                            <TextField
                                                autoComplete="new-password"
                                                className={classes.loginText}
                                                disabled={isLoadingSignIn}
                                                error={passwordModified && !Boolean(password)}
                                                helperText={passwordModified && !Boolean(password) ?
                                                    resources.lblPasswordRequired : undefined}
                                                id="txtPassword"
                                                label={resources.lblPassword}
                                                passwordToggle
                                                ref={this.passwordRef}
                                                type="password"
                                                value={password || ''}
                                                onChange={this.onChangePassword}
                                                onEnterPress={this.onSignIn}
                                            />
                                        )}
                                </Grid>
                            </Grid>
                            {isForgotPasswordEnabled && (
                                <Grid
                                    className={classes.forgotPasswordLink}
                                    container
                                    justifyContent="flex-end"
                                >
                                    <Grid item>
                                        <Button
                                            disabled={isLoadingNext || isLoadingSignIn}
                                            id="btnForgotPassword"
                                            align="right"
                                            textVariantStyling="inherit"
                                            variant="text"
                                            onClick={this.onClickForgotPassword}
                                        >
                                            {resources.btnForgot}
                                        </Button>
                                    </Grid>
                                </Grid>
                            )}
                            {!onClose && (
                                <Grid
                                    className={classes.signInButton}
                                    container
                                    justifyContent="flex-end"
                                >
                                    <Grid item xs={width === 'xs' ? 12 : false}>
                                        {button}
                                    </Grid>
                                </Grid>
                            )}
                        </div>
                    );
                }

                if (onClose) {
                    contentPage = (
                        <Modal
                            disableBackdropClick={isLoadingNext || isLoadingSignIn || isLoadingSendEmail}
                            disableEscapeKeyDown={isLoadingNext || isLoadingSignIn || isLoadingSendEmail}
                            disableHeaderTypography
                            id="signInModal"
                            footer={button}
                            header={title}
                            maxWidth="md"
                            open={open}
                            showTitleBarClose={!(isLoadingNext || isLoadingSignIn || isLoadingSendEmail)}
                            onClose={this.onCloseModal}
                        >
                            {content}
                        </Modal>
                    );
                }
                else {
                    contentPage = (
                        <Card className={classes.loginCard}>
                            <CardContent>
                                {content}
                            </CardContent>
                        </Card>
                    );
                }
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
export default withStyles(styles)(withWidth()(SignIn));