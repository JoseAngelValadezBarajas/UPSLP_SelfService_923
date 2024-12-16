/* Copyright 2020 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AccountConfirmationView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import PasswordConfirmation from '@hedtech/powercampus-design-system/react/components/PasswordConfirmation';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import SignIn from '../../Generic/SignIn';

// Types
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAccountConfirmationResources } from '../../../Types/Resources/Home/IAccountConfirmationResources';
import { IAccountValidations } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IAccountValidations';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IIdentityAccount } from '../../../Types/Account/IIdentityAccount';
import { IAccountInvitation } from '../../../Types/Invitations/IAccountInvitation';
import { IPasswordPolicy, IPasswordPolicyErrors, IPasswordPolicyResult, IValidatePassword } from '../../../Types/Generic/IPasswordPolicy';

// Helpers
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import PasswordValidation from '@hedtech/powercampus-design-system/helpers/PasswordValidation';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import Requests from '../../../Requests/Home/AccountConfirmation';
import RequestsGeneric from '../../../Requests/Generic/SignUp';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PasswordConfirmationActions from '@hedtech/powercampus-design-system/flux/actions/PasswordConfirmationActions';
import PasswordConfirmationStore from '@hedtech/powercampus-design-system/flux/stores/PasswordConfirmationStore';
// #endregion Imports

// #region Types
interface IAccountConfirmationState {
    accountValidations?: IAccountValidations;
    cannotCreateAccount: boolean;
    invitation?: IAccountInvitation;
    isLoading: boolean;
    isLoadingSave: boolean;
    isSignIn: boolean;
    password: string;
    passwordPolicy?: IPasswordPolicy;
    validatePassword: IValidatePassword;
    resources?: IAccountConfirmationResources;
}

const styles = createStyles({
    confirmationCard: {
        animation: 'slidein 1s',
        marginTop: Tokens.spacing80,
        maxWidth: '800px'
    },
    margin: {
        marginLeft: `-${Tokens.spacing60}`,
        marginTop: Tokens.spacing50,
    },
    passwordText: {
        marginTop: `${Tokens.spacing40}!important`
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
    spacingTitle: {
        marginBottom: Tokens.spacing40
    },
    textAlign: {
        textAlign: 'center'
    }
});

type PropsWithStyles = WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class AccountConfirmationView extends React.Component<PropsWithStyles, IAccountConfirmationState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IAccountConfirmationState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Home';
        this.idPage = 'AccountConfirmation';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        PasswordConfirmationStore.addPasswordValidationListener(this.onChangePassword);
        // #endregion State Management Listeners
    }

    private getInitialState(): IAccountConfirmationState {
        let isLoading: boolean = true;
        let resources: IAccountConfirmationResources | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            cannotCreateAccount: false,
            isLoading: isLoading,
            isLoadingSave: false,
            isSignIn: false,
            validatePassword: {
                areaName: '',
                password: ''
            },
            password: '',
            resources: resources
        };
    }

    // #region Events

    private onCreateAccount = (): void => {
        try {
            const {
                accountValidations,
                invitation,
                isLoadingSave,
                password,
                validatePassword
            } = this.state;

            if (!isLoadingSave && accountValidations) {
                accountValidations.confirmPasswordModified = true;
                accountValidations.passwordModified = true;
                let isValid: boolean = true;
                PasswordConfirmationActions.setPasswordValidation();
                this.setState({
                    accountValidations: accountValidations
                });
                if (accountValidations.hasPasswordPolicy) {
                    let validations: IAccountValidations = PasswordValidation.validatePassword(accountValidations, password,
                        PasswordConfirmationStore.getPasswordPolicy());
                    validations = PasswordValidation.validateConfirmPassword(accountValidations, accountValidations.confirmPassword, password);
                    validations.isNotPreviousPassword = false;
                    PasswordConfirmationActions.setPasswordValidation(password, validations);
                    if (validations.hasErrors)
                        isValid = false;

                    validatePassword.areaName = "SharedAccess";
                    validatePassword.password = password;
                    if (isValid) {
                        RequestsGeneric.postValidatePassword(validatePassword, this.resolvePostValidatePassword, this.logError);
                    }
                }
                else {
                    if (invitation && password && accountValidations.confirmPassword && password === accountValidations.confirmPassword) {
                        this.showLoaderSave();
                        const account: IIdentityAccount = {
                            email: invitation.email,
                            firstName: invitation.firstName,
                            lastName: invitation.lastName,
                            password: password,
                            peopleId: invitation.peopleId,
                            personId: invitation.personId,
                            token: invitation.token
                        };
                        Requests.signUpSharedAccess(account, this.resolveSignUpSharedAccess);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCreateAccount.name, e));
        }
    };

    private onChangePassword = (): void => {
        try {
            const password = PasswordConfirmationStore.getPassword();
            this.setState({
                password: password,
                accountValidations: PasswordConfirmationStore.getPasswordValidation()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePassword.name, e));
        }
    };

    private onSignIn = (): void => {
        try {
            this.setState({
                isSignIn: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSignIn.name, e));
        }
    };
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
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    };

    private showError = (message?: string): void => {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    };
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                LayoutActions.hidePageLoader();
                const hdnAccountInvitation: HTMLInputElement | undefined =
                    document.getElementById('hdnAccountInvitation') as HTMLInputElement;
                if (hdnAccountInvitation && hdnAccountInvitation.value) {
                    const invitation: IAccountInvitation = JSON.parse(hdnAccountInvitation.value);
                    if (invitation) {
                        this.setState({
                            invitation: invitation,
                            isLoading: false
                        });
                        hdnAccountInvitation.remove();
                    }
                    else {
                        this.redirectError(404);
                    }
                }
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

    private resolvePostValidatePassword = (json: string): void => {
        try {
            const {
                accountValidations,
                invitation,
                password
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidatePassword.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data.isValid && invitation && accountValidations) {
                    const account: IIdentityAccount = {
                        email: invitation.email,
                        firstName: invitation.firstName,
                        lastName: invitation.lastName,
                        password: password,
                        peopleId: invitation.peopleId,
                        personId: invitation.personId,
                        token: invitation.token
                    };
                    if (Boolean(accountValidations.confirmPassword)
                        && Boolean(account.email)
                        && !accountValidations.emailInvalid
                        && Boolean(account.firstName)
                        && Boolean(account.lastName)
                        && Boolean(account.password)
                        && account.password === accountValidations.confirmPassword) {
                        this.showLoaderSave();
                        Requests.signUpSharedAccess(account, this.resolveSignUpSharedAccess);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidatePassword.name, e));
        }
    };

    private resolveSignUpSharedAccess = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSignUpSharedAccess.name, this.hideAllLoaders);
            if (result?.status) {
                const resultSignUp: IPasswordPolicyResult = result.data;
                if (resultSignUp.status === 0) {
                    const {
                        invitation,
                        resources
                    } = this.state;

                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.lblCreatedSuccessfully,
                            messageType: ResultType.success
                        } as IAlert);
                    }
                    if (invitation) {
                        invitation.userName = result.data.userName;
                        this.setState({
                            invitation: invitation
                        }, this.onSignIn);
                    }
                }
                else if (resultSignUp.status === 1) {
                    if (resultSignUp.passwordValidation == IPasswordPolicyErrors.unableToDefineUserName) {
                        this.setState({
                            cannotCreateAccount: true
                        });
                    }
                    else if (resultSignUp.passwordValidation == IPasswordPolicyErrors.userAlreadyExists) {
                        const {
                            accountValidations
                        } = this.state;

                        if (accountValidations) {
                            accountValidations.existingUser = true;
                            this.setState({
                                accountValidations: accountValidations,
                                cannotCreateAccount: false
                            });
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
            this.logError(LogData.fromException(this.resolveSignUpSharedAccess.name, e));
        }
    };
    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IAccountConfirmationResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.logError(LogData.layoutNoReady(this.onLayoutReady.name));
            this.redirectError(500);
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
        PasswordConfirmationActions.setPasswordValidation();
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            width
        } = this.props;

        const {
            cannotCreateAccount,
            invitation,
            isLoading,
            isLoadingSave,
            isSignIn,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {
            if (isSignIn && invitation) {
                contentPage = (
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={10} md={8} lg={4}>
                            <SignIn userName={invitation.userName} />
                        </Grid>
                    </Grid>
                );
            }
            else {
                if (cannotCreateAccount) {
                    contentPage = (
                        <>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text align="center" size="h2">
                                        {resources.lblCreateAccount}
                                    </Text>
                                </Grid>
                            </Grid>
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
                        </>
                    );
                }
                else {
                    contentPage = (
                        <Grid container justifyContent="center">
                            <Grid item xs={12} sm={8} md={5}>
                                <Card className={classes.confirmationCard}>
                                    <CardContent>
                                        <Text className={classes.spacingTitle} size="h1" align="center">
                                            {invitation?.hasAccount ? resources.lblConfirmedInvitation : resources.lblConfirmInvitation}
                                        </Text>
                                        {invitation?.fullName && (
                                            <Text size="h2" align="center">
                                                {Format.toString(resources.formatWelcome, [invitation.fullName])}
                                            </Text>
                                        )}
                                        {invitation?.hasAccount ? (
                                            <>
                                                <Text className={classes.spacingInstructions}>
                                                    {resources.lblExistingAccountMessage}
                                                </Text>
                                                <Grid
                                                    container
                                                    className={classes.spacingButtons}
                                                    justifyContent="flex-end"
                                                >
                                                    <Grid item xs={width === 'xs' ? 12 : false}>
                                                        <Button
                                                            id="btnSignIn"
                                                            onClick={this.onSignIn}
                                                        >
                                                            {resources.btnSignIn}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <Text className={classes.spacingInstructions}>
                                                            {resources.lblNewAccountMessage}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid item xs={12} md={12}>
                                                        <PasswordConfirmation
                                                            data={{ appArea: "SharedAccess" }}
                                                            noCompareAgainstPreviousPwd
                                                            route="/Password/Policy"
                                                        />
                                                    </Grid>
                                                </Grid>
                                                <Grid
                                                    container
                                                    className={classes.spacingButtons}
                                                    justifyContent="flex-end"
                                                >
                                                    <Grid item xs={width === 'xs' ? 12 : false}>
                                                        <Button
                                                            id="btnCreateAccount"
                                                            loading={isLoadingSave}
                                                            onClick={this.onCreateAccount}
                                                        >
                                                            {resources.btnCreateAccount}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )}
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    );
                }
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
                withBackgroundImage
                withFooter
            >
                {contentPage}
            </Layout>
        );
    }
}

const AccountConfirmationViewWithLayout = withLayout(withStyles(styles)(withWidth()(AccountConfirmationView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<AccountConfirmationViewWithLayout />, document.getElementById('root'));