/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: OfficesSetupAddModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Dossier from '@hedtech/powercampus-design-system/react/components/Dossier';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';
import StepProgress, { MobileStepper, MobileStepperLabel, MobileStepperStep, Step, StepButton, StepLabel } from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Table, { TableHead, TableBody, TableCell, TableRow, TableExpandableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IOfficesSetupAddModalResources } from '../../../Types/Resources/Administration/IOfficesSetupAddModalResources';
import { IAlert } from '@hedtech/powercampus-design-system/types/IAlert';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IJsonResult } from '@hedtech/powercampus-design-system/types/IJsonResult';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ILogData } from '@hedtech/powercampus-design-system/types/ILogData';
import { IOfficePermission } from '../../../Types/Administration/IOfficePermission';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import LogData from '@hedtech/powercampus-design-system/helpers/LogData';
import Resolver from '@hedtech/powercampus-design-system/helpers/Resolver';

// Requests
import Requests from '../../../Requests/Administration/OfficesSetupAddModal';
import RequestsLayout from '@hedtech/powercampus-design-system/requests/LayoutRequests';

// State Management
import LayoutActions from '@hedtech/powercampus-design-system/flux/actions/LayoutActions';
import PeopleSearchActions from '@hedtech/powercampus-design-system/flux/actions/PeopleSearchActions';
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
import PeopleSearchStore from '@hedtech/powercampus-design-system/flux/stores/PeopleSearchStore';
// #endregion Imports

// #region Types
export interface IOfficesSetupAddModalProps {
    hasDossierClaim: boolean;
    open: boolean;
    afterClose: () => void;
    afterFinish: () => void;
    onAdd: (personId: number, permissions: IOfficePermission[], resolver: any) => void;
}

interface IOfficesSetupAddModalState {
    componentError: boolean;
    colorFirstLetter?: number;
    isLoadingSave: boolean;
    isModified: boolean;
    resources?: IOfficesSetupAddModalResources;
    selectedOptions?: IDropDownOption[];
    selectedPerson?: IPeopleSearchModel;
    isLoadingOptions?: boolean;
    availableOffices?: IDropDownOption[];
    selectedOffices?: IOfficePermission[];

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

const styles = ((theme: Theme) => createStyles({
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
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '70%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '15%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '15%'
            },
        }
    }
}));

type PropsWithStyles = IOfficesSetupAddModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
class OfficesSetupAddModal extends React.Component<PropsWithStyles, IOfficesSetupAddModalState> {
    private idModule: string;
    private idPage: string;
    private layoutResources?: ILayoutResources;

    public readonly state: Readonly<IOfficesSetupAddModalState>;

    public constructor(props) {
        super(props);

        // #region Initialize Variables and State
        this.idModule = 'Administration';
        this.idPage = 'OfficesSetupAddModal';
        this.layoutResources = LayoutStore.getResourcesLayout();
        this.state = this.getInitialState();
        // #endregion Initialize Variables and State

        // #region Bind State Management Listeners
        PeopleSearchStore.addSelectedPersonListener(this.onSelect);
        // #endregion State Management Listeners
    }

    private getInitialState(): IOfficesSetupAddModalState {
        let resources: IOfficesSetupAddModalResources | undefined;
        if (this.state) {
            resources = this.state.resources;
        }
        return {
            colorFirstLetter: undefined,
            componentError: false,
            isLoadingSave: false,
            isModified: false,
            resources: resources,
            selectedOptions: undefined,
            selectedPerson: undefined,

            // #region Dossier
            dossierPersonId: 0,
            openDossierModal: false,
            // #endregion Dossier

            // #region Stepper
            activeStep: 0,
            numSteps: 3,
            stepErrors: [false, false, false]
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
                activeStep,
                numSteps,
                selectedOptions,
                stepErrors
            } = this.state;

            const positionParts: string[] = event.currentTarget.id.split('_');
            const position: number = Number(positionParts[1]);
            let errorStep: boolean = false;

            if (position >= 0 && position <= numSteps) {

                if (position === 2) {
                    errorStep = !Boolean(selectedOptions && selectedOptions.length > 0)
                    stepErrors[1] = errorStep;
                }

                this.setState({
                    activeStep: errorStep ? activeStep : position,
                    isModified: errorStep,
                    stepErrors
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
                onAdd,
            } = this.props;

            const {
                availableOffices,
                isLoadingSave,
                selectedOffices,
                selectedOptions,
                selectedPerson,
                stepErrors
            } = this.state;

            if (!isLoadingSave) {
                stepErrors[0] = !Boolean(selectedPerson);
                if (availableOffices) {
                    stepErrors[1] = !Boolean(selectedOptions && selectedOptions.length > 0);
                }

                this.setState({
                    isModified: true,
                    stepErrors
                });
                if (!stepErrors[0] && !stepErrors[1] && !stepErrors[2] && selectedPerson) {
                    this.showLoaderSave();
                    if (selectedOffices) {
                        onAdd(selectedPerson.personId, selectedOffices, this.resolvePostAdd);
                    }
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
            const newState: IOfficesSetupAddModalState = Object.assign({}, this.getInitialState());
            this.setState(newState, this.props.afterClose);
        }
        catch (e) {
            this.logError(LogData.fromException(this.onClose.name, e));
        }
    };

    private onDropDownChange = (optionsSelected: IDropDownOption[]): void => {
        try {

            let selectedOffices: IOfficePermission[] = [];
            const selectedOptions: any[] = [];
            optionsSelected.map(office => {
                selectedOptions.push(office.value);
                selectedOffices.push({
                    canEditTasks: false,
                    canViewNotes: false,
                    officeDesc: office.description,
                    officeId: Number(office.value)
                } as IOfficePermission)
            });

            this.setState({
                selectedOptions,
                selectedOffices
            });
        }
        catch (e) {
            this.logError(LogData.fromException(this.onDropDownChange.name, e));
        }
    };

    private onSelect = (): void => {
        const person: IPeopleSearchModel | undefined = PeopleSearchStore.getSelectedPerson();

        if (person) {
            this.setState({
                isLoadingOptions: true,
                isModified: false,
                selectedOptions: undefined,
                selectedPerson: person,
                stepErrors: [false, false, false]
            });

            Requests.getAvailableOfficesForStaff(person.personId, this.resolveGetAvailableOfficesForStaff);
        }
    };


    private onCheckboxChange = (event: any): void => {
        try {
            const {
                selectedOffices
            } = this.state;

            const completeId: string[] = event.target.id.split('_');
            const checkboxId: string = completeId[0];
            const officeId: number = Number(completeId[1]);
            const checked: boolean = event.target.checked;

            if (selectedOffices) {
                let officePermissionIndex = selectedOffices.findIndex(o => o.officeId === officeId);

                switch (checkboxId) {
                    case 'chkViewNotes':
                        selectedOffices[officePermissionIndex].canViewNotes = checked;
                        break;
                    case 'chkEditTasks':
                        selectedOffices[officePermissionIndex].canEditTasks = checked;
                        break;
                }
                this.setState({
                    selectedOffices
                });
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.onCheckboxChange.name, e));
        }
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

    private resolveGetAvailableOfficesForStaff = (json: string): void => {
        try {
            const result: IJsonResult | undefined
                = Resolver(json, this.resolveGetAvailableOfficesForStaff.name, this.hideAllLoaders);

            if (result?.status) {
                if (result.data) {
                    this.setState({
                        availableOffices: result.data.availableOffices,
                        isLoadingOptions: false
                    });
                }
                else {
                    this.hideLoaderSave();
                    this.showError();
                }
            }
        }
        catch (e) {
            this.logError(LogData.fromException(this.resolveGetAvailableOfficesForStaff.name, e));
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
            hasDossierClaim,
            open,
        } = this.props;

        const {
            availableOffices,
            componentError,
            isLoadingSave,
            isModified,
            resources,
            selectedOptions,
            selectedOffices,
            selectedPerson,
            isLoadingOptions,

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

        let contentStep0: JSX.Element;
        let contentStep1: JSX.Element;
        let contentStep2: JSX.Element;
        let contentStepButtons: JSX.Element;
        let contentPage: JSX.Element | undefined;
        let dossier: JSX.Element | undefined;
        if (!componentError && resources && this.layoutResources) {
            // #region Content Steps
            contentStep0 = (
                <PeopleSearch />
            );

            if (selectedPerson) {
                contentStep1 = (
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
                                    {resources.lblStepInstructions}
                                </Text>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} sm={6} className={classes.assignContainer}>
                                <Dropdown
                                    disabled={isLoadingSave}
                                    error={isModified &&
                                        (!Boolean(selectedOptions && selectedOptions.length > 0))}
                                    helperText={(isModified && (!Boolean(selectedOptions && selectedOptions.length > 0)))
                                        ? resources.lblRequiredOption
                                        : undefined}
                                    id="ddlOffice"
                                    label={resources.lblOption}
                                    loading={isLoadingOptions}
                                    multiple={true}
                                    options={availableOffices}
                                    value={selectedOptions}
                                    onChange={this.onDropDownChange}
                                />
                            </Grid>
                        </Grid>
                    </>
                );

                if (selectedOffices) {
                    contentStep2 = (
                        <>
                            <Grid container className={classes.secondStepSeparator}>
                                <Grid item xs={12}>
                                    <Table
                                        breakpoint="sm"
                                        classes={{ root: classes.table }}
                                        id="tblOfficePermissions"
                                        variant="expansionPanels"
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th">
                                                    <Text weight="strong">
                                                        {resources.lblOffice}
                                                    </Text>
                                                </TableCell>
                                                <TableCell component="th" align="center">
                                                    <Text weight="strong">
                                                        {resources.lblViewNotes}
                                                    </Text>
                                                </TableCell>
                                                <TableCell component="th" align="center">
                                                    <Text weight="strong">
                                                        {resources.lblEditTasks}
                                                    </Text>
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {selectedOffices.map((office, iOffice) => {

                                                return (
                                                    <TableExpandableRow key={`tblRow_${iOffice}`}>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            {office.officeDesc}
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            columnName={resources.lblViewNotes}
                                                        >
                                                            <Checkbox
                                                                checked={office.canViewNotes}
                                                                id={`chkViewNotes_${office.officeId}`}
                                                                inputProps={{
                                                                    'aria-label': Format.toString(resources.formatOfficeCanViewNotes, [office.officeDesc])
                                                                }}
                                                                onChange={this.onCheckboxChange}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            columnName={resources.lblEditTasks}
                                                        >
                                                            <Checkbox
                                                                checked={office.canEditTasks}
                                                                id={`chkEditTasks_${office.officeId}`}
                                                                inputProps={{
                                                                    'aria-label': Format.toString(resources.formatOfficeCanEditTasks, [office.officeDesc])
                                                                }}
                                                                onChange={this.onCheckboxChange}
                                                            />
                                                        </TableCell>
                                                    </TableExpandableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </Grid>
                            </Grid>
                        </>
                    );
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
                                disabled={activeStep === numSteps
                                    || (activeStep === 0 && !selectedPerson)}
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
                    id="addStaffModal"
                    header={resources.lblModalTitle}
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
                                        disabled={activeStep === numSteps
                                            || (activeStep === 0 && !selectedPerson)}
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
                                                    {activeStep === 1 && resources.lblStepAssignOffice}
                                                    {activeStep === 2 && resources.lblStepSetPermissions}
                                                </MobileStepperLabel>
                                            </MobileStepperStep>
                                            {activeStep === 0 && contentStep0}
                                            {activeStep === 1 && contentStep1}
                                            {activeStep === 2 && contentStep2}
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
                                                                    {ise === 1 && resources.lblStepAssignOffice}
                                                                    {ise === 2 && resources.lblStepSetPermissions}
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
                                                        {ise === 1 && resources.lblStepAssignOffice}
                                                        {ise === 2 && resources.lblStepSetPermissions}
                                                    </StepLabel>
                                                </StepButton>
                                            </Step>
                                        ))}
                                    </StepProgress>
                                    {activeStep === 0 && contentStep0}
                                    {activeStep === 1 && contentStep1}
                                    {activeStep === 2 && contentStep2}
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
export default withStyles(styles)(OfficesSetupAddModal);