/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: SignUp.tsx
 * Type: Container component */

// #region Imports
import React, { RefObject } from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import PasswordConfirmation from '@hedtech/powercampus-design-system/react/components/PasswordConfirmation';
import ReCAPTCHA from '@hedtech/powercampus-design-system/react/core/ReCaptcha';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAccountValidations } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IAccountValidations';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IIdentityAccount, IIdentityAccountValidations } from '../../Types/Account/IIdentityAccount';
import { IPasswordPolicy, IPasswordPolicyResult, IPasswordPolicyErrors } from '../../Types/Generic/IPasswordPolicy';
import { ISignUpResources } from '../../Types/Resources/Generic/ISignUpResources';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import { emailIsValid } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import PasswordValidation from '@hedtech/powercampus-design-system/helpers/PasswordValidation';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Generic/SignUp';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PasswordConfirmationActions from '@hedtech/powercampus-design-system/flux/actions/PasswordConfirmationActions';
import PasswordConfirmationStore from '@hedtech/powercampus-design-system/flux/stores/PasswordConfirmationStore';
// #endregion Imports

// #region Types
export interface ISignUpProps {
    open?: boolean;
    type: 'ConEd' | 'Application' | 'SharedAccess';
    onAfterSignUp?: (userName?: string) => void;
    onClose?: () => void;
    onGoSignIn?: () => void;
}

interface ISignUpState {
    anchorEl: any;
    account: IIdentityAccount;
    cannotCreateAccount: boolean;
    emailRegExp?: string;
    isLoading: boolean;
    isLoadingSave: boolean;
    password?: string;
    passwordPolicy?: IPasswordPolicy;
    resources?: ISignUpResources;
    accountValidations?: IAccountValidations;
    validations: IIdentityAccountValidations;

    // #region ReCatpcha
    isReCaptchaEnabled: boolean;
    reCaptchaError: boolean;
    reCaptchaSiteKey: string;
    uiCulture: string;
    // #endregion ReCatpcha
}

const styles = createStyles({
    margin: {
        marginLeft: `-${Tokens.spacing40}`,
        marginTop: Tokens.spacing30,
    },
    popperText: {
        maxWidth: '15rem'
    },
    spacingButtons: {
        paddingTop: Tokens.spacing40
    },
    spacingInstructions: {
        paddingTop: Tokens.spacing40
    },
    textAlign: {
        textAlign: 'center'
    },
    reCaptchaErrorText: {
        paddingBottom: Tokens.spacing30
    },
});

type PropsWithStyles = ISignUpProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SignUp extends React.Component<PropsWithStyles, ISignUpState> {
    private idModule: string;
    private idPage: string;
    private reCaptchaRef: RefObject<any>;

    public readonly state: Readonly<ISignUpState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'SignUp';
        this.state = this.getInitialState();
        this.reCaptchaRef = React.createRef();
        // #endregion Initialize Variables and State
        // #region Bind State Management Listeners
        PasswordConfirmationStore.addPasswordValidationListener(this.onChangePassword);
        // #endregion State Management Listeners
    }

    private getInitialState(): ISignUpState {
        let isLoading: boolean = true;
        let resources: ISignUpResources | undefined;
        let isReCaptchaEnabled: boolean = false;
        let reCaptchaSiteKey: string = '';

        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
            isReCaptchaEnabled = this.state.isReCaptchaEnabled;
            reCaptchaSiteKey = this.state.reCaptchaSiteKey;
        }
        return {
            account: {
                email: '',
                firstName: '',
                lastName: '',
                password: '',
                peopleId: ''
            },
            accountValidations: undefined,
            validations: {
                emailInvalid: false,
                emailModified: false,
                existingUser: false,
                firstNameModified: false,
                lastNameModified: false,
            },
            anchorEl: null,
            cannotCreateAccount: false,
            isLoading: isLoading,
            isLoadingSave: false,
            resources: resources,

            // #region ReCaptcha
            isReCaptchaEnabled: isReCaptchaEnabled,
            reCaptchaError: false,
            reCaptchaSiteKey: reCaptchaSiteKey,
            uiCulture: LayoutStore.getCultures().uiCulture
            // #endregion ReCaptcha
        };
    }

    // #region Events

    private onChangePassword = (): void => {
        try {
            const {
                account
            } = this.state;
            const password = PasswordConfirmationStore.getPassword();
            account.password = password;
            this.setState({
                password: password,
                account: account,
                accountValidations: PasswordConfirmationStore.getPasswordValidation()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePassword.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                account,
                validations,
                emailRegExp,
            } = this.state;

            const id: string = event.target.id;
            const value: string = event.target.value;
            switch (id) {
                case 'txtFirstName':
                    account.firstName = value;
                    validations.firstNameModified = true;
                    break;
                case 'txtLastName':
                    account.lastName = value;
                    validations.lastNameModified = true;
                    break;
                case 'txtEmail':
                    account.email = value;
                    if (emailRegExp && account.email) {
                        validations.emailInvalid = !emailIsValid(account.email, emailRegExp);
                    }
                    else {
                        validations.emailInvalid = false;
                    }
                    validations.emailModified = true;
                    break;
            }
            this.setState({
                account: account,
                validations: validations
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCloseModal = (): void => {
        try {
            const {
                onClose
            } = this.props;

            const {
                isLoadingSave
            } = this.state;

            if (onClose && !isLoadingSave) {
                this.setState(this.getInitialState());
                onClose();
                PasswordConfirmationActions.setPasswordValidation();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseModal.name, e));
        }
    };

    private onCreateAccount = (): void => {
        try {
            const {
                type
            } = this.props;

            const {
                account,
                accountValidations,
                isReCaptchaEnabled,
                isLoadingSave,
                password,
                validations
            } = this.state;

            let isValid: boolean = true;
            if (!isLoadingSave) {
                validations.emailModified = true;
                validations.firstNameModified = true;
                validations.lastNameModified = true;

                if (accountValidations) {
                    let componentValidations: IAccountValidations = PasswordValidation.validatePassword(accountValidations, password,
                        PasswordConfirmationStore.getPasswordPolicy());
                    componentValidations = PasswordValidation.validateConfirmPassword(accountValidations, accountValidations.confirmPassword, password);
                    PasswordConfirmationActions.setPasswordValidation(password, componentValidations);
                    if (componentValidations.hasErrors) {
                        isValid = false;
                    }
                }

                let isValidRecaptcha: boolean = true;
                let reCaptchaResponse: string = '';

                if (isReCaptchaEnabled && this.reCaptchaRef?.current) {
                    reCaptchaResponse = this.reCaptchaRef.current.getValue();
                    isValidRecaptcha = Boolean(reCaptchaResponse);
                    this.setState({
                        reCaptchaError: !isValidRecaptcha
                    });
                }

                if (!isReCaptchaEnabled || reCaptchaResponse) {
                    this.setState({
                        reCaptchaError: false
                    });
                }

                if (isValid && isValidRecaptcha && Boolean(account.email)
                    && !validations.emailInvalid
                    && Boolean(account.firstName)
                    && Boolean(account.lastName)
                    && Boolean(account.password)) {
                    this.showLoaderSave();
                    switch (type) {
                        case 'Application':
                            Requests.postSignUpApplication(account, this.resolvePostSignUp, this.logError);
                            break;
                        case 'ConEd':
                            Requests.postSignUpConed(account, this.resolvePostSignUp, this.logError);
                            break;
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCreateAccount.name, e));
        }
    };

    private onGoSignInModal = (): void => {
        try {
            const {
                onGoSignIn
            } = this.props;

            const {
                isLoadingSave
            } = this.state;

            if (onGoSignIn && !isLoadingSave) {
                this.setState(this.getInitialState());
                onGoSignIn();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onGoSignInModal.name, e));
        }
    };

    // #region ReCaptcha
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
    // #endregion ReCaptcha

    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
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
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetEmailRegExp = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEmailRegExp.name, this.hideAllLoaders);
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

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data,
                    isLoading: false,
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostSignUp = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSignUp.name, this.hideAllLoaders);
            if (result?.status) {
                const resultSignUp: IPasswordPolicyResult = result.data;
                if (resultSignUp.status === 0) {
                    const {
                        onAfterSignUp
                    } = this.props;

                    const {
                        resources
                    } = this.state;

                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.lblCreatedSuccessfully,
                            messageType: ResultType.success
                        } as IAlert);
                        if (onAfterSignUp) {
                            onAfterSignUp(result.data.userName);
                        }
                        PasswordConfirmationActions.setPasswordValidation();
                        this.setState(this.getInitialState());
                    }
                }
                else if (resultSignUp.status === -1) {
                    if (resultSignUp.userAccountStatus == IPasswordPolicyErrors.unableToDefineUserName) {
                        this.setState({
                            cannotCreateAccount: true
                        });
                        PasswordConfirmationActions.setPasswordValidation();
                    }
                    else if (resultSignUp.userAccountStatus == IPasswordPolicyErrors.userAlreadyExists) {
                        const {
                            validations
                        } = this.state;

                        if (validations) {
                            validations.existingUser = true;
                            this.setState({
                                validations: validations,
                                password: '',
                                cannotCreateAccount: true
                            });
                            PasswordConfirmationActions.setPasswordValidation();
                        }
                    }
                }
                else {
                    this.showError();
                }
                this.hideLoaderSave();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSignUp.name, e));
        }
    };

    private resolveGetReCaptchaSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetReCaptchaSettings.name);
            if (result?.status) {
                this.setState({
                    isReCaptchaEnabled: result.data.isReCaptchaEnabled,
                    reCaptchaSiteKey: result.data.reCaptchaSiteKey || ''
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetReCaptchaSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getEmailRegExp(this.resolveGetEmailRegExp, this.logError);
            Requests.getReCaptchaSettings(this.resolveGetReCaptchaSettings);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        PasswordConfirmationStore.removePasswordValidationListener(this.onChangePassword);
    }

    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            open,
            onClose,
            onGoSignIn,
            type,
        } = this.props;

        const {
            account,
            cannotCreateAccount,
            isLoading,
            isLoadingSave,
            resources,
            validations,

            // #region ReCaptcha
            isReCaptchaEnabled,
            reCaptchaError,
            reCaptchaSiteKey,
            uiCulture
            // #endregion ReCaptcha
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {
            let title: JSX.Element | undefined;
            let newAccountContent: JSX.Element | JSX.Element[] | undefined;
            let button: JSX.Element | undefined;
            let reCaptchaElement: JSX.Element | undefined;

            // #region First Name
            let errorFirstName: boolean = false;
            let errorTextFirstName: string | undefined;
            if (validations.firstNameModified) {
                errorFirstName = !Boolean(account.firstName);
                errorTextFirstName = errorFirstName ?
                    resources.lblFirstNameRequired
                    : undefined;
            }
            // #endregion First Name

            // #region Last Name
            let errorLastName: boolean = false;
            let errorTextLastName: string | undefined;
            if (validations.lastNameModified) {
                errorLastName = !Boolean(account.lastName);
                errorTextLastName = errorLastName ?
                    resources.lblLastNameRequired
                    : undefined;
            }
            // #endregion Last Name

            // #region  Email
            let errorEmail: boolean = false;
            let errorTextEmail: string | undefined;
            if (validations.emailModified) {
                errorEmail = !Boolean(account.email)
                    || validations.emailInvalid
                    || validations.existingUser;
                errorTextEmail = !Boolean(account.email) ?
                    resources.lblEmailRequired
                    : (validations.emailInvalid ?
                        resources.lblEmailInvalid
                        : validations.existingUser ?
                            resources.lblExistingUser
                            : undefined);
            }
            // #endregion Email

            if (!cannotCreateAccount) {
                title = (
                    <>
                        <Text align="center" size="h2">
                            {resources.lblCreateAccount}
                        </Text>
                        {onGoSignIn && (
                            <Paragraph
                                align="center"
                                className={classes.spacingInstructions}
                                id="prgSignIn"
                                text={resources.lblInstructions}
                                events={[this.onGoSignInModal]}
                            />
                        )}
                    </>
                );

                button = (
                    <Button
                        id="btnCreateAccount"
                        loading={isLoadingSave}
                        onClick={this.onCreateAccount}
                    >
                        {resources.btnCreateAccount}
                    </Button>
                );
            }

            if (isReCaptchaEnabled) {
                reCaptchaElement = (
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <ReCAPTCHA
                                hl={uiCulture}
                                ref={this.reCaptchaRef}
                                sitekey={reCaptchaSiteKey}
                                onChange={this.onRecaptchaChange}
                                onExpired={this.onReCaptchaError}
                                onErrored={this.onReCaptchaError}
                            />
                            {reCaptchaError && (
                                <Grid item>
                                    <Text className={classes.reCaptchaErrorText} color="error" size="small">
                                        {resources.lblReCaptchaRequired}
                                    </Text>
                                </Grid>
                            )}
                        </Grid>
                    </Grid>
                );
            }

            if (cannotCreateAccount) {
                title = (
                    <>
                        <Text align="center" size="h2">
                            {resources.lblCreateAccount}
                        </Text>
                    </>
                );
                newAccountContent = (
                    <Grid container justifyContent="center">
                        <Grid item className={classes.textAlign}>
                            <img
                                src={`${Constants.imagesCDN}/illustrations/large/400Narrow.png`}
                            />
                            <Text>
                                {resources.lblCannotCreateAccount}
                            </Text>
                        </Grid>
                    </Grid>
                );
            }
            else {
                newAccountContent = (
                    <>
                        {!onClose && (
                            <Grid container>
                                <Grid item>
                                    {title}
                                </Grid>
                            </Grid>
                        )}

                        <Grid container>
                            <Grid item xs={12}>
                                <PasswordConfirmation
                                    data={{ appArea: type }}
                                    noCompareAgainstPreviousPwd
                                    route="/Password/Policy"
                                    topElements={[(
                                        <Grid container>
                                            <Grid item xs={12}>
                                                <Text size="h3">
                                                    {resources.lblContactInformation}
                                                </Text>
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    disabled={isLoadingSave}
                                                    error={errorFirstName}
                                                    id="txtFirstName"
                                                    helperText={errorTextFirstName}
                                                    label={resources.lblFirstName}
                                                    maxCharacters={60}
                                                    required
                                                    value={account.firstName}
                                                    onChange={this.onChangeTextField}
                                                    onEnterPress={this.onCreateAccount}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <TextField
                                                    disabled={isLoadingSave}
                                                    error={errorLastName}
                                                    id="txtLastName"
                                                    helperText={errorTextLastName}
                                                    label={resources.lblLastName}
                                                    maxCharacters={60}
                                                    required
                                                    value={account.lastName}
                                                    onChange={this.onChangeTextField}
                                                    onEnterPress={this.onCreateAccount}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <TextField
                                                    disabled={isLoadingSave}
                                                    error={errorEmail}
                                                    id="txtEmail"
                                                    helperText={errorTextEmail}
                                                    label={resources.lblEmail}
                                                    maxCharacters={255}
                                                    required
                                                    value={account.email}
                                                    onChange={this.onChangeTextField}
                                                    onEnterPress={this.onCreateAccount}
                                                />
                                            </Grid>
                                        </Grid>
                                    )]}
                                />
                            </Grid>
                        </Grid>

                        {!onClose && (
                            <Grid
                                container
                                alignItems="flex-end"
                                className={classes.spacingButtons}
                                direction="column"
                            >
                                <Grid item>
                                    {button}
                                </Grid>
                            </Grid>
                        )}
                    </>
                );
            }


            if (onClose) {
                contentPage = (
                    <Modal
                        disableBackdropClick
                        disableEscapeKeyDown
                        disableHeaderTypography
                        id="createAccountModal"
                        footer={button}
                        header={title}
                        maxWidth="md"
                        open={open}
                        onClose={this.onCloseModal}
                    >
                        {newAccountContent}
                        {reCaptchaElement}
                    </Modal>
                );
            }
            else {
                contentPage = (
                    <>
                        {newAccountContent}
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
export default withStyles(styles)(SignUp);