/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: Alerts.tsx
 * Type: Container component */

// #region Imports
import moment from 'moment';
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal Components
import AlertModal, { IAlertModalResProps } from './AlertModal';
import AlertsTable, { IAlertsTableResProps } from './AlertsTable';
import EmailModal from '../../Generic/EmailModal';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IAlertList } from '../../../Types/Section/IAlertList';
import { IAlertsResources } from '../../../Types/Resources/Classes/IAlertsResources';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IStudentViolation } from '../../../Types/Students/IStudentViolation';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/Alerts';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
import { IViolation } from '../../../Types/Section/IViolation';
// #endregion Imports

// #region Types
export interface IAlertsProps {
    cultures: ICultures;
    myPosition: number;
    sectionId: number;
    onDownloadModal: () => void;
}

interface IAlertsRes extends IAlertsResources {
    alertModal: IAlertModalResProps;
    alertsTable: IAlertsTableResProps;
}

interface IAlertsState {
    alerts?: IAlertList;
    alertSaved: IStudentViolation;
    checkboxHeader: boolean;
    componentError: boolean;
    errorDateAlert: boolean;
    isAlertDateInvalid: boolean;
    isAlertModalOpen: boolean;
    isAlertToInvalid: boolean;
    isAlertTypeInvalid: boolean;
    isConfirmationModalOpen: boolean;
    isIndeterminate: boolean;
    isLoading: boolean;
    isLoadingSave: boolean;
    isStudentSelected: boolean;
    resources?: IAlertsRes;

    // #region Email Modal
    openEmailModal: boolean;
    recipientsEmailAddresses: string[];
    // #endregion Email Modal
}

const styles = ((theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: `${Tokens.spacing35}!important`
        },
        marginLeft: `${Tokens.spacing40}!important`
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    marginLeft: {
        marginLeft: Tokens.sizingXSmall
    },
    marginRight: {
        marginRight: Tokens.sizingXxLarge
    }
}));

type PropsWithStyles = IAlertsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class Alerts extends React.Component<PropsWithStyles, IAlertsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IAlertsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'Alerts';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAlertsState {
        let resources: IAlertsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            alerts: undefined,
            alertSaved: {
                alertName: '',
                createdBy: '',
                createdDate: '',
                description: '',
                isEditable: false,
                sectionId: -1,
                studentId: -1,
                violationDate: '',
                violationId: 0,
                violationTypeId: -1
            },
            checkboxHeader: false,
            componentError: false,
            errorDateAlert: false,
            isAlertDateInvalid: false,
            isAlertModalOpen: false,
            isAlertToInvalid: false,
            isAlertTypeInvalid: false,
            isConfirmationModalOpen: false,
            isIndeterminate: false,
            isLoading: true,
            isLoadingSave: false,
            isStudentSelected: false,
            resources: resources,

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onChangeCheckHeader = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                alerts,
                isIndeterminate
            } = this.state;

            let chkboxHeader: boolean = event.target.checked;
            if (alerts && alerts.sectionViolations && alerts.sectionViolations.length > 0) {
                if (isIndeterminate) {
                    chkboxHeader = false;
                }
                alerts.sectionViolations.forEach(student => student.checkbox = chkboxHeader);
                this.setState({
                    alerts: alerts,
                    checkboxHeader: chkboxHeader,
                    isIndeterminate: false,
                    isStudentSelected: chkboxHeader
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckHeader.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                alerts
            } = this.state;

            let isIndeterminate: boolean = false;
            let checkboxHeader: boolean = true;
            if (alerts && alerts.sectionViolations && alerts.sectionViolations.length > 0) {
                const id: string[] = event.target.id.split('_');
                alerts.sectionViolations[Number(id[2])].checkbox = !alerts.sectionViolations[Number(id[2])].checkbox;
                if (alerts.sectionViolations.findIndex(s => s.checkbox === false
                    || s.checkbox === undefined && s.violationCategoryList.length > 0) !== -1) {
                    checkboxHeader = false;
                }
                if (alerts.sectionViolations.findIndex(s => s.checkbox === true) !== -1) {
                    isIndeterminate = true;
                }
                this.setState({
                    alerts: alerts,
                    checkboxHeader: checkboxHeader,
                    isIndeterminate: isIndeterminate,
                    isStudentSelected: alerts.sectionViolations.find(students => students.checkbox) ? true : false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onCloseAlertModal = (): void => {
        try {
            if (!this.state.isLoadingSave) {
                this.setState({
                    isAlertModalOpen: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAlertModal.name, e));
        }
    };

    private onOpenAlertModal = (violationId: number, studentPosition: number): void => {
        try {
            const {
                sectionId
            } = this.props;
            const {
                alerts
            } = this.state;

            let newAlertSaved: IStudentViolation = {
                alertName: '',
                createdBy: '',
                createdDate: '',
                description: '',
                isEditable: false,
                sectionId: sectionId,
                studentId: -1,
                violationDate: '',
                violationId: violationId,
                violationTypeId: -1
            };

            if (violationId > 0
                && alerts
                && alerts.sectionViolations
                && alerts.sectionViolations.length > 0
                && alerts.sectionViolations[studentPosition].violationList
                && alerts.sectionViolations[studentPosition].violationList.length > 0) {

                let violation: IViolation | undefined = alerts.sectionViolations[studentPosition].violationList.find(v => v.violationId === violationId);

                if (violation) {
                    newAlertSaved = {
                        alertName: violation.violationType,
                        createdBy: violation.reportedByFullName,
                        createdDate: violation.createdDate,
                        description: violation.description,
                        isEditable: violation.isEditable,
                        sectionId: sectionId,
                        studentId: alerts.sectionViolations[studentPosition].personId,
                        violationDate: violation.violationDate,
                        violationId: violationId,
                        violationTypeId: violation.violationId ?
                            violation.violationTypeId : -1
                    };
                }
            }

            this.setState({
                alertSaved: newAlertSaved,
                errorDateAlert: false,
                isAlertDateInvalid: false,
                isAlertModalOpen: true,
                isAlertToInvalid: false,
                isAlertTypeInvalid: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenAlertModal.name, e));
        }
    };

    private onChangeDatePickerAlerts = (date: string, _id: string, isValid: boolean): void => {
        try {
            const {
                alertSaved
            } = this.state;

            alertSaved.violationDate = date;
            if (isValid) {
                this.setState({
                    alertSaved: alertSaved,
                    errorDateAlert: false,
                    isAlertDateInvalid: false
                });
            }
            else {
                if (date !== '') {
                    this.setState({
                        errorDateAlert: true
                    });
                }
                else {
                    this.setState({
                        alertSaved: alertSaved,
                        errorDateAlert: false
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDatePickerAlerts.name, e));
        }
    };

    private onChangeDropdownAlerts = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                alertSaved,
                isAlertToInvalid,
                isAlertTypeInvalid
            } = this.state;

            let alertToInvalid: boolean = isAlertToInvalid;
            let alertTypeInvalid: boolean = isAlertTypeInvalid;
            switch (id) {
                case 'ddlAlertTo':
                    alertSaved.studentId = Number(optionSelected.value);
                    alertToInvalid = false;
                    break;
                case 'ddlAlertType':
                    alertSaved.violationTypeId = Number(optionSelected.value);
                    alertTypeInvalid = false;
                    break;
            }
            this.setState({
                alertSaved: alertSaved,
                isAlertToInvalid: alertToInvalid,
                isAlertTypeInvalid: alertTypeInvalid
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdownAlerts.name, e));
        }
    };

    private onChangeTextFieldAlerts = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                alertSaved
            } = this.state;

            alertSaved.description = event.target.value;
            this.setState({
                alertSaved: alertSaved
            });

        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextFieldAlerts.name, e));
        }
    };

    private onSaveAlerts = (): void => {
        try {
            const {
                alerts,
                alertSaved,
                isAlertDateInvalid,
                isAlertToInvalid,
                isAlertTypeInvalid,
                errorDateAlert
            } = this.state;

            let alertToInvalid: boolean = isAlertToInvalid;
            let alertTypeInvalid: boolean = isAlertTypeInvalid;
            const alertDateInvalid: boolean = isAlertDateInvalid;

            if (alertSaved.studentId === -1) {
                alertToInvalid = true;
            }
            if (alertSaved.violationTypeId === -1) {
                alertTypeInvalid = true;
            }
            if (!alertSaved.violationDate && alerts) {
                alertSaved.violationDate = alerts.createdDate;
            }

            if (alertSaved.studentId > -1
                && alertSaved.violationTypeId > -1
                && alertSaved.violationDate
                && !errorDateAlert) {
                this.showLoaderSave();
                Requests.postSaveAlert(alertSaved, this.resolvePostSaveAlert);
            }
            else {
                this.setState({
                    isAlertDateInvalid: alertDateInvalid,
                    isAlertToInvalid: alertToInvalid,
                    isAlertTypeInvalid: alertTypeInvalid
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveAlerts.name, e));
        }
    };

    private onOpenConfirmationModal = () => {
        try {
            this.setState({
                isConfirmationModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenConfirmationModal.name, e));
        }
    };

    private onCloseConfirmationModal = () => {
        try {
            this.setState({
                isConfirmationModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseConfirmationModal.name, e));
        }
    };

    private onDeleteAlert = () => {
        try {
            const {
                alertSaved
            } = this.state;

            if (alertSaved.violationId > 0) {
                LayoutActions.setLoading(true);
                Requests.postDeleteAlert(alertSaved.violationId, this.resolvePostDeleteAlert);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAlert.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                alerts
            } = this.state;

            if (alerts) {
                const emailSettings: IEmailSettings = alerts.emailSettings;
                if (emailSettings.emailProvider === EmailProviderOption.SelfService) {
                    LayoutActions.showPageLoader();
                    this.setState({
                        recipientsEmailAddresses: emailAddresses,
                        openEmailModal: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenEmailModal.name, e));
        }
    };

    private onCloseEmailModal = (): void => {
        try {
            this.setState({
                openEmailModal: false,
                recipientsEmailAddresses: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEmailModal.name, e));
        }
    };
    // #endregion Email Modal
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
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

    private redirectError(code: number): void {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetAlerts = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAlerts.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    alerts: result.data
                }, this.hideAllLoaders);
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAlerts.name, e));
        }
    };

    private resolvePostSaveAlert = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAlert.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const {
                        sectionId
                    } = this.props;
                    this.setState({
                        isAlertModalOpen: false
                    }, () => {
                        LayoutActions.setLoading(true);
                        Requests.getAlerts(sectionId, this.resolveGetAlerts);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveAlert.name, e));
        }
    };

    private resolvePostDeleteAlert = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteAlert.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const {
                        sectionId
                    } = this.props;
                    this.setState({
                        isAlertModalOpen: false,
                        isConfirmationModalOpen: false
                    }, () => {
                        LayoutActions.setLoading(true);
                        Requests.getAlerts(sectionId, this.resolveGetAlerts);
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteAlert.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                Store.setResources(this.props.myPosition, result.data);
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                sectionId
            } = this.props;
            const {
                resources
            } = this.state;

            if (!resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            Requests.getAlerts(sectionId, this.resolveGetAlerts);
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
            classes,
            cultures,
            onDownloadModal
        } = this.props;

        const {
            alerts,
            alertSaved,
            checkboxHeader,
            componentError,
            errorDateAlert,
            isAlertDateInvalid,
            isAlertModalOpen,
            isAlertToInvalid,
            isAlertTypeInvalid,
            isConfirmationModalOpen,
            isIndeterminate,
            isLoading,
            isLoadingSave,
            isStudentSelected,
            resources,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let alertModal: JSX.Element | undefined;
        let emailModal: JSX.Element | undefined;
        const onAddAlert = () => {
            /* violationId= 0
             * studentPosition = 0
             * violationPostion = 0
             * to add a new Alert */
            this.onOpenAlertModal(0, 0);
        };
        const resourcesLayout = LayoutStore.getResourcesLayout();
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrAlerts" height="md" />
            );
        }
        else if (!componentError && resources && resourcesLayout && alerts) {
            alerts.createdDate = moment().format('YYYY-MM-DD');
            alertModal = (
                <AlertModal
                    alerts={alerts}
                    alertSaved={alertSaved}
                    dateTimeCulture={cultures.dateTimeCulture}
                    errorDateAlert={errorDateAlert}
                    isAlertDateInvalid={isAlertDateInvalid}
                    isAlertModalOpen={isAlertModalOpen}
                    isAlertToInvalid={isAlertToInvalid}
                    isAlertTypeInvalid={isAlertTypeInvalid}
                    isLoadingSave={isLoadingSave}
                    lblDropDownEmptyText={resourcesLayout.lblDropDownEmptyText}
                    shortDatePattern={cultures.shortDatePattern}
                    onChangeDatePicker={this.onChangeDatePickerAlerts}
                    onChangeDropdown={this.onChangeDropdownAlerts}
                    onChangeTextField={this.onChangeTextFieldAlerts}
                    onCloseAlertModal={this.onCloseAlertModal}
                    onOpenConfirmationModal={this.onOpenConfirmationModal}
                    onSaveAlerts={this.onSaveAlerts}
                    resources={resources.alertModal}
                />
            );

            if (openEmailModal) {
                emailModal = (
                    <EmailModal
                        emailSettings={alerts.emailSettings}
                        onClose={this.onCloseEmailModal}
                        recipientsEmailAddresses={recipientsEmailAddresses}
                    />
                );
            }

            if (alerts && alerts.sectionViolations && alerts.sectionViolations.length > 0) {
                let hasViolations: any = false;
                const onClickEmail = () => {
                    const emails: string[] = [];
                    alerts.sectionViolations.forEach(status => {
                        if (status.checkbox && status.email) {
                            emails.push(status.email);
                        }
                    });

                    if (alerts.emailSettings.emailProvider === EmailProviderOption.External) {
                        window.open(Format.toString(alerts.emailSettings.staffUrl, [emails.join(alerts.emailSettings.staffSeparator)]),
                            alerts.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                    }
                    else {
                        this.onOpenEmailModal(emails);
                    }
                };

                hasViolations = alerts.sectionViolations.findIndex(a => a.violationList.length > 0);
                if (hasViolations !== -1) {
                    contentPage = (
                        <>
                            <Grid container spacing={3} justifyContent="space-between">
                                <Grid item>
                                    <Text
                                        size="h3"
                                    >
                                        {resources.lblAlertsByStudent}
                                    </Text>
                                </Grid>
                            </Grid>
                            <Hidden smDown>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item xs>
                                        <Checkbox
                                            checked={isIndeterminate || checkboxHeader}
                                            classes={{
                                                focused: classes.checkboxHeader,
                                                root: classes.checkboxHeader
                                            }}
                                            id="chkSelectAll"
                                            indeterminate={isIndeterminate && !checkboxHeader}
                                            inputProps={{
                                                'aria-label': this.layoutResources?.lblSelectAll
                                            }}
                                            onChange={this.onChangeCheckHeader}
                                        />
                                        <Tooltip
                                            id="tltEmailSelected"
                                            title={resources.lblEmailSelect}
                                            placement="top"
                                        >
                                            <div className={classes.inline}>
                                                <IconButton
                                                    alt={resources.lblEmailSelect}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={!isStudentSelected}
                                                    onClick={onClickEmail}
                                                    id="EmailSelectedBtn"
                                                >
                                                    <Icon large name="email" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item sm={6} md={6} className={classes.marginRight}>
                                        <Grid container justifyContent="flex-end">
                                            <Grid item>
                                                <Button
                                                    IconProps={{
                                                        name: 'download'
                                                    }}
                                                    id="download"
                                                    align="left"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={onDownloadModal}
                                                >
                                                    {resources.lblDownload}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip
                                                    id="addAlert"
                                                    title={resources.lblAddAlert}
                                                    aria-label={resources.lblAddAlert}
                                                >
                                                    <IconButton
                                                        id="btnAdd"
                                                        onClick={onAddAlert}
                                                    >
                                                        <Icon name="add" />
                                                    </IconButton>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Hidden>
                            <Hidden mdUp>
                                <Grid container alignItems="center" justifyContent="space-between">
                                    <Grid item xs className={classes.marginLeft}>
                                        <Checkbox
                                            checked={isIndeterminate || checkboxHeader}
                                            classes={{
                                                focused: classes.checkboxHeader,
                                                root: classes.checkboxHeader
                                            }}
                                            id="chkSelectAll"
                                            indeterminate={isIndeterminate && !checkboxHeader}
                                            inputProps={{
                                                'aria-label': this.layoutResources?.lblSelectAll
                                            }}
                                            onChange={this.onChangeCheckHeader}
                                        />
                                        <Tooltip
                                            id="tltEmailSelected"
                                            title={resources.lblEmailSelect}
                                            placement="top"
                                        >
                                            <div className={classes.inline}>
                                                <IconButton
                                                    alt={resources.lblEmailSelect}
                                                    classes={{ root: classes.iconHeader }}
                                                    color="secondary"
                                                    disabled={!isStudentSelected}
                                                    onClick={onClickEmail}
                                                    id="EmailSelectedBtn"
                                                >
                                                    <Icon large name="email" />
                                                </IconButton>
                                            </div>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <ButtonGroup id="bgDownloadAdd">
                                            <IconButton
                                                alt={resources.lblDownload}
                                                classes={{ root: classes.inline }}
                                                color="secondary"
                                                id="DownloadBtn"
                                                onClick={onDownloadModal}
                                            >
                                                <Icon large name="download" />
                                            </IconButton>
                                            <IconButton
                                                aria-label={resources.lblAddAlert}
                                                classes={{ root: classes.inline }}
                                                color="secondary"
                                                onClick={onAddAlert}
                                                id="AddBtn"
                                            >
                                                <Icon large name="add" />
                                            </IconButton>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </Hidden>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <AlertsTable
                                        alerts={alerts.sectionViolations}
                                        resources={resources.alertsTable}
                                        onChangeCheckbox={this.onChangeCheckbox}
                                        onOpenAlertModal={this.onOpenAlertModal}
                                    />
                                </Grid>
                            </Grid>
                            {alertModal}
                            {emailModal}
                            <ConfirmationDialog
                                contentText={resources.alertModal.lblConfirmationContent}
                                open={isConfirmationModalOpen}
                                primaryActionOnClick={this.onCloseConfirmationModal}
                                primaryActionText={resources.alertModal.btnCancel}
                                secondaryActionOnClick={this.onDeleteAlert}
                                secondaryActionText={resources.alertModal.btnDelete}
                                title={Format.toString(resources.alertModal.formatDeleteAlertTitle, [alertSaved.alertName])}
                            />
                        </>
                    );
                }
                else {
                    contentPage = (
                        <>
                            {alertModal}
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Tooltip
                                        id="addAlert"
                                        title={resources.lblAddAlert}
                                        aria-label={resources.lblAddAlert}
                                    >
                                        <IconButton
                                            id="btnAdd"
                                            onClick={onAddAlert}
                                        >
                                            <Icon name="add" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <br />
                            <Illustration
                                color="secondary"
                                height="lg"
                                internalName="no-enrolled"
                                text={resources.lblNoResultsFound}
                            />
                        </>
                    );
                }
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoResultsFound}
                    />
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
export default withStyles(styles)(Alerts);