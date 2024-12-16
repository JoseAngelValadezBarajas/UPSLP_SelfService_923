/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SignOutConfirmationView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Button, { ButtonGroup} from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { ISignOutConfirmationResources } from '../../../Types/Resources/Home/ISignOutConfirmationResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISignOutValidation } from '../../../Types/Account/ISignOutValidation';
import { SignOutRedirectLocation } from '../../../Types/Account/SignOutRedirectLocation';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Redirect from '@hedtech/powercampus-design-system/helpers/Redirect';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
// #endregion Imports

// #region Types
interface ISignOutConfirmationState {
    isLoading: boolean;
    resources?: ISignOutConfirmationResources;
    signOutValidation?: ISignOutValidation;
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
class SignOutConfirmationView extends React.Component<PropsWithStyles, ISignOutConfirmationState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ISignOutConfirmationState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Home';
        this.idPage = 'SignOutConfirmation';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ISignOutConfirmationState {
        let isLoading: boolean = true;
        let resources: ISignOutConfirmationResources | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            isLoading: isLoading,
            resources: resources,
            signOutValidation: undefined
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

    private onContinue = (): void => {
        try {
            const {
                signOutValidation
            } = this.state;

            if (signOutValidation?.redirectLocation === SignOutRedirectLocation.Default) {
                Redirect.toLogout();
            }
            else if (signOutValidation?.token) {
                window.location.assign(`${Constants.webUrl}/Home/LogOut/${signOutValidation.token}/${signOutValidation.redirectLocation}`);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onContinue.name, e));
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
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
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

                const hdnSignOutValidation: HTMLInputElement | undefined =
                    document.getElementById('hdnSignOutValidation') as HTMLInputElement;
                if (hdnSignOutValidation && hdnSignOutValidation.value) {
                    const signOutValidation: ISignOutValidation = JSON.parse(hdnSignOutValidation.value);
                    if (signOutValidation?.token) {
                        this.setState({
                            isLoading: false,
                            signOutValidation: signOutValidation
                        }, LayoutActions.hidePageLoader);
                        hdnSignOutValidation.remove();
                    }
                    else {
                        this.redirectError(404);
                    }
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

    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: ISignOutConfirmationResources | undefined = LayoutStore.getResources();

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
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            width
        } = this.props;

        const {
            isLoading,
            resources,
            signOutValidation
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading && signOutValidation?.token) {
            let message: string = '';
            switch (signOutValidation.redirectLocation) {
                case SignOutRedirectLocation.Default:
                    message = Format.toString(resources.formatDefaultMessage, [signOutValidation.loggedUserName]);
                    break;
                case SignOutRedirectLocation.RecoverPassword:
                    if (signOutValidation.isSameUser) {
                        message = resources.lblRecoveryMessageSameUser;
                    }
                    else {
                        message = Format.toString(resources.formatRecoveryMessage, [signOutValidation.loggedUserName]);
                    }
                    break;
                case SignOutRedirectLocation.InvitationConfirmation:
                    if (signOutValidation.isSameUser) {
                        message = resources.lblConfirmationMessageSameUser;
                    }
                    else {
                        message = Format.toString(resources.formatConfirmationMessage, [signOutValidation.loggedUserName]);
                    }
                    break;
            }

            contentPage = (
                <Grid container justifyContent="center">
                    <Grid item xs={12} sm={10} md={8} lg={4}>
                        <Card className={classes.confirmationCard}>
                            <CardContent>
                                <Text className={classes.spacingTitle} size="h1" align="center">
                                    {resources.lblSignOut}
                                </Text>
                                <Text className={classes.spacingInstructions}>
                                    {message}
                                </Text>
                                <Grid
                                    container
                                    className={classes.spacingButtons}
                                    justifyContent="flex-end"
                                >
                                    <Grid item xs={width === 'xs' ? 12 : false}>
                                        <ButtonGroup id="btgSignOutConfirmation">
                                            <Button
                                                color="secondary"
                                                id="btnCancel"
                                                onClick={this.onCancel}
                                            >
                                                {resources.btnCancel}
                                            </Button>
                                            <Button
                                                id="btnContinue"
                                                onClick={this.onContinue}
                                            >
                                                {resources.btnContinue}
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

const SignOutConfirmationViewWithLayout = withLayout(withStyles(styles)(withWidth()(SignOutConfirmationView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<SignOutConfirmationViewWithLayout />, document.getElementById('root'));