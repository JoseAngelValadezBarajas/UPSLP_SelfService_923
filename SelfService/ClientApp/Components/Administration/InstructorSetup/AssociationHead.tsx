/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AssociationHead.tsx
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
import PeopleSearchAssignModal, { IPeopleSearchAssignModalExtraResources } from '../../Generic/PeopleSearchAssignModal';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAssociationHead, IAssociationHeadSave } from '../../../Types/Administration/IAssociationHead';
import { IAssociationHeadResources } from '../../../Types/Resources/Administration/IAssociationHeadResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';
import { PeopleSearchAssignModalType } from '../../Generic/PeopleSearchAssignModal';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/AssociationHead';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

export interface IAssociationProps {
    hasDossierClaim: boolean;
}

// #region Types
interface IAssociationHeadRes extends IAssociationHeadResources {
    deleteAssociationHeadConfirmation: IConfirmationDialogResources;
    peopleSearchAssignModalExtra: IPeopleSearchAssignModalExtraResources;
}

interface IAssociationHeadState {
    associationHead?: IAssociationHeadSave;
    associationHeads?: IAssociationHead[];
    associationOptions?: IDropDownOption[];
    componentError: boolean;
    confirmationModalOpen: boolean;
    deleteId?: number;
    deleteName?: string;
    isEditable: boolean;
    isLoading: boolean;
    isLoadingOptions: boolean;
    peopleSearchModalOpen: boolean;
    resources?: IAssociationHeadRes;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier
}

const styles = (theme: Theme) => createStyles({
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    maginRight: {
        marginRight: Tokens.spacing40
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '40%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '40%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '10%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '10%'
            }
        }
    }
});

type PropsWithStyles = IAssociationProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class AssociationHead extends React.Component<PropsWithStyles, IAssociationHeadState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IAssociationHeadState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'AssociationHead';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IAssociationHeadState {
        let resources: IAssociationHeadRes | undefined;
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

    // #region Events
    private onAdd = (associationHead: any, resolver: any): void => {
        try {
            Requests.postSaveAssociationHead(associationHead, resolver, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
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

    private onDelete = (event: any): void => {
        try {
            const {
                associationHeads
            } = this.state;

            if (associationHeads) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                this.setState({
                    confirmationModalOpen: true,
                    deleteId: Number(associationHeads[row].associationHeadId),
                    deleteName: associationHeads[row].fullName
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
                LayoutActions.setLoading(true);
                Requests.postDeleteAssociationHead(deleteId,
                    this.resolvePostDeleteAssociationHead, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onDropDownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                associationHeads
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);
            if (optionSelected && associationHeads && associationHeads[row].isEditable) {
                associationHeads[row].associationId = Number(optionSelected.value);
                associationHeads[row].isModified = true;
                associationHeads[row].isDuplicated = false;
                this.setState({
                    associationHeads
                });
                if (associationHeads[row].associationId !== associationHeads[row].originalAssociationId) {
                    Requests.postFacultyHasAssociations(associationHeads[row].associationId, associationHeads[row].personId,
                        this.resolvePostFacultyHasAssociations, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownChange.name, e));
        }
    };

    private onSave = (event: any): void => {
        try {
            const {
                associationHeads
            } = this.state;

            const data: string[] = event.currentTarget.id.split('_');
            const row: number = Number(data[1]);
            if (associationHeads) {
                associationHeads[row].isModified = true;
                if (associationHeads[row].associationId && !associationHeads[row].isDuplicated) {
                    if (associationHeads[row].associationId !== associationHeads[row].originalAssociationId) {
                        LayoutActions.setLoading(true);
                        Requests.postSaveAssociationHead({
                            associationHeadId: associationHeads[row].associationHeadId,
                            associationId: associationHeads[row].associationId,
                            personId: associationHeads[row].personId
                        }, this.resolvePostSaveAssociationHead, this.logError);
                    }
                    else {
                        associationHeads[row].isEditable = false;
                        associationHeads[row].isModified = false;
                        associationHeads[row].isDuplicated = false;
                        this.setState({
                            isEditable: false
                        });
                    }
                }
                this.setState({
                    associationHeads
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

    private onCancel = (event: any): void => {
        try {
            const {
                associationHeads
            } = this.state;

            if (associationHeads) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                associationHeads[row].isEditable = false;
                associationHeads[row].isModified = false;
                associationHeads[row].isDuplicated = false;
                associationHeads[row].associationId = associationHeads[row].originalAssociationId;
                this.setState({
                    associationHeads,
                    isEditable: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancel.name, e));
        }
    };

    private onEdit = (event: any): void => {
        try {
            const {
                associationHeads
            } = this.state;

            if (associationHeads) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                associationHeads[row].isEditable = true;
                associationHeads[row].originalAssociationId = associationHeads[row].associationId;
                this.setState({
                    associationHeads,
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
            Requests.getAssociationHeads(this.resolveGetAssociationHeads, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishAdd.name, e));
        }
    };

    private onValidate = (associationId: number, personId: number, resolver: any): void => {
        try {
            Requests.postFacultyHasAssociations(associationId, personId, resolver, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onValidate.name, e));
        }
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false
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
    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    resources: result.data
                });
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetAssociationHeads = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssociationHeads.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    associationHeads: result.data,
                    isLoading: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssociationHeads.name, e));
        }
    };

    private resolveGetAssociationHeadsOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAssociationHeadsOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    associationOptions: result.data
                }, this.hideLoaderOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAssociationHeadsOptions.name, e));
        }
    };

    private resolvePostDeleteAssociationHead = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteAssociationHead.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    deleteId,
                    associationHeads
                } = this.state;
                if (associationHeads && deleteId) {
                    const deletedIndex: number = associationHeads.findIndex(ah => ah.associationHeadId === deleteId);
                    if (deletedIndex > -1) {
                        associationHeads.splice(deletedIndex, 1);
                        this.setState({
                            associationHeads: associationHeads,
                            deleteId: undefined
                        });
                    }
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteAssociationHead.name, e));
        }
    };

    private resolvePostFacultyHasAssociations = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostFacultyHasAssociations.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    associationHeads
                } = this.state;

                if (associationHeads) {
                    const existingAssociationHeadIndex: number
                        = associationHeads.findIndex(ah => ah.isEditable);
                    if (existingAssociationHeadIndex > -1) {
                        associationHeads[existingAssociationHeadIndex].isDuplicated
                            = result.data;
                        this.setState({
                            associationHeads
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostFacultyHasAssociations.name, e));
        }
    };

    private resolvePostSaveAssociationHead = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveAssociationHead.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                const {
                    associationHeads,
                    associationOptions
                } = this.state;

                if (associationHeads) {
                    const editableId: number = associationHeads.findIndex(ah => ah.isEditable);
                    if (editableId >= 0) {
                        // Remove editable
                        associationHeads[editableId].isEditable = false;
                        associationHeads[editableId].originalAssociationId = associationHeads[editableId].associationId;
                        let associationSelected: IDropDownOption | undefined;
                        if (associationOptions) {
                            associationSelected = associationOptions.find(d => Number(d.value) === associationHeads[editableId].associationId);
                        }
                        associationHeads[editableId].associationDesc = associationSelected ? associationSelected.description : '';

                        // Reorder the list (just the items related to the personId)
                        let start: number = -1;
                        let end: number = -1;
                        associationHeads.forEach((ah, ahIndex) => {
                            if (ah.personId === associationHeads[editableId].personId) {
                                if (start === -1) {
                                    start = ahIndex;
                                    end = ahIndex;
                                }
                                else {
                                    end = ahIndex;
                                }
                            }
                        });
                        if (start >= 0 && end >= 0) {
                            end = end + 1;
                            const preSorted: IAssociationHead[]
                                = (start > 0) ? associationHeads.slice(0, start) : [];
                            const postSorted: IAssociationHead[]
                                = (end < associationHeads.length) ? associationHeads.slice(end) : [];
                            const sorted: IAssociationHead[]
                                = associationHeads.slice(start, end).sort((objA, objB) =>
                                    (objA.associationDesc < objB.associationDesc) ? -1
                                        : (objA.associationDesc > objB.associationDesc) ? 1 : 0);

                            associationHeads.length = 0;
                            associationHeads.push.apply(associationHeads, preSorted.concat(sorted).concat(postSorted));
                        }

                        this.setState({
                            associationHeads: associationHeads,
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
            this.logError(LogData.fromException(this.resolvePostSaveAssociationHead.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getAssociationHeads(this.resolveGetAssociationHeads, this.logError);
            this.showLoaderOptions();
            Requests.getAssociationHeadsOptions(this.resolveGetAssociationHeadsOptions, this.logError);
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
            associationHeads,
            associationOptions,
            componentError,
            confirmationModalOpen,
            deleteName,
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

        const {
            classes,
            hasDossierClaim
        } = this.props;

        let contentPage: JSX.Element | undefined;
        let deleteConfirmation: JSX.Element | undefined;
        let dossier: JSX.Element | undefined;
        let peopleSearchModal: JSX.Element | undefined;
        if (!componentError && resources) {
            const emptyOption: IDropDownOption = {
                description: this.layoutResources ? this.layoutResources.lblDropDownEmptyText : '',
                value: ''
            };
            let contentTable: JSX.Element | undefined;
            if (!isLoading) {
                if (associationHeads && associationHeads.length > 0) {
                    contentTable = (
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblAssociationHead"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblResponsible}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblAssociation}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {associationHeads.map((associationHeadRow, associationHeadIndex) => (
                                    <TableExpandableRow
                                        key={`associationHeadRow_${associationHeadIndex}`}
                                    >
                                        <TableCell>
                                            <AvatarText
                                                ButtonProps={hasDossierClaim ? {
                                                    'data-id': associationHeadRow.personId,
                                                    id: `btnAssociationName_${associationHeadRow}`,
                                                    onClick: this.onViewDossier
                                                } : undefined}
                                                avatarInfo={associationHeadRow}
                                            />
                                        </TableCell>
                                        <TableEditableCell
                                            columnName={resources.lblAssociation}
                                            content={associationHeadRow.associationDesc}
                                            edit={Boolean(associationHeadRow.isEditable)}
                                            editableComponent={
                                                (
                                                    <Dropdown
                                                        error={associationHeadRow.isModified &&
                                                            (!Boolean(associationHeadRow.associationId)
                                                                || associationHeadRow.isDuplicated)}
                                                        helperText={associationHeadRow.isModified
                                                            ? (!Boolean(associationHeadRow.associationId)
                                                                ? resources.lblAssociationRequired
                                                                : (associationHeadRow.isDuplicated
                                                                    ? resources.lblDuplicatedAssociationHead
                                                                    : undefined))
                                                            : undefined}
                                                        emptyOption={emptyOption}
                                                        id={`ddlAssociation_${associationHeadIndex}`}
                                                        label={resources.lblAssociation}
                                                        options={associationOptions}
                                                        loading={isLoadingOptions}
                                                        size="small"
                                                        value={associationHeadRow.associationId || emptyOption.value}
                                                        onChange={this.onDropDownChange}
                                                    />
                                                )}
                                            error={associationHeadRow.isModified &&
                                                (!Boolean(associationHeadRow.associationId)
                                                    || associationHeadRow.isDuplicated)}
                                        />
                                        {associationHeadRow.isEditable ? (
                                            <TableCell columnName={resources.btnSave}>
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
                                                            id={`btnSave_${associationHeadIndex}`}
                                                            onClick={this.onSave}
                                                        >
                                                            <Icon
                                                                large
                                                                name="save"
                                                            />
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
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
                                                            id={`btnCancel_${associationHeadIndex}`}
                                                            onClick={this.onCancel}
                                                        >
                                                            <Icon
                                                                large
                                                                name="close"
                                                            />
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
                                            </TableCell>
                                        ) : (
                                                <TableCell columnName={resources.btnEdit}>
                                                    <>
                                                        <Grid container alignItems="center" wrap="nowrap">
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
                                                                            id={`btnEdit_${associationHeadIndex}`}
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
                                                                            id={`btnDelete_${associationHeadIndex}`}
                                                                            onClick={this.onDelete}
                                                                        >
                                                                            <Icon large name="trash" />
                                                                        </IconButton>
                                                                    </div>
                                                                </Tooltip>
                                                            </Grid>
                                                        </Grid>
                                                    </>
                                                </TableCell>
                                            )}
                                    </TableExpandableRow>
                                ))}
                            </TableBody>
                        </Table>
                    );

                    deleteConfirmation = (
                        <ConfirmationDialog
                            contentText={Format.toString(resources.deleteAssociationHeadConfirmation.formatContent, [
                                deleteName
                            ])}
                            open={confirmationModalOpen}
                            primaryActionOnClick={this.onCloseDeleteConfirmationModal}
                            primaryActionText={resources.deleteAssociationHeadConfirmation.btnDecline}
                            secondaryActionOnClick={this.onDeleteConfirm}
                            secondaryActionText={resources.deleteAssociationHeadConfirmation.btnAccept}
                            title={resources.deleteAssociationHeadConfirmation.lblTitle}
                        />
                    );
                }
                else {
                    contentTable = (
                        <Illustration
                            color="secondary"
                            name="no-search-results"
                            text={resources.lblNoAssociationHeads}
                        />
                    );
                }
            }
            else {
                contentPage = (<ContainerLoader id="ldrAssociationHeads" height="md" />);
            }

            contentPage = (
                <Grid container>
                    <Grid item xs>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h4">
                                    {resources.lblAssociationHeadTitle}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container justifyContent="flex-end">
                            <Grid item className={classes.maginRight}>
                                <Tooltip
                                    id="tltEdit"
                                    title={resources.btnSearch}
                                    placement="top"
                                >
                                    <div className={classes.inline}>
                                        <IconButton
                                            aria-label={resources.btnSearch}
                                            classes={{ root: classes.iconHeader }}
                                            id="btnSearch"
                                            onClick={this.onSearch}
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
                <>
                    <PeopleSearchAssignModal
                        extraResources={resources.peopleSearchAssignModalExtra}
                        hasDossierClaim={hasDossierClaim}
                        open={peopleSearchModalOpen}
                        options={associationOptions}
                        type={PeopleSearchAssignModalType.AssociationHead}
                        afterClose={this.onClosePeopleSearchModal}
                        afterFinish={this.onFinishAdd}
                        onAdd={this.onAdd}
                        onValidate={this.onValidate}
                    />
                </>
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

// RenderDOM: Component
export default withStyles(styles)(AssociationHead);