/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AdvisorApproval.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import AdvisorApprovalContent, { IAdvisorApprovalContentResProps } from './AdvisorApprovalContent';
import RegistrationSummaryModal from '../../Generic/RegistrationSummaryModal';
import SectionDetailModal, { ISectionDetailModalResProps } from '../../Generic/SectionDetailModal';
import ValidationMessagesModal, { IValidationMessagesModalResProps } from '../../Registration/Courses/ValidationMessagesModal';

// Types
import { IAdvisorApprovalResources } from '../../../Types/Resources/Advising/IAdvisorApprovalResources';
import { IAdvisorRequest, ISectionCourse } from '../../../Types/Advising/IAdvisorRequest';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IApprovalRequest } from '../../../Types/Advising/IApprovalRequest';
import { ICultures } from '@hedtech/powercampus-design-system/types/ICultures';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IImpersonateInfo } from '../../../Types/Account/IImpersonateInfo';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IStudentCourseMessagesResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseMessagesResources';
import { IStudentCourseStatusResources } from '@hedtech/powercampus-design-system/types/Resources/IStudentCourseStatusResources';
import { IRegistrationSummary } from '../../../Types/Generic/IRegistrationSummary';
import { IRegistrationSummaryModalResources } from '../../../Types/Resources/Generic/IRegistrationSummaryModalResources';
import { IRegistrationValidation } from '../../../Types/Course/IRegistrationValidation';
import { ISectionDetail } from '../../../Types/Section/ISectionDetail';
import { ISessionPeriod } from '../../../Types/Generic/ISessionPeriod';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Advising/AdvisorApproval';
import RequestsSection from '../../../Requests/Generic/Section';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Internal types
interface IAdvisorApprovalProps {
    cultures: ICultures;
    impersonateInfo: IImpersonateInfo;
}

interface IAdvisorApprovalState {
    advisorApprovalRequest?: IAdvisorRequest;
    componentError: boolean;
    decisionAll: number;
    isDrawerClicked: boolean;
    isLoading: boolean;
    openRegistrationSummaryModal: boolean;
    openValidateModal: boolean;
    openValidationMessagesModal: boolean;
    periods?: ISessionPeriod[];
    registrationLogId?: number;
    registrationSummary?: IRegistrationSummary;
    registrationValidation?: IRegistrationValidation;
    sectionDetail?: ISectionDetail;
    sectionModalOpen: boolean;
    selected: number;

    resources?: IAdvisorApprovalResProps;
}

interface IAdvisorApprovalResProps extends IAdvisorApprovalResources {
    advisorApprovalContent: IAdvisorApprovalContentResProps;
    registrationSummaryModal: IRegistrationSummaryModalResources;
    sectionDetailModal: ISectionDetailModalResProps;
    studentCourseMessages: IStudentCourseMessagesResources;
    studentCourseStatus: IStudentCourseStatusResources;
    validationMessagesModal: IValidationMessagesModalResProps;
}
// #endregion Internal types

// #region component
class AdvisorApproval extends React.Component<IAdvisorApprovalProps, IAdvisorApprovalState> {
    private idModule: string;
    private idPage: string;
    private newAwaitingDrops: ISectionCourse[];
    private newAwaitingRegistrations: ISectionCourse[];
    private newDropRequests: ISectionCourse[];
    private newRegistrationRequests: ISectionCourse[];
    public readonly state: Readonly<IAdvisorApprovalState>;

    // Constructor
    public constructor(props: any) {
        super(props);

        // Init Variables
        this.idModule = 'Advising';
        this.idPage = 'AdvisorApproval';
        this.newAwaitingDrops = [];
        this.newAwaitingRegistrations = [];
        this.newDropRequests = [];
        this.newRegistrationRequests = [];
        this.state = this.getInitialState();
    }

    // Init State
    private getInitialState(): IAdvisorApprovalState {
        let resources: IAdvisorApprovalResProps | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            advisorApprovalRequest: undefined,
            componentError: false,
            decisionAll: 1,
            isDrawerClicked: false,
            isLoading: true,
            openRegistrationSummaryModal: false,
            openValidateModal: false,
            openValidationMessagesModal: false,
            periods: undefined,
            registrationValidation: undefined,
            sectionDetail: undefined,
            sectionModalOpen: false,
            selected: 0,

            resources: resources
        };
    }

    // #region Events
    private onChangeComment = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                advisorApprovalRequest
            } = this.state;

            const ids: string[] = event.target.id.split('_');
            if (advisorApprovalRequest) {
                if (advisorApprovalRequest.awaitingRegistrationList
                    && advisorApprovalRequest.awaitingRegistrationList.length > 0
                    && ids[1] === 'registration') {
                    advisorApprovalRequest.awaitingRegistrationList[Number(ids[2])].reason = event.target.value;
                }
                if (advisorApprovalRequest.awaitingDropList
                    && advisorApprovalRequest.awaitingDropList.length > 0
                    && ids[1] === 'drop') {
                    advisorApprovalRequest.awaitingDropList[Number(ids[2])].reason = event.target.value;
                }
                this.setState({
                    advisorApprovalRequest: advisorApprovalRequest
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeComment.name, e));
        }
    };

    private onChangeDecision = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                advisorApprovalRequest
            } = this.state;

            const ids: string[] = id.split('_');
            if (advisorApprovalRequest) {
                if (advisorApprovalRequest.awaitingRegistrationList
                    && advisorApprovalRequest.awaitingRegistrationList.length > 0
                    && ids[1] === 'registration') {
                    advisorApprovalRequest.awaitingRegistrationList[Number(ids[2])].decision = Number(optionSelected.value);
                }
                if (advisorApprovalRequest.awaitingDropList
                    && advisorApprovalRequest.awaitingDropList.length > 0
                    && ids[1] === 'drop') {
                    advisorApprovalRequest.awaitingDropList[Number(ids[2])].decision = Number(optionSelected.value);
                }
            }
            this.setState({
                advisorApprovalRequest: advisorApprovalRequest
            });
        }

        catch (e) {
            this.logError(LogData.fromException(this.onChangeDecision.name, e));
        }
    };

    private onChangeDecisionAll = (optionSelected: IDropDownOption): void => {
        try {
            const {
                advisorApprovalRequest
            } = this.state;

            if (advisorApprovalRequest) {
                if (advisorApprovalRequest.awaitingRegistrationList
                    && advisorApprovalRequest.awaitingRegistrationList.length > 0) {
                    for (const regSection of advisorApprovalRequest.awaitingRegistrationList) {
                        regSection.decision = Number(optionSelected.value);
                    }
                }
                if (advisorApprovalRequest.awaitingDropList
                    && advisorApprovalRequest.awaitingDropList.length > 0) {
                    for (const dropSection of advisorApprovalRequest.awaitingDropList) {
                        dropSection.decision = Number(optionSelected.value);
                    }
                }
            }
            this.setState({
                advisorApprovalRequest: advisorApprovalRequest,
                decisionAll: Number(optionSelected.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDecisionAll.name, e));
        }
    };

    private onChangePeriod = (event: React.MouseEvent<HTMLElement>) => {
        try {
            const {
                impersonateInfo
            } = this.props;

            const ids: string[] = event.currentTarget.id.split('_');
            this.setState({
                isDrawerClicked: false,
                selected: Number(ids[2])
            }, () => {
                LayoutActions.setLoading(true);
                Requests.getApprovalRequests(impersonateInfo, Number(ids[1]), this.resolveGetApprovalRequests);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDecision.name, e));
        }
    };

    private onClickViewDetails = (sectionId: number) => (): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            LayoutActions.showPageLoader();
            RequestsSection.getSection(sectionId, false, this.resolveGetSection, impersonateInfo);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickViewDetails.name, e));
        }

    };

    private onCloseMessagesModal = (): void => {
        try {
            this.setState({
                openValidationMessagesModal: false,
                registrationValidation: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseMessagesModal.name, e));
        }
    };

    private onCloseSectionModal = (): void => {
        try {
            this.setState({
                sectionDetail: undefined,
                sectionModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSectionModal.name, e));
        }
    };

    private onCloseValidateModal = (): void => {
        try {
            this.setState({
                openValidateModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseValidateModal.name, e));
        }
    };

    private onSaveSchedules = (): void => {
        try {
            const {
                advisorApprovalRequest,
                periods,
                selected,
                resources
            } = this.state;

            const {
                cultures,
                impersonateInfo
            } = this.props;

            const newRequests: IApprovalRequest[] = [];
            const newAwaitingDrops: ISectionCourse[] = [];
            const newAwaitingRegistrations: ISectionCourse[] = [];
            const newDropRequests: ISectionCourse[] = [];
            const newRegistrationRequests: ISectionCourse[] = [];
            const today = new Date();

            if (advisorApprovalRequest) {
                if (advisorApprovalRequest.awaitingDropList && advisorApprovalRequest.awaitingDropList.length > 0) {
                    advisorApprovalRequest.awaitingDropList.forEach(request => {
                        if (request.decision !== 1) {
                            newRequests.push({
                                decision: request.decision,
                                reason: request.reason,
                                scheduleRequestId: request.scheduleRequestId
                            });
                            newDropRequests.push({
                                ...request,
                                decisionDate: today.toLocaleDateString(cultures.dateTimeCulture)
                            });
                        }
                        else {
                            newAwaitingDrops.push(request);
                        }
                    });
                }
                if (advisorApprovalRequest.awaitingRegistrationList && advisorApprovalRequest.awaitingRegistrationList.length > 0) {
                    advisorApprovalRequest.awaitingRegistrationList.forEach(request => {
                        if (request.decision !== 1) {
                            newRequests.push({
                                decision: request.decision,
                                reason: request.reason,
                                scheduleRequestId: request.scheduleRequestId
                            });
                            newRegistrationRequests.push({
                                ...request,
                                decisionDate: today.toLocaleDateString(cultures.dateTimeCulture)
                            });
                        }
                        else {
                            newAwaitingRegistrations.push(request);
                        }
                    });
                }
            }
            if (newRequests.length > 0 && periods) {
                LayoutActions.setLoading(true);
                this.newAwaitingDrops = newAwaitingDrops;
                this.newAwaitingRegistrations = newAwaitingRegistrations;
                this.newDropRequests = newDropRequests;
                this.newRegistrationRequests = newRegistrationRequests;
                Requests.saveApprovalRequest(impersonateInfo,
                    periods[selected].sessionPeriodId,
                    newRequests,
                    this.resolveOnSaveSchedules);
            } else {
                if (resources) {
                    LayoutActions.setAlert({
                        message: resources.lblNotApprovedOrDenied,
                        messageType: ResultType.warning,
                        snackbar: true
                    } as IAlert);
                }
                this.newAwaitingDrops = [];
                this.newAwaitingRegistrations = [];
                this.newDropRequests = [];
                this.newRegistrationRequests = [];
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSchedules.name, e));
        }
    };

    private onSwipeDrawer = (): void => {
        try {
            const {
                isDrawerClicked
            } = this.state;

            this.setState({
                isDrawerClicked: !isDrawerClicked
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSwipeDrawer.name, e));
        }
    };

    private onCloseRegistrationSummaryModal = (): void => {
        try {
            this.setState({
                openRegistrationSummaryModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseRegistrationSummaryModal.name, e));
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
                    openRegistrationSummaryModal: true
                });
            }
            else if (registrationLogId) {
                Requests.getRegistrationSummary(registrationLogId, this.resolveGetRegistrationSummary);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenRegistrationSummaryModal.name, e));
        }
    };

    private onValidateSchedules = (): void => {
        try {
            const {
                advisorApprovalRequest,
                periods,
                selected
            } = this.state;

            const {
                impersonateInfo
            } = this.props;

            const validateRequests: number[] = [];
            if (advisorApprovalRequest) {
                if (advisorApprovalRequest.awaitingDropList && advisorApprovalRequest.awaitingDropList.length > 0) {
                    advisorApprovalRequest.awaitingDropList.forEach(request => {
                        if (request.decision === 2 && request.scheduleRequestId) {
                            validateRequests.push(request.scheduleRequestId);
                        }
                    });
                }
                if (advisorApprovalRequest.awaitingRegistrationList && advisorApprovalRequest.awaitingRegistrationList.length > 0) {
                    advisorApprovalRequest.awaitingRegistrationList.forEach(request => {
                        if (request.decision === 2 && request.scheduleRequestId) {
                            validateRequests.push(request.scheduleRequestId);
                        }
                    });
                }
            }

            if (validateRequests.length > 0 && periods) {
                LayoutActions.setLoading(true);
                Requests.validateApprovalRequest(impersonateInfo,
                    periods[selected].sessionPeriodId,
                    validateRequests,
                    this.resolveOnValidateSchedules);
            }
            else {
                this.setState({
                    openValidateModal: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onValidateSchedules.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Functions

    // #region Functions for errors
    private logError = (logData: ILogData): void => {
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        LayoutActions.setRedirectCode(code);
    };
    // #endregion Functions for errors

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {

            const {
                impersonateInfo
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => {
                    Requests.getPeriods(this.resolveGetPeriods, impersonateInfo);
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetPeriods = (json: string): void => {
        try {
            const {
                impersonateInfo
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPeriods.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    periods: result.data
                }, () => {
                    if (result.data) {
                        const periods: ISessionPeriod[] = result.data;
                        if (periods.length > 0) {
                            Requests.getApprovalRequests(impersonateInfo, periods[0].sessionPeriodId, this.resolveGetApprovalRequests);
                        } else {
                            this.hideAllLoaders();
                        }
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPeriods.name, e));
        }
    };

    private resolveGetApprovalRequests = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetApprovalRequests.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    advisorApprovalRequest: result.data
                }, () => {
                    this.hideAllLoaders();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetApprovalRequests.name, e));
        }
    };

    private resolveGetRegistrationSummary = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetRegistrationSummary.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    registrationSummary: result.data,
                    openRegistrationSummaryModal: true
                });
                LayoutActions.setAlert(undefined);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetRegistrationSummary.name, e));
        }
    };

    private resolveOnSaveSchedules = (json: string): void => {
        try {
            const {
                advisorApprovalRequest,
                periods,
                resources,
                selected
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveOnSaveSchedules.name, this.hideAllLoaders);

            let dropRequests: ISectionCourse[] = this.newDropRequests;
            let registrationRequests: ISectionCourse[] = this.newRegistrationRequests;

            if (result?.status) {
                const registrationValidation: IRegistrationValidation = result.data;
                if (registrationValidation) {
                    if (registrationValidation.isSuccessful) {
                        LayoutActions.setAlert({
                            content: (
                                <>
                                    <Text>
                                        {resources?.lblRegistrationSuccess}
                                    </Text>
                                    <Button
                                        id="btnViewRegistrationSummary"
                                        variant="text"
                                        textVariantStyling="inherit"
                                        onClick={this.onOpenRegistrationSummaryModal}>
                                        {resources?.btnViewRegistrationSummary}
                                    </Button>
                                </>
                            ),
                            messageType: ResultType.warning
                        } as IAlert);

                        if (advisorApprovalRequest) {
                            // Add new schedules to Drop Requests
                            if (advisorApprovalRequest.dropRequests && advisorApprovalRequest.dropRequests.length > 0) {
                                dropRequests = [...advisorApprovalRequest.dropRequests, ...dropRequests];
                            }

                            // Add new schedules to Registration Requests
                            if (advisorApprovalRequest.registrationRequests && advisorApprovalRequest.registrationRequests.length > 0) {
                                registrationRequests = [...advisorApprovalRequest.registrationRequests, ...registrationRequests];
                            }
                            advisorApprovalRequest.awaitingDropList = this.newAwaitingDrops;
                            advisorApprovalRequest.awaitingRegistrationList = this.newAwaitingRegistrations;
                            advisorApprovalRequest.dropRequests = dropRequests;
                            advisorApprovalRequest.registrationRequests = registrationRequests;

                            // Check if there are awaiting sectiong
                            if (advisorApprovalRequest.awaitingDropList
                                && advisorApprovalRequest.awaitingDropList.length === 0
                                && advisorApprovalRequest.awaitingRegistrationList
                                && advisorApprovalRequest.awaitingRegistrationList.length === 0
                                && periods) {
                                periods[selected].hasPending = false;
                            }
                        }
                    }
                    this.newAwaitingDrops = [];
                    this.newAwaitingRegistrations = [];
                    this.newDropRequests = [];
                    this.newRegistrationRequests = [];
                    this.setState({
                        advisorApprovalRequest: advisorApprovalRequest,
                        openValidationMessagesModal: !registrationValidation.isSuccessful,
                        periods: periods,
                        registrationLogId: registrationValidation.registrationLogId,
                        registrationSummary: undefined,
                        registrationValidation: registrationValidation
                    }, () => {
                        LayoutActions.hidePageLoader();
                    });
                }
                else {
                    this.setState({
                        registrationValidation: registrationValidation
                    }, () => {
                        LayoutActions.hidePageLoader();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveOnSaveSchedules.name, e));
        }
    };

    private resolveOnValidateSchedules = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveOnValidateSchedules.name, this.hideAllLoaders);

            if (result?.status) {
                const registrationValidation: IRegistrationValidation = result.data;
                if (registrationValidation) {
                    this.setState({
                        openValidateModal: registrationValidation.isSuccessful,
                        openValidationMessagesModal: !registrationValidation.isSuccessful,
                        registrationValidation: registrationValidation
                    }, () => {
                        LayoutActions.hidePageLoader();
                    });
                }
                else {
                    this.setState({
                        registrationValidation: registrationValidation
                    }, () => {
                        LayoutActions.hidePageLoader();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveOnValidateSchedules.name, e));
        }
    };

    private resolveGetSection = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSection.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    sectionDetail: result.data,
                    sectionModalOpen: true
                }, () => {
                    LayoutActions.hidePageLoader();
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSection.name, e));
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

    // Render
    public render(): JSX.Element {
        const {
            advisorApprovalRequest,
            componentError,
            decisionAll,
            isDrawerClicked,
            isLoading,
            openValidateModal,
            openValidationMessagesModal,
            openRegistrationSummaryModal,
            periods,
            registrationLogId,
            registrationSummary,
            registrationValidation,
            sectionDetail,
            sectionModalOpen,
            selected,

            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (<ContainerLoader id="ldrAddressesMain" height="md" />);
        }
        else if (!componentError && resources) {

            let sectionModal: JSX.Element | undefined;
            if (sectionDetail) {
                sectionModal = (
                    <SectionDetailModal
                        open={sectionModalOpen}
                        resources={resources.sectionDetailModal}
                        section={sectionDetail}
                        onClose={this.onCloseSectionModal}
                    />
                );
            }

            let validationMessagesModal: JSX.Element | undefined;
            if (registrationValidation && registrationValidation.validationMessages) {
                validationMessagesModal = (
                    <ValidationMessagesModal
                        open={openValidationMessagesModal}
                        validationMessages={registrationValidation.validationMessages}
                        onClose={this.onCloseMessagesModal}
                        resources={resources.validationMessagesModal}
                    />
                );
            }

            let registrationSummaryModal: JSX.Element | undefined;
            if (registrationLogId && registrationSummary && openRegistrationSummaryModal) {
                registrationSummaryModal = (
                    <RegistrationSummaryModal
                        open={openRegistrationSummaryModal}
                        registrationSummary={registrationSummary}
                        resources={resources.registrationSummaryModal}
                        studentCourseMessages={resources.studentCourseMessages}
                        studentCourseStatus={resources.studentCourseStatus}
                        onClose={this.onCloseRegistrationSummaryModal}
                    />
                );
            }

            if (periods && periods.length > 0) {
                contentPage = (
                    <>
                        <AdvisorApprovalContent
                            advisorApprovalRequest={advisorApprovalRequest}
                            decisionAll={decisionAll}
                            isDrawerClicked={isDrawerClicked}
                            openValidateModal={openValidateModal}
                            periods={periods}
                            selected={selected}
                            onChangeComment={this.onChangeComment}
                            onChangeDecision={this.onChangeDecision}
                            onChangeDecisionAll={this.onChangeDecisionAll}
                            onChangePeriod={this.onChangePeriod}
                            onClickViewDetails={this.onClickViewDetails}
                            onCloseValidateModal={this.onCloseValidateModal}
                            onSaveSchedules={this.onSaveSchedules}
                            onSwipeDrawer={this.onSwipeDrawer}
                            onValidateSchedules={this.onValidateSchedules}
                            resources={resources.advisorApprovalContent}
                        />
                        {sectionModal}
                        {validationMessagesModal}
                        {registrationSummaryModal}
                    </>
                );
            }
            // TODO: Improve loading check
            else {
                contentPage = (
                    <Card>
                        <CardContent>
                            <Illustration
                                color="secondary"
                                name="under-maintenance"
                                text={resources.lblNoResults}
                            />
                        </CardContent>
                    </Card>
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
// #endregion component

// Component
export default AdvisorApproval;