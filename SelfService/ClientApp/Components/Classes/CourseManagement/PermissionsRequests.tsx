/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PermissionsRequests.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import PermissionRequestDetail, {
    IPermissionRequestDetailResProps
} from '@hedtech/powercampus-design-system/react/components/Section/PermissionRequestDetail';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableEditableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import EmailModal from '../../Generic/EmailModal';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IEmailSettings } from '../../../Types/InstitutionSettings/IEmailSettings';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPermissionRequestInfo } from '@hedtech/powercampus-design-system/types/Student/IPermissionRequestInfo';
import { IPermissionRequest } from '../../../Types/Classes/IPermissionRequest';
import { IPermissionRequestModel } from '../../../Types/Students/IPermissionRequestModel';
import { IPermissionRequestsResources } from '../../../Types/Resources/Classes/IPermissionRequestsResources';
import { IStudentPermissionRequest } from '../../../Types/Classes/IStudentPermissionRequest';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Classes/PermissionRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import Store from '../../../Stores/CourseManagementStore';
// #endregion Imports

// #region Types
export interface IPermissionsRequestsProps {
    hasDossierClaim: boolean;
    myPosition: number;
    sectionId: number;
    onViewDossier?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

interface IPermissionsRequestsRes extends IPermissionRequestsResources {
    permissionRequestDetail: IPermissionRequestDetailResProps;
}

interface IPermissionsRequestsState {
    allSelected: boolean;
    componentError: boolean;
    isLoading: boolean;
    isLoadingSave: boolean;
    isStudentSelected: boolean;
    permissionRequestSelected?: IPermissionRequestInfo;
    permissionRequestsList?: IPermissionRequest;
    resources?: IPermissionsRequestsRes;
    selectedFilter: number;
    selectFilter?: IDropDownOption[];
    selectStatus?: IDropDownOption[];

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
    listTyle: {
        [theme.breakpoints.down('sm')]: {
            display: 'block!important'
        },
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },
    marginIcons: {
        marginLeft: Tokens.spacing30,
        marginRight: Tokens.spacing30
    },
    marginLeft: {
        marginLeft: Tokens.sizingXSmall
    },
    marginRight: {
        marginRight: Tokens.sizingXxLarge
    },
    nameStyle: {
        marginBottom: Tokens.spacing40,
        marginTop: Tokens.spacing40
    },
    rowDetail: {
        backgroundColor: Tokens.colorBackgroundDefault
    },
    showChatContainer: {
        [theme.breakpoints.down('md')]: {
            width: 'auto'
        }
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(5)': {
                width: '60px'
            }
        }
    }
}));

type PropsWithStyles = IPermissionsRequestsProps & WithStyles<typeof styles>;
// #endregion

// #region Component
class PermissionsRequests extends React.Component<PropsWithStyles, IPermissionsRequestsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IPermissionsRequestsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Classes';
        this.idPage = 'PermissionRequests';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IPermissionsRequestsState {
        let resources: IPermissionsRequestsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = Store.getResources(this.props.myPosition);
        }
        return {
            allSelected: false,
            componentError: false,
            isLoading: true,
            isLoadingSave: false,
            isStudentSelected: false,
            resources: resources,
            selectedFilter: 3,

            // #region Email Modal
            openEmailModal: false,
            recipientsEmailAddresses: []
            // #endregion Email Modal
        };
    }

    // #region Events
    private onCancelEdit = (id: number): void => {
        try {
            const {
                permissionRequestSelected
            } = this.state;

            if (permissionRequestSelected && permissionRequestSelected.id === id) {
                permissionRequestSelected.editable = false;
                permissionRequestSelected.modified = false;
                permissionRequestSelected.permissionComments = permissionRequestSelected.permissionCommentsBackup;
                permissionRequestSelected.permissionCommentsBackup = '';
                this.setState({
                    permissionRequestSelected: permissionRequestSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelEdit.name, e));
        }
    };

    private onSelectAll = (): void => {
        try {
            const {
                allSelected,
                isStudentSelected,
                permissionRequestsList
            } = this.state;

            if (permissionRequestsList?.students) {
                let selectAll: boolean = false;
                if (allSelected || !isStudentSelected) {
                    selectAll = !allSelected;
                }
                permissionRequestsList.students.forEach(student => student.checked = selectAll);
                this.setState({
                    allSelected: selectAll,
                    isStudentSelected: selectAll,
                    permissionRequestsList: permissionRequestsList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectAll.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>, permissionList: IStudentPermissionRequest[]): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            if (permissionList) {
                const personId: number = Number(event.currentTarget.dataset.id);
                const student: IStudentPermissionRequest | undefined = permissionList.find(a => a.personId === personId);
                if (student) {
                    student.checked = !student.checked;
                    const isStudentSelected: boolean = permissionList.findIndex(student => student.checked) >= 0;
                    const oneNotSelected: boolean = permissionList.findIndex(student => !student.checked) >= 0;
                    this.setState({
                        allSelected: !oneNotSelected,
                        isStudentSelected: isStudentSelected,
                        permissionRequestsList: permissionRequestsList
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeCommentsForEdit = (id: number, value: string): void => {
        try {
            const {
                permissionRequestSelected
            } = this.state;

            if (permissionRequestSelected && permissionRequestSelected.id === id) {
                permissionRequestSelected.permissionComments = value;
                permissionRequestSelected.modified = true;
                permissionRequestSelected.error = false;
                this.setState({
                    permissionRequestSelected: permissionRequestSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCommentsForEdit.name, e));
        }
    };

    private onChangeFilter = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            if (optionSelected) {
                if (permissionRequestsList?.students) {
                    permissionRequestsList.students.forEach(student => student.checked = false);
                }
                this.setState({
                    allSelected: false,
                    isStudentSelected: false,
                    selectedFilter: Number(optionSelected.value)
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFilter.name, e));
        }
    };

    private onChangeStatus = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            const data: string[] = id.split('_');

            if (permissionRequestsList?.students) {
                permissionRequestsList.students.forEach(student => {
                    if (student.personId === Number(data[2])) {
                        if (!student.modified) {
                            student.statusPermisionRequestBackup = student.statusPermisionRequest;
                        }
                        student.modified = true;
                        student.statusPermisionRequest = Number(optionSelected.value);
                    }
                });
                this.setState({
                    permissionRequestsList: permissionRequestsList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeStatus.name, e));
        }
    };

    private onEdit = (id: number): void => {
        try {
            const {
                permissionRequestSelected
            } = this.state;

            if (permissionRequestSelected && permissionRequestSelected.id === id) {
                // Edit
                if (permissionRequestSelected.permissionComments
                    && permissionRequestSelected.permissionComments.trim() !== '') {
                    const permissionRequestModified: IPermissionRequestModel[] = [];
                    permissionRequestModified.push({
                        comments: permissionRequestSelected.permissionComments,
                        id: permissionRequestSelected.id,
                        status: permissionRequestSelected.statusPermisionRequest
                    } as IPermissionRequestModel);
                    LayoutActions.setLoading(true);
                    Requests.editPermissionRequests(permissionRequestModified, this.resolveEditPermissionRequests);
                }
                else {
                    permissionRequestSelected.error = true;
                    this.setState({
                        permissionRequestSelected: permissionRequestSelected
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEdit.name, e));
        }
    };

    private onEnableEdit = (id: number): void => {
        try {
            const {
                permissionRequestSelected,
                permissionRequestsList
            } = this.state;

            if (permissionRequestSelected && permissionRequestSelected.editable) {
                permissionRequestSelected.editable = false;
                permissionRequestSelected.permissionComments = permissionRequestSelected.permissionCommentsBackup;
                permissionRequestSelected.permissionCommentsBackup = '';
                this.setState({
                    permissionRequestSelected: permissionRequestSelected
                });
            }

            if (permissionRequestsList && permissionRequestsList.students) {
                let permissionRequestInfo: IPermissionRequestInfo | undefined;
                permissionRequestsList.students.forEach(student => {
                    if (student.permissionRequestInfo) {
                        student.permissionRequestInfo.forEach(info => {
                            if (!Boolean(permissionRequestInfo) && info.id === id) {
                                permissionRequestInfo = info;
                            }
                        });
                    }
                });
                if (permissionRequestInfo) {
                    permissionRequestInfo.editable = true;
                    permissionRequestInfo.permissionCommentsBackup = permissionRequestInfo.permissionComments;
                    this.setState({
                        permissionRequestSelected: permissionRequestInfo
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEnableEdit.name, e));
        }
    };

    private onOpenChat = (event: any): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            const data: string[] = event.target.id.split('_');

            if (permissionRequestsList && permissionRequestsList.students) {
                permissionRequestsList.students.forEach(student => {
                    if (student.personId === Number(data[2])) {
                        student.showChat = !student.showChat;
                    }
                });
                this.setState({
                    permissionRequestsList: permissionRequestsList
                });
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenChat.name, e));
        }
    };

    private onSave = (): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            if (permissionRequestsList && permissionRequestsList.students) {
                const permissionRequestModified: IPermissionRequestModel[] = [];
                let myPermissionRequest: IPermissionRequestInfo | undefined;
                permissionRequestsList.students.forEach(student => {
                    if (student.modified) {
                        myPermissionRequest = student.permissionRequestInfo.find(pri => pri.isMyInfo);
                        if (myPermissionRequest) {
                            permissionRequestModified.push({
                                comments: myPermissionRequest.modified ?
                                    myPermissionRequest.permissionCommentsBackup :
                                    myPermissionRequest.permissionComments,
                                id: myPermissionRequest.id,
                                status: student.statusPermisionRequest
                            } as IPermissionRequestModel);
                        }
                    }
                });
                if (permissionRequestModified.length > 0) {
                    this.showLoaderSave();
                    Requests.editPermissionRequests(permissionRequestModified, this.resolveEditPermissionRequests);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    // #region Email Modal
    private onOpenEmailModal = (emailAddresses: string[]): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            if (permissionRequestsList) {
                const emailSettings: IEmailSettings = permissionRequestsList.emailSettings;
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

    // #region Functions
    private setSelects = (): void => {
        try {
            const {
                resources
            } = this.state;
            if (resources) {
                const selectFilter: IDropDownOption[] = [
                    { value: '3', description: resources.lblViewAll },
                    { value: '0', description: resources.lblApproved },
                    { value: '1', description: resources.lblDenied },
                    { value: '2', description: resources.lblWaiting }
                ];
                const selectStatus: IDropDownOption[] = [
                    { value: '0', description: resources.lblApproved },
                    { value: '1', description: resources.lblDenied },
                    { value: '2', description: resources.lblWaiting }
                ];

                this.setState({
                    selectFilter: selectFilter,
                    selectStatus: selectStatus
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setSelects.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
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
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetPermissionRequests = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetPermissionRequests.name, this.hideAllLoaders);

            if (result?.status) {
                const permissionRequestsList: IPermissionRequest = result.data;
                this.setState({
                    permissionRequestsList: permissionRequestsList
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetPermissionRequests.name, e));
        }
    };

    private resolveEditPermissionRequests = (json: string): void => {
        try {
            const {
                permissionRequestsList
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveEditPermissionRequests.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    if (permissionRequestsList && permissionRequestsList.students) {
                        let myPermissionRequest: IPermissionRequestInfo | undefined;
                        permissionRequestsList.students.forEach(student => {
                            if (student.modified) {
                                myPermissionRequest = student.permissionRequestInfo.find(pri => pri.isMyInfo);
                                if (myPermissionRequest) {
                                    myPermissionRequest.statusPermisionRequest = student.statusPermisionRequest;
                                }
                                student.modified = false;
                                student.statusPermisionRequestBackup = 0;
                            }
                        });
                        permissionRequestsList.modified = false;

                        this.setState({
                            permissionRequestsList: permissionRequestsList
                        });
                    }
                    const resourcesLayout = LayoutStore.getResourcesLayout();
                    if (resourcesLayout) {
                        LayoutActions.setAlert({
                            message: resourcesLayout.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                }
                LayoutActions.setLoading(false);
                this.hideLoaderSave();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveEditPermissionRequests.name, e));
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
                }, this.setSelects);
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
            else {
                this.setSelects();
            }

            Requests.getPermissionRequests(sectionId, this.resolveGetPermissionRequests);
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
            hasDossierClaim,
            onViewDossier
        } = this.props;

        const {
            allSelected,
            componentError,
            isLoading,
            isLoadingSave,
            isStudentSelected,
            permissionRequestsList,
            resources,
            selectedFilter,
            selectFilter,
            selectStatus,

            // #region Email Modal
            recipientsEmailAddresses,
            openEmailModal
            // #endregion Email Modal
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let emailModal: JSX.Element | undefined;
        if (isLoading) {
            contentPage = (
                <ContainerLoader id="ldrPermissionRequests" height="md" />
            );
        }
        else if (!componentError && resources) {
            if (permissionRequestsList && permissionRequestsList.students) {
                const resourcesLayout = LayoutStore.getResourcesLayout();
                let textShowChat: string;

                let statusSelected: IStudentPermissionRequest[] = [];

                if (permissionRequestsList.students) {
                    if (selectedFilter === 3) {
                        statusSelected = permissionRequestsList.students;
                    }
                    else if (permissionRequestsList.modified) {
                        switch (selectedFilter) {
                            case 0:
                                statusSelected = permissionRequestsList.students.filter(stud => stud.statusPermisionRequestBackup === 0);
                                break;

                            case 1:
                                statusSelected = permissionRequestsList.students.filter(stud => stud.statusPermisionRequestBackup === 1);
                                break;

                            case 2:
                                statusSelected = permissionRequestsList.students.filter(stud => stud.statusPermisionRequestBackup === 2);
                                break;
                        }
                    }
                    else {
                        switch (selectedFilter) {
                            case 0:
                                statusSelected = permissionRequestsList.students.filter(stud => stud.statusPermisionRequest === 0);
                                break;

                            case 1:
                                statusSelected = permissionRequestsList.students.filter(stud => stud.statusPermisionRequest === 1);
                                break;

                            case 2:
                                statusSelected = permissionRequestsList.students.filter(stud => stud.statusPermisionRequest === 2);
                                break;
                        }
                    }
                }

                const onClickEmail = (): void => {
                    const emails: string[] = [];
                    statusSelected.forEach(status => {
                        if (status.checked && status.emailAddress) {
                            emails.push(status.emailAddress);
                        }
                    });

                    if (permissionRequestsList.emailSettings.emailProvider === EmailProviderOption.External) {
                        window.open(Format.toString(permissionRequestsList.emailSettings.staffUrl, [emails.join(permissionRequestsList.emailSettings.staffSeparator)]),
                            permissionRequestsList.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
                    }
                    else {
                        this.onOpenEmailModal(emails);
                    }
                };

                contentPage = (
                    <>
                        <Grid container spacing={3}>
                            <Grid item xs sm={5} md={4} lg={3}>
                                <Dropdown
                                    id="ddlFilter"
                                    label={resources.lblSelectStatus}
                                    options={selectFilter}
                                    value={selectedFilter.toString()}
                                    onChange={this.onChangeFilter}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Hidden smDown>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs>
                                    <Checkbox
                                        checked={allSelected || isStudentSelected}
                                        classes={{
                                            focused: classes.checkboxHeader,
                                            root: classes.checkboxHeader
                                        }}
                                        id="chkSelectAll"
                                        indeterminate={!allSelected && isStudentSelected}
                                        inputProps={{
                                            'aria-label': this.layoutResources?.lblSelectAll
                                        }}
                                        onChange={this.onSelectAll}
                                    />
                                    <Tooltip
                                        id="tltEmailSelected"
                                        title={resources.lblEmailButton}
                                        placement="top"
                                    >
                                        <div className={classes.inline}>
                                            <IconButton
                                                alt={resources.lblEmailButton}
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
                            </Grid>
                        </Hidden>
                        <Hidden mdUp>
                            <Grid container alignItems="center" justifyContent="space-between">
                                <Grid item xs>
                                    <Checkbox
                                        checked={allSelected || isStudentSelected}
                                        classes={{
                                            focused: classes.checkboxHeader,
                                            root: classes.checkboxHeader
                                        }}
                                        id="chkSelectAll"
                                        indeterminate={!allSelected && isStudentSelected}
                                        inputProps={{
                                            'aria-label': this.layoutResources?.lblSelectAll
                                        }}
                                        onChange={this.onSelectAll}
                                    />
                                    <Tooltip
                                        id="tltEmailSelected"
                                        title={resources.lblEmailButton}
                                        placement="top"
                                    >
                                        <div className={classes.inline}>
                                            <IconButton
                                                alt={resources.lblEmailButton}
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
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <IconButton
                                                alt={resources.lblAddStudent}
                                                classes={{ root: classes.iconHeader }}
                                                color="secondary"
                                                // onClick={}
                                                id="AddBtn"
                                            >
                                                <Icon large name="add" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Hidden>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Text>
                                    {resources.lblPrerequisits}
                                    {permissionRequestsList.prerequisites}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblPermissionRequests"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblNameDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblCurriculumDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblClassLevelDetail}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblStatusDetail}
                                    </TableCell>
                                    <Hidden smDown>
                                        <TableCell />
                                    </Hidden>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {statusSelected.map((row, i) => {
                                    const onCheckClick = (event: any): void => {
                                        this.onChangeCheckbox(event, statusSelected);
                                    };

                                    if (resourcesLayout) {
                                        textShowChat = row.showChat ? resourcesLayout.lblShowLess : resourcesLayout.lblShowMore;
                                    }
                                    else {
                                        textShowChat = '';
                                    }

                                    return (
                                        <React.Fragment
                                            key={`studentsPermissionList_${row.personId}_${i}`}
                                        >
                                            <TableRow>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <Grid container spacing={0} className={classes.showChatContainer}>
                                                        <Grid item xs>
                                                            <AvatarText
                                                                ButtonProps={hasDossierClaim ? {
                                                                    'data-id': row.personId,
                                                                    id: `btnStudentName_${i}`,
                                                                    onClick: onViewDossier
                                                                } : undefined}
                                                                CheckboxProps={{
                                                                    checked: Boolean(row.checked),
                                                                    id: `chkStudentName_${i}`,
                                                                    inputProps: {
                                                                        'aria-label': Format.toString(resources.formatSelectStudent, [row.fullName]),
                                                                        'data-id': row.personId
                                                                    },
                                                                    onChange: onCheckClick
                                                                }}
                                                                avatarInfo={row}
                                                                complement={row.withdrawn ? (
                                                                    <StatusLabel
                                                                        id={`stsLblStudentStatus_${i}`}
                                                                        text={resources.lblWithdrawn}
                                                                        type="draft"
                                                                    />
                                                                ) : undefined}
                                                                id={`avtStudent_${i}`}
                                                            />
                                                        </Grid>
                                                        <Hidden mdUp>
                                                            <Grid item>
                                                                <Tooltip
                                                                    id="showCourseCredit"
                                                                    title={textShowChat}
                                                                    aria-label={textShowChat}
                                                                >
                                                                    <IconButton
                                                                        className={classes.marginIcons}
                                                                        color={row.showChat ? 'secondary' : 'primary'}
                                                                        id={`iconClass_${i}_${row.personId}`}
                                                                        onClick={this.onOpenChat}
                                                                    >
                                                                        <Icon name="info" />
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Hidden>
                                                    </Grid>
                                                </TableCell>
                                                <TableCell
                                                    columnName={resources.lblCurriculumDetail}
                                                >
                                                    <div>
                                                        <ul className={classes.listTyle}>
                                                            {row.studentAcademicRecords ? row.studentAcademicRecords.map((student, j) => (
                                                                <li
                                                                    className={classes.nameStyle}
                                                                    key={`permissionDesc_${row.personId}_${j}`}
                                                                >
                                                                    {student.pdcDescription}
                                                                </li>
                                                            )) : undefined}
                                                        </ul>
                                                    </div>
                                                </TableCell>
                                                <TableCell
                                                    columnName={resources.lblClassLevelDetail}
                                                >
                                                    <div>
                                                        <ul className={classes.listTyle}>
                                                            {row.studentAcademicRecords ? row.studentAcademicRecords.map((student, j) => (
                                                                <li
                                                                    className={classes.nameStyle}
                                                                    key={`permissionClass_${row.personId}_${j}`}
                                                                >
                                                                    {student.classLevel}
                                                                </li>
                                                            )) : undefined}
                                                        </ul>
                                                    </div>
                                                </TableCell>
                                                <TableEditableCell
                                                    columnName={resources.lblStatusDetail}
                                                    content={(
                                                        <ul className={classes.listTyle}>
                                                            <li>
                                                                {row.statusPermisionRequest === 0 ?
                                                                    resources.lblApproved : row.statusPermisionRequest === 1 ?
                                                                        resources.lblDenied : resources.lblWaiting}
                                                            </li>
                                                        </ul>
                                                    )}
                                                    edit={!row.hasOverride}
                                                    editableComponent={(
                                                        <Dropdown
                                                            id={`ddlStatus_${i}_${row.personId}`}
                                                            label=""
                                                            options={selectStatus}
                                                            size="small"
                                                            value={row.statusPermisionRequest.toString()}
                                                            onChange={this.onChangeStatus}
                                                        />
                                                    )}
                                                />
                                                <Hidden smDown>
                                                    <TableCell>
                                                        <Tooltip
                                                            id="showCourseCredit"
                                                            title={textShowChat}
                                                            aria-label={textShowChat}
                                                        >
                                                            <IconButton
                                                                className={classes.marginIcons}
                                                                color={row.showChat ? 'secondary' : 'primary'}
                                                                id={`iconClass_${i}_${row.personId}`}
                                                                onClick={this.onOpenChat}
                                                            >
                                                                <Icon name="info" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </TableCell>
                                                </Hidden>
                                            </TableRow>
                                            {row.showChat ? (
                                                <TableRow>
                                                    <TableCell colSpan={6}>
                                                        <PermissionRequestDetail
                                                            chatTitleAdorned
                                                            generalStatus={row.statusPermisionRequest}
                                                            id={`permissionRequestDetail_${row.personId}`}
                                                            isFaculty
                                                            permissionRequestInfo={row.permissionRequestInfo}
                                                            resources={resources.permissionRequestDetail}
                                                            resourcesPermissionRequestStatus={resources.permissionRequestStatus}
                                                            onCancelEdit={this.onCancelEdit}
                                                            onChangeCommentsForEdit={this.onChangeCommentsForEdit}
                                                            onEdit={this.onEdit}
                                                            onEnableEdit={this.onEnableEdit}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ) : undefined}
                                        </React.Fragment>
                                    );
                                }
                                )}
                            </TableBody>
                        </Table>
                        <br />
                        {
                            statusSelected.length > 0 ?
                                (
                                    <Media query={Tokens.mqXSmall}>
                                        {(matches: boolean): JSX.Element => matches ? (
                                            <Grid container spacing={3}>
                                                <Grid item xs={12}>
                                                    <Text display="inline">
                                                        {Format.toString(resources.formatTotalStudents, [statusSelected.length])}
                                                    </Text>
                                                </Grid>
                                                <Grid item xs={12}>
                                                    <ButtonGroup id="btnGroupPermissionList">
                                                        <Button
                                                            fluid
                                                            id="btnSaveStudent"
                                                            loading={isLoadingSave}
                                                            onClick={this.onSave}
                                                        >
                                                            {resources.lblSaveButton}
                                                        </Button>
                                                    </ButtonGroup>
                                                </Grid>
                                            </Grid>
                                        ) : (
                                            <Grid container justifyContent="space-between">
                                                <Grid item>
                                                    <ButtonGroup id="btnGroupPermissionList">
                                                        <Button
                                                            id="btnSaveStudent"
                                                            loading={isLoadingSave}
                                                            onClick={this.onSave}
                                                        >
                                                            {resources.lblSaveButton}
                                                        </Button>
                                                    </ButtonGroup>
                                                </Grid>
                                                <Grid item>
                                                    <Text align="right" display="inline">
                                                        {Format.toString(resources.formatTotalStudents, [statusSelected.length])}
                                                    </Text>
                                                </Grid>
                                            </Grid>
                                        )
                                        }
                                    </Media>
                                )
                                : (
                                    <Text>
                                        {resources.lblNoResultsByStatus}
                                    </Text>
                                )
                        }
                    </>
                );

                if (openEmailModal) {
                    emailModal = (
                        <EmailModal
                            emailSettings={permissionRequestsList.emailSettings}
                            onClose={this.onCloseEmailModal}
                            recipientsEmailAddresses={recipientsEmailAddresses}
                        />
                    );
                }
            }
            else {
                contentPage = (
                    <Illustration
                        color="secondary"
                        height="lg"
                        internalName="no-enrolled"
                        text={resources.lblNoResults}
                    />
                );
            }
        }

        return (
            <>
                {contentPage}
                {emailModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(PermissionsRequests);