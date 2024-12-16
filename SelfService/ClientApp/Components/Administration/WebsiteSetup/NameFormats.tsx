/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: NameFormats.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import Paragraph from '@hedtech/powercampus-design-system/react/core/Paragraph';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import NameFormatExamplesModal, { INameFormatExamplesModalResProps } from './NameFormatExamplesModal';
import NameFormatsEdit, { INameFormatsEditResProps } from './NameFormatsEdit';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { INameFormat } from '../../../Types/NameFormat/INameFormat';
import { INameFormatExample } from '../../../Types/NameFormat/INameFormatExample';
import { INameFormatItem } from '../../../Types/NameFormat/INameFormatItem';
import { INameFormatList } from '../../../Types/NameFormat/INameFormatList';
import { INameFormatsResources } from '../../../Types/Resources/Administration/INameFormatsResources';
import { INamePartItem } from '../../../Types/NameFormat/INamePartItem';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Lists from '@hedtech/powercampus-design-system/helpers/Lists';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/NameFormats';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface INameFormatsProps {
    lblSuccessSave: string;
}

interface INameFormatsRes extends INameFormatsResources {
    nameFormatsEdit: INameFormatsEditResProps;
    nameFormatExamplesModal: INameFormatExamplesModalResProps;
}

interface INameFormatsState {
    alertText?: string;
    componentError: boolean;
    isNameEmpty: boolean;
    isUniqueNamePart: boolean;
    nameFormat?: INameFormat;
    nameFormatList?: INameFormatList;
    nameParts: IDropDownOption[];
    resources?: INameFormatsRes;
    showAlert: boolean;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    // #region DeleteNameFormat
    nameFormatToDelete?: string;
    nameFormatId?: number;
    openDeleteModal: boolean;
    // #endregion DeleteNameFormat

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper

    // #region NameFormatsEdit
    editField?: number;
    isNameFormatEditVisible: boolean;
    namePartModified: boolean;
    namePartSelected?: string;
    namePreviews: string[];
    namePartDescSelected?: string;
    openAddNamePart: boolean;
    openDeleteFieldConfirmationDialog: boolean;
    openDeleteNamePart: boolean;
    openEditingField: boolean;
    selectedNameParts: string[];
    separatorSelected?: string;
    unselectedNameParts: string[];
    // #endregion NameFormatsEdit

    // #region Examples
    openNameFormatExamplesModal: boolean;
    examples: INameFormatExample[];
    // #endregion Examples
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '35%'
            },

            // Alignment
            '& > tbody > tr > td:nth-child(n+2)': {
                textAlign: 'center'
            },
            '& > thead > tr > th:nth-child(n+2)': {
                textAlign: 'center'
            }
        }
    }
}));

type PropsWithStyles = INameFormatsProps & WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class NameFormats extends React.Component<PropsWithStyles, INameFormatsState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    private examplesBackup: INameFormatExample[];

    public readonly state: Readonly<INameFormatsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'NameFormats';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        this.examplesBackup = [];
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): INameFormatsState {
        let resources: INameFormatsRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            componentError: false,
            isNameEmpty: false,
            page: 0,
            resources: resources,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            showAlert: false,

            // #region DeleteNameFormat
            openDeleteModal: false,
            // #endregion DeleteNameFormat

            // #region Stepper
            activeStep: 0,
            numSteps: 3,
            stepErrors: [false, false, false],
            // #endregion Stepper

            // #region NameFormatsEdit
            // isInitialLetterSelected: false,
            isNameFormatEditVisible: false,
            isUniqueNamePart: true,
            namePartModified: false,
            nameParts: [],
            namePreviews: [],
            openAddNamePart: false,
            openDeleteFieldConfirmationDialog: false,
            openDeleteNamePart: false,
            openEditingField: false,
            selectedNameParts: [],
            unselectedNameParts: [],
            // #endregion NameFormatsEdit

            // #region Examples
            examples: [],
            openNameFormatExamplesModal: false
            // #endregion Examples
        };
    }

    // #region Events

    // #region Pagination
    private getRowsPerPageOptions(maxValue: number): number[] {
        const rowsPerPageOptions: number[] = [];
        try {
            this.rowsPerPageOptions.forEach(option => {
                if (option < maxValue) {
                    rowsPerPageOptions.push(option);
                }
            });
            if (rowsPerPageOptions.length > 0 && rowsPerPageOptions[rowsPerPageOptions.length - 1] !== maxValue) {
                rowsPerPageOptions.push(maxValue);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.getRowsPerPageOptions.name, e));
        }
        return rowsPerPageOptions;
    }

    private onChangePage = (_event: any, page: number): void => {
        try {
            const {
                rowsPerPage
            } = this.state;

            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page
            }, () => {
                LayoutActions.setLoading(true);
                Requests.getNameFormats(page * rowsPerPage, rowsPerPage, this.resolveGetNameFormats, this.logError);
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePage.name, e));
        }
    };

    private onChangeRowsPerPage = (event: any): void => {
        try {
            this.setState({
                page: 0,
                rowsPerPage: Number(event.target.value)
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeRowsPerPage.name, e));
        }
    };
    // #endregion Pagination

    // #region New-Edit
    private onCancelNameFormat = (): void => {
        try {
            this.setState({
                alertText: undefined,
                nameFormatList: undefined,
                nameParts: [],
                showAlert: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelNameFormat.name, e));
        }
    };

    private onCloseAlert = (): void => {
        try {
            this.setState({
                alertText: undefined,
                showAlert: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAlert.name, e));
        }
    };

    private onChangeActive = (): void => {
        try {
            const {
                nameFormatList
            } = this.state;

            if (nameFormatList) {
                const nameFormat: INameFormatList = { ...nameFormatList };
                nameFormat.isActive = !nameFormat.isActive;
                this.setState({
                    nameFormatList: nameFormat
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeActive.name, e));
        }
    };

    private onChangeNameFormat = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                nameFormatList
            } = this.state;

            if (nameFormatList) {
                nameFormatList.name = event.target.value
                if (nameFormatList.name.trim()) {
                    this.setState({
                        isNameEmpty: false,
                        nameFormatList: nameFormatList
                    });
                }
                else {
                    this.setState({
                        isNameEmpty: true
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeNameFormat.name, e));
        }
    };

    private onDragEnd = (result: any) => {
        try {
            if (!result.destination || !result.source) {
                return;
            }

            const {
                nameFormatList,
                selectedNameParts,
                unselectedNameParts
            } = this.state;

            const droppableId: string = result.source.droppableId;
            switch (droppableId) {
                case 'drpFields':
                    if (result.source.droppableId !== result.destination.droppableId) {
                        return;
                    }

                    if (nameFormatList?.namePartList) {
                        const orderedFields: any = Lists.Rearrange(
                            nameFormatList.namePartList,
                            result.source.index,
                            result.destination.index
                        );

                        nameFormatList.namePartList = orderedFields;
                        this.setState({
                            nameFormatList
                        });
                    }
                    break;

                case 'drpUnSelectedNameParts':
                    if (result.destination.droppableId === 'drpUnSelectedNameParts') {
                        const reorderedUnselectedNameParts: string[] = Lists.Rearrange(
                            unselectedNameParts,
                            result.source.index,
                            result.destination.index
                        );

                        this.setState({
                            unselectedNameParts: [...reorderedUnselectedNameParts]
                        });
                    }
                    else if (result.destination.droppableId === 'drpSelectedNameParts') {
                        const removed: string = unselectedNameParts.splice(result.source.index, 1)[0];
                        const copySelected: string[] = [...selectedNameParts];
                        copySelected.splice(result.destination.index, 0, removed);
                        this.setState({
                            selectedNameParts: copySelected
                        });
                    }
                    break;

                case 'drpSelectedNameParts':
                    if (result.destination.droppableId === 'drpSelectedNameParts') {
                        const reorderedSelectedNameParts: string[] = Lists.Rearrange(
                            selectedNameParts,
                            result.source.index,
                            result.destination.index
                        );

                        this.setState({
                            selectedNameParts: [...reorderedSelectedNameParts]
                        });
                    }
                    else if (result.destination.droppableId === 'drpUnSelectedNameParts') {
                        const removed: string = selectedNameParts.splice(result.source.index, 1)[0];
                        const copyUnselected: string[] = [...unselectedNameParts];
                        copyUnselected.splice(result.destination.index, 0, removed);
                        this.setState({
                            unselectedNameParts: copyUnselected
                        });
                    }
                    break;
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDragEnd.name, e));
        }
    };

    private onEditField = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const editFieldIndex: number = Number(event.currentTarget.dataset.id);

            const {
                nameFormatList,
                resources
            } = this.state;

            if (nameFormatList && nameFormatList.namePartList && editFieldIndex > -1
                && resources) {
                const namePartDescSelected: string =
                    this.getNamePartDesc(nameFormatList.namePartList[editFieldIndex].namePart);

                this.setState({
                    editField: editFieldIndex,
                    openEditingField: true,
                    namePartSelected: nameFormatList.namePartList[editFieldIndex].namePart,
                    namePartDescSelected: namePartDescSelected,
                    separatorSelected: nameFormatList.namePartList[editFieldIndex].separator
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditField.name, e));
        }
    };

    private onOpenDeleteNamePart = (event: React.MouseEvent<HTMLButtonElement>) => {
        try {
            const editFieldIndex: number = Number(event.currentTarget.dataset.id);

            const {
                nameFormatList,
                resources
            } = this.state;

            if (nameFormatList && nameFormatList.namePartList && editFieldIndex > -1
                && resources) {
                const namePartDescSelected: string =
                    this.getNamePartDesc(nameFormatList.namePartList[editFieldIndex].namePart);

                this.setState({
                    editField: editFieldIndex,
                    openDeleteNamePart: true,
                    namePartSelected: nameFormatList.namePartList[editFieldIndex].namePart,
                    namePartDescSelected: namePartDescSelected
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteNamePart.name, e));
        }
    };

    private onAddNamePart = () => {
        try {
            this.setState({
                namePartModified: false,
                namePartSelected: undefined,
                separatorSelected: undefined,
                openAddNamePart: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddNamePart.name, e));
        }
    };

    private onChangeNamePart = (optionSelected: IDropDownOption): void => {
        try {
            this.setState({
                isUniqueNamePart: true,
                namePartModified: true,
                namePartSelected: optionSelected.value.toString()
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeNamePart.name, e));
        }
    };

    private onChangeSeparator = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            this.setState({
                separatorSelected: event.target.value
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSeparator.name, e));
        }
    };

    private onAddNameFormatField = (): void => {
        try {
            LayoutActions.showPageLoader();
            const {
                nameFormatList,
                namePartSelected,
                resources,
                separatorSelected,
                unselectedNameParts
            } = this.state;

            // When no name part is selected
            if (!namePartSelected) {
                this.setState({
                    namePartModified: true
                });
            }
            else {
                if (resources) {
                    if (namePartSelected && nameFormatList && nameFormatList.namePartList) {
                        let error: boolean = false;
                        // When name part already exist
                        if (nameFormatList.namePartList.find(x => x.namePart === namePartSelected)) {
                            this.setState({
                                isUniqueNamePart: false
                            });
                            error = true;
                        }
                        else {
                            // First name and display name cannot be selected at same time
                            if (nameFormatList.namePartList.find(x => x.namePart === "DN")) {
                                if (namePartSelected === "FN") {
                                    this.setState({
                                        showAlert: true,
                                        alertText: resources.nameFormatsEdit.lblDisplayFirstName
                                    })
                                    error = true;
                                }
                            }
                            if (nameFormatList.namePartList.find(x => x.namePart === "FN")) {
                                if (namePartSelected === "DN") {
                                    this.setState({
                                        showAlert: true,
                                        alertText: resources.nameFormatsEdit.lblDisplayFirstName
                                    })
                                    error = true;
                                }
                            }
                            this.setState({
                                namePartSelected: undefined,
                                separatorSelected: undefined,
                                openAddNamePart: false,
                                unselectedNameParts
                            });
                        }
                        // If no errros exists add name part to lists
                        if (!error) {
                            const namePartItem: INamePartItem =
                            {
                                displayOrder: 0,
                                sortOrder: 0,
                                namePart: namePartSelected,
                                separator: separatorSelected ? separatorSelected : '',
                                isChanged: false
                            };
                            nameFormatList.namePartList.push(namePartItem);
                            unselectedNameParts.push(namePartSelected);
                            this.setState({
                                isUniqueNamePart: true,
                                namePartSelected: undefined,
                                separatorSelected: undefined,
                                openAddNamePart: false,
                                unselectedNameParts
                            });
                        }
                    }
                    else {
                        // When no namepart exists already
                        if (namePartSelected && nameFormatList) {
                            const namePartItem: INamePartItem[] =
                                [{
                                    displayOrder: 0,
                                    sortOrder: 0,
                                    namePart: namePartSelected,
                                    separator: separatorSelected ? separatorSelected : '',
                                    isChanged: false
                                }];
                            nameFormatList.namePartList = namePartItem;
                            unselectedNameParts.push(namePartSelected);
                            this.setState({
                                namePartSelected: undefined,
                                separatorSelected: undefined,
                                openAddNamePart: false,
                                unselectedNameParts
                            });
                        }
                    }
                }
            }
            LayoutActions.hidePageLoader();
        }
        catch (e) {
            LayoutActions.hidePageLoader();
            this.logError(LogData.fromException(this.onAddNameFormatField.name, e));
        }
    };

    private onCloseAddNamePart = (): void => {
        try {
            this.setState({
                isUniqueNamePart: true,
                openAddNamePart: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseAddNamePart.name, e));
        }
    };

    private onClickStep = (event: any): void => {
        try {
            const {
                activeStep,
                nameFormatList,
                numSteps,
                selectedNameParts,
                stepErrors,
                resources
            } = this.state;

            const positionParts: string[] = event.currentTarget.id.split('_');
            const position: number = Number(positionParts[1]);
            if (resources && position >= 0 && position <= numSteps) {
                let canChangeStep: boolean = false;
                if (position < activeStep) {
                    canChangeStep = true;
                }
                else {
                    switch (activeStep) {
                        case 0:
                            if (nameFormatList && nameFormatList.namePartList && nameFormatList.namePartList.length > 0) {
                                canChangeStep = true;
                                stepErrors[0] = false;
                                this.setState({
                                    alertText: undefined,
                                    showAlert: false,
                                });
                            }
                            else {
                                stepErrors[0] = true;
                                canChangeStep = false;
                                this.setState({
                                    alertText: resources.nameFormatsEdit.lblSelectNamePart,
                                    showAlert: true,
                                });
                            }
                            break;
                        case 1:
                            if (selectedNameParts.length) {
                                this.updatePreview();
                                canChangeStep = true;
                                stepErrors[1] = false;
                                this.setState({
                                    alertText: undefined,
                                    showAlert: false,
                                });
                            }
                            else {
                                this.setState({
                                    alertText: undefined,
                                    showAlert: false,
                                });
                                stepErrors[1] = true;
                                canChangeStep = false;
                                this.setState({
                                    alertText: resources.nameFormatsEdit.lblNamePartSortRequired,
                                    showAlert: true,
                                });
                            }
                            break;
                        case 2:
                            canChangeStep = true;
                            break;
                    }
                }
                if (canChangeStep) {
                    this.setState({
                        activeStep: position,
                        stepErrors
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickStep.name, e));
        }
    };

    private onChangeCheckbox = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                nameFormatList
            } = this.state;
            if (nameFormatList) {
                const checked: boolean = event.target.checked;
                nameFormatList.showMiddleNameInitial = checked;
                this.setState({
                    nameFormatList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCheckbox.name, e));
        }
    };

    private onCloseEditingField = (): void => {
        try {
            this.setState({
                openEditingField: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseEditingField.name, e));
        }
    };

    private onEditingField = (): void => {
        try {
            const {
                editField,
                nameFormatList,
                separatorSelected,
                resources
            } = this.state;

            if (nameFormatList && nameFormatList.namePartList && editField !== undefined &&
                resources) {
                if (separatorSelected) {
                    nameFormatList.namePartList[editField].separator = separatorSelected;
                }
                else {
                    nameFormatList.namePartList[editField].separator = '';
                }

                this.setState({
                    openEditingField: false,
                    nameFormatList
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditingField.name, e));
        }
    };

    private onFinish = (): void => {
        try {
            const {
                nameFormatList,
                selectedNameParts,
                stepErrors
            } = this.state;

            if (nameFormatList && !nameFormatList.name) {
                stepErrors[2] = true;
                this.setState({
                    isNameEmpty: true,
                    stepErrors
                });
            }
            else {
                if (nameFormatList) {
                    stepErrors[2] = false;
                    const nameFormats: INameFormatList = { ...nameFormatList };
                    LayoutActions.setLoading(true);

                    if (nameFormats && nameFormats.namePartList) {
                        for (let i = 0; i < nameFormats.namePartList.length; i++) {
                            nameFormats.namePartList[i].displayOrder = i + 1;
                            nameFormats.namePartList[i].sortOrder = 0;
                        }
                        for (let j = 0; j < selectedNameParts.length; j++) {
                            const index: number =
                                nameFormats.namePartList.findIndex(x => x.namePart === selectedNameParts[j]);
                            if (index > -1) {
                                nameFormats.namePartList[index].sortOrder = j + 1;
                            }
                        }
                    }
                    Requests.postPostSaveNameFormat(nameFormats, this.resolvePostSaveNameFormat, this.logError);
                }
            }

            this.setState({
                stepErrors
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinish.name, e));
        }
    }
    // #endregion New-Edit

    private onAddNameFormat = (): void => {
        try {
            LayoutActions.setLoading(true);
            Requests.getNameFormat(0, this.resolveGetNameFormat, this.logError);
            this.setState({
                alertText: undefined,
                isNameFormatEditVisible: true,
                showAlert: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddNameFormat.name, e));
        }
    };

    private onChangeEnableDisable = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                nameFormat
            } = this.state;

            const id: string[] = event.target.id.split('_');
            const nameFormatId: number = Number(id[1]);
            const isActive: boolean = !Boolean(event.target.value);
            if (nameFormat && nameFormat.nameFormatList) {
                const nameFormatModified: INameFormatItem | undefined
                    = nameFormat.nameFormatList.find(nf => nf.id === nameFormatId);
                if (nameFormatModified) {
                    nameFormatModified.isActiveChanged = isActive;
                    nameFormatModified.isLoading = true;
                    this.setState({
                        nameFormat: nameFormat
                    });
                    Requests.postStatus(nameFormatId, isActive, this.resolvePostStatus, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeEnableDisable.name, e));
        }
    };

    private onClickNameFormat = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        try {
            LayoutActions.setLoading(true);
            const id: string[] = event.currentTarget.id.split('_');
            Requests.getNameFormat(Number(id[1]), this.resolveGetNameFormat, this.logError);
            this.setState({
                alertText: undefined,
                isNameFormatEditVisible: true,
                showAlert: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickNameFormat.name, e));
        }
    };

    private onOpenDeleteModal = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            LayoutActions.setLoading(true);
            const data: any = event.target.id.split('_');
            const nameFormatId: number = Number(data[1]);
            const nameFormatToDelete: string = data[2];
            if (nameFormatId) {
                this.setState({
                    nameFormatId,
                    nameFormatToDelete,
                    openDeleteModal: true
                });
            }
            LayoutActions.hidePageLoader();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenDeleteModal.name, e));
        }
    };

    private onCloseDeleteModal = () => {
        try {
            this.setState({
                openDeleteModal: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteModal.name, e));
        }
    };

    private onDeleteNameFormat = () => {
        try {
            const {
                nameFormatId
            } = this.state;
            if (nameFormatId) {
                Requests.postDelete(nameFormatId, this.resolveDeleteNameFormat, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteNameFormat.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            const {
                examples
            } = this.state;

            const id: string = event.target.id.split('_')[0];
            const index: number = Number(event.target.id.split('_')[1]);
            switch (id) {
                case 'txtPrefix':
                    examples[index].prefix = event.target.value;
                    break;

                case 'txtLastName':
                    examples[index].lastName = event.target.value;
                    break;

                case 'txtFirstName':
                    examples[index].firstName = event.target.value;
                    break;

                case 'txtSuffix':
                    examples[index].suffix = event.target.value;
                    break;

                case 'txtMiddleName':
                    examples[index].middleName = event.target.value;
                    break;

                case 'txtDisplayName':
                    examples[index].displayName = event.target.value;
                    break;

                case 'txtLastNamePrefix':
                    examples[index].lastNamePrefix = event.target.value;
                    break;

                case 'txtPronoun':
                    examples[index].pronoun = event.target.value;
                    break;
            }

            this.setState({
                examples: examples
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onDeleteNamePart = () => {
        try {
            const {
                editField,
                nameFormatList,
                selectedNameParts,
                unselectedNameParts
            } = this.state;

            if (editField !== undefined && nameFormatList && nameFormatList.namePartList &&
                nameFormatList.namePartList[editField]) {
                const nameFormat: INamePartItem = nameFormatList.namePartList[editField];
                const selected: number =
                    selectedNameParts.findIndex(x => x === nameFormat.namePart);
                if (selected > -1) {
                    selectedNameParts.splice(selected, 1);
                }
                const unselected: number =
                    unselectedNameParts.findIndex(x => x === nameFormat.namePart);
                if (unselected > -1) {
                    unselectedNameParts.splice(unselected, 1);
                }
                nameFormatList.namePartList.splice(editField, 1);
                this.setState({
                    nameFormatList,
                    openDeleteNamePart: false,
                    selectedNameParts,
                    unselectedNameParts
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteNamePart.name, e));
        }
    };

    private onCloseDeleteNamePart = () => {
        try {
            this.setState({
                openDeleteNamePart: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseDeleteNamePart.name, e));
        }
    };

    private onClickCancel = () => {
        try {
            this.setState({
                activeStep: 0,
                editField: undefined,
                stepErrors: [false, false, false],
                isNameEmpty: false,
                isNameFormatEditVisible: false,
                nameFormatList: undefined,
                nameParts: [],
                numSteps: 3,
                openAddNamePart: false,
                openDeleteFieldConfirmationDialog: false,
                openDeleteNamePart: false,
                openEditingField: false,
                selectedNameParts: [],
                unselectedNameParts: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickCancel.name, e));
        }
    }

    // #region Examples
    private onOpenChangeExampleModal = (): void => {
        try {
            const {
                examples
            } = this.state;

            examples.forEach(example => {
                this.examplesBackup.push({ ...example } as INameFormatExample);
            });

            this.setState({
                openNameFormatExamplesModal: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenChangeExampleModal.name, e));
        }
    };

    private onSaveExamples = () => {
        try {
            const {
                examples
            } = this.state;

            LayoutActions.showPageLoader();
            Requests.saveNameFormatExamples(JSON.stringify(examples), this.resolveSaveNameFormatExamples);
            this.updatePreview();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveExamples.name, e));
        }
    };

    private onCloseExamplesModal = () => {
        try {
            this.setState({
                examples: [...this.examplesBackup],
                openNameFormatExamplesModal: false
            });
            this.examplesBackup = [];
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseExamplesModal.name, e));
        }
    };
    // #endregion Examples

    // #endregion Events

    // #region Functions
    private getExamplePreview(namePartItems: INamePartItem[], showMiddleNameInitial: boolean, example: INameFormatExample): string {
        let namePreview: string = '';
        let lastSeparator: string = '';
        namePartItems.forEach(namePartItem => {
            switch (namePartItem.namePart) {
                case 'PX':
                    if (example.prefix.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.prefix;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'FN':
                    if (example.firstName.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.firstName;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'MN':
                    if (example.middleName.length > 0) {
                        namePreview += lastSeparator;
                        if (showMiddleNameInitial) {
                            namePreview += example.middleName[0];
                        }
                        else {
                            namePreview += example.middleName;
                        }
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'LP':
                    if (example.lastNamePrefix.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.lastNamePrefix;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'LN':
                    if (example.lastName.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.lastName;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'DN':
                    if (example.displayName.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.displayName;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'PN':
                    if (example.pronoun.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.pronoun;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
                case 'SX':
                    if (example.suffix.length > 0) {
                        namePreview += lastSeparator;
                        namePreview += example.suffix;
                        lastSeparator = namePartItem.separator;
                    }
                    break;
            }
        });
        return namePreview;
    }

    private sortExamples(enlistingOrder: string[], examples: INameFormatExample[]): INameFormatExample[] {
        const sortedProperties: string[] = [];
        enlistingOrder.forEach(namePart => {
            switch (namePart) {
                case 'PX':
                    sortedProperties.push('prefix');
                    break;
                case 'FN':
                    sortedProperties.push('firstName');
                    break;
                case 'MN':
                    sortedProperties.push('middleName');
                    break;
                case 'LP':
                    sortedProperties.push('lastNamePrefix');
                    break;
                case 'LN':
                    sortedProperties.push('lastName');
                    break;
                case 'DN':
                    sortedProperties.push('displayName');
                    break;
                case 'PN':
                    sortedProperties.push('pronoun');
                    break;
                case 'SX':
                    sortedProperties.push('suffix');
                    break;
            }
        });

        const tmpExamples: INameFormatExample[] = [...examples];
        tmpExamples.sort((a, b) => {
            for (let i = 0; i < sortedProperties.length; i++) {
                if (a[sortedProperties[i]] > b[sortedProperties[i]]) {
                    return 1;
                }
                else if (a[sortedProperties[i]] < b[sortedProperties[i]]) {
                    return -1;
                }
            }
            return 0;
        });
        return tmpExamples;
    }

    private updatePreview(): void {
        const {
            selectedNameParts,
            examples,
            nameFormatList
        } = this.state;

        const sortedExamples: INameFormatExample[] = this.sortExamples(selectedNameParts, examples);
        const namePreviews: string[] = [];
        sortedExamples.forEach(example => {
            if (nameFormatList?.namePartList &&
                (Object.values(example).some(property => property.length > 0))) {
                namePreviews.push(this.getExamplePreview(nameFormatList.namePartList, nameFormatList.showMiddleNameInitial, example));
            }
        });
        this.setState({
            namePreviews: namePreviews
        });
    }

    private getNamePartDesc(namePart): string {
        const {
            resources
        } = this.state;

        let namePartDescSelected: string = '';
        if (resources) {
            switch (namePart) {
                case 'PX':
                    namePartDescSelected = resources.nameFormatsEdit.lblPrefix;
                    break;
                case 'FN':
                    namePartDescSelected = resources.nameFormatsEdit.lblFirstName;
                    break;
                case 'MN':
                    namePartDescSelected = resources.nameFormatsEdit.lblMiddleName;
                    break;
                case 'LP':
                    namePartDescSelected = resources.nameFormatsEdit.lblLastNamePrefix;
                    break;
                case 'LN':
                    namePartDescSelected = resources.nameFormatsEdit.lblLastName;
                    break;
                case 'DN':
                    namePartDescSelected = resources.nameFormatsEdit.lblDisplayName;
                    break;
                case 'PN':
                    namePartDescSelected = resources.nameFormatsEdit.lblPronoun;
                    break;
                case 'SX':
                    namePartDescSelected = resources.nameFormatsEdit.lblSuffix;
                    break;
            }
        }
        return namePartDescSelected;
    }

    private setSortList(): void {
        const {
            nameFormatList
        } = this.state;

        if (nameFormatList && nameFormatList.namePartList) {
            const selectedParts: string[] = [];
            const unselectedParts: string[] = [];
            const sortedNameParts: INamePartItem[] = [...nameFormatList.namePartList].sort((a, b) => {
                if (a.sortOrder < b.sortOrder) {
                    return -1;
                }
                if (a.sortOrder > b.sortOrder) {
                    return 1;
                }
                return 0;
            });
            for (let i = 0; i < sortedNameParts.length; i++) {
                if (sortedNameParts[i].sortOrder) {
                    selectedParts.push(sortedNameParts[i].namePart);
                }
                else {
                    unselectedParts.push(sortedNameParts[i].namePart);
                }
            }

            this.setState({
                selectedNameParts: selectedParts,
                unselectedNameParts: unselectedParts
            });
        }
    }
    // #endregion Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    }
    // #endregion Error Functions

    // #region Resolvers
    private resolveGetNameFormat = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNameFormat.name);

            if (result?.status) {
                const nameFormatList: INameFormatList = result.data.nameFormat;
                const nameParts: IDropDownOption[] = result.data.nameParts;
                this.setState({
                    isNameEmpty: false,
                    nameFormatList: nameFormatList,
                    nameParts: nameParts
                }, LayoutActions.hidePageLoader);
                this.setSortList();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNameFormat.name, e));
        }
    };

    private resolveGetNameFormats = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetNameFormats.name);

            if (result?.status) {
                const nameFormat: INameFormat = result.data;
                if (nameFormat) {
                    const page: number = this.preservePage ? this.state.page : 0;
                    const rowsPerPageOptions: number[] = this.getRowsPerPageOptions(nameFormat.overallCount);
                    const rowsPerPage: number =
                        this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];

                    this.setState({
                        nameFormat: nameFormat,
                        page: page,
                        rowsPerPage: rowsPerPage,
                        rowsPerPageOptions: rowsPerPageOptions
                    }, () => LayoutActions.setLoading(false));
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNameFormats.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name);

            if (result?.status) {
                this.setState({
                    resources: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostStatus = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                nameFormat
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostStatus.name);

            if (result?.status) {
                if (nameFormat && nameFormat.nameFormatList) {
                    const nameFormatModified:
                        INameFormatItem | undefined = nameFormat.nameFormatList.find(nf => nf.id === result.data.id);
                    if (result.data.result && nameFormatModified) {
                        nameFormatModified.isActive
                            = nameFormatModified.isActiveChanged;
                        nameFormatModified.isActiveChanged = false;
                        nameFormatModified.isLoading = false;
                        this.setState({
                            nameFormat: nameFormat
                        }, () => {
                            LayoutActions.setAlert({
                                message: lblSuccessSave,
                                messageType: ResultType.success,
                                snackbar: true
                            } as IAlert);
                        });
                    }
                    else {
                        this.showError();
                    }
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostStatus.name, e));
        }
    };

    private resolvePostSaveNameFormat = (json: string): void => {
        try {
            const {
                lblSuccessSave
            } = this.props;

            const {
                page,
                rowsPerPage,
                resources
            } = this.state;

            let errorLbl: string = '';

            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveNameFormat.name);

            if (result?.status) {
                if (Number(result.data) > 0) {
                    this.setState({
                        activeStep: 0,
                        editField: undefined,
                        stepErrors: [false, false, false],
                        isNameEmpty: false,
                        nameFormatList: undefined,
                        nameParts: [],
                        numSteps: 3,
                        openAddNamePart: false,
                        openDeleteFieldConfirmationDialog: false,
                        openDeleteNamePart: false,
                        openEditingField: false,
                        selectedNameParts: [],
                        unselectedNameParts: []
                    }, () => {
                        Requests.getNameFormats(page * rowsPerPage,
                            rowsPerPage, this.resolveGetNameFormats, this.logError);
                        LayoutActions.setAlert({
                            message: lblSuccessSave,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    });
                }
                else if (resources) {
                    switch (Number(result.data)) {
                        case -1:
                            errorLbl = resources.nameFormatsEdit.lblNullNameFormat;
                            break;
                        case -2:
                            errorLbl = resources.nameFormatsEdit.lblNameFormatExists;
                            break;
                        case -3:
                            errorLbl = resources.nameFormatsEdit.lblNameRequired;
                            break;
                        case -4:
                            errorLbl = resources.nameFormatsEdit.lblGapsBetween;
                            break;
                        case -5:
                            errorLbl = resources.nameFormatsEdit.lblSeparatorPipe;
                            break;
                        case -6:
                            errorLbl = resources.nameFormatsEdit.lblSortOrderGreater;
                            break;
                        case -7:
                            errorLbl = resources.nameFormatsEdit.lblSortOrderUnique;
                            break;
                        case -8:
                            errorLbl = resources.nameFormatsEdit.lblDisplayFirstName;
                            break;
                        case -9:
                            errorLbl = resources.nameFormatsEdit.lblNamePartsUnique;
                            break;
                        case -10:
                            errorLbl = resources.nameFormatsEdit.lblNamePartNotValid;
                            break;
                        case -11:
                            errorLbl = resources.nameFormatsEdit.lblNameFormatActive;
                            break;
                        case -12:
                            errorLbl = resources.nameFormatsEdit.lblNamePartRequired;
                            break;
                    }
                    this.setState({
                        alertText: errorLbl,
                        isNameEmpty: false,
                        showAlert: true
                    }, () => LayoutActions.setLoading(false));
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveNameFormat.name, e));
        }
    };

    private resolveDeleteNameFormat = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveDeleteNameFormat.name);

            if (result?.status) {
                const {
                    page,
                    rowsPerPage
                } = this.state;

                this.setState({
                    openDeleteModal: false
                }, () => Requests.getNameFormats(page * rowsPerPage,
                    rowsPerPage, this.resolveGetNameFormats, this.logError));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveDeleteNameFormat.name, e));
        }
    };

    private resolveGetNameFormatExamples = (json: string): void => {
        try {
            const result: IJsonResult | undefined = Resolver(json, this.resolveGetNameFormatExamples.name);
            if (result?.status) {
                const jsonExamples: string = result.data.examples;
                let examples: INameFormatExample[] = [];
                if (jsonExamples === null || jsonExamples.length === 0) {
                    const amountExamples: number = 5;
                    for (let i = 0; i < amountExamples; i++) {
                        examples.push({
                            displayName: '',
                            firstName: '',
                            lastName: '',
                            lastNamePrefix: '',
                            middleName: '',
                            prefix: '',
                            pronoun: '',
                            suffix: ''
                        } as INameFormatExample);
                    }
                }
                else {
                    examples = JSON.parse(jsonExamples);
                }

                this.setState({
                    examples: examples
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetNameFormatExamples.name, e));
        }
    };

    private resolveSaveNameFormatExamples = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveNameFormatExamples.name);
            if (result?.status) {
                this.examplesBackup = [];
                this.setState({
                    openNameFormatExamplesModal: false
                }, LayoutActions.hidePageLoader);

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
            this.logError(LogData.fromException(this.resolveSaveNameFormatExamples.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            const {
                page,
                rowsPerPage
            } = this.state;

            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getNameFormats(page * rowsPerPage, rowsPerPage, this.resolveGetNameFormats, this.logError);
            Requests.getNameFormatExamples(this.resolveGetNameFormatExamples);
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
            classes
        } = this.props;

        const {
            alertText,
            componentError,
            isNameEmpty,
            isUniqueNamePart,
            nameFormat,
            nameFormatList,
            nameFormatToDelete,
            nameParts,
            openAddNamePart,
            openDeleteModal,
            page,
            resources,
            rowsPerPage,
            rowsPerPageOptions,
            separatorSelected,
            showAlert,
            stepErrors,

            // #region NameFormatsEdit
            activeStep,
            isNameFormatEditVisible,
            openEditingField,
            openDeleteNamePart,
            namePartDescSelected,
            namePartModified,
            namePartSelected,
            namePreviews,
            numSteps,
            selectedNameParts,
            unselectedNameParts,
            // #endregion NameFormatsEdit

            // #region Examples
            openNameFormatExamplesModal,
            examples
            // #endregion Examples
        } = this.state;

        let addNamePart: JSX.Element | undefined;
        let editNamePart: JSX.Element | undefined;
        let contentPage: JSX.Element | undefined;
        let nameFormatExamplesModal: JSX.Element | undefined;
        let deleteNamePart: JSX.Element | undefined;

        if (!componentError && resources) {
            if (openNameFormatExamplesModal) {
                nameFormatExamplesModal = (
                    <NameFormatExamplesModal
                        examples={examples}
                        onCancel={this.onCloseExamplesModal}
                        onChangeTextField={this.onChangeTextField}
                        onSave={this.onSaveExamples}
                        resources={resources.nameFormatExamplesModal}
                    />
                );
            }

            const resourcesLayout: ILayoutResources | undefined = LayoutStore.getResourcesLayout();
            const emptyOption: IDropDownOption = {
                description: resourcesLayout ? resourcesLayout.lblDropDownEmptyText : '',
                value: 0
            };

            if (openAddNamePart && nameFormatList) {
                addNamePart = (
                    <Modal
                        disableBackdropClick
                        disableEscapeKeyDown
                        footer={(
                            <ButtonGroup id="btgAddNameFormat">
                                <Button
                                    color="secondary"
                                    id="btnCancel"
                                    onClick={this.onCloseAddNamePart}
                                >
                                    {resources.btnCancel}
                                </Button>
                                <Button
                                    id="btnAdd"
                                    onClick={this.onAddNameFormatField}
                                >
                                    {resources.nameFormatsEdit.btnAdd}
                                </Button>
                            </ButtonGroup>
                        )}
                        id="addNamePartModal"
                        header={resources.lblAddNameFormatField}
                        maxWidth="lg"
                        open={open}
                        onClose={this.onCloseAddNamePart}
                    >
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Dropdown
                                    emptyOption={emptyOption}
                                    error={!isUniqueNamePart || namePartModified && !Boolean(namePartSelected)}
                                    helperText={namePartModified && !Boolean(namePartSelected) ?
                                        resources.lblEnterNamePart :
                                        !isUniqueNamePart ? resources.lblUniqueNamePart : undefined}
                                    id='ddlNameParts'
                                    label={resources.nameFormatsEdit.lblNamePart}
                                    options={nameParts}
                                    required
                                    value={namePartSelected}
                                    onChange={this.onChangeNamePart}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id='txtSeparator'
                                    label={resources.nameFormatsEdit.lblSeparatorFormat}
                                    maxCharacters={10}
                                    type="text"
                                    value={separatorSelected}
                                    onChange={this.onChangeSeparator}
                                />
                            </Grid>
                            {namePartSelected === 'MN' ?
                                (
                                    <Grid item xs={12}>
                                        <Checkbox
                                            checked={nameFormatList.showMiddleNameInitial}
                                            id="chkInitialLetterSelected"
                                            label={resources.lblInitialLetterSelected}
                                            onChange={this.onChangeCheckbox}
                                        />
                                    </Grid>
                                ) : undefined
                            }
                        </Grid>
                    </Modal>
                );
            }

            if (openEditingField && nameFormatList) {
                editNamePart = (
                    <Modal
                        disableBackdropClick
                        disableEscapeKeyDown
                        footer={(
                            <Grid
                                container
                                alignItems="flex-end"
                                direction="column"
                                justifyContent="flex-end">
                                <Grid item>
                                    <ButtonGroup id="btgEditNameFormat">
                                        <Button
                                            color="secondary"
                                            id="btnCancel"
                                            onClick={this.onCloseEditingField}
                                        >
                                            {resources.btnCancel}
                                        </Button>
                                        <Button
                                            id="btnEdit"
                                            onClick={this.onEditingField}
                                        >
                                            {resources.nameFormatsEdit.btnSave}
                                        </Button>
                                    </ButtonGroup>
                                </Grid>
                            </Grid>
                        )}
                        id="editNamePartModal"
                        header={Format.toString(resources.nameFormatsEdit.formatEditingNamePart,
                            [namePartDescSelected])}
                        maxWidth="lg"
                        open={open}
                        onClose={this.onCloseEditingField}
                    >
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id='txtSeparator'
                                    label={resources.nameFormatsEdit.lblSeparatorFormat}
                                    maxCharacters={10}
                                    type="text"
                                    value={separatorSelected}
                                    onChange={this.onChangeSeparator}
                                />
                            </Grid>
                            {namePartSelected === 'MN' ?
                                (
                                    <Grid item xs={12}>
                                        <Checkbox
                                            id="chkInitialLetterSelected"
                                            label={resources.lblInitialLetterSelected}
                                            checked={nameFormatList.showMiddleNameInitial}
                                            onChange={this.onChangeCheckbox}
                                        />
                                    </Grid>
                                ) : undefined
                            }
                        </Grid>
                    </Modal>
                );
            }

            if (openDeleteNamePart) {
                deleteNamePart = (
                    <ConfirmationDialog
                        contentText={Format.toString(resources.nameFormatsEdit.formatDeleteNamePart,
                            [namePartDescSelected])}
                        open={openDeleteNamePart}
                        primaryActionOnClick={this.onCloseDeleteNamePart}
                        primaryActionText={resources.lblCancel}
                        secondaryActionOnClick={this.onDeleteNamePart}
                        secondaryActionText={resources.lblDelete}
                        title={Format.toString(resources.nameFormatsEdit.formatDeleteNamePartTitle,
                            [namePartDescSelected])}
                    />
                );
            }

            if (nameFormatList && nameParts && isNameFormatEditVisible) {
                contentPage = (
                    <NameFormatsEdit
                        activeStep={activeStep}
                        alertText={alertText}
                        isNameEmpty={isNameEmpty}
                        nameFormatList={nameFormatList}
                        nameParts={nameParts}
                        namePreviews={namePreviews}
                        numSteps={numSteps}
                        onAddNamePart={this.onAddNamePart}
                        onChangeActive={this.onChangeActive}
                        onChangeNameFormat={this.onChangeNameFormat}
                        onClickCancel={this.onClickCancel}
                        onClickStep={this.onClickStep}
                        onCloseAlert={this.onCloseAlert}
                        onDragEnd={this.onDragEnd}
                        onEditField={this.onEditField}
                        onFinish={this.onFinish}
                        onOpenChangeExampleModal={this.onOpenChangeExampleModal}
                        onOpenDeleteNamePart={this.onOpenDeleteNamePart}
                        resources={resources.nameFormatsEdit}
                        selectedNameParts={selectedNameParts}
                        showAlert={showAlert}
                        stepErrors={stepErrors}
                        unSelectedNameParts={unselectedNameParts}
                    />
                );
            }
            else if (nameFormat && nameFormat.nameFormatList) {
                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs>
                                <Paragraph
                                    id="prgDescription"
                                    text={Format.toString(resources.lblDescription, [resources.lblChangeExample])}
                                    events={[this.onOpenChangeExampleModal]}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid
                            alignItems="flex-end"
                            container
                            direction="column"
                            justifyContent="flex-end">
                            <Grid item xs>
                                <Tooltip
                                    id="tltAdd"
                                    title={resources.btnAdd}
                                    placement="top"
                                >
                                    <IconButton
                                        aria-label={resources.btnAdd}
                                        onClick={this.onAddNameFormat}
                                        id="btnAddNameFormat"
                                    >
                                        <Icon name="add" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                <Table
                                    breakpoint="sm"
                                    classes={{ root: classes.table }}
                                    id="tblNameFormats"
                                >
                                    <TableHead>
                                        <TableRow>
                                            <TableCell component="th">
                                                {resources.lblName}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblStatus}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblEnableDisable}
                                            </TableCell>
                                            <TableCell component="th">
                                                {resources.lblDelete}
                                            </TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {nameFormat.nameFormatList.map((row, i) =>
                                        (
                                            <TableRow key={`nameFormatsList_${i}`}>
                                                <TableCell
                                                    component="th"
                                                    scope="row"
                                                >
                                                    <Button
                                                        TextProps={{
                                                            weight: 'strong'
                                                        }}
                                                        textVariantStyling="inherit"
                                                        onClick={this.onClickNameFormat}
                                                        id={`btn_${row.id}`}
                                                        variant="text"
                                                    >
                                                        {row.name}
                                                    </Button>
                                                </TableCell>
                                                <TableCell columnName={resources.lblStatus}>
                                                    <StatusLabel
                                                        id={`stsLbl_${row.id}`}
                                                        text={row.isAssignedToCategory ? resources.lblAssigned :
                                                            resources.lblNotAssigned}
                                                        type={row.isAssignedToCategory ? 'success' : 'default'}
                                                    />
                                                </TableCell>
                                                <TableCell columnName={resources.lblEnableDisable}>
                                                    <Switch
                                                        checked={row.isActive}
                                                        disabled={row.isAssignedToCategory}
                                                        id={`swt_${row.id}`}
                                                        inputProps={{
                                                            'aria-label': Format.toString(resources.formatEnableNameFormat, [row.name])
                                                        }}
                                                        loading={row.isLoading}
                                                        onChange={this.onChangeEnableDisable}
                                                    />
                                                </TableCell>
                                                <TableCell columnName={resources.lblDelete}>
                                                    {!row.isAssignedToCategory && (
                                                        <Tooltip
                                                            id="tltDelete"
                                                            title={resources.lblDelete}
                                                            placement="top"
                                                        >
                                                            <IconButton
                                                                color="secondary"
                                                                id={`btnDelete_${row.id}_${row.name}`}
                                                                onClick={this.onOpenDeleteModal}
                                                            >
                                                                <Icon name="trash" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </Grid>
                        </Grid>
                        {rowsPerPage > 0 ? (
                            <Grid container>
                                <Grid item xs>
                                    <Pagination
                                        count={nameFormat.overallCount}
                                        page={page}
                                        rowsPerPage={rowsPerPage}
                                        rowsPerPageOptions={rowsPerPageOptions}
                                        onPageChange={this.onChangePage}
                                        onRowsPerPageChange={this.onChangeRowsPerPage}
                                    />
                                </Grid>
                            </Grid >
                        ) : undefined}
                        {openDeleteModal ? (
                            <ConfirmationDialog
                                contentText={Format.toString(resources.formatDelete, [nameFormatToDelete])}
                                open={openDeleteModal}
                                primaryActionOnClick={this.onCloseDeleteModal}
                                primaryActionText={resources.lblCancel}
                                secondaryActionOnClick={this.onDeleteNameFormat}
                                secondaryActionText={resources.lblDelete}
                                title={Format.toString(resources.formatDeleteTitle, [nameFormatToDelete])}
                            />
                        ) : undefined}
                    </>
                );
            }
        }

        return (
            <>
                {addNamePart}
                {editNamePart}
                {nameFormatExamplesModal}
                {contentPage}
                {deleteNamePart}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(NameFormats));
