/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: EmailModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IEmail } from '../../Types/Generic/IEmail';
import { IEmailModalResources } from '../../Types/Resources/Generic/IEmailModalResources';
import { IEmailSettings } from '../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { Sender } from '../../Types/Enum/EmailProviderOption';

// Helpers
import { emailIsValid } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../Requests/Generic/EmailModal';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IEmailModalProps {
    currentAccountEmail?: string;
    emailRegExp?: string;
    emailSettings: IEmailSettings;
    recipientsEmailAddresses: string[];
    recipientsName?: string;
    onClose: () => void;
}

interface IEmailModalState {
    email: IEmail;
    emailRegExp?: string;
    isLoading: boolean;
    resources?: IEmailModalResources;
}
// #endregion Types

// #region Component
class EmailModal extends React.Component<IEmailModalProps, IEmailModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IEmailModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'EmailModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IEmailModalState {
        let isLoading: boolean = true;
        let resources: IEmailModalResources | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }

        const {
            currentAccountEmail,
            emailRegExp,
            recipientsEmailAddresses,
            emailSettings
        } = this.props;

        let senderEmailAddress: string = '';
        if (emailSettings.sender === Sender.SystemAdministrator) {
            senderEmailAddress = emailSettings.email;
        }
        else if (emailSettings.sender === Sender.LoggedInUser && currentAccountEmail) {
            senderEmailAddress = currentAccountEmail;
        }

        return {
            email: {
                message: '',
                to: recipientsEmailAddresses.join(', '),
                from: senderEmailAddress,
                subject: '',
                invalidRecipientsEmailAddresses: false,
                invalidSenderEmailAddress: false,
                messageModified: false,
                recipientsEmailAddressesModified: false,
                senderEmailAddressModified: false,
                subjectModified: false
            },
            emailRegExp: emailRegExp,
            isLoading: isLoading,
            resources: resources
        };
    }

    // #region Events
    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                email
            } = this.state;

            const id: string = event.target.id;
            switch (id) {
                case 'txtFrom':
                    email.from = event.target.value;
                    email.invalidSenderEmailAddress
                    email.senderEmailAddressModified = false;
                    break;
                case 'txtTo':
                    email.to = event.target.value;
                    email.invalidRecipientsEmailAddresses = false;
                    email.senderEmailAddressModified = true;
                    break;
                case 'txtSubject':
                    email.subject = event.target.value;
                    email.subjectModified = true;
                    break;
                case 'txtMessage':
                    email.message = event.target.value;
                    email.messageModified = true;
                    break;
            }

            this.setState({
                email: email
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onSendEmail = (): void => {
        try {
            const {
                email,
                emailRegExp
            } = this.state;

            email.messageModified = true;
            email.recipientsEmailAddressesModified = true;
            email.senderEmailAddressModified = true;
            email.subjectModified = true;

            if (emailRegExp) {
                email.invalidSenderEmailAddress = !emailIsValid(email.from, emailRegExp);
                const recipientsEmailAddressesList: string[] = email.to.split(',')
                    .map(email => email.trim())
                    .filter(email => email.length > 0);

                recipientsEmailAddressesList.forEach((recipientEmail) => {
                    if (!emailIsValid(recipientEmail, emailRegExp)) {
                        email.invalidRecipientsEmailAddresses = true;
                        return;
                    }
                });

                if (!email.invalidRecipientsEmailAddresses) {
                    email.to = recipientsEmailAddressesList.join(', ');
                }

                if (email.subject && email.message && email.to && email.from
                    && !email.invalidRecipientsEmailAddresses && !email.invalidSenderEmailAddress) {
                    LayoutActions.showPageLoader();
                    Requests.sendEmail(email, this.resolveSendEmail);
                }

                this.setState({
                    email: email
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSendEmail.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    currentAccountEmail,
                    emailSettings
                } = this.props;

                const {
                    email
                } = this.state;

                if (emailSettings.sender === Sender.LoggedInUser && !currentAccountEmail && !email.from) {
                    this.setState({
                        resources: result.data
                    });
                    Requests.getCurrentAccountEmail(this.resolveGetCurrentAccountEmail);
                }
                else {
                    this.setState({
                        resources: result.data
                    }, this.hideAllLoaders);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetCurrentAccountEmail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCurrentAccountEmail.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    email
                } = this.state;

                email.from = result.data;

                this.setState({
                    email: email
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCurrentAccountEmail.name, e));
        }
    };

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

    private resolveSendEmail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSendEmail.name, this.hideAllLoaders);
            if (result?.status && result.data) {
                const {
                    resources
                } = this.state;

                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblEmailSent,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }

                this.props.onClose();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSendEmail.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
            if (!this.state.emailRegExp) {
                Requests.getEmailRegExp(this.resolveGetEmailRegExp);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            email,
            isLoading,
            resources
        } = this.state;

        const {
            emailSettings,
            recipientsName,
            onClose
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (resources && !isLoading) {
            contentPage = (
                <Modal
                    disableBackdropClick
                    id="EmailModal"
                    header={recipientsName ? Format.toString(resources.formatSentEmailTo, [recipientsName]) : resources.lblSendEmail}
                    footer={(
                        <ButtonGroup id="btgChangePassword">
                            <Button
                                id="btnCancel"
                                color="secondary"
                                onClick={onClose}
                            >
                                {resources.btnCancel}
                            </Button>
                            <Button
                                id="btnSave"
                                onClick={this.onSendEmail}
                            >
                                {resources.btnSend}
                            </Button>
                        </ButtonGroup>
                    )}
                    maxWidth="lg"
                    open={open}
                    onClose={onClose}
                >
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                disabled={(emailSettings.sender === Sender.LoggedInUser
                                    || emailSettings.sender === Sender.SystemAdministrator)
                                    && !emailSettings.canEditSender}
                                error={(email.senderEmailAddressModified && !email.from)
                                    || email.invalidSenderEmailAddress}
                                helperText={email.senderEmailAddressModified && !email.from
                                    ? resources.lblFromRequired
                                    : email.invalidSenderEmailAddress ? resources.lblInvalidEmail
                                        : undefined}
                                id="txtFrom"
                                label={resources.lblFrom}
                                required
                                value={email.from}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={(!emailSettings.canEditRecipient)}
                                error={(email.recipientsEmailAddressesModified && !email.to)
                                    || email.invalidRecipientsEmailAddresses}
                                helperText={email.recipientsEmailAddressesModified && !email.to
                                    ? resources.lblToRequired
                                    : email.invalidRecipientsEmailAddresses ? resources.lblInvalidEmails
                                        : resources.lblSeparatorAdvice}
                                id="txtTo"
                                label={resources.lblTo}
                                multiline
                                minRows={2}
                                maxRows={5}
                                required
                                value={email.to}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={email.subjectModified && !email.subject}
                                helperText={email.subjectModified && !email.subject
                                    ? resources.lblSubjectRequired : undefined}
                                id="txtSubject"
                                label={resources.lblSubject}
                                required
                                value={email.subject}
                                onChange={this.onChangeTextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                error={email.messageModified && !email.message}
                                helperText={email.messageModified && !email.message
                                    ? resources.lblMessageRequired : undefined}
                                id="txtMessage"
                                label={resources.lblMessage}
                                multiline
                                maxRows={10}
                                required
                                value={email.message}
                                onChange={this.onChangeTextField}
                            />
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
export default (EmailModal);