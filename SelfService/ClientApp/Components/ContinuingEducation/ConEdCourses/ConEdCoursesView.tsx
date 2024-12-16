/* Copyright 2019 - 2024 Ellucian Company L.P. and its affiliates.
 * File: ConEdCoursesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Stoplist from '../../Generic/Stoplist';

// Internal component
import AgreementModal from '../../Generic/AgreementModal';
import CompleteProfileModal from '../../Generic/CompleteProfileModal';
import FailedPaymentModal from '../../Generic/FailedPaymentModal';
import PaymentDetailModal from '../../Generic/PaymentDetailModal';
import ProcessPaymentModal from '../../Generic/ProcessPaymentModal';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import SignIn from '../../Generic/SignIn';
import SignUp from '../../Generic/SignUp';
import SuccessfulPaymentModal from '../../Generic/SuccessfulPaymentModal';
import AdvancedSearchModal, { IAdvancedSearchOptionModalResProps } from '../../Registration/Courses/AdvancedSearchModal';
import CreditTypeModal, { ICreditTypeModalResProps } from '../../Registration/Courses/CreditTypeModal';
import PermissionRequestModal, { IPermissionRequestModalResProps } from '../../Registration/Courses/PermissionRequestModal';
import ScheduleList, { IScheduleListResProps } from '../../Registration/Courses/ScheduleList';
import ValidationMessagesModal, { IValidationMessagesModalResProps } from '../../Registration/Courses/ValidationMessagesModal';
import ConEdSectionCard, { IConEdSectionCardResProps } from './ConEdSectionCard';
import ConEdSectionsSearch, { IConEdSectionsSearchResProps } from './ConEdSectionsSearch';
import ConEdValidationMessagesModal, { IConEdValidationMessagesModalResProps } from './ConEdValidationMessagesModal';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPermissionRequestInfo } from '@hedtech/powercampus-design-system/types/Student/IPermissionRequestInfo';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ScheduleListType } from '@hedtech/powercampus-design-system/types/Section/ScheduleListType';
import { IAdvancedSearch } from '../../../Types/Section/IAdvancedSearch';
import { IAgreementDetail } from '../../../Types/Agreements/IAgreementDetail';
import { IConEdCoursesResources } from '../../../Types/Resources/ContinuingEducation/IConEdCoursesResources';
import { IPaymentDiscountCoupon } from '../../../Types/Payment/IPaymentDiscountCoupon';
import { IPaymentInfo } from '../../../Types/Payment/IPaymentInfo';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
import { IRegistrationValidation } from '../../../Types/Course/IRegistrationValidation';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionSearchOption } from '../../../Types/Section/ISectionSearchOption';
import { IStudentRegistration } from '../../../Types/Students/IStudentRegistration';
import { PaymentOrigin } from '../../../Types/Enum/PaymentOrigin';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import SectionHelper from '@hedtech/powercampus-design-system/helpers/SectionHelper';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import Requests from '../../../Requests/ContinuingEducation/ConEdCourses';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IDropConEdConfirmationResources {
    btnAccept: string;
    btnDecline: string;
    formatTitle: string;
    lblContent: string;
}

interface IConEdCoursesRes extends IConEdCoursesResources {
    advancedSearchModal: IAdvancedSearchOptionModalResProps;
    conEdSectionCard: IConEdSectionCardResProps;
    conEdSectionsSearch: IConEdSectionsSearchResProps;
    conEdValidationMessagesModal: IConEdValidationMessagesModalResProps;
    creditTypeModal: ICreditTypeModalResProps;
    dropConEdConfirmation: IDropConEdConfirmationResources;
    permissionRequestModal: IPermissionRequestModalResProps;
    scheduleList: IScheduleListResProps;
    sectionDetailModal: ISectionDetailModalResProps;
    validationMessagesModal: IValidationMessagesModalResProps;
}

interface IConEdCoursesState {
    advancedSearchModalOpen: boolean;
    advancedSearchOptions?: ISectionSearchOption;
    advancedSearchSelected?: IAdvancedSearch;
    componentError: boolean;
    cultures: ICultures;
    dirtySearch: boolean;
    hasProfile: boolean;
    isAuthenticated: boolean;
    isLoading: boolean;
    isOnStopList: boolean;
    keywords?: string;
    resources?: IConEdCoursesRes;
    sectionModalOpen: boolean;
    sections?: ISection[];
    sectionDetail?: ISectionDetail;
    showPicture: boolean;
    showDeniedCourses: boolean;

    // Account
    profileModal: boolean;
    registerAfterSave: boolean;
    showSignIn: boolean;
    showSignUp: boolean;
    userName?: string;

    // MySchedule
    agreement?: IAgreementDetail;
    agreementMandatory: boolean;
    agreementModalOpen: boolean;
    agreementStatus: boolean;
    countActions: number;
    creditTypeModalOpen: boolean;
    creditTypeSelected?: IDropDownOption;
    enableRegister: boolean;
    errorLoadingScheduleList: boolean;
    isDropDialog: boolean;
    isLoadingScheduleList: boolean;
    // Use ScheduleListType enum as the list index of the matrix
    mySchedule: IStudentSchedule[][];
    permissionRequestInfo?: IPermissionRequestInfo[];
    permissionRequestModalOpen: boolean;
    sectionSelected?: ISection;
    sectionsToRegister?: IStudentRegistration;
    viewCommentsAnchor: any;
    warningsMySchedule?: string;

    // Registration validation
    conEdValidationMessagesModalOpen: boolean;
    registrationValidation?: IRegistrationValidation;
    sectionsDateConflict?: string[];
    validationMessagesModalOpen: boolean;
    validationType: 'register' | 'drop';

    // Payment
    coupons: IPaymentDiscountCoupon[];
    couponToRemove: number;
    enableOnlinePayment: boolean;
    paymentDetailModalOpen: boolean;
    paymentInfo?: IPaymentInfo;
    paymentInfoNoChanges?: IPaymentInfo;
    paymentModalOpenFail: boolean;
    paymentModalOpenProcess: boolean;
    paymentModalOpenSuccess: boolean;
    paymentTransaction?: IPaymentTransaction;
}

const styles = (theme: Theme) => createStyles({
    createAccountMessage: {
        [theme.breakpoints.down('xs')]: {
            marginBottom: 0,
            marginTop: 0
        },
        [theme.breakpoints.down('md')]: {
            marginBottom: Tokens.spacing20,
            marginTop: Tokens.spacing20
        },
        marginBottom: Tokens.spacing40,
        marginTop: Tokens.spacing40
    },
    messagesMargin: {
        marginBottom: Tokens.spacing40
    }
});

type PropsWithStyles = WithStyles<typeof styles>;
// #endregion Types

// #region Component
class ConEdCoursesView extends React.Component<PropsWithStyles, IConEdCoursesState> {
    private abortController: AbortController;
    private dropSectionId: number;
    private dropSectionName: string;
    private idModule: string;
    private idPage: string;
    private myScheduleLength: number;

    public readonly state: Readonly<IConEdCoursesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.abortController = new AbortController();
        this.dropSectionId = 0;
        this.dropSectionName = '';
        this.idModule = 'ContinuingEducation';
        this.idPage = 'ConEdCourses';
        this.myScheduleLength = 5;
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): IConEdCoursesState {
        let resources: IConEdCoursesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            advancedSearchModalOpen: false,
            advancedSearchSelected: {
                eventId: '',
                keywords: '',
                registrationType: 'CONED'
            } as IAdvancedSearch,
            componentError: false,
            cultures: LayoutStore.getCultures(),
            dirtySearch: false,
            hasProfile: false,
            isAuthenticated: false,
            isLoading: true,
            isOnStopList: false,
            keywords: '',
            resources: resources,
            sectionModalOpen: false,
            showPicture: false,
            showDeniedCourses: false,

            // Account
            profileModal: false,
            registerAfterSave: false,
            showSignIn: false,
            showSignUp: false,

            // MySchedule
            agreementMandatory: false,
            agreementModalOpen: false,
            agreementStatus: false,
            countActions: 0,
            creditTypeModalOpen: false,
            enableRegister: false,
            errorLoadingScheduleList: false,
            isDropDialog: false,
            isLoadingScheduleList: true,
            mySchedule: [[], [], [], [], []],
            permissionRequestModalOpen: false,
            viewCommentsAnchor: null,

            // Registration validation
            conEdValidationMessagesModalOpen: false,
            validationMessagesModalOpen: false,
            validationType: 'register',

            // Payment
            coupons: [],
            couponToRemove: -1,
            enableOnlinePayment: false,
            paymentDetailModalOpen: false,
            paymentModalOpenFail: false,
            paymentModalOpenProcess: false,
            paymentModalOpenSuccess: false
        };
    }

    private onChangeShowDeniedCourses = (): void => {
        try {
            const {
                showDeniedCourses
            } = this.state;

            this.setState({
                showDeniedCourses: !showDeniedCourses
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeShowDeniedCourses.name, e));
        }
    };

    // #region Events

    // #region Account
    private onAfterSaveProfile = (): void => {
        try {
            this.setState({
                hasProfile: true,
                profileModal: false
            }, this.reloadScheduleList);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAfterSaveProfile.name, e));
        }
    };

    private onCloseProfileModal = (): void => {
        try {
            this.setState({
                profileModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseProfileModal.name, e));
        }
    };

    private onCloseSignIn = (): void => {
        try {
            this.setState({
                showSignIn: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSignIn.name, e));
        }
    };

    private onCloseSignUp = (): void => {
        try {
            this.setState({
                showSignUp: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSignUp.name, e));
        }
    };

    private onOpenProfileModal = (): void => {
        try {
            const {
                isAuthenticated
            } = this.state;

            if (isAuthenticated) {
                this.setState({
                    profileModal: true,
                    registerAfterSave: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenProfileModal.name, e));
        }
    };

    private onOpenSignIn = (): void => {
        try {
            this.setState({
                showSignIn: true,
                showSignUp: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenSignIn.name, e));
        }
    };

    private onOpenSignUp = (): void => {
        try {
            this.setState({
                showSignIn: false,
                showSignUp: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenSignUp.name, e));
        }
    };

    private onAfterSignUp = (userName?: string): void => {
        try {
            if (userName) {
                this.setState({
                    showSignIn: true,
                    showSignUp: false,
                    userName: userName
                });
            }
            else {
                this.setState({
                    showSignUp: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAfterSignUp.name, e));
        }
    };
    // #endregion Account

    // #region Agreement
    private onAgreementSaved = (): void => {
        try {
            this.setState({
                agreementStatus: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAgreementSaved.name, e));
        }
    };

    private onCloseAgreementModal = (): void => {
        try {
            this.setState({
                agreementModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAgreementModal.name, e));
        }
    };

    private onOpenAgreementModal = (): void => {
        try {
            this.setState({
                agreementMandatory: false,
                agreementModalOpen: true
            });
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onOpenAgreementModal.name, e));
        }
    };
    // #endregion Agreement

    // #region Cart
    private onAddToCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionModalOpen
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            this.addLoadingCard(id, 1);
            Requests.postAddToCart(id, this.resolvePostAddToCart, this.logErrorScheduleList);
            this.setState(prevState => ({
                countActions: prevState.countActions + 1
            }));
            if (sectionModalOpen) {
                this.onCloseSectionModal();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAddToCart.name, e));
        }
    };

    private onAddToWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionModalOpen
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            this.addLoadingCard(id, 0);
            Requests.postAddToWaitlist(id, this.resolvePostAddToWaitlist, this.logErrorScheduleList);
            this.setState(prevState => ({
                countActions: prevState.countActions + 1
            }));
            if (sectionModalOpen) {
                this.onCloseSectionModal();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAddToCart.name, e));
        }
    };

    private onChangeCreditType = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            this.setState({
                creditTypeSelected: optionSelected
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCreditType.name, e));
        }
    };

    private onChangeStudentComments = (event: any): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                studentSchedule.permissionRequestInfo[0].studentComments = event.target.value;
                studentSchedule.permissionRequestInfo[0].modified = true;
                studentSchedule.permissionRequestInfo[0].error = false;
                this.setState({
                    sectionSelected: studentSchedule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeStudentComments.name, e));
        }
    };

    private onCloseConEdMessagesModal = (): void => {
        try {
            this.setState({
                conEdValidationMessagesModalOpen: false,
                sectionsDateConflict: undefined,
                validationType: 'register'
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseConEdMessagesModal.name, e));
        }
    };

    private onCloseCreditTypeModal = (): void => {
        try {
            const {
                sectionDetail,
                sectionSelected
            } = this.state;

            this.setState({
                creditTypeModalOpen: false,
                creditTypeSelected: undefined,
                sectionSelected: sectionDetail ? sectionSelected : undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseCreditTypeModal.name, e));
        }
    };

    private onCloseDropDialog = (): void => {
        try {
            this.setState({
                isDropDialog: false
            }, () => {
                this.dropSectionId = 0;
                this.dropSectionName = '';
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDropDialog.name, e));
        }
    };

    private onCloseMessagesModal = (): void => {
        try {
            this.setState({
                registrationValidation: undefined,
                validationMessagesModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseMessagesModal.name, e));
        }
    };

    private onClosePermissionRequestViewCommentsModal = (): void => {
        try {
            this.setState({
                permissionRequestModalOpen: false,
                sectionSelected: undefined,
                viewCommentsAnchor: null
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePermissionRequestViewCommentsModal.name, e));
        }
    };

    private onDropSection = (): void => {
        try {
            const {
                enableRegister,
                sectionModalOpen
            } = this.state;

            if (enableRegister) {
                if (this.dropSectionId > 0) {
                    LayoutActions.setLoading(true);
                    Requests.postDropRegistration(this.dropSectionId, this.resolvePostDrop, this.logErrorScheduleList);
                    this.onCloseDropDialog();
                    if (sectionModalOpen) {
                        this.onCloseSectionModal();
                    }
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onDropSection.name, e));
        }
    };

    private onOpenCreditTypeModal = (id: number): void => {
        try {
            const {
                mySchedule
            } = this.state;

            let sectionFound: IStudentSchedule | undefined;
            if (mySchedule) {
                mySchedule.forEach(sectionList => {
                    sectionList.forEach(sectionInList => {
                        if (!Boolean(sectionFound) && sectionInList.id === id) {
                            sectionFound = sectionInList;
                        }
                    });
                });
            }

            if (sectionFound) {
                let creditTypeOptionSelected: IDropDownOption;
                if (sectionFound.creditType) {
                    creditTypeOptionSelected = {
                        description: sectionFound.creditTypeDescription,
                        value: sectionFound.creditType
                    } as IDropDownOption;
                }
                else {
                    creditTypeOptionSelected = {
                        description: sectionFound.defaultCreditTypeDesc,
                        value: sectionFound.defaultCreditType
                    } as IDropDownOption;
                }
                this.setState({
                    creditTypeModalOpen: true,
                    creditTypeSelected: creditTypeOptionSelected,
                    sectionSelected: sectionFound
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenCreditTypeModal.name, e));
        }
    };

    private onOpenDropDialog = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            this.dropSectionId = Number(event.currentTarget.dataset.id);
            this.dropSectionName = String(event.currentTarget.dataset.name);
            this.setState({
                isDropDialog: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDropDialog.name, e));
        }
    };

    private onOpenPermissionRequestModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                mySchedule
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);

            let exist: boolean = false;
            if (mySchedule) {
                mySchedule.forEach(sectionList => {
                    sectionList.forEach(section => {
                        if (!exist && section.id === id) {
                            exist = true;
                            this.setState({
                                permissionRequestModalOpen: true,
                                sectionSelected: section,
                                viewCommentsAnchor: null
                            });
                        }
                    });
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPermissionRequestModal.name, e));
        }
    };

    private onOpenViewCommentsModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                mySchedule
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            let permissionRequest: boolean = false;
            if (event.currentTarget.dataset.permissionrequest !== undefined) {
                permissionRequest = JSON.parse(event.currentTarget.dataset.permissionrequest);
            }

            let exist: boolean = false;
            const viewCommentsAnchor: any = event.currentTarget.parentNode ? event.currentTarget.parentNode.parentNode : null;
            if (mySchedule) {
                mySchedule.forEach(sectionList => {
                    sectionList.forEach(section => {
                        if (!exist && section.id === id) {
                            exist = true;
                            if (permissionRequest && section.isInCart) {
                                this.setState({
                                    permissionRequestModalOpen: true,
                                    sectionSelected: section,
                                    viewCommentsAnchor: viewCommentsAnchor
                                });
                            }
                        }
                    });
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenViewCommentsModal.name, e));
        }
    };

    private onRefreshMySchedule = (): void => {
        try {
            const {
                countActions,
                isLoadingScheduleList
            } = this.state;

            if (countActions <= 0 && !isLoadingScheduleList) {
                this.reloadScheduleList();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRefreshMySchedule.name, e));
        }
    };

    private onRegister = (): void => {
        try {
            const {
                enableRegister,
                errorLoadingScheduleList,
                hasProfile,
                isAuthenticated
            } = this.state;

            if (enableRegister && !errorLoadingScheduleList) {
                if (isAuthenticated && hasProfile) {
                    LayoutActions.setLoading(true);
                    const sections: IStudentRegistration = this.getSectionsToRegister();
                    if (Object.entries(sections).length > 0) {
                        this.setState({
                            sectionsToRegister: sections
                        });
                        Requests.postStudentRegistration(
                            sections,
                            this.resolvePostStudentRegistration,
                            this.logErrorScheduleList);
                    }
                    else {
                        LayoutActions.setLoading(false);
                    }
                }
                else if (isAuthenticated) {
                    this.setState({
                        profileModal: true,
                        registerAfterSave: true
                    });
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onRegister.name, e));
        }
    };

    private onRegisterWithAgreement = (): void => {
        try {
            const {
                hasProfile,
                isAuthenticated
            } = this.state;

            if (isAuthenticated && hasProfile) {
                LayoutActions.setLoading(true);
                const sections: IStudentRegistration = this.getSectionsToRegister();
                if (Object.entries(sections).length > 0) {
                    this.setState({
                        agreementMandatory: true,
                        agreementModalOpen: true
                    });
                    LayoutActions.setLoading(false);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRegisterWithAgreement.name, e));
        }
    };

    private onRemoveFromCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionModalOpen
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            this.hideActionsCard(id);
            Requests.postRemoveFromCart(id, this.resolvePostRemoveFromCart, this.logErrorScheduleList);
            this.setState(prevState => ({
                countActions: prevState.countActions + 1
            }));
            if (sectionModalOpen) {
                this.onCloseSectionModal();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onRemoveFromCart.name, e));
        }
    };

    private onRemoveFromWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                sectionModalOpen
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            this.hideActionsCard(id);
            Requests.postRemoveFromWaitlist(id, this.resolvePostRemoveFromWaitlist, this.logErrorScheduleList);
            this.setState(prevState => ({
                countActions: prevState.countActions + 1
            }));
            if (sectionModalOpen) {
                this.onCloseSectionModal();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onRemoveFromWaitlist.name, e));
        }
    };

    private onSaveCreditType = (): void => {
        try {
            const {
                creditTypeSelected,
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && creditTypeSelected) {
                if (studentSchedule.isInWaitlist) {
                    this.setNewCreditType(true);
                }
                else if (studentSchedule.isInCart) {
                    Requests.postEditCreditType(
                        studentSchedule.id,
                        String(creditTypeSelected.value),
                        this.resolveSaveCreditType,
                        this.logErrorScheduleList);
                    LayoutActions.setLoading(true);
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onSaveCreditType.name, e));
        }
    };

    private onSendPermissionRequest = (): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule
                && studentSchedule.permissionRequestInfo
                && studentSchedule.permissionRequestInfo.length > 0) {
                if (studentSchedule.permissionRequestInfo[0].id === 0) {
                    // Save
                    if (studentSchedule.permissionRequestInfo[0].studentComments
                        && studentSchedule.permissionRequestInfo[0].studentComments.trim() !== '') {
                        // Hide from search
                        studentSchedule.hideActions = true;
                        this.setState({
                            sectionSelected: studentSchedule
                        });
                        LayoutActions.setLoading(true);
                        Requests.postSavePermissionRequest(studentSchedule.id,
                            studentSchedule.permissionRequestInfo[0].studentComments,
                            this.resolvePostSavePermissionRequest,
                            this.logErrorScheduleList);
                        this.setState(prevState => ({
                            countActions: prevState.countActions + 1
                        }));
                    }
                    else {
                        studentSchedule.permissionRequestInfo[0].error = true;
                        this.setState({
                            sectionSelected: studentSchedule
                        });
                        const textfield: HTMLElement | null = document.getElementById('txtComments');
                        if (textfield) {
                            textfield.focus();
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onSendPermissionRequest.name, e));
        }
    };
    // #endregion Cart

    // #region Permission Request Detail
    private onCancelEditPermissionRequest = (id: number): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    permissionRequestInfo.editable = false;
                    permissionRequestInfo.modified = false;
                    permissionRequestInfo.studentComments = permissionRequestInfo.studentCommentsBackup;
                    permissionRequestInfo.studentCommentsBackup = '';
                    this.setState({
                        sectionSelected: studentSchedule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnableEditPermissionRequest.name, e));
        }
    };

    private onChangeCommentsForEdit = (id: number, value: string): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    permissionRequestInfo.studentComments = value;
                    permissionRequestInfo.modified = true;
                    permissionRequestInfo.error = false;
                    this.setState({
                        sectionSelected: studentSchedule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCommentsForEdit.name, e));
        }
    };

    private onEditPermissionRequest = (id: number): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    // Edit
                    if (permissionRequestInfo.studentComments
                        && permissionRequestInfo.studentComments.trim() !== '') {
                        Requests.postEditPermissionRequest(permissionRequestInfo.id,
                            permissionRequestInfo.studentComments,
                            this.resolvePostEditPermissionRequest,
                            this.logError);
                        LayoutActions.setLoading(true);
                    }
                    else {
                        permissionRequestInfo.error = true;
                        this.setState({
                            sectionSelected: studentSchedule
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditPermissionRequest.name, e));
        }
    };

    private onEnableEditPermissionRequest = (id: number): void => {
        try {
            const {
                sectionSelected
            } = this.state;

            const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
            if (studentSchedule && studentSchedule.permissionRequestInfo) {
                const permissionRequestInfo: IPermissionRequestInfo | undefined
                    = studentSchedule.permissionRequestInfo.find(pri => pri.id === id);
                if (permissionRequestInfo) {
                    permissionRequestInfo.editable = true;
                    permissionRequestInfo.studentCommentsBackup = permissionRequestInfo.studentComments;
                    this.setState({
                        sectionSelected: studentSchedule
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnableEditPermissionRequest.name, e));
        }
    };
    // #endregion Permission Request Detail

    // #region Payment
    private onClosePaymentDetailModal = (): void => {
        try {
            const {
                resources
            } = this.state;

            this.setState({
                coupons: [],
                enableOnlinePayment: false,
                paymentDetailModalOpen: false,
                paymentInfo: undefined,
                paymentInfoNoChanges: undefined
            }, () => {
                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblRegistrationSuccess,
                        messageType: ResultType.success
                    } as IAlert);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentDetailModal.name, e));
        }
    };

    private onClosePaymentModalFail = (): void => {
        try {
            this.setState({
                paymentModalOpenFail: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalFail.name, e));
        }
    };

    private onClosePaymentModalProcess = (): void => {
        try {
            this.setState({
                paymentModalOpenProcess: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalProcess.name, e));
        }
    };

    private onClosePaymentModalSuccess = (): void => {
        try {
            const {
                resources
            } = this.state;

            this.setState({
                paymentModalOpenSuccess: false
            }, () => {
                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblRegistrationSuccess,
                        messageType: ResultType.success
                    } as IAlert);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePaymentModalSuccess.name, e));
        }
    };

    private onPay = (): void => {
        try {
            const {
                paymentInfo
            } = this.state;

            if (paymentInfo) {
                this.setState({
                    paymentModalOpenProcess: paymentInfo.canPay
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onPay.name, e));
        }
    };

    // #region Discounts
    private onApplyCoupon = (): void => {
        try {
            const {
                coupons,
                paymentInfo
            } = this.state;

            // One coupon, to accept more than one coupon delete couponsApplied
            const couponsApplied: IPaymentDiscountCoupon[] | undefined = coupons.filter(c => c.isApplied);
            if (paymentInfo && (!couponsApplied || (couponsApplied && couponsApplied.length === 0))) {
                const couponToApply: IPaymentDiscountCoupon | undefined = coupons.find(c => c.isNew);
                if (couponToApply) {
                    if (couponToApply.code) {
                        LayoutActions.setLoading(true);
                        Requests.postApplyCoupon(couponToApply,
                            this.resolvePostApplyCoupon, this.logError);
                    }
                    else {
                        couponToApply.isModified = true;
                        this.setState({
                            coupons: coupons
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApplyCoupon.name, e));
        }
    };

    private onChangeCouponCode = (event: any): void => {
        try {
            const {
                coupons
            } = this.state;

            const positionParts: string[] = event.target.id.split('_');
            const position: number = Number(positionParts[1]);
            if (!coupons[position].isApplied) {
                coupons[position].code = event.target.value;
                coupons[position].isModified = true;
                coupons[position].isValid = true;

                this.setState({
                    coupons: coupons
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCouponCode.name, e));
        }
    };

    private onRemoveCoupon = (event: any): void => {
        try {
            const {
                coupons
            } = this.state;

            if (coupons.length > 0) {
                const parts: string[] = event.target.id.split('_');
                const position: number = Number(parts[1]);
                if (coupons[position]) {
                    this.setState({
                        couponToRemove: position
                    });
                    LayoutActions.setLoading(true);
                    Requests.postRemoveCoupon(coupons[position],
                        this.resolvePostRemoveCoupon, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRemoveCoupon.name, e));
        }
    };
    // #endregion Discounts

    // #endregion Payment

    // #region Search
    private onAdvancedSearch = (): void => {
        try {
            LayoutActions.setLoading(true);
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;

            if (optionsSelected) {
                Requests.postAdvancedSearchOptions(optionsSelected, this.resolveGetSections, this.logError);
                this.setState({
                    keywords: optionsSelected.keywords
                });
            }
            else {
                this.setState({
                    advancedSearchModalOpen: false
                });
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAdvancedSearch.name, e));
        }
    };

    private onAdvancedSearchDateTimeChange = (date: string, id: string, _isValid: boolean): void => {
        try {
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;
            if (optionsSelected) {
                const idSelected = id.replace('_AdvancedSearchModal', '');
                optionsSelected[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = date;
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchDateTimeChange.name, e));
        }
    };

    private onAdvancedSearchDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const ids: string[] = id.split('_');
            id = ids.length > 1 ? ids[0] : id;
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;
            if (optionsSelected) {
                optionsSelected[`${id[3].toLowerCase()}${id.substr(4, id.length - 4)}`] = optionSelected.value;
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchDropdownChange.name, e));
        }
    };

    private onAdvancedSearchTextFieldChange = (event: any): void => {
        try {
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;
            let idSelected: string = event.target.id;
            idSelected = idSelected.replace('_AdvancedSearchModal', '');
            if (optionsSelected) {
                optionsSelected[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchTextFieldChange.name, e));
        }
    };

    private onBasicSearchChange = (event: any): void => {
        try {
            this.setState({
                keywords: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBasicSearchChange.name, e));
        }
    };

    private onBasicSearchClear = (): void => {
        try {
            this.setState({
                keywords: ''
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBasicSearchClear.name, e));
        }
    };

    private onBasicSearchEnterPress = (searchValue: string): void => {
        try {
            this.setState({
                keywords: searchValue
            }, this.search);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBasicSearchEnterPress.name, e));
        }
    };

    private onClearSelectedOptions = (): void => {
        try {
            const optionsSelected: IAdvancedSearch | undefined = this.state.advancedSearchSelected;

            if (optionsSelected) {
                optionsSelected.campusId = '';
                optionsSelected.classLevel = '';
                optionsSelected.college = '';
                optionsSelected.creditType = '';
                optionsSelected.curriculum = '';
                optionsSelected.department = '';
                optionsSelected.endDate = '';
                optionsSelected.endTime = '';
                optionsSelected.eventId = '';
                optionsSelected.eventSubType = '';
                optionsSelected.eventType = '';
                optionsSelected.generalEd = '';
                optionsSelected.instructorId = undefined;
                optionsSelected.keywords = '';
                optionsSelected.meeting = '';
                optionsSelected.nonTradProgram = '';
                optionsSelected.population = '';
                optionsSelected.program = '';
                optionsSelected.registrationType = 'CONED';
                optionsSelected.session = '';
                optionsSelected.startDate = '';
                optionsSelected.startTime = '';
                optionsSelected.status = '';
                this.setState({
                    advancedSearchSelected: optionsSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearSelectedOptions.name, e));
        }
    };

    private onCloseAdvancedSearchModal = (): void => {
        try {
            this.setState({
                advancedSearchModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAdvancedSearchModal.name, e));
        }
    };

    private onNewSearch = (): void => {
        try {
            this.setState({
                dirtySearch: false,
                keywords: '',
                sections: undefined
            }, this.onClearSelectedOptions);

        }
        catch (e) {
            this.logError(LogData.fromException(this.onNewSearch.name, e));
        }
    };

    private onOpenAdvancedSearchModal = (): void => {
        try {
            const {
                advancedSearchSelected,
                keywords
            } = this.state;

            if (advancedSearchSelected) {
                advancedSearchSelected.keywords = keywords;
                this.setState({
                    advancedSearchModalOpen: true,
                    advancedSearchSelected: advancedSearchSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenAdvancedSearchModal.name, e));
        }
    };
    // #endregion Search

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false,
                sectionSelected: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onViewSectionDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                isAuthenticated
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            if (isAuthenticated) {
                RequestsSection.getSection(id, true, this.resolveGetSection);
            }
            else {
                RequestsSection.getSectionAnonymous(id, this.resolveGetSection);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private addNewCoupon = (): void => {
        try {
            const {
                coupons
            } = this.state;

            if (!(coupons.find(c => c.isNew))) {
                coupons.push({
                    code: '',
                    isValid: true,

                    isApplied: false,
                    isModified: false,
                    isNew: true
                });
                this.setState({
                    coupons: coupons
                });
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.addNewCoupon.name, e));
        }
    };

    private addLoadingCard = (id: number, position: number): void => {
        const {
            mySchedule
        } = this.state;

        const newMySchedule: IStudentSchedule[][] = mySchedule || [[], [], [], [], []];
        const newSection: IStudentSchedule = {
            id: id,
            isInCart: position === 1,
            isInWaitlist: position === 0,
            isLoading: true
        } as IStudentSchedule;

        newMySchedule[position].unshift(newSection);

        this.setState({
            mySchedule: newMySchedule
        });
    };

    private canAddToCart = (section: ISection): boolean => {
        try {
            const {
                errorLoadingScheduleList,
                mySchedule
            } = this.state;

            let result: boolean = true;
            let foundSection: IStudentSchedule | undefined;
            if (mySchedule.length >= this.myScheduleLength && !errorLoadingScheduleList) {
                mySchedule.forEach(sectionList => {
                    if (!foundSection && sectionList && (foundSection = sectionList.find(s => (s.id === section.id)))) {
                        result = false;
                    }
                });
            }
            return result && section.isCartable && section.seatsLeft > 0;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canAddToCart.name, e));
            return false;
        }
    };

    private canAddToWaitlist = (section: ISection): boolean => {
        try {
            const {
                errorLoadingScheduleList,
                mySchedule
            } = this.state;

            let result: boolean = true;
            let foundSection: IStudentSchedule | undefined;
            if (mySchedule.length >= this.myScheduleLength && !errorLoadingScheduleList) {
                mySchedule.forEach(sectionList => {
                    if (!foundSection && sectionList && (foundSection = sectionList.find(s => (s.id === section.id)))) {
                        result = false;
                    }
                });
            }
            return result && section.isWaitable;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canAddToWaitlist.name, e));
            return false;
        }
    };

    private canChangeCreditType = (studentSchedule: IStudentSchedule): boolean => {
        try {
            const {
                errorLoadingScheduleList
            } = this.state;

            return !errorLoadingScheduleList
                && Boolean(studentSchedule
                    && studentSchedule.creditTypes
                    && (studentSchedule.creditType
                        || studentSchedule.defaultCreditType)
                    && (studentSchedule.creditTypeDescription
                        || studentSchedule.defaultCreditTypeDesc)
                    && ((studentSchedule.isInCart
                        && !studentSchedule.isPending)
                        || (studentSchedule.isInWaitlist
                            && studentSchedule.isPending
                            && studentSchedule.isWaitListPending))
                    && (studentSchedule.isInCart && !studentSchedule.authorizationNeeded)
                    && !studentSchedule.isHolding
                    && !studentSchedule.isRegistered
                    && !studentSchedule.isDenied
                    && !studentSchedule.isLoading
                    && !studentSchedule.hideActions);
        }
        catch (e) {
            this.logError(LogData.fromException(this.canChangeCreditType.name, e));
            return false;
        }
    };

    private canDropSection = (section: ISection): boolean => {
        try {
            const {
                enableRegister,
                errorLoadingScheduleList,
                mySchedule
            } = this.state;

            let result: boolean = false;
            if (enableRegister && mySchedule.length >= this.myScheduleLength && !errorLoadingScheduleList) {
                if (mySchedule[ScheduleListType.Registered]
                    && mySchedule[ScheduleListType.Registered].find(s => (
                        s.id === section.id
                        && s.showDrop
                        && !s.isPending
                        && !s.hideActions))) {
                    result = true;
                }
            }
            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canDropSection.name, e));
            return false;
        }
    };

    private canRemoveFromCart = (section: ISection | ISectionDetail | IStudentSchedule): boolean => {
        try {
            const {
                errorLoadingScheduleList,
                mySchedule
            } = this.state;

            let result: boolean = false;
            if (mySchedule.length >= this.myScheduleLength && !errorLoadingScheduleList) {
                if (mySchedule[ScheduleListType.Cart] && mySchedule[ScheduleListType.Cart].find(s => (
                    s.id === section.id
                    && !s.isLoading
                    && !s.hideActions))) {
                    result = true;
                }
                else if (mySchedule[ScheduleListType.Pending] && mySchedule[ScheduleListType.Pending].find(s => (
                    s.id === section.id
                    && s.isInCart
                    && !s.isLoading
                    && !s.hideActions))) {
                    result = true;
                }
                else if (mySchedule[ScheduleListType.Denied] && mySchedule[ScheduleListType.Denied].find(s => (
                    s.id === section.id
                    && s.isInCart
                    && !s.isLoading
                    && !s.hideActions))) {
                    result = true;
                }
            }
            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canRemoveFromCart.name, e));
            return false;
        }
    };

    private canRemoveFromWaitlist = (section: ISection): boolean => {
        try {
            const {
                errorLoadingScheduleList,
                mySchedule
            } = this.state;

            let result: boolean = false;
            if (mySchedule.length >= this.myScheduleLength && !errorLoadingScheduleList) {
                if (mySchedule[ScheduleListType.Waitlist] && mySchedule[ScheduleListType.Waitlist].find(s => (
                    s.id === section.id
                    && !s.isLoading
                    && !s.hideActions))) {
                    result = true;
                }
            }
            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canRemoveFromWaitlist.name, e));
            return false;
        }
    };

    private getSectionStatus = (section: IStudentSchedule): ISectionStatus => {
        const {
            resources
        } = this.state;

        return SectionHelper.getSectionStatus(section, resources?.studentCourseStatus, resources?.studentCourseMessages);
    };

    private getSectionsToRegister = (): IStudentRegistration => {
        const sections: IStudentRegistration = {};
        try {
            const {
                enableRegister,
                mySchedule
            } = this.state;

            if (enableRegister) {
                if (mySchedule.length >= 2) {
                    if (!(mySchedule[ScheduleListType.Waitlist].filter(s => s.hideActions || s.isLoading).length > 0
                        || mySchedule[ScheduleListType.Cart].filter(s => s.hideActions || s.isLoading).length > 0)) {
                        mySchedule[ScheduleListType.Waitlist].filter(s => !s.hideActions && !s.isLoading).forEach(sectionInWaitlist => {
                            if (sectionInWaitlist.isPending && sectionInWaitlist.isWaitListPending) {
                                sections[sectionInWaitlist.id] = sectionInWaitlist.creditType || sectionInWaitlist.defaultCreditType;
                            }
                        });
                        mySchedule[ScheduleListType.Cart].filter(s => !s.hideActions && !s.isLoading).forEach(sectionInCart => {
                            sections[sectionInCart.id] = sectionInCart.creditType || sectionInCart.defaultCreditType;
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getSectionsToRegister.name, e));
        }
        return sections;
    };

    private hideActionsCard = (id: number): void => {
        const {
            mySchedule
        } = this.state;

        let foundSection: IStudentSchedule | undefined;

        if (mySchedule && mySchedule.length >= this.myScheduleLength) {
            mySchedule.forEach(sectionList => {
                if (!foundSection && sectionList) {
                    sectionList.forEach(section => {
                        if (section.id === id) {
                            foundSection = section;
                            // Hide from search
                            section.hideActions = true;
                        }
                    });
                }
            });
        }

        this.setState({
            mySchedule: mySchedule
        });
    };

    private reloadScheduleList = (): void => {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();

            this.setState({
                isLoadingScheduleList: true
            }, () => Requests.postScheduleList(
                this.resolvePostScheduleList,
                this.logErrorScheduleList,
                this.abortController.signal)
            );
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.reloadScheduleList.name, e));
        }
    };

    private reloadPartiallyScheduleList = (): void => {
        try {
            const {
                countActions
            } = this.state;

            if (countActions === 1) {
                this.abortController.abort();
                this.abortController = new AbortController();
                Requests.postScheduleList(
                    this.resolvePostScheduleList,
                    this.logErrorScheduleList,
                    this.abortController.signal);
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.reloadPartiallyScheduleList.name, e));
        }
    };

    private removeCard = (id: number): void => {
        const {
            mySchedule
        } = this.state;

        let sectionToRemove: IStudentSchedule | undefined;
        if (mySchedule && mySchedule.length >= this.myScheduleLength) {
            mySchedule.forEach(sectionList => {
                if (!sectionToRemove) {
                    sectionToRemove = sectionList.find(sl => sl.id === id);
                    if (sectionToRemove) {
                        sectionList.splice(sectionList.indexOf(sectionToRemove), 1);
                    }
                }
            });
        }

        this.setState({
            mySchedule: mySchedule
        });
    };

    private search = (): void => {
        try {
            const {
                keywords
            } = this.state;

            if (keywords) {
                LayoutActions.setLoading(true);
                Requests.postSections(keywords, this.resolveGetSections, this.logError);
            }
            else {
                this.setState({
                    dirtySearch: true,
                    keywords: '',
                    sections: undefined
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.search.name, e));
        }
    };

    private setNewCreditType = (status: boolean): void => {
        try {
            const {
                creditTypeSelected,
                resources,
                sectionDetail,
                sectionSelected
            } = this.state;

            if (status) {
                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
            const sectionSelectedAsStudentSchedule: IStudentSchedule = sectionSelected as IStudentSchedule;
            if (creditTypeSelected) {
                if (sectionSelectedAsStudentSchedule) {
                    sectionSelectedAsStudentSchedule.creditType = String(creditTypeSelected.value);
                    sectionSelectedAsStudentSchedule.creditTypeDescription = creditTypeSelected.description;
                }
                if (sectionDetail) {
                    sectionDetail.defaultCreditType = String(creditTypeSelected.value);
                    sectionDetail.defaultCreditTypeDesc = creditTypeSelected.description;
                }
            }
            this.setState({
                creditTypeModalOpen: false,
                creditTypeSelected: undefined,
                sectionSelected: sectionDetail ? sectionSelected : undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.setNewCreditType.name, e));
        }
    };

    private showActionsCard = (id: number): void => {
        try {
            const {
                mySchedule
            } = this.state;

            if (mySchedule && mySchedule.length >= this.myScheduleLength) {
                mySchedule.forEach(sectionList => {
                    sectionList.forEach(section => {
                        if (section.id === id) {
                            // Show from search
                            section.hideActions = false;
                        }
                    });
                });
            }

            this.setState({
                mySchedule: mySchedule
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.showActionsCard.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingScheduleList: false
        });
    };
    // #endregion Loader Functions

    // #region Error Functions

    // #region Cart
    private logErrorScheduleList = (logData: ILogData): void => {
        this.setState({
            errorLoadingScheduleList: true
        });

        this.logError(logData);
    };
    // #endregion Cart

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
        LayoutActions.setAlert({
            message: message,
            messageType: ResultType.error
        } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers

    // #region Cart
    private resolvePostAddToCart = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostAddToCart.name, this.hideAllLoaders);

            if (result?.status) {
                this.reloadPartiallyScheduleList();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostAddToCart.name, e));
        }
        finally {
            this.setState(prevState => ({
                countActions: prevState.countActions - 1
            }));
        }
    };

    private resolvePostAddToWaitlist = (json: string): void => {
        try {
            const {
                sections
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostAddToWaitlist.name, this.hideAllLoaders);

            if (result?.status) {
                const id: number = result.data;
                if (sections && id > 0) {
                    const sectionFound: ISection | undefined = sections.find(s => s.id === id);
                    if (sectionFound && sectionFound.seatsWaiting > 0) {
                        sectionFound.seatsWaiting--;
                        this.setState({
                            sections: sections
                        });
                    }
                }
                this.reloadPartiallyScheduleList();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostAddToCart.name, e));
        }
        finally {
            this.setState(prevState => ({
                countActions: prevState.countActions - 1
            }));
        }
    };

    private resolvePostDrop = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDrop.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data.notAllowed) {
                    this.showError();
                }
                else if (result.data.dateConflict) {
                    const {
                        mySchedule,
                        resources
                    } = this.state;
                    const sectionsDateConflict: string[] = [];

                    mySchedule[ScheduleListType.Registered].forEach(section => {
                        if (resources && section.id === result.data.id) {
                            sectionsDateConflict.push(
                                Format.toString(resources.scheduleList.scheduleListItem.formatTitleSection, [
                                    section.eventId,
                                    section.eventName])
                            );
                        }
                    });
                    this.setState({
                        conEdValidationMessagesModalOpen: true,
                        sectionsDateConflict: sectionsDateConflict,
                        validationType: 'drop'
                    });
                }
                else {
                    const registrationValidation: IRegistrationValidation = result.data.registrationValidation;

                    if (registrationValidation && registrationValidation.isSuccessful) {
                        LayoutActions.setAlert({
                            message: registrationValidation.message,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);

                        this.setState({
                            registrationValidation: registrationValidation,
                            validationMessagesModalOpen: false
                        });

                        this.reloadScheduleList();
                    }
                    else {
                        this.setState({
                            registrationValidation: registrationValidation,
                            validationMessagesModalOpen: registrationValidation && !registrationValidation.isSuccessful
                        });
                    }
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostDrop.name, e));
        }
    };

    private resolveSaveCreditType = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveCreditType.name, this.hideAllLoaders);

            if (result?.status) {
                this.setNewCreditType(result.data);
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveCreditType.name, e));
        }
    };

    private resolvePostScheduleList = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostScheduleList.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    isLoadingScheduleList,
                    mySchedule,
                    registerAfterSave
                } = this.state;
                const myScheduleChanged: IStudentSchedule[][] = result.data;

                if (!isLoadingScheduleList
                    && mySchedule
                    && mySchedule.length >= this.myScheduleLength
                    && myScheduleChanged
                    && myScheduleChanged.length >= this.myScheduleLength) {

                    // Search all the cards loading or waiting for a response
                    const loadingSections: IStudentSchedule[] = [];
                    const hideActionSections: IStudentSchedule[] = [];
                    const waitlistSections: IStudentSchedule[]
                        = mySchedule[ScheduleListType.Waitlist].filter(sl => sl.isPending && sl.isWaitListPending);

                    mySchedule.forEach(sectionList => {
                        sectionList.filter(sl => sl.isLoading).forEach(section => {
                            loadingSections.push(section);
                        });
                        sectionList.filter(sl => sl.hideActions).forEach(section => {
                            hideActionSections.push(section);
                        });
                    });

                    // Update the cart items with the loading status
                    let searchedSection: IStudentSchedule | undefined;
                    myScheduleChanged.forEach(sectionList => {
                        sectionList.forEach(section => {
                            // Remove the loading card to wait for the next update
                            if ((searchedSection = loadingSections.find(s => s.id === section.id))) {
                                loadingSections.splice(loadingSections.indexOf(searchedSection), 1);
                            }
                            // Preserve hide actions to wait for the next update
                            if (hideActionSections.find(s => s.id === section.id)) {
                                section.hideActions = true;
                            }
                            // Preserve selected credit type for waitlist pending courses (if the setting is enabled)
                            if ((searchedSection = waitlistSections.find(s => s.id === section.id))) {
                                section.creditType = searchedSection.creditType;
                                section.creditTypeDescription = searchedSection.creditTypeDescription;
                            }
                        });
                    });

                    // Keep the loading card to wait for the next update
                    loadingSections.forEach(section => {
                        if (section.isInWaitlist) {
                            myScheduleChanged[0].unshift(section);
                        }
                        else if (section.isInCart) {
                            myScheduleChanged[1].unshift(section);
                        }
                    });
                }

                LayoutActions.getCountCart();
                if (myScheduleChanged) {
                    this.setState({
                        mySchedule: myScheduleChanged
                    }, () => {
                        if (registerAfterSave) {
                            this.setState({
                                registerAfterSave: false
                            });
                            this.onRegister();
                        }
                        this.setState({
                            isLoadingScheduleList: false
                        });
                    });
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostScheduleList.name, e));
        }
    };

    private resolvePostEditPermissionRequest = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostEditPermissionRequest.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    resources,
                    sectionSelected
                } = this.state;

                const idPermissionRequestInfo: number = result.data;

                const studentSchedule: IStudentSchedule | undefined = sectionSelected as IStudentSchedule;
                if (studentSchedule
                    && studentSchedule.permissionRequestInfo
                    && studentSchedule.permissionRequestInfo.length > 0) {
                    const permissionRequestInfo: IPermissionRequestInfo | undefined
                        = studentSchedule.permissionRequestInfo.find(pri => pri.id === idPermissionRequestInfo);
                    if (permissionRequestInfo && result.data) {
                        permissionRequestInfo.editable = false;
                        permissionRequestInfo.modified = false;
                        permissionRequestInfo.studentCommentsBackup = '';
                        this.setState({
                            sectionSelected: studentSchedule
                        });
                    }
                }

                LayoutActions.setLoading(false);

                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostEditPermissionRequest.name, e));
        }
    };

    private resolvePostSavePermissionRequest = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSavePermissionRequest.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    resources,
                    sectionSelected
                } = this.state;

                const sectionSelectedAsStudentSchedule: IStudentSchedule = sectionSelected as IStudentSchedule;

                if (result.data) {
                    if (sectionSelectedAsStudentSchedule) {
                        sectionSelectedAsStudentSchedule.isPending = true;
                        sectionSelectedAsStudentSchedule.isPermissionRequired = false;
                        sectionSelectedAsStudentSchedule.hideActions = false;
                    }
                    this.reloadPartiallyScheduleList();
                    this.setState({
                        sectionSelected: sectionSelectedAsStudentSchedule
                    }, () => this.setState({
                        permissionRequestModalOpen: false,
                        sectionSelected: undefined
                    }));
                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                    LayoutActions.setLoading(false);
                }
                else {
                    if (sectionSelectedAsStudentSchedule) {
                        sectionSelectedAsStudentSchedule.hideActions = false;
                    }
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostSavePermissionRequest.name, e));
        }
        finally {
            this.setState(prevState => ({
                countActions: prevState.countActions - 1
            }));
        }
    };

    private resolvePostRemoveFromCart = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostRemoveFromCart.name, this.hideAllLoaders);

            if (result?.status) {
                const id: number = result.data;
                this.removeCard(id);
                LayoutActions.getCountCart();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostRemoveFromCart.name, e));
        }
        finally {
            this.setState(prevState => ({
                countActions: prevState.countActions - 1
            }));
        }
    };

    private resolvePostRemoveFromWaitlist = (json: string): void => {
        try {
            const {
                sections
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostRemoveFromWaitlist.name, this.hideAllLoaders);

            if (result?.status) {
                const id: number = result.data;
                this.removeCard(id);
                LayoutActions.getCountCart();
                if (sections && id > 0) {
                    const sectionFound: ISection | undefined = sections.find(s => s.id === id);
                    if (sectionFound) {
                        sectionFound.seatsWaiting++;
                        this.setState({
                            sections: sections
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostRemoveFromWaitlist.name, e));
        }
        finally {
            this.setState(prevState => ({
                countActions: prevState.countActions - 1
            }));
        }
    };

    private resolvePostStudentRegistration = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostStudentRegistration.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data.sectionsDateConflict) {
                    const {
                        mySchedule,
                        resources
                    } = this.state;
                    const sections: number[] = result.data.sectionsDateConflict;
                    const sectionsDateConflict: string[] = [];

                    mySchedule[ScheduleListType.Cart].forEach(section => {
                        if (resources && sections.find(s => s === section.id)) {
                            sectionsDateConflict.push(
                                Format.toString(resources.scheduleList.scheduleListItem.formatTitleSection, [
                                    section.eventId,
                                    section.eventName])
                            );
                        }
                    });
                    this.setState({
                        conEdValidationMessagesModalOpen: true,
                        sectionsDateConflict: sectionsDateConflict,
                        sectionsToRegister: undefined,
                        validationType: 'register'
                    });
                }
                else {
                    const registrationValidation: IRegistrationValidation = result.data.registrationValidation;

                    if (registrationValidation && registrationValidation.isSuccessful) {
                        const {
                            sections,
                            sectionsToRegister
                        } = this.state;

                        // Remove option to add the course if the course is in the results of the search
                        let posSection: number;
                        if (sectionsToRegister && sections) {
                            Object.entries(sectionsToRegister).forEach(([key]) => {
                                if ((posSection = sections.findIndex(s => s.id === Number(key))) > 0) {
                                    sections[posSection].isCartable = false;
                                }
                            });
                        }

                        // Verify online payment
                        const enableOnlinePayment: boolean = result.data.enableOnlinePayment;
                        const paymentInfo: IPaymentInfo = result.data.paymentInfo;
                        if (paymentInfo) {
                            paymentInfo.canPay = true;
                        }
                        const coupons: IPaymentDiscountCoupon[] = [];
                        let areAppliedCoupons: boolean = false;
                        this.setState({
                            coupons: coupons,
                            enableOnlinePayment: enableOnlinePayment,
                            paymentDetailModalOpen: Boolean(paymentInfo),
                            paymentInfo: paymentInfo,
                            paymentInfoNoChanges: Object.assign({}, paymentInfo),
                            registrationValidation: registrationValidation,
                            sectionsToRegister: undefined,
                            validationMessagesModalOpen: false
                        }, () => {
                            if (paymentInfo) {
                                const paymentInfoDiscounts: IPaymentInfo = result.data.paymentInfoDiscounts;
                                if (paymentInfoDiscounts) {
                                    paymentInfo.chargeCredits = paymentInfoDiscounts.chargeCredits;
                                    paymentInfo.currentBalance = paymentInfoDiscounts.currentBalance;
                                    paymentInfo.currentBalanceValue = paymentInfoDiscounts.currentBalanceValue;
                                    paymentInfo.paymentDue = paymentInfoDiscounts.paymentDue;
                                    paymentInfo.paymentDueValue = paymentInfoDiscounts.paymentDueValue;
                                    paymentInfo.totalAmount = paymentInfoDiscounts.totalAmount;
                                    paymentInfo.totalAmountValue = paymentInfoDiscounts.totalAmountValue;
                                    const appliedCoupons: string[] | undefined = result.data.discountCoupons;
                                    if (appliedCoupons && appliedCoupons.length > 0) {
                                        appliedCoupons.forEach(coupon => {
                                            coupons.push({
                                                code: coupon,
                                                isApplied: true,
                                                isModified: true,
                                                isNew: false,
                                                isValid: true
                                            });
                                        });
                                        areAppliedCoupons = true;
                                    }
                                    this.setState({
                                        coupons: coupons,
                                        paymentInfo: paymentInfo
                                    });
                                }
                                if (!areAppliedCoupons) {
                                    this.addNewCoupon();
                                }
                            }
                            else {
                                LayoutActions.setAlert({
                                    message: registrationValidation.message,
                                    messageType: ResultType.success
                                } as IAlert);
                            }
                        });

                        this.reloadScheduleList();
                    }
                    else {
                        this.setState({
                            registrationValidation: registrationValidation,
                            validationMessagesModalOpen: registrationValidation && !registrationValidation.isSuccessful
                        });
                        this.reloadScheduleList();
                    }
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostStudentRegistration.name, e));
        }
    };
    // #endregion Cart

    // #region Discounts
    private resolvePostApplyCoupon = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostApplyCoupon.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    coupons,
                    paymentInfo
                } = this.state;

                const discountCoupon: IPaymentDiscountCoupon = result.data.discountCoupon;
                const discountCouponChanged: IPaymentDiscountCoupon | undefined = coupons.find(c => c.code === discountCoupon.code);
                if (discountCouponChanged) {
                    discountCouponChanged.isValid = discountCoupon.isValid;
                    discountCouponChanged.isApplied = discountCoupon.isValid;
                    const newPaymentInfo: IPaymentInfo | undefined = result.data.paymentInfo;
                    if (paymentInfo && newPaymentInfo) {
                        paymentInfo.chargeCredits = newPaymentInfo.chargeCredits;
                        paymentInfo.currentBalance = newPaymentInfo.currentBalance;
                        paymentInfo.currentBalanceValue = newPaymentInfo.currentBalanceValue;
                        paymentInfo.paymentDue = newPaymentInfo.paymentDue;
                        paymentInfo.paymentDueValue = newPaymentInfo.paymentDueValue;
                        paymentInfo.totalAmount = newPaymentInfo.totalAmount;
                        paymentInfo.totalAmountValue = newPaymentInfo.totalAmountValue;
                        this.setState({
                            coupons: coupons,
                            paymentInfo: paymentInfo
                        }, () => {
                            if (discountCouponChanged.isValid) {
                                discountCouponChanged.isNew = false;
                                // this.addNewCoupon(); // This will be used in the future to accept more than one coupon
                            }
                        });
                    }
                    else {
                        this.setState({
                            coupons: coupons
                        });
                    }
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostApplyCoupon.name, e));
        }
    };

    private resolvePostRemoveCoupon = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostRemoveCoupon.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    coupons,
                    couponToRemove,
                    paymentInfo
                } = this.state;

                if (result.data.result) {
                    if (couponToRemove >= 0) {
                        coupons.splice(couponToRemove, 1);
                    }
                    if (coupons.length === 0) {
                        this.addNewCoupon();
                    }
                    this.setState({
                        coupons: coupons,
                        couponToRemove: -1
                    });
                    const newPaymentInfo: IPaymentInfo | undefined = result.data.paymentInfo;
                    if (paymentInfo && newPaymentInfo) {
                        paymentInfo.chargeCredits = newPaymentInfo.chargeCredits;
                        paymentInfo.currentBalance = newPaymentInfo.currentBalance;
                        paymentInfo.currentBalanceValue = newPaymentInfo.currentBalanceValue;
                        paymentInfo.paymentDue = newPaymentInfo.paymentDue;
                        paymentInfo.paymentDueValue = newPaymentInfo.paymentDueValue;
                        paymentInfo.totalAmount = newPaymentInfo.totalAmount;
                        paymentInfo.totalAmountValue = newPaymentInfo.totalAmountValue;
                        this.setState({
                            paymentInfo: paymentInfo
                        });
                    }
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostRemoveCoupon.name, e));
        }
    };
    // #endregion Discounts

    // #region Search
    private resolveGetAdvancedSearchOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAdvancedSearchOptions.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    resources
                } = this.state;

                const advancedSearchOptions: ISectionSearchOption = result.data;
                if (resources && advancedSearchOptions) {
                    if (advancedSearchOptions.status) {
                        advancedSearchOptions.status[0].description = resources.advancedSearchModal.lblOpen;
                        advancedSearchOptions.status[1].description = resources.advancedSearchModal.lblClosed;
                        advancedSearchOptions.status[2].description = resources.advancedSearchModal.lblWaitlist;
                    }
                }
                this.setState({
                    advancedSearchOptions: advancedSearchOptions
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAdvancedSearchOptions.name, e));
        }
    };

    private resolveGetConEdStatus = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetConEdStatus.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const isOnStopList: boolean = result.data.isOnStopList;
                    this.setState({
                        agreement: result.data.agreement,
                        agreementStatus: result.data.agreementStatus,
                        enableRegister: !isOnStopList,
                        isLoading: false,
                        isOnStopList: isOnStopList
                    }, () => {
                        LayoutActions.setLoading(false);
                        this.reloadScheduleList();
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => {
                        LayoutActions.setLoading(false);
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetConEdStatus.name, e));
        }
    };

    private resolveGetSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name, this.hideAllLoaders);

            if (result?.status) {
                const sections: ISection[] | undefined = result.data.sections;
                this.setState({
                    advancedSearchModalOpen: false,
                    dirtySearch: true,
                    sections: sections,
                    showPicture: result.data.showPicture
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };
    // #endregion Search

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    mySchedule
                } = this.state;

                const section: ISectionDetail | undefined = result.data;

                // Status for section detail modal
                let sectionInSchedule: IStudentSchedule | undefined;
                if (section && mySchedule) {
                    mySchedule.forEach(sectionList => {
                        sectionList.forEach(sectionInList => {
                            if (!Boolean(sectionInSchedule) && sectionInList.id === section.id) {
                                sectionInSchedule = sectionInList;
                            }
                        });
                    });
                }

                if (sectionInSchedule && section) {
                    section.advisorApprovalInfo = sectionInSchedule.advisorApprovalInfo;
                    section.permissionRequestInfo = sectionInSchedule.permissionRequestInfo;
                    section.statusPermisionRequest = sectionInSchedule.isApproved ? 0
                        : (sectionInSchedule.isDenied ? 1 : 2);
                }

                this.setState({
                    sectionDetail: section,
                    sectionModalOpen: true,
                    sectionSelected: sectionInSchedule
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveLayoutReady = (): void => {
        try {
            const {
                hasProfile,
                isAuthenticated,
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;

                // TODO: check if this useful when the carousel is implemented
                // const hdnShowCart: HTMLInputElement | undefined =
                //    document.getElementById('hdnShowCart') as HTMLInputElement;
                // if (hdnShowCart && hdnShowCart.value && Boolean(hdnShowCart.value) === true) {
                //    this.setState({
                //        dirtySearch: true
                //    });
                // }

                const hdnTransactionId: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionId') as HTMLInputElement;
                const hdnTransactionStatus: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionStatus') as HTMLInputElement;
                const hdnTransactionAmount: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionAmount') as HTMLInputElement;
                const hdnTransactionDescription: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionDescription') as HTMLInputElement;
                const hdnTransactionAuthorizationNumber: HTMLInputElement | undefined =
                    document.getElementById('hdnTransactionAuthorizationNumber') as HTMLInputElement;
                if (hdnTransactionId && hdnTransactionId.value
                    && hdnTransactionStatus
                    && hdnTransactionAmount
                    && hdnTransactionDescription
                    && hdnTransactionAuthorizationNumber) {
                    const paymentTransaction: IPaymentTransaction = {
                        amount: hdnTransactionAmount.value,
                        authorizationNumber: hdnTransactionAuthorizationNumber.value,
                        description: hdnTransactionDescription.value,
                        status: Number(hdnTransactionStatus.value),
                        transactionId: Number(hdnTransactionAmount.value)
                    } as IPaymentTransaction;
                    this.setState({
                        paymentModalOpenFail: Number(hdnTransactionStatus.value) === 0,
                        paymentModalOpenSuccess: Number(hdnTransactionStatus.value) === 1,
                        paymentTransaction: paymentTransaction
                    });
                    hdnTransactionId.remove();
                    hdnTransactionStatus.remove();
                    hdnTransactionAmount.remove();
                    hdnTransactionDescription.remove();
                    hdnTransactionAuthorizationNumber.remove();
                }
                if (isAuthenticated && hasProfile) {
                    Requests.getConEdStatus(this.resolveGetConEdStatus, this.logError);
                }
                else if (isAuthenticated) {
                    this.setState({
                        enableRegister: true,
                        isLoading: false
                    }, () => {
                        LayoutActions.setLoading(false);
                        this.reloadScheduleList();
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => {
                        LayoutActions.setLoading(false);
                    });
                }
                Requests.getAdvancedSearchOptions(this.resolveGetAdvancedSearchOptions);
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
        const resources: IConEdCoursesRes | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();
        const hasProfile: boolean = LayoutStore.getHasProfile();
        const isAuthenticated: boolean = LayoutStore.getIsAuthenticated();

        if (ready) {
            this.setState({
                cultures: cultures,
                hasProfile: hasProfile,
                isAuthenticated: isAuthenticated,
                resources: resources
            }, this.resolveLayoutReady);
        }
        else {
            this.setState({
                componentError: true
            }, () => this.logError(LogData.layoutNoReady(this.onLayoutReady.name)));
        }
    };
    // #endregion State Management Events

    // #region Lifecycle
    public componentWillUnmount(): void {
        this.abortController.abort();
        this.abortController = new AbortController();
        LayoutStore.removeLayoutReadyListener(this.onLayoutReady);
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
            advancedSearchModalOpen,
            advancedSearchOptions,
            advancedSearchSelected,
            componentError,
            cultures,
            dirtySearch,
            hasProfile,
            isAuthenticated,
            isLoading,
            isOnStopList,
            keywords,
            resources,
            sectionDetail,
            sectionModalOpen,
            sections,
            showPicture,
            showDeniedCourses,

            // Account
            profileModal,
            registerAfterSave,
            showSignIn,
            showSignUp,
            userName,

            // MySchedule
            agreement,
            agreementMandatory,
            agreementModalOpen,
            agreementStatus,
            countActions,
            creditTypeModalOpen,
            creditTypeSelected,
            enableRegister,
            errorLoadingScheduleList,
            isDropDialog,
            isLoadingScheduleList,
            mySchedule,
            permissionRequestModalOpen,
            sectionSelected,
            viewCommentsAnchor,
            warningsMySchedule,

            // Registration validation
            conEdValidationMessagesModalOpen,
            registrationValidation,
            sectionsDateConflict,
            validationMessagesModalOpen,
            validationType,

            // Payment
            coupons,
            enableOnlinePayment,
            paymentDetailModalOpen,
            paymentInfo,
            paymentInfoNoChanges,
            paymentModalOpenFail,
            paymentModalOpenProcess,
            paymentModalOpenSuccess,
            paymentTransaction
        } = this.state;

        // #region Payment modals
        let processPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenProcess && paymentInfo && paymentInfo.canPay) {
            processPaymentModal = (
                <ProcessPaymentModal
                    amount={paymentInfo.useTransactionChargesOnly ?
                        paymentInfo.totalAmountValue
                        : paymentInfo.paymentDueValue}
                    conEdTransactionId={paymentInfo.conEdTransactionId}
                    open={paymentDetailModalOpen}
                    paymentOrigin={PaymentOrigin.ConEdRegistration}
                    onClose={this.onClosePaymentModalProcess}
                />
            );
        }

        let successfulPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenSuccess) {
            successfulPaymentModal = (
                <SuccessfulPaymentModal
                    open={paymentModalOpenSuccess}
                    paymentOrigin={PaymentOrigin.ConEdRegistration}
                    paymentTransaction={paymentTransaction}
                    onClose={this.onClosePaymentModalSuccess}
                />
            );
        }

        let failedPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenFail) {
            failedPaymentModal = (
                <FailedPaymentModal
                    open={paymentModalOpenFail}
                    paymentOrigin={PaymentOrigin.ConEdRegistration}
                    onClose={this.onClosePaymentModalFail}
                />
            );
        }
        // #endregion Payment modals

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (!isLoading) {

                // #region Advanced Search Modal
                let sectionsOptionsModal: JSX.Element | undefined;
                if (advancedSearchModalOpen && advancedSearchOptions) {
                    sectionsOptionsModal = (
                        <AdvancedSearchModal
                            advancedSearchSelected={advancedSearchSelected}
                            data={advancedSearchOptions}
                            dateTimeCulture={cultures.dateTimeCulture}
                            isConEd
                            open={advancedSearchModalOpen}
                            resources={resources.advancedSearchModal}
                            shortDatePattern={cultures.shortDatePattern}
                            onClear={this.onClearSelectedOptions}
                            onClose={this.onCloseAdvancedSearchModal}
                            onDateTimeChange={this.onAdvancedSearchDateTimeChange}
                            onDropdownChange={this.onAdvancedSearchDropdownChange}
                            onSearch={this.onAdvancedSearch}
                            onTextFieldChange={this.onAdvancedSearchTextFieldChange}
                        />
                    );
                }
                // #endregion Advanced Search Modal

                const sectionSelectedAsStudentSchedule: IStudentSchedule = sectionSelected as IStudentSchedule;

                // #region Section Details
                let sectionModal: JSX.Element | undefined;
                if (sectionModalOpen && sectionDetail) {
                    sectionModal = (
                        <SectionDetailModal
                            canAddToCart={!isLoadingScheduleList && this.canAddToCart(sectionDetail)}
                            canAddToWaitlist={!isLoadingScheduleList && this.canAddToWaitlist(sectionDetail)}
                            canChangeCreditType={!isLoadingScheduleList
                                && this.canChangeCreditType(sectionSelectedAsStudentSchedule)}
                            canDrop={!isLoadingScheduleList && this.canDropSection(sectionDetail)}
                            canRemoveFromCart={!isLoadingScheduleList && this.canRemoveFromCart(sectionDetail)}
                            canRemoveFromWaitlist={!isLoadingScheduleList && this.canRemoveFromWaitlist(sectionDetail)}
                            creditTypeDesc={sectionSelectedAsStudentSchedule ?
                                sectionSelectedAsStudentSchedule.creditTypeDescription
                                : undefined}
                            isStudentView
                            open={sectionModalOpen}
                            PermissionRequestDetailProps={{
                                resourcesPermissionRequestStatus: resources.permissionRequestStatus,

                                onCancelEdit: this.onCancelEditPermissionRequest,
                                onChangeCommentsForEdit: this.onChangeCommentsForEdit,
                                onEdit: this.onEditPermissionRequest,
                                onEnableEdit: this.onEnableEditPermissionRequest
                            }}
                            resources={resources.sectionDetailModal}
                            section={sectionDetail}
                            sectionStatus={sectionSelectedAsStudentSchedule ?
                                this.getSectionStatus(sectionSelectedAsStudentSchedule)
                                : undefined}
                            onAddToCart={this.onAddToCart}
                            onAddToWaitlist={this.onAddToWaitlist}
                            onDrop={this.onOpenDropDialog}
                            onOpenCreditTypeModal={this.onOpenCreditTypeModal}
                            onRemoveFromCart={this.onRemoveFromCart}
                            onRemoveFromWaitlist={this.onRemoveFromWaitlist}
                            onClose={this.onCloseSectionModal}
                        />
                    );
                }
                // #endregion Section Details

                // #region Credit Type, Permission Request
                let creditTypeModal: JSX.Element | undefined;
                let permissionRequestModal: JSX.Element | undefined;
                if (sectionSelectedAsStudentSchedule) {
                    if (creditTypeModalOpen
                        && creditTypeSelected
                        && sectionSelectedAsStudentSchedule.creditTypes
                        && sectionSelectedAsStudentSchedule.creditTypes.length > 0) {
                        // #region Credit Type Modal
                        creditTypeModal = (
                            <CreditTypeModal
                                creditTypeList={sectionSelectedAsStudentSchedule.creditTypes}
                                creditTypeSelected={String(creditTypeSelected.value)}
                                eventId={sectionSelectedAsStudentSchedule.eventId}
                                eventName={sectionSelectedAsStudentSchedule.eventName}
                                open={creditTypeModalOpen}
                                resources={resources.creditTypeModal}
                                onClose={this.onCloseCreditTypeModal}
                                onDropdownChange={this.onChangeCreditType}
                                onSave={this.onSaveCreditType}
                            />
                        );
                        // #endregion Credit Type Modal
                    }
                    if (permissionRequestModalOpen) {
                        // #region Permission Request Modal and Popover
                        if (sectionSelectedAsStudentSchedule.permissionRequestInfo
                            && sectionSelectedAsStudentSchedule.permissionRequestInfo.length > 0) {
                            permissionRequestModal = (
                                <PermissionRequestModal
                                    id="permissionRequestModal"
                                    open={permissionRequestModalOpen}
                                    section={sectionSelectedAsStudentSchedule}
                                    PermissionRequestDetailProps={{
                                        resourcesPermissionRequestStatus: resources.permissionRequestStatus,

                                        onCancelEdit: this.onCancelEditPermissionRequest,
                                        onChangeCommentsForEdit: this.onChangeCommentsForEdit,
                                        onEdit: this.onEditPermissionRequest,
                                        onEnableEdit: this.onEnableEditPermissionRequest
                                    }}
                                    resources={resources.permissionRequestModal}
                                    viewCommentsAnchor={viewCommentsAnchor}
                                    onChangeStudentComments={this.onChangeStudentComments}
                                    onClose={this.onClosePermissionRequestViewCommentsModal}
                                    onSend={this.onSendPermissionRequest}
                                />
                            );
                        }
                        // #endregion Permission Request Modal and Popover
                    }
                }
                // #endregion Credit Type, Permission Request

                // #region Confirmation Modal
                const confirmationModal: JSX.Element = (
                    <ConfirmationDialog
                        contentText={resources.dropConEdConfirmation.lblContent}
                        open={isDropDialog}
                        primaryActionOnClick={this.onCloseDropDialog}
                        primaryActionText={resources.dropConEdConfirmation.btnDecline}
                        secondaryActionOnClick={this.onDropSection}
                        secondaryActionText={resources.dropConEdConfirmation.btnAccept}
                        title={Format.toString(resources.dropConEdConfirmation.formatTitle, [this.dropSectionName])}
                    />
                );
                // #endregion Confirmation Modal

                // #region Validation Messages Modal for Registration
                let validationMessagesModal: JSX.Element | undefined;
                if (registrationValidation && registrationValidation.validationMessages) {
                    validationMessagesModal = (
                        <ValidationMessagesModal
                            open={validationMessagesModalOpen}
                            validationMessages={registrationValidation.validationMessages}
                            onClose={this.onCloseMessagesModal}
                            resources={resources.validationMessagesModal}
                        />
                    );
                }
                else if (sectionsDateConflict && sectionsDateConflict.length > 0) {
                    validationMessagesModal = (
                        <ConEdValidationMessagesModal
                            open={conEdValidationMessagesModalOpen}
                            resources={resources.conEdValidationMessagesModal}
                            sectionsDateConflict={sectionsDateConflict}
                            type={validationType}
                            onClose={this.onCloseConEdMessagesModal}
                        />
                    );
                }
                // #endregion Validation Messages Modal for Registration

                // #region Payment Info modal
                let paymentInfoModal: JSX.Element | undefined;
                if (paymentInfo && paymentInfoNoChanges && paymentDetailModalOpen) {
                    paymentInfoModal = (
                        <PaymentDetailModal
                            coupons={coupons}
                            enableOnlinePayment={enableOnlinePayment}
                            open={paymentDetailModalOpen}
                            paymentInfo={paymentInfo}
                            paymentInfoNoChanges={paymentInfoNoChanges}
                            paymentOrigin={PaymentOrigin.ConEdRegistration}
                            titleName={resources.lblHeaderTitle}
                            onApplyCoupon={this.onApplyCoupon}
                            onChangeCouponCode={this.onChangeCouponCode}
                            onClose={this.onClosePaymentDetailModal}
                            onPay={this.onPay}
                            onRemoveCoupon={this.onRemoveCoupon}
                        />
                    );
                }
                // #endregion Payment Info modal

                // #region Agreement Modal
                let agreementModal: JSX.Element | undefined;
                if (agreement && !agreementStatus && agreementModalOpen) {
                    agreementModal = (
                        <AgreementModal
                            agreement={agreement}
                            lblSuccessSave={resources.lblSuccessSave}
                            mandatory={agreementMandatory}
                            open={agreementModalOpen}
                            onClose={this.onCloseAgreementModal}
                            onRegister={this.onRegister}
                            onSaved={this.onAgreementSaved}
                        />
                    );
                }
                // #endregion Agreement Modal

                // #region Messages
                let messagesSection: JSX.Element | undefined;
                if (isAuthenticated && hasProfile) {
                    if (Boolean(warningsMySchedule)) {
                        messagesSection = (
                            <Grid container spacing={1}>
                                <Grid item xs={12}>
                                    <Alert
                                        id="msgWarningMySchedule"
                                        open
                                        text={warningsMySchedule}
                                        type={ResultType.warning}
                                    />
                                </Grid>
                            </Grid>
                        );
                    }
                    else if (agreement && !agreementStatus) {
                        messagesSection = (
                            <Card>
                                <CardContent>
                                    <Grid container justifyContent="center" spacing={1}>
                                        <Grid item xs={12}>
                                            <Alert
                                                id="msgReadAgreements"
                                                open
                                                text={resources.lblMessageAgreement}
                                                type={ResultType.info}
                                            />
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                id="btnReadAgreements"
                                                onClick={this.onOpenAgreementModal}
                                            >
                                                {resources.btnReadAgreements}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </CardContent>
                            </Card>
                        );
                    }
                }
                else if (isAuthenticated && !hasProfile) {
                    messagesSection = (
                        <Card>
                            <CardContent>
                                <Grid container justifyContent="center" spacing={1}>
                                    <Grid item xs={12}>
                                        <Alert
                                            id="msgCompleteProfile"
                                            open
                                            text={resources.lblCompleteProfileMessage}
                                            type={ResultType.info}
                                        />
                                    </Grid>
                                    <Grid item>
                                        <Button
                                            id="btnCompleteProfile"
                                            onClick={this.onOpenProfileModal}
                                        >
                                            {resources.btnCompleteProfile}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                }
                else {
                    messagesSection = (
                        <Card>
                            <CardContent>
                                <Grid container spacing={1}>
                                    <Grid item xs={12}>
                                        <Text size="h3">
                                            {resources.lblCreateAccountTitle}
                                        </Text>
                                    </Grid>
                                    <Grid item xs={12} className={classes.createAccountMessage}>
                                        <Text size="large">
                                            {resources.lblCreateAccountMessage}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <Button
                                            id="btnCreateAccount"
                                            color="secondary"
                                            onClick={this.onOpenSignIn}
                                        >
                                            {resources.btnCreateAccount}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>
                    );
                }
                if (messagesSection) {
                    messagesSection = (
                        <div className={classes.messagesMargin}>
                            {messagesSection}
                        </div>
                    );
                }
                // #endregion Messages

                // #region Profile
                let completeProfileModal: JSX.Element | undefined;
                if (isAuthenticated) {
                    completeProfileModal = (
                        <CompleteProfileModal
                            open={profileModal}
                            registerAfterSave={registerAfterSave}
                            onAfterSave={this.onAfterSaveProfile}
                            onClose={this.onCloseProfileModal}
                        />
                    );
                }
                // #endregion Profile

                // #region Cart
                const scheduleCard: JSX.Element = (
                    <ScheduleList
                        countActions={countActions}
                        enableRegister={enableRegister}
                        errorLoading={errorLoadingScheduleList}
                        isLoading={isLoadingScheduleList}
                        mySchedule={mySchedule}
                        resources={resources.scheduleList}
                        ScheduleListItemProps={{
                            onDrop: this.onOpenDropDialog,
                            onOpenCreditTypeModal: this.onOpenCreditTypeModal,
                            onOpenPermissionRequestModal: this.onOpenPermissionRequestModal,
                            onOpenViewCommentsModal: this.onOpenViewCommentsModal,
                            onRemoveFromCart: this.onRemoveFromCart,
                            onRemoveFromWaitlist: this.onRemoveFromWaitlist,
                            onViewSectionDetails: this.onViewSectionDetails
                        }}
                        showCalendar={false}
                        showDeniedCourses={showDeniedCourses}
                        canChangeCreditType={this.canChangeCreditType}
                        canDropSection={this.canDropSection}
                        canRemoveFromCart={this.canRemoveFromCart}
                        canRemoveFromWaitlist={this.canRemoveFromWaitlist}
                        getSectionStatus={this.getSectionStatus}
                        onChangeShowDeniedCourses={this.onChangeShowDeniedCourses}
                        onRefresh={this.onRefreshMySchedule}
                        onRegister={agreement && !agreementStatus ? this.onRegisterWithAgreement : this.onRegister}
                    />
                );
                // #endregion Cart

                // #region Results of the search
                let searchResults: JSX.Element[] | undefined;
                let countResults: number = 0;
                if (sections && sections.length > 0) {
                    searchResults = sections.map((section, i) => (
                        <ConEdSectionCard
                            canAddToCart={!isLoadingScheduleList && this.canAddToCart(section)}
                            canAddToWaitlist={!isLoadingScheduleList && this.canAddToWaitlist(section)}
                            id={`sectionCard_${i}`}
                            key={`sectionCard_${i}_${section.id}`}
                            resources={resources.conEdSectionCard}
                            section={section}
                            showPicture={showPicture}
                            onAddToCart={this.onAddToCart}
                            onAddToWaitlist={this.onAddToWaitlist}
                            onViewSectionDetails={this.onViewSectionDetails}
                        />
                    ));
                    countResults = searchResults.length;
                }
                // #endregion Results of the search

                contentPage = (
                    <>
                        {isOnStopList && (
                            <Grid container>
                                <Grid item xs>
                                    <Stoplist
                                        showRegistration={true}
                                    />
                                </Grid>
                            </Grid>
                        )}
                        {messagesSection && (
                            <Hidden mdUp>
                                {messagesSection}
                            </Hidden>
                        )}
                        <Grid container>
                            <Grid item xs>
                                <ConEdSectionsSearch
                                    countResults={countResults}
                                    dirtySearch={dirtySearch}
                                    keywords={keywords}
                                    resources={resources.conEdSectionsSearch}
                                    onBasicSearchChange={this.onBasicSearchChange}
                                    onBasicSearchClear={this.onBasicSearchClear}
                                    onBasicSearchEnterPress={this.onBasicSearchEnterPress}
                                    onNewSearch={this.onNewSearch}
                                    onOpenAdvancedSearchModal={this.onOpenAdvancedSearchModal}
                                />
                                <Grid container>
                                    <Grid item xs>
                                        {searchResults}
                                    </Grid>
                                </Grid>
                            </Grid>
                            {isAuthenticated && hasProfile ? (
                                <Grid item xs={12} md={4}>
                                    {messagesSection && (
                                        <Hidden smDown>
                                            {messagesSection}
                                        </Hidden>
                                    )}
                                    {scheduleCard}
                                </Grid>
                            ) : (
                                <Grid item xs={12} md={4}>
                                    {messagesSection && (
                                        <Hidden smDown>
                                            {messagesSection}
                                        </Hidden>
                                    )}
                                    {isAuthenticated && (
                                        <>
                                            {scheduleCard}
                                        </>
                                    )}
                                </Grid>
                            )}
                        </Grid>
                        {!isAuthenticated && (
                            <SignIn
                                key={`signIn${userName || 'Empty'}`}
                                open={showSignIn}
                                userName={userName}
                                onClose={this.onCloseSignIn}
                                onGoSignUp={this.onOpenSignUp}
                            />
                        )}
                        {!isAuthenticated && (
                            <SignUp
                                key="signUp"
                                open={showSignUp}
                                type="ConEd"
                                onAfterSignUp={this.onAfterSignUp}
                                onClose={this.onCloseSignUp}
                                onGoSignIn={this.onOpenSignIn}
                            />
                        )}
                        {confirmationModal}
                        {creditTypeModal}
                        {sectionModal}
                        {sectionsOptionsModal}
                        {permissionRequestModal}
                        {validationMessagesModal}
                        {paymentInfoModal}
                        {agreementModal}
                        {completeProfileModal}
                    </>
                );
            }
        }

        return (
            <Layout
                idModule={this.idModule}
                idPage={this.idPage}
                showCart
                showNotifications
            >
                {contentPage}
                {processPaymentModal}
                {successfulPaymentModal}
                {failedPaymentModal}
            </Layout>
        );
    }
}

const ConEdCoursesViewWithLayout = withLayout(withStyles(styles)(ConEdCoursesView));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<ConEdCoursesViewWithLayout />, document.getElementById('root'));