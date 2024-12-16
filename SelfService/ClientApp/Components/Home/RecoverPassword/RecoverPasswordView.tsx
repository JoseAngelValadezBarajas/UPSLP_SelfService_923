/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: RecoverPasswordView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import PasswordConfirmation from '@hedtech/powercampus-design-system/react/components/PasswordConfirmation';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IAccountValidations } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IAccountValidations';
import { IChangePasswordResponse } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IChangePasswordResponse';
import { IPasswordConfirmationResources } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IPasswordConfirmationResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IPasswordChange } from '../../../Types/Account/IPasswordChange';
import { IRecoverPasswordResources } from '../../../Types/Resources/Home/IRecoverPasswordResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import PasswordValidation from '@hedtech/powercampus-design-system/helpers/PasswordValidation';
import Redirect from '@hedtech/powercampus-design-system/helpers/Redirect';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import Requests from '../../../Requests/Home/RecoverPasswordRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PasswordConfirmationActions from '@hedtech/powercampus-design-system/flux/actions/PasswordConfirmationActions';
import PasswordConfirmationStore from '@hedtech/powercampus-design-system/flux/stores/PasswordConfirmationStore';
// #endregion Imports

// #region Types
interface IRecoverPasswordState {
    accountValidations?: IAccountValidations;
    isLoading: boolean;
    recoveryCode: string;
    resources?: IRecoverPasswordRes;

    // #region Change Password
    isLoadingChangePassword: boolean;
    newPassword: string;
    // #endregion Change Password
}

export interface IRecoverPasswordRes extends IRecoverPasswordResources {
    passwordConfirmation: IPasswordConfirmationResources;
}

const styles = createStyles({
    confirmationCard: {
        animation: 'slidein 1s',
        marginTop: Tokens.spacing80,
        maxWidth: '800px'
    },
    spacingButtons: {
        paddingTop: Tokens.spacing40
    },
    spacingInstructions: {
        paddingTop: Tokens.spacing40
    },
    spacingTitle: {
        marginBottom: Tokens.spacing40
    }
});

type PropsWithStyles = WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class RecoverPasswordView extends React.Component<PropsWithStyles, IRecoverPasswordState> {
    private idModule: string;
    private idPage: string;
    private userId: number;

    public readonly state: Readonly<IRecoverPasswordState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Home';
        this.idPage = 'RecoverPassword';
        this.state = this.getInitialState();
        this.userId = 0;
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        PasswordConfirmationStore.addPasswordValidationListener(this.onChangePasswordValidation);
        // #endregion State Management Listeners
    }

    private getInitialState(): IRecoverPasswordState {
        let isLoading: boolean = true;
        let resources: IRecoverPasswordRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            isLoading: isLoading,
            recoveryCode: '',
            resources: resources,

            // #region Change Password
            isLoadingChangePassword: false,
            newPassword: ''
            // #endregion Change Password
        };
    }

    // #region Events
    private onCancel = (): void => {
        try {
            Redirect.toHome();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancel.name, e));
        }
    };

    private onRecoverPassword = (): void => {
        try {
            const {
                accountValidations,
                newPassword,
                recoveryCode
            } = this.state;

            let isValid: boolean = true;
            if (accountValidations) {
                let validations: IAccountValidations = PasswordValidation.validatePassword(accountValidations, newPassword,
                    PasswordConfirmationStore.getPasswordPolicy());
                validations = PasswordValidation.validateConfirmPassword(accountValidations, accountValidations.confirmPassword, newPassword);
                PasswordConfirmationActions.setPasswordValidation(newPassword, validations);

                if (validations.hasErrors) {
                    PasswordConfirmationActions.setPasswordValidation(newPassword, validations);
                    isValid = false;
                }
            }

            if (isValid && newPassword) {
                this.showLoaderChangePassword();
                const passwordChange: IPasswordChange = {
                    newPassword: newPassword,
                    recoveryCode: recoveryCode
                };
                Requests.recoverPassword(passwordChange, this.resolveRecoverPassword);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRecoverPassword.name, e));
        }
    };

    private onChangePasswordValidation = (): void => {
        try {
            this.setState({
                accountValidations: PasswordConfirmationStore.getPasswordValidation(),
                newPassword: PasswordConfirmationStore.getPassword()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePasswordValidation.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingChangePassword: false
        });
    };

    private hideLoaderChangePassword = (): void => {
        this.setState({
            isLoadingChangePassword: false
        });
    };

    private showLoaderChangePassword = (): void => {
        this.setState({
            isLoadingChangePassword: true
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

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                const hdnRecoveryCode: HTMLInputElement | undefined =
                    document.getElementById('hdnRecoveryCode') as HTMLInputElement;
                if (hdnRecoveryCode && hdnRecoveryCode.value) {
                    const recoveryCodeDecoded: string = window.atob(hdnRecoveryCode.value);
                    const recoveryCodeParts: string[] = recoveryCodeDecoded.split('/');
                    this.userId = Number(recoveryCodeParts[1]);
                    this.setState({
                        isLoading: false,
                        recoveryCode: hdnRecoveryCode.value
                    }, LayoutActions.hidePageLoader);
                    hdnRecoveryCode.remove();
                }
                else {
                    this.redirectError(404);
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

    private resolveRecoverPassword = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveRecoverPassword.name, this.hideAllLoaders);
            if (result?.status) {
                const response: IChangePasswordResponse = result.data;
                if (response.updatedSuccessfully) {
                    Redirect.toLogin();
                }
                else if (response.errors.length > 0) {
                    const {
                        resources
                    } = this.state;
                    this.showError(resources?.lblGenericError);
                    this.hideLoaderChangePassword();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveRecoverPassword.name, e));
        }
    };

    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: IRecoverPasswordRes | undefined = LayoutStore.getResources();

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
        PasswordConfirmationStore.removePasswordValidationListener(this.onChangePasswordValidation);
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            width
        } = this.props;

        const {
            isLoading,
            isLoadingChangePassword,
            recoveryCode,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading && recoveryCode) {
            contentPage = (
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8} lg={4}>
                        <Card className={classes.confirmationCard}>
                            <CardContent>
                                <Text className={classes.spacingTitle} size="h1" align="center">
                                    {resources.lblRecoverPasswordTitle}
                                </Text>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Text>
                                            {resources.lblRecoverPasswordInstructions}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <PasswordConfirmation
                                            data={{ appUserId: this.userId }}
                                            disabled={isLoadingChangePassword}
                                            noCompareAgainstPreviousPwd
                                            resourcesToOverwrite={resources.passwordConfirmation}
                                            route="/Password/PolicyByUserId"
                                        />
                                    </Grid>
                                </Grid>
                                <Grid
                                    container
                                    className={classes.spacingButtons}
                                    justifyContent="flex-end"
                                >
                                    <Grid item xs={width === 'xs' ? 12 : false}>
                                        <ButtonGroup id="btgRecoverPassword">
                                            <Button
                                                disabled={isLoadingChangePassword}
                                                id="btnCancel"
                                                color="secondary"
                                                onClick={this.onCancel}
                                            >
                                                {resources.btnCancel}
                                            </Button>
                                            <Button
                                                id="btnChangePassword"
                                                loading={isLoadingChangePassword}
                                                onClick={this.onRecoverPassword}
                                            >
                                                {resources.btnChangePassword}
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            );
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

const RecoverPasswordViewWithLayout = withLayout(withStyles(styles)(withWidth()(RecoverPasswordView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<RecoverPasswordViewWithLayout />, document.getElementById('root'));