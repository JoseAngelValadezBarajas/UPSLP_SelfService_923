/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AgreementModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import FormControl from '@hedtech/powercampus-design-system/react/core/FormControl';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAgreementDetail } from '../../Types/Agreements/IAgreementDetail';
import { IAgreementModalResources } from '../../Types/Resources/Generic/IAgreementModalResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../Requests/Generic/AgreementModal';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IAgreementModalProps {
    agreement: IAgreementDetail;
    lblSuccessSave: string;
    mandatory: boolean;
    open: boolean;
    yearTerm?: string;
    onClose: () => void;
    onRegister?: () => void;
    onSaved?: () => void;
}

interface IAgreementModalState {
    acceptance: boolean;
    componentError: boolean;
    errorAcceptance: boolean;
    resources?: IAgreementModalResources;
}

const styles = createStyles({
    buttonFooter: {
        textAlign: 'right'
    },
    containerFooter: {
        width: '100%'
    },
    messageMargin: {
        marginTop: Tokens.sizingLarge
    }
});

type PropsWithStyles = IAgreementModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class AgreementModal extends React.Component<PropsWithStyles, IAgreementModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IAgreementModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'AgreementModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAgreementModalState {
        let resources: IAgreementModalResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            acceptance: false,
            componentError: false,
            errorAcceptance: false,
            resources: resources
        };
    }

    // #region Events
    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                acceptance: event.target.checked,
                errorAcceptance: !event.target.checked
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onValidateCheckbox = (): void => {
        try {
            const {
                acceptance
            } = this.state;

            this.setState({
                errorAcceptance: !acceptance
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onSaveAgreement = (e: React.SyntheticEvent): void => {
        try {
            e.preventDefault();
            const {
                agreement,
                yearTerm,
                onClose
            } = this.props;

            const {
                acceptance
            } = this.state;

            if (acceptance) {
                onClose();
                LayoutActions.setLoading(true);
                Requests.postSaveAgreement(0, agreement.id, yearTerm || '', this.resolvePostSaveAgreement, this.logError);
            }
            else {
                this.setState({
                    errorAcceptance: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAgreement.name, e));
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
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);
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

    private resolvePostSaveAgreement = (json: string): void => {
        try {
            const {
                lblSuccessSave,
                mandatory,
                onRegister,
                onSaved
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAgreement.name);
            if (result?.status) {
                if (result.data.result) {
                    if (mandatory) {
                        if (onRegister) {
                            onRegister();
                        }
                    }
                    else {
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                        LayoutActions.setLoading(false);
                    }
                    if (onSaved) {
                        onSaved();
                    }
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAgreement.name, e));
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

    public render(): JSX.Element {
        const {
            agreement,
            classes,
            mandatory,
            open,
            onClose
        } = this.props;

        const {
            acceptance,
            componentError,
            errorAcceptance,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            contentPage = (
                <Modal
                    disableBackdropClick={mandatory}
                    disableEscapeKeyDown={mandatory}
                    disableHeaderTypography
                    id="agreementModal"
                    header={(
                        <div className={classes.messageMargin}>
                            <Alert
                                id="msgReadAgreements"
                                open
                                text={resources.lblMessage}
                                type={ResultType.info}
                            />
                            <Text size="h2">
                                {agreement.title}
                            </Text>
                        </div>
                    )}
                    footer={(
                        <div>
                            <form onSubmit={this.onSaveAgreement}>
                                <FormControl>
                                    <Grid container alignItems="center" className={classes.containerFooter}>
                                        <Grid item xs={12}>
                                            <Checkbox
                                                checked={acceptance}
                                                error={errorAcceptance}
                                                helperText={errorAcceptance ? resources.lblAcceptanceRequired : undefined}
                                                id="chkAcceptance"
                                                inputProps={{
                                                    'required': 'true'
                                                }}
                                                label={`${agreement.acceptance}*`}
                                                onChange={this.onChangeCheckbox}
                                                onInvalid={this.onValidateCheckbox}
                                            />
                                        </Grid>
                                        <Grid item xs={12} className={classes.buttonFooter}>
                                            <ButtonGroup id="bgSaveAddress">
                                                <Button
                                                    id="btnCancel"
                                                    onClick={onClose}
                                                    color="secondary"
                                                >
                                                    {resources.btnCancel}
                                                </Button>
                                                <Button
                                                    id={mandatory ? 'btnRegister' : 'btnSave'}
                                                    type="submit"
                                                >
                                                    {mandatory ? resources.btnRegister : resources.btnSave}
                                                </Button>
                                            </ButtonGroup>
                                        </Grid>
                                    </Grid>
                                </FormControl>
                            </form>
                        </div>
                    )}
                    maxWidth="sm"
                    open={open}
                    onClose={onClose}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <Text>
                                <div dangerouslySetInnerHTML={{ __html: agreement.content }} />
                            </Text>
                        </Grid>
                    </Grid>
                </Modal>
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
export default withStyles(styles)(AgreementModal);