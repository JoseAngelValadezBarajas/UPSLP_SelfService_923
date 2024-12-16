/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DepartmentHead.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Table, { TableBody, TableCell, TableEditableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import PeopleSearchAssignModal, { IPeopleSearchAssignModalExtraResources, PeopleSearchAssignModalType } from '../../Generic/PeopleSearchAssignModal';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IDepartmentHead } from '../../../Types/Administration/IDepartmentHead';
import { IDepartmentHeadResources } from '../../../Types/Resources/Administration/IDepartmentHeadResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/DepartmentHead';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

export interface IDepartmentHeadProps {
    hasDossierClaim: boolean;
}

// #region Types
interface IDepartmentHeadState {
    componentError: boolean;
    confirmationModalOpen: boolean;
    deleteId?: number;
    deleteName?: string;
    colorFirstLetter?: number;
    departmentHeads?: IDepartmentHead[];
    departmentOptions?: IDropDownOption[];
    isEditable: boolean;
    isLoading: boolean;
    isLoadingOptions: boolean;
    peopleSearchModalOpen: boolean;
    resources?: IDepartmentHeadRes;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier
}

export interface IDepartmentHeadRes extends IDepartmentHeadResources {
    deleteDepartmentHeadConfirmation: IConfirmationDialogResources;
    peopleSearchAssignModalExtra: IPeopleSearchAssignModalExtraResources;
}

const styles = (theme: Theme) => createStyles({
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    marginRight: {
        marginRight: Tokens.spacing40
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '40%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '30%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '30%'
            },
        }
    }
});

type PropsWithStyles = IDepartmentHeadProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class DepartmentHead extends React.Component<PropsWithStyles, IDepartmentHeadState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IDepartmentHeadState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'DepartmentHead';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDepartmentHeadState {
        let resources: IDepartmentHeadRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            confirmationModalOpen: false,
            isEditable: false,
            isLoading: true,
            isLoadingOptions: false,
            peopleSearchModalOpen: false,
            resources: resources,

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false
            // #endregion Dossier
        };
    }

    // #region Events

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

    private onAdd = (departmentHead: any, resolver: any): void => {
        try {
            Requests.postSaveDepartmentHead(departmentHead, resolver, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
        }
    };

    private onCancel = (event: any): void => {
        try {
            const {
                departmentHeads
            } = this.state;

            if (departmentHeads) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                departmentHeads[row].isEditable = false;
                departmentHeads[row].isModified = false;
                departmentHeads[row].isDuplicated = false;
                departmentHeads[row].departmentId = departmentHeads[row].originalDepartmentId;
                this.setState({
                    departmentHeads: departmentHeads,
                    isEditable: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancel.name, e));
        }
    };

    private onCloseDeleteConfirmationModal = (): void => {
        try {
            this.setState({
                confirmationModalOpen: false,
                deleteId: undefined,
                deleteName: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteConfirmationModal.name, e));
        }
    };

    private onClosePeopleSearchModal = (): void => {
        try {
            this.setState({
                peopleSearchModalOpen: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePeopleSearchModal.name, e));
        }
    };

    private onDropDownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                departmentHeads
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);
            if (optionSelected && departmentHeads && departmentHeads[row].isEditable) {
                departmentHeads[row].departmentId = Number(optionSelected.value);
                departmentHeads[row].isModified = true;
                departmentHeads[row].isDuplicated = false;
                this.setState({
                    departmentHeads: departmentHeads
                });
                if (departmentHeads[row].departmentId !== departmentHeads[row].originalDepartmentId) {
                    Requests.postFacultyHasDepartment(departmentHeads[row].departmentId, departmentHeads[row].personId,
                        this.resolvePostFacultyHasDepartment, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownChange.name, e));
        }
    };

    private onDelete = (event: any): void => {
        try {
            const {
                departmentHeads
            } = this.state;

            if (departmentHeads) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                this.setState({
                    confirmationModalOpen: true,
                    deleteId: Number(departmentHeads[row].departmentHeadId),
                    deleteName: departmentHeads[row].fullName
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDelete.name, e));
        }
    };

    private onDeleteConfirm = (): void => {
        try {
            const {
                deleteId
            } = this.state;

            this.setState({
                confirmationModalOpen: false,
                deleteName: undefined
            });

            if (deleteId) {
                LayoutActions.showPageLoader();
                Requests.postDeleteDepartmentHead(deleteId,
                    this.resolvePostDeleteDepartmentHead, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onEdit = (event: any): void => {
        try {
            const {
                departmentHeads
            } = this.state;

            if (departmentHeads) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                departmentHeads[row].isEditable = true;
                departmentHeads[row].originalDepartmentId = departmentHeads[row].departmentId;
                this.setState({
                    departmentHeads: departmentHeads,
                    isEditable: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEdit.name, e));
        }
    };

    private onFinishAdd = (): void => {
        try {
            if (this.layoutResources) {
                LayoutActions.setAlert({
                    message: this.layoutResources.lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
            this.showLoader();
            Requests.getDepartmentHeads(this.resolveGetDepartmentHeads, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishAdd.name, e));
        }
    };

    private onSave = (event: any): void => {
        try {
            const {
                departmentHeads
            } = this.state;

            const data: string[] = event.currentTarget.id.split('_');
            const row: number = Number(data[1]);
            if (departmentHeads) {
                departmentHeads[row].isModified = true;
                if (departmentHeads[row].departmentId && !departmentHeads[row].isDuplicated) {
                    if (departmentHeads[row].departmentId !== departmentHeads[row].originalDepartmentId) {
                        LayoutActions.showPageLoader();
                        Requests.postSaveDepartmentHead({
                            departmentHeadId: departmentHeads[row].departmentHeadId,
                            departmentId: departmentHeads[row].departmentId,
                            personId: departmentHeads[row].personId
                        }, this.resolvePostSaveDepartmentHead, this.logError);
                    }
                    else {
                        departmentHeads[row].isEditable = false;
                        departmentHeads[row].isModified = false;
                        departmentHeads[row].isDuplicated = false;
                        this.setState({
                            isEditable: false
                        });
                    }
                }
                this.setState({
                    departmentHeads: departmentHeads
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSave.name, e));
        }
    };

    private onSearch = (): void => {
        try {
            this.setState({
                peopleSearchModalOpen: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onValidate = (departmentId: number, personId: number, resolver: any): void => {
        try {
            Requests.postFacultyHasDepartment(departmentId, personId, resolver, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onValidate.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingOptions: false
        });
    };

    private hideLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: false
        });
    };

    private showLoader = (): void => {
        this.setState({
            isLoading: true
        });
    };

    private showLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: true
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
    private resolveGetDepartmentHeads = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDepartmentHeads.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    departmentHeads: result.data,
                    isLoading: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDepartmentHeads.name, e));
        }
    };

    private resolveGetDepartmentHeadsOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDepartmentHeadsOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    departmentOptions: result.data
                }, this.hideLoaderOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDepartmentHeadsOptions.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => LayoutActions.hidePageLoader());
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostDeleteDepartmentHead = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteDepartmentHead.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    deleteId,
                    departmentHeads
                } = this.state;

                if (departmentHeads && deleteId) {
                    const deletedIndex: number = departmentHeads.findIndex(dh => dh.departmentHeadId === deleteId);
                    if (deletedIndex >= 0) {
                        departmentHeads.splice(deletedIndex, 1);
                        this.setState({
                            deleteId: undefined,
                            departmentHeads: departmentHeads
                        });
                    }
                }
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteDepartmentHead.name, e));
        }
    };

    private resolvePostFacultyHasDepartment = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostFacultyHasDepartment.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    departmentHeads
                } = this.state;

                if (departmentHeads) {
                    const existingDepartmentHead: IDepartmentHead | undefined
                        = departmentHeads.find(dh => dh.isEditable);
                    if (existingDepartmentHead) {
                        existingDepartmentHead.isDuplicated = result.data;
                        this.setState({
                            departmentHeads: departmentHeads
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostFacultyHasDepartment.name, e));
        }
    };

    private resolvePostSaveDepartmentHead = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveDepartmentHead.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    departmentHeads,
                    departmentOptions
                } = this.state;

                if (departmentHeads) {
                    const editableIndex: number = departmentHeads.findIndex(dh => dh.isEditable);
                    if (editableIndex >= 0) {
                        // Remove editable
                        departmentHeads[editableIndex].isEditable = false;
                        departmentHeads[editableIndex].originalDepartmentId = departmentHeads[editableIndex].departmentId;
                        let departmentSelected: IDropDownOption | undefined;
                        if (departmentOptions) {
                            departmentSelected = departmentOptions.find(d => Number(d.value) === departmentHeads[editableIndex].departmentId);
                        }
                        departmentHeads[editableIndex].departmentDesc = departmentSelected ? departmentSelected.description : '';

                        // Reorder the list (just the items related to the personId)
                        let start: number = -1;
                        let end: number = -1;
                        departmentHeads.forEach((dh, dhIndex) => {
                            if (dh.personId === departmentHeads[editableIndex].personId) {
                                if (start === -1) {
                                    start = dhIndex;
                                    end = dhIndex;
                                }
                                else {
                                    end = dhIndex;
                                }
                            }
                        });
                        if (start >= 0 && end >= 0) {
                            end = end + 1;
                            const preSorted: IDepartmentHead[]
                                = (start > 0) ? departmentHeads.slice(0, start) : [];
                            const postSorted: IDepartmentHead[]
                                = (end < departmentHeads.length) ? departmentHeads.slice(end) : [];
                            const sorted: IDepartmentHead[]
                                = departmentHeads.slice(start, end).sort((objA, objB) =>
                                    (objA.departmentDesc < objB.departmentDesc) ? -1
                                        : (objA.departmentDesc > objB.departmentDesc) ? 1 : 0);

                            departmentHeads.length = 0;
                            departmentHeads.push.apply(departmentHeads, preSorted.concat(sorted).concat(postSorted));
                        }

                        this.setState({
                            departmentHeads: departmentHeads,
                            isEditable: false
                        });
                    }
                }
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
            this.logError(LogData.fromException(this.resolvePostSaveDepartmentHead.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getDepartmentHeads(this.resolveGetDepartmentHeads, this.logError);
            this.showLoaderOptions();
            Requests.getDepartmentHeadsOptions(this.resolveGetDepartmentHeadsOptions, this.logError);
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
            hasDossierClaim
        } = this.props;

        const {
            componentError,
            confirmationModalOpen,
            deleteName,
            departmentHeads,
            departmentOptions,
            isEditable,
            isLoading,
            isLoadingOptions,
            peopleSearchModalOpen,
            resources,

            // #region Dossier
            dossierPersonId,
            openDossierModal
            // #endregion Dossier
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let deleteConfirmation: JSX.Element | undefined;
        let peopleSearchModal: JSX.Element | undefined;
        let dossier: JSX.Element | undefined;
        if (!componentError && resources) {
            const emptyOption: IDropDownOption = {
                description: this.layoutResources ? this.layoutResources.lblDropDownEmptyText : '',
                value: ''
            };
            let contentTable: JSX.Element | undefined;
            if (!isLoading) {
                if (departmentHeads && departmentHeads.length > 0) {
                    contentTable = (
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblDepartmentHead"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblDepartmentHead}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblDepartment}
                                    </TableCell >
                                    <TableCell component="th">
                                        {resources.lblActions}
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {departmentHeads ? departmentHeads.map((departmentHeadRow, departmentHeadIndex) => (
                                    <TableExpandableRow
                                        key={`departmentHeadRow_${departmentHeadIndex}`}
                                    >
                                        <TableCell>
                                            <AvatarText
                                                ButtonProps={hasDossierClaim ? {
                                                    'data-id': departmentHeadRow.personId,
                                                    id: `btnDeparmentHeadName_${departmentHeadIndex}`,
                                                    onClick: this.onViewDossier
                                                } : undefined}
                                                avatarInfo={departmentHeadRow}
                                            />
                                        </TableCell>
                                        <TableEditableCell
                                            columnName={resources.lblDepartment}
                                            content={departmentHeadRow.departmentDesc}
                                            edit={Boolean(departmentHeadRow.isEditable)}
                                            editableComponent={
                                                (
                                                    <Dropdown
                                                        error={departmentHeadRow.isModified &&
                                                            (!Boolean(departmentHeadRow.departmentId)
                                                                || departmentHeadRow.isDuplicated)}
                                                        helperText={departmentHeadRow.isModified
                                                            ? (!Boolean(departmentHeadRow.departmentId)
                                                                ? resources.lblDepartmentRequired
                                                                : (departmentHeadRow.isDuplicated
                                                                    ? resources.lblDuplicatedDepartmentHead
                                                                    : undefined))
                                                            : undefined}
                                                        emptyOption={emptyOption}
                                                        id={`ddlDepartment_${departmentHeadIndex}`}
                                                        label={resources.lblDepartment}
                                                        loading={isLoadingOptions}
                                                        options={departmentOptions}
                                                        size="small"
                                                        value={departmentHeadRow.departmentId || emptyOption.value}
                                                        onChange={this.onDropDownChange}
                                                    />
                                                )}
                                            error={departmentHeadRow.isModified &&
                                                (!Boolean(departmentHeadRow.departmentId)
                                                    || departmentHeadRow.isDuplicated)}
                                        />
                                        {departmentHeadRow.isEditable ? (
                                            <TableCell>
                                                <div>
                                                    <Grid container alignItems="center" wrap="nowrap" >
                                                        <Grid item>
                                                            <Tooltip
                                                                id="tltSave"
                                                                title={resources.btnSave}
                                                                placement="top"
                                                            >
                                                                <div className={classes.inline}>
                                                                    <IconButton
                                                                        alt={resources.btnSave}
                                                                        classes={{ root: classes.iconHeader }}
                                                                        disabled={!isEditable}
                                                                        id={`btnSave_${departmentHeadIndex}`}
                                                                        onClick={this.onSave}
                                                                    >
                                                                        <Icon
                                                                            large
                                                                            name="save"
                                                                        />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        </Grid>
                                                        <Grid item>
                                                            <Tooltip
                                                                id="tltCancel"
                                                                title={resources.btnCancel}
                                                                placement="top"
                                                            >
                                                                <div className={classes.inline}>
                                                                    <IconButton
                                                                        alt={resources.btnCancel}
                                                                        classes={{ root: classes.iconHeader }}
                                                                        color="secondary"
                                                                        disabled={!isEditable}
                                                                        id={`btnCancel_${departmentHeadIndex}`}
                                                                        onClick={this.onCancel}
                                                                    >
                                                                        <Icon
                                                                            large
                                                                            name="close"
                                                                        />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>
                                                </div>
                                            </TableCell>
                                        ) : (
                                                <TableCell>
                                                    <div >
                                                        <Grid container justifyContent="flex-start" >
                                                            <Grid item>
                                                                <Tooltip
                                                                    id="tltEdit"
                                                                    title={resources.btnEdit}
                                                                    placement="top"
                                                                >
                                                                    <div className={classes.inline}>
                                                                        <IconButton
                                                                            alt={resources.btnEdit}
                                                                            classes={{ root: classes.iconHeader }}
                                                                            color="secondary"
                                                                            disabled={isEditable}
                                                                            id={`btnEdit_${departmentHeadIndex}`}
                                                                            onClick={this.onEdit}
                                                                        >
                                                                            <Icon large name="edit" />
                                                                        </IconButton>
                                                                    </div>
                                                                </Tooltip>
                                                            </Grid>
                                                            <Grid item>
                                                                <Tooltip
                                                                    id="tltDelete"
                                                                    title={resources.btnDelete}
                                                                    placement="top"
                                                                >
                                                                    <div className={classes.inline}>
                                                                        <IconButton
                                                                            alt={resources.btnDelete}
                                                                            classes={{ root: classes.iconHeader }}
                                                                            color="secondary"
                                                                            disabled={isEditable}
                                                                            onClick={this.onDelete}
                                                                            id={`btnDelete_${departmentHeadIndex}`}
                                                                        >
                                                                            <Icon large name="trash" />
                                                                        </IconButton>
                                                                    </div>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </div>
                                                </TableCell>
                                            )}
                                    </TableExpandableRow>
                                )) : undefined}
                            </TableBody>
                        </Table>
                    );

                    deleteConfirmation = (
                        <ConfirmationDialog
                            contentText={Format.toString(resources.deleteDepartmentHeadConfirmation.formatContent, [
                                deleteName
                            ])}
                            open={confirmationModalOpen}
                            primaryActionOnClick={this.onCloseDeleteConfirmationModal}
                            primaryActionText={resources.deleteDepartmentHeadConfirmation.btnDecline}
                            secondaryActionOnClick={this.onDeleteConfirm}
                            secondaryActionText={resources.deleteDepartmentHeadConfirmation.btnAccept}
                            title={resources.deleteDepartmentHeadConfirmation.lblTitle}
                        />
                    );
                }
                else {
                    contentTable = (
                        <Illustration
                            color="secondary"
                            name="no-search-results"
                            text={resources.lblNoDepartmentHeads}
                        />
                    );
                }
            }
            else {
                contentTable = (<ContainerLoader id="ldrDepartmentHeads" height="md" />);
            }

            contentPage = (
                <Grid container>
                    <Grid item xs>
                        <Grid container>
                            <Grid item xs>
                                <Text size="large">
                                    {resources.lblDepartmentHeadTitle}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item className={classes.marginRight}>
                                <Tooltip
                                    id="tltSearch"
                                    title={resources.btnSearch}
                                    placement="top"
                                >
                                    <div className={classes.inline}>
                                        <IconButton
                                            aria-label={resources.btnSearch}
                                            classes={{ root: classes.iconHeader }}
                                            onClick={this.onSearch}
                                            id="btnSearch"
                                        >
                                            <Icon large name="add" />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        {contentTable}
                    </Grid>
                </Grid>
            );

            peopleSearchModal = (
                <PeopleSearchAssignModal
                    extraResources={resources.peopleSearchAssignModalExtra}
                    hasDossierClaim={hasDossierClaim}
                    open={peopleSearchModalOpen}
                    options={departmentOptions}
                    type={PeopleSearchAssignModalType.DepartmentHead}
                    afterClose={this.onClosePeopleSearchModal}
                    afterFinish={this.onFinishAdd}
                    onAdd={this.onAdd}
                    onValidate={this.onValidate}
                />
            );

            dossier = (
                <Dossier
                    key={`Dossier_${dossierPersonId}`}
                    dossierType={DossierType.Faculty}
                    open={openDossierModal}
                    personId={dossierPersonId}
                    onClose={this.onCloseDossierModal}
                />
            );
        }

        return (
            <>
                {contentPage}
                {deleteConfirmation}
                {peopleSearchModal}
                {dossier}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(DepartmentHead);