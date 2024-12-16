/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: Block.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import BlockList from './BlockList';
import BlockSections from './BlockSections';
import BlockSectionSearch, { IBlockSectionSearchResProps } from './BlockSectionSearch';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ISchedule } from '@hedtech/powercampus-design-system/types/Section/ISchedule';
import { IScheduleTime } from '@hedtech/powercampus-design-system/types/Section/IScheduleTime';
import { ISection, ISectionsList } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAdvancedSearch } from '../../../Types/Section/IAdvancedSearch';
import { IBlockRegistrationGroup } from '../../../Types/Administration/IBlockRegistrationGroup';
import { IBlockRegistrationGroupDetail } from '../../../Types/Administration/IBlockRegistrationGroupDetail';
import { IBlockResources } from '../../../Types/Resources/Administration/IBlockResources';
import { IBlockSectionTrack } from '../../../Types/Administration/IBlockSectionTrack';
import { ISectionSearchOption } from '../../../Types/Section/ISectionSearchOption';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/Block';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IBlockProps {
    termPeriodDescription: string;
    termPeriodIdSelected: number;
}

interface IBlockRes extends IBlockResources {
    blockSectionSearch: IBlockSectionSearchResProps;
}

interface IBlockState {
    blockListKey: number;
    componentError: boolean;
    isLoadingContent: boolean;
    resources?: IBlockRes;

    // #region Add Section
    blockSections: IBlockSectionTrack[];
    dirtySearch: boolean;
    hasTimeConflicts: boolean;
    isLoadingOptions: boolean;
    isLoadingPagination: boolean;
    isLoadingSearch: boolean;
    options?: ISectionSearchOption;
    searchAttempt: boolean;
    sectionSearchOpen: boolean;
    sectionsList?: ISectionsList;
    selectedSections: ISection[];
    selectedValues?: IAdvancedSearch;

    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    // #endregion Add Section

    // #region Add Block
    anchorEl: any;
    blockRegistration: IBlockRegistrationGroup;
    isAddBlock: boolean;
    isLoadingSave: boolean;
    isLoadingValidation: boolean;
    openInfo: boolean;
    // #region Add Block
}

const styles = ((theme: Theme) => createStyles({
    headerCourse: {
        [theme.breakpoints.up('md')]: {
            paddingTop: '0!important'
        }
    },
    icon: {
        cursor: 'pointer'
    },
    iconInfo: {
        display: 'inline-flex',
        verticalAlign: 'middle'
    },
    popperText: {
        maxWidth: '15rem'
    },
    sectionsMargin: {
        marginTop: Tokens.spacing40
    }
}));

type PropsWithStyles = IBlockProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class Block extends React.Component<PropsWithStyles, IBlockState> {
    private abortController: AbortController;
    private idModule: string;
    private idPage: string;
    private initialBlockRegistration: IBlockRegistrationGroup;
    private layoutResources?: ILayoutResources;

    // #region Pagination
    private preservePage: boolean;
    private preserveRowsPerPage: boolean;
    private rowsPerPageOptions: number[];
    // #endregion Pagination

    public readonly state: Readonly<IBlockState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.abortController = new AbortController();
        this.idModule = 'Administration';
        this.idPage = 'Block';
        this.initialBlockRegistration = {
            allowChanges: false,
            blockRegistrationGroupId: 0,
            createDateTime: '',
            description: '',
            displayName: '',
            isActive: false,
            isEditable: true,
            name: '',
            numberOfSections: 0,
            revisionDateTime: '',
            sectionIdList: [],
            sectionsToAdd: [],
            sectionsToRemove: [],
            termPeriodId: 0
        };
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Pagination
        this.preservePage = false;
        this.preserveRowsPerPage = false;
        this.rowsPerPageOptions = [5, 10, 15, 20, 25, 50];
        // #endregion Pagination
    }

    private getInitialState(): IBlockState {
        let resources: IBlockRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = LayoutStore.getResourcesByKey(this.idPage);
        }

        return {
            blockListKey: 0,
            componentError: false,
            isLoadingContent: true,
            resources: resources,

            // #region Add Section
            blockSections: [],
            dirtySearch: false,
            hasTimeConflicts: false,
            isLoadingOptions: false,
            isLoadingPagination: false,
            isLoadingSearch: false,
            options: undefined,
            searchAttempt: false,
            sectionSearchOpen: false,
            sectionsList: undefined,
            selectedSections: [],
            selectedValues: this.getEmptyValues(),

            // #region Pagination
            page: 0,
            rowsPerPage: 5,
            rowsPerPageOptions: [],
            // #endregion Pagination

            // #endregion Add Section

            // #region Add Block
            anchorEl: null,
            blockRegistration: { ...this.initialBlockRegistration },
            isAddBlock: false,
            isLoadingSave: false,
            isLoadingValidation: false,
            openInfo: false
            // #region Add Block
        };
    }

    // #region Pagination
    private getRowsPerPageOptions = (maxValue: number): number[] => {
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
    };

    private onChangePage = (_event: any, pageNumber: number): void => {
        try {
            this.preservePage = true;
            this.preserveRowsPerPage = true;

            this.setState({
                page: pageNumber
            }, this.setContent);
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

    private setContent = (): void => {
        try {
            const {
                termPeriodIdSelected
            } = this.props;

            const {
                selectedValues
            } = this.state;

            if (selectedValues) {
                this.showLoaderSearch();
                selectedValues.periodId = termPeriodIdSelected;

                if (!selectedValues.instructorId) {
                    selectedValues.instructorId = undefined;
                }

                this.setState({
                    selectedValues: selectedValues
                });
                const page: number = this.preservePage ? this.state.page : 0;
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                Requests.postBlockRegistrationSearch(selectedValues, page * rowsPerPage, rowsPerPage, this.resolveGetSections, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setContent.name, e));
        }
    };
    // #endregion Pagination

    // #region Events

    // #region Add Block
    private onBlurTextField = (): void => {
        try {
            const {
                blockRegistration
            } = this.state;

            const {
                termPeriodIdSelected
            } = this.props;

            if (blockRegistration && blockRegistration.name) {
                this.setState({
                    isLoadingValidation: true
                }, () => {
                    Requests.validateBlock(blockRegistration.name,
                        termPeriodIdSelected,
                        this.resolveValidateBlock,
                        this.logError
                    );

                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onBlurTextField.name, e));
        }
    };

    private onChangeTextField = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                blockRegistration
            } = this.state;
            const id: string = event.target.id;
            switch (id) {
                case 'txtName':
                    blockRegistration.name = event.target.value;
                    blockRegistration.isGroupNameError = false;
                    break;
                case 'txtDisplayName':
                    blockRegistration.displayName = event.target.value;
                    blockRegistration.isDisplayNameError = false;
                    break;
                case 'txtDescription':
                    blockRegistration.description = event.target.value;
                    break;
            }
            this.setState({
                blockRegistration: blockRegistration
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextField.name, e));
        }
    };

    private onCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                blockRegistration
            } = this.state;

            const checked: boolean = event.target.checked;
            switch (event.target.id) {
                case 'chkAllowChanges':
                    blockRegistration.allowChanges = checked;
                    break;
                case 'chkActive':
                    blockRegistration.isActive = checked;
                    break;
            }
            this.setState({
                blockRegistration: blockRegistration
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
    };

    private onAddBlock = (): void => {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
            this.setState({
                isAddBlock: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddBlock.name, e));
        }
    };

    private onCancelAddBlock = (): void => {
        try {
            this.setState({
                blockRegistration: { ...this.initialBlockRegistration },
                blockSections: [],
                hasTimeConflicts: false,
                isAddBlock: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCancelAddBlock.name, e));
        }
    };

    private onEditBlock = (event: React.MouseEvent<HTMLButtonElement>): void => {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
            const blockId = Number(event.currentTarget.id.split('_')[1]);
            LayoutActions.showPageLoader();
            Requests.getBlockDetail(blockId, this.resolveGetBlockDetail, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onEditBlock.name, e));
        }
    };

    private onSaveBlock = (): void => {
        try {
            const {
                blockRegistration,
                blockSections,
                isLoadingValidation
            } = this.state;

            const {
                termPeriodIdSelected
            } = this.props;

            if (blockRegistration) {
                if (blockRegistration.name
                    && blockRegistration.displayName
                    && !blockRegistration.isGroupNameDuplicated
                    && !isLoadingValidation) {
                    blockRegistration.termPeriodId = termPeriodIdSelected;
                    blockRegistration.allowChanges = Boolean(blockRegistration.allowChanges);
                    blockRegistration.isActive = Boolean(blockRegistration.isActive);
                    blockRegistration.sectionsToAdd
                        = blockSections.filter(bs => bs.isAdded && !bs.isSaved).map(bs => bs.section.id);
                    blockRegistration.sectionsToRemove
                        = blockSections.filter(bs => bs.isDeleted && bs.isSaved).map(bs => bs.section.blockRegGroupSectionId);
                    this.showLoaderSave();
                    this.setState({
                        blockRegistration: blockRegistration
                    }, () => {
                        Requests.saveBlock(blockRegistration,
                            this.resolveSaveBlock,
                            this.logError
                        );
                    });
                }
                else {
                    if (!blockRegistration.name) {
                        blockRegistration.isGroupNameError = true;
                    }
                    if (!blockRegistration.displayName) {
                        blockRegistration.isDisplayNameError = true;
                    }
                    this.setState({
                        blockRegistration: blockRegistration
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveBlock.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            this.setState({
                anchorEl: event.currentTarget,
                openInfo: true
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                anchorEl: null,
                openInfo: false
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };
    // #endregion Add Block

    // #region Add Section
    private onAddSection = (): void => {
        try {
            this.addSections();
            this.onCloseSearch();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddSection.name, e));
        }
    };

    private onAddAndSearchSection = (): void => {
        try {
            this.addSections();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onAddAndSearchSection.name, e));
        }
    };

    private onDropdownChange = (optionSelected: IDropDownOption, id: string): void => {
        try {
            const {
                selectedValues
            } = this.state;

            if (selectedValues) {
                const name: string = `${id[3].toLowerCase()}${id.substr(4, id.length - 4)}`;
                selectedValues[name] = optionSelected.value;
                selectedValues[`${name}Text`] = optionSelected.description;
                this.setState({
                    selectedValues: selectedValues
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropdownChange.name, e));
        }
    };

    private onClearSearch = (): void => {
        try {
            LayoutStore.abort();
            this.clearSearch();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClearSearch.name, e));
        }
    };

    private onCloseSearch = (): void => {
        try {
            this.validateSections();
            this.setState({
                sectionSearchOpen: false
            }, this.onNewSearch);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCloseSearch.name, e));
        }
    };

    private onDeleteSection = (event: any): void => {
        try {
            const {
                blockSections
            } = this.state;

            const sectionId = Number(event.currentTarget.id.split('_')[1]);

            const foundBlockSection: IBlockSectionTrack | undefined = blockSections.find(bs => bs.section.id === sectionId);
            if (foundBlockSection) {
                foundBlockSection.isAdded = false;
                foundBlockSection.isDeleted = true;

                this.setState({
                    blockSections: blockSections
                }, this.validateSections);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDeleteSection.name, e));
        }
    };

    private onNewSearch = (): void => {
        try {
            this.setState({
                dirtySearch: false,
                selectedSections: []
            }, this.clearSearch);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onNewSearch.name, e));
        }
    };

    private onOpenSearch = (): void => {
        try {
            this.setState({
                sectionSearchOpen: true
            }, this.onNewSearch);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenSearch.name, e));
        }
    };

    private onRefineSearch = (): void => {
        try {
            this.preservePage = false;
            this.preserveRowsPerPage = false;
            this.setState({
                dirtySearch: false,
                sectionsList: undefined,
                selectedSections: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRefineSearch.name, e));
        }
    };

    private onSearch = (): void => {
        try {
            const {
                selectedValues
            } = this.state;

            if (selectedValues && (
                selectedValues.keywords
                || selectedValues.eventId
                || selectedValues.session
                || selectedValues.startTime
                || selectedValues.endTime
                || selectedValues.meeting
                || selectedValues.campusId
                || selectedValues.eventType
                || selectedValues.eventSubType
                || selectedValues.instructorId
            )) {
                this.preservePage = false;
                this.preserveRowsPerPage = false;
                this.setState({
                    searchAttempt: false
                }, this.setContent);
            }
            else {
                this.setState({
                    searchAttempt: true
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSearch.name, e));
        }
    };

    private onSelectSection = (event: any): void => {
        try {
            const {
                sectionsList,
                selectedSections
            } = this.state;

            const idPart: string[] = event.target.id.split('_');
            const sectionIndex: number = Number(idPart[1]);
            if (sectionsList && sectionsList.sections) {
                const selectedSection: ISection | undefined = sectionsList.sections[sectionIndex];
                if (selectedSection) {
                    const foundSectionIndex: number = selectedSections.findIndex(ss => ss.id === selectedSection.id);
                    if (foundSectionIndex <= -1 && event.target.checked) {
                        if (sectionsList) {
                            selectedSections.push(selectedSection);
                        }
                    }
                    else if (foundSectionIndex >= 0 && !event.target.checked) {
                        selectedSections.splice(foundSectionIndex, 1);
                    }

                    this.setState({
                        selectedSections: selectedSections
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSelectSection.name, e));
        }
    };

    private onTextFieldChange = (event: any): void => {
        try {
            const {
                selectedValues
            } = this.state;

            const idSelected: string = event.target.id;
            if (selectedValues) {
                selectedValues[`${idSelected[3].toLowerCase()}${idSelected.substr(4, idSelected.length - 4)}`] = event.target.value;
                this.setState({
                    selectedValues: selectedValues
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onTextFieldChange.name, e));
        }
    };
    // #endregion Add Section

    // #endregion Events

    // #region Functions
    private addSections = (): void => {
        try {
            const {
                blockSections,
                selectedSections
            } = this.state;

            let foundBlockSection: IBlockSectionTrack | undefined;
            selectedSections.forEach(section => {
                foundBlockSection = blockSections.find(bs => bs.section.id === section.id);
                if (foundBlockSection) {
                    foundBlockSection.isAdded = true;
                    foundBlockSection.isDeleted = false;
                }
                else {
                    blockSections.push({
                        section: section,

                        isAdded: true,
                        isDeleted: false,
                        isSaved: false
                    });
                }
            });

            this.setState({
                blockSections: blockSections.sort((objA, objB) =>
                    (objA.section.eventId < objB.section.eventId) ? -1
                        : (objA.section.eventId > objB.section.eventId) ? 1 : 0),
                selectedSections: []
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.addSections.name, e));
        }
    };

    private clearSearch = (): void => {
        try {
            this.preservePage = false;
            this.preserveRowsPerPage = false;
            this.setState({
                sectionsList: undefined,
                selectedValues: this.getEmptyValues()
            }, this.hideLoaderSearch);
        }
        catch (e) {
            this.logError(LogData.fromException(this.clearSearch.name, e));
        }
    };

    private getEmptyValues(): IAdvancedSearch {
        const selectedValues: IAdvancedSearch = {};
        selectedValues.campusId = '';
        selectedValues.classLevel = '';
        selectedValues.college = '';
        selectedValues.creditType = '';
        selectedValues.curriculum = '';
        selectedValues.department = '';
        selectedValues.endDate = '';
        selectedValues.endTime = '';
        selectedValues.eventId = '';
        selectedValues.eventSubType = '';
        selectedValues.eventType = '';
        selectedValues.generalEd = '';
        selectedValues.instructorId = undefined;
        selectedValues.keywords = '';
        selectedValues.meeting = '';
        selectedValues.nonTradProgram = '';
        selectedValues.population = '';
        selectedValues.program = '';
        selectedValues.registrationType = 'TRAD';
        selectedValues.session = '';
        selectedValues.startDate = '';
        selectedValues.startTime = '';
        selectedValues.status = '';
        return selectedValues;
    }

    private validateSections = (): void => {
        try {
            const {
                blockSections
            } = this.state;
            const ids: number[] = blockSections.filter(bs => !bs.isDeleted).map(bs => bs.section.id);
            if (ids.length > 0) {
                LayoutStore.abort();
                Requests.getSectionsTimeConflict(ids, this.resolveGetSectionsTimeConflict, this.logError);
            }
            else {
                this.setState({
                    hasTimeConflicts: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.validateSections.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoadingContent: false,
            isLoadingOptions: false,
            isLoadingPagination: false,
            isLoadingSave: false,
            isLoadingSearch: false
        });
    };

    private hideLoaderContent = (): void => {
        this.setState({
            isLoadingContent: false
        });
    };

    private hideLoaderSearch = (): void => {
        this.setState({
            isLoadingSearch: false
        });
    };

    private hideLoaderSave = (): void => {
        this.setState({
            isLoadingSave: false
        });
    };

    private showLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: true
        });
    };

    private showLoaderSave = (): void => {
        this.setState({
            isLoadingSave: true
        });
    };

    private showLoaderSearch = (): void => {
        this.setState({
            isLoadingSearch: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError = (logData: ILogData): void => {
        this.hideAllLoaders();
        LayoutActions.setLogData(logData);
    };

    private redirectError = (code: number): void => {
        this.hideAllLoaders();
        LayoutActions.setRedirectCode(code);
    };

    private showError = (message?: string): void => {
        this.hideAllLoaders();
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
    };
    // #endregion Error Functions

    // #region Resolvers

    // #region Add Block
    private resolveGetBlockDetail = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetBlockDetail.name, this.hideAllLoaders);

            if (result?.status) {
                const blockDetail: IBlockRegistrationGroupDetail = result.data;

                const blockSections: IBlockSectionTrack[] = [];
                let blockRegistration: IBlockRegistrationGroup = { ...this.initialBlockRegistration };
                let hasTimeConflicts: boolean = false;
                if (blockDetail) {
                    if (blockDetail.blockRegistrationGroup) {
                        blockRegistration = blockDetail.blockRegistrationGroup;
                    }
                    if (blockDetail.sectionList) {
                        blockDetail.sectionList.forEach(s => {
                            if (s.hasTimeConflict) {
                                hasTimeConflicts = true;
                            }
                            blockSections.push({
                                section: s,

                                isAdded: false,
                                isDeleted: false,
                                isSaved: true
                            });
                        });
                    }
                }

                this.setState({
                    blockRegistration: blockRegistration,
                    blockSections: blockSections,
                    hasTimeConflicts: hasTimeConflicts,
                    isAddBlock: true
                }, LayoutActions.hidePageLoader);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetBlockDetail.name, e));
        }
    };

    private resolveValidateBlock = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveValidateBlock.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blockRegistration
                } = this.state;
                blockRegistration.isGroupNameDuplicated = result.data;
                this.setState({
                    blockRegistration: blockRegistration,
                    isLoadingValidation: false
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveValidateBlock.name, e));
        }
    };

    private resolveGetResources = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetResources.name, this.hideAllLoaders);

            if (result?.status && result.data) {
                this.setState({
                    resources: result.data
                }, this.hideLoaderContent);
                LayoutStore.setResourcesByKey(this.idPage, result.data);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveSaveBlock = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveBlock.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState(prevState => ({
                        blockListKey: prevState.blockListKey + 1,
                        blockRegistration: { ...this.initialBlockRegistration },
                        blockSections: [],
                        hasTimeConflicts: false,
                        isAddBlock: false
                    }), () => {
                        this.hideLoaderSave();
                        if (this.layoutResources) {
                            LayoutActions.setAlert({
                                message: this.layoutResources.lblSuccessSave,
                                messageType: ResultType.success,
                                snackbar: true
                            } as IAlert);
                        }
                    });
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveSaveBlock.name, e));
        }
    };
    // #endregion Add Block

    // #region Add Section
    private resolveGetOptions = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetOptions.name, this.hideAllLoaders);

            if (result?.status) {
                this.setState({
                    options: result.data
                }, this.hideAllLoaders);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetOptions.name, e));
        }
    };

    private resolveGetSections = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSections.name, this.hideAllLoaders);

            if (result?.status) {
                const sectionsList: ISectionsList | undefined = result.data;
                const page: number = this.preservePage ? this.state.page : 0;
                const rowsPerPageOptions: number[] = sectionsList ? this.getRowsPerPageOptions(sectionsList.overallCount) : [];
                const rowsPerPage: number = this.preserveRowsPerPage ? this.state.rowsPerPage : this.rowsPerPageOptions[0];
                this.setState({
                    dirtySearch: true,
                    page: page,
                    rowsPerPage: rowsPerPage,
                    rowsPerPageOptions: rowsPerPageOptions,
                    sectionsList: sectionsList
                }, this.hideLoaderSearch);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSections.name, e));
        }
    };

    private resolveGetSectionsTimeConflict = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSectionsTimeConflict.name, this.hideAllLoaders);

            if (result?.status) {
                const {
                    blockSections
                } = this.state;

                let hasTimeConflicts: boolean = false;
                blockSections.forEach(bs => {
                    bs.section.hasTimeConflict = false;
                    if (bs.section.schedules) {
                        bs.section.schedules.forEach(s => s.hasTimeConflict = false);
                    }
                });

                const timeConflicts: IScheduleTime[] = result.data;
                let blockSectionConflict: IBlockSectionTrack | undefined;
                let scheduleConflict: ISchedule | undefined;
                if (timeConflicts && timeConflicts.length > 0) {
                    hasTimeConflicts = true;
                    timeConflicts.forEach(tc => {
                        blockSectionConflict = blockSections.find(bs => bs.section.id === tc.sectionId);
                        if (blockSectionConflict) {
                            blockSectionConflict.section.hasTimeConflict = true;
                            if (blockSectionConflict.section.schedules) {
                                scheduleConflict = blockSectionConflict.section.schedules.find(sc =>
                                    sc.scheduledStartTime[0] === tc.scheduledStartTime[0]
                                    && sc.scheduledStartTime[1] === tc.scheduledStartTime[1]
                                    && sc.scheduledStartTime[2] === tc.scheduledStartTime[2]
                                    && sc.scheduledEndTime[0] === tc.scheduledEndTime[0]
                                    && sc.scheduledEndTime[1] === tc.scheduledEndTime[1]
                                    && sc.scheduledEndTime[2] === tc.scheduledEndTime[2]);
                                if (scheduleConflict) {
                                    scheduleConflict.hasTimeConflict = true;
                                }
                            }
                        }
                    });
                }

                this.setState({
                    blockSections: blockSections,
                    hasTimeConflicts: hasTimeConflicts
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSectionsTimeConflict.name, e));
        }
    };
    // #endregion Add Section

    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            if (!this.state.resources) {
                RequestsLayout.getResources(this.idModule, this.idPage,
                    this.resolveGetResources,
                    this.logError);
            }
            this.showLoaderOptions();
            Requests.getBlockRegistrationSearchOptions(this.resolveGetOptions, this.logError);
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }

    public componentWillUnmount(): void {
        try {
            this.abortController.abort();
            this.abortController = new AbortController();
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentWillUnmount.name, e));
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
            termPeriodIdSelected,
            termPeriodDescription
        } = this.props;

        const {
            blockListKey,
            componentError,
            resources,

            // #region Add Section
            blockSections,
            dirtySearch,
            hasTimeConflicts,
            isLoadingOptions,
            isLoadingPagination,
            isLoadingSearch,
            options,
            searchAttempt,
            sectionSearchOpen,
            sectionsList,
            selectedSections,
            selectedValues,

            // #region Pagination
            page,
            rowsPerPage,
            rowsPerPageOptions,
            // #endregion Pagination

            // #endregion Add Section

            // #region Add Block
            anchorEl,
            blockRegistration,
            isAddBlock,
            isLoadingContent,
            isLoadingSave,
            openInfo
            // #endregion Add Block
        } = this.state;

        let contentPage: JSX.Element | undefined;
        let headerSidebar: JSX.Element | undefined;
        let blockList: JSX.Element | undefined;
        let sectionSearch: JSX.Element | undefined;
        let textTitleSidebar: string = '';

        if (!componentError && resources) {
            sectionSearch = (
                <BlockSectionSearch
                    addedSectionsIds={blockSections.filter(bs => !bs.isDeleted).map(bs => bs.section.id)}
                    dirtySearch={dirtySearch}
                    isLoadingOptions={isLoadingOptions}
                    isLoadingPagination={isLoadingPagination}
                    isLoadingSearch={isLoadingSearch}
                    open={sectionSearchOpen}
                    options={options}
                    page={page}
                    period={termPeriodDescription}
                    resources={resources.blockSectionSearch}
                    rowsPerPage={rowsPerPage}
                    rowsPerPageOptions={rowsPerPageOptions}
                    searchAttempt={searchAttempt}
                    sectionsList={sectionsList}
                    selectedSectionsIds={selectedSections.map(s => s.id)}
                    selectedValues={selectedValues}
                    onAdd={this.onAddSection}
                    onAddAndSearch={this.onAddAndSearchSection}
                    onChangePage={this.onChangePage}
                    onChangeRowsPerPage={this.onChangeRowsPerPage}
                    onClearSearch={this.onClearSearch}
                    onClose={this.onCloseSearch}
                    onDropdownChange={this.onDropdownChange}
                    onNewSearch={this.onNewSearch}
                    onRefineSearch={this.onRefineSearch}
                    onSearch={this.onSearch}
                    onSelectSection={this.onSelectSection}
                    onTextFieldChange={this.onTextFieldChange}
                />
            );

            if (isLoadingContent) {
                contentPage = (
                    <ContainerLoader id="ldrEmptyContent" height="md" />
                );
            }
            else {
                if (isAddBlock) {
                    textTitleSidebar = blockRegistration.blockRegistrationGroupId > 0 ?
                        resources.lblEditBlockTitle : resources.lblAddBlockTitle;
                    contentPage = (
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={10}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <Alert
                                            id="msgBlockInUse"
                                            open={!blockRegistration.isEditable}
                                            text={resources.lblBlockInUse}
                                            type={ResultType.warning}
                                            userDismissable={false}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            disabled={isLoadingSave}
                                            id="txtName"
                                            label={resources.lblName}
                                            maxCharacters={100}
                                            required
                                            error={blockRegistration.isGroupNameError
                                                || blockRegistration.isGroupNameDuplicated}
                                            helperText={blockRegistration.isGroupNameError ?
                                                resources.lblNameError : (blockRegistration.isGroupNameDuplicated ?
                                                    resources.lblDuplicateNameError : undefined)}
                                            value={blockRegistration.name || ''}
                                            onBlur={this.onBlurTextField}
                                            onChange={this.onChangeTextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={6}>
                                        <TextField
                                            disabled={isLoadingSave}
                                            id="txtDisplayName"
                                            label={resources.lblDisplayName}
                                            maxCharacters={100}
                                            required
                                            error={blockRegistration.isDisplayNameError}
                                            helperText={blockRegistration.isDisplayNameError ?
                                                resources.lblDisplayNameError : undefined}
                                            value={blockRegistration.displayName || ''}
                                            onChange={this.onChangeTextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            disabled={isLoadingSave}
                                            id="txtDescription"
                                            label={resources.lblDescription}
                                            multiline
                                            minRows={4}
                                            value={blockRegistration.description || ''}
                                            onChange={this.onChangeTextField}
                                        />
                                    </Grid>
                                    <Grid item xs={12} md={10}>
                                        <Checkbox
                                            disabled={isLoadingSave}
                                            checked={blockRegistration.allowChanges || false}
                                            id="chkAllowChanges"
                                            label={resources.lblAllowChanges}
                                            onChange={this.onCheckboxChange}
                                        />
                                        <div className={classes.iconInfo}>
                                            <Icon
                                                className={classes.icon}
                                                name="info"
                                                type={ResultType.info}
                                                onClick={this.onOpenPopper}
                                            />
                                            <Popper
                                                arrow
                                                id="popAllowChanges"
                                                open={openInfo}
                                                placement="bottom-start"
                                                anchorEl={anchorEl}
                                                onClickAway={this.onClosePopper}
                                                text={resources.lblAllowChangesDesc}
                                                transition={false}
                                                TextTypographyProps={{ className: classes.popperText }}
                                            />
                                        </div>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Checkbox
                                            disabled={isLoadingSave}
                                            checked={blockRegistration.isActive || false}
                                            id="chkActive"
                                            label={resources.lblActive}
                                            onChange={this.onCheckboxChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Grid container justifyContent="space-between" wrap="nowrap">
                                            <Grid item>
                                                <Text className={classes.sectionsMargin} size="h4">
                                                    {resources.lblSections}
                                                </Text>
                                            </Grid>
                                            <Grid item>
                                                <Tooltip
                                                    id="tltAddSection"
                                                    placement="top"
                                                    title={resources.lblAddSection}
                                                >
                                                    <div>
                                                        <IconButton
                                                            aria-label={resources.lblAddSection}
                                                            disabled={isLoadingSave || !blockRegistration.isEditable}
                                                            onClick={this.onOpenSearch}
                                                            id="btnAddSection"
                                                        >
                                                            <Icon name="add" />
                                                        </IconButton>
                                                    </div>
                                                </Tooltip>
                                            </Grid>
                                        </Grid>
                                        <Grid container>
                                            <Grid item xs>
                                                <Alert
                                                    id="msgHasTimeConflicts"
                                                    open={hasTimeConflicts}
                                                    text={resources.lblBlockTimeConflict}
                                                    type={ResultType.warning}
                                                    userDismissable={false}
                                                />
                                            </Grid>
                                        </Grid>
                                        {blockSections.filter(bs => !bs.isDeleted).length > 0 ? (
                                            <BlockSections
                                                isLoadingSave={isLoadingSave}
                                                resources={resources.blockSectionSearch.blockSections}
                                                sections={blockSections.filter(bs => !bs.isDeleted).map(blockSection => blockSection.section)}
                                                showCalendar
                                                onDelete={blockRegistration.isEditable ? this.onDeleteSection : undefined}
                                            />
                                        ) : (
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <MessageStyled
                                                            classMessage="noResults"
                                                            message={resources.lblNoSections}
                                                        />
                                                    </Grid>
                                                </Grid>
                                            )}
                                    </Grid>
                                </Grid>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <ButtonGroup
                                            id="bgSaveAddBlock"
                                        >
                                            <Button
                                                IconProps={{
                                                    name: 'save'
                                                }}
                                                id="btnSave"
                                                loading={isLoadingSave}
                                                onClick={this.onSaveBlock}
                                            >
                                                {resources.btnSave}
                                            </Button>
                                            <Button
                                                color="secondary"
                                                disabled={isLoadingSave}
                                                id="btnCancel"
                                                onClick={this.onCancelAddBlock}
                                            >
                                                {resources.btnCancel}
                                            </Button>
                                        </ButtonGroup>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    );
                }
                else {
                    textTitleSidebar = Format.toString(resources.formatTitlePeriod,
                        [termPeriodDescription]);
                }

                blockList = (
                    <BlockList
                        key={`blockList_${blockListKey}`}
                        termPeriodId={termPeriodIdSelected}
                        hidden={isAddBlock}
                        onAdd={this.onAddBlock}
                        onEdit={this.onEditBlock}
                    />
                );

                headerSidebar = (
                    <Hidden smDown>
                        <Grid container spacing={3}>
                            <Grid item xs className={classes.headerCourse}>
                                <Text id="txtCourseName" size="h2">
                                    {textTitleSidebar}
                                </Text>
                                <Divider noMarginBottom />
                            </Grid>
                        </Grid>
                    </Hidden>
                );
                contentPage = (
                    <>
                        {headerSidebar}
                        {contentPage}
                    </>
                );
            }
        }

        return (
            <>
                {contentPage}
                {blockList}
                {sectionSearch}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(Block);