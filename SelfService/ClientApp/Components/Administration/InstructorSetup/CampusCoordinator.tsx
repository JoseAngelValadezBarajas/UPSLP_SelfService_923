/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: CampusCoordinator.tsx
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
import { ICampusCoordinator } from '../../../Types/Administration/ICampusCoordinator';
import { ICampusCoordinatorResources } from '../../../Types/Resources/Administration/ICampusCoordinatorResources';
import { IConfirmationDialogResources } from '../../../Types/Resources/Generic/IConfirmationDialogResources';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/CampusCoordinator';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

export interface ICampusCoordinatorProps {
    hasDossierClaim: boolean;
}

// #region Types
interface ICampusCoordinatorState {
    campusCoordinators?: ICampusCoordinator[];
    componentError: boolean;
    confirmationModalOpen: boolean;
    deleteId?: number;
    deleteName?: string;
    isEditable: boolean;
    isLoading: boolean;
    isLoadingOptions: boolean;
    organizationOptions?: IDropDownOption[];
    peopleSearchModalOpen: boolean;
    resources?: ICampusCoordinatorRes;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier
}

export interface ICampusCoordinatorRes extends ICampusCoordinatorResources {
    deleteCampusCoordinatorConfirmation: IConfirmationDialogResources;
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

type PropsWithStyles = ICampusCoordinatorProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class CampusCoordinator extends React.Component<PropsWithStyles, ICampusCoordinatorState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<ICampusCoordinatorState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'CampusCoordinator';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ICampusCoordinatorState {
        let resources: ICampusCoordinatorRes | undefined;
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
    private onAdd = (campusCoordinator: any, resolver: any): void => {
        try {
            Requests.postSaveCampusCoordinator(campusCoordinator, resolver, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAdd.name, e));
        }
    };

    private onCancel = (event: any): void => {
        try {
            const {
                campusCoordinators
            } = this.state;

            if (campusCoordinators) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                campusCoordinators[row].isEditable = false;
                campusCoordinators[row].isModified = false;
                campusCoordinators[row].isDuplicated = false;
                campusCoordinators[row].organizationId = campusCoordinators[row].originalOrganizationId;
                this.setState({
                    campusCoordinators: campusCoordinators,
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
                campusCoordinators
            } = this.state;

            const data: string[] = id.split('_');
            const row: number = Number(data[1]);
            if (optionSelected && campusCoordinators && campusCoordinators[row].isEditable) {
                campusCoordinators[row].organizationId = Number(optionSelected.value);
                campusCoordinators[row].isModified = true;
                campusCoordinators[row].isDuplicated = false;
                this.setState({
                    campusCoordinators: campusCoordinators
                });
                if (campusCoordinators[row].organizationId !== campusCoordinators[row].originalOrganizationId) {
                    Requests.postFacultyHasCampus(campusCoordinators[row].organizationId, campusCoordinators[row].personId,
                        this.resolvePostFacultyHasCampus, this.logError);
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
                campusCoordinators
            } = this.state;

            if (campusCoordinators) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                this.setState({
                    confirmationModalOpen: true,
                    deleteId: Number(campusCoordinators[row].campusCoordinatorId),
                    deleteName: campusCoordinators[row].fullName
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
                Requests.postDeleteCampusCoordinator(deleteId,
                    this.resolvePostDeleteCampusCoordinator, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteConfirm.name, e));
        }
    };

    private onEdit = (event: any): void => {
        try {
            const {
                campusCoordinators
            } = this.state;

            if (campusCoordinators) {
                const data: string[] = event.currentTarget.id.split('_');
                const row: number = Number(data[1]);
                campusCoordinators[row].isEditable = true;
                campusCoordinators[row].originalOrganizationId = campusCoordinators[row].organizationId;
                this.setState({
                    campusCoordinators: campusCoordinators,
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
            Requests.getCampusCoordinators(this.resolveGetCampusCoordinators, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinishAdd.name, e));
        }
    };

    private onSave = (event: any): void => {
        try {
            const {
                campusCoordinators
            } = this.state;

            const data: string[] = event.currentTarget.id.split('_');
            const row: number = Number(data[1]);
            if (campusCoordinators) {
                campusCoordinators[row].isModified = true;
                if (campusCoordinators[row].organizationId && !campusCoordinators[row].isDuplicated) {
                    if (campusCoordinators[row].organizationId !== campusCoordinators[row].originalOrganizationId) {
                        LayoutActions.setLoading(true);
                        Requests.postSaveCampusCoordinator({
                            campusCoordinatorId: campusCoordinators[row].campusCoordinatorId,
                            organizationId: campusCoordinators[row].organizationId,
                            personId: campusCoordinators[row].personId
                        }, this.resolvePostSaveCampusCoordinator, this.logError);
                    }
                    else {
                        campusCoordinators[row].isEditable = false;
                        campusCoordinators[row].isModified = false;
                        campusCoordinators[row].isDuplicated = false;
                        this.setState({
                            isEditable: false
                        });
                    }
                }
                this.setState({
                    campusCoordinators: campusCoordinators
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

    private onValidate = (organizationId: number, personId: number, resolver: any): void => {
        try {
            Requests.postFacultyHasCampus(organizationId, personId, resolver, this.logError);
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
    private resolveGetCampusCoordinators = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCampusCoordinators.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    campusCoordinators: result.data,
                    isLoading: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCampusCoordinators.name, e));
        }
    };

    private resolveGetCampusCoordinatorsOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetCampusCoordinatorsOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    organizationOptions: result.data
                }, this.hideLoaderOptions);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetCampusCoordinatorsOptions.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    resources: result.data
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostDeleteCampusCoordinator = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostDeleteCampusCoordinator.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    deleteId,
                    campusCoordinators
                } = this.state;

                if (campusCoordinators && deleteId) {
                    const deletedIndex: number = campusCoordinators.findIndex(dh => dh.campusCoordinatorId === deleteId);
                    if (deletedIndex >= 0) {
                        campusCoordinators.splice(deletedIndex, 1);
                        this.setState({
                            campusCoordinators: campusCoordinators,
                            deleteId: undefined
                        });
                    }
                }
                LayoutActions.setLoading(false);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostDeleteCampusCoordinator.name, e));
        }
    };

    private resolvePostFacultyHasCampus = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostFacultyHasCampus.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    campusCoordinators
                } = this.state;

                if (campusCoordinators) {
                    const existingCampusCoordinator: ICampusCoordinator | undefined
                        = campusCoordinators.find(dh => dh.isEditable);
                    if (existingCampusCoordinator) {
                        existingCampusCoordinator.isDuplicated = result.data;
                        this.setState({
                            campusCoordinators: campusCoordinators
                        });
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostFacultyHasCampus.name, e));
        }
    };

    private resolvePostSaveCampusCoordinator = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveCampusCoordinator.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    campusCoordinators,
                    organizationOptions
                } = this.state;

                if (campusCoordinators) {
                    const editableIndex: number = campusCoordinators.findIndex(dh => dh.isEditable);
                    if (editableIndex >= 0) {
                        // Remove editable
                        campusCoordinators[editableIndex].isEditable = false;
                        campusCoordinators[editableIndex].originalOrganizationId = campusCoordinators[editableIndex].organizationId;
                        let organizationSelected: IDropDownOption | undefined;
                        if (organizationOptions) {
                            organizationSelected = organizationOptions.find(d =>
                                Number(d.value) === campusCoordinators[editableIndex].organizationId);
                        }
                        campusCoordinators[editableIndex].campusName = organizationSelected ? organizationSelected.description : '';

                        // Reorder the list (just the items related to the personId)
                        let start: number = -1;
                        let end: number = -1;
                        campusCoordinators.forEach((dh, dhIndex) => {
                            if (dh.personId === campusCoordinators[editableIndex].personId) {
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
                            const preSorted: ICampusCoordinator[]
                                = (start > 0) ? campusCoordinators.slice(0, start) : [];
                            const postSorted: ICampusCoordinator[]
                                = (end < campusCoordinators.length) ? campusCoordinators.slice(end) : [];
                            const sorted: ICampusCoordinator[]
                                = campusCoordinators.slice(start, end).sort((objA, objB) =>
                                    (objA.campusName < objB.campusName) ? -1
                                        : (objA.campusName > objB.campusName) ? 1 : 0);

                            campusCoordinators.length = 0;
                            campusCoordinators.push.apply(campusCoordinators, preSorted.concat(sorted).concat(postSorted));
                        }

                        this.setState({
                            campusCoordinators: campusCoordinators,
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
            this.logError(LogData.fromException(this.resolvePostSaveCampusCoordinator.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getCampusCoordinators(this.resolveGetCampusCoordinators, this.logError);
            this.showLoaderOptions();
            Requests.getCampusCoordinatorsOptions(this.resolveGetCampusCoordinatorsOptions, this.logError);
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
            campusCoordinators,
            organizationOptions,
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
        let dossier: JSX.Element | undefined;
        let peopleSearchModal: JSX.Element | undefined;
        if (!componentError && resources) {
            let emptyOption: IDropDownOption;
            emptyOption = {
                description: this.layoutResources ? this.layoutResources.lblDropDownEmptyText : '',
                value: ''
            };
            let contentTable: JSX.Element | undefined;
            if (!isLoading) {
                if (campusCoordinators && campusCoordinators.length > 0) {
                    contentTable = (
                        <Table
                            breakpoint="sm"
                            classes={{ root: classes.table }}
                            id="tblCampusCoordinator"
                            variant="expansionPanels"
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell component="th">
                                        {resources.lblCampusCoordinator}
                                    </TableCell>
                                    <TableCell component="th">
                                        {resources.lblOrganization}
                                    </TableCell>
                                    <TableCell />
                                    <TableCell />
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {campusCoordinators ? campusCoordinators.map((campusCoordinatorRow, campusCoordinatorIndex) => (
                                    <TableExpandableRow
                                        key={`campusCoordinatorRow_${campusCoordinatorIndex}`}
                                    >
                                        <TableCell>
                                            <AvatarText
                                                ButtonProps={hasDossierClaim ? {
                                                    'data-id': campusCoordinatorRow.personId,
                                                    id: `btnCampusCoordinatorName_${campusCoordinatorRow}`,
                                                    onClick: this.onViewDossier
                                                } : undefined}
                                                avatarInfo={campusCoordinatorRow}
                                            />
                                        </TableCell>
                                        <TableEditableCell
                                            columnName={resources.lblOrganization}
                                            content={campusCoordinatorRow.campusName}
                                            edit={Boolean(campusCoordinatorRow.isEditable)}
                                            editableComponent={
                                                (
                                                    <Dropdown
                                                        error={campusCoordinatorRow.isModified &&
                                                            (!Boolean(campusCoordinatorRow.organizationId)
                                                                || campusCoordinatorRow.isDuplicated)}
                                                        helperText={campusCoordinatorRow.isModified
                                                            ? (!Boolean(campusCoordinatorRow.organizationId)
                                                                ? resources.lblOrganizationRequired
                                                                : (campusCoordinatorRow.isDuplicated
                                                                    ? resources.lblDuplicatedCampusCoordinator
                                                                    : undefined))
                                                            : undefined}
                                                        emptyOption={emptyOption}
                                                        id={`ddlOrganization_${campusCoordinatorIndex}`}
                                                        label={resources.lblOrganization}
                                                        loading={isLoadingOptions}
                                                        options={organizationOptions}
                                                        size="small"
                                                        value={campusCoordinatorRow.organizationId || emptyOption.value}
                                                        onChange={this.onDropDownChange}
                                                    />
                                                )}
                                            error={campusCoordinatorRow.isModified &&
                                                (!Boolean(campusCoordinatorRow.organizationId)
                                                    || campusCoordinatorRow.isDuplicated)}
                                        />
                                        {campusCoordinatorRow.isEditable ? (
                                            <TableCell>
                                                <Grid container alignItems="center" wrap="nowrap">
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
                                                                    id={`btnSave_${campusCoordinatorIndex}`}
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
                                                                    id={`btnCancel_${campusCoordinatorIndex}`}
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
                                            </TableCell>
                                        ) : (
                                                <TableCell>
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
                                                                        id={`btnEdit_${campusCoordinatorIndex}`}
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
                                                                        id={`btnDelete_${campusCoordinatorIndex}`}
                                                                    >
                                                                        <Icon large name="trash" />
                                                                    </IconButton>
                                                                </div>
                                                            </Tooltip>
                                                        </Grid>
                                                    </Grid>
                                                </TableCell>
                                            )}
                                    </TableExpandableRow>
                                )) : undefined}
                            </TableBody>
                        </Table>
                    );

                    deleteConfirmation = (
                        <ConfirmationDialog
                            contentText={Format.toString(resources.deleteCampusCoordinatorConfirmation.formatContent, [
                                deleteName
                            ])}
                            open={confirmationModalOpen}
                            primaryActionOnClick={this.onCloseDeleteConfirmationModal}
                            primaryActionText={resources.deleteCampusCoordinatorConfirmation.btnDecline}
                            secondaryActionOnClick={this.onDeleteConfirm}
                            secondaryActionText={resources.deleteCampusCoordinatorConfirmation.btnAccept}
                            title={resources.deleteCampusCoordinatorConfirmation.lblTitle}
                        />
                    );
                }
                else {
                    contentTable = (
                        <Illustration
                            color="secondary"
                            name="no-search-results"
                            text={resources.lblNoCampusCoordinators}
                        />
                    );
                }
            }
            else {
                contentTable = (<ContainerLoader id="ldrCampusCoordinators" height="md" />);
            }

            contentPage = (
                <Grid container>
                    <Grid item xs>
                        <Grid container>
                            <Grid item xs>
                                <Text size="h4">
                                    {resources.lblCampusCoordinatorTitle}
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
                    options={organizationOptions}
                    type={PeopleSearchAssignModalType.CampusCoordinator}
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
export default withStyles(styles)(CampusCoordinator);