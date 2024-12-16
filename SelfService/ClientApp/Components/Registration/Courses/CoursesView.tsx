/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CoursesView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { BoxesAlt } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import Search from '@hedtech/powercampus-design-system/react/core/Search';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import AdvancedSearchModal, { IAdvancedSearchOptionModalResProps } from './AdvancedSearchModal';
import AgreementModal from '../../Generic/AgreementModal';
import BlockCard, { IBlockCardResProps } from './BlockCard';
import BlockDetailModal, { IBlockDetailModalResProps } from './BlockDetailModal';
import CreditTypeModal, { ICreditTypeModalResProps } from './CreditTypeModal';
import FailedPaymentModal from '../../Generic/FailedPaymentModal';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import PaymentDetailModal from '../../Generic/PaymentDetailModal';
import PeriodsModal, { IPeriodsModalResProps } from './PeriodsModal';
import PermissionRequestModal, { IPermissionRequestModalResProps } from './PermissionRequestModal';
import ProcessPaymentModal from '../../Generic/ProcessPaymentModal';
import RegistrationSummaryModal from '../../Generic/RegistrationSummaryModal';
import ScheduleList, { IScheduleListResProps } from './ScheduleList';
import SectionCard, { ISectionCardResProps } from '../../Generic/SectionCard';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import Stoplist from '../../Generic/Stoplist';
import SuccessfulPaymentModal from '../../Generic/SuccessfulPaymentModal';
import ValidationMessagesModal, { IValidationMessagesModalResProps } from './ValidationMessagesModal';
import ViewCommentsPopover, { IViewCommentsPopoverResProps } from './ViewCommentsPopover';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPermissionRequestInfo } from '@hedtech/powercampus-design-system/types/Student/IPermissionRequestInfo';
import { IRadioOption } from '@hedtech/powercampus-design-system/types/IRadioOption';
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { ISectionStatusInfo } from '@hedtech/powercampus-design-system/types/Section/ISectionStatusInfo';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { ScheduleListType } from '@hedtech/powercampus-design-system/types/Section/ScheduleListType';
import { BlockRegBlockStatus, IBlockStudentSchedule } from '../../../Types/Students/IStudentSchedule';
import { BlockRegRuleGroupStatus, IBlockRegistrationRuleGroup } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
import { IAdvancedSearch, SectionSearchType } from '../../../Types/Section/IAdvancedSearch';
import { IAgreementDetail } from '../../../Types/Agreements/IAgreementDetail';
import { IBlockRegistrationRuleDetail } from '../../../Types/Administration/IBlockRegistrationRuleDetail';
import { IBlockRegRuleGroup } from '../../../Types/Administration/IBlockRegistrationGroupDetail';
import { ICoursesResources } from '../../../Types/Resources/Registration/ICoursesResources';
import { IPaymentInfo } from '../../../Types/Payment/IPaymentInfo';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
import { IPeriodStatus, PeriodAuthorizationStatus } from '../../../Types/Periods/IPeriodStatus';
import { IRegistrationSummary } from '../../../Types/Generic/IRegistrationSummary';
import { IRegistrationValidation } from '../../../Types/Course/IRegistrationValidation';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISectionSearchOption } from '../../../Types/Section/ISectionSearchOption';
import { IStudentBlockRegRuleGroupBlock } from '../../../Types/Students/IStudentBlockRegRuleGroupBlock';
import { IStudentRegistration } from '../../../Types/Students/IStudentRegistration';
import { IYearTerm } from '../../../Types/Generic/IYearTerm';
import { PaymentOrigin } from '../../../Types/Enum/PaymentOrigin';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import SectionHelper from '@hedtech/powercampus-design-system/helpers/SectionHelper';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Requests
import RequestsSection from '../../../Requests/Generic/Section';
import Requests from '../../../Requests/Registration/Courses';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IDropConfirmationResources {
    btnAccept: string;
    btnDecline: string;
    formatTitle: string;
    lblContent: string;
}

interface ICoursesRes extends ICoursesResources {
    advancedSearchModal: IAdvancedSearchOptionModalResProps;
    blockCard: IBlockCardResProps;
    blockDetailModal: IBlockDetailModalResProps;
    creditTypeModal: ICreditTypeModalResProps;
    dropBlockConfirmation: IDropConfirmationResources;
    dropConfirmation: IDropConfirmationResources;
    periodsModal: IPeriodsModalResProps;
    permissionRequestModal: IPermissionRequestModalResProps;
    scheduleList: IScheduleListResProps;
    sectionCard: ISectionCardResProps;
    sectionDetailModal: ISectionDetailModalResProps;
    validationMessagesModal: IValidationMessagesModalResProps;
    viewCommentsPopover: IViewCommentsPopoverResProps;
}

type SearchViewType = 'block' | 'section';

interface ICoursesState {
    blockDetail?: IBlockRegRuleGroup;
    blockModalOpen: boolean;
    componentError: boolean;
    cultures: ICultures;
    groupBlockDetail?: IBlockRegistrationRuleGroup;
    hasAcademicInfo: boolean;
    isOnStopList: boolean;
    isLoading: boolean;
    resources?: ICoursesRes;
    sectionDetail?: ISectionDetail;
    sectionDetailView?: SearchViewType;
    sectionModalOpen: boolean;
    showDeniedCourses: boolean;

    // #region Agreement
    agreement?: IAgreementDetail;
    agreementMandatory: boolean;
    agreementModalOpen: boolean;
    agreementStatus: boolean;
    // #endregion Agreement

    // #region Cart
    blockToDrop?: IBlockStudentSchedule;
    countActions: number;
    creditTypeModalOpen: boolean;
    creditTypeSelected?: IDropDownOption;
    dropBlockDialogOpen: boolean;
    dropDialogOpen: boolean;
    enableCart: boolean;
    enableRegister: boolean;
    errorLoadingScheduleList: boolean;
    isLoadingScheduleList: boolean;
    myBlockSchedule?: IBlockStudentSchedule[];
    // Use ScheduleListType enum as the list index of the matrix
    mySchedule?: IStudentSchedule[][];
    permissionRequestInfo?: IPermissionRequestInfo[];
    permissionRequestModalOpen: boolean;
    sectionSelected?: ISection;
    selectedBlockId?: number;
    selectedBlockIndex?: number;
    selectedGroupId?: number;
    viewCommentsAnchor: any;
    waitForSchedule: boolean;
    warningsMySchedule?: string;

    // Registration validation
    openStatusInfo: boolean;
    statusInfoAnchor: any;
    registrationLogId?: number;
    registrationSummary?: IRegistrationSummary;
    registrationSummaryModalOpen: boolean;
    registrationValidation?: IRegistrationValidation;
    validationMessagesModalOpen: boolean;
    // #endregion Cart

    // #region Payment
    enableOnlinePayment: boolean;
    paymentDetailModalOpen: boolean;
    paymentInfo?: IPaymentInfo;
    paymentMethod: string;
    paymentModalOpenFail: boolean;
    paymentModalOpenProcess: boolean;
    paymentModalOpenSuccess: boolean;
    paymentTransaction?: IPaymentTransaction;
    // #endregion Payment

    // #region Search
    defaultPeriod?: string;
    isLoadingPeriods: boolean;
    periodsForRegistration?: IRadioOption[];
    periodsForSearch?: IRadioOption[];
    periodsModalOpen: boolean;
    requestAfterSwitch: boolean;
    searchView?: SearchViewType;
    selectedPeriod?: string;
    selectedPeriodModal?: string;
    selectedPeriodText?: string;
    selectedYearTerm?: IYearTerm;
    silentBlocksUpdate: boolean;
    silentSectionsUpdate: boolean;
    switchSearchView: boolean;

    // By Section
    advancedSearchModalOpen: boolean;
    advancedSearchOptions?: ISectionSearchOption;
    advancedSearchSelected: IAdvancedSearch;
    advancedSearchSelectedAfterSearch: IAdvancedSearch;
    dirtySearch: boolean;
    isLoadingSectionSearch: boolean;
    keywords?: string;
    keywordsAfterSearch?: string;
    sections?: ISection[];
    sectionSearchType: SectionSearchType;

    // By Block
    blockRegistrationExpanded: boolean;
    blockRegistrationRule?: IBlockRegistrationRuleDetail;
    enableBlockRegistration: boolean;
    isLoadingBlocks: boolean;
    isLoadingRule: boolean;
    ruleGroupBlocks?: IBlockRegRuleGroup[];
    selectedRuleGroup?: IBlockRegistrationRuleGroup;
    // #endregion Search
}

const styles = createStyles({
    blockRegistrationSearchCardContent: {
        paddingBottom: Tokens.spacing20,
        paddingLeft: Tokens.spacing50,
        paddingRight: Tokens.spacing50
    },
    indicatorResults: {
        marginTop: Tokens.spacing40
    },
    marginText: {
        marginTop: `${Tokens.spacing40}!important`
    },
    messagesMargin: {
        marginBottom: Tokens.spacing40
    },
    popperText: {
        maxWidth: '15rem'
    },
    sectionSearchCardContent: {
        paddingLeft: Tokens.spacing50,
        paddingRight: Tokens.spacing50
    },
    selectedBlockTitle: {
        marginTop: Tokens.spacing60,
        paddingLeft: Tokens.spacing40
    },
    statusMessageInfo: {
        height: 'auto',
        width: 'auto'
    }
});

type PropsWithStyles = WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class CoursesView extends React.Component<PropsWithStyles, ICoursesState> {
    private abortBlocks: AbortController;
    private abortSchedule: AbortController;
    private abortSearch: AbortController;
    private dropSectionId: number;
    private dropSectionName: string;
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ICoursesState>;

    public constructor(props: any) {
        super(props);

        // #region Initialize Variables and State
        this.abortBlocks = new AbortController();
        this.abortSchedule = new AbortController();
        this.abortSearch = new AbortController();
        this.dropSectionId = 0;
        this.dropSectionName = '';
        this.idModule = 'Registration';
        this.idPage = 'Courses';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): ICoursesState {
        let resources: ICoursesRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }

        const emptyAdvancedSearch: IAdvancedSearch = {
            eventId: '',
            keywords: '',
            registrationType: 'TRAD'
        } as IAdvancedSearch
            ;
        return {
            blockModalOpen: false,
            componentError: false,
            cultures: LayoutStore.getCultures(),
            hasAcademicInfo: false,
            isLoading: true,
            isOnStopList: false,
            resources: resources,
            sectionModalOpen: false,
            showDeniedCourses: false,

            // #region Agreement
            agreementMandatory: false,
            agreementModalOpen: false,
            agreementStatus: false,
            // #endregion Agreement

            // #region Cart
            countActions: 0,
            creditTypeModalOpen: false,
            dropBlockDialogOpen: false,
            dropDialogOpen: false,
            enableCart: false,
            enableRegister: false,
            errorLoadingScheduleList: false,
            isLoadingScheduleList: true,
            mySchedule: [[], [], [], [], []],
            permissionRequestModalOpen: false,
            viewCommentsAnchor: null,
            waitForSchedule: false,

            // Registration validation
            openStatusInfo: false,
            statusInfoAnchor: null,
            registrationSummaryModalOpen: false,
            validationMessagesModalOpen: false,
            // #endregion Cart

            // #region Payment
            enableOnlinePayment: false,
            paymentDetailModalOpen: false,
            paymentMethod: '1',
            paymentModalOpenFail: false,
            paymentModalOpenProcess: false,
            paymentModalOpenSuccess: false,
            // #endregion Payment

            // #region Search
            isLoadingPeriods: false,
            periodsModalOpen: false,
            requestAfterSwitch: false,
            searchView: undefined,
            selectedPeriodText: '',
            silentBlocksUpdate: false,
            silentSectionsUpdate: false,
            switchSearchView: false,

            // By Section
            advancedSearchModalOpen: false,
            advancedSearchSelected: emptyAdvancedSearch,
            advancedSearchSelectedAfterSearch: emptyAdvancedSearch,
            dirtySearch: false,
            isLoadingSectionSearch: false,
            keywords: '',
            sectionSearchType: SectionSearchType.None,

            // By Block
            blockRegistrationExpanded: true,
            enableBlockRegistration: false,
            isLoadingBlocks: false,
            isLoadingRule: false
            // #endregion Search
        };
    }

    // #region Events
    private onCloseBlockModal = (): void => {
        try {
            this.setState({
                blockDetail: undefined,
                blockModalOpen: false,
                groupBlockDetail: undefined,
                selectedBlockId: undefined,
                selectedBlockIndex: undefined,
                selectedGroupId: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseBlockModal.name, e));
        }
    };

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
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            this.setState({
                sectionDetailView: 'section'
            }, () => RequestsSection.getSection(id, true, this.resolveGetSection));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetails.name, e));
        }
    };

    private onViewSectionDetailsByBlock = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const id: number = Number(event.currentTarget.dataset.id);
            LayoutActions.showPageLoader();
            this.setState({
                sectionDetailView: 'block'
            }, () => RequestsSection.getSection(id, true, this.resolveGetSection));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetailsByBlock.name, e));
        }
    };

    private onViewSectionDetailsByCalendar = (id: number): void => {
        try {
            LayoutActions.showPageLoader();
            this.setState({
                sectionDetailView: 'section'
            }, () => RequestsSection.getSection(id, true, this.resolveGetSection));
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewSectionDetailsByCalendar.name, e));
        }
    };

    // #region Agreement
    private onAgreementSaved = (): void => {
        try {
            const {
                periodsForRegistration,
                selectedPeriod
            } = this.state;

            if (periodsForRegistration) {
                const periodFound: IRadioOption | undefined = periodsForRegistration.find(pr => pr.value === selectedPeriod);
                if (periodFound) {
                    periodFound.complement.peopleAgreementStatus = true;
                }
            }

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
    private onAddBlock = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                enableCart,
                ruleGroupBlocks
            } = this.state;

            if (enableCart) {
                if (ruleGroupBlocks) {
                    const ruleGroupBlockId: number = Number(event.currentTarget.dataset.id);
                    const ruleGroupBlock: IBlockRegRuleGroup | undefined = ruleGroupBlocks.find(b => b.blockRegRuleGroupBlockId === ruleGroupBlockId);
                    if (ruleGroupBlock) {
                        const waitlistSections: number[]
                            = ruleGroupBlock.sectionList.filter(s => s.isSelected && this.canAddToWaitlist(s)).map(s => s.id);
                        const cartSections: number[]
                            = ruleGroupBlock.sectionList.filter(s => s.isSelected && this.canAddToCart(s)).map(s => s.id);
                        if (cartSections.length > 0 || waitlistSections.length > 0) {
                            const block: IStudentBlockRegRuleGroupBlock = {
                                blockRegRuleGroupBlockId: ruleGroupBlockId,
                                cartSections: cartSections,
                                waitlistSections: waitlistSections
                            };
                            this.addLoadingBlockCard(ruleGroupBlock.blockRegRuleGroupBlockId,
                                ruleGroupBlock.blockRegistrationGroup.displayName, waitlistSections, cartSections);
                            Requests.postAddBlock(block, this.resolvePostAddToCart, this.logErrorScheduleList);
                            this.setState(prevState => ({
                                countActions: prevState.countActions + 1
                            }));
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAddBlock.name, e));
        }
    };

    private onAddBlockFromDetail = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                blockDetail,
                enableCart
            } = this.state;

            let waitlistSections: number[] = [];
            let cartSections: number[] = [];
            let id: number = 0;
            let displayName: string = '';

            if (enableCart) {
                const blockId: number = Number(event.currentTarget.dataset.id);
                if (blockDetail) {
                    waitlistSections
                        = blockDetail.sectionList.filter(s => s.isSelected && this.canAddToWaitlist(s)).map(s => s.id);
                    cartSections
                        = blockDetail.sectionList.filter(s => s.isSelected && this.canAddToCart(s)).map(s => s.id);
                    id = blockDetail.blockRegRuleGroupBlockId;
                    displayName = blockDetail.blockRegistrationGroup.displayName;
                }

                if (cartSections.length > 0 || waitlistSections.length > 0) {
                    const block: IStudentBlockRegRuleGroupBlock = {
                        blockRegRuleGroupBlockId: blockId,
                        cartSections: cartSections,
                        waitlistSections: waitlistSections
                    };
                    this.addLoadingBlockCard(id, displayName, waitlistSections, cartSections);
                    Requests.postAddBlock(block, this.resolvePostAddToCart, this.logErrorScheduleList);
                    this.setState(prevState => ({
                        countActions: prevState.countActions + 1
                    }));
                    this.onCloseBlockModal();
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAddBlockFromDetail.name, e));
        }
    };

    private onAddToCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                enableCart,
                sectionModalOpen
            } = this.state;

            if (enableCart) {
                const id: number = Number(event.currentTarget.dataset.id);
                this.addLoadingCard(id, ScheduleListType.Cart);
                Requests.postAddToCart(id, this.resolvePostAddToCart, this.logErrorScheduleList);
                this.setState(prevState => ({
                    countActions: prevState.countActions + 1
                }));
                if (sectionModalOpen) {
                    this.onCloseSectionModal();
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAddToCart.name, e));
        }
    };

    private onAddToWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                enableCart,
                sectionModalOpen
            } = this.state;

            if (enableCart) {
                const id: number = Number(event.currentTarget.dataset.id);
                this.addLoadingCard(id, ScheduleListType.Waitlist);
                Requests.postAddToWaitlist(id, this.resolvePostAddToWaitlist, this.logErrorScheduleList);
                this.setState(prevState => ({
                    countActions: prevState.countActions + 1
                }));
                if (sectionModalOpen) {
                    this.onCloseSectionModal();
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onAddToWaitlist.name, e));
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

    private onCloseDropBlockDialog = (): void => {
        try {
            this.setState({
                blockToDrop: undefined,
                dropBlockDialogOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDropBlockDialog.name, e));
        }
    };

    private onCloseDropDialog = (): void => {
        try {
            this.setState({
                dropDialogOpen: false
            });
            this.dropSectionId = 0;
            this.dropSectionName = '';
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

    private onDropBlock = (): void => {
        try {
            const {
                blockModalOpen,
                blockToDrop,
                enableRegister,
                selectedYearTerm
            } = this.state;

            if (enableRegister && selectedYearTerm && blockToDrop) {
                LayoutActions.showPageLoader();
                const dropSections: number[] = blockToDrop.studentSchedule[ScheduleListType.Registered] ?
                    blockToDrop.studentSchedule[ScheduleListType.Registered].map(s => s.id) : [];
                if (dropSections.length > 0) {
                    const block: IStudentBlockRegRuleGroupBlock = {
                        blockRegRuleGroupBlockId: blockToDrop.blockRegRuleGroupBlockId,
                        dropSections: dropSections,
                        yearTerm: selectedYearTerm
                    };
                    Requests.postDropBlock(block, this.resolvePostDrop, this.logErrorScheduleList);
                    this.onCloseDropBlockDialog();
                    if (blockModalOpen) {
                        this.onCloseBlockModal();
                    }
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onDropBlock.name, e));
        }
    };

    private onDropSection = (): void => {
        try {
            const {
                enableRegister,
                sectionModalOpen,
                selectedPeriod
            } = this.state;

            if (enableRegister) {
                if (selectedPeriod && this.dropSectionId > 0) {
                    LayoutActions.showPageLoader();
                    Requests.postDropRegistration(this.dropSectionId, selectedPeriod, this.resolvePostDrop, this.logErrorScheduleList);
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

    private onExpandBlockCartDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                myBlockSchedule
            } = this.state;

            if (myBlockSchedule) {
                const index: number = Number(event.currentTarget.dataset.index);
                myBlockSchedule[index].expanded = !Boolean(myBlockSchedule[index].expanded);
                this.setState({
                    myBlockSchedule
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandBlockCartDetails.name, e));
        }
    };

    private onOpenCreditTypeModal = (id: number): void => {
        try {
            const {
                myBlockSchedule,
                mySchedule
            } = this.state;

            let sectionFound: IStudentSchedule | undefined;
            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        block.studentSchedule.forEach(sectionList => {
                            sectionList.forEach(sectionInList => {
                                if (!Boolean(sectionFound) && sectionInList.id === id) {
                                    sectionFound = sectionInList;
                                }
                            });
                        });
                    }
                });
            }

            if (!Boolean(sectionFound) && mySchedule) {
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

    private onOpenDropBlockDialog = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                myBlockSchedule
            } = this.state;

            const index: number = Number(event.currentTarget.dataset.index);
            if (myBlockSchedule && myBlockSchedule[index] && myBlockSchedule[index].blockRegRuleGroupBlockId) {
                this.setState({
                    blockToDrop: myBlockSchedule[index],
                    dropBlockDialogOpen: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDropBlockDialog.name, e));
        }
    };

    private onOpenDropDialog = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            this.dropSectionId = Number(event.currentTarget.dataset.id);
            this.dropSectionName = String(event.currentTarget.dataset.name);

            this.setState({
                dropDialogOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDropDialog.name, e));
        }
    };

    private onOpenPermissionRequestModal = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                myBlockSchedule,
                mySchedule
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);

            let exist: boolean = false;
            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        block.studentSchedule.forEach(sectionList => {
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
                });
            }
            if (!exist && mySchedule) {
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
                myBlockSchedule,
                mySchedule
            } = this.state;

            const id: number = Number(event.currentTarget.dataset.id);
            let permissionRequest: boolean = false;
            if (event.currentTarget.dataset.permissionrequest !== undefined) {
                permissionRequest = JSON.parse(event.currentTarget.dataset.permissionrequest);
            }

            let exist: boolean = false;
            const viewCommentsAnchor: any = event.currentTarget.parentNode ? event.currentTarget.parentNode.parentNode : null;
            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        block.studentSchedule.forEach(sectionList => {
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
                                    else {
                                        this.setState({
                                            permissionRequestModalOpen: false,
                                            sectionSelected: section,
                                            viewCommentsAnchor: viewCommentsAnchor
                                        });
                                    }
                                }
                            });
                        });
                    }
                });
            }

            if (!exist && mySchedule) {
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
                            else {
                                this.setState({
                                    permissionRequestModalOpen: false,
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
                selectedPeriod
            } = this.state;

            if (enableRegister && !errorLoadingScheduleList) {
                LayoutActions.showPageLoader();
                const sections: IStudentRegistration = this.getSectionsToRegister();
                if (selectedPeriod && Object.entries(sections).length > 0) {
                    Requests.postStudentRegistration(
                        selectedPeriod,
                        sections,
                        this.resolvePostStudentRegistration,
                        this.logErrorScheduleList);
                }
                else {
                    LayoutActions.hidePageLoader();
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
                selectedPeriod
            } = this.state;

            LayoutActions.showPageLoader();
            const sections: IStudentRegistration = this.getSectionsToRegister();
            if (selectedPeriod && Object.entries(sections).length > 0) {
                this.setState({
                    agreementMandatory: true,
                    agreementModalOpen: true
                });
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRegisterWithAgreement.name, e));
        }
    };

    private onRemoveBlock = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                blockModalOpen,
                enableCart,
                myBlockSchedule
            } = this.state;

            if (enableCart) {
                const index: number = Number(event.currentTarget.dataset.index);
                if (myBlockSchedule && myBlockSchedule[index]
                    && myBlockSchedule[index].blockRegRuleGroupBlockId) {
                    LayoutActions.showPageLoader();
                    const waitlistSections: number[] = myBlockSchedule[index].studentSchedule[ScheduleListType.Waitlist] ?
                        myBlockSchedule[index].studentSchedule[ScheduleListType.Waitlist].map(s => s.id) : [];
                    const cartSections: number[] = myBlockSchedule[index].studentSchedule[ScheduleListType.Cart] ?
                        myBlockSchedule[index].studentSchedule[ScheduleListType.Cart].map(s => s.id) : [];
                    const pendingSections: number[] = myBlockSchedule[index].studentSchedule[ScheduleListType.Pending] ?
                        myBlockSchedule[index].studentSchedule[ScheduleListType.Pending].filter(s => s.isInCart).map(s => s.id) : [];
                    const deniedSections: number[] = myBlockSchedule[index].studentSchedule[ScheduleListType.Denied] ?
                        myBlockSchedule[index].studentSchedule[ScheduleListType.Denied].filter(s => s.isInCart).map(s => s.id) : [];
                    if (pendingSections.length > 0) {
                        pendingSections.forEach(s => cartSections.push(s));
                    }
                    if (deniedSections.length > 0) {
                        deniedSections.forEach(s => cartSections.push(s));
                    }
                    if (cartSections.length > 0 || waitlistSections.length > 0) {
                        const block: IStudentBlockRegRuleGroupBlock = {
                            blockRegRuleGroupBlockId: myBlockSchedule[index].blockRegRuleGroupBlockId,
                            cartSections: cartSections,
                            waitlistSections: waitlistSections
                        };
                        Requests.postRemoveBlock(block, this.resolvePostRemoveBlock, this.logErrorScheduleList);
                        if (blockModalOpen) {
                            this.onCloseBlockModal();
                        }
                    }
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onRemoveBlock.name, e));
        }
    };

    private onRemoveFromCart = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                enableCart,
                sectionModalOpen
            } = this.state;

            if (enableCart) {
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
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onRemoveFromCart.name, e));
        }
    };

    private onRemoveFromWaitlist = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                enableCart,
                sectionModalOpen
            } = this.state;

            if (enableCart) {
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
                    LayoutActions.showPageLoader();
                }
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onSaveCreditType.name, e));
        }
    };

    private onSelectSection = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                blockDetail,
                blockModalOpen,
                myBlockSchedule,
                ruleGroupBlocks,
                selectedBlockId,
                selectedBlockIndex
            } = this.state;

            const blockId: number = Number(event.target.dataset.blockid);
            const id: number = Number(event.target.dataset.id);
            let section: ISection | IStudentSchedule | undefined;

            if (ruleGroupBlocks) {
                const ruleGroupBlock: IBlockRegRuleGroup | undefined = ruleGroupBlocks.find(b => b.blockRegRuleGroupBlockId === blockId);
                if (ruleGroupBlock) {
                    section = ruleGroupBlock.sectionList.find(s => s.id === id);
                    if (section) {
                        section.isSelected = event.target.checked;
                        this.setState({
                            ruleGroupBlocks: ruleGroupBlocks
                        });
                    }
                }
            }
            if (blockModalOpen) {
                if (blockDetail) {
                    section = blockDetail.sectionList.find(s => s.id === id);
                    if (section) {
                        section.isSelected = event.target.checked;
                        this.setState({
                            blockDetail: blockDetail
                        });
                    }
                }

                if (selectedBlockId && selectedBlockId === blockId
                    && myBlockSchedule && selectedBlockIndex != undefined && myBlockSchedule[selectedBlockIndex].studentSchedule
                    && myBlockSchedule[selectedBlockIndex].studentSchedule[ScheduleListType.Denied]) {
                    section = myBlockSchedule[selectedBlockIndex].studentSchedule[ScheduleListType.Denied].find(s => s.id === id);
                    if (section) {
                        section.isSelected = event.target.checked;
                        this.setState({
                            myBlockSchedule: myBlockSchedule
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectSection.name, e));
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
                        LayoutActions.showPageLoader();
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

    private onViewBlockDetails = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                myBlockSchedule,
                ruleGroupBlocks,
                selectedRuleGroup,
                selectedYearTerm
            } = this.state;
            LayoutActions.showPageLoader();

            const id: number = Number(event.currentTarget.dataset.id);
            let groupId: number | undefined;
            if (event.currentTarget.dataset.groupid) {
                groupId = Number(event.currentTarget.dataset.groupid);
            }

            const selectedBlockId: number | undefined = id;
            let selectedGroupId: number | undefined = groupId;
            let selectedBlockIndex: number | undefined;
            let selectedBlock: IBlockStudentSchedule | undefined;

            if (myBlockSchedule) {
                selectedBlockIndex = myBlockSchedule.findIndex(b => b.blockRegRuleGroupBlockId === id);
                if (selectedBlockIndex !== undefined && selectedBlockIndex >= 0) {
                    selectedBlock = myBlockSchedule[selectedBlockIndex];
                    selectedGroupId = myBlockSchedule[selectedBlockIndex].blockRegistrationRuleGroupId;
                }
                else {
                    selectedBlockIndex = undefined;
                }
            }

            if (!selectedBlock && selectedRuleGroup) {
                selectedGroupId = selectedRuleGroup.blockRegistrationRuleGroupId;
            }

            this.setState({
                selectedBlockId: selectedBlockId,
                selectedBlockIndex: selectedBlockIndex,
                selectedGroupId: selectedGroupId
            });

            let exist: boolean = false;

            if (ruleGroupBlocks) {
                let block: IBlockRegRuleGroup | undefined = ruleGroupBlocks.find(b => b.blockRegRuleGroupBlockId === id);
                if (block) {
                    exist = true;
                    block = this.getFilteredBlockSections(block, selectedBlock);
                    this.setState({
                        blockDetail: block,
                        blockModalOpen: true,
                        groupBlockDetail: selectedRuleGroup
                    });
                }
            }

            if (!exist && selectedYearTerm && selectedGroupId) {
                Requests.getBlock(selectedGroupId, id, selectedYearTerm, this.resolveGetBlock, this.logError);
            }
            else {
                LayoutActions.hidePageLoader();
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewBlockDetails.name, e));
        }
    };

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
                        LayoutActions.showPageLoader();
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

    // #endregion Cart

    // #region Registration validation

    private onCloseRegistrationSummaryModal = (): void => {
        try {
            this.setState({
                registrationSummaryModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseRegistrationSummaryModal.name, e));
        }
    };

    private onCloseStatusInfoPopper = (): void => {
        try {
            this.setState({
                openStatusInfo: false,
                statusInfoAnchor: null
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseStatusInfoPopper.name, e));
        }
    };

    private onOpenRegistrationSummaryModal = (): void => {
        try {
            const {
                registrationLogId,
                registrationSummary
            } = this.state;

            if (registrationSummary) {
                this.setState({
                    registrationSummaryModalOpen: true
                });
            }
            else {
                LayoutActions.showPageLoader();
                Requests.getRegistrationSummary(registrationLogId ?? 0, this.resolveGetRegistrationSummary);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenRegistrationSummaryModal.name, e));
        }
    };

    private onOpenStatusInfoPopper = (event: any): void => {
        try {
            this.setState({
                openStatusInfo: true,
                statusInfoAnchor: event.currentTarget
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenStatusInfoPopper.name, e));
        }
    };

    // #endregion Registration validation

    // #region Payment
    private onChangePaymentAnotherAmount = (event: any): void => {
        try {
            const {
                paymentInfo
            } = this.state;

            if (paymentInfo) {
                paymentInfo.anotherAmount = event.target.value;
                paymentInfo.modified = true;
                paymentInfo.invalidAnotherAmount = !this.validateAnotherAmount(paymentInfo.anotherAmount);
                paymentInfo.canPay = Boolean(paymentInfo.anotherAmount) && !paymentInfo.invalidAnotherAmount;
                this.setState({
                    paymentInfo: paymentInfo
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePaymentAnotherAmount.name, e));
        }
    };

    private onChangePaymentMethod = (event: any): void => {
        try {
            const {
                paymentInfo
            } = this.state;

            const paymentMethod: string = event.target.value;

            if (paymentInfo) {
                if (paymentMethod === '0') {
                    paymentInfo.modified = true;
                    paymentInfo.invalidAnotherAmount = !this.validateAnotherAmount(paymentInfo.anotherAmount);
                }
                paymentInfo.canPay = paymentMethod !== '0'
                    || (paymentMethod === '0'
                        && Boolean(paymentInfo.anotherAmount)
                        && !paymentInfo.invalidAnotherAmount);

                this.setState({
                    paymentInfo: paymentInfo
                });
            }

            this.setState({
                paymentMethod: paymentMethod
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePaymentMethod.name, e));
        }
    };

    private onClosePaymentDetailModal = (): void => {
        try {
            const {
                resources
            } = this.state;

            this.setState({
                enableOnlinePayment: false,
                paymentDetailModalOpen: false,
                paymentInfo: undefined
            }, () => {
                if (resources) {
                    LayoutActions.setAlert({
                        content: (
                            <>
                                <Text>
                                    {resources.lblRegistrationSuccess}
                                </Text>
                                <Button
                                    id="btnViewRegistrationSummary"
                                    variant="text"
                                    textVariantStyling="inherit"
                                    onClick={this.onOpenRegistrationSummaryModal}>
                                    {resources.btnViewRegistrationSummary}
                                </Button>
                            </>
                        ),
                        messageType: ResultType.warning
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
                        content: (
                            <>
                                <Text>
                                    {resources.lblRegistrationSuccess}
                                </Text>
                                <Button
                                    id="btnViewRegistrationSummary"
                                    variant="text"
                                    textVariantStyling="inherit"
                                    onClick={this.onOpenRegistrationSummaryModal}>
                                    {resources.btnViewRegistrationSummary}
                                </Button>
                            </>
                        ),
                        messageType: ResultType.warning
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
    // #endregion Payment

    // #region Search
    // By Section
    private onAdvancedSearch = (): void => {
        try {
            const {
                advancedSearchOptions,
                advancedSearchSelected,
                selectedPeriod
            } = this.state;

            let periodSelected: string | undefined;
            if (advancedSearchSelected.period && advancedSearchOptions) {
                this.setState({
                    advancedSearchSelectedAfterSearch: advancedSearchSelected,
                    keywords: advancedSearchSelected.keywords,
                    sectionSearchType: SectionSearchType.Advanced,
                    silentSectionsUpdate: false,
                    advancedSearchModalOpen: false
                }, () => {
                    this.advancedSearch(advancedSearchSelected);
                });
                if (selectedPeriod !== advancedSearchSelected.period) {
                    advancedSearchOptions.periods.forEach(item => {
                        if (advancedSearchSelected && item.value === advancedSearchSelected.period) {
                            periodSelected = item.description;
                            // Set Year/Term
                            const periodParts: string[] = advancedSearchSelected.period.split('/');
                            const yearTerm: IYearTerm = {
                                term: periodParts[1],
                                year: Number(periodParts[0])
                            };
                            this.setState({
                                selectedPeriod: advancedSearchSelected.period,
                                selectedPeriodText: periodSelected,
                                selectedYearTerm: yearTerm
                            }, () => {
                                this.reloadScheduleList();
                                this.setWarningsMySchedule();
                            });
                        }
                    });
                }
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
            const {
                advancedSearchSelected
            } = this.state;

            const idSelected = id.replace('_AdvancedSearchModal', '');
            advancedSearchSelected[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = date;
            this.setState({
                advancedSearchSelected: advancedSearchSelected
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchDateTimeChange.name, e));
        }
    };

    private onAdvancedSearchDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            const ids: string[] = id.split('_');
            id = ids.length > 1 ? ids[0] : id;
            advancedSearchSelected[`${id[3].toLowerCase()}${id.substr(4, id.length - 4)}`] = optionSelected.value;
            this.setState({
                advancedSearchSelected: advancedSearchSelected
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdvancedSearchDropdownChange.name, e));
        }
    };

    private onAdvancedSearchTextFieldChange = (event: any): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;
            let idSelected: string = event.target.id;
            idSelected = idSelected.replace('_AdvancedSearchModal', '');

            advancedSearchSelected[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
            this.setState({
                advancedSearchSelected: advancedSearchSelected
            });
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
                keywords: searchValue,
                keywordsAfterSearch: searchValue,
                sectionSearchType: SectionSearchType.Basic,
                silentSectionsUpdate: false
            });
            this.basicSearch(searchValue);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBasicSearchEnterPress.name, e));
        }
    };

    private onChangePeriod = (event: any): void => {
        try {
            this.setState({
                selectedPeriodModal: event.target.value
            });
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.onChangePeriod.name, e));
        }
    };

    private onClearSelectedOptions = (): void => {
        try {
            const {
                advancedSearchSelected
            } = this.state;

            advancedSearchSelected.campusId = '';
            advancedSearchSelected.classLevel = '';
            advancedSearchSelected.college = '';
            advancedSearchSelected.creditType = '';
            advancedSearchSelected.curriculum = '';
            advancedSearchSelected.department = '';
            advancedSearchSelected.endDate = '';
            advancedSearchSelected.endTime = '';
            advancedSearchSelected.eventId = '';
            advancedSearchSelected.eventSubType = '';
            advancedSearchSelected.eventType = '';
            advancedSearchSelected.generalEd = '';
            advancedSearchSelected.instructorId = undefined;
            advancedSearchSelected.keywords = '';
            advancedSearchSelected.meeting = '';
            advancedSearchSelected.nonTradProgram = '';
            advancedSearchSelected.population = '';
            advancedSearchSelected.program = '';
            advancedSearchSelected.registrationType = 'TRAD';
            advancedSearchSelected.session = '';
            advancedSearchSelected.startDate = '';
            advancedSearchSelected.startTime = '';
            advancedSearchSelected.status = '';
            this.setState({
                advancedSearchSelected: advancedSearchSelected,
                advancedSearchSelectedAfterSearch: advancedSearchSelected
            });
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

    private onClosePeriodsModal = (): void => {
        try {
            this.setState({
                periodsModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePeriodsModal.name, e));
        }
    };

    private onNewSearch = (): void => {
        try {
            this.setState({
                dirtySearch: false,
                keywords: '',
                keywordsAfterSearch: '',
                sections: undefined,
                sectionSearchType: SectionSearchType.None
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
                keywords,
                selectedPeriod
            } = this.state;

            advancedSearchSelected.keywords = keywords;
            advancedSearchSelected.period = selectedPeriod;
            this.setState({
                advancedSearchModalOpen: true,
                advancedSearchSelected: advancedSearchSelected
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenAdvancedSearchModal.name, e));
        }
    };

    private onOpenPeriodsModal = (): void => {
        try {
            const {
                isLoadingBlocks,
                isLoadingPeriods,
                isLoadingRule,
                isLoadingSectionSearch
            } = this.state;

            if (!isLoadingBlocks && !isLoadingPeriods
                && !isLoadingRule && !isLoadingSectionSearch) {
                this.setState({
                    periodsModalOpen: true,
                    selectedPeriodModal: this.state.selectedPeriod
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPeriodsModal.name, e));
        }
    };

    private onSelectPeriod = (): void => {
        try {
            const {
                enableBlockRegistration,
                periodsForRegistration,
                periodsForSearch,
                sectionSearchType,
                selectedPeriodModal
            } = this.state;

            let period: IRadioOption | undefined;
            let agreementStatus: boolean = false;
            if (periodsForRegistration) {
                periodsForRegistration.forEach(item => {
                    if (item.value === selectedPeriodModal) {
                        period = item;
                        agreementStatus = period.complement.peopleAgreementStatus;
                    }
                });
            }
            if (!period && periodsForSearch) {
                periodsForSearch.forEach(item => {
                    if (item.value === selectedPeriodModal) {
                        period = item;
                    }
                });
            }

            if (period) {
                // Set Year/Term
                const periodParts: string[] = period.value.toString().split('/');
                const yearTerm: IYearTerm = {
                    term: periodParts[1],
                    year: Number(periodParts[0])
                };

                this.abortBlocks.abort();
                this.abortBlocks = new AbortController();
                this.abortSchedule.abort();
                this.abortSchedule = new AbortController();
                this.abortSearch.abort();
                this.abortSearch = new AbortController();

                this.setState({
                    agreementStatus: agreementStatus,
                    periodsModalOpen: false,
                    searchView: 'section',
                    selectedPeriod: period.value.toString(),
                    selectedPeriodText: period.description,
                    selectedYearTerm: yearTerm,
                    switchSearchView: false
                }, () => {
                    if (enableBlockRegistration) {
                        this.setRule();
                    }
                    if (sectionSearchType === SectionSearchType.Basic) {
                        this.silentUpdate(true);
                    }
                    else if (sectionSearchType === SectionSearchType.Advanced) {
                        this.onNewSearch();
                        this.onClearSelectedOptions();
                    }

                    this.reloadScheduleList();
                    this.setWarningsMySchedule();
                });
            }
            else {
                this.hideLoaderSectionSearch();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectPeriod.name, e));
        }
    };

    // By Block
    private onChangeSearchView = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                requestAfterSwitch
            } = this.state;

            const requested: boolean = requestAfterSwitch;
            this.setState({
                requestAfterSwitch: false,
                searchView: event.currentTarget.dataset.searchview as SearchViewType
            }, () => {
                if (requested) {
                    this.silentUpdate(true);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSearchView.name, e));
        }
    };

    private onExpandBlockRegistration = (_event: object, expanded: boolean): void => {
        try {
            this.setState({
                blockRegistrationExpanded: expanded
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onExpandBlockRegistration.name, e));
        }
    };

    private onRuleGroupClick = (event: any): void => {
        try {
            const {
                blockRegistrationRule
            } = this.state;

            if (blockRegistrationRule) {
                const selectedRuleGroup: IBlockRegistrationRuleGroup
                    = blockRegistrationRule.blockRegRuleGroups[Number(event.currentTarget.dataset.index)];
                this.setState({
                    blockRegistrationExpanded: false,
                    selectedRuleGroup: selectedRuleGroup,
                    silentBlocksUpdate: false
                }, this.setBlocks);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRuleGroupClick.name, e));
        }
    };
    // #endregion Search

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

    // #endregion Events

    // #region Functions

    // #region Cart
    // #region Cart Loaders
    private addLoadingBlockCard = (id: number, displayName: string, waitlistSections: number[], cartSections: number[]): void => {
        try {
            const {
                myBlockSchedule,
                selectedRuleGroup
            } = this.state;

            let isNewBlock: boolean = true;
            const newMyBlockSchedule: IBlockStudentSchedule[] = myBlockSchedule || [];
            let block: IBlockStudentSchedule | undefined;
            block = newMyBlockSchedule.find(b => b.blockRegRuleGroupBlockId === id);
            if (!block) {
                block = {
                    allowChanges: false,
                    blockRegistrationRuleGroupId: selectedRuleGroup ? selectedRuleGroup.blockRegistrationRuleGroupId : 0,
                    blockRegRuleGroupBlockId: id,
                    displayName: displayName,
                    numberOfSections: 0,
                    numberOfSectionsSelected: 0,
                    showDrop: false,
                    studentSchedule: [[], [], [], [], []],

                    expanded: false,
                    isLoading: true,
                    status: BlockRegBlockStatus.Processing
                } as IBlockStudentSchedule;
            }
            else {
                block.expanded = true;
                block.isLoading = true;
                isNewBlock = false;
                if (!block.studentSchedule) {
                    block.studentSchedule = [];
                }
                if (!block.studentSchedule[ScheduleListType.Waitlist]) {
                    block.studentSchedule[ScheduleListType.Waitlist] = [];
                }
                if (!block.studentSchedule[ScheduleListType.Cart]) {
                    block.studentSchedule[ScheduleListType.Cart] = [];
                }
            }
            waitlistSections.forEach(sectionId => {
                if (block) {
                    block.studentSchedule[ScheduleListType.Waitlist].unshift({
                        hasBlockRelated: true,
                        id: sectionId,
                        isInCart: false,
                        isInWaitlist: true,

                        isLoading: true
                    } as IStudentSchedule);
                }
            });
            cartSections.forEach(sectionId => {
                if (block) {
                    block.studentSchedule[ScheduleListType.Cart].unshift({
                        hasBlockRelated: true,
                        id: sectionId,
                        isInCart: true,
                        isInWaitlist: false,

                        isLoading: true
                    } as IStudentSchedule);
                }
            });

            if (isNewBlock) {
                newMyBlockSchedule.unshift(block);
            }

            this.setState({
                myBlockSchedule: myBlockSchedule
            }, this.setGroupAndBlockStatus);
        }
        catch (e) {
            this.logError(LogData.fromException(this.addLoadingBlockCard.name, e));
        }
    };

    private addLoadingCard = (id: number, position: ScheduleListType): void => {
        try {
            const {
                mySchedule
            } = this.state;

            const newMySchedule: IStudentSchedule[][] = mySchedule || [[], [], [], [], []];
            const newSection: IStudentSchedule = {
                id: id,
                isInCart: position === ScheduleListType.Cart,
                isInWaitlist: position === ScheduleListType.Waitlist,

                isLoading: true
            } as IStudentSchedule;

            newMySchedule[position].unshift(newSection);

            this.setState({
                mySchedule: newMySchedule
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.addLoadingCard.name, e));
        }
    };

    private hideActionsCard = (id: number): void => {
        try {
            const {
                myBlockSchedule,
                mySchedule
            } = this.state;

            let foundSection: IStudentSchedule | undefined;

            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        block.studentSchedule.forEach(sectionList => {
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
                });
            }

            if (!foundSection && mySchedule) {
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.hideActionsCard.name, e));
        }
    };

    private removeCard = (id: number): void => {
        try {
            const {
                myBlockSchedule,
                mySchedule
            } = this.state;

            let sectionToRemove: IStudentSchedule | undefined;

            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        block.studentSchedule.forEach(sectionList => {
                            if (sectionList && !sectionToRemove) {
                                sectionToRemove = sectionList.find(sl => sl.id === id);
                                if (sectionToRemove) {
                                    block.numberOfSectionsSelected = block.numberOfSectionsSelected - 1;
                                    sectionList.splice(sectionList.indexOf(sectionToRemove), 1);
                                }
                                if (sectionList.length === 0) {
                                    block.status = BlockRegBlockStatus.None;
                                }
                            }
                        });
                    }
                });
            }

            if (!sectionToRemove && mySchedule) {
                mySchedule.forEach(sectionList => {
                    if (sectionList && !sectionToRemove) {
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.removeCard.name, e));
        }
    };
    // #endregion Cart Loaders

    private canAddToCart = (section: ISection): boolean => {
        try {
            const {
                enableCart,
                errorLoadingScheduleList,
                myBlockSchedule,
                mySchedule
            } = this.state;

            if (enableCart && !errorLoadingScheduleList) {
                let result: boolean = true;
                let foundSection: IStudentSchedule | undefined;
                if (myBlockSchedule) {
                    myBlockSchedule.forEach(block => {
                        if (block.studentSchedule) {
                            block.studentSchedule.forEach(sectionList => {
                                if (!foundSection && sectionList && (foundSection = sectionList.find(s => (s.id === section.id)))) {
                                    result = foundSection.isDenied && !foundSection.isInCart;
                                }
                            });
                        }
                    });
                }
                if (!foundSection && mySchedule) {
                    mySchedule.forEach(sectionList => {
                        if (!foundSection && sectionList && (foundSection = sectionList.find(s => (s.id === section.id)))) {
                            result = foundSection.isDenied && !foundSection.isInCart;
                        }
                    });
                }
                return result && section.isCartable && section.seatsLeft > 0;
            }
            return false;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canAddToCart.name, e));
            return false;
        }
    };

    private canAddToWaitlist = (section: ISection): boolean => {
        try {
            const {
                enableCart,
                errorLoadingScheduleList,
                myBlockSchedule,
                mySchedule
            } = this.state;

            if (enableCart && !errorLoadingScheduleList) {
                let result: boolean = true;
                let foundSection: IStudentSchedule | undefined;
                if (myBlockSchedule) {
                    myBlockSchedule.forEach(block => {
                        if (block.studentSchedule) {
                            block.studentSchedule.forEach(sectionList => {
                                if (!foundSection && sectionList && (foundSection = sectionList.find(s => (s.id === section.id)))) {
                                    result = foundSection.isDenied && !foundSection.isInCart;
                                }
                            });
                        }
                    });
                }
                if (!foundSection && mySchedule) {
                    mySchedule.forEach(sectionList => {
                        if (!foundSection && sectionList && (foundSection = sectionList.find(s => (s.id === section.id)))) {
                            result = foundSection.isDenied && !foundSection.isInCart;
                        }
                    });
                }
                return result && section.isWaitable;
            }
            return false;
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

    private canDropSection = (section: ISection, includingBlocks?: boolean): boolean => {
        try {
            const {
                agreement,
                agreementStatus,
                enableRegister,
                errorLoadingScheduleList,
                myBlockSchedule,
                mySchedule
            } = this.state;

            let result: boolean = false;
            if (enableRegister && !errorLoadingScheduleList && (!agreement || (agreement && agreementStatus))) {
                if (includingBlocks) {
                    if (myBlockSchedule) {
                        myBlockSchedule.forEach(block => {
                            if (block.studentSchedule) {
                                if (block.studentSchedule[ScheduleListType.Registered]
                                    && block.studentSchedule[ScheduleListType.Registered].find(s => (
                                        s.id === section.id
                                        && s.showDrop
                                        && !s.isPending
                                        && !s.hideActions))) {
                                    result = true;
                                }
                            }
                        });
                    }
                }
                if (mySchedule) {
                    if (mySchedule[ScheduleListType.Registered]
                        && mySchedule[ScheduleListType.Registered].find(s => (
                            s.id === section.id
                            && s.showDrop
                            && !s.isPending
                            && !s.hideActions))) {
                        result = true;
                    }
                }
            }
            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canDropSection.name, e));
            return false;
        }
    };

    private canDropBlock = (index: number): boolean => {
        try {
            const {
                agreement,
                agreementStatus,
                enableRegister,
                errorLoadingScheduleList,
                myBlockSchedule
            } = this.state;

            let result: boolean = false;

            if (enableRegister
                && !errorLoadingScheduleList
                && (!agreement || (agreement && agreementStatus))
                && myBlockSchedule
                && myBlockSchedule[index]
                && myBlockSchedule[index].showDrop
                && myBlockSchedule[index].blockRegRuleGroupBlockId) {
                if (myBlockSchedule[index].studentSchedule[ScheduleListType.Registered]
                    && Boolean(myBlockSchedule[index].studentSchedule[ScheduleListType.Registered].find(s =>
                        s.isRegistered
                        && s.showDrop
                        && !s.isPending
                        && !s.isLoading
                        && !s.hideActions))) {
                    result = true;
                }
            }

            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canDropBlock.name, e));
            return false;
        }
    };

    private canRemoveBlock = (index: number): boolean => {
        try {
            const {
                enableCart,
                errorLoadingScheduleList,
                myBlockSchedule
            } = this.state;

            let resultWaitlist: boolean = false;
            let resultCart: boolean = false;
            let resultPending: boolean = false;
            let resultDenied: boolean = false;

            if (enableCart
                && !errorLoadingScheduleList
                && myBlockSchedule
                && myBlockSchedule[index]
                && myBlockSchedule[index].blockRegRuleGroupBlockId) {
                if (myBlockSchedule[index].studentSchedule[ScheduleListType.Waitlist]
                    && myBlockSchedule[index].studentSchedule[ScheduleListType.Waitlist].find(s =>
                        !s.isLoading
                        && !s.hideActions)) {
                    resultWaitlist = true;
                }
                if (myBlockSchedule[index].studentSchedule[ScheduleListType.Cart]
                    && myBlockSchedule[index].studentSchedule[ScheduleListType.Cart].find(s =>
                        !s.isLoading
                        && !s.hideActions)) {
                    resultCart = true;
                }
                if (myBlockSchedule[index].studentSchedule[ScheduleListType.Pending]
                    && myBlockSchedule[index].studentSchedule[ScheduleListType.Pending].find(s =>
                        s.isInCart
                        && !s.isLoading
                        && !s.hideActions)) {
                    resultPending = true;
                }
                if (myBlockSchedule[index].studentSchedule[ScheduleListType.Denied]
                    && myBlockSchedule[index].studentSchedule[ScheduleListType.Denied].find(s =>
                        s.isInCart
                        && !s.isLoading
                        && !s.hideActions)) {
                    resultDenied = true;
                }
            }

            return resultWaitlist || resultCart || resultPending || resultDenied;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canRemoveBlock.name, e));
            return false;
        }
    };

    private canRemoveFromCart = (section: ISection | ISectionDetail | IStudentSchedule, includingBlocks?: boolean): boolean => {
        try {
            const {
                enableCart,
                errorLoadingScheduleList,
                myBlockSchedule,
                mySchedule
            } = this.state;

            let result: boolean = false;
            if (enableCart && !errorLoadingScheduleList && !((section as IStudentSchedule).isDenied && !(section as IStudentSchedule).isInCart)) {
                if (includingBlocks) {
                    if (myBlockSchedule) {
                        myBlockSchedule.forEach(block => {
                            if (block.studentSchedule) {
                                if (block.studentSchedule[ScheduleListType.Cart] && block.studentSchedule[ScheduleListType.Cart].find(s => (
                                    s.id === section.id
                                    && !s.isLoading
                                    && !s.hideActions))) {
                                    result = true;
                                }
                                else if (block.studentSchedule[ScheduleListType.Pending] && block.studentSchedule[ScheduleListType.Pending].find(s => (
                                    s.id === section.id
                                    && s.isInCart
                                    && !s.isLoading
                                    && !s.hideActions))) {
                                    result = true;
                                }
                                else if (block.studentSchedule[ScheduleListType.Denied] && block.studentSchedule[ScheduleListType.Denied].find(s => (
                                    s.id === section.id
                                    && s.isInCart
                                    && !s.isLoading
                                    && !s.hideActions))) {
                                    result = true;
                                }
                            }
                        });
                    }
                }
                if (mySchedule) {
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
            }
            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canRemoveFromCart.name, e));
            return false;
        }
    };

    private canRemoveFromWaitlist = (section: ISection, includingBlocks?: boolean): boolean => {
        try {
            const {
                enableCart,
                errorLoadingScheduleList,
                myBlockSchedule,
                mySchedule
            } = this.state;

            let result: boolean = false;
            if (enableCart && !errorLoadingScheduleList) {
                if (includingBlocks) {
                    if (myBlockSchedule) {
                        myBlockSchedule.forEach(block => {
                            if (block.studentSchedule) {
                                if (block.studentSchedule[ScheduleListType.Waitlist] && block.studentSchedule[ScheduleListType.Waitlist].find(s => (
                                    s.id === section.id
                                    && !s.isLoading
                                    && !s.hideActions))) {
                                    result = true;
                                }
                            }
                        });
                    }
                }
                if (mySchedule) {
                    if (mySchedule[ScheduleListType.Waitlist] && mySchedule[ScheduleListType.Waitlist].find(s => (
                        s.id === section.id
                        && !s.isLoading
                        && !s.hideActions))) {
                        result = true;
                    }
                }
            }
            return result;
        }
        catch (e) {
            this.logError(LogData.fromException(this.canRemoveFromWaitlist.name, e));
            return false;
        }
    };

    private existInBlocks(id: number, myBlockSchedule?: IBlockStudentSchedule[]): boolean {
        let result = false;

        if (myBlockSchedule) {
            myBlockSchedule.forEach(block => {
                if (block.studentSchedule) {
                    block.studentSchedule.forEach(sectionList => {
                        if (sectionList && sectionList.findIndex(s => s.id === id) >= 0) {
                            result = true;
                        }
                    });
                }
            });
        }

        return result;
    }

    private getFilteredBlockSections(blockToFilter?: IBlockRegRuleGroup, selectedBlock?: IBlockStudentSchedule): IBlockRegRuleGroup | undefined {
        if (blockToFilter) {
            let foundSection: IStudentSchedule | undefined;
            blockToFilter.sectionList.forEach(section => {
                section.isHidden = false;
                if (selectedBlock && selectedBlock.studentSchedule) {
                    blockToFilter.status = selectedBlock.status;
                    selectedBlock.studentSchedule.forEach(sectionList => {
                        if (sectionList && (foundSection = sectionList.find(s => s.id === section.id))) {
                            foundSection.isCartable = section.isCartable;
                            foundSection.isWaitable = section.isWaitable;
                            foundSection.isSelected = section.isSelected;
                            foundSection.seatsLeft = section.seatsLeft;
                            foundSection.maximumSeats = section.maximumSeats;
                            foundSection.seatsWaiting = section.seatsWaiting;
                            section.isHidden = true;
                        }
                    });
                }
                else {
                    blockToFilter.status = BlockRegBlockStatus.None;
                }
            });
        }
        return blockToFilter;
    }

    private getMyBlockScheduleStatus = (myBlockSchedule?: IBlockStudentSchedule[]): IBlockStudentSchedule[] | undefined => {
        try {
            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule) {
                        if (block.studentSchedule[ScheduleListType.Registered] && block.studentSchedule[ScheduleListType.Registered].length > 0) {
                            block.status = BlockRegBlockStatus.Completed;
                        }
                        else {
                            block.status = BlockRegBlockStatus.Processing;
                        }
                        block.numberOfSectionsSelected = 0;
                        block.studentSchedule.forEach(sectionList => {
                            if (sectionList) {
                                block.numberOfSectionsSelected += sectionList.length;
                                sectionList.forEach(section => {
                                    section.allowChanges = block.allowChanges;
                                    section.hasBlockRelated = true;
                                });
                            }
                        });
                    }
                });
            }
            return myBlockSchedule;
        }
        catch (e) {
            this.logError(LogData.fromException(this.getMyBlockScheduleStatus.name, e));
            return myBlockSchedule;
        }
    };

    private getMyNewSchedule = (
        mySchedule?: IStudentSchedule[][],
        newSchedule?: IStudentSchedule[][],
        myBlockSchedule?: IBlockStudentSchedule[]
    ): IStudentSchedule[][] | undefined => {
        try {
            if (mySchedule && newSchedule) {
                // Search all the cards loading or waiting for a response
                const loadingSections: IStudentSchedule[] = [];
                const hideActionSections: IStudentSchedule[] = [];
                const waitlistSections: IStudentSchedule[]
                    = mySchedule[ScheduleListType.Waitlist].filter(sl => sl.isPending && sl.isWaitListPending);

                mySchedule.forEach(sectionList => {
                    sectionList.filter(sl => sl.isLoading).forEach(section => {
                        // Just add loading cards that are not yet in blocks
                        if (!myBlockSchedule || !this.existInBlocks(section.id, myBlockSchedule)) {
                            loadingSections.push(section);
                        }
                    });
                    sectionList.filter(sl => sl.hideActions).forEach(section => {
                        hideActionSections.push(section);
                    });
                });

                // Update the cart items with the loading status
                let searchedSection: IStudentSchedule | undefined;
                newSchedule.forEach(sectionList => {
                    if (sectionList) {
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
                    }
                });

                // Keep the loading card to wait for the next update
                loadingSections.forEach(section => {
                    if (section.isInWaitlist) {
                        newSchedule[0].unshift(section);
                    }
                    else if (section.isInCart) {
                        newSchedule[1].unshift(section);
                    }
                });
            }
            return newSchedule;
        }
        catch (e) {
            this.logError(LogData.fromException(this.getMyNewSchedule.name, e));
            return newSchedule;
        }
    };

    private getSectionStatus = (section: IStudentSchedule): ISectionStatus => {
        const {
            classes
        } = this.props;

        const {
            openStatusInfo,
            statusInfoAnchor,
            resources
        } = this.state;

        const sectionStatusInfo: ISectionStatusInfo = {
            classes: classes,
            openStatusInfo: openStatusInfo,
            statusInfoAnchor: statusInfoAnchor,
            onCloseStatusInfoPopper: this.onCloseStatusInfoPopper,
            onOpenStatusInfoPopper: this.onOpenStatusInfoPopper
        };

        return SectionHelper.getSectionStatus(section, resources?.studentCourseStatus, resources?.studentCourseMessages, sectionStatusInfo);
    };

    private getSectionsToRegister = (): IStudentRegistration => {
        const sections: IStudentRegistration = {};
        try {
            const {
                enableRegister,
                myBlockSchedule,
                mySchedule,
                selectedPeriod
            } = this.state;

            if (myBlockSchedule) {
                myBlockSchedule.forEach(block => {
                    if (block.studentSchedule
                        && (block.studentSchedule[ScheduleListType.Waitlist] || block.studentSchedule[ScheduleListType.Cart])) {
                        if (selectedPeriod) {
                            if (!(block.studentSchedule[ScheduleListType.Waitlist].filter(s => s.hideActions || s.isLoading).length > 0
                                || block.studentSchedule[ScheduleListType.Cart].filter(s => s.hideActions || s.isLoading).length > 0)) {
                                block.studentSchedule[ScheduleListType.Waitlist]
                                    .filter(s => !s.hideActions && !s.isLoading)
                                    .forEach(sectionInWaitlist => {
                                        if (sectionInWaitlist.isPending && sectionInWaitlist.isWaitListPending) {
                                            sections[sectionInWaitlist.id] = sectionInWaitlist.creditType || sectionInWaitlist.defaultCreditType;
                                        }
                                    });
                                block.studentSchedule[ScheduleListType.Cart]
                                    .filter(s => !s.hideActions && !s.isLoading)
                                    .forEach(sectionInCart => {
                                        sections[sectionInCart.id] = sectionInCart.creditType || sectionInCart.defaultCreditType;
                                    });
                            }
                        }
                    }
                });
            }

            if (enableRegister) {
                if (mySchedule
                    && (mySchedule[ScheduleListType.Waitlist] || mySchedule[ScheduleListType.Cart])) {
                    if (selectedPeriod) {
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
        }
        catch (e) {
            this.logError(LogData.fromException(this.getSectionsToRegister.name, e));
        }
        return sections;
    };

    private reloadPartiallyScheduleList = (): void => {
        try {
            const {
                countActions,
                selectedPeriod
            } = this.state;

            if (selectedPeriod && countActions === 1) {
                this.abortSchedule.abort();
                this.abortSchedule = new AbortController();

                this.setState({
                    errorLoadingScheduleList: false
                }, () => Requests.postScheduleList(
                    selectedPeriod,
                    this.resolvePostScheduleList,
                    this.logErrorScheduleList,
                    this.abortSchedule.signal)
                );
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.reloadPartiallyScheduleList.name, e));
        }
    };

    private reloadScheduleList = (): void => {
        try {
            const {
                selectedPeriod
            } = this.state;

            if (selectedPeriod) {
                this.abortSchedule.abort();
                this.abortSchedule = new AbortController();

                this.setState({
                    errorLoadingScheduleList: false,
                    isLoadingScheduleList: true
                }, () => Requests.postScheduleList(
                    selectedPeriod,
                    this.resolvePostScheduleList,
                    this.logErrorScheduleList,
                    this.abortSchedule.signal)
                );
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.reloadScheduleList.name, e));
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

    private setGroupAndBlockStatus = (): void => {
        try {
            const {
                blockRegistrationRule,
                myBlockSchedule,
                ruleGroupBlocks
            } = this.state;

            let foundBlock: IBlockStudentSchedule | undefined;
            if (blockRegistrationRule && blockRegistrationRule.blockRegRuleGroups) {
                blockRegistrationRule.blockRegRuleGroups.forEach(group => {
                    group.status = BlockRegRuleGroupStatus.None;
                    if (myBlockSchedule
                        && (foundBlock =
                            myBlockSchedule.find(b => b.blockRegistrationRuleGroupId === group.blockRegistrationRuleGroupId))) {
                        switch (foundBlock.status) {
                            case BlockRegBlockStatus.Completed:
                                group.status = BlockRegRuleGroupStatus.Completed;
                                break;
                            case BlockRegBlockStatus.Processing:
                                group.status = BlockRegRuleGroupStatus.Processing;
                                break;
                        }
                    }
                });
            }
            if (ruleGroupBlocks) {
                ruleGroupBlocks.forEach(block => {
                    block.status = BlockRegBlockStatus.None;
                    if (myBlockSchedule
                        && (foundBlock =
                            myBlockSchedule.find(b => b.blockRegRuleGroupBlockId === block.blockRegRuleGroupBlockId))) {
                        block.status = foundBlock.status;
                    }
                });
            }

            this.setState({
                blockRegistrationRule: blockRegistrationRule,
                myBlockSchedule: myBlockSchedule,
                ruleGroupBlocks: ruleGroupBlocks
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.setGroupAndBlockStatus.name, e));
        }
    };

    private setWarningsMySchedule = (): void => {
        try {
            const {
                hasAcademicInfo,
                isOnStopList,
                periodsForRegistration,
                periodsForSearch,
                selectedPeriod,
                resources
            } = this.state;

            let warningsMySchedule: string | undefined;
            let enableCart: boolean = false;
            let enableRegister: boolean = false;

            let periodFound: IRadioOption | undefined;
            let periodStatus: IPeriodStatus;
            if (resources) {
                if (periodsForRegistration
                    && periodsForRegistration.length > 0
                    && (periodFound = periodsForRegistration.find(pr => pr.value === selectedPeriod))) {
                    periodStatus = periodFound.complement;
                    enableCart = true;
                    enableRegister = false;
                    switch (periodStatus.status) {
                        case PeriodAuthorizationStatus.NoRegGroupFound:
                            warningsMySchedule = resources.periodLongStatus.lblNoRegGroupFound;
                            break;
                        case PeriodAuthorizationStatus.AdvisorAuthNeeded:
                            warningsMySchedule = resources.periodLongStatus.lblAdvisorAuthNeeded;
                            break;
                        case PeriodAuthorizationStatus.PeriodEnded:
                            enableCart = false;
                            warningsMySchedule = Format.toString(resources.periodLongStatus.formatPeriodEnded,
                                [periodStatus.lastRegistrationDate]);
                            break;
                        case PeriodAuthorizationStatus.NoAdvisorAssigned:
                            warningsMySchedule = resources.periodLongStatus.lblNoAdvisorAssigned;
                            break;
                        case PeriodAuthorizationStatus.PeriodNotOpen:
                            warningsMySchedule = Format.toString(resources.periodLongStatus.formatPeriodNotOpen,
                                [periodStatus.preRegistrationDate]);
                            break;
                        case PeriodAuthorizationStatus.PeriodNotOpenAuthNeeded:
                            warningsMySchedule = Format.toString(resources.periodLongStatus.formatPeriodNotOpenAuthNeeded,
                                [periodStatus.preRegistrationDate]);
                            break;
                        case PeriodAuthorizationStatus.RegistrationAuthorized:
                            enableRegister = true;
                            break;
                    }
                    if (isOnStopList || !hasAcademicInfo) {
                        enableRegister = false;
                    }
                }
                else if (periodsForSearch
                    && periodsForSearch.length > 0
                    && (periodFound = periodsForSearch.find(pr => pr.value === selectedPeriod))) {
                    warningsMySchedule = resources.periodLongStatus.lblOnlySearch;
                }
            }

            this.setState({
                enableCart: enableCart,
                enableRegister: enableRegister,
                warningsMySchedule: warningsMySchedule
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.setWarningsMySchedule.name, e));
        }
    };

    private validateAnotherAmount(value: string): boolean {
        let isValid: boolean = false;
        let numberTest: number;
        if (value.match(/^(\d+\.?\d{0,2}|\.\d{1,2})$/g)) {
            isValid = true;
        }
        if (isValid) {
            numberTest = Number(value);
            isValid = !(isNaN(numberTest)) && numberTest > 0;
        }
        return isValid;
    }

    private viewBlockDetails = (): void => {
        try {
            const {
                blockModalOpen,
                myBlockSchedule,
                selectedBlockId,
                selectedGroupId,
                selectedYearTerm
            } = this.state;

            if (blockModalOpen) {
                let selectedBlockIndex: number | undefined;

                if (myBlockSchedule && selectedBlockId) {
                    selectedBlockIndex = myBlockSchedule.findIndex(b => b.blockRegRuleGroupBlockId === selectedBlockId);
                    if (selectedBlockIndex === undefined || selectedBlockIndex < 0) {
                        selectedBlockIndex = undefined;
                    }
                }

                this.setState({
                    selectedBlockIndex: selectedBlockIndex
                });

                if (selectedYearTerm && selectedGroupId && selectedBlockId) {
                    Requests.getBlock(selectedGroupId, selectedBlockId, selectedYearTerm, this.resolveGetBlockToRefresh, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.viewBlockDetails.name, e));
        }
    };
    // #endregion Cart

    // #region Search
    // By Block
    private setRule = (): void => {
        try {
            const {
                selectedYearTerm
            } = this.state;

            if (selectedYearTerm) {
                this.showLoaderRule();
                this.setState({
                    blockRegistrationRule: undefined,
                    ruleGroupBlocks: undefined,
                    selectedRuleGroup: undefined,
                    waitForSchedule: true
                });
                Requests.getRule(selectedYearTerm, this.resolveGetRule, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setRule.name, e));
        }
    };

    private setBlocks = (): void => {
        try {
            const {
                selectedRuleGroup,
                selectedYearTerm,
                silentBlocksUpdate
            } = this.state;

            if (selectedRuleGroup && selectedYearTerm) {
                if (!silentBlocksUpdate) {
                    this.showLoaderBlocks();
                }
                this.abortBlocks.abort();
                this.abortBlocks = new AbortController();
                Requests.getBlocks(selectedRuleGroup.blockRegistrationRuleGroupId, selectedYearTerm,
                    this.resolveGetBlocks, this.logError, this.abortBlocks.signal);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setBlocks.name, e));
        }
    };

    private setBlocksSilent = (silent: boolean): void => {
        try {
            this.setState({ silentBlocksUpdate: silent }, () => {
                this.setBlocks();
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.setBlocksSilent.name, e));
        }
    };

    private silentUpdate = (byUser: boolean): void => {
        try {
            const {
                searchView,
                sectionSearchType,
                switchSearchView
            } = this.state;

            if (searchView === 'section') {
                if (sectionSearchType === SectionSearchType.Basic) {
                    this.basicSearchSilent(!byUser);
                }
                else if (sectionSearchType === SectionSearchType.Advanced) {
                    this.advancedSearchSilent(!byUser);
                }
                if (switchSearchView && !byUser) {
                    this.setState({
                        requestAfterSwitch: true
                    });
                }
            }
            else if (searchView === 'block') {
                this.setBlocksSilent(!byUser);
                if (switchSearchView && !byUser) {
                    this.setState({
                        requestAfterSwitch: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.silentUpdate.name, e));
        }
    };

    // By Section
    private advancedSearch = (values: IAdvancedSearch): void => {
        try {
            const {
                silentSectionsUpdate
            } = this.state;

            if (values) {
                if (!silentSectionsUpdate) {
                    this.showLoaderSectionSearch();
                }
                this.abortSearch.abort();
                this.abortSearch = new AbortController();
                Requests.postAdvancedSearchOptions(values, this.resolveGetSections, this.logError, this.abortSearch.signal);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.advancedSearch.name, e));
        }
    };

    private advancedSearchSilent = (silent: boolean): void => {
        try {
            const {
                advancedSearchSelectedAfterSearch
            } = this.state;
            this.setState({ silentSectionsUpdate: silent }, () => {
                this.advancedSearch(advancedSearchSelectedAfterSearch);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.advancedSearchSilent.name, e));
        }
    };

    private basicSearch = (keywords?: string): void => {
        try {
            const {
                selectedPeriod,
                silentSectionsUpdate
            } = this.state;

            if (selectedPeriod) {
                if (keywords) {
                    if (!silentSectionsUpdate) {
                        this.showLoaderSectionSearch();
                    }
                    this.abortSearch.abort();
                    this.abortSearch = new AbortController();
                    Requests.postSections(keywords, selectedPeriod, this.resolveGetSections, this.logError, this.abortSearch.signal);
                }
                else {
                    this.setState({
                        dirtySearch: true,
                        keywords: '',
                        sections: undefined
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.basicSearch.name, e));
        }
    };

    private basicSearchSilent = (silent: boolean): void => {
        try {
            const {
                keywordsAfterSearch
            } = this.state;
            this.setState({ silentSectionsUpdate: silent }, () => {
                this.basicSearch(keywordsAfterSearch);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.basicSearchSilent.name, e));
        }
    };
    // #endregion Search

    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingBlocks: false,
            isLoadingPeriods: false,
            isLoadingRule: false,
            isLoadingScheduleList: false,
            isLoadingSectionSearch: false
        });
    };

    private hideLoaderBlocks = (): void => {
        this.setState({
            isLoadingBlocks: false
        });
    };

    private hideLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: false
        });
    };

    private hideLoaderRule = (): void => {
        this.setState({
            isLoadingRule: false
        });
    };

    private hideLoaderSectionSearch = (): void => {
        this.setState({
            isLoadingSectionSearch: false
        });
    };

    private showLoaderBlocks = (): void => {
        this.setState({
            isLoadingBlocks: true
        });
    };

    private showLoaderPeriods = (): void => {
        this.setState({
            isLoadingPeriods: true
        });
    };

    private showLoaderRule = (): void => {
        this.setState({
            isLoadingRule: true
        });
    };

    private showLoaderSectionSearch = (): void => {
        this.setState({
            isLoadingSectionSearch: true
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
    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    myBlockSchedule,
                    mySchedule,
                    sectionDetailView
                } = this.state;

                const section: ISectionDetail | undefined = result.data;

                // Status for section detail modal
                let sectionInSchedule: IStudentSchedule | undefined;
                if (section) {
                    section.hasBlockRelated = sectionDetailView === 'block';
                    if (myBlockSchedule) {
                        myBlockSchedule.forEach(block => {
                            if (block.studentSchedule) {
                                block.studentSchedule.forEach(sectionList => {
                                    sectionList.forEach(sectionInList => {
                                        if (!Boolean(sectionInSchedule) && sectionInList.id === section.id) {
                                            sectionInSchedule = sectionInList;
                                        }
                                    });
                                });
                            }
                        });
                    }
                    if (!Boolean(sectionInSchedule) && mySchedule) {
                        mySchedule.forEach(sectionList => {
                            sectionList.forEach(sectionInList => {
                                if (!Boolean(sectionInSchedule) && sectionInList.id === section.id) {
                                    sectionInSchedule = sectionInList;
                                }
                            });
                        });
                    }
                }

                if (sectionInSchedule && section) {
                    section.hasBlockRelated = sectionInSchedule.hasBlockRelated;
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
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
        }
    };

    private resolveLayoutReady = (): void => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                LayoutActions.showPageLoader();
                this.showLoaderPeriods();
                document.title = resources.lblPageTitle;
                const hdnYearTerm: HTMLInputElement | undefined =
                    document.getElementById('hdnYearTerm') as HTMLInputElement;
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
                if (hdnYearTerm && hdnYearTerm.value) {
                    this.setState({
                        defaultPeriod: hdnYearTerm.value
                    });
                    hdnYearTerm.remove();
                }
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
                Requests.getPeriods(this.resolveGetPeriods, this.logError);
                Requests.getAdvancedSearchOptions(this.resolveGetAdvancedSearchOptions, this.logError);
            }
            else {
                this.logError(LogData.noResources(this.resolveLayoutReady.name));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveLayoutReady.name, e));
        }
    };

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
                else {
                    const {
                        resources
                    } = this.state;
                    const registrationValidation: IRegistrationValidation = result.data.registrationValidation;

                    if (resources && registrationValidation?.isSuccessful) {
                        LayoutActions.setAlert({
                            content: (
                                <>
                                    <Text>
                                        {registrationValidation.message}
                                    </Text>
                                    <Button
                                        id="btnViewRegistrationSummary"
                                        variant="text"
                                        textVariantStyling="inherit"
                                        onClick={this.onOpenRegistrationSummaryModal}>
                                        {resources.btnViewRegistrationSummary}
                                    </Button>
                                </>
                            ),
                            messageType: ResultType.warning
                        } as IAlert);

                        this.setState({
                            registrationLogId: registrationValidation.registrationLogId,
                            registrationSummary: undefined,
                            registrationValidation: registrationValidation,
                            validationMessagesModalOpen: false
                        });

                        this.silentUpdate(false);
                        this.reloadScheduleList();
                    }
                    else {
                        this.setState({
                            registrationValidation: registrationValidation,
                            validationMessagesModalOpen: registrationValidation && !registrationValidation.isSuccessful
                        });
                    }
                }
                LayoutActions.hidePageLoader();
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
                LayoutActions.hidePageLoader();
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
                    blockDetail,
                    blockModalOpen,
                    blockRegistrationRule,
                    isLoadingScheduleList,
                    myBlockSchedule,
                    mySchedule,
                    selectedBlockId,
                    selectedBlockIndex,
                    waitForSchedule
                } = this.state;

                LayoutActions.getCountCart();

                const myBlockScheduleChanged: IBlockStudentSchedule[] | undefined = this.getMyBlockScheduleStatus(result.data.blockStudentSchedule);
                let myScheduleChanged: IStudentSchedule[][] | undefined = result.data.studentSchedule;

                if (!isLoadingScheduleList) {
                    // Preserve loaders for sections in blocks
                    if (myBlockSchedule && myBlockScheduleChanged) {
                        let myScheduleTemp: IStudentSchedule[][] | undefined;
                        let blockChanged: IBlockStudentSchedule | undefined;
                        const blocksLoading: IBlockStudentSchedule[] = [];

                        myBlockSchedule.forEach(block => {
                            if ((blockChanged = myBlockScheduleChanged.find(b => b.blockRegRuleGroupBlockId === block.blockRegRuleGroupBlockId))) {
                                // Preserve expanded status
                                blockChanged.expanded = block.expanded;
                                myScheduleTemp = this.getMyNewSchedule(block.studentSchedule, blockChanged.studentSchedule);
                                if (myScheduleTemp) {
                                    blockChanged.studentSchedule = myScheduleTemp;
                                }
                                else {
                                    blockChanged.studentSchedule = [[], [], [], [], []];
                                }
                            }
                            else if (block.isLoading) {
                                blocksLoading.push(block);
                            }
                        });

                        // Preserve loaders for blocks
                        for (let i = blocksLoading.length - 1; i === 0; i--) {
                            myBlockScheduleChanged.unshift(blocksLoading[i]);
                        }
                    }

                    // Preserve loaders for sections
                    myScheduleChanged = this.getMyNewSchedule(mySchedule, myScheduleChanged, myBlockScheduleChanged);
                }

                // Update list for block details if the modal is open
                if (blockModalOpen && myBlockScheduleChanged && selectedBlockIndex !== undefined) {
                    if (selectedBlockIndex < myBlockScheduleChanged.length && selectedBlockId && myBlockScheduleChanged[selectedBlockIndex].blockRegRuleGroupBlockId === selectedBlockId) {
                        const blockDetailChanged: IBlockRegRuleGroup | undefined = this.getFilteredBlockSections(blockDetail, myBlockScheduleChanged[selectedBlockIndex]);
                        this.setState({
                            blockDetail: blockDetailChanged
                        });
                    }
                    else {
                        const blockDetailChanged: IBlockRegRuleGroup | undefined = this.getFilteredBlockSections(blockDetail);
                        this.setState({
                            blockDetail: blockDetailChanged,
                            selectedBlockIndex: undefined
                        });
                    }
                }

                // Remove cart courses if the ruie is block only
                if (waitForSchedule && myScheduleChanged
                    && myScheduleChanged[ScheduleListType.Cart] && myScheduleChanged[ScheduleListType.Cart].length > 0
                    && blockRegistrationRule && blockRegistrationRule.isBlockRegistrationOnly) {
                    const sections: number[] = myScheduleChanged[ScheduleListType.Cart].map(s => s.id);
                    Requests.postRemoveCartSections(sections, this.resolvePostRemoveCartSections, this.logError);
                }
                else {
                    this.setState({
                        waitForSchedule: false
                    });
                }

                this.setState({
                    myBlockSchedule: myBlockScheduleChanged,
                    mySchedule: myScheduleChanged
                }, () => {
                    this.setGroupAndBlockStatus();
                    this.viewBlockDetails();
                    this.setState({
                        isLoadingScheduleList: false
                    });
                });
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

                LayoutActions.hidePageLoader();

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
                    LayoutActions.hidePageLoader();
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

    private resolvePostRemoveBlock = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostRemoveBlock.name, this.hideAllLoaders);
            if (result?.status) {
                this.silentUpdate(false);
                this.reloadScheduleList();
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostRemoveBlock.name, e));
        }
    };

    private resolvePostRemoveCartSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostRemoveCartSections.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    mySchedule,
                    resources
                } = this.state;

                if (result.data && resources) {
                    LayoutActions.setAlert({
                        message: resources.lblCartSectionsRemoved,
                        messageType: ResultType.warning
                    } as IAlert);
                }

                if (mySchedule) {
                    mySchedule[ScheduleListType.Cart] = [];
                }

                this.setState({
                    mySchedule: mySchedule,
                    waitForSchedule: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostRemoveCartSections.name, e));
        }
    };

    private resolvePostRemoveFromCart = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostRemoveFromCart.name, this.hideAllLoaders);
            if (result?.status) {
                const id: number = result.data;
                this.removeCard(id);
                // LayoutActions.getCountCart();
                this.silentUpdate(false);
                this.reloadPartiallyScheduleList();
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
                if (sections && id > 0) {
                    const sectionFound: ISection | undefined = sections.find(s => s.id === id);
                    if (sectionFound) {
                        sectionFound.seatsWaiting++;
                        this.setState({
                            sections: sections
                        });
                    }
                }
                // LayoutActions.getCountCart();
                this.silentUpdate(false);
                this.reloadPartiallyScheduleList();
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
                const {
                    resources
                } = this.state;
                const registrationValidation: IRegistrationValidation = result.data.registrationValidation;

                if (registrationValidation && registrationValidation.isSuccessful) {
                    // Verify online payment
                    const enableOnlinePayment: boolean = result.data.enableOnlinePayment;
                    const paymentInfo: IPaymentInfo = result.data.paymentInfo;
                    let paymentMethod: string = '1';
                    if (paymentInfo) {
                        paymentInfo.anotherAmount = paymentInfo.totalAmountValue.toString();
                        paymentInfo.canPay = true;
                        paymentMethod = paymentInfo.currentBalanceValue <= 0 ? '0' : '1';
                    }

                    this.setState({
                        enableOnlinePayment: enableOnlinePayment,
                        paymentDetailModalOpen: Boolean(paymentInfo),
                        paymentInfo: paymentInfo,
                        paymentMethod: paymentMethod,
                        registrationLogId: registrationValidation.registrationLogId,
                        registrationSummary: undefined,
                        registrationValidation: registrationValidation,
                        validationMessagesModalOpen: false
                    }, () => {
                        if (!Boolean(paymentInfo) && resources) {
                            LayoutActions.setAlert({
                                content: (
                                    <>
                                        <Text>
                                            {registrationValidation.message}
                                        </Text>
                                        <Button
                                            id="btnViewRegistrationSummary"
                                            variant="text"
                                            textVariantStyling="inherit"
                                            onClick={this.onOpenRegistrationSummaryModal}>
                                            {resources.btnViewRegistrationSummary}
                                        </Button>
                                    </>
                                ),
                                messageType: ResultType.warning
                            } as IAlert);
                        }
                    });

                    this.silentUpdate(false);
                    this.reloadScheduleList();
                }
                else {
                    this.setState({
                        registrationValidation: registrationValidation,
                        validationMessagesModalOpen: registrationValidation && !registrationValidation.isSuccessful
                    });
                    this.silentUpdate(false);
                    this.reloadScheduleList();
                }

                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logErrorScheduleList(LogData.fromException(this.resolvePostStudentRegistration.name, e));
        }
    };
    // #endregion Cart

    // #region Registration validation
    private resolveGetRegistrationSummary = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRegistrationSummary.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    registrationSummary: result.data,
                    registrationSummaryModalOpen: true
                });
                LayoutActions.setAlert(undefined);
            }
            LayoutActions.hidePageLoader();
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRegistrationSummary.name, e));
        }
    };
    // #endregion Registration validation

    // #region Search
    private resolveGetPeriods = (json: string): void => {
        try {
            const {
                defaultPeriod,
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data?.defaultPeriod) {
                    let agreementStatus = false;
                    const period: IRadioOption = {
                        description: result.data.defaultPeriod.description,
                        value: result.data.defaultPeriod.value
                    };

                    const periodsForRegistration: IRadioOption[] = result.data.periodsForRegistration;
                    const periodsForSearch: IRadioOption[] = result.data.periodsForSearch;

                    let periodStatus: IPeriodStatus;
                    let message: string;
                    if (periodsForRegistration && periodsForRegistration.length > 0) {
                        periodsForRegistration.forEach(pr => {
                            // Search Year/Term from cart
                            if (defaultPeriod && pr.value === defaultPeriod) {
                                period.description = pr.description;
                                period.value = pr.value;
                            }
                        });
                        periodsForRegistration.forEach(pr => {
                            if (pr.complement) {
                                periodStatus = pr.complement;
                                if (pr.value === period.value) {
                                    agreementStatus = periodStatus.peopleAgreementStatus;
                                }

                                // Status by period
                                if (resources) {
                                    switch (periodStatus.status) {
                                        case PeriodAuthorizationStatus.NoRegGroupFound:
                                            message = resources.periodShortStatus.lblNoRegGroupFound;
                                            break;
                                        case PeriodAuthorizationStatus.AdvisorAuthNeeded:
                                            message = resources.periodShortStatus.lblAdvisorAuthNeeded;
                                            break;
                                        case PeriodAuthorizationStatus.PeriodEnded:
                                            message = Format.toString(resources.periodShortStatus.formatPeriodEnded,
                                                [periodStatus.lastRegistrationDate]);
                                            break;
                                        case PeriodAuthorizationStatus.NoAdvisorAssigned:
                                            message = resources.periodShortStatus.lblNoAdvisorAssigned;
                                            break;
                                        case PeriodAuthorizationStatus.PeriodNotOpen:
                                            message = Format.toString(resources.periodShortStatus.formatPeriodNotOpen,
                                                [periodStatus.preRegistrationDate]);
                                            break;
                                        case PeriodAuthorizationStatus.PeriodNotOpenAuthNeeded:
                                            message = resources.periodShortStatus.formatPeriodNotOpenAuthNeeded;
                                            break;
                                        default:
                                            message = '';
                                    }
                                    if (message) {
                                        pr.nodeComplement = (
                                            <StatusLabel
                                                id={`stl${pr.value}`}
                                                text={message}
                                                type="draft"
                                            />
                                        );
                                    }
                                }
                            }
                        });
                    }

                    if (periodsForSearch && periodsForSearch.length > 0) {
                        periodsForSearch.forEach(pr => {
                            // Search Year/Term from cart
                            if (defaultPeriod && pr.value === defaultPeriod) {
                                period.description = pr.description;
                                period.value = pr.value;
                            }
                        });
                    }

                    const enableBlockRegistration: boolean = result.data.enableBlockRegistration;

                    // Set Year/Term
                    const periodParts: string[] = period.value.toString().split('/');
                    const yearTerm: IYearTerm = {
                        term: periodParts[1],
                        year: Number(periodParts[0])
                    };
                    this.setState({
                        agreement: result.data.agreement,
                        agreementStatus: agreementStatus,
                        enableBlockRegistration: enableBlockRegistration,
                        hasAcademicInfo: result.data.hasAcademicInfo,
                        isLoading: false,
                        isOnStopList: result.data.isOnStopList,
                        periodsForRegistration: periodsForRegistration,
                        periodsForSearch: periodsForSearch,
                        searchView: 'section',
                        selectedPeriod: period.value.toString(),
                        selectedPeriodModal: period.value.toString(),
                        selectedPeriodText: period.description,
                        selectedYearTerm: yearTerm,
                        switchSearchView: false
                    }, () => {
                        if (enableBlockRegistration) {
                            this.setRule();
                        }
                        this.hideLoaderPeriods();
                        LayoutActions.hidePageLoader();
                        this.reloadScheduleList();
                        this.setWarningsMySchedule();
                    });
                }
                else {
                    this.setState({
                        isLoading: false
                    }, () => {
                        this.hideLoaderPeriods();
                        LayoutActions.hidePageLoader();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    // By Section
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

    private resolveGetSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name, this.hideAllLoaders);
            if (result?.status) {
                const sections: ISection[] | undefined = result.data;
                if (this.state.silentSectionsUpdate) {
                    this.setState({
                        sections: sections
                    });
                }
                else {
                    this.setState({
                        advancedSearchModalOpen: false,
                        dirtySearch: true,
                        sections: sections
                    }, this.hideLoaderSectionSearch);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };

    // By Block
    private resolveGetBlock = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlock.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    blockRegistrationRule,
                    myBlockSchedule,
                    selectedBlockIndex,
                    selectedGroupId
                } = this.state;

                let blockDetailChanged: IBlockRegRuleGroup | undefined = result.data;
                if (blockDetailChanged) {
                    let groupBlockDetail: IBlockRegistrationRuleGroup | undefined;
                    blockDetailChanged.status = myBlockSchedule
                        && selectedBlockIndex !== undefined ? myBlockSchedule[selectedBlockIndex].status : BlockRegBlockStatus.None;
                    blockDetailChanged.sectionList.forEach(section => {
                        section.hasBlockRelated = true;
                        section.isSelected = true;
                    });
                    if (blockRegistrationRule && blockRegistrationRule.blockRegRuleGroups && selectedGroupId) {
                        groupBlockDetail = blockRegistrationRule.blockRegRuleGroups
                            .find(g => g.blockRegistrationRuleGroupId === selectedGroupId);
                    }
                    blockDetailChanged = this.getFilteredBlockSections(blockDetailChanged,
                        myBlockSchedule && selectedBlockIndex !== undefined ? myBlockSchedule[selectedBlockIndex] : undefined);
                    this.setState({
                        blockDetail: blockDetailChanged,
                        blockModalOpen: true,
                        groupBlockDetail: groupBlockDetail
                    }, LayoutActions.hidePageLoader);
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBlock.name, e));
        }
    };

    private resolveGetBlockToRefresh = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlockToRefresh.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    blockDetail,
                    myBlockSchedule,
                    selectedBlockIndex
                } = this.state;

                let blockDetailChanged: IBlockRegRuleGroup | undefined = result.data;
                if (blockDetailChanged && blockDetail) {
                    let foundSection: ISection | undefined;
                    blockDetail.sectionList.forEach(section => {
                        if (blockDetailChanged && (foundSection = blockDetailChanged.sectionList.find(s => s.id === section.id))) {
                            section.isCartable = foundSection.isCartable;
                            section.isWaitable = foundSection.isWaitable;
                            section.seatsLeft = foundSection.seatsLeft;
                            section.maximumSeats = foundSection.maximumSeats;
                            section.seatsWaiting = foundSection.seatsWaiting;
                        }
                    });

                    blockDetailChanged = this.getFilteredBlockSections(blockDetail,
                        myBlockSchedule && selectedBlockIndex !== undefined ? myBlockSchedule[selectedBlockIndex] : undefined);
                    this.setState({
                        blockDetail: blockDetailChanged
                    }, LayoutActions.hidePageLoader);
                }
                else {
                    LayoutActions.hidePageLoader();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBlockToRefresh.name, e));
        }
    };

    private resolveGetBlocks = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlocks.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    ruleGroupBlocks
                } = this.state;

                const ruleGroupBlocksChanged: IBlockRegRuleGroup[] | undefined = result.data;
                if (ruleGroupBlocksChanged) {
                    let foundRuleBlock: IBlockRegRuleGroup | undefined;
                    let foundSection: ISection | undefined;
                    ruleGroupBlocksChanged.forEach(block => {
                        block.status = BlockRegBlockStatus.Unset;
                        if (block.blockRegistrationGroup.allowChanges && ruleGroupBlocks) {
                            foundRuleBlock = ruleGroupBlocks.find(b => b.blockRegRuleGroupBlockId === block.blockRegRuleGroupBlockId);
                        }
                        block.sectionList.forEach(section => {
                            section.hasBlockRelated = true;
                            if (foundRuleBlock) {
                                foundSection = foundRuleBlock.sectionList.find(s => s.id === section.id);
                            }
                            section.isSelected = foundSection ? foundSection.isSelected : true;
                            foundSection = undefined;
                        });
                        foundRuleBlock = undefined;
                    });
                }

                if (this.state.silentBlocksUpdate) {
                    this.setState({
                        ruleGroupBlocks: ruleGroupBlocksChanged
                    }, this.setGroupAndBlockStatus);
                }
                else {
                    this.setState({
                        ruleGroupBlocks: ruleGroupBlocksChanged
                    }, () => {
                        this.setGroupAndBlockStatus();
                        this.hideLoaderBlocks();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBlocks.name, e));
        }
    };

    private resolveGetRule = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRule.name, this.hideAllLoaders);
            if (result?.status) {
                const {
                    enableBlockRegistration,
                    searchView
                } = this.state;

                const blockRegistrationRule: IBlockRegistrationRuleDetail = result.data;

                const switchSearchView: boolean = (enableBlockRegistration
                    && blockRegistrationRule
                    && !blockRegistrationRule.isBlockRegistrationOnly
                    && blockRegistrationRule.blockRegRuleGroups
                    && blockRegistrationRule.blockRegRuleGroups.length > 0);

                let searchViewChanged: SearchViewType | undefined = searchView;
                if (!blockRegistrationRule
                    || (blockRegistrationRule
                        && !blockRegistrationRule.isBlockRegistrationOnly
                        && ((!blockRegistrationRule.blockRegRuleGroups
                            || blockRegistrationRule.blockRegRuleGroups.length <= 0)))) {
                    searchViewChanged = 'section';
                }
                else if (enableBlockRegistration
                    && blockRegistrationRule
                    && (blockRegistrationRule.isBlockRegistrationOnly
                        || (!blockRegistrationRule.isBlockRegistrationOnly
                            && blockRegistrationRule.blockRegRuleGroups
                            && blockRegistrationRule.blockRegRuleGroups.length > 0))) {
                    searchViewChanged = 'block';
                }

                if (blockRegistrationRule?.blockRegRuleGroups) {
                    blockRegistrationRule.blockRegRuleGroups.forEach(group => group.status = BlockRegRuleGroupStatus.Unset);
                }

                this.setState({
                    blockRegistrationExpanded: true,
                    blockRegistrationRule: blockRegistrationRule,
                    searchView: searchViewChanged,
                    switchSearchView: switchSearchView
                }, () => {
                    this.setGroupAndBlockStatus();
                    this.hideLoaderRule();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRule.name, e));
        }
    };
    // #endregion Search

    // #endregion Resolvers

    // #region State Management Events
    private onLayoutReady = (): void => {
        const ready: boolean = LayoutStore.getLayoutReady();
        const resources: ICoursesRes | undefined = LayoutStore.getResources();
        const cultures: ICultures = LayoutStore.getCultures();
        if (ready) {
            this.setState({
                cultures: cultures,
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
        this.abortBlocks.abort();
        this.abortBlocks = new AbortController();
        this.abortSchedule.abort();
        this.abortSchedule = new AbortController();
        this.abortSearch.abort();
        this.abortSearch = new AbortController();
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
            classes,
            width
        } = this.props;

        const {
            blockDetail,
            blockModalOpen,
            componentError,
            cultures,
            groupBlockDetail,
            hasAcademicInfo,
            isLoading,
            isOnStopList,
            resources,
            sectionDetail,
            sectionModalOpen,
            showDeniedCourses,

            // #region Agreement
            agreement,
            agreementMandatory,
            agreementModalOpen,
            agreementStatus,
            // #endregion Agreement

            // #region Cart
            blockToDrop,
            countActions,
            creditTypeModalOpen,
            creditTypeSelected,
            dropBlockDialogOpen,
            dropDialogOpen,
            enableCart,
            enableRegister,
            errorLoadingScheduleList,
            isLoadingScheduleList,
            myBlockSchedule,
            mySchedule,
            permissionRequestModalOpen,
            sectionSelected,
            selectedBlockIndex,
            viewCommentsAnchor,
            waitForSchedule,
            warningsMySchedule,

            // Registration validation
            registrationSummary,
            registrationSummaryModalOpen,
            registrationValidation,
            validationMessagesModalOpen,
            // #endregion Cart

            // #region Payment
            enableOnlinePayment,
            paymentDetailModalOpen,
            paymentInfo,
            paymentMethod,
            paymentModalOpenFail,
            paymentModalOpenProcess,
            paymentModalOpenSuccess,
            paymentTransaction,
            // #endregion Payment

            // #region Search
            isLoadingPeriods,
            periodsForRegistration,
            periodsForSearch,
            periodsModalOpen,
            searchView,
            selectedPeriod,
            selectedPeriodModal,
            selectedPeriodText,
            switchSearchView,

            // By Section
            advancedSearchModalOpen,
            advancedSearchOptions,
            advancedSearchSelected,
            dirtySearch,
            isLoadingSectionSearch,
            keywords,
            sections,

            // By Block
            blockRegistrationExpanded,
            blockRegistrationRule,
            isLoadingBlocks,
            isLoadingRule,
            ruleGroupBlocks,
            selectedRuleGroup
            // #endregion Search
        } = this.state;

        // #region Payment modals
        let processPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenProcess && paymentInfo && paymentInfo.canPay) {
            processPaymentModal = (
                <ProcessPaymentModal
                    amount={paymentMethod === '0' ?
                        Number(paymentInfo.anotherAmount)
                        : (paymentMethod === '1' ?
                            paymentInfo.currentBalanceValue
                            : paymentInfo.totalAmountValue)}
                    open={paymentDetailModalOpen}
                    paymentOrigin={PaymentOrigin.Registration}
                    yearTerm={selectedPeriod}
                    onClose={this.onClosePaymentModalProcess}
                />
            );
        }

        let successfulPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenSuccess) {
            successfulPaymentModal = (
                <SuccessfulPaymentModal
                    open={paymentModalOpenSuccess}
                    paymentOrigin={PaymentOrigin.Registration}
                    paymentTransaction={paymentTransaction}
                    yearTerm={selectedPeriod}
                    onClose={this.onClosePaymentModalSuccess}
                />
            );
        }

        let failedPaymentModal: JSX.Element | undefined;
        if (paymentModalOpenFail) {
            failedPaymentModal = (
                <FailedPaymentModal
                    open={paymentModalOpenFail}
                    paymentOrigin={PaymentOrigin.Registration}
                    yearTerm={selectedPeriod}
                    onClose={this.onClosePaymentModalFail}
                />
            );
        }
        // #endregion Payment modals

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {
            if (!isLoading) {
                if (selectedPeriod && selectedPeriodText) {
                    // #region Periods Modal
                    let periodsModalSection: JSX.Element | undefined;
                    if (periodsModalOpen && (periodsForRegistration || periodsForSearch)) {
                        periodsModalSection = (
                            <PeriodsModal
                                disableSelect={countActions > 0}
                                open={periodsModalOpen}
                                periodsForRegistration={periodsForRegistration}
                                periodsForSearch={periodsForSearch}
                                resources={resources.periodsModal}
                                selectedPeriod={selectedPeriodModal}
                                onChangePeriod={this.onChangePeriod}
                                onClose={this.onClosePeriodsModal}
                                onSelect={this.onSelectPeriod}
                            />
                        );
                    }
                    // #endregion Periods Modal

                    // #region Advanced Search Modal
                    let sectionsOptionsModal: JSX.Element | undefined;
                    if (advancedSearchModalOpen && advancedSearchOptions) {
                        sectionsOptionsModal = (
                            <AdvancedSearchModal
                                advancedSearchSelected={advancedSearchSelected}
                                data={advancedSearchOptions}
                                dateTimeCulture={cultures.dateTimeCulture}
                                isConEd={false}
                                isLoadingSectionSearch={isLoadingSectionSearch}
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

                    // #region Block Details
                    let blockModal: JSX.Element | undefined;
                    if (blockModalOpen && blockDetail && groupBlockDetail) {
                        blockModal = (
                            <BlockDetailModal
                                countActions={countActions}
                                block={blockDetail}
                                enableCart={enableCart}
                                errorLoading={errorLoadingScheduleList}
                                groupDisplayName={groupBlockDetail ?
                                    groupBlockDetail.displayName : ''}
                                groupStatus={groupBlockDetail ?
                                    groupBlockDetail.status : BlockRegRuleGroupStatus.Unset}
                                isLoading={isLoadingScheduleList}
                                open={blockModalOpen}
                                resources={resources.blockDetailModal}
                                SectionCardProps={{
                                    currencySymbol: cultures.currencySymbol,
                                    numberCulture: cultures.numberCulture,
                                    resources: resources.sectionCard,

                                    onDrop: this.onOpenDropDialog,
                                    onOpenCreditTypeModal: this.onOpenCreditTypeModal,
                                    onOpenPermissionRequestModal: this.onOpenPermissionRequestModal,
                                    onOpenViewCommentsModal: this.onOpenViewCommentsModal,
                                    onRemoveFromCart: this.onRemoveFromCart,
                                    onRemoveFromWaitlist: this.onRemoveFromWaitlist,
                                    onSelectSection: this.onSelectSection,
                                    onViewSectionDetailsByBlock: this.onViewSectionDetailsByBlock
                                }}
                                selectedBlock={myBlockSchedule && selectedBlockIndex !== undefined ?
                                    myBlockSchedule[selectedBlockIndex]
                                    : undefined}
                                selectedBlockIndex={selectedBlockIndex}
                                showDeniedCourses={showDeniedCourses}
                                canAddToCart={this.canAddToCart}
                                canAddToWaitlist={this.canAddToWaitlist}
                                canChangeCreditType={this.canChangeCreditType}
                                canDropBlock={this.canDropBlock}
                                canDropSection={this.canDropSection}
                                canRemoveBlock={this.canRemoveBlock}
                                canRemoveFromCart={this.canRemoveFromCart}
                                canRemoveFromWaitlist={this.canRemoveFromWaitlist}
                                getSectionStatus={this.getSectionStatus}
                                onAddBlock={this.onAddBlockFromDetail}
                                onChangeShowDeniedCourses={this.onChangeShowDeniedCourses}
                                onClose={this.onCloseBlockModal}
                                onDropBlock={this.onOpenDropBlockDialog}
                                onRemoveBlock={this.onRemoveBlock}
                                onViewSectionDetailsByCalendar={this.onViewSectionDetailsByCalendar}
                            />
                        );
                    }
                    // #endregion Block Details

                    // #region Section Details
                    let sectionModal: JSX.Element | undefined;
                    if (sectionModalOpen && sectionDetail) {
                        sectionModal = (
                            <SectionDetailModal
                                canAddToCart={!isLoadingScheduleList
                                    && this.canAddToCart(sectionDetail)}
                                canAddToWaitlist={!isLoadingScheduleList
                                    && this.canAddToWaitlist(sectionDetail)}
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

                    // #region Credit Type, Permission Request and Advisor Approval
                    let creditTypeModal: JSX.Element | undefined;
                    let permissionRequestModal: JSX.Element | undefined;
                    let viewCommentsPopover: JSX.Element | undefined;
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
                        else if (Boolean(viewCommentsAnchor)) {
                            // #region View Comments Popover for Advisor Approval
                            if (sectionSelectedAsStudentSchedule.advisorApprovalInfo) {
                                viewCommentsPopover = (
                                    <ViewCommentsPopover
                                        advisorApprovalInfo={sectionSelectedAsStudentSchedule.advisorApprovalInfo}
                                        resources={resources.viewCommentsPopover}
                                        viewCommentsAnchor={viewCommentsAnchor}
                                        onClose={this.onClosePermissionRequestViewCommentsModal}
                                    />
                                );
                            }
                            // #endregion View Comments Popover for Advisor Approval
                        }
                    }
                    // #endregion Credit Type, Permission Request and Advisor Approval

                    // #region Drop Block Confirmation Modal
                    let dropBlockConfirmationModal: JSX.Element | undefined;
                    if (blockToDrop) {
                        dropBlockConfirmationModal = (
                            <ConfirmationDialog
                                contentText={resources.dropBlockConfirmation.lblContent}
                                open={dropBlockDialogOpen}
                                primaryActionOnClick={this.onCloseDropBlockDialog}
                                primaryActionText={resources.dropBlockConfirmation.btnDecline}
                                secondaryActionOnClick={this.onDropBlock}
                                secondaryActionText={resources.dropBlockConfirmation.btnAccept}
                                title={Format.toString(resources.dropBlockConfirmation.formatTitle, [blockToDrop.displayName])}
                            />
                        );
                    }
                    // #endregion Drop Block Confirmation Modal

                    // #region Drop Confirmation Modal
                    const dropConfirmationModal: JSX.Element = (
                        <ConfirmationDialog
                            contentText={resources.dropConfirmation.lblContent}
                            open={dropDialogOpen}
                            primaryActionOnClick={this.onCloseDropDialog}
                            primaryActionText={resources.dropConfirmation.btnDecline}
                            secondaryActionOnClick={this.onDropSection}
                            secondaryActionText={resources.dropConfirmation.btnAccept}
                            title={Format.toString(resources.dropConfirmation.formatTitle, [this.dropSectionName])}
                        />
                    );
                    // #endregion Drop Confirmation Modal
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
                    // #endregion Validation Messages Modal for Registration

                    // #region Registration Summary
                    let registrationSummaryModal: JSX.Element | undefined;
                    if (registrationSummaryModalOpen && registrationSummary) {
                        registrationSummaryModal = (
                            <RegistrationSummaryModal
                                open={registrationSummaryModalOpen}
                                registrationSummary={registrationSummary}
                                resources={resources.registrationSummaryModal}
                                studentCourseMessages={resources.studentCourseMessages}
                                studentCourseStatus={resources.studentCourseStatus}
                                onClose={this.onCloseRegistrationSummaryModal}
                            />
                        );
                    }
                    // #endregion Registration Summary

                    // #region Payment Info modal
                    let paymentInfoModal: JSX.Element | undefined;
                    if (paymentInfo && paymentDetailModalOpen) {
                        paymentInfoModal = (
                            <PaymentDetailModal
                                enableOnlinePayment={enableOnlinePayment}
                                open={paymentDetailModalOpen}
                                paymentInfo={paymentInfo}
                                paymentInfoNoChanges={paymentInfo}
                                paymentMethod={paymentMethod}
                                paymentOrigin={PaymentOrigin.Registration}
                                yearTerm={selectedPeriodText}
                                onClose={this.onClosePaymentDetailModal}
                                onChangePaymentAnotherAmount={this.onChangePaymentAnotherAmount}
                                onChangePaymentMethod={this.onChangePaymentMethod}
                                onPay={this.onPay}
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
                                yearTerm={selectedPeriod}
                                onClose={this.onCloseAgreementModal}
                                onRegister={this.onRegister}
                                onSaved={this.onAgreementSaved}
                            />
                        );
                    }
                    // #endregion Agreement Modal

                    // #region Messages
                    let messagesSection: JSX.Element | undefined;
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
                    if (messagesSection) {
                        messagesSection = (
                            <div className={classes.messagesMargin}>
                                {messagesSection}
                            </div>
                        );
                    }
                    // #endregion Messages

                    // #region Cart
                    const scheduleCard: JSX.Element = (
                        <ScheduleList
                            countActions={countActions}
                            enableRegister={enableRegister}
                            errorLoading={errorLoadingScheduleList}
                            isLoading={isLoadingScheduleList || waitForSchedule}
                            myBlockSchedule={myBlockSchedule}
                            mySchedule={mySchedule}
                            resources={resources.scheduleList}
                            ScheduleListItemProps={{
                                selectedPeriod: selectedPeriodText,
                                onDrop: this.onOpenDropDialog,
                                onOpenCreditTypeModal: this.onOpenCreditTypeModal,
                                onOpenPermissionRequestModal: this.onOpenPermissionRequestModal,
                                onOpenViewCommentsModal: this.onOpenViewCommentsModal,
                                onRemoveFromCart: this.onRemoveFromCart,
                                onRemoveFromWaitlist: this.onRemoveFromWaitlist,
                                onViewSectionDetails: this.onViewSectionDetails
                            }}
                            showCalendar
                            showDeniedCourses={showDeniedCourses}
                            canChangeCreditType={this.canChangeCreditType}
                            canDropBlock={this.canDropBlock}
                            canDropSection={this.canDropSection}
                            canRemoveBlock={this.canRemoveBlock}
                            canRemoveFromCart={this.canRemoveFromCart}
                            canRemoveFromWaitlist={this.canRemoveFromWaitlist}
                            getSectionStatus={this.getSectionStatus}
                            onChangeShowDeniedCourses={this.onChangeShowDeniedCourses}
                            onDropBlock={this.onOpenDropBlockDialog}
                            onExpandBlockCartDetails={this.onExpandBlockCartDetails}
                            onRefresh={this.onRefreshMySchedule}
                            onRegister={agreement && !agreementStatus ? this.onRegisterWithAgreement : this.onRegister}
                            onRemoveBlock={this.onRemoveBlock}
                            onViewBlockDetails={this.onViewBlockDetails}
                            onViewSectionDetailsByCalendar={this.onViewSectionDetailsByCalendar}
                        />
                    );
                    // #endregion Cart

                    // #region Search Title
                    const searchTitle: JSX.Element = (
                        <Grid container justifyContent="space-between" wrap="nowrap">
                            <Grid item>
                                <Paragraph
                                    id="prgSearchPeriodTitle"
                                    size="h2"
                                    text={Format.toString(resources.lblSearchTitle, [selectedPeriodText])}
                                    events={[this.onOpenPeriodsModal]}
                                />
                            </Grid>
                            {switchSearchView && (
                                <Grid item>
                                    <ButtonGroup id="btgSearchView" toggle>
                                        <Tooltip
                                            id="tltBlockSearch"
                                            title={resources.btnBlockSearch}
                                        >
                                            <IconButton
                                                aria-label={resources.btnBlockSearch}
                                                color="secondary"
                                                data-searchview="block"
                                                id="btnBlockSearch"
                                                selected={searchView === 'block'}
                                                onClick={this.onChangeSearchView}
                                            >
                                                <BoxesAlt small />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip
                                            id="tltSectionSearch"
                                            title={resources.btnSectionSearch}
                                        >
                                            <IconButton
                                                aria-label={resources.btnSectionSearch}
                                                color="secondary"
                                                data-searchview="section"
                                                id="btnSectionSearch"
                                                selected={searchView === 'section'}
                                                onClick={this.onChangeSearchView}
                                            >
                                                <Icon name="search" />
                                            </IconButton>
                                        </Tooltip>
                                    </ButtonGroup>
                                </Grid>
                            )}
                        </Grid>
                    );
                    // #region Search Title

                    // #region Block search results
                    let blockSearchResults: JSX.Element | undefined;
                    if (isLoadingBlocks) {
                        blockSearchResults = (<ContainerLoader id="ldrLoadingBlocks" height="sm" />);
                    }
                    else if (ruleGroupBlocks) {
                        blockSearchResults = (
                            <Grid container>
                                <Grid item xs>
                                    {ruleGroupBlocks.map((block, iBlock) => (
                                        <BlockCard
                                            countActions={countActions}
                                            block={block}
                                            enableCart={enableCart}
                                            groupStatus={selectedRuleGroup ?
                                                selectedRuleGroup.status : BlockRegRuleGroupStatus.Unset}
                                            key={`blockCard_${iBlock}`}
                                            resources={resources.blockCard}
                                            SimpleSectionCardProps={{
                                                onSelectSection: this.onSelectSection,
                                                onViewSectionDetailsByBlock: this.onViewSectionDetailsByBlock
                                            }}
                                            canAddToCart={this.canAddToCart}
                                            canAddToWaitlist={this.canAddToWaitlist}
                                            onAddBlock={this.onAddBlock}
                                            onViewBlockDetails={this.onViewBlockDetails}
                                        />
                                    ))}
                                </Grid>
                            </Grid>
                        );
                    }
                    // #endregion Block search results

                    // #region Section search results
                    let sectionSearchResults: JSX.Element | undefined;
                    let countResults: number = 0;
                    if (isLoadingSectionSearch) {
                        sectionSearchResults = (<ContainerLoader id="ldrLoadingSections" height="sm" />);
                    }
                    else if (sections) {
                        sectionSearchResults = (
                            <Grid container>
                                <Grid item xs>
                                    {sections.map((section, iSection) => (
                                        <SectionCard
                                            canAddToCart={!isLoadingScheduleList && this.canAddToCart(section)}
                                            canAddToWaitlist={!isLoadingScheduleList && this.canAddToWaitlist(section)}
                                            currencySymbol={cultures.currencySymbol}
                                            id={`sectionCard_${iSection}`}
                                            key={`sectionCard_${iSection}_${section.id}`}
                                            numberCulture={cultures.numberCulture}
                                            resources={resources.sectionCard}
                                            section={section}
                                            showYearTermSession
                                            withCard
                                            onAddToCart={this.onAddToCart}
                                            onAddToWaitlist={this.onAddToWaitlist}
                                            onViewSectionDetails={this.onViewSectionDetails}
                                        />
                                    ))}
                                </Grid>
                            </Grid>
                        );
                        countResults = sections.length;
                    }

                    let searchBarContainer: JSX.Element | undefined;
                    let blockResultsContainer: JSX.Element | undefined;
                    let resultsContainer: JSX.Element | undefined;

                    if (!isLoadingPeriods) {
                        if (isLoadingRule) {
                            searchBarContainer = (<ContainerLoader id="ldrLoadingRule" height="sm" />);
                        }
                        else {
                            if (searchView === 'section') {
                                searchBarContainer = (
                                    <>
                                        <Grid container>
                                            <Grid item xs>
                                                <Search
                                                    disabled={isLoadingSectionSearch}
                                                    id="txtSearch"
                                                    className={classes.marginText}
                                                    value={keywords}
                                                    onChange={this.onBasicSearchChange}
                                                    onClear={this.onBasicSearchClear}
                                                    onSearchInvoked={this.onBasicSearchEnterPress}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container justifyContent="space-between">
                                            <Grid item>
                                                <Button
                                                    align="left"
                                                    disabled={isLoadingSectionSearch}
                                                    id="btnAdvancedSearch"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={this.onOpenAdvancedSearchModal}
                                                >
                                                    {resources.btnAdvancedSearch}
                                                </Button>
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    align="left"
                                                    disabled={isLoadingSectionSearch}
                                                    id="btnNewSearch"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={this.onNewSearch}
                                                >
                                                    {resources.btnNewSearch}
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </>
                                );
                                resultsContainer = sectionSearchResults;
                            }
                            else if (blockRegistrationRule && searchView === 'block') {
                                blockResultsContainer = (
                                    <ExpansionPanel
                                        defaultExpanded
                                        expanded={blockRegistrationExpanded}
                                        id="pnlBlockRegistrationRuleGroups"
                                        header={(
                                            <Text size="h4">
                                                {resources.lblBlockRegistrationTitle}
                                            </Text>
                                        )}
                                        onChange={this.onExpandBlockRegistration}
                                    >
                                        {blockRegistrationRule.blockRegRuleGroups
                                            && blockRegistrationRule.blockRegRuleGroups.length > 0 ? (
                                            <>
                                                <Grid container>
                                                    <Grid item xs>
                                                        <Text>
                                                            {resources.lblBlockRegistrationInstructions}
                                                        </Text>
                                                    </Grid>
                                                </Grid>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        {blockRegistrationRule.blockRegRuleGroups.map((group,
                                                            iGroup) => (
                                                            <Grid
                                                                container
                                                                key={`ruleGroup_${iGroup}`}
                                                                alignItems="center"
                                                                spacing={width === 'xs' ? 0 : 3}
                                                            >
                                                                <Grid item xs={width === 'xs' ? 12 : undefined}>
                                                                    <Button
                                                                        TextProps={{
                                                                            size: 'h4',
                                                                            weight: 'strong'
                                                                        }}
                                                                        align="left"
                                                                        data-index={iGroup}
                                                                        id={`btnGroup_${iGroup}`}
                                                                        textVariantStyling="inherit"
                                                                        variant="text"
                                                                        onClick={this.onRuleGroupClick}
                                                                    >
                                                                        {group.displayName}
                                                                    </Button>
                                                                    <Text>
                                                                        {Format.toString(group.numberOfBlocks === 1 ?
                                                                            resources.formatNumberOfBlock
                                                                            : resources.formatNumberOfBlocks,
                                                                            [group.numberOfBlocks])}
                                                                    </Text>
                                                                </Grid>
                                                                {(group.status === BlockRegRuleGroupStatus.Completed
                                                                    || group.status === BlockRegRuleGroupStatus.Processing)
                                                                    && (
                                                                        <Grid item xs={width === 'xs' ? 12 : undefined}>
                                                                            <Grid
                                                                                container
                                                                                alignItems="center"
                                                                                spacing={0}
                                                                                wrap="nowrap"
                                                                            >
                                                                                <Grid item>
                                                                                    {group.status === BlockRegRuleGroupStatus.Processing && (
                                                                                        <StatusLabel
                                                                                            id={`stl${iGroup}`}
                                                                                            text={resources.lblProcessing}
                                                                                            type="default"
                                                                                        />
                                                                                    )}
                                                                                    {group.status === BlockRegRuleGroupStatus.Completed && (
                                                                                        <StatusLabel
                                                                                            id={`stl${iGroup}`}
                                                                                            text={resources.lblCompleted}
                                                                                            type="success"
                                                                                        />
                                                                                    )}
                                                                                </Grid>
                                                                                <Grid item>
                                                                                    <Tooltip
                                                                                        id={`tltInfo_${iGroup}`}
                                                                                        placement="top"
                                                                                        title={group.status === BlockRegRuleGroupStatus.Completed ?
                                                                                            resources.lblCompletedTooltip
                                                                                            : resources.lblProcessingTooltip}
                                                                                    >
                                                                                        <IconButton
                                                                                            aria-label={group.status === BlockRegRuleGroupStatus.Completed ?
                                                                                                resources.lblCompletedTooltip
                                                                                                : resources.lblProcessingTooltip}
                                                                                            color="gray"
                                                                                            id={`btnInfo_${iGroup}`}
                                                                                        >
                                                                                            <Icon
                                                                                                name="info"
                                                                                                type={ResultType.info}
                                                                                            />
                                                                                        </IconButton>
                                                                                    </Tooltip>
                                                                                </Grid>
                                                                            </Grid>
                                                                        </Grid>
                                                                    )}
                                                            </Grid>
                                                        ))}
                                                    </Grid>
                                                </Grid>
                                            </>
                                        ) : (
                                            <Grid container>
                                                <Grid item xs={12}>
                                                    <MessageStyled
                                                        classMessage="noResults"
                                                        message={resources.lblNoRuleGroups}
                                                    />
                                                </Grid>
                                            </Grid>
                                        )}
                                    </ExpansionPanel>
                                );

                                if (selectedRuleGroup) {
                                    resultsContainer = (
                                        <>
                                            <Grid container>
                                                <Grid item>
                                                    <Text className={classes.selectedBlockTitle} size="h4">
                                                        {selectedRuleGroup.displayName}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                            {blockSearchResults}
                                        </>
                                    );
                                }
                            }
                        }
                    }
                    // #endregion Section search results

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
                            {!hasAcademicInfo && (
                                <Grid container>
                                    <Grid item xs>
                                        <Alert
                                            id="msgWarningNoAcademicInfo"
                                            open={!hasAcademicInfo}
                                            text={resources.lblNoAcademicInfo}
                                            type={ResultType.warning}
                                        />
                                    </Grid>
                                </Grid>
                            )}
                            {Boolean(messagesSection) && (
                                <Hidden mdUp>
                                    {messagesSection}
                                </Hidden>
                            )}
                            <Grid container>
                                <Grid item xs={12} md={8}>
                                    <Card>
                                        <CardContent className={classes.sectionSearchCardContent}>
                                            {searchTitle}
                                            {searchBarContainer}
                                        </CardContent>
                                        {blockResultsContainer}
                                    </Card>
                                    <div aria-live="polite">
                                        {searchView === 'section' && !isLoadingSectionSearch && dirtySearch && (
                                            <>
                                                {!countResults ? (
                                                    <Grid container className={classes.indicatorResults}>
                                                        <Grid item xs>
                                                            <Card>
                                                                <CardContent>
                                                                    <Illustration
                                                                        name="no-search-results"
                                                                        text={resources.lblNoResults}
                                                                    />
                                                                </CardContent>
                                                            </Card>
                                                        </Grid>
                                                    </Grid>
                                                ) : (
                                                    <Grid container className={classes.indicatorResults}>
                                                        <Grid item>
                                                            <Text>
                                                                {Format.toString(countResults === 1 ?
                                                                    resources.formatResult
                                                                    : resources.formatResults, [countResults])}
                                                            </Text>
                                                        </Grid>
                                                    </Grid>
                                                )}
                                            </>
                                        )}
                                    </div>
                                    {resultsContainer}
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    {Boolean(messagesSection) && (
                                        <Hidden smDown>
                                            {messagesSection}
                                        </Hidden>
                                    )}
                                    {scheduleCard}
                                </Grid>
                            </Grid>
                            {dropBlockConfirmationModal}
                            {dropConfirmationModal}
                            {creditTypeModal}
                            {periodsModalSection}
                            {blockModal}
                            {sectionModal}
                            {sectionsOptionsModal}
                            {permissionRequestModal}
                            {validationMessagesModal}
                            {registrationSummaryModal}
                            {viewCommentsPopover}
                            {paymentInfoModal}
                            {agreementModal}
                        </>
                    );
                }
                else {
                    contentPage = (
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <MessageStyled
                                            classMessage="noResults"
                                            message={resources.lblNoPeriods}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card >
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
            >
                {contentPage}
                {processPaymentModal}
                {successfulPaymentModal}
                {failedPaymentModal}
            </Layout >
        );
    }
}

const CoursesViewWithLayout = withLayout(withStyles(styles)(withWidth()(CoursesView)));
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<CoursesViewWithLayout />, document.getElementById('root'));