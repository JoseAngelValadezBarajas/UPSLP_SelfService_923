/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: OfficesSetup.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Table, { TableBody, TableHead, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import OfficesSetupAddModal from './OfficesSetupAddModal';
import OfficesSetupEditModal, { IOfficesSetupEditModalResProps } from './OfficesSetupEditModal';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IOfficePermission } from '../../../Types/Administration/IOfficePermission';
import { IOfficesSetupResources } from '../../../Types/Resources/Administration/IOfficesSetupResources';
import { IStaffMember } from '../../../Types/Administration/IStaffMember';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/OfficesSetup';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IOfficesSetupProps {
    hasDossierClaim: boolean;
    lblSuccessSave: string;
}

interface IOfficesSetupRes extends IOfficesSetupResources {
    officesSetupEditModal: IOfficesSetupEditModalResProps;
}

interface IOfficesSetupState {
    addStaffModalOpen: boolean;
    hasActiveOffices: boolean;
    isLoading: boolean;
    isLoadingPermissions: boolean;
    isLoadingStaff: boolean;
    officeSelected?: IDropDownOption;
    officesWithStaff?: IDropDownOption[];
    openDeleteAllStaffModal: boolean;
    openDeleteStaffModal: boolean;
    openEditStaffModal: boolean;
    resources?: IOfficesSetupRes;
    selectedStaffMember?: IStaffMember;
    selectedStaffPermissions?: IOfficePermission[];
    staffMembers?: IStaffMember[];

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    totalResults: number;
    // #endregion Pagination

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier
}

const styles = () => createStyles({
    table: {
        // Width
        '& > thead > tr > th:nth-child(1)': {
            width: '90%'
        },
        '& > thead > tr > th:nth-child(2)': {
            width: '10%'
        }
    }
});

type PropsWithStyles = IOfficesSetupProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class OfficesSetup extends React.Component<PropsWithStyles, IOfficesSetupState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private isAdded: boolean;
    private isDeleted: boolean;
    private deleteOfficePermission?: IOfficePermission;

    // #region Pagination
    private initialPage: number;
    private initialRowsPerPage: number;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IOfficesSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'OfficesSetup';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.isAdded = false;
        this.isDeleted = false;

        // #region Pagination
        this.initialPage = 0;
        this.initialRowsPerPage = 5;
        this.rowsPerPageOptions = [this.initialRowsPerPage, 10, 15, 20, 25, 50];
        // #endregion Pagination

        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IOfficesSetupState {
        let isLoading: boolean = true;
        let resources: IOfficesSetupRes | undefined;
        if (this.state) {
            isLoading = this.state.isLoading;
            resources = this.state.resources;
        }
        return {
            addStaffModalOpen: false,
            hasActiveOffices: false,
            isLoading: isLoading,
            isLoadingPermissions: false,
            isLoadingStaff: false,
            openDeleteAllStaffModal: false,
            openDeleteStaffModal: false,
            openEditStaffModal: false,
            resources: resources,

            // #region Pagination
            page: this.initialPage,
            rowsPerPage: this.initialRowsPerPage,
            rowsPerPageOptions: [],
            totalResults: 0,
            // #endregion Pagination

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false
            // #endregion Dossier
        };
    }

    // #region Events

    private onChangeOffice = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const page: number = this.initialPage;
            const rowsPerPage: number = this.initialRowsPerPage;

            this.setState({
                officeSelected: optionSelected,
                page: page,
                rowsPerPage: rowsPerPage
            });

            if (optionSelected && optionSelected.value !== -1) {
                this.setState({
                    isLoadingStaff: true
                });
                Requests.getOfficeStaff(Number(optionSelected.value), page * rowsPerPage, rowsPerPage, this.resolveGetOfficeStaff);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeOffice.name, e));
        }
    };

    private onAddStaff = (): void => {
        try {
            this.setState({
                addStaffModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddStaff.name, e));
        }
    };

    private onCloseAddStaffModal = (): void => {
        try {
            this.setState({
                addStaffModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddStaffModal.name, e));
        }
    };

    private onFinishAdd = (): void => {
        try {
            this.setState({
                isLoadingStaff: true
            });

            if (this.layoutResources) {
                LayoutActions.setAlert({
                    message: this.layoutResources.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }

            const {
                officeSelected,
                page,
                rowsPerPage
            } = this.state;

            if (officeSelected && officeSelected.value !== -1) {
                this.isAdded = true;
                Requests.getOfficeStaff(Number(officeSelected.value), page * rowsPerPage, rowsPerPage, this.resolveGetOfficeStaff);
            }
            else {
                Requests.getOfficesWithStaff(this.resolveGetOfficesWithStaff);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishAdd.name, e));
        }
    };

    private onAdd = (personId: number, permissions: IOfficePermission[], resolver: any): void => {
        try {
            Requests.saveOfficeStaff(personId, permissions, resolver);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
        }
    };

    private onEditStaff = (event: any): void => {
        try {
            LayoutActions.showPageLoader();

            const {
                staffMembers
            } = this.state;

            const personId: number = Number(event.target.id.split('_')[1]);

            if (staffMembers && staffMembers.length > 0) {
                this.setState({
                    isLoadingPermissions: true,
                    selectedStaffMember: staffMembers.find(sm => sm.personId === personId)
                });

                Requests.getStaffPermissions(personId, this.resolveGetStaffPermissions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeOffice.name, e));
        }
    };

    private onCloseEditModal = (): void => {
        try {
            if (this.isDeleted) {
                const {
                    officeSelected
                } = this.state;

                const page: number = this.initialPage;
                const rowsPerPage: number = this.initialRowsPerPage;

                this.setState({
                    isLoadingStaff: true,
                    page: page,
                    rowsPerPage: rowsPerPage
                });

                if (officeSelected) {
                    Requests.getOfficeStaff(Number(officeSelected.value), page * rowsPerPage, rowsPerPage, this.resolveGetOfficeStaff);
                }
            }

            this.setState({
                openEditStaffModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEditModal.name, e));
        }
    };

    private onChangeStaffPermission = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                selectedStaffPermissions
            } = this.state;

            const completeId: string[] = event.target.id.split('_');
            const switchId: string = completeId[0];
            const staffMemberId: number = Number(completeId[1]);
            const newStatus: boolean = !Boolean(event.target.value);

            if (selectedStaffPermissions) {
                let officePermissionIndex = selectedStaffPermissions.findIndex(ssp => ssp.staffMemberId === staffMemberId);

                switch (switchId) {
                    case 'swtViewNotes':
                        selectedStaffPermissions[officePermissionIndex].isSwitchViewNotesLoading = true;
                        selectedStaffPermissions[officePermissionIndex].canViewNotes = newStatus;
                        break;
                    case 'swtEditTasks':
                        selectedStaffPermissions[officePermissionIndex].isSwitchEditTasksLoading = true;
                        selectedStaffPermissions[officePermissionIndex].canEditTasks = newStatus;
                        break;
                }

                this.setState({
                    selectedStaffPermissions
                });
                Requests.updateStaffPermission(selectedStaffPermissions[officePermissionIndex], this.resolveUpdateStaffPermission);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeStaffPermission.name, e));
        }
    };

    private onOpenDeleteModal = (permission: IOfficePermission) => {
        try {
            this.deleteOfficePermission = permission;

            this.setState({
                openDeleteStaffModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, e));
        }
    };

    private onCloseDeleteModal = () => {
        try {
            this.deleteOfficePermission = undefined;
            this.setState({
                openDeleteStaffModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, e));
        }
    };

    private onOpenDeleteAllModal = () => {
        try {
            this.setState({
                openDeleteAllStaffModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteAllModal.name, e));
        }
    };

    private onCloseDeleteAllModal = () => {
        try {
            this.setState({
                openDeleteAllStaffModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteAllModal.name, e));
        }
    };

    private onDeleteStaffPermission = () => {
        try {
            LayoutActions.showPageLoader();

            if (this.deleteOfficePermission?.staffMemberId) {
                Requests.deleteStaffPermission(this.deleteOfficePermission.staffMemberId, this.resolveDeleteStaffPermission);
            }

        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteStaffPermission.name, e));
        }
    }

    private onDeleteAllStaffPermissions = () => {
        try {
            LayoutActions.showPageLoader();

            const {
                selectedStaffMember
            } = this.state;

            if (selectedStaffMember?.personId) {
                Requests.deleteAllStaffPermissions(selectedStaffMember.personId, this.resolveDeleteAllStaffPermissions);
            }

            this.setState({
                openDeleteAllStaffModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteAllStaffPermissions.name, e));
        }
    }

    // #region Pagination
    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                officeSelected,
                rowsPerPage
            } = this.state;

            this.setState({
                isLoadingStaff: true,
                page: page
            });

            if (officeSelected && officeSelected.value !== -1) {
                Requests.getOfficeStaff(Number(officeSelected.value), page * rowsPerPage, rowsPerPage, this.resolveGetOfficeStaff);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                isLoadingStaff: true,
                page: this.initialPage,
                rowsPerPage: Number(event.target.value),
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    // #region Dossier
    private onCloseDossierModal = (): void => {
        try {
            this.setState({
                dossierPersonId: 0,
                openDossierModal: false
            });
            LayoutStore.abort();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDossierModal.name, e));
        }
    };

    private onViewDossier = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const personId: number = Number(event.currentTarget.dataset.id);
            this.setState({
                dossierPersonId: personId,
                openDossierModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewDossier.name, e));
        }
    };
    // #endregion Dossier

    // #endregion Events


    // #region Functions

    // #region Pagination
    private getRowsPerPageOptions(maxValue: number): number[] {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    }
    // #endregion Pagination

    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingStaff: false,
            isLoadingPermissions: false
        }, LayoutActions.hidePageLoader);
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json,
                this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                });

                Requests.getOfficesWithStaff(this.resolveGetOfficesWithStaff);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetOfficesWithStaff = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOfficesWithStaff.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    hasActiveOffices: result.data.hasActiveOffices,
                    officesWithStaff: result.data.officesWithStaff
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOfficesWithStaff.name, e));
        }
    };

    private resolveGetOfficeStaff = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOfficeStaff.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const staffMembers: IStaffMember[] = result.data.staffMembers;
                    const totalResults: number = result.data.overallCount;

                    if (staffMembers && staffMembers.length > 0) {
                        const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(totalResults);
                        this.setState({
                            staffMembers,
                            totalResults,
                            rowsPerPageOptions
                        }, () => {
                            if (this.isAdded || this.isDeleted) {
                                this.isAdded = false;
                                this.isDeleted = false;
                                Requests.getOfficesWithStaff(this.resolveGetOfficesWithStaff);
                            }
                            else {
                                this.hideAllLoaders();
                            }
                        });
                    }
                    else {
                        this.isDeleted = false;
                        this.setState({
                            officeSelected: undefined,
                        });
                        Requests.getOfficesWithStaff(this.resolveGetOfficesWithStaff);
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOfficeStaff.name, e));
        }
    };

    private resolveGetStaffPermissions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetStaffPermissions.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const selectedStaffPermissions: IOfficePermission[] = result.data.staffPermissions
                    this.setState({
                        openEditStaffModal: true,
                        selectedStaffPermissions: selectedStaffPermissions
                    }, () => {
                        if ((!Boolean(selectedStaffPermissions) || selectedStaffPermissions.length == 0) && this.isDeleted) {
                            this.onCloseEditModal();
                        }
                        this.hideAllLoaders();
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetStaffPermissions.name, e));
        }
    };

    private resolveUpdateStaffPermission = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveUpdateStaffPermission.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const {
                        selectedStaffPermissions
                    } = this.state;

                    if (selectedStaffPermissions) {
                        selectedStaffPermissions.map(permission => {
                            permission.isSwitchEditTasksLoading = false;
                            permission.isSwitchViewNotesLoading = false;
                        })
                    }

                    this.setState({
                        selectedStaffPermissions
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveUpdateStaffPermission.name, e));
        }
    };

    private resolveDeleteStaffPermission = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteStaffPermission.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    const {
                        selectedStaffMember
                    } = this.state;

                    LayoutActions.hidePageLoader();
                    if (this.layoutResources) {
                        LayoutActions.setAlert({
                            message: this.layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }

                    this.setState({
                        isLoadingPermissions: true,
                        openDeleteStaffModal: false
                    }, () => {
                        this.isDeleted = true;
                        if (selectedStaffMember) {
                            Requests.getStaffPermissions(selectedStaffMember.personId, this.resolveGetStaffPermissions)
                        }
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteStaffPermission.name, e));
        }
    };

    private resolveDeleteAllStaffPermissions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteAllStaffPermissions.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    if (this.layoutResources) {
                        LayoutActions.setAlert({
                            message: this.layoutResources.lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }

                    this.setState({
                        openDeleteAllStaffModal: false
                    }, () => {
                        this.isDeleted = true;
                        this.onCloseEditModal();
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteAllStaffPermissions.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            addStaffModalOpen,
            hasActiveOffices,
            isLoading,
            isLoadingPermissions,
            isLoadingStaff,
            officeSelected,
            officesWithStaff,
            openDeleteAllStaffModal,
            openDeleteStaffModal,
            openEditStaffModal,
            resources,
            selectedStaffMember,
            selectedStaffPermissions,
            staffMembers,

            // #region Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions,
            totalResults,
            // #endregion Pagination

            // #region Dossier
            dossierPersonId,
            openDossierModal
            // #endregion Dossier
        } = this.state;

        const {
            classes,
            hasDossierClaim
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let addStaffModal: JSX.Element | undefined;
        let editStaffModal: JSX.Element | undefined;
        let deleteConfirmationModal: JSX.Element | undefined;
        let deleteAllConfirmationModal: JSX.Element | undefined;
        let dossier: JSX.Element | undefined;
        let staffTableContent: JSX.Element | undefined;

        if (resources) {
            const emptyOption: IDropDownOption = {
                description: String(resources.lblSelect),
                value: -1
            };

            addStaffModal = (
                <OfficesSetupAddModal
                    hasDossierClaim={hasDossierClaim}
                    open={addStaffModalOpen}
                    afterClose={this.onCloseAddStaffModal}
                    afterFinish={this.onFinishAdd}
                    onAdd={this.onAdd}
                />
            );

            if (selectedStaffMember && selectedStaffPermissions && officeSelected) {
                editStaffModal = (
                    <OfficesSetupEditModal
                        isLoadingPermissions={isLoadingPermissions}
                        officePermissions={selectedStaffPermissions}
                        officeSelected={officeSelected}
                        open={openEditStaffModal}
                        resources={resources.officesSetupEditModal}
                        staffMember={selectedStaffMember}
                        onChangeSwitch={this.onChangeStaffPermission}
                        onClose={this.onCloseEditModal}
                        onDelete={this.onOpenDeleteModal}
                        onDeleteAll={this.onOpenDeleteAllModal}
                    />
                );
            }

            if (this.deleteOfficePermission && selectedStaffMember) {
                deleteConfirmationModal = (
                    <ConfirmationDialog
                        contentText={Format.toString(resources.officesSetupEditModal.formatConfirmDelete,
                            [this.deleteOfficePermission.officeDesc, selectedStaffMember.fullName])}
                        open={openDeleteStaffModal}
                        primaryActionOnClick={this.onCloseDeleteModal}
                        primaryActionText={resources.officesSetupEditModal.btnCancel}
                        secondaryActionOnClick={this.onDeleteStaffPermission}
                        secondaryActionText={resources.officesSetupEditModal.btnDelete}
                        title={Format.toString(resources.officesSetupEditModal.formatDeleteOffice, [this.deleteOfficePermission.officeDesc])}
                    />
                );
            }

            if (selectedStaffMember) {
                deleteAllConfirmationModal = (
                    <ConfirmationDialog
                        contentText={Format.toString(resources.officesSetupEditModal.formatConfirmDeleteAll,
                            [selectedStaffMember.fullName])}
                        open={openDeleteAllStaffModal}
                        primaryActionOnClick={this.onCloseDeleteAllModal}
                        primaryActionText={resources.officesSetupEditModal.btnCancel}
                        secondaryActionOnClick={this.onDeleteAllStaffPermissions}
                        secondaryActionText={resources.officesSetupEditModal.btnDelete}
                        title={resources.officesSetupEditModal.lblDeleteAllTitle}
                    />
                );
            }

            dossier = (
                <Dossier
                    key={`Dossier_${dossierPersonId}`}
                    dossierType={DossierType.Faculty}
                    open={openDossierModal}
                    personId={dossierPersonId}
                    onClose={this.onCloseDossierModal}
                />
            );

            if (isLoadingStaff) {
                staffTableContent = (<ContainerLoader id="ldrStaffMembersTable" />);
            }
            else if (staffMembers && staffMembers.length > 0 && officeSelected && officeSelected.value !== -1) {
                staffTableContent = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    classes={{ root: classes.table }}
                                    id="tblOfficeStaff"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblName}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblActions}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {staffMembers.map((staffMember, iStaffMember) => (
                                            <TableRow
                                                key={`staffMember{iStaffMember}`}
                                            >
                                                <TableCell>
                                                    <AvatarText
                                                        ButtonProps={hasDossierClaim ? {
                                                            'data-id': staffMember.personId,
                                                            id: `btnstaffMemberName_${iStaffMember}`,
                                                            onClick: this.onViewDossier
                                                        } : undefined}
                                                        avatarInfo={staffMember}
                                                    />
                                                </TableCell>
                                                <TableCell>
                                                    <div>
                                                        <Grid container alignItems="center" wrap="nowrap">
                                                            <Grid item>
                                                                <Tooltip
                                                                    id="tltEdit"
                                                                    title={resources.lblEdit}
                                                                    placement="top"
                                                                >
                                                                    <IconButton
                                                                        alt={resources.lblEdit}
                                                                        color="secondary"
                                                                        id={`btnEdit_${staffMember.personId}`}
                                                                        onClick={this.onEditStaff}
                                                                    >
                                                                        <Hidden smUp>
                                                                            <Icon name="edit" />
                                                                        </Hidden>
                                                                        <Hidden xsDown>
                                                                            <Icon large name="edit" />
                                                                        </Hidden>
                                                                    </IconButton>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        {rowsPerPage > 0 && (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={totalResults ? totalResults : 0}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                        rowsPerPageShowAll
                                    />
                                </Grid>
                            </Grid >
                        )}
                    </>
                );
            }
            else {
                staffTableContent = (
                    <Illustration
                        color="secondary"
                        internalName="no-enrolled"
                        text={resources.lblSelectOrAdd}
                    />
                )
            }

            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrOfficesSetup" />);
            }
            else if (hasActiveOffices) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item>
                                <Text size="large">
                                    {resources.lblInstructions}
                                </Text>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container justifyContent="space-between" spacing={1}>
                            <Grid item xs={12} sm={10} md={8} lg={6} xl={4}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    id="ddlOffice"
                                    label={resources.lblOffice}
                                    options={officesWithStaff}
                                    value={officeSelected ? officeSelected.value : emptyOption.value}
                                    onChange={this.onChangeOffice}
                                />
                            </Grid>
                            <Grid item xs={12} sm={2} md={4} lg={6} xl={8}>
                                <Grid container justifyContent="flex-end">
                                    <Grid item>
                                        <IconButton
                                            aria-label={resources.lblAddStaffMember}
                                            onClick={this.onAddStaff}
                                            id="btnAddStaffMember"
                                        >
                                            <Icon name="add" />
                                        </IconButton>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12}>
                                {staffTableContent}
                            </Grid>
                        </Grid>
                    </>
                )
            }
            else {
                contentPage = (
                    <>
                        <Text size="h4">
                            {resources?.lblInstructions}
                        </Text>
                        <Illustration
                            color="secondary"
                            name="under-maintenance"
                            text={resources?.lblNoOfficesAvailable}
                        />
                    </>
                );
            }
        }

        return (
            <>
                {contentPage}
                {addStaffModal}
                {editStaffModal}
                {dossier}
                {deleteConfirmationModal}
                {deleteAllConfirmationModal}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(OfficesSetup);