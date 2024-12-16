/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: NameFormatCategories.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDictionary } from '@hedtech/powercampus-design-system/types/IDictionary';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { INameFormatCategory } from '../../../Types/NameFormat/INameFormatCategory';
import { INameFormatCategoriesResources } from '../../../Types/Resources/Administration/INameFormatCategoriesResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/NameFormatCategories';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

// #region Types
export interface INameFormatCategoriesProps {
    lblSuccessSave: string;
}

interface INameFormatCategoriesState {
    anchorEl: any;
    categories?: INameFormatCategory[];
    componentError: boolean;
    nameFormats?: IDropDownOption[];
    resources?: INameFormatCategoriesResources;
}

const styles = createStyles({
    alignIconButton: {
        height: Tokens.sizingSmall,
        marginLeft: Tokens.spacing20
    },
    popperText: {
        maxWidth: '15rem'
    }
});

type PropsWithStyles = INameFormatCategoriesProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class NameFormatCategories extends React.Component<PropsWithStyles, INameFormatCategoriesState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<INameFormatCategoriesState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'NameFormatCategories';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): INameFormatCategoriesState {
        let resources: INameFormatCategoriesResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            componentError: false,
            resources: resources
        };
    }

    // #region Events
    private onChangeCategory = (categorySelected: IDropDownOption, id: string): void => {
        try {
            const {
                categories
            } = this.state;

            let indexChanged: number;

            if (categories) {
                indexChanged = categories.findIndex(category => (
                    Number(id.split('_')[1]) === category.categoryId
                ));

                if (indexChanged >= 0) {
                    categories[indexChanged].isCategoryChanged = true;
                    categories[indexChanged].nameFormatId = Number(categorySelected.value);
                    categories[indexChanged].nameFormatDesc = categorySelected.description;

                    this.setState({
                        categories: categories
                    });
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeCategory.name, e));
        }
    };

    private onSaveSettings = (): void => {
        try {
            const {
                categories
            } = this.state;

            const nameFormatCategory: IDictionary = {};
            if (categories) {
                LayoutActions.setLoading(true);
                categories.map(category => {
                    if (category.isCategoryChanged) {
                        nameFormatCategory[category.categoryId] = category.nameFormatId;
                    }
                });
                Requests.postSaveSettings(nameFormatCategory, this.resolvePostSaveSettings, this.logError);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
        }
    };

    private onOpenPopper = (event: any): void => {
        try {
            const {
                categories
            } = this.state;

            const targetId: string = event.currentTarget.id;
            const categoryId: number = Number(targetId.split('_')[1]);

            if (categories && categories.length > 0) {
                const index: number = categories.findIndex(c => c.categoryId == categoryId);
                categories[index].openInfo = true;
            }

            this.setState({
                anchorEl: event.currentTarget,
                categories
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            const {
                categories
            } = this.state;

            if (categories && categories.length > 0) {
                categories.map(category => category.openInfo = false);
            }

            this.setState({
                anchorEl: null,
                categories
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
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

    private resolveGetSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetSettings.name);

            if (result?.status) {
                const categories: INameFormatCategory[] = result.data.nameFormatCategoryList;
                const nameFormats: IDropDownOption[] = result.data.nameFormatList;
                this.setState({
                    categories: categories,
                    nameFormats: nameFormats
                }, () => LayoutActions.setLoading(false));
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);

            if (result?.status) {
                const {
                    lblSuccessSave
                } = this.props;

                LayoutActions.setLoading(false);
                LayoutActions.setAlert({
                    message: lblSuccessSave,
                    messageType: ResultType.success,
                    snackbar: true
                } as IAlert);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostSaveSettings.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            RequestsLayout.getResources(this.idModule, this.idPage,
                this.resolveGetResources,
                this.logError);
            Requests.getSettings(this.resolveGetSettings, this.logError);
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
            anchorEl,
            categories,
            componentError,
            nameFormats,
            resources
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && categories && nameFormats) {

            const categoryDropdowns: JSX.Element[] = [];
            let categoryLbl: string = '';
            let pagesLbl: string = '';

            for (let i = 0; i < categories.length - 1; i++) {
                switch (categories[i].categoryCode) {
                    case 'General':
                        categoryLbl = resources.lblGeneral;
                        pagesLbl = resources.lblGeneralPages;
                        break;

                    case 'Admin':
                        categoryLbl = resources.lblAdmin;
                        pagesLbl = resources.lblAdminPages;
                        break;

                    case 'Staff':
                        categoryLbl = resources.lblStaff;
                        pagesLbl = resources.lblStaffPages;
                        break;

                    case 'Search':
                        categoryLbl = resources.lblSearch;
                        pagesLbl = resources.lblSearchPages;
                        break;

                    case 'Transcript':
                        categoryLbl = resources.lblTranscript;
                        pagesLbl = resources.lblTranscriptPages;
                        categories[i].hasInformation = true;
                        categories[i].information = resources.lblUnofficialTranscriptInfo;
                        break;

                    case 'Grade':
                        categoryLbl = resources.lblGrade;
                        pagesLbl = resources.lblGradePages;
                        break;

                    case 'Statement':
                        categoryLbl = resources.lblStatement;
                        pagesLbl = resources.lblStatementPages;
                        categories[i].hasInformation = true;
                        categories[i].information = resources.lblStatementInfo;
                        break;

                    case 'Sponsor':
                        categoryLbl = resources.lblSponsor;
                        pagesLbl = resources.lblSponsorPages;
                        break;
                }
                categoryDropdowns.push(
                    <React.Fragment key={`ddlGroup_${i}`}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} md={4}>
                                <Dropdown
                                    id={`ddlNameCategories_${categories[i].categoryId}`}
                                    label={categoryLbl}
                                    options={nameFormats}
                                    value={categories[i].nameFormatId}
                                    onChange={this.onChangeCategory}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid
                                    container
                                    alignItems="center"
                                    spacing={0}
                                    wrap="nowrap"
                                >
                                    <Grid item>
                                        <Text size="h5" color="textSecondary">
                                            {pagesLbl}
                                            {categories[i].hasInformation && (
                                                <>
                                                    <Tooltip
                                                        id={`tltMoreInfo_${categories[i].categoryId}`}
                                                        placement="top"
                                                        title={resources.lblMoreInformation}
                                                    >
                                                        <IconButton
                                                            className={classes.alignIconButton}
                                                            aria-label={categories[i].information}
                                                            color="gray"
                                                            id={`btnMoreInfo_${categories[i].categoryId}`}
                                                            onClick={this.onOpenPopper}
                                                        >
                                                            <Icon
                                                                name="info"
                                                                type={ResultType.info}
                                                            />
                                                        </IconButton>
                                                    </Tooltip>
                                                    <Popper
                                                        arrow
                                                        id={`popMoreInfo_${categories[i].categoryId}`}
                                                        open={categories[i].openInfo}
                                                        placement="bottom"
                                                        anchorEl={anchorEl}
                                                        onClickAway={this.onClosePopper}
                                                        text={categories[i].information}
                                                        transition={false}
                                                        TextTypographyProps={{ className: classes.popperText }}
                                                    />
                                                </>
                                            )}
                                        </Text>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <br />
                    </React.Fragment>
                );

                categoryLbl = '';
            }

            contentPage = (
                <Grid container spacing={3}>
                    <Grid item xs>
                        <Text size="large">
                            {resources.lblDescription}
                        </Text>
                        <br />
                        {categoryDropdowns}
                        <Grid container spacing={3}>
                            <Grid item xs>
                                <Button
                                    id="btnSaveNameFormatCategories"
                                    onClick={this.onSaveSettings}
                                >
                                    {resources.lblSave}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
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
export default withStyles(styles)(NameFormatCategories);