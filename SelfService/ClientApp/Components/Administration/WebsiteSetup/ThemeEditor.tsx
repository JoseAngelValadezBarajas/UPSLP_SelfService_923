/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ThemeEditor.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import InputAdornment from '@hedtech/powercampus-design-system/react/core/InputAdornment';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import ThemePreview, { IThemePreviewResProps } from './ThemePreview';

// Helpers
import Tokens, { CtaColors } from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ITheme } from '@hedtech/powercampus-design-system/types/ITheme';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IThemeResources } from '../../../Types/Resources/Administration/IThemeResources';
import { IThemeValidations } from '../../../Types/Theme/IThemeValidations';

// Helpers
import { hexIsValid, urlIsValid } from '@hedtech/powercampus-design-system/helpers/CharRegExp';
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import ThemeHelper from '@hedtech/powercampus-design-system/helpers/ThemeHelper';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/Theme';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
interface IThemeEditorRes extends IThemeResources {
    themePreview: IThemePreviewResProps;
}

interface IThemeEditorState {
    actionColors?: IDropDownOption[];
    isLoading: boolean;
    isLoadingOptions: boolean;
    isLoadingSave: boolean;
    resources?: IThemeEditorRes;
    themeSettings?: ITheme;
    themeValidations?: IThemeValidations;
}

const styles = createStyles({
    actionColorIndicator: {

    },
    colorIndicator: {
        '&:active': {
            borderColor: Tokens.colorBorderGlobalFocus
        },
        '&:focus': {
            borderColor: Tokens.colorBorderGlobalFocus
        },
        '&:selected': {
            borderColor: Tokens.colorBorderGlobalFocus
        },
        borderColor: Tokens.colorGlobalBorderDefault,
        borderRadius: Tokens.borderRadiusMedium,
        borderStyle: 'solid',
        cursor: 'pointer',
        borderWidth: Tokens.borderWidthThick,
        height: Tokens.sizingLarge,
        width: Tokens.sizingLarge
    },
    colorPicker: {
        border: '0',
        height: '0',
        margin: '0',
        padding: '0',
        visibility: 'hidden',
        width: '0'
    },
    hexField: {
        '& > div > div': {
            padding: `${Tokens.spacing10} ${Tokens.spacing30}`
        }
    }
});

type PropsWithStyles = WithStyles<typeof styles> & WithWidth;
// #endregion Types

// #region Component
class ThemeEditor extends React.Component<PropsWithStyles, IThemeEditorState> {
    private defaultBackground: string;
    private defaultFavicon: string;
    private defaultLogo: string;
    private hasColorHTML5: boolean;
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IThemeEditorState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.defaultBackground = `${Constants.imagesCDN}/bg/PowerCampus-Background.png`;
        this.defaultFavicon = Constants.faviconCDN;
        this.defaultLogo = `${Constants.webUrl}/css/images/ellucian_logo_white.svg`;
        this.hasColorHTML5 = ThemeHelper.hasHTML5ColorCompatibility();
        this.idModule = 'Administration';
        this.idPage = 'Theme';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): IThemeEditorState {
        let resources: IThemeEditorRes | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        else {
            resources = LayoutStore.getResourcesByKey(`${this.idModule}.${this.idPage}`);
        }
        return {
            isLoading: true,
            isLoadingOptions: false,
            isLoadingSave: false,
            resources: resources
        };
    }

    // #region Events
    private onChangeActionColor = (optionSelected: IDropDownOption, _id: string): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (optionSelected && themeSettings && themeValidations) {
                themeSettings.actionColor = String(optionSelected.value);
                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeActionColor.name, e));
        }
    };

    private onChangeBackgroundUrl = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.backgroundUrl = value;
                themeValidations.backgroundUrlError = false;
                if (value) {
                    themeValidations.backgroundUrlError = !urlIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeBackgroundUrl.name, e));
        }
    };

    private onChangeFaviconUrl = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.faviconUrl = value;
                themeValidations.faviconUrlError = false;
                if (value) {
                    themeValidations.faviconUrlError = !urlIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeFaviconUrl.name, e));
        }
    };

    private onChangeLogoAlternateText = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.logoAlternateText = value;

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeLogoAlternateText.name, e));
        }
    };

    private onChangeLogoUrl = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.logoUrl = value;
                themeValidations.logoUrlError = false;
                if (value) {
                    themeValidations.logoUrlError = !urlIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeLogoUrl.name, e));
        }
    };

    private onChangePrimaryColor = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.primaryColor = value;
                themeValidations.primaryColorError = false;
                if (value) {
                    themeValidations.primaryColorError = !hexIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangePrimaryColor.name, e));
        }
    };

    private onChangeSecondaryColor = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.secondaryColor = value;
                themeValidations.secondaryColorError = false;
                if (value) {
                    themeValidations.secondaryColorError = !hexIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeSecondaryColor.name, e));
        }
    };

    private onChangeStudyingColor = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.studyingCalendarColor = value;
                themeValidations.studyingColorError = false;
                if (value) {
                    themeValidations.studyingColorError = !hexIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeStudyingColor.name, e));
        }
    };

    private onChangeTeachingColor = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                const value: string = event.target.value;

                themeSettings.teachingCalendarColor = value;
                themeValidations.teachingColorError = false;
                if (value) {
                    themeValidations.teachingColorError = !hexIsValid(value);
                }

                this.setState({
                    themeSettings: themeSettings,
                    themeValidations: themeValidations
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTeachingColor.name, e));
        }
    };

    private onClickPrimaryColor = () => {
        if (this.hasColorHTML5) {
            const clrPckPrimaryColor = document.getElementById('clrPckPrimaryColor');
            if (clrPckPrimaryColor) {
                clrPckPrimaryColor.click();
            }
        }
    };

    private onClickSecondaryColor = () => {
        if (this.hasColorHTML5) {
            const clrPckSecondaryColor = document.getElementById('clrPckSecondaryColor');
            if (clrPckSecondaryColor) {
                clrPckSecondaryColor.click();
            }
        }
    };

    private onClickStudyingColor = () => {
        if (this.hasColorHTML5) {
            const clrPckStudyingColor = document.getElementById('clrPckStudyingColor');
            if (clrPckStudyingColor) {
                clrPckStudyingColor.click();
            }
        }
    };

    private onClickTeachingColor = () => {
        if (this.hasColorHTML5) {
            const clrPckTeachingColor = document.getElementById('clrPckTeachingColor');
            if (clrPckTeachingColor) {
                clrPckTeachingColor.click();
            }
        }
    };

    private onRestoreDefaultTheme = (): void => {
        try {
            const themeValidations: IThemeValidations = this.getThemeValidations();
            this.setState({
                themeSettings: ThemeHelper.getDefaultValues(),
                themeValidations: themeValidations
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onRestoreDefaultTheme.name, e));
        }
    };

    private onSaveTheme = (): void => {
        try {
            const {
                themeSettings,
                themeValidations
            } = this.state;

            if (themeSettings && themeValidations) {
                if (Boolean(themeSettings.actionColor)
                    && Boolean(themeSettings.primaryColor)
                    && Boolean(themeSettings.secondaryColor)
                    && Boolean(themeSettings.studyingCalendarColor)
                    && Boolean(themeSettings.teachingCalendarColor)
                    && !themeValidations.primaryColorError
                    && !themeValidations.secondaryColorError
                    && !themeValidations.faviconUrlError
                    && !themeValidations.logoUrlError
                    && !themeValidations.backgroundUrlError
                    && !themeValidations.studyingColorError
                    && !themeValidations.teachingColorError) {
                    themeSettings.logoAlternateText = themeSettings.logoAlternateText.trim();
                    this.setState({
                        themeSettings: themeSettings
                    });
                    this.showLoaderSave();
                    Requests.saveTheme(this.getThemeToSave(themeSettings), this.resolveSaveTheme);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveTheme.name, e));
        }
    };
    // #endregion Events

    // #region Functions
    private getThemeToSave(theme: ITheme): ITheme {
        const themeSettingsToSave: ITheme = { ...theme };
        const defaultTheme: ITheme = ThemeHelper.getDefaultValues();
        if (themeSettingsToSave.primaryColor === defaultTheme.primaryColor) {
            themeSettingsToSave.primaryColor = '';
        }
        if (themeSettingsToSave.secondaryColor === defaultTheme.secondaryColor) {
            themeSettingsToSave.secondaryColor = '';
        }
        if (themeSettingsToSave.actionColor === defaultTheme.actionColor) {
            themeSettingsToSave.actionColor = '';
        }
        if (themeSettingsToSave.studyingCalendarColor === defaultTheme.studyingCalendarColor) {
            themeSettingsToSave.studyingCalendarColor = '';
        }
        if (themeSettingsToSave.teachingCalendarColor === defaultTheme.teachingCalendarColor) {
            themeSettingsToSave.teachingCalendarColor = '';
        }
        return themeSettingsToSave;
    }

    private getThemeValidations(): IThemeValidations {
        return {
            backgroundUrlError: false,
            faviconUrlError: false,
            logoUrlError: false,
            modified: false,
            primaryColorError: false,
            secondaryColorError: false,
            studyingColorError: false,
            teachingColorError: false
        } as IThemeValidations;
    }

    private setInitalValues = (): void => {
        try {
            const theme: ITheme | undefined = LayoutStore.getTheme();
            if (theme) {
                this.setState({
                    themeSettings: ThemeHelper.withDefaultValues(theme),
                    themeValidations: this.getThemeValidations()
                }, this.hideLoader);
                this.showLoaderOptions();
                Requests.getThemeActionColors(this.resolveGetThemeActionColors);
            }
            else {
                this.hideLoader();
                this.showError();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.setInitalValues.name, e));
        }
    };
    // #endregion Functions

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoading: false,
            isLoadingOptions: false,
            isLoadingSave: false
        });
    };

    private hideLoader = (): void => {
        this.setState({
            isLoading: false
        });
    };

    private hideLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: false
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

    private showLoaderOptions = (): void => {
        this.setState({
            isLoadingOptions: true
        });
    };
    // #endregion Loader Functions

    // #region Error Functions
    private logError(logData: ILogData): void {
        LayoutActions.setLogData(logData);
    }

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
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
                }, this.setInitalValues);
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolveGetThemeActionColors = (json: string): void => {
        try {
            const {
                resources
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetThemeActionColors.name, this.hideAllLoaders);
            if (result?.status) {
                const actionColors: IDropDownOption[] = [];
                const themeActionColors: string[] = result.data;
                if (themeActionColors && resources) {
                    themeActionColors.forEach((value, i) => {
                        actionColors.push({
                            description: resources.actionColors[i],
                            leftIcon: (
                                <div
                                    id="clrActionColor"
                                    style={{
                                        backgroundColor: CtaColors[value].base,
                                        borderColor: Tokens.colorGlobalBorderDefault,
                                        borderRadius: Tokens.borderRadiusMedium,
                                        borderStyle: 'solid',
                                        borderWidth: Tokens.borderWidthThin,
                                        height: Tokens.sizingMedium,
                                        width: Tokens.sizingMedium
                                    }}
                                />
                            ),
                            value: value
                        } as IDropDownOption);
                    });
                    this.setState({
                        actionColors: actionColors
                    }, this.hideLoaderOptions);
                }
                else {
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetThemeActionColors.name, e));
        }
    };

    private resolveSaveTheme = (json: string): void => {
        try {
            const {
                themeSettings
            } = this.state;

            const result: IJsonResult | undefined
                = Resolver(json, this.resolveSaveTheme.name, this.hideAllLoaders);
            if (result?.status) {
                LayoutActions.setReloadTheme(themeSettings);
                this.setState({
                    themeValidations: this.getThemeValidations()
                }, this.hideLoaderSave);
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
            this.logError(LogData.fromException(this.resolveSaveTheme.name, e));
        }
    };
    // #endregion Resolvers

    // #region Lifecycle
    public componentDidMount(): void {
        try {
            LayoutActions.hidePageLoader();
            if (!this.state.resources) {
                RequestsLayout.getResources(this.idModule, this.idPage, this.resolveGetResources);
            }
            else {
                this.setInitalValues();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.componentDidMount.name, e));
        }
    }
    // #endregion Lifecycle

    public render(): JSX.Element {
        const {
            classes,
            width
        } = this.props;

        const {
            actionColors,
            isLoading,
            isLoadingOptions,
            isLoadingSave,
            resources,
            themeSettings,
            themeValidations
        } = this.state;

        let contentPage: JSX.Element | undefined;
        if (!isLoading) {
            if (resources && themeSettings && themeValidations) {

                // #region Primary Color
                let errorPrimaryColor: boolean = false;
                let errorTextPrimaryColor: string | undefined;
                errorPrimaryColor = !Boolean(themeSettings.primaryColor)
                    || themeValidations.primaryColorError;
                errorTextPrimaryColor = !themeSettings.primaryColor
                    ? resources.lblPrimaryColorRequired : undefined;
                errorTextPrimaryColor = !errorTextPrimaryColor && themeValidations.primaryColorError ?
                    resources.lblHexFormat : errorTextPrimaryColor;
                // #endregion Primary Color

                // #region Secondary Color
                let errorSecondaryColor: boolean = false;
                let errorTextSecondaryColor: string | undefined;
                errorSecondaryColor = !Boolean(themeSettings.secondaryColor)
                    || themeValidations.secondaryColorError;
                errorTextSecondaryColor = !themeSettings.secondaryColor
                    ? resources.lblSecondaryColorRequired : undefined;
                errorTextSecondaryColor = !errorTextSecondaryColor && themeValidations.secondaryColorError ?
                    resources.lblHexFormat : errorTextSecondaryColor;
                // #endregion Secondary Color

                // #region Studying Color
                let errorStudyingColor: boolean = false;
                let errorTextStudyingColor: string | undefined;
                errorStudyingColor = !Boolean(themeSettings.studyingCalendarColor)
                    || themeValidations.studyingColorError;
                errorTextStudyingColor = !themeSettings.studyingCalendarColor
                    ? resources.lblStudyingColorRequired : undefined;
                errorTextStudyingColor = !errorTextStudyingColor && themeValidations.studyingColorError ?
                    resources.lblHexFormat : errorTextStudyingColor;
                // #endregion Studying Color

                // #region Teaching Color
                let errorTeachingColor: boolean = false;
                let errorTextTeachingColor: string | undefined;
                errorTeachingColor = !Boolean(themeSettings.teachingCalendarColor)
                    || themeValidations.teachingColorError;
                errorTextTeachingColor = !themeSettings.teachingCalendarColor
                    ? resources.lblTeachingColorRequired : undefined;
                errorTextTeachingColor = !errorTextTeachingColor && themeValidations.teachingColorError ?
                    resources.lblHexFormat : errorTextTeachingColor;
                // #endregion Teaching Color

                contentPage = (
                    <>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            classes={{ root: classes.hexField }}
                                            disabled={isLoadingSave}
                                            error={errorPrimaryColor}
                                            helperText={errorTextPrimaryColor}
                                            id="txtPrimaryColor"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip
                                                            id="tltPrimaryColor"
                                                            title={resources.lblPrimaryColor}
                                                            placement="top"
                                                        >
                                                            <button
                                                                disabled={isLoadingSave}
                                                                id="btnPrimaryColor"
                                                                className={classes.colorIndicator}
                                                                style={{ backgroundColor: themeSettings.primaryColor }}
                                                                onClick={this.onClickPrimaryColor}
                                                            />
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            label={resources.lblPrimaryColor}
                                            required
                                            value={themeSettings.primaryColor}
                                            onChange={this.onChangePrimaryColor}
                                        />
                                        {this.hasColorHTML5 && (
                                            <input
                                                className={classes.colorPicker}
                                                id="clrPckPrimaryColor"
                                                type="color"
                                                value={themeSettings.primaryColor}
                                                onChange={this.onChangePrimaryColor}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            classes={{ root: classes.hexField }}
                                            disabled={isLoadingSave}
                                            error={errorSecondaryColor}
                                            helperText={errorTextSecondaryColor}
                                            id="txtSecondaryColor"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip
                                                            id="tltSecondaryColor"
                                                            title={resources.lblSecondaryColor}
                                                            placement="top"
                                                        >
                                                            <button
                                                                disabled={isLoadingSave}
                                                                id="btnSecondaryColor"
                                                                className={classes.colorIndicator}
                                                                style={{ backgroundColor: themeSettings.secondaryColor }}
                                                                onClick={this.onClickSecondaryColor}
                                                            />
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            label={resources.lblSecondaryColor}
                                            required
                                            type="text"
                                            value={themeSettings.secondaryColor}
                                            onChange={this.onChangeSecondaryColor}
                                        />
                                        {this.hasColorHTML5 && (
                                            <input
                                                className={classes.colorPicker}
                                                id="clrPckSecondaryColor"
                                                type="color"
                                                value={themeSettings.secondaryColor}
                                                onChange={this.onChangeSecondaryColor}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            error={!Boolean(themeSettings.actionColor)}
                                            helperText={!Boolean(themeSettings.actionColor)
                                                ? resources.lblActionColorRequired : undefined}
                                            id="ddlActionColor"
                                            label={resources.lblActionColor}
                                            loading={isLoadingOptions}
                                            options={actionColors}
                                            value={themeSettings.actionColor}
                                            onChange={this.onChangeActionColor}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            disabled={isLoadingSave}
                                            error={themeValidations.faviconUrlError}
                                            helperText={themeValidations.faviconUrlError ?
                                                resources.lblUrlFormat : undefined}
                                            id="txtFavicon"
                                            label={resources.lblFavicon}
                                            type="text"
                                            value={themeSettings.faviconUrl}
                                            onChange={this.onChangeFaviconUrl}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            disabled={isLoadingSave}
                                            error={themeValidations.logoUrlError}
                                            helperText={themeValidations.logoUrlError ?
                                                resources.lblUrlFormat : undefined}
                                            id="txtLogo"
                                            label={resources.lblLogo}
                                            type="text"
                                            value={themeSettings.logoUrl}
                                            onChange={this.onChangeLogoUrl}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            disabled={isLoadingSave}
                                            id="txtLogoAlternateText"
                                            label={resources.lblLogoAlternateText}
                                            type="text"
                                            value={themeSettings.logoAlternateText}
                                            onChange={this.onChangeLogoAlternateText}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            disabled={isLoadingSave}
                                            error={themeValidations.backgroundUrlError}
                                            helperText={themeValidations.backgroundUrlError ?
                                                resources.lblUrlFormat : undefined}
                                            id="txtBackground"
                                            label={resources.lblBackground}
                                            type="text"
                                            value={themeSettings.backgroundUrl}
                                            onChange={this.onChangeBackgroundUrl}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            classes={{ root: classes.hexField }}
                                            disabled={isLoadingSave}
                                            error={errorStudyingColor}
                                            helperText={errorTextStudyingColor}
                                            id="txtStudyingColor"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip
                                                            id="tltStudyingColor"
                                                            title={resources.lblStudyingColor}
                                                            placement="top"
                                                        >
                                                            <button
                                                                disabled={isLoadingSave}
                                                                id="btnStudyingColor"
                                                                className={classes.colorIndicator}
                                                                style={{ backgroundColor: themeSettings.studyingCalendarColor }}
                                                                onClick={this.onClickStudyingColor}
                                                            />
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            label={resources.lblStudyingColor}
                                            required
                                            value={themeSettings.studyingCalendarColor}
                                            onChange={this.onChangeStudyingColor}
                                        />
                                        {this.hasColorHTML5 && (
                                            <input
                                                className={classes.colorPicker}
                                                id="clrPckStudyingColor"
                                                type="color"
                                                value={themeSettings.studyingCalendarColor}
                                                onChange={this.onChangeStudyingColor}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid container alignItems="center" wrap="nowrap">
                                    <Grid item xs>
                                        <TextField
                                            classes={{ root: classes.hexField }}
                                            disabled={isLoadingSave}
                                            error={errorTeachingColor}
                                            helperText={errorTextTeachingColor}
                                            id="txtTeachingColor"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <Tooltip
                                                            id="tltTeachingColor"
                                                            title={resources.lblTeachingColor}
                                                            placement="top"
                                                        >
                                                            <button
                                                                disabled={isLoadingSave}
                                                                id="btnTeachingColor"
                                                                className={classes.colorIndicator}
                                                                style={{ backgroundColor: themeSettings.teachingCalendarColor }}
                                                                onClick={this.onClickTeachingColor}
                                                            />
                                                        </Tooltip>
                                                    </InputAdornment>
                                                )
                                            }}
                                            label={resources.lblTeachingColor}
                                            required
                                            value={themeSettings.teachingCalendarColor}
                                            onChange={this.onChangeTeachingColor}
                                        />
                                        {this.hasColorHTML5 && (
                                            <input
                                                className={classes.colorPicker}
                                                id="clrPckTeachingColor"
                                                type="color"
                                                value={themeSettings.teachingCalendarColor}
                                                onChange={this.onChangeTeachingColor}
                                            />
                                        )}
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <ThemePreview
                                    defaultBackground={this.defaultBackground}
                                    defaultFavicon={this.defaultFavicon}
                                    defaultLogo={this.defaultLogo}
                                    resources={resources.themePreview}
                                    themeSettings={themeSettings}
                                    themeValidations={themeValidations}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={width === 'xs' ? 12 : false}>
                                <ButtonGroup id="btgThemeActions">
                                    <Button
                                        id="btnSave"
                                        loading={isLoadingSave}
                                        onClick={this.onSaveTheme}
                                    >
                                        <span>
                                            <Icon marginRight name="save" />
                                            {resources.btnSave}
                                        </span>
                                    </Button>
                                    <Button
                                        color="secondary"
                                        disabled={isLoadingSave}
                                        id="btnRestore"
                                        onClick={this.onRestoreDefaultTheme}
                                    >
                                        {resources.btnRestore}
                                    </Button>
                                </ButtonGroup>
                            </Grid>
                        </Grid>
                    </>
                );
            }
        }
        else {
            contentPage = (<ContainerLoader id="ldrThemeEditor" height="md" />);
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
export default withStyles(styles)(withWidth()(ThemeEditor));