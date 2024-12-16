/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: NotificationsSetupView.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import ReactDOM from 'react-dom';

// Core components
import Layout, { withLayout } from '@hedtech/powercampus-design-system/react/components/Layout';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { INotificationsEvents } from '../../../Types/Notifications/INotificationsEvents';
import { INotificationsEventsDetails } from '../../../Types/Notifications/INotificationsEventsDetails';
import { INotificationsEventUpdate } from '../../../Types/Notifications/INotificationsEventUpdate';
import { INotificationsTypes } from '../../../Types/Notifications/INotificationsTypes';
import { INotificationsTypesSetup } from '../../../Types/Notifications/INotificationsTypesSetup';
import { INotificationsSetupResources } from '../../../Types/Resources/Administration/INotificationsSetupResources';

// Internal components
import AreasList from './AreasList';
import AreasSetup from './AreasSetup';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/NotificationsRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// #endregion Imports

// #region Types
export interface INotificationsSetupState {
    applications?: IDropDownOption[];
    applicationSelected?: IDropDownOption;
    areaName: string;
    componentError: boolean;
    eventId: number;
    isCcoRequired: boolean;
    isFromRequired: boolean;
    isMessageRequired: boolean;
    isSubjectRequired: boolean;
    isToRequired: boolean;
    notificationsEvents?: INotificationsEvents[];
    notificationsEventUpdate: INotificationsEventUpdate;
    notificationsEventsDetails?: INotificationsEventsDetails;
    notificationsTypes?: INotificationsTypes;
    notificationsTypesSetup: INotificationsTypesSetup;
    typeSelected?: IDropDownOption;
    isSetupShow: boolean;
    resources?: INotificationsSetupResources;
}
// #endregion Types

// #region Component
class NotificationsSetupView extends React.Component<any, INotificationsSetupState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<INotificationsSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'NotificationsSetup';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        LayoutStore.addLayoutReadyListener(this.onLayoutReady);
        // #endregion State Management Listeners
    }

    private getInitialState(): INotificationsSetupState {
        let resources: INotificationsSetupResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            areaName: '',
            componentError: false,
            eventId: 0,
            isCcoRequired: false,
            isFromRequired: false,
            isMessageRequired: false,
            isSetupShow: false,
            isSubjectRequired: false,
            isToRequired: false,
            notificationsEventUpdate: {},
            notificationsTypesSetup: {},
            resources: resources
        };
    }

    // #region Events
    private onCancel = (): void => {
        try {
            this.setState({
                isCcoRequired: false,
                isFromRequired: false,
                isMessageRequired: false,
                isSetupShow: false,
                isSubjectRequired: false,
                isToRequired: false,
                notificationsTypesSetup: {}
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancel.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string): void => {
        try {

            if (id === 'ddlApplication') {
                if (optionSelected.value !== -1) {
                    LayoutActions.showPageLoader();
                    Requests.getEvents(Number(optionSelected.value), this.resolveGetNotificationsEvents, this.logError);
                    this.setState({
                        applicationSelected: optionSelected
                    });
                }
                else {
                    this.setState({
                        notificationsEvents: undefined
                    });
                }
            }
            else {
                this.setState({
                    typeSelected: optionSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onChangeEnable = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                notificationsTypesSetup
            } = this.state;
            const isActive: boolean = !Boolean(event.target.value);
            notificationsTypesSetup.isActive = isActive;
            this.setState({
                notificationsTypesSetup: notificationsTypesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeEnable.name, e));
        }
    };

    private onChangeEnableDisable = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                notificationsEvents
            } = this.state;
            const notificatinsEventUpdate: INotificationsEventUpdate = {};
            const isActive: boolean = !Boolean(event.target.value);
            const eventId: string[] = event.target.id.split('_');
            if (notificationsEvents) {
                notificationsEvents[Number(eventId[1])].notificationEvents[Number(eventId[3])].isActive = isActive;
            }
            notificatinsEventUpdate.isActive = isActive;
            notificatinsEventUpdate.notificationEventId = Number(eventId[2]);
            LayoutActions.showPageLoader();
            Requests.postEnableDisable(notificatinsEventUpdate, this.resolvePostUpdateEvent, this.logError);
            this.setState({
                notificationsEvents: notificationsEvents,
                notificationsEventUpdate: notificatinsEventUpdate
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeEnableDisable.name, e));
        }
    };

    private onClickChip = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                notificationsTypesSetup,
                resources
            } = this.state;

            const isCollection: string[] = event.currentTarget.id.split('_');

            if (resources) {
                if (notificationsTypesSetup.message !== '' && notificationsTypesSetup.message !== undefined) {
                    if (isCollection[2] === 'true') {
                        notificationsTypesSetup.message =
                            Format.toString(resources.formatTokenCollection, [notificationsTypesSetup.message, String(event.target.innerText)]);
                    }
                    else {
                        notificationsTypesSetup.message = Format.toString(resources.formatToken,
                            [notificationsTypesSetup.message, String(event.target.innerText)]);
                    }
                }
                else {
                    if (isCollection[2] === 'true') {
                        notificationsTypesSetup.message = Format.toString(resources.formatEmptyTokenCollection, [String(event.target.innerText)]);
                    }
                    else {
                        notificationsTypesSetup.message = Format.toString(resources.formatEmptyToken, [String(event.target.innerText)]);
                    }
                }
                this.setState({
                    notificationsTypesSetup: notificationsTypesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickChip.name, e));
        }
    };

    private onClickChipSubject = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                notificationsTypesSetup,
                resources
            } = this.state;

            if (resources) {
                if (notificationsTypesSetup.subject !== '' && notificationsTypesSetup.subject !== undefined) {
                    notificationsTypesSetup.subject = Format.toString(resources.formatToken,
                        [notificationsTypesSetup.subject, String(event.target.innerText)]);
                }
                else {
                    notificationsTypesSetup.subject = Format.toString(resources.formatEmptyToken, [String(event.target.innerText)]);
                }
                this.setState({
                    notificationsTypesSetup: notificationsTypesSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickChipSubject.name, e));
        }
    };

    private onClickSetup = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const id: string[] = event.target.id.split('_');
            LayoutActions.showPageLoader();
            Requests.getEventsDetails(Number(id[3]), this.resolveGetNotificationsEventsDetails, this.logError);
            this.setState({
                areaName: String(id[4]),
                eventId: Number(id[3])
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickSetup.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                eventId,
                notificationsTypes,
                notificationsTypesSetup
            } = this.state;

            let isCcoRequired: boolean = false;
            let isFromRequired: boolean = false;
            let isMessageRequired: boolean = false;
            let isSubjectRequired: boolean = false;
            let isToRequired: boolean = false;
            let save: boolean = true;

            if (notificationsTypes) {
                notificationsTypes.notificationTypesDetails.forEach(event => {
                    event.notificationTemplate.forEach(item => {
                        switch (item.id) {
                            case 'from':
                                isFromRequired = item.isRequired;
                                break;
                            case 'to':
                                isToRequired = item.isRequired;
                                break;
                            case 'cco':
                                isCcoRequired = item.isRequired;
                                break;
                            case 'subject':
                                isSubjectRequired = item.isRequired;
                                break;
                            case 'message':
                                isMessageRequired = item.isRequired;
                                break;
                        }
                    });
                });
            }

            if (notificationsTypesSetup) {
                if (isCcoRequired && (notificationsTypesSetup.cco === '' || notificationsTypesSetup.cco === null)) {
                    save = false;
                    this.setState({
                        isCcoRequired: true
                    });
                }
                if (isFromRequired && (notificationsTypesSetup.from === '' || notificationsTypesSetup.from === null)) {
                    save = false;
                    this.setState({
                        isFromRequired: true
                    });
                }
                if (isMessageRequired && (notificationsTypesSetup.message === '' || notificationsTypesSetup.message === null)) {
                    save = false;
                    this.setState({
                        isMessageRequired: true
                    });
                }
                if (isSubjectRequired && (notificationsTypesSetup.subject === '' || notificationsTypesSetup.subject === null)) {
                    save = false;
                    this.setState({
                        isSubjectRequired: true
                    });
                }
                if (isToRequired && (notificationsTypesSetup.to === '' || notificationsTypesSetup.to === null)) {
                    save = false;
                    this.setState({
                        isToRequired: true
                    });
                }

                if (save) {
                    notificationsTypesSetup.typeId = 1;
                    notificationsTypesSetup.notificationEventId = eventId;
                    notificationsTypesSetup.isActive = true;
                    LayoutActions.showPageLoader();
                    Requests.postSaveSetup(notificationsTypesSetup, this.resolvePostSaveSetup, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    private onTextFieldChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                isCcoRequired,
                isFromRequired,
                isMessageRequired,
                isSubjectRequired,
                isToRequired,
                notificationsTypesSetup
            } = this.state;

            let isCcoReq: boolean = isCcoRequired;
            let isFromReq: boolean = isFromRequired;
            let isMessageReq: boolean = isMessageRequired;
            let isSubjectReq: boolean = isSubjectRequired;
            let isToReq: boolean = isToRequired;

            switch (event.target.id) {
                case 'txtMessage':
                    if (event.target.value === '') {
                        isMessageReq = true;
                    }
                    else {
                        isMessageReq = false;
                    }
                    notificationsTypesSetup.message = String(event.target.value);
                    break;
                case 'txtFrom':
                    if (event.target.value === '') {
                        isFromReq = true;
                    }
                    else {
                        isFromReq = false;
                    }
                    notificationsTypesSetup.from = String(event.target.value);
                    break;
                case 'txtTo':
                    if (event.target.value === '') {
                        isToReq = true;
                    }
                    else {
                        isToReq = false;
                    }
                    notificationsTypesSetup.to = String(event.target.value);
                    break;
                case 'txtCco':
                    if (event.target.value === '') {
                        isCcoReq = true;
                    }
                    else {
                        isCcoReq = false;
                    }
                    notificationsTypesSetup.cco = String(event.target.value);
                    break;
                case 'txtSubject':
                    if (event.target.value === '') {
                        isSubjectReq = true;
                    }
                    else {
                        isSubjectReq = false;
                    }
                    notificationsTypesSetup.subject = String(event.target.value);
                    break;
            }
            this.setState({
                isCcoRequired: isCcoReq,
                isFromRequired: isFromReq,
                isMessageRequired: isMessageReq,
                isSubjectRequired: isSubjectReq,
                isToRequired: isToReq,
                notificationsTypesSetup: notificationsTypesSetup
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
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
    // #endregion Error Functions

    // #region Functions
    private getAreaName(area: number): string {
        const {
            resources
        } = this.state;

        let areaName: string = '';
        if (resources) {
            switch (area) {
                case 0:
                    areaName = resources.lblAdmissions;
                    break;

                case 1:
                    areaName = resources.lblAdvising;
                    break;

                case 2:
                    areaName = resources.lblConEd;
                    break;

                case 3:
                    areaName = resources.lblCourseManagement;
                    break;

                case 4:
                    areaName = resources.lblFinances;
                    break;

                case 5:
                    areaName = resources.lblProfile;
                    break;

                case 6:
                    areaName = resources.lblRequests;
                    break;

                case 7:
                    areaName = resources.lblSignIn;
                    break;

                case 8:
                    areaName = resources.lblTradRegistration;
                    break;

                case 9:
                    areaName = resources.lblTranscriptRequest;
                    break;

                case 10:
                    areaName = resources.lblUsers;
                    break;

                case 11:
                    areaName = resources.lblOnlineDonation;
                    break;

                case 12:
                    areaName = resources.lblSharedAccess;
                    break;

                case 13:
                    areaName = resources.lblSignIn;
                    break;
            }
        }
        return areaName;
    }

    // #region Resolvers
    private resolveGetApplications = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetApplications.name);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                this.setState({
                    applications: result.data.notificationApplications
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetApplications.name, e));
        }
    };

    private resolveGetNotificationsEvents = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNotificationsEvents.name);

            if (result?.status) {
                const notificationsEvents: INotificationsEvents[] = result.data;
                notificationsEvents.forEach((event) => {
                    event.areaName = this.getAreaName(event.area);
                })
                notificationsEvents.sort((eventA: INotificationsEvents, eventB: INotificationsEvents): number => {
                    if (eventA.areaName && eventB.areaName) {
                        if (eventA.areaName > eventB.areaName) {
                            return 1;
                        }
                        if (eventA.areaName < eventB.areaName) {
                            return -1;
                        }
                    }
                    return 0;
                })
                LayoutActions.hidePageLoader();
                this.setState({
                    notificationsEvents: notificationsEvents
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNotificationsEvents.name, e));
        }
    };

    private resolveGetNotificationsEventsDetails = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNotificationsEventsDetails.name);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                LayoutActions.showPageLoader();
                Requests.getTypes(this.resolveGetTypes, this.logError);
                this.setState({
                    notificationsEventsDetails: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNotificationsEventsDetails.name, e));
        }
    };

    private resolveGetTypes = (json: string) => {
        try {
            const {
                eventId
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTypes.name);

            if (result?.status) {
                this.setState({
                    notificationsTypes: result.data
                });
                Requests.getTypesSetup(eventId, 1, this.resolveGetTypesSetup, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTypes.name, e));
        }
    };

    private resolveGetTypesSetup = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetTypesSetup.name);

            LayoutActions.hidePageLoader();
            if (result?.status) {
                if (result.data) {
                    this.setState({
                        isSetupShow: true,
                        notificationsTypesSetup: result.data
                    });
                }
                else {
                    this.setState({
                        isSetupShow: true,
                        notificationsTypesSetup: {}
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetTypesSetup.name, e));
        }
    };

    private resolvePostSaveSetup = (json: string) => {
        try {
            const {
                applicationSelected
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSetup.name);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
                if (applicationSelected) {
                    LayoutActions.showPageLoader();
                    Requests.getEvents(Number(applicationSelected.value), this.resolveGetNotificationsEvents, this.logError);
                }

                this.setState({
                    isCcoRequired: false,
                    isFromRequired: false,
                    isMessageRequired: false,
                    isSetupShow: false,
                    isSubjectRequired: false,
                    isToRequired: false,
                    notificationsTypesSetup: {}
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSetup.name, e));
        }
    };

    private resolvePostUpdateEvent = (json: string) => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostUpdateEvent.name);

            if (result?.status) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                if (resourcesLayout) {
                    LayoutActions.setAlert({
                        message: resourcesLayout.lblSuccessSave,
                        messageType: ResultType.success,
                        snackbar: true
                    } as IAlert);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostUpdateEvent.name, e));
        }
    };

    private resolveLayoutReady = () => {
        try {
            const {
                resources
            } = this.state;

            if (resources) {
                document.title = resources.lblPageTitle;
                Requests.getApplcations(this.resolveGetApplications, this.logError);
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
        const resources: INotificationsSetupResources | undefined = LayoutStore.getResources();

        if (ready) {
            this.setState({
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
            areaName,
            componentError,
            isSetupShow,
            applications,
            applicationSelected,
            isCcoRequired,
            isFromRequired,
            isMessageRequired,
            isSubjectRequired,
            isToRequired,
            notificationsEvents,
            notificationsEventsDetails,
            notificationsTypes,
            notificationsTypesSetup,
            typeSelected,

            resources
        } = this.state;

        let emptyOption: IDropDownOption = {
            description: '',
            value: -1
        };

        const resourcesLayout = LayoutStore.getResourcesLayout();
        if (resourcesLayout) {
            emptyOption = {
                description: resourcesLayout.lblDropDownEmptyText,
                value: -1
            };
        }

        const contentEvents: JSX.Element[] | undefined = [];
        let contentTitle: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        let emptyContent: JSX.Element | undefined;
        if (!componentError && resources) {
            if (applications) {
                applications.forEach(application => {
                    if (application.value === 0) {
                        application.description = resources.lblSelfService;
                    }
                    else {
                        application.description = resources.lblPum;
                    }
                    applications.push();
                });
            }

            if (notificationsEvents && notificationsEvents.length > 0) {
                contentTitle = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h2">
                                    {resources.lblAreas}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                    </>
                );
                notificationsEvents.forEach((events, index) => {
                    contentEvents.push(
                        <AreasList
                            key={`eventList_${index}`}
                            areasList={events}
                            index={index}
                            onChangeEnableDisable={this.onChangeEnableDisable}
                            onClickSetup={this.onClickSetup}
                            resources={resources}
                        />
                    );
                });
                emptyContent = undefined;
            }
            else {
                emptyContent = (
                    <Illustration
                        color="secondary"
                        name="no-search-results"
                        text={resources.lblNoApplication}
                    />
                );
            }

            if (isSetupShow && notificationsEventsDetails && notificationsTypes && notificationsTypesSetup) {
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                <AreasSetup
                                    key="areasSetup"
                                    areasList={notificationsEventsDetails}
                                    areaName={areaName}
                                    isCcoRequired={isCcoRequired}
                                    isFromRequired={isFromRequired}
                                    isMessageRequired={isMessageRequired}
                                    isSubjectRequired={isSubjectRequired}
                                    isToRequired={isToRequired}
                                    notificationsTypes={notificationsTypes}
                                    notificationsTypesSetup={notificationsTypesSetup}
                                    typeSelected={typeSelected}
                                    onCancel={this.onCancel}
                                    onChangeEnable={this.onChangeEnable}
                                    onChangeDropdown={this.onChangeDropdown}
                                    onClickChip={this.onClickChip}
                                    onClickChipSubject={this.onClickChipSubject}
                                    onSave={this.onSave}
                                    onTextFieldChange={this.onTextFieldChange}
                                    resources={resources}
                                />
                            </CardContent>
                        </Card>
                    </>
                );
            }
            else {
                contentPage = (
                    <>
                        <Card>
                            <CardContent>
                                <Grid container>
                                    <Grid item xs={12} md={4}>
                                        <Dropdown
                                            emptyOption={emptyOption}
                                            id="ddlApplication"
                                            label={resources.lblApplication}
                                            options={applications}
                                            value={applicationSelected && applicationSelected.value >= 0 ?
                                                applicationSelected.value : emptyOption.value}
                                            onChange={this.onChangeDropdown}
                                        />
                                    </Grid>
                                </Grid>
                                <br />
                                {contentTitle}
                                {contentEvents}
                                {emptyContent}
                            </CardContent>
                        </Card>
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
            </Layout>
        );
    }
}

const NotificationsSetupViewWithLayout = withLayout(NotificationsSetupView);
// #endregion Component

// RenderDOM: Component
ReactDOM.render(<NotificationsSetupViewWithLayout />, document.getElementById('root'));