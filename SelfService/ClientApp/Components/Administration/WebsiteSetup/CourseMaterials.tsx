/* Copyright 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseMaterials.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Popper from '@hedtech/powercampus-design-system/react/core/Popper';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';


// Types
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ICourseMaterialsSettings } from '../../../Types/InstitutionSettings/ICourseMaterialsSettings';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { ICourseMaterialsResources } from '../../../Types/Resources/Administration/ICourseMaterialsResources';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';
import Requests from '../../../Requests/Administration/CourseMaterials';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
// #endregion Imports

//#region Component

interface ICourseMaterialsProps {}

interface ICourseMaterialsState {
    anchorEl: any;
    componentError: boolean;
    urlEmpty: boolean;
    textToDisplayEmpty: boolean;
    openTextToDisplayInfo: boolean;
    resources?: ICourseMaterialsResources;
    courseMaterialsData?: ICourseMaterialsSettings;
}

const styles = () => createStyles({
    componentStyle: {
        marginTop: Tokens.spacing40
    },
    infoButton: {
        marginTop: Tokens.spacing50
    }
});

type PropsWithStyles = ICourseMaterialsProps & WithStyles<typeof styles>;
class CourseMaterials extends React.Component<PropsWithStyles, ICourseMaterialsState> {
    private idModule: string;
    private idPage: string;

    public readonly state: Readonly<ICourseMaterialsState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'CourseMaterials';
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State
    }

    private getInitialState(): ICourseMaterialsState {
        let resources: ICourseMaterialsResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            anchorEl: null,
            openTextToDisplayInfo: false,
            componentError: false,
            urlEmpty: true,
            textToDisplayEmpty: true,
            resources: resources
        };
    }
    // #region Events
    private onOpenPopper = (event: any): void => {
        try {
            const targetId: string = event.currentTarget.id;
            if (targetId === "btnTextToDisplayInfo") {
                this.setState({
                    openTextToDisplayInfo: true,
                    anchorEl: event.currentTarget,
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onOpenPopper.name, e));
        }
    };

    private onClosePopper = (): void => {
        try {
            this.setState({
                openTextToDisplayInfo: false,
                anchorEl: null,
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClosePopper.name, e));
        }
    };
    private onChangeTextfield = (event: React.ChangeEvent<HTMLInputElement>): void => {
        try {
            const {
                courseMaterialsData
            } = this.state;

            const id: string = event.target.id;
            let value: string = event.target.value;
            if (courseMaterialsData) {
                switch (id) {
                    case 'txtURLCourseMaterials':
                        value = value.trim();
                        courseMaterialsData.url = value;
                        break;
                    case 'txtToDisplayCourseMaterials':
                        courseMaterialsData.textToDisplay = value;
                        break;
                }
            }
            this.setState({
                courseMaterialsData: courseMaterialsData
            })
        }
        catch (e) {
            this.logError(LogData.fromException(this.onChangeTextfield.name, e));
        }

    }
    private onSaveSettings = (): void => {
        try {
            const {
                courseMaterialsData
            } = this.state;

            if (courseMaterialsData) {
                courseMaterialsData.urlIsValid = true;
                courseMaterialsData.textToDisplayIsValid = true;

                if (!courseMaterialsData.url.trim() && courseMaterialsData.textToDisplay) {
                    courseMaterialsData.urlIsValid = false;
                }
                if (courseMaterialsData.url && !courseMaterialsData.textToDisplay.trim()) {
                    courseMaterialsData.textToDisplayIsValid = false;
                }
                this.setState({
                    courseMaterialsData: courseMaterialsData
                })

                if (courseMaterialsData.urlIsValid && courseMaterialsData.textToDisplayIsValid) {
                    LayoutActions.showPageLoader();
                    Requests.postSaveSettings(courseMaterialsData, this.resolvePostSaveSettings, this.logError);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onSaveSettings.name, e));
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

    private showError(message?: string): void {
        LayoutActions.setAlert({ message: message, messageType: ResultType.error } as IAlert);
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
                LayoutActions.hidePageLoader();
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
                const data: ICourseMaterialsSettings = result.data;
                if (data) {
                    data.urlIsValid = true;
                    data.textToDisplayIsValid = true;
                    this.setState({
                        courseMaterialsData: data
                    });
                }
                LayoutActions.hidePageLoader();
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetSettings.name, e));
        }
    };

    private resolvePostSaveSettings = (json: string): void => {
        try {
            const {
                resources
            } = this.state;
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostSaveSettings.name);
            if (result?.status) {
                if (result.data) {
                    if (resources) {
                        LayoutActions.setAlert({
                            message: resources.lblSaved,
                            messageType: ResultType.success,
                            snackbar: true
                        } as IAlert);
                    }
                    LayoutActions.hidePageLoader();
                }
                else {
                    this.showError();
                }
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

    public render():  JSX.Element {
        const {
            anchorEl,
            openTextToDisplayInfo,
            componentError,
            resources,
            courseMaterialsData
        } = this.state;

        const {
            classes
        } = this.props;

        let contentPage: JSX.Element | undefined;
        if (!componentError && resources && courseMaterialsData) {
            contentPage = (
                <>
                    <Grid container>
                        <Grid item xs={12}>
                            <Text size="large">
                                {resources.lblInstructions}
                            </Text>
                            <TextField
                                className={classes.componentStyle}
                                error={!courseMaterialsData.urlIsValid}
                                helperText={!courseMaterialsData.urlIsValid ? resources.lblErrorUrl : undefined }
                                id="txtURLCourseMaterials"
                                label={resources.lblURL}
                                maxCharacters={2048}
                                value={courseMaterialsData.url ? courseMaterialsData.url : undefined}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={0}>
                        <Grid item xs={12} sm={3}>
                            <TextField
                                className={classes.componentStyle}
                                error={!courseMaterialsData.textToDisplayIsValid}
                                helperText={!courseMaterialsData.textToDisplayIsValid ? resources.lblErrorTextToDisplay : undefined}
                                label={resources.lblTextToDisplay}
                                id="txtToDisplayCourseMaterials"
                                maxCharacters={40}
                                value={courseMaterialsData.textToDisplay ? courseMaterialsData.textToDisplay : undefined}
                                onChange={this.onChangeTextfield}
                            />
                        </Grid>
                        <Grid item>
                            <Tooltip
                                id="tltTextToDisplayInfo"
                                placement="top"
                                title={resources.lblMoreInformation}
                            >
                                <IconButton
                                    className={classes.infoButton}
                                    aria-label={resources.lblMoreInformation}
                                    color="gray"
                                    id="btnTextToDisplayInfo"
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
                                id="popTextToDisplayInfo"
                                open={openTextToDisplayInfo}
                                placement="right-start"
                                anchorEl={anchorEl}
                                onClickAway={this.onClosePopper}
                            >
                                <Text size="large">
                                    {resources.lblTextToDisplayInfo}
                                </Text>
                            </Popper>
                        </Grid>
                    </Grid>
                    <Grid container>
                        <Grid item xs>
                            <Button
                                className={classes.componentStyle}
                                id="btnSavePaymentProvider"
                                onClick={this.onSaveSettings}
                            >
                                {resources.btnSave}
                            </Button>
                        </Grid>
                    </Grid>
                </>
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
export default withStyles(styles)(CourseMaterials);