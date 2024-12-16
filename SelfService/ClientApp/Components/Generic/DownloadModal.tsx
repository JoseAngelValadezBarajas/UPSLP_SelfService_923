/* Copyright 2019 - 2024 Ellucian Company L.P. and its affiliates.
 * File: DownloadModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IDownloadModalResources } from '../../Types/Resources/Generic/IDownloadModalResources';
import { IAdviseeSearch } from '../../Types/Advisees/IAdviseeSearch';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import QueryString from '@hedtech/powercampus-design-system/helpers/QueryString';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface IDownloadModalProps {
    adviseeSearch?: IAdviseeSearch;
    defaultFileName: string;
    isCsvExcluded?: boolean;
    isExcelExcluded?: boolean;
    isHtmlExcluded?: boolean;
    isNewExcelExcluded?: boolean;
    isNewWordExcluded?: boolean;
    isModalOpen: boolean;
    isTsvExcluded?: boolean;
    isWordExcluded?: boolean;
    nameSelected: string;
    sectionId?: number;
    typeSelected: number;
    view: number;

    onCloseModal: () => void;
    onChangeFileType: (optionSelected: IDropDownOption) => void;
    onChangeFileName: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface IDownloadModalState {
    componentError: boolean;
    resources?: IDownloadModalResources;
}
// #endregion Types

// #region Component
class DownloadModal extends React.Component<IDownloadModalProps, IDownloadModalState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<IDownloadModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'DownloadModal';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IDownloadModalState {
        return {
            componentError: false,
            resources: undefined
        };
    }

    private onDownload = (): void => {
        try {
            const {
                defaultFileName,
                nameSelected,
                onCloseModal,
                sectionId,
                typeSelected,
                view
            } = this.props;

            let fileName: string = nameSelected === '' ? defaultFileName : nameSelected;
            fileName = this.setFileName(fileName, typeSelected);
            if (sectionId) {
                window.location.assign(`${Constants.webUrl}/Downloads/${fileName}/${typeSelected}/${view}/${sectionId}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`);
            }
            else {
                window.location.assign(`${Constants.webUrl}/Downloads/${fileName}/${typeSelected}/${view}?currentPage=${Constants.headersRequestsJson['X-Current-Page']}`);
            }
            onCloseModal();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownload.name, e));
        }
    };

    private onDownloadAdvisees = (): void => {
        try {
            const {
                adviseeSearch,
                defaultFileName,
                nameSelected,
                onCloseModal,
                typeSelected,
                view
            } = this.props;

            let fileName: string = nameSelected === '' ? defaultFileName : nameSelected;
            fileName = this.setFileName(fileName, typeSelected);

            const adviseeDownload = {
                ...adviseeSearch,
                fileName,
                fileType: typeSelected,
                view,
                currentPage: Constants.headersRequestsJson['X-Current-Page']
            };

            window.location.assign(QueryString.stringifyToPath('Downloads/ManageAdvisees', adviseeDownload));
            onCloseModal();
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDownload.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private setFileName = (fileName: string, typeSelected: number): string => {
        let newFileName: string = fileName;
        switch (typeSelected) {
            case 0:
                newFileName = fileName + '.html';
                break;
            case 1:
                newFileName = fileName + '.doc';
                break;
            case 2:
                newFileName = fileName + '.xls';
                break;
            case 3:
                newFileName = fileName + '.tsv';
                break;
            case 4:
                newFileName = fileName + '.csv';
                break;
            case 5:
                newFileName = fileName + '.docx';
                break;
            case 6:
                newFileName = fileName + '.xlsx';

        }
        return newFileName;
    };

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private redirectError(code: number): void {
        LayoutActions.setRedirectCode(code);
    }

    // #endregion Error Functions

    // #region Resolvers
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

    private resolveOnDownload = (json: string): void => {
        try {
            const {
                onCloseModal
            } = this.props;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveOnDownload.name);
            if (result?.status) {
                LayoutActions.setLoading(false);
                onCloseModal();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveOnDownload.name, e));
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

    public render(): JSX.Element {
        const {
            componentError,
            resources
        } = this.state;

        const {
            adviseeSearch,
            isCsvExcluded,
            isExcelExcluded,
            isHtmlExcluded,
            isModalOpen,
            isNewExcelExcluded,
            isNewWordExcluded,
            isTsvExcluded,
            isWordExcluded,
            nameSelected,
            onChangeFileName,
            onChangeFileType,
            onCloseModal,
            typeSelected
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources) {

            const fileTypes: IDropDownOption[] = [];
            if (!isHtmlExcluded) {
                fileTypes.push({
                    description: 'HTML',
                    value: 0
                });
            }

            if (!isWordExcluded) {
                fileTypes.push({
                    description: 'Microsoft Word - DOC',
                    value: 1
                });
            }

            if (!isExcelExcluded) {
                fileTypes.push({
                    description: 'Microsoft Excel - XLS',
                    value: 2
                });
            }

            if (!isTsvExcluded) {
                fileTypes.push({
                    description: resources.lblTabSeparated,
                    value: 3
                });
            }

            if (!isCsvExcluded) {
                fileTypes.push({
                    description: resources.lblCommaSeparated,
                    value: 4
                });
            }

            if (!isNewWordExcluded) {
                fileTypes.push({
                    description: 'Microsoft Word - DOCX',
                    value: 5
                });
            }

            if (!isNewExcelExcluded) {
                fileTypes.push({
                    description: 'Microsoft Excel - XLSX',
                    value: 6
                });
            }

            contentPage = (
                <Modal
                    footer={(
                        <ButtonGroup id="btnDownloadModal">
                            <Button
                                id={'btnOnCloseModal'}
                                color="secondary"
                                onClick={onCloseModal}
                            >
                                {resources.lblCancel}
                            </Button>
                            <Button
                                id={'btnOnDownload'}
                                onClick={adviseeSearch ? this.onDownloadAdvisees : this.onDownload}
                            >
                                {resources.lblDownload}
                            </Button>
                        </ButtonGroup>
                    )}
                    header={resources.lblDownload}
                    id="modalDownload"
                    maxWidth="sm"
                    open={isModalOpen}
                    onClose={onCloseModal}
                >
                    <Grid container justifyContent="center">
                        <Grid item xs={12} sm={10}>
                            <TextField
                                id="txtFileName"
                                label={resources.lblFileName}
                                value={nameSelected}
                                onChange={onChangeFileName}
                            />
                        </Grid>
                        <Grid item xs={12} sm={10}>
                            <Dropdown
                                id="ddlFileType"
                                label={resources.lblFileType}
                                options={fileTypes}
                                value={typeSelected}
                                onChange={onChangeFileType}
                            />
                        </Grid>
                    </Grid>
                </Modal>
            );
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
export default DownloadModal;