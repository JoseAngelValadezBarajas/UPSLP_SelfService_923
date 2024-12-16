/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DossierSetup.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import DossierSetupEdit, { IDossierSetupEditResProps } from './DossierSetupEdit';
import DossierSetupEditCustom, { IDossierSetupEditCustomResProps } from './DossierSetupEditCustom';

// Types
import { DossierDisplayMode } from '@hedtech/powercampus-design-system/types/Dossier/DossierDisplayMode';
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IDossierSetupDetail } from '@hedtech/powercampus-design-system/types/Dossier/IDossierSetup';
import { IDossierSetupValidations, IDossierSetupAdmin } from '../../../Types/Dossier/IDossierSetupAdmin';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IDossierSetupResources } from '../../../Types/Resources/Administration/IDossierSetupResources';

// Helpers
import Lists from '@hedtech/powercampus-design-system/helpers/Lists';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/DossierSetupRequests';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IDossierSetupRes extends IDossierSetupResources {
    dossierSetupEdit: IDossierSetupEditResProps;
    dossierSetupEditCustom: IDossierSetupEditCustomResProps;
}

interface IDossierSetupState {
    deletedSetup?: IDossierSetupAdmin[];
    isLoading: boolean;
    isLoadingSave: boolean;
    isLoadingViews: boolean;
    resources?: IDossierSetupRes;
    selectedDossierType?: DossierType;
    selectedSetup?: IDossierSetupAdmin;
    selectedSetupIndex?: number;
    setup?: IDossierSetupAdmin[];
    setupValidations: IDossierSetupValidations;
    viewsOptions?: IDropDownOption[];
}
// #endregion Types

// #region Component
class DossierSetup extends React.Component<any, IDossierSetupState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IDossierSetupState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'DossierSetup';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDossierSetupState {
        let resources: IDossierSetupRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            isLoading: true,
            isLoadingSave: false,
            isLoadingViews: false,
            resources: resources,
            setupValidations: this.getDefaultValidations()
        };
    }

    // #region Events

    // #region New-Edit
    private onApplyCustom = (): void => {
        try {
            const {
                selectedSetup,
                selectedSetupIndex,
                setup,
                setupValidations
            } = this.state;

            if (selectedSetup) {
                // Validate save
                setupValidations.blockNameModified = true;
                setupValidations.displayModeModified = true;
                setupValidations.viewNameModified = true;

                this.setState({
                    setupValidations: setupValidations
                });

                if (setup
                    && selectedSetup.blockName
                    && !setupValidations.blockNameDuplicated
                    && selectedSetup.viewName
                    && selectedSetup.displayMode) {
                    if (selectedSetup.dossierSetupId !== 0 && selectedSetupIndex !== undefined) {
                        setup[selectedSetupIndex] = selectedSetup;
                    }
                    else {
                        selectedSetup.dossierSetupId = -1;
                        setup.push(selectedSetup);
                    }
                    this.setState({
                        setup: setup
                    }, this.onCancelCustom);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onApplyCustom.name, e));
        }
    };

    private onBlurName = (): void => {
        try {
            const {
                selectedSetup,
                selectedSetupIndex,
                setup,
                setupValidations
            } = this.state;

            if (setup && selectedSetup) {
                const index: number = setup.findIndex(s => s.blockName === selectedSetup.blockName);

                if (index >= 0) {
                    if (selectedSetup.dossierSetupId !== 0 && selectedSetupIndex !== undefined) {
                        if (index !== selectedSetupIndex) {
                            setupValidations.blockNameDuplicated = true;
                        }
                        else {
                            setupValidations.blockNameDuplicated = false;
                        }
                    }
                    else {
                        setupValidations.blockNameDuplicated = true;
                    }
                }
                else {
                    setupValidations.blockNameDuplicated = false;
                }

                this.setState({
                    setupValidations: setupValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurName.name, e));
        }
    };

    private onCancelCustom = (): void => {
        try {
            this.setState({
                selectedSetup: undefined,
                selectedSetupIndex: undefined,
                setupValidations: this.getDefaultValidations()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelCustom.name, e));
        }
    };

    private onChangeCheckbox = (): void => {
        try {
            const {
                selectedSetup
            } = this.state;

            if (selectedSetup) {
                selectedSetup.isActive = !selectedSetup.isActive;
                this.setState({
                    selectedSetup: selectedSetup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onChangeDropdown = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                selectedSetup,
                setupValidations
            } = this.state;

            if (selectedSetup) {
                switch (id) {
                    case 'ddlViewName':
                        selectedSetup.viewName = String(optionSelected.value);
                        setupValidations.viewNameModified = true;
                        break;
                    case 'ddlDisplayMode':
                        selectedSetup.displayMode = Number(optionSelected.value) as DossierDisplayMode;
                        setupValidations.displayModeModified = true;
                        break;
                }
                this.setState({
                    selectedSetup: selectedSetup,
                    setupValidations: setupValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeDropdown.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                selectedSetup,
                setupValidations
            } = this.state;

            const value: string = event.target.value;
            if (selectedSetup) {
                selectedSetup.blockName = value;
                setupValidations.blockNameModified = true;
                this.setState({
                    selectedSetup: selectedSetup,
                    setupValidations: setupValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };
    // #endregion New-Edit

    private onAddCustom = (): void => {
        try {
            const {
                selectedDossierType,
                setup,
                viewsOptions
            } = this.state;

            if (setup && selectedDossierType !== undefined) {
                if (!viewsOptions || (viewsOptions && viewsOptions.length <= 0)) {
                    this.showLoaderViews();
                    Requests.getDossierSetupViews(this.resolveGetDossierSetupViews);
                }
                this.setState({
                    selectedSetup: {
                        blockName: '',
                        dossierSetupDetails: [],
                        dossierSetupId: 0,
                        dossierType: selectedDossierType,
                        isActive: true,
                        isCustom: true,
                        isFixed: false,
                        isNew: true,
                        isRequired: false,
                        sortOrder: setup.length + 1,
                        displayMode: DossierDisplayMode.List,
                        showOptions: false,
                        viewName: ''
                    }
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddCustom.name, e));
        }
    };

    private onCancelEditSetup = (): void => {
        try {
            this.setState({
                deletedSetup: undefined,
                setup: undefined
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelEditSetup.name, e));
        }
    };

    private onChangeVisibility = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                setup
            } = this.state;

            if (setup) {
                const index: number = Number(event.currentTarget.dataset.index);
                if (event.currentTarget.id.startsWith("chkVisibleBlock")) {
                    setup[index].isActive = event.currentTarget.checked;
                }
                else {
                    const blockIndex: number = Number(event.currentTarget.dataset.blockIndex);
                    setup[blockIndex].dossierSetupDetails[index].isActive = event.currentTarget.checked;
                }
                this.setState({
                    setup: setup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeVisibility.name, e));
        }
    };

    private onDeleteCustom = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                deletedSetup,
                setup
            } = this.state;

            if (setup) {
                const index: number = Number(event.currentTarget.dataset.index);
                const deleted: IDossierSetupAdmin[] = setup.splice(index, 1);
                if (deletedSetup && !(deleted[0].isNew)) {
                    deletedSetup.push(deleted[0]);
                }
                this.setState({
                    deletedSetup: deletedSetup,
                    setup: setup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteCustom.name, e));
        }
    };

    private onDossierTypeClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const dossierType: DossierType = Number(event.currentTarget.dataset.type) as DossierType;
            this.setState({
                deletedSetup: [],
                selectedDossierType: dossierType
            }, this.showLoader);
            Requests.getSetup(dossierType, this.resolveGetDossierSetupByType);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDossierTypeClick.name, e));
        }
    };

    private onDragEndBlock = (result: any): void => {
        try {
            const {
                setup
            } = this.state;

            if (!result.destination || !result.source || result.source.droppableId !== result.destination.droppableId) {
                return;
            }

            if (setup) {
                if (result.type.startsWith('first-level')) {
                    const setupOrdered: any = Lists.Rearrange(
                        setup,
                        result.source.index,
                        result.destination.index
                    );

                    this.setState({
                        setup: setupOrdered
                    });
                }
                else {
                    const droppableIdParts: string[] = result.destination.droppableId.split('_');
                    const position: number = Number(droppableIdParts[1]);
                    const dossierSetupDetails: IDossierSetupDetail[] = setup[position].dossierSetupDetails;

                    const dossierSetupDetailsOrdered: any = Lists.Rearrange(
                        dossierSetupDetails,
                        result.source.index,
                        result.destination.index
                    );

                    setup[position].dossierSetupDetails = dossierSetupDetailsOrdered;

                    this.setState({
                        setup: setup
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDragEndBlock.name, e));
        }
    };

    private onEditCustom = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                setup,
                setupValidations,
                viewsOptions
            } = this.state;

            if (setup) {
                if (!viewsOptions || (viewsOptions && viewsOptions.length <= 0)) {
                    this.showLoaderViews();
                    Requests.getDossierSetupViews(this.resolveGetDossierSetupViews);
                }
                const index: number = Number(event.currentTarget.dataset.index);
                this.setState({
                    selectedSetup: { ...setup[index] },
                    selectedSetupIndex: index,
                    setupValidations: setupValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditCustom.name, e));
        }
    };

    private onSaveSetup = (): void => {
        try {
            const {
                deletedSetup,
                setup
            } = this.state;

            if (setup && deletedSetup) {
                this.showLoaderSave();
                setup.forEach((block, iBlock) => {
                    block.sortOrder = iBlock + 1;
                    if (block.dossierSetupDetails) {
                        block.dossierSetupDetails.forEach((field, iField) => field.sortOrder = iField + 1);
                    }
                });
                const adds: IDossierSetupAdmin[] = setup.filter(s => s.isNew);
                const updates: IDossierSetupAdmin[] = setup.filter(s => !s.isNew);
                Requests.saveSetup(adds, deletedSetup, updates, this.resolveSaveSetup);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSetup.name, e));
        }
    };

    private onViewOptionsClick = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            const {
                setup
            } = this.state;

            if (setup) {
                const index: number = Number(event.currentTarget.dataset.index);
                setup[index].showOptions = !setup[index].showOptions;
                this.setState({
                    setup: setup
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onViewOptionsClick.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getDefaultValidations(): IDossierSetupValidations {
        return {
            blockNameDuplicated: false,
            blockNameModified: false,
            displayModeModified: false,
            viewNameModified: false
        };
    }
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingSave: false,
            isLoadingViews: false
        }, LayoutActions.hidePageLoader);
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

    private hideLoaderViews = (): void => {
        this.setState({
            isLoadingViews: false
        });
    };

    private showLoader = (): void => {
        this.setState({
            isLoading: true
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
        });
    };

    private showLoaderViews = (): void => {
        this.setState({
            isLoadingViews: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    }

    //private redirectError(code: number): void {
    //    this.hideAllLoaders();
    //    LayoutActions.setRedirectCode(code);
    //}

    private showError(message?: string): void {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetDossierSetupByType = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetDossierSetupByType.name);
            if (result?.status) {
                this.setState({
                    setup: result.data
                }, this.hideLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDossierSetupByType.name, e));
        }
    };

    private resolveGetDossierSetupViews = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetDossierSetupViews.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    viewsOptions: result.data
                }, this.hideLoaderViews);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetDossierSetupViews.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetResources.name);
            if (result?.status) {
                this.setState({
                    resources: result.data
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveSaveSetup = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveSaveSetup.name);
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
                        deletedSetup: undefined,
                        selectedDossierType: undefined,
                        setup: undefined
                    }, this.hideLoaderSave);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveSetup.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            if (!this.state.resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            selectedDossierType,
            isLoading,
            isLoadingSave,
            isLoadingViews,
            resources,
            selectedSetup,
            setup,
            setupValidations,
            viewsOptions
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (resources) {
            if (isLoading) {
                contentPage = (<ContainerLoader id="ldrDossierSetup" height="md" />);
            }
            else {
                if (setup && setup.length > 0 && selectedDossierType !== undefined) {
                    contentPage = (
                        <>
                            <DossierSetupEdit
                                dossierType={selectedDossierType}
                                isLoadingSave={isLoadingSave}
                                resources={resources.dossierSetupEdit}
                                setup={setup}
                                onAddCustom={this.onAddCustom}
                                onCancelEditSetup={this.onCancelEditSetup}
                                onChangeVisibility={this.onChangeVisibility}
                                onDeleteCustom={this.onDeleteCustom}
                                onDragEndBlock={this.onDragEndBlock}
                                onEditCustom={this.onEditCustom}
                                onSaveSetup={this.onSaveSetup}
                                onViewOptionsClick={this.onViewOptionsClick}
                            />
                            {selectedSetup && (
                                <DossierSetupEditCustom
                                    isLoadingViews={isLoadingViews}
                                    open
                                    resources={resources.dossierSetupEditCustom}
                                    setup={selectedSetup}
                                    setupValidations={setupValidations}
                                    viewsOptions={viewsOptions}
                                    onApply={this.onApplyCustom}
                                    onBlurName={this.onBlurName}
                                    onCancel={this.onCancelCustom}
                                    onChangeCheckbox={this.onChangeCheckbox}
                                    onChangeDropdown={this.onChangeDropdown}
                                    onChangeTextField={this.onChangeTextField}
                                />
                            )}
                        </>
                    );
                }
                else {
                    contentPage = (
                        <Grid container>
                            <Grid item xs={12}>
                                <Text size="large">
                                    {resources.lblDossierInstructions}
                                </Text>
                                <br />
                                <Table
                                    breakpoint="sm"
                                    id="tblDossierTypes"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblName}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        <TableRow>
                                            <TableCell
                                                columnName={resources.lblName}
                                            >
                                                <Button
                                                    align="left"
                                                    data-type={DossierType.Student}
                                                    id="btnStudentDossier"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={this.onDossierTypeClick}
                                                >
                                                    {resources.btnStudentDossier}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                columnName={resources.lblName}
                                            >
                                                <Button
                                                    align="left"
                                                    data-type={DossierType.Faculty}
                                                    id="btnFacultyDossier"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={this.onDossierTypeClick}
                                                >
                                                    {resources.btnFacultyDossier}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                        <TableRow>
                                            <TableCell
                                                columnName={resources.lblName}
                                            >
                                                <Button
                                                    align="left"
                                                    data-type={DossierType.General}
                                                    id="btnGeneralDossier"
                                                    textVariantStyling="inherit"
                                                    variant="text"
                                                    onClick={this.onDossierTypeClick}
                                                >
                                                    {resources.btnGeneralDossier}
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                    );
                }
            }
        }

        return (
            <>
                {contentPage}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default DossierSetup;