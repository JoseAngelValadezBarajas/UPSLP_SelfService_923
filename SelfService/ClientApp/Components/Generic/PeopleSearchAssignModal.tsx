/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: PeopleSearchAssignModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';
import StepProgress, {
    MobileStepper,
    MobileStepperLabel,
    MobileStepperStep,
    Step,
    StepButton,
    StepLabel
} from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { IAssociationHeadSave } from '../../Types/Administration/IAssociationHead';
import { ICampusCoordinatorSave } from '../../Types/Administration/ICampusCoordinator';
import { IDepartmentHeadSave } from '../../Types/Administration/IDepartmentHead';
import { IPeopleSearchAssignModalResources } from '../../Types/Resources/Generic/IPeopleSearchAssignModalResources';

// Helpers
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';

// Requests
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import PeopleSearchActions from '@hedtech/powercampus-design-system/flux/actions/PeopleSearchActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PeopleSearchStore from '@hedtech/powercampus-design-system/flux/stores/PeopleSearchStore';
// #endregion Imports

// #region Types
export enum PeopleSearchAssignModalType {
    AssociationHead,
    CampusCoordinator,
    DepartmentHead,
    ShareAdvisee
}

export interface IPeopleSearchAssignModalExtraResources {
    lblDuplicatedOption: string;
    lblModalTitle: string;
    lblOption: string;
    lblRequiredOption: string;
    lblStepInstructions: string;
    lblStepTitle: string;
}

export interface IPeopleSearchAssignModalProps {
    extraResources: IPeopleSearchAssignModalExtraResources;
    hasDossierClaim: boolean;
    isLoadingOptions?: boolean;
    open: boolean;
    options?: IDropDownOption[];
    type: PeopleSearchAssignModalType;
    afterClose: () => void;
    afterFinish: () => void;
    stepChildren?: React.ReactNode;
    onAdd: (data: any, resolver: any) => void;
    onValidate?: (optionId: number, id: number, resolver: any) => void;
}

interface IPeopleSearchAssignModalState {
    componentError: boolean;
    colorFirstLetter?: number;
    isDuplicated: boolean;
    isLoadingSave: boolean;
    isModified: boolean;
    resources?: IPeopleSearchAssignModalResources;
    selectedOption?: string | number;
    selectedPerson?: IPeopleSearchModel;

    // #region Dossier
    dossierPersonId: number;
    openDossierModal: boolean;
    // #endregion Dossier

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper
}

const styles = createStyles({
    assignContainer: {
        marginLeft: Tokens.spacing60
    },
    boxStep: {
        '& > span > span > span': {
            textAlign: 'left'
        },
        '&:focus': {
            boxShadow: 'none'
        }
    },
    mobileStepperContent: {
        minHeight: '65vh',
        padding: `${Tokens.spacing40} ${Tokens.spacing40} 0 ${Tokens.spacing40}`
    },
    secondStepSeparator: {
        marginTop: Tokens.spacing40
    }
});

type PropsWithStyles = IPeopleSearchAssignModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class PeopleSearchAssignModal extends React.Component<PropsWithStyles, IPeopleSearchAssignModalState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IPeopleSearchAssignModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Generic';
        this.idPage = 'PeopleSearchAssignModal';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        PeopleSearchStore.addSelectedPersonListener(this.onSelect);
        // #endregion State Management Listeners
    }

    private getInitialState(): IPeopleSearchAssignModalState {
        let resources: IPeopleSearchAssignModalResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            colorFirstLetter: undefined,
            componentError: false,
            isDuplicated: false,
            isLoadingSave: false,
            isModified: false,
            resources: resources,
            selectedOption: undefined,
            selectedPerson: undefined,

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            // #region Stepper
            activeStep: 0,
            numSteps: 2,
            stepErrors: [false, false]
            // #endregion Stepper
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

    // #region Stepper
    private onClickStep = (event: any): void => {
        try {
            const {
                numSteps
            } = this.state;

            const positionParts: string[] = event.currentTarget.id.split('_');
            const position: number = Number(positionParts[1]);
            if (position >= 0 && position <= numSteps) {
                this.setState({
                    activeStep: position
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClickStep.name, e));
        }
    };

    private onFinish = (): void => {
        try {
            const {
                type,
                onAdd,
                options
            } = this.props;

            const {
                isDuplicated,
                isLoadingSave,
                selectedOption,
                selectedPerson,
                stepErrors
            } = this.state;

            if (!isLoadingSave) {
                stepErrors[0] = !Boolean(selectedPerson);
                if (options) {
                    stepErrors[1] = !Boolean(selectedOption) || isDuplicated;
                }

                this.setState({
                    isModified: true,
                    stepErrors: stepErrors
                });
                if (!stepErrors[0] && !stepErrors[1] && selectedPerson) {
                    this.showLoaderSave();
                    let newObject: any;
                    switch (type) {
                        case PeopleSearchAssignModalType.AssociationHead:
                            newObject = {
                                associationHeadId: 0,
                                associationId: Number(selectedOption),
                                personId: selectedPerson.personId
                            } as IAssociationHeadSave;
                            break;
                        case PeopleSearchAssignModalType.CampusCoordinator:
                            newObject = {
                                campusCoordinatorId: 0,
                                organizationId: Number(selectedOption),
                                personId: selectedPerson.personId
                            } as ICampusCoordinatorSave;
                            break;
                        case PeopleSearchAssignModalType.DepartmentHead:
                            newObject = {
                                departmentHeadId: 0,
                                departmentId: Number(selectedOption),
                                personId: selectedPerson.personId
                            } as IDepartmentHeadSave;
                            break;
                        case PeopleSearchAssignModalType.ShareAdvisee:
                            newObject = {
                                personId: selectedPerson.personId
                            };
                            break;
                    }
                    onAdd(newObject, this.resolvePostAdd);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onFinish.name, e));
        }
    };
    // #endregion Stepper

    private onClose = (): void => {
        try {
            PeopleSearchActions.setEmptySearch();
            const newState: IPeopleSearchAssignModalState = Object.assign({}, this.getInitialState());
            this.setState(newState, this.props.afterClose);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClose.name, e));
        }
    };

    private onDropDownChange = (optionSelected: IDropDownOption): void => {
        try {
            const {
                onValidate
            } = this.props;
            const {
                selectedPerson
            } = this.state;

            if (optionSelected && selectedPerson) {
                this.setState({
                    isDuplicated: false,
                    isModified: true,
                    selectedOption: optionSelected.value
                });
                if (onValidate) {
                    onValidate(Number(optionSelected.value),
                        selectedPerson.personId, this.resolvePostValidation);
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownChange.name, e));
        }
    };

    private onSelect = (): void => {
        const person: IPeopleSearchModel | undefined = PeopleSearchStore.getSelectedPerson();
        this.setState({
            isDuplicated: false,
            isModified: false,
            selectedOption: undefined,
            selectedPerson: person,
            stepErrors: [false, false]
        });
    };
    // #endregion Events

    // #region Loader Functions
    private hideAllLoaders = (): void => {
        this.setState({
            isLoadingSave: false
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

    private showError(message?: string): void {
        this.hideAllLoaders();
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
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetResources.name, e));
        }
    };

    private resolvePostAdd = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostAdd.name, this.hideAllLoaders);
            if (result?.status) {
                if (result.data) {
                    this.props.afterFinish();
                    this.onClose();
                }
                else {
                    this.hideLoaderSave();
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostAdd.name, e));
        }
    };

    private resolvePostValidation = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolvePostValidation.name, this.hideAllLoaders);
            if (result?.status) {
                this.setState({
                    isDuplicated: result.data
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolvePostValidation.name, e));
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

    public componentWillUnmount(): void {
        PeopleSearchStore.removeSelectedPersonListener(this.onSelect);
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
            extraResources,
            hasDossierClaim,
            isLoadingOptions,
            stepChildren,
            open,
            options,
            type
        } = this.props;

        const {
            componentError,
            isDuplicated,
            isLoadingSave,
            isModified,
            resources,
            selectedOption,
            selectedPerson,

            // #region Dossier
            dossierPersonId,
            openDossierModal,
            // #endregion Dossier

            // #region Stepper
            activeStep,
            numSteps,
            stepErrors
            // #endregion Stepper
        } = this.state;

        let contentSetp0: JSX.Element;
        let contentSetp1: JSX.Element;
        let contentStepButtons: JSX.Element;
        let contentPage: JSX.Element | undefined;
        let dossier: JSX.Element | undefined;
        if (!componentError && resources && this.layoutResources) {
            // #region Content Steps
            contentSetp0 = (
                <PeopleSearch />
            );

            if (selectedPerson) {
                const emptyOption: IDropDownOption = {
                    description: this.layoutResources.lblDropDownEmptyText,
                    value: ''
                };
                switch (type) {
                    case PeopleSearchAssignModalType.ShareAdvisee:
                        contentSetp1 = (
                            <>
                                <Grid container className={classes.secondStepSeparator}>
                                    <Grid item xs={12}>
                                        <Text size="h4">
                                            {resources.lblSelectedToShare}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} className={classes.assignContainer}>
                                        <AvatarText
                                            ButtonProps={hasDossierClaim ? {
                                                'data-id': selectedPerson.personId,
                                                id: `btnDeparmentHeadName_${selectedPerson}`,
                                                onClick: this.onViewDossier
                                            } : undefined}
                                            avatarInfo={selectedPerson}
                                        />
                                        <Divider noMarginBottom />
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.secondStepSeparator}>
                                    <Grid item xs={12}>
                                        <Text size="h4">
                                            {extraResources.lblStepInstructions}
                                        </Text>
                                    </Grid>
                                </Grid>
                                {stepChildren && (
                                    <Grid container>
                                        <Grid item xs={12} className={classes.assignContainer}>
                                            {stepChildren}
                                        </Grid>
                                    </Grid>
                                )}
                            </>
                        );
                        break;
                    default:
                        contentSetp1 = (
                            <>
                                <Grid container className={classes.secondStepSeparator}>
                                    <Grid item xs={12}>
                                        <Text size="large">
                                            {resources.lblAssign}
                                        </Text>
                                        <AvatarText
                                            ButtonProps={hasDossierClaim ? {
                                                'data-id': selectedPerson.personId,
                                                id: `btnDeparmentHeadName_${selectedPerson}`,
                                                onClick: this.onViewDossier
                                            } : undefined}
                                            avatarInfo={selectedPerson}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.secondStepSeparator}>
                                    <Grid item xs={12}>
                                        <Text size="large">
                                            {extraResources.lblStepInstructions}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container>
                                    <Grid item xs={12} sm={6} className={classes.assignContainer}>
                                        <Dropdown
                                            disabled={isLoadingSave}
                                            error={isModified &&
                                                (!Boolean(selectedOption)
                                                    || isDuplicated)}
                                            helperText={isModified
                                                ? (!Boolean(selectedOption)
                                                    ? extraResources.lblRequiredOption
                                                    : (isDuplicated
                                                        ? extraResources.lblDuplicatedOption
                                                        : undefined))
                                                : undefined}
                                            emptyOption={emptyOption}
                                            id="ddlDepartment"
                                            label={extraResources.lblOption}
                                            loading={isLoadingOptions}
                                            options={options}
                                            value={selectedOption || emptyOption.value}
                                            onChange={this.onDropDownChange}
                                        />
                                    </Grid>
                                </Grid>
                            </>
                        );
                        break;
                }
            }
            // #endregion Content Steps

            const finalStep: boolean = activeStep === numSteps - 1;
            contentStepButtons = (
                <Grid container justifyContent="flex-end">
                    <Grid item>
                        <ButtonGroup id={`btgStep${activeStep}`}>
                            <Button
                                disabled={activeStep === 0 || isLoadingSave}
                                id={`btnBack_${activeStep - 1}`}
                                variant="text"
                                onClick={this.onClickStep}
                            >
                                {resources.btnBack}
                            </Button>
                            <Button
                                disabled={activeStep === 0 && !selectedPerson || isLoadingSave}
                                id={`btnNext_${activeStep + 1}`}
                                loading={finalStep && isLoadingSave}
                                onClick={finalStep
                                    ? this.onFinish
                                    : this.onClickStep}
                            >
                                {finalStep
                                    ? resources.btnFinish
                                    : resources.btnNext}
                            </Button>
                        </ButtonGroup>
                    </Grid>
                </Grid>
            );

            contentPage = (
                <Modal
                    disableBackdropClick
                    disableEscapeKeyDown
                    footer={(
                        <Hidden xsDown>
                            {contentStepButtons}
                        </Hidden>
                    )}
                    id="peopleSearchAssignModal"
                    header={extraResources.lblModalTitle}
                    maxWidth="lg"
                    open={open}
                    onClose={this.onClose}
                >
                    <Media query={Tokens.mqXSmall}>
                        {(matches: boolean): JSX.Element => matches ? (
                            <MobileStepper
                                steps={numSteps}
                                position="static"
                                activeStep={activeStep}
                                nextButton={(
                                    <IconButton
                                        aria-label={resources.btnNext}
                                        color="secondary"
                                        disabled={activeStep === numSteps || (activeStep === 0 && !selectedPerson)}
                                        id={`btnNext_${activeStep + 1}`}
                                        onClick={this.onClickStep}
                                    >
                                        <Icon large name="chevron-right" />
                                    </IconButton>
                                )}
                                backButton={(
                                    <IconButton
                                        aria-label={resources.btnBack}
                                        color="secondary"
                                        disabled={activeStep === 0}
                                        id={`btnBack_${activeStep - 1}`}
                                        onClick={this.onClickStep}
                                    >
                                        <Icon large name="chevron-left" />
                                    </IconButton>
                                )}
                            >
                                <div className={classes.mobileStepperContent}>
                                    {activeStep !== numSteps ? (
                                        <>
                                            <MobileStepperStep activeStep={activeStep}>
                                                <MobileStepperLabel>
                                                    {activeStep === 0 && resources.lblSearchPerson}
                                                    {activeStep === 1 && extraResources.lblStepTitle}
                                                </MobileStepperLabel>
                                            </MobileStepperStep>
                                            {activeStep === 0 && contentSetp0}
                                            {activeStep === 1 && contentSetp1}
                                        </>
                                    ) : (
                                            <>
                                                <StepProgress nonLinear activeStep={activeStep} orientation="vertical">
                                                    {stepErrors.map((stepError, ise) => (
                                                        <Step key={`step_${ise}`}>
                                                            <StepButton
                                                                classes={{ root: classes.boxStep }}
                                                                id={`btnStep_${ise}`}
                                                                onClick={this.onClickStep}
                                                            >
                                                                <StepLabel error={stepError}>
                                                                    {ise === 0 && resources.lblSearchPerson}
                                                                    {ise === 1 && extraResources.lblStepTitle}
                                                                </StepLabel>
                                                            </StepButton>
                                                        </Step>
                                                    ))}
                                                </StepProgress>
                                                <Button
                                                    id="btnFinish"
                                                    loading={isLoadingSave}
                                                    onClick={this.onFinish}
                                                >
                                                    {resources.btnFinish}
                                                </Button>
                                            </>
                                        )}
                                </div>
                            </MobileStepper>
                        ) : (
                                <>
                                    <StepProgress activeStep={activeStep} orientation="horizontal">
                                        {stepErrors.map((stepError, ise) => (
                                            <Step key={`step_${ise}`}>
                                                <StepButton
                                                    classes={{ root: classes.boxStep }}
                                                    id={`btnStep_${ise}`}
                                                    onClick={this.onClickStep}
                                                >
                                                    <StepLabel error={stepError}>
                                                        {ise === 0 && resources.lblSearchPerson}
                                                        {ise === 1 && extraResources.lblStepTitle}
                                                    </StepLabel>
                                                </StepButton>
                                            </Step>
                                        ))}
                                    </StepProgress>
                                    {activeStep === 0 && contentSetp0}
                                    {activeStep === 1 && contentSetp1}
                                </>
                            )
                        }
                    </Media>
                </Modal>
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
                {dossier}
            </>
        );
    }
}
// #endregion Component

// Export: Component
export default withStyles(styles)(PeopleSearchAssignModal);