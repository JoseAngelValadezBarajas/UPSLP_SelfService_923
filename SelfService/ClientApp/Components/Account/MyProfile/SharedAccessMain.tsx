/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: SharedAccessMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import SimpleDialog from '@hedtech/powercampus-design-system/react/core/SimpleDialog';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';

// Internal components
import InvitationsSent from './InvitationsSent';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IInvitation } from '../../../Types/Account/IInvitation';
import { IRelative } from '../../../Types/Account/IRelative';
import { ISharedAccessMainResources } from '../../../Types/Resources/Account/ISharedAccessMainResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { emailIsValid } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/SharedAccessMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
// #endregion Imports

// #region Types
export interface ISharedAccessMainProps {
}

interface ISharedAccessMainState {
    componentError: boolean;
    emailInvalid: boolean;
    emailRegExp?: string;
    expirationDate?: string;
    disclosureStatement?: string;
    hasGrant?: boolean;
    hasNotificationOn: boolean;
    hasRelatives?: boolean;
    hasSettings?: boolean;
    hasSharedAccessRoleOn: boolean;
    isAnyCheckSelected: boolean;
    isDisclosureAccepted: boolean;
    isDisclosureAcceptedCheck: boolean;
    isLoading: boolean;
    isRelativeEmailEmpty: boolean;
    isRelativeEmpty: boolean;
    openAddInvitation: boolean;
    openDisclosureDialog: boolean;
    openEditUser: boolean;
    openRemoveInvitationModal: boolean;

    relativeId?: number;
    relativeEmail: string;
    relativeName?: string;
    relatives: IDropDownOption[];
    relativesConfirmations?: IRelative[];
    relativeInformation?: IRelative;
    relativesInvitations?: IRelative[];
    relativeSelected?: number;
    relativePersonId?: number;

    // Checkboxes
    hasGrantAcademicPlan?: boolean;
    hasGrantActivityGrades?: boolean;
    hasGrantAddress?: boolean;
    hasGrantBalance?: boolean;
    hasGrantFinancialAid?: boolean;
    hasGrantGradeReport?: boolean;
    hasGrantSchedule?: boolean;
    hasGrantStopList?: boolean;
    hasGrantTranscript?: boolean;

    // CheckboxSelected
    hasGrantAcademicPlanSelected?: boolean;
    hasGrantActivityGradesSelected?: boolean;
    hasGrantAddressSelected?: boolean;
    hasGrantBalanceSelected?: boolean;
    hasGrantFinancialAidSelected?: boolean;
    hasGrantGradeReportSelected?: boolean;
    hasGrantScheduleSelected?: boolean;
    hasGrantStopListSelected?: boolean;
    hasGrantTranscriptSelected?: boolean;

    resources?: ISharedAccessMainResources;
}

const styles = createStyles({
    avatarText: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'left',
    },
    container: {
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        marginBottom: 0,
        paddingBottom: 0
    },
    containerheader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    containerheaderEnd: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    containerChecks: {
        marginLeft: Tokens.spacing40
    },
    noMargin: {
        marginLeft: Tokens.spacing30,
        marginTop: 0,
        paddingLeft: Tokens.spacing30,
        paddingTop: 0
    },
});

type PropsWithStyles = ISharedAccessMainProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class SharedAccessMain extends React.Component<PropsWithStyles, ISharedAccessMainState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<ISharedAccessMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Account';
        this.idPage = 'SharedAccessMain';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ISharedAccessMainState {
        let resources: ISharedAccessMainResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            emailInvalid: false,
            hasNotificationOn: false,
            hasSharedAccessRoleOn: false,
            isAnyCheckSelected: true,
            isRelativeEmailEmpty: false,
            isRelativeEmpty: false,
            isDisclosureAccepted: false,
            isDisclosureAcceptedCheck: true,
            isLoading: true,
            openAddInvitation: false,
            openDisclosureDialog: false,
            openEditUser: false,
            openRemoveInvitationModal: false,
            relatives: [],
            relativeEmail: '',
            resources: resources,
        };
    }

    // #region Events
    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const idDrop: string[] = id.split("|");

            switch (idDrop[0]) {
                case 'ddlRelativeId':
                    this.setState({
                        isRelativeEmpty: false,
                        relativeEmail: optionSelected.complement,
                        relativeSelected: Number(optionSelected.value)
                    });
                    if (optionSelected.complement !== '') {
                        this.setState({
                            isRelativeEmailEmpty: false
                        });
                    }
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onTextFieldChange = (event: any): void => {
        try {
            const id: string[] = event.target.id.split("|");

            const {
                emailRegExp
            } = this.state;

            switch (id[0]) {
                case 'txtEmail':
                    this.setState({
                        isRelativeEmailEmpty: false,
                        relativeEmail: event.target.value
                    });

                    if (emailRegExp && event.target.value) {
                        this.setState({
                            emailInvalid: !emailIsValid(event.target.value, emailRegExp)
                        });
                    }
                    else {
                        this.setState({
                            emailInvalid: false
                        });
                    }
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };

    private onClickAddButton = (): void => {
        try {
            LayoutActions.showPageLoader();
            Requests.getOptions(this.resolveGetOptions);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickAddButton.name, e));
        }
    };

    private onClickDisclosure = (): void => {
        try {
            this.setState({
                openDisclosureDialog: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickDisclosure.name, e));
        }
    };

    private onCloseDisclosureDialog = (): void => {
        try {
            this.setState({
                openDisclosureDialog: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDisclosureDialog.name, e));
        }
    };

    private onSendInvitation = (): void => {
        try {
            const {
                hasGrantAcademicPlanSelected,
                hasGrantActivityGradesSelected,
                hasGrantAddressSelected,
                hasGrantBalanceSelected,
                hasGrantFinancialAidSelected,
                hasGrantGradeReportSelected,
                hasGrantScheduleSelected,
                hasGrantStopListSelected,
                hasGrantTranscriptSelected,
                isDisclosureAccepted,
                relativeEmail,
                relativeSelected
            } = this.state;

            let isValid: boolean = true;
            if (!relativeSelected || relativeSelected === 0) {
                this.setState({
                    isRelativeEmpty: true
                })
                isValid = false;
            }
            if (!relativeEmail) {
                this.setState({
                    isRelativeEmailEmpty: true
                })
                isValid = false;
            }

            if (isValid) {
                isValid = this.VerifyChecks();

                this.setState({
                    isAnyCheckSelected: isValid
                });
            }

            if (!isDisclosureAccepted) {
                this.setState({
                    isDisclosureAcceptedCheck: false
                });
            }
            if (isValid && isDisclosureAccepted) {
                let invitation: IInvitation =
                {
                    canViewAcademicPlan: hasGrantAcademicPlanSelected ? hasGrantAcademicPlanSelected : false,
                    canViewActivityGrades: hasGrantActivityGradesSelected ? hasGrantActivityGradesSelected : false,
                    canViewAddress: hasGrantAddressSelected ? hasGrantAddressSelected : false,
                    canViewBalance: hasGrantBalanceSelected ? hasGrantBalanceSelected : false,
                    canViewFinancialAid: hasGrantFinancialAidSelected ? hasGrantFinancialAidSelected : false,
                    canViewGradeReport: hasGrantGradeReportSelected ? hasGrantGradeReportSelected : false,
                    canViewSchedule: hasGrantScheduleSelected ? hasGrantScheduleSelected : false,
                    canViewStopList: hasGrantStopListSelected ? hasGrantStopListSelected : false,
                    canViewTranscript: hasGrantTranscriptSelected ? hasGrantTranscriptSelected : false,
                    email: relativeEmail ? relativeEmail : '',
                    invitationId: 0,
                    relationId: relativeSelected ? relativeSelected : 0,
                    requestToken: undefined,
                    studentId: 0
                }
                LayoutActions.showPageLoader();
                Requests.postSaveInvitation(invitation, this.resolveSendInvitation);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSendInvitation.name, e));
        }
    };

    private onCancelInvitation = (): void => {
        try {
            this.setState({
                emailInvalid: false,
                hasGrantAcademicPlanSelected: undefined,
                hasGrantActivityGradesSelected: undefined,
                hasGrantAddressSelected: undefined,
                hasGrantBalanceSelected: undefined,
                hasGrantFinancialAidSelected: undefined,
                hasGrantGradeReportSelected: undefined,
                hasGrantScheduleSelected: undefined,
                hasGrantStopListSelected: undefined,
                hasGrantTranscriptSelected: undefined,
                isAnyCheckSelected: true,
                isDisclosureAccepted: false,
                isDisclosureAcceptedCheck: true,
                isRelativeEmailEmpty: false,
                isRelativeEmpty: false,
                openAddInvitation: false,
                openEditUser: false,
                relativeEmail: '',
                relativeInformation: undefined,
                relativePersonId: undefined,
                relativeSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelInvitation.name, e));
        }
    };

    private onChangeCheckBox = (event: any): void => {
        try {
            const id: string = event.target.id;
            const value: boolean = Boolean(event.target.checked);
            switch (id) {
                case 'chkAcademicPlan':
                    this.setState({
                        hasGrantAcademicPlanSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkActivityGrades':
                    this.setState({
                        hasGrantActivityGradesSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkAddress':
                    this.setState({
                        hasGrantAddressSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkBalance':
                    this.setState({
                        hasGrantBalanceSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkFinancialAid':
                    this.setState({
                        hasGrantFinancialAidSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkGradeReport':
                    this.setState({
                        hasGrantGradeReportSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkSchedule':
                    this.setState({
                        hasGrantScheduleSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkStopList':
                    this.setState({
                        hasGrantStopListSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkTranscript':
                    this.setState({
                        hasGrantTranscriptSelected: value,
                        isAnyCheckSelected: true
                    });
                    break;
                case 'chkDisclosure':
                    this.setState({
                        isDisclosureAccepted: value,
                        isDisclosureAcceptedCheck: true
                    });
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckBox.name, e));
        }
    };

    private onCloseRemoveInvitation = (): void => {
        try {
            this.setState({
                relativeId: undefined,
                relativeName: undefined,
                relativePersonId: undefined,
                openRemoveInvitationModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseRemoveInvitation.name, e));
        }
    };

    private onDeleteInvitation = (): void => {
        try {
            LayoutActions.showPageLoader();
            const {
                relativeId
            } = this.state;
            if (relativeId) {
                Requests.postDeleteInvitation(relativeId, this.resolveDeleteInvitation);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteInvitation.name, e));
        }
    };

    private onStopSharing = (): void => {
        try {
            LayoutActions.showPageLoader();
            const {
                relativeId,
                relativePersonId
            } = this.state;
            if (relativeId && relativePersonId) {
                Requests.postUpdateStatus(relativeId, relativePersonId, this.resolveDeleteInvitation);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onStopSharing.name, e));
        }
    };

    private onClickRemoveButton = (event: any): void => {
        try {
            const {
                relativesInvitations
            } = this.state;

            const relativeId: number = Number(event.currentTarget.dataset.relativeId);
            let relativeInfo: IRelative | undefined;
            if (relativesInvitations) {
                relativeInfo = relativesInvitations.find(r => r.id === relativeId);
            }
            if (relativeInfo) {
                this.setState({
                    relativeId: relativeId,
                    relativeName: relativeInfo.avatar.fullName,
                    openRemoveInvitationModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteInvitation.name, e));
        }
    };

    private onClickRemoveUserButton = (event: any): void => {
        try {
            const {
                relativesConfirmations
            } = this.state;

            const relativeId: number = Number(event.currentTarget.dataset.relativeId);
            let relativeInfo: IRelative | undefined;
            if (relativesConfirmations) {
                relativeInfo = relativesConfirmations.find(r => r.id === relativeId);
            }
            if (relativeInfo) {
                this.setState({
                    relativeId: relativeId,
                    relativeName: relativeInfo.avatar.fullName,
                    relativePersonId: relativeInfo.avatar.personId,
                    openRemoveInvitationModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteInvitation.name, e));
        }
    };

    private onClickLink = (event: any): void => {
        try {
            const id = event.currentTarget.id.split('_');
            this.setState({
                relativePersonId: id[1],
            });
            LayoutActions.showPageLoader();
            Requests.getRelativeOptions(Number(id[1]), this.resolvetRelativeOptions);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickLink.name, e));
        }
    };

    private onUpdateInvitation = (): void => {
        try {
            const {
                hasGrantAcademicPlanSelected,
                hasGrantActivityGradesSelected,
                hasGrantAddressSelected,
                hasGrantBalanceSelected,
                hasGrantFinancialAidSelected,
                hasGrantGradeReportSelected,
                hasGrantScheduleSelected,
                hasGrantStopListSelected,
                hasGrantTranscriptSelected,
                relativeInformation
            } = this.state;

            let isValid: boolean = this.VerifyChecks();
            this.setState({
                isAnyCheckSelected: isValid
            });

            if (isValid && relativeInformation && relativeInformation.avatar.personId) {
                let invitation: IInvitation =
                {
                    canViewAcademicPlan: hasGrantAcademicPlanSelected ? hasGrantAcademicPlanSelected : false,
                    canViewActivityGrades: hasGrantActivityGradesSelected ? hasGrantActivityGradesSelected : false,
                    canViewAddress: hasGrantAddressSelected ? hasGrantAddressSelected : false,
                    canViewBalance: hasGrantBalanceSelected ? hasGrantBalanceSelected : false,
                    canViewFinancialAid: hasGrantFinancialAidSelected ? hasGrantFinancialAidSelected : false,
                    canViewGradeReport: hasGrantGradeReportSelected ? hasGrantGradeReportSelected : false,
                    canViewSchedule: hasGrantScheduleSelected ? hasGrantScheduleSelected : false,
                    canViewStopList: hasGrantStopListSelected ? hasGrantStopListSelected : false,
                    canViewTranscript: hasGrantTranscriptSelected ? hasGrantTranscriptSelected : false,
                    invitationId: relativeInformation.id,
                    studentId: relativeInformation.avatar.personId
                }
                LayoutActions.showPageLoader();
                Requests.postUpdateRelativeOptions(invitation, this.resolveUpdateRelativeOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onUpdateInvitation.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private VerifyChecks(): boolean {
        const {
            hasGrantAcademicPlanSelected,
            hasGrantActivityGradesSelected,
            hasGrantAddressSelected,
            hasGrantBalanceSelected,
            hasGrantFinancialAidSelected,
            hasGrantGradeReportSelected,
            hasGrantScheduleSelected,
            hasGrantStopListSelected,
            hasGrantTranscriptSelected,
            hasGrantAcademicPlan,
            hasGrantActivityGrades,
            hasGrantAddress,
            hasGrantBalance,
            hasGrantFinancialAid,
            hasGrantGradeReport,
            hasGrantSchedule,
            hasGrantStopList,
            hasGrantTranscript
        } = this.state;

        let isValid: boolean = false;
        if (hasGrantAcademicPlanSelected && hasGrantAcademicPlan) {
            isValid = true;
        }

        if (hasGrantActivityGradesSelected && hasGrantActivityGrades) {
            isValid = true;
        }

        if (hasGrantAddressSelected && hasGrantAddress) {
            isValid = true;
        }

        if (hasGrantBalanceSelected && hasGrantBalance) {
            isValid = true;
        }

        if (hasGrantFinancialAidSelected && hasGrantFinancialAid) {
            isValid = true;
        }

        if (hasGrantGradeReportSelected && hasGrantGradeReport) {
            isValid = true;
        }

        if (hasGrantScheduleSelected && hasGrantSchedule) {
            isValid = true;
        }

        if (hasGrantStopListSelected && hasGrantStopList) {
            isValid = true;
        }

        if (hasGrantTranscriptSelected && hasGrantTranscript) {
            isValid = true;
        }

        return isValid;
    }

    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
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
                }, () => {
                    Requests.getDisclosureStatement(this.resolveGetDisclosure);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        hasGrant: result.data.hasGrant,
                        hasNotificationOn: result.data.hasNotificationOn,
                        hasRelatives: result.data.hasRelatives,
                        hasSettings: result.data.hasSettings,
                        hasSharedAccessRoleOn: true // TODO: Refactor this variable state and its back logic
                    }, () => {
                        Requests.getInvitations(this.resolveGetInvitations);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOptions.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        hasGrantAcademicPlan: result.data.hasGrantAcademicPlan,
                        hasGrantActivityGrades: result.data.hasGrantActivityGrades,
                        hasGrantAddress: result.data.hasGrantAddress,
                        hasGrantBalance: result.data.hasGrantBalance,
                        hasGrantFinancialAid: result.data.hasGrantFinancialAid,
                        hasGrantGradeReport: result.data.hasGrantGradeReport,
                        hasGrantSchedule: result.data.hasGrantSchedule,
                        hasGrantStopList: result.data.hasGrantStopList,
                        hasGrantTranscript: result.data.hasGrantTranscript,
                        expirationDate: result.data.expirationDate,
                        openAddInvitation: true,
                        relatives: result.data.relatives,
                    });
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolveGetEmailRegExp = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEmailRegExp.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    emailRegExp: result.data
                }, () => {
                    Requests.getSettings(this.resolveGetSettings);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEmailRegExp.name, e));
        }
    };

    private resolveGetDisclosure = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDisclosure.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    disclosureStatement: result.data
                }, () => {
                    Requests.getEmailRegExp(this.resolveGetEmailRegExp);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDisclosure.name, e));
        }
    };

    private resolveSendInvitation = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSendInvitation.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
                    if (layoutResources) {
                        LayoutActions.setAlert({
                            message: layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                        this.setState({
                            emailInvalid: false,
                            hasGrantAcademicPlanSelected: undefined,
                            hasGrantActivityGradesSelected: undefined,
                            hasGrantAddressSelected: undefined,
                            hasGrantBalanceSelected: undefined,
                            hasGrantFinancialAidSelected: undefined,
                            hasGrantGradeReportSelected: undefined,
                            hasGrantScheduleSelected: undefined,
                            hasGrantStopListSelected: undefined,
                            hasGrantTranscriptSelected: undefined,
                            isAnyCheckSelected: true,
                            isDisclosureAccepted: false,
                            isDisclosureAcceptedCheck: true,
                            isRelativeEmailEmpty: false,
                            isRelativeEmpty: false,
                            openAddInvitation: false,
                            relativeEmail: '',
                            relativeSelected: undefined
                        });
                        Requests.getInvitations(this.resolveGetInvitations);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSendInvitation.name, e));
        }
    };

    private resolveGetInvitations = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetInvitations.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data.confirmations && result.data.invitations) {
                    this.setState({
                        relativesConfirmations: result.data.confirmations,
                        relativesInvitations: result.data.invitations
                    }, () => {
                        this.hideAllLoaders();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetInvitations.name, e));
        }
    };

    private resolveDeleteInvitation = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteInvitation.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        openRemoveInvitationModal: false
                    });
                    Requests.getInvitations(this.resolveGetInvitations);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetInvitations.name, e));
        }
    };

    private resolvetRelativeOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvetRelativeOptions.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    if (result.data.claims && result.data.relative) {
                        this.setState({
                            hasGrant: result.data.hasGrant ? true : false,
                            hasGrantAcademicPlan: result.data.claims.academicPlan ? true : false,
                            hasGrantAcademicPlanSelected: result.data.relative.options.academicPlan ? true : false,
                            hasGrantActivityGrades: result.data.claims.activityGrades ? true : false,
                            hasGrantActivityGradesSelected: result.data.relative.options.activityGrades ? true : false,
                            hasGrantAddress: result.data.claims.address ? true : false,
                            hasGrantAddressSelected: result.data.relative.options.address ? true : false,
                            hasGrantBalance: result.data.claims.balance ? true : false,
                            hasGrantBalanceSelected: result.data.relative.options.balance ? true : false,
                            hasGrantFinancialAid: result.data.claims.financialAid ? true : false,
                            hasGrantFinancialAidSelected: result.data.relative.options.financialAid ? true : false,
                            hasGrantGradeReport: result.data.claims.gradeReport ? true : false,
                            hasGrantGradeReportSelected: result.data.relative.options.gradeReport ? true : false,
                            hasGrantSchedule: result.data.claims.schedule ? true : false,
                            hasGrantScheduleSelected: result.data.relative.options.schedule ? true : false,
                            hasGrantStopList: result.data.claims.stopList ? true : false,
                            hasGrantStopListSelected: result.data.relative.options.stopList ? true : false,
                            hasGrantTranscript: result.data.claims.transcript ? true : false,
                            hasGrantTranscriptSelected: result.data.relative.options.transcript ? true : false,
                            openEditUser: true,
                            relativeInformation: result.data.relative
                        });
                    }
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvetRelativeOptions.name, e));
        }
    };

    private resolveUpdateRelativeOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveUpdateRelativeOptions.name, this.hideAllLoaders);

            if (result?.status) {
                const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
                if (layoutResources) {
                    if (result.data) {
                        LayoutActions.setAlert({
                            message: layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                        this.setState({
                            hasGrantAcademicPlanSelected: undefined,
                            hasGrantActivityGradesSelected: undefined,
                            hasGrantAddressSelected: undefined,
                            hasGrantBalanceSelected: undefined,
                            hasGrantFinancialAidSelected: undefined,
                            hasGrantGradeReportSelected: undefined,
                            hasGrantScheduleSelected: undefined,
                            hasGrantStopListSelected: undefined,
                            hasGrantTranscriptSelected: undefined,
                            isAnyCheckSelected: true,
                            openEditUser: false,
                            openAddInvitation: false,
                            relativeInformation: undefined,
                            relativePersonId: undefined
                        });
                        Requests.getInvitations(this.resolveGetInvitations);
                    }
                    else {
                        LayoutActions.setAlert({
                            message: layoutResources.lblError,
                            messageType: ResultType.error,
                            snackbar: true
                        } as IAlert);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSendInvitation.name, e));
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
            classes
        } = this.props;

        const {
            componentError,
            emailInvalid,
            emailRegExp,
            expirationDate,
            disclosureStatement,
            hasGrant,
            hasNotificationOn,
            hasRelatives,
            hasSharedAccessRoleOn,
            hasSettings,
            isAnyCheckSelected,
            isRelativeEmailEmpty,
            isRelativeEmpty,
            isDisclosureAccepted,
            isDisclosureAcceptedCheck,
            isLoading,
            openAddInvitation,
            openDisclosureDialog,
            openEditUser,
            openRemoveInvitationModal,
            relatives,
            relativeEmail,
            relativeName,
            relativesConfirmations,
            relativeInformation,
            relativesInvitations,
            relativePersonId,
            relativeSelected,

            // Checkboxes
            hasGrantAcademicPlan,
            hasGrantActivityGrades,
            hasGrantAddress,
            hasGrantBalance,
            hasGrantFinancialAid,
            hasGrantGradeReport,
            hasGrantSchedule,
            hasGrantStopList,
            hasGrantTranscript,

            // CheckboxSelected
            hasGrantAcademicPlanSelected,
            hasGrantActivityGradesSelected,
            hasGrantAddressSelected,
            hasGrantBalanceSelected,
            hasGrantFinancialAidSelected,
            hasGrantGradeReportSelected,
            hasGrantScheduleSelected,
            hasGrantStopListSelected,
            hasGrantTranscriptSelected,

            resources,
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let inviteUserView: JSX.Element | undefined;
        let availableCheckboxes: JSX.Element[] = [];
        let disclosureDialog: JSX.Element | undefined;
        let removeInvitationModal: JSX.Element | undefined;
        let editUserView: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources && this.layoutResources &&
            emailRegExp && hasGrant !== undefined &&
            hasNotificationOn !== undefined && hasRelatives !== undefined &&
            hasSettings !== undefined && relativesInvitations && relativesConfirmations) {
            const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
            const emptyOption: IDropDownOption = {
                description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
                value: 0
            };

            if (openRemoveInvitationModal) {
                removeInvitationModal = (
                    <Modal
                        id="removeModal"
                        header={relativePersonId ? resources.lblStopSharing : resources.lblDeleteInvitation}
                        maxWidth="md"
                        footer={(
                            <ButtonGroup id="bgDeleteInvitation">
                                <Button
                                    color="secondary"
                                    id="btnDeleteInvitation"
                                    onClick={relativePersonId ? this.onStopSharing : this.onDeleteInvitation}
                                >
                                    {resources.btnDelete}
                                </Button>
                                <Button
                                    id="btnCloseDeleteInvitation"
                                    onClick={this.onCloseRemoveInvitation}
                                >
                                    {resources.btnCancel}
                                </Button>
                            </ButtonGroup>
                        )}
                        open={openRemoveInvitationModal}
                        onClose={this.onCloseRemoveInvitation}
                    >
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Text>
                                    {relativePersonId ? Format.toString(resources.formatStopSharingMessage, [relativeName]) : Format.toString(resources.formatDeleteInvitation, [relativeName])}
                                </Text>
                            </Grid>
                        </Grid>
                    </Modal>
                )
            }

            if (openAddInvitation || openEditUser) {
                if (hasGrantAcademicPlan) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantAcademicPlanSelected}
                                id="chkAcademicPlan"
                                label={resources.lblAcademicPlan}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantFinancialAid) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantFinancialAidSelected}
                                id="chkFinancialAid"
                                label={resources.lblFinancialAid}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantSchedule) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantScheduleSelected}
                                id="chkSchedule"
                                label={resources.lblSchedule}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantAddress) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantAddressSelected}
                                id="chkAddress"
                                label={resources.lblAddress}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantGradeReport) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantGradeReportSelected}
                                id="chkGradeReport"
                                label={resources.lblGradeReport}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantActivityGrades) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantActivityGradesSelected}
                                id="chkActivityGrades"
                                label={resources.lblActivityGrades}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantStopList) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantStopListSelected}
                                id="chkStopList"
                                label={resources.lblStopList}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantBalance) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantBalanceSelected}
                                id="chkBalance"
                                label={resources.lblBalance}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }
                if (hasGrantTranscript) {
                    availableCheckboxes.push(
                        <Grid item xs={12} md={4}>
                            <Checkbox
                                checked={hasGrantTranscriptSelected}
                                id="chkTranscript"
                                label={resources.lblTranscript}
                                onChange={this.onChangeCheckBox}
                            />
                        </Grid>
                    );
                }

                inviteUserView = (
                    <>
                        <Grid container>
                            <Grid item xs={12}>
                                <Text size="h2">
                                    {resources.lblInvite}
                                </Text>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Dropdown
                                    error={isRelativeEmpty}
                                    helperText={isRelativeEmpty ? resources.lblSelectRelative : ''}
                                    emptyOption={emptyOption}
                                    id="ddlRelativeId"
                                    label={resources.lblRelative}
                                    options={relatives}
                                    required
                                    value={relativeSelected}
                                    onChange={this.onDropdownChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={isRelativeEmailEmpty || emailInvalid}
                                    helperText={isRelativeEmailEmpty ? resources.lblSelectRelativeEmail :
                                        emailInvalid ? resources.lblSelectRelativeEmailValid : ''}
                                    id="txtEmail"
                                    label={resources.lblEmail}
                                    maxCharacters={60}
                                    required
                                    value={relativeEmail}
                                    onChange={this.onTextFieldChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <Text size="h2">
                                    {resources.lblOptions}
                                </Text>
                            </Grid>
                            {!isAnyCheckSelected ?
                                (<Grid item xs={12}>
                                    <Text color="error">
                                        {resources.lblSelectCheckbox}
                                    </Text>
                                </Grid>) : undefined
                            }
                        </Grid>
                        <div className={classes.containerChecks}>
                            <Grid container>
                                {availableCheckboxes}
                            </Grid>
                        </div>
                        <Grid container>
                            <Grid item xs={12} className={classes.container}>
                                <Checkbox
                                    checked={isDisclosureAccepted}
                                    id="chkDisclosure"
                                    inputProps={{
                                        'aria-labelledby': 'prgDisclosure'
                                    }}
                                    onChange={this.onChangeCheckBox}
                                />
                                <Paragraph
                                    id="prgDisclosure"
                                    text={Format.toString(resources.lblAcceptDisclosure, [resources.lblDisclosureStatement])}
                                    events={[this.onClickDisclosure]}
                                />
                            </Grid>
                            {!isDisclosureAcceptedCheck ?
                                (<div className={classes.noMargin}>
                                    <Text color="error">
                                        {resources.lblSelectAcceptDisclosure}
                                    </Text>
                                </div>) : undefined
                            }
                            <Grid item xs={12}>
                                <Text>
                                    {Format.toString(resources.formatInvitationExpiration, [expirationDate])}
                                </Text>
                            </Grid>
                            <Grid item xs={12}>
                                <ButtonGroup id="bgButtons">
                                    <Button
                                        id="btnSave"
                                        onClick={this.onSendInvitation}
                                    >
                                        {resources.btnSend}
                                    </Button>
                                    <Button
                                        color="secondary"
                                        id="btnCancel"
                                        onClick={this.onCancelInvitation}
                                    >
                                        {resources.btnCancel}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </>
                );
                if (relativeInformation) {
                    editUserView = (
                        <>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text size="h2">
                                        {Format.toString(resources.formatEditUser, [relativeInformation?.avatar.fullName])}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    <div className={classes.avatarText}>
                                        <div>
                                            {relativeInformation?.avatar.hasPicture ?
                                                (
                                                    <Avatar
                                                        size='xxLarge'
                                                        src={`${Constants.peoplePictureUrl}${relativeInformation.avatar.personId}`}
                                                    />
                                                )
                                                :
                                                (
                                                    <Avatar
                                                        size='xxLarge'
                                                        backgroundNumber={relativeInformation.avatar.colorFirstLetter ?
                                                            relativeInformation.avatar.colorFirstLetter : 0}
                                                    >
                                                        {relativeInformation.avatar.firstLetter}
                                                    </Avatar>
                                                )
                                            }
                                        </div>
                                        <div>
                                            <Text>
                                                {relativeInformation?.relationshipDesc}
                                            </Text>
                                            <Text>
                                                {Format.toString(resources.formatSince, [relativeInformation?.acceptedDate])}
                                            </Text>
                                        </div>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Text size="h2">
                                        {resources.lblOptions}
                                    </Text>
                                </Grid>
                                {!isAnyCheckSelected ?
                                    (<Grid item xs={12}>
                                        <Text color="error">
                                            {resources.lblSelectCheckbox}
                                        </Text>
                                    </Grid>) : undefined
                                }
                                <Grid item xs={12}>
                                    <div className={classes.containerChecks}>
                                        <Grid container>
                                            {availableCheckboxes}
                                        </Grid>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <ButtonGroup id="bgButtons">
                                        <Button
                                            id="btnSave"
                                            onClick={this.onUpdateInvitation}
                                        >
                                            {resources.btnSave}
                                        </Button>
                                        <Button
                                            color="secondary"
                                            id="btnCancel"
                                            onClick={this.onCancelInvitation}
                                        >
                                            {resources.btnCancel}
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        </>
                    );
                }
            }

            if (openDisclosureDialog) {
                disclosureDialog = (
                    <SimpleDialog
                        id="infoModal"
                        open={openDisclosureDialog}
                        title={resources.lblDisclosureStatementTitle}
                        onClose={this.onCloseDisclosureDialog}
                        maxWidth="md"
                    >
                        <div style={{ padding: '12px' }}>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text>
                                        <div dangerouslySetInnerHTML={{ __html: disclosureStatement ? disclosureStatement : '' }} />
                                    </Text>
                                </Grid>
                            </Grid>
                        </div>
                    </SimpleDialog>
                );
            }

            let relativesSent: IRelative[] = [];
            if (relativesConfirmations && relativesConfirmations.length > 0) {
                relativesConfirmations.forEach(relative => {
                    relative.isInvited = false;
                    relativesSent.push(relative);
                });
            }
            if (relativesInvitations && relativesInvitations.length > 0) {
                relativesInvitations.forEach(relative => {
                    relative.isInvited = true;
                    relativesSent.push(relative);
                });
            }

            contentPage = (
                <Card>
                    <CardContent>
                        {(hasGrant && hasRelatives && hasSettings) ?
                            (openAddInvitation || openEditUser ?
                                relativeInformation ?
                                    editUserView
                                    :
                                    inviteUserView
                                :
                                <>
                                    <br />
                                    {hasNotificationOn && hasSharedAccessRoleOn ?
                                        relativesSent && relativesSent.length > 0 ?
                                            (<div className={classes.containerheader}>
                                                <div>
                                                    <Text size="h2" inline>
                                                        {resources.lblShareWith}
                                                    </Text>
                                                </div>
                                                <div>
                                                    <Tooltip
                                                        id="tltAdd"
                                                        title={resources.btnAdd}
                                                        aria-label={resources.btnAdd}
                                                    >
                                                        <IconButton
                                                            id="btnAdd"
                                                            onClick={this.onClickAddButton}
                                                        >
                                                            <Icon name="add" />
                                                        </IconButton>
                                                    </Tooltip>
                                                </div>
                                            </div>)
                                            :
                                            <div className={classes.containerheaderEnd}>
                                                <Tooltip
                                                    id="tltAdd"
                                                    title={resources.btnAdd}
                                                    aria-label={resources.btnAdd}
                                                >
                                                    <IconButton
                                                        id="btnAdd"
                                                        onClick={this.onClickAddButton}
                                                    >
                                                        <Icon name="add" />
                                                    </IconButton>
                                                </Tooltip>
                                            </div>
                                        :
                                        undefined
                                    }
                                    {relativesSent && relativesSent.length > 0 ?
                                        (
                                            <InvitationsSent
                                                formatExpiresOn={resources.formatExpiresOn}
                                                relatives={relativesSent}
                                                onClickLink={this.onClickLink}
                                                onClickRemoveButton={this.onClickRemoveButton}
                                                onClickRemoveUserButton={this.onClickRemoveUserButton}
                                            />
                                        )
                                        :
                                        hasNotificationOn && hasSharedAccessRoleOn ?
                                            (<Grid container>
                                                <Grid item xs>
                                                    <Illustration
                                                        color="secondary"
                                                        internalName="no-enrolled"
                                                        text={resources.lblStart}
                                                    />
                                                </Grid>
                                            </Grid>)
                                            :
                                            <Grid container>
                                                <Grid item xs>
                                                    <Illustration
                                                        color="secondary"
                                                        name="under-maintenance"
                                                        text={resources.lblNoSharedAccess}
                                                    />
                                                </Grid>
                                            </Grid>
                                    }
                                </>)
                            :
                            (<Grid container>
                                <Grid item xs>
                                    <Illustration
                                        color="secondary"
                                        name="under-maintenance"
                                        text={resources.lblNoSharedAccess}
                                    />
                                </Grid>
                            </Grid>)}
                    </CardContent>
                </Card >
            );
        }

        return (
            <>
                {contentPage}
                {disclosureDialog}
                {removeInvitationModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(SharedAccessMain);