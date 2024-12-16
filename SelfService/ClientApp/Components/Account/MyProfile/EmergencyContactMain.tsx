/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: EmergencyContactMain.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent, CardHeader } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { UserFriends } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';

// Internal components
import EmergencyContactSave, { IEmergencyContactSaveResProps } from './EmergencyContactSave';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { EmergencyContactType, IEmergencyContact, IPeopleEmergency } from '../../../Types/Account/IPeopleEmergency';
import { EmergencyContactSettingStatus, IEmergencyContactSettings } from '../../../Types/InstitutionSettings/IEmergencyContactSettings';
import { IEmergencyContactMainResources } from '../../../Types/Resources/Account/IEmergencyContactMainResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { emailIsValid, hasJustNumbersAndLetters } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Account/EmergencyContactMain';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IEmergencyContactMainRes extends IEmergencyContactMainResources {
    deleteEmergencyContactConfirmationDialog: IConfirmationDialogResources;
    emergencyContactSave: IEmergencyContactSaveResProps;
}

interface IEmergencyContactMainState {
    componentError: boolean;
    countryOptions?: IDropDownOption[];
    deleteType?: EmergencyContactType;
    emailRegExp?: string;
    emergencyContact?: IEmergencyContact;
    isDeleteModalOpen: boolean;
    isEmergencyContactSaveOpen: boolean;
    isLoading: boolean;
    peopleEmergency: IPeopleEmergency;
    relationTypeOptions?: IDropDownOption[];
    resources?: IEmergencyContactMainRes;
    settings: IEmergencyContactSettings;
}

const styles = createStyles({
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    dataContainer: {
        paddingBottom: Tokens.spacing50,
        paddingLeft: Tokens.spacing50
    },
    textDataContact: {
        wordBreak: 'break-all'
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class EmergencyContactMain extends React.Component<PropsWithStyles, IEmergencyContactMainState> {
    private emergencyContactDefault: IEmergencyContact;
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private phoneFormatChar: string;

    public readonly state: Readonly<IEmergencyContactMainState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.emergencyContactDefault = {
            contactCountry: null,
            contactCountryDesc: '',
            contactCountryModified: false,
            contactEmail: null,
            contactEmailModified: false,
            contactName: null,
            contactNameModified: false,
            contactNotes: null,
            contactNotesModified: false,
            contactPhone: null,
            contactPhoneModified: false,
            contactRel: null,
            contactRelDesc: '',
            contactRelModified: false,
            contactType: EmergencyContactType.Primary,
            emailInvalid: false,
            formattedNumber: undefined,
            isDuplicated: false,
            peopleCodeId: '',
            phoneFormat: undefined
        };
        this.idModule = 'Account';
        this.idPage = 'EmergencyContactMain';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.phoneFormatChar = '@';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IEmergencyContactMainState {
        let resources: IEmergencyContactMainRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isDeleteModalOpen: false,
            isEmergencyContactSaveOpen: false,
            isLoading: true,
            peopleEmergency: {
                contactCountry1: null,
                contactCountry2: null,
                contactCountryDesc1: '',
                contactCountryDesc2: '',
                contactEmail1: null,
                contactEmail2: null,
                contactName1: null,
                contactName2: null,
                contactNotes1: null,
                contactNotes2: null,
                contactPhone1: null,
                contactPhone2: null,
                contactRel1: null,
                contactRel2: null,
                contactRelDesc1: '',
                contactRelDesc2: '',
                peopleCodeId: '',
                phoneFormat1: undefined,
                phoneFormat2: undefined
            },
            resources: resources,
            settings: {
                allowEdit: false,
                country: EmergencyContactSettingStatus.None,
                email: EmergencyContactSettingStatus.None,
                notes: EmergencyContactSettingStatus.None,
                primaryRequired: false,
                secondaryRequired: false,
                isAllRequired: false,
                isAllVisible: false,
                isSomeRequired: false,
                isSomeVisible: false
            }
        };
    }

    // #region Events
    private onChangeDropdown = (optionSelected: IDropDownOption, id: string) => {
        try {
            const {
                emergencyContact
            } = this.state;

            if (emergencyContact) {
                switch (id) {
                    case 'ddlCountry':
                        emergencyContact.contactCountry = String(optionSelected.value);
                        if (!emergencyContact.contactCountry) {
                            emergencyContact.contactCountry = null;
                            emergencyContact.contactCountryDesc = '';
                        }
                        else {
                            emergencyContact.contactCountryDesc = optionSelected.description;
                        }
                        emergencyContact.contactCountryModified = true;
                        emergencyContact.phoneFormat = optionSelected.complement;
                        emergencyContact.formattedNumber = Format.toPhone(emergencyContact.contactPhone || '',
                            emergencyContact.phoneFormat, this.phoneFormatChar);
                        break;
                    case 'ddlRelationship':
                        emergencyContact.contactRel = String(optionSelected.value);
                        if (!emergencyContact.contactRel) {
                            emergencyContact.contactRel = null;
                            emergencyContact.contactRelDesc = '';
                        }
                        else {
                            emergencyContact.contactRelDesc = optionSelected.description;
                        }
                        emergencyContact.contactRelModified = true;
                        break;
                }
                this.setState({
                    emergencyContact: emergencyContact
                }, this.verifyDuplicity);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));

        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                emailRegExp,
                emergencyContact
            } = this.state;

            const id: string = event.target.id;

            if (emergencyContact) {
                switch (id) {
                    case 'txtName':
                        emergencyContact.contactName = event.target.value;
                        emergencyContact.contactNameModified = true;
                        if (!emergencyContact.contactName) {
                            emergencyContact.contactName = null;
                        }
                        break;
                    case 'txtPhoneNumber':
                        if (!Boolean(event.target.value) || hasJustNumbersAndLetters(event.target.value)) {
                            emergencyContact.contactPhone = event.target.value;
                            emergencyContact.contactPhoneModified = true;
                            emergencyContact.formattedNumber = Format.toPhone(emergencyContact.contactPhone,
                                emergencyContact.phoneFormat, this.phoneFormatChar);
                            if (!emergencyContact.contactPhone) {
                                emergencyContact.contactPhone = null;
                            }
                        }
                        break;
                    case 'txtEmail':
                        emergencyContact.contactEmail = event.target.value;
                        emergencyContact.contactEmailModified = true;
                        if (!emergencyContact.contactEmail) {
                            emergencyContact.contactEmail = null;
                        }
                        if (emailRegExp && emergencyContact.contactEmail) {
                            emergencyContact.emailInvalid = !emailIsValid(emergencyContact.contactEmail, emailRegExp);
                        }
                        else {
                            emergencyContact.emailInvalid = false;
                        }
                        break;
                    case 'txtNotes':
                        emergencyContact.contactNotes = event.target.value;
                        emergencyContact.contactNotesModified = true;
                        if (!emergencyContact.contactNotes) {
                            emergencyContact.contactNotes = null;
                        }
                        break;
                }
                this.setState({
                    emergencyContact: emergencyContact
                }, this.verifyDuplicity);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCancelSave = () => {
        try {
            this.setState({
                countryOptions: undefined,
                isEmergencyContactSaveOpen: false,
                emergencyContact: undefined,
                relationTypeOptions: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelSave.name, e));
        }
    };

    private onSaveEmergencyContact = () => {
        try {
            const {
                emergencyContact,
                peopleEmergency,
                settings
            } = this.state;

            if (emergencyContact) {
                emergencyContact.contactNameModified = true;
                emergencyContact.contactCountryModified = true;
                emergencyContact.contactPhoneModified = true;
                emergencyContact.contactRelModified = true;
                emergencyContact.contactEmailModified = true;
                emergencyContact.contactNotesModified = true;

                this.setState({
                    emergencyContact: emergencyContact
                });

                const hasMainFileds = Boolean(emergencyContact.contactName)
                    && Boolean(emergencyContact.contactRel)
                    && Boolean(emergencyContact.contactPhone);
                if (((emergencyContact.contactType === EmergencyContactType.Primary && (!settings.primaryRequired || hasMainFileds))
                    || (emergencyContact.contactType === EmergencyContactType.Secondary && (!settings.secondaryRequired || hasMainFileds)))
                    && (settings.email !== EmergencyContactSettingStatus.Required || Boolean(emergencyContact.contactEmail))
                    && (settings.email !== EmergencyContactSettingStatus.None || !emergencyContact.emailInvalid)
                    && (settings.country !== EmergencyContactSettingStatus.Required || Boolean(emergencyContact.contactCountry))
                    && (settings.notes !== EmergencyContactSettingStatus.Required || Boolean(emergencyContact.contactNotes))
                    && !emergencyContact.isDuplicated) {
                    LayoutActions.showPageLoader();
                    const peopleEmergencyToSave: IPeopleEmergency = { ...peopleEmergency };
                    if (emergencyContact.contactType === EmergencyContactType.Primary) {
                        peopleEmergencyToSave.contactName1 = emergencyContact.contactName;
                        peopleEmergencyToSave.contactCountry1 = emergencyContact.contactCountry;
                        peopleEmergencyToSave.contactPhone1 = emergencyContact.contactPhone;
                        peopleEmergencyToSave.contactRel1 = emergencyContact.contactRel;
                        peopleEmergencyToSave.contactEmail1 = emergencyContact.contactEmail;
                        peopleEmergencyToSave.contactNotes1 = emergencyContact.contactNotes;
                    }
                    else if (emergencyContact.contactType === EmergencyContactType.Secondary) {
                        peopleEmergencyToSave.contactName2 = emergencyContact.contactName;
                        peopleEmergencyToSave.contactCountry2 = emergencyContact.contactCountry;
                        peopleEmergencyToSave.contactPhone2 = emergencyContact.contactPhone;
                        peopleEmergencyToSave.contactRel2 = emergencyContact.contactRel;
                        peopleEmergencyToSave.contactEmail2 = emergencyContact.contactEmail;
                        peopleEmergencyToSave.contactNotes2 = emergencyContact.contactNotes;
                    }
                    Requests.saveEmergencyContacts(peopleEmergencyToSave, this.resolveSaveEmergencyContact, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveEmergencyContact.name, e));
        }
    };

    private onEditEmergencyContact = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const {
                peopleEmergency
            } = this.state;

            const type: EmergencyContactType = Number(event.currentTarget.dataset.type) as EmergencyContactType;
            LayoutActions.showPageLoader();
            const emergencyContact: IEmergencyContact = { ...this.emergencyContactDefault };
            emergencyContact.contactType = type;
            if (type === EmergencyContactType.Primary) {
                emergencyContact.contactName = peopleEmergency.contactName1;
                emergencyContact.contactCountry = peopleEmergency.contactCountry1;
                emergencyContact.contactCountryDesc = peopleEmergency.contactCountryDesc1;
                emergencyContact.contactPhone = peopleEmergency.contactPhone1;
                emergencyContact.phoneFormat = peopleEmergency.phoneFormat1;
                emergencyContact.contactRel = peopleEmergency.contactRel1;
                emergencyContact.contactRelDesc = peopleEmergency.contactRelDesc1;
                emergencyContact.contactEmail = peopleEmergency.contactEmail1;
                emergencyContact.contactNotes = peopleEmergency.contactNotes1;
                emergencyContact.formattedNumber = Format.toPhone(peopleEmergency.contactPhone1 || '',
                    peopleEmergency.phoneFormat1, this.phoneFormatChar);
            }
            else if (type === EmergencyContactType.Secondary) {
                emergencyContact.contactName = peopleEmergency.contactName2;
                emergencyContact.contactCountry = peopleEmergency.contactCountry2;
                emergencyContact.contactCountryDesc = peopleEmergency.contactCountryDesc2;
                emergencyContact.contactPhone = peopleEmergency.contactPhone2;
                emergencyContact.phoneFormat = peopleEmergency.phoneFormat2;
                emergencyContact.contactRel = peopleEmergency.contactRel2;
                emergencyContact.contactRelDesc = peopleEmergency.contactRelDesc2;
                emergencyContact.contactEmail = peopleEmergency.contactEmail2;
                emergencyContact.contactNotes = peopleEmergency.contactNotes2;
                emergencyContact.formattedNumber = Format.toPhone(peopleEmergency.contactPhone2 || '',
                    peopleEmergency.phoneFormat2, this.phoneFormatChar);
            }
            this.setState({
                emergencyContact: emergencyContact
            }, () => Requests.getOptions(this.resolveGetOptions, this.logError));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditEmergencyContact.name, e));
        }
    };

    private onOpenDeleteModal = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const deleteType: EmergencyContactType = Number(event.currentTarget.dataset.type) as EmergencyContactType;
            this.setState({
                deleteType: deleteType,
                isDeleteModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, e));
        }
    };

    private onCloseDeleteModal = () => {
        try {
            this.setState({
                isDeleteModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, e));
        }
    };

    private onDeleteEmergencyContact = () => {
        try {
            const {
                deleteType,
                peopleEmergency
            } = this.state;

            if (peopleEmergency.peopleCodeId && deleteType !== undefined) {
                LayoutActions.showPageLoader();
                const peopleEmergencyToDelete: IPeopleEmergency = { ...peopleEmergency };
                if (deleteType === EmergencyContactType.Primary) {
                    peopleEmergencyToDelete.contactName1 = null;
                    peopleEmergencyToDelete.contactCountry1 = null;
                    peopleEmergencyToDelete.contactPhone1 = null;
                    peopleEmergencyToDelete.contactRel1 = null;
                    peopleEmergencyToDelete.contactEmail1 = null;
                    peopleEmergencyToDelete.contactNotes1 = null;
                }
                else if (deleteType === EmergencyContactType.Secondary) {
                    peopleEmergencyToDelete.contactName2 = null;
                    peopleEmergencyToDelete.contactCountry2 = null;
                    peopleEmergencyToDelete.contactPhone2 = null;
                    peopleEmergencyToDelete.contactRel2 = null;
                    peopleEmergencyToDelete.contactEmail2 = null;
                    peopleEmergencyToDelete.contactNotes2 = null;
                }
                Requests.saveEmergencyContacts(peopleEmergencyToDelete,
                    this.resolveDeleteEmergencyContact,
                    this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteEmergencyContact.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private verifyDuplicity = (): void => {
        try {
            // TODO: This validation will change in the future
            // const {
            //    emergencyContact,
            //    peopleEmergency
            // } = this.state;

            // if (emergencyContact) {
            //    if (emergencyContact.contactType === EmergencyContactType.Primary && peopleEmergency.contactName2) {
            //        emergencyContact.isDuplicated = peopleEmergency.contactName2 === emergencyContact.contactName
            //            && peopleEmergency.contactCountry2 === emergencyContact.contactCountry
            //            && peopleEmergency.contactPhone2 === emergencyContact.contactPhone;
            //    }
            //    else if (emergencyContact.contactType === EmergencyContactType.Secondary && peopleEmergency.contactName1) {
            //        emergencyContact.isDuplicated = peopleEmergency.contactName1 === emergencyContact.contactName
            //            && peopleEmergency.contactCountry1 === emergencyContact.contactCountry
            //            && peopleEmergency.contactPhone1 === emergencyContact.contactPhone;
            //    }
            //    this.setState({
            //        emergencyContact: emergencyContact
            //    });
            // }
        }
        catch (e) {
            this.logError(LogData.fromException(this.verifyDuplicity.name, e));
        }
    };

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
                    resources: result.data
                }, () => Requests.getEmergencyContacts(this.resolveGetEmergencyContacts, this.logError));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveDeleteEmergencyContact = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteEmergencyContact.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    deleteType,
                    peopleEmergency
                } = this.state;

                if (deleteType) {
                    if (deleteType === EmergencyContactType.Primary) {
                        peopleEmergency.contactName1 = null;
                        peopleEmergency.contactCountry1 = null;
                        peopleEmergency.contactCountryDesc1 = '';
                        peopleEmergency.contactPhone1 = null;
                        peopleEmergency.phoneFormat1 = undefined;
                        peopleEmergency.formattedNumber1 = undefined;
                        peopleEmergency.contactRel1 = null;
                        peopleEmergency.contactRelDesc1 = '';
                        peopleEmergency.contactEmail1 = null;
                        peopleEmergency.contactNotes1 = null;
                    }
                    else if (deleteType === EmergencyContactType.Secondary) {
                        peopleEmergency.contactName2 = null;
                        peopleEmergency.contactCountry2 = null;
                        peopleEmergency.contactCountryDesc2 = '';
                        peopleEmergency.contactPhone2 = null;
                        peopleEmergency.phoneFormat2 = undefined;
                        peopleEmergency.contactRel2 = null;
                        peopleEmergency.formattedNumber2 = undefined;
                        peopleEmergency.contactRelDesc2 = '';
                        peopleEmergency.contactEmail2 = null;
                        peopleEmergency.contactNotes2 = null;
                    }
                    this.setState({
                        peopleEmergency: peopleEmergency
                    });
                }
                this.onCloseDeleteModal();
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteEmergencyContact.name, e));
        }
    };

    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    countryOptions: result.data.countryOptions,
                    isEmergencyContactSaveOpen: true,
                    relationTypeOptions: result.data.relationTypeOptions
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolveGetEmergencyContacts = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetEmergencyContacts.name, this.hideAllLoaders);

            if (result?.status) {
                let peopleEmergency: IPeopleEmergency = result.data.peopleEmergency;
                if (!peopleEmergency) {
                    peopleEmergency = this.state.peopleEmergency;
                }
                peopleEmergency.formattedNumber1 = Format.toPhone(peopleEmergency.contactPhone1 || '',
                    peopleEmergency.phoneFormat1, this.phoneFormatChar);
                peopleEmergency.formattedNumber2 = Format.toPhone(peopleEmergency.contactPhone2 || '',
                    peopleEmergency.phoneFormat2, this.phoneFormatChar);

                this.setState({
                    settings: result.data.settings,
                    peopleEmergency: peopleEmergency
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetEmergencyContacts.name, e));
        }
    };

    private resolveSaveEmergencyContact = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveEmergencyContact.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    emergencyContact,
                    peopleEmergency
                } = this.state;

                if (!peopleEmergency.peopleCodeId) {
                    Requests.getEmergencyContacts(this.resolveGetEmergencyContacts, this.logError);
                }
                else if (emergencyContact) {
                    if (emergencyContact.contactType === EmergencyContactType.Primary) {
                        peopleEmergency.contactName1 = emergencyContact.contactName;
                        peopleEmergency.contactCountry1 = emergencyContact.contactCountry;
                        peopleEmergency.contactCountryDesc1 = emergencyContact.contactCountryDesc;
                        peopleEmergency.contactPhone1 = emergencyContact.contactPhone;
                        peopleEmergency.phoneFormat1 = emergencyContact.phoneFormat;
                        peopleEmergency.formattedNumber1 = emergencyContact.formattedNumber;
                        peopleEmergency.contactRel1 = emergencyContact.contactRel;
                        peopleEmergency.contactRelDesc1 = emergencyContact.contactRelDesc;
                        peopleEmergency.contactEmail1 = emergencyContact.contactEmail;
                        peopleEmergency.contactNotes1 = emergencyContact.contactNotes;
                    }
                    else if (emergencyContact.contactType === EmergencyContactType.Secondary) {
                        peopleEmergency.contactName2 = emergencyContact.contactName;
                        peopleEmergency.contactCountry2 = emergencyContact.contactCountry;
                        peopleEmergency.contactCountryDesc2 = emergencyContact.contactCountryDesc;
                        peopleEmergency.contactPhone2 = emergencyContact.contactPhone;
                        peopleEmergency.phoneFormat2 = emergencyContact.phoneFormat;
                        peopleEmergency.formattedNumber2 = emergencyContact.formattedNumber;
                        peopleEmergency.contactRel2 = emergencyContact.contactRel;
                        peopleEmergency.contactRelDesc2 = emergencyContact.contactRelDesc;
                        peopleEmergency.contactEmail2 = emergencyContact.contactEmail;
                        peopleEmergency.contactNotes2 = emergencyContact.contactNotes;
                    }
                    this.setState({
                        peopleEmergency: peopleEmergency
                    });
                }
                this.onCancelSave();
                if (this.layoutResources) {
                    LayoutActions.setAlert({
                        message: this.layoutResources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveEmergencyContact.name, e));
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
            componentError,
            countryOptions,
            deleteType,
            emergencyContact,
            isDeleteModalOpen,
            isEmergencyContactSaveOpen,
            isLoading,
            peopleEmergency,
            relationTypeOptions,
            resources,
            settings
        } = this.state;

        const {
            classes
        } = this.props;

        const primaryContactIsNotEmpty: boolean = Boolean(peopleEmergency.peopleCodeId
            && (peopleEmergency.contactName1
                || peopleEmergency.contactRel1
                || peopleEmergency.contactPhone1
                || (settings.country !== EmergencyContactSettingStatus.None
                    && peopleEmergency.contactCountry1)
                || (settings.email !== EmergencyContactSettingStatus.None
                    && peopleEmergency.contactEmail1)
                || (settings.notes !== EmergencyContactSettingStatus.None
                    && peopleEmergency.contactNotes1)
            ));
        const secondaryContactIsNotEmpty: boolean = Boolean(peopleEmergency.peopleCodeId
            && (peopleEmergency.contactName2
                || peopleEmergency.contactRel2
                || peopleEmergency.contactPhone2
                || (settings.country !== EmergencyContactSettingStatus.None
                    && peopleEmergency.contactCountry2)
                || (settings.email !== EmergencyContactSettingStatus.None
                    && peopleEmergency.contactEmail2)
                || (settings.notes !== EmergencyContactSettingStatus.None
                    && peopleEmergency.contactNotes2)
            ));

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {
            if (isEmergencyContactSaveOpen && emergencyContact) {
                contentPage = (
                    <Card>
                        <CardContent>
                            <EmergencyContactSave
                                countryOptions={countryOptions}
                                emergencyContact={emergencyContact}
                                relationTypeOptions={relationTypeOptions}
                                resources={resources.emergencyContactSave}
                                settings={settings}
                                onCancelSave={this.onCancelSave}
                                onChangeDropdown={this.onChangeDropdown}
                                onChangeTextField={this.onChangeTextField}
                                onSave={this.onSaveEmergencyContact}
                            />
                        </CardContent>
                    </Card>
                );
            }
            else {
                contentPage = (
                    <>
                        <Grid container spacing={4}>
                            {((settings.primaryRequired && !primaryContactIsNotEmpty)
                                || settings.secondaryRequired && !secondaryContactIsNotEmpty)
                                && (
                                    <Grid item xs={12}>
                                        <Alert
                                            id="msgRequiredEmergencyContact"
                                            open={true}
                                            text={resources.lblRequiredContacts}
                                            type={ResultType.warning}
                                            userDismissable={false}
                                        />
                                    </Grid>
                                )}
                            <Grid item xs={12}>
                                <Card>
                                    <CardContent>
                                        <Grid container>
                                            <Grid item xs>
                                                <Text size="h2">
                                                    {resources.lblEmergencyContactsHeader}
                                                </Text>
                                                <Text>
                                                    {resources.lblLegend}
                                                </Text>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                        <Hidden smDown>
                            <Grid container spacing={4}>
                                <Grid item xs={12} sm={6}>
                                    <Card>
                                        <CardHeader
                                            action={(
                                                <ButtonGroup id="btgPrimaryContact">
                                                    {settings.allowEdit && !settings.primaryRequired && primaryContactIsNotEmpty && (
                                                        <Tooltip
                                                            id="tltDelete"
                                                            title={resources.btnDelete}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnDelete}
                                                                color="secondary"
                                                                data-type={1}
                                                                onClick={this.onOpenDeleteModal}
                                                                id="btnDeletePrimaryEmergencyContact"
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {settings.allowEdit && (
                                                        <Tooltip
                                                            id="tltEdit"
                                                            title={resources.btnEdit}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnEdit}
                                                                color="secondary"
                                                                data-type={1}
                                                                onClick={this.onEditEmergencyContact}
                                                                id="btnEditPrimaryEmergencyContact"
                                                            >
                                                                <Icon name="edit" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </ButtonGroup>
                                            )}
                                            title={(
                                                <Text size="h3">
                                                    {resources.lblPrimaryContact}
                                                    {settings.primaryRequired && '*'}
                                                </Text>
                                            )}
                                        />
                                        <CardContent>
                                            {primaryContactIsNotEmpty ? (
                                                <Grid container className={classes.dataContainer}>
                                                    {peopleEmergency.contactName1 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblName}
                                                                    >
                                                                        <Icon large name="user" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactName1}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {peopleEmergency.contactRel1 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblRelationship}
                                                                    >
                                                                        <UserFriends />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactRelDesc1}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.country !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactCountry1
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblCountry}
                                                                        >
                                                                            <Icon large name="location" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactCountryDesc1}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {peopleEmergency.contactPhone1 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltPhoneNumber"
                                                                        title={resources.lblPhoneNumber}
                                                                    >
                                                                        <Icon large name="phone" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.phoneFormat1
                                                                            && settings.country !== EmergencyContactSettingStatus.None ?
                                                                            peopleEmergency.formattedNumber1
                                                                            : peopleEmergency.contactPhone1}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactEmail1
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltEmail"
                                                                            title={resources.lblEmail}
                                                                        >
                                                                            <Icon large name="email" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactEmail1}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {settings.notes !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactNotes1
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblNotes}
                                                                        >
                                                                            <Icon large name="note" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactNotes1}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                </Grid>
                                            ) : (
                                                    <Illustration
                                                        color="secondary"
                                                        height="sm"
                                                        name="id-badge"
                                                        text={resources.lblNoContact}
                                                    />
                                                )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Card>
                                        <CardHeader
                                            action={(
                                                <ButtonGroup id="btgSecondaryContact">
                                                    {settings.allowEdit && !settings.secondaryRequired && secondaryContactIsNotEmpty && (
                                                        <Tooltip
                                                            id="tltDelete"
                                                            title={resources.btnDelete}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnDelete}
                                                                color="secondary"
                                                                data-type={2}
                                                                onClick={this.onOpenDeleteModal}
                                                                id="btnDeleteSecondaryyEmergencyContact"
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {settings.allowEdit && (
                                                        <Tooltip
                                                            id="tltEdit"
                                                            title={resources.btnEdit}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnEdit}
                                                                color="secondary"
                                                                data-type={2}
                                                                onClick={this.onEditEmergencyContact}
                                                                id="btnEditSecondaryEmergencyContact"
                                                            >
                                                                <Icon name="edit" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </ButtonGroup>
                                            )}
                                            title={(
                                                <Text size="h3">
                                                    {resources.lblSecondaryContact}
                                                    {settings.secondaryRequired && '*'}
                                                </Text>
                                            )}
                                        />
                                        <CardContent>
                                            {secondaryContactIsNotEmpty ? (
                                                <Grid container className={classes.dataContainer}>
                                                    {peopleEmergency.contactName2 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblName}
                                                                    >
                                                                        <Icon large name="user" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactName2}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {peopleEmergency.contactRel2 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblRelationship}
                                                                    >
                                                                        <UserFriends />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactRelDesc2}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactCountry2
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblCountry}
                                                                        >
                                                                            <Icon large name="location" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactCountryDesc2}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {peopleEmergency.contactPhone2 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblPhoneNumber}
                                                                    >
                                                                        <Icon large name="phone" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.phoneFormat2
                                                                            && settings.country !== EmergencyContactSettingStatus.None ?
                                                                            peopleEmergency.formattedNumber2
                                                                            : peopleEmergency.contactPhone2}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactEmail2
                                                        && (
                                                            <Grid item xs={12} sm={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblEmail}
                                                                        >
                                                                            <Icon large name="email" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactEmail2}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactNotes2
                                                        && (
                                                            <Grid item xs={12} sm={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblNotes}
                                                                        >
                                                                            <Icon large name="note" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactNotes2}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                </Grid>
                                            ) : (
                                                    <Illustration
                                                        color="secondary"
                                                        height="sm"
                                                        name="id-badge"
                                                        text={resources.lblNoContact}
                                                    />
                                                )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            action={(
                                                <ButtonGroup id="btgPrimaryContact">
                                                    {settings.allowEdit && !settings.primaryRequired && primaryContactIsNotEmpty && (
                                                        <Tooltip
                                                            id="tltDelete"
                                                            title={resources.btnDelete}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnDelete}
                                                                color="secondary"
                                                                data-type={1}
                                                                onClick={this.onOpenDeleteModal}
                                                                id="btnDeletePrimaryEmergencyContact"
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {settings.allowEdit && (
                                                        <Tooltip
                                                            id="tltEdit"
                                                            title={resources.btnEdit}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnEdit}
                                                                color="secondary"
                                                                data-type={1}
                                                                onClick={this.onEditEmergencyContact}
                                                                id="btnEditPrimaryEmergencyContact"
                                                            >
                                                                <Icon name="edit" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </ButtonGroup>
                                            )}
                                            title={(
                                                <Text size="h3">
                                                    {resources.lblPrimaryContact}
                                                    {settings.primaryRequired && '*'}
                                                </Text>
                                            )}
                                        />
                                        <CardContent>
                                            {primaryContactIsNotEmpty ? (
                                                <Grid container className={classes.dataContainer}>
                                                    {peopleEmergency.contactName1 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblName}
                                                                    >
                                                                        <Icon large name="user" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactName1}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {peopleEmergency.contactRel1 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblRelationship}
                                                                    >
                                                                        <UserFriends />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactRelDesc1}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.country !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactCountry1
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblCountry}
                                                                        >
                                                                            <Icon large name="location" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactCountryDesc1}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {peopleEmergency.contactPhone1 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblPhoneNumber}
                                                                    >
                                                                        <Icon large name="phone" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.phoneFormat1
                                                                            && settings.country !== EmergencyContactSettingStatus.None ?
                                                                            peopleEmergency.formattedNumber1
                                                                            : peopleEmergency.contactPhone1}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactEmail1
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblEmail}
                                                                        >
                                                                            <Icon large name="email" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactEmail1}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {settings.notes !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactNotes1
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblNotes}
                                                                        >
                                                                            <Icon large name="note" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactNotes1}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                </Grid>
                                            ) : (
                                                    <Illustration
                                                        color="secondary"
                                                        height="sm"
                                                        name="id-badge"
                                                        text={resources.lblNoContact}
                                                    />
                                                )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Card>
                                        <CardHeader
                                            action={(
                                                <ButtonGroup id="btgSecondaryContact">
                                                    {settings.allowEdit && !settings.secondaryRequired && secondaryContactIsNotEmpty && (
                                                        <Tooltip
                                                            id="tltDelete"
                                                            title={resources.btnDelete}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnDelete}
                                                                color="secondary"
                                                                data-type={2}
                                                                onClick={this.onOpenDeleteModal}
                                                                id="btnDeleteSecondaryyEmergencyContact"
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {settings.allowEdit && (
                                                        <Tooltip
                                                            id="tltEdit"
                                                            title={resources.btnEdit}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                aria-label={resources.btnEdit}
                                                                color="secondary"
                                                                data-type={2}
                                                                onClick={this.onEditEmergencyContact}
                                                                id="btnEditSecondaryEmergencyContact"
                                                            >
                                                                <Icon name="edit" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </ButtonGroup>
                                            )}
                                            title={(
                                                <Text size="h3">
                                                    {resources.lblSecondaryContact}
                                                    {settings.secondaryRequired && '*'}
                                                </Text>
                                            )}
                                        />
                                        <CardContent>
                                            {secondaryContactIsNotEmpty ? (
                                                <Grid container className={classes.dataContainer}>
                                                    {peopleEmergency.contactName2 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblName}
                                                                    >
                                                                        <Icon large name="user" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactName2}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {peopleEmergency.contactRel2 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblRelationship}
                                                                    >
                                                                        <UserFriends />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.contactRelDesc2}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactCountry2
                                                        && (
                                                            <Grid item xs={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblCountry}
                                                                        >
                                                                            <Icon large name="location" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactCountryDesc2}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {peopleEmergency.contactPhone2 && (
                                                        <Grid item xs={12}>
                                                            <Grid container wrap="nowrap">
                                                                <Grid item>
                                                                    <Tooltip
                                                                        id="tltName"
                                                                        title={resources.lblPhoneNumber}
                                                                    >
                                                                        <Icon large name="phone" />
                                                                    </Tooltip>
                                                                </Grid>
                                                                <Grid item xs>
                                                                    <Text className={classes.textDataContact}>
                                                                        {peopleEmergency.phoneFormat2
                                                                            && settings.country !== EmergencyContactSettingStatus.None ?
                                                                            peopleEmergency.formattedNumber2
                                                                            : peopleEmergency.contactPhone2}
                                                                    </Text>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactEmail2
                                                        && (
                                                            <Grid item xs={12} sm={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblEmail}
                                                                        >
                                                                            <Icon large name="email" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactEmail2}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                    {settings.email !== EmergencyContactSettingStatus.None
                                                        && peopleEmergency.contactNotes2
                                                        && (
                                                            <Grid item xs={12} sm={12}>
                                                                <Grid container wrap="nowrap">
                                                                    <Grid item>
                                                                        <Tooltip
                                                                            id="tltName"
                                                                            title={resources.lblNotes}
                                                                        >
                                                                            <Icon large name="note" />
                                                                        </Tooltip>
                                                                    </Grid>
                                                                    <Grid item xs>
                                                                        <Text className={classes.textDataContact}>
                                                                            {peopleEmergency.contactNotes2}
                                                                        </Text>
                                                                    </Grid>
                                                                </Grid>
                                                            </Grid>
                                                        )}
                                                </Grid>
                                            ) : (
                                                    <Illustration
                                                        color="secondary"
                                                        height="sm"
                                                        name="id-badge"
                                                        text={resources.lblNoContact}
                                                    />
                                                )}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            </Grid>
                        </Hidden>
                        <ConfirmationDialog
                            contentText={deleteType === EmergencyContactType.Secondary ?
                                resources.deleteEmergencyContactConfirmationDialog.formatContentOptional
                                : resources.deleteEmergencyContactConfirmationDialog.formatContent}
                            open={isDeleteModalOpen}
                            primaryActionOnClick={this.onCloseDeleteModal}
                            primaryActionText={resources.deleteEmergencyContactConfirmationDialog.btnDecline}
                            secondaryActionOnClick={this.onDeleteEmergencyContact}
                            secondaryActionText={resources.deleteEmergencyContactConfirmationDialog.btnAccept}
                            title={resources.deleteEmergencyContactConfirmationDialog.lblTitle}
                        />
                    </>
                );
            }
        }

        return (
            <Grid container className={classes.cardContainerTop}>
                <Grid item xs>
                    {contentPage}
                </Grid>
            </Grid>
        );
    }
}
// #endregion Component

// RenderDOM: Component
export default withStyles(styles)(EmergencyContactMain);