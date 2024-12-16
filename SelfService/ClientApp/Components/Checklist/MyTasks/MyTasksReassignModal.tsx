/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: MyTasksReassignModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import PeopleSearch from '@hedtech/powercampus-design-system/react/components/PeopleSearch';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import StepProgress, {
    MobileStepper,
    MobileStepperLabel,
    MobileStepperStep,
    Step,
    StepButton,
    StepLabel
} from '@hedtech/powercampus-design-system/react/core/StepProgress';

// Types
import { IMyTasksDetail } from '../../../Types/Checklist/IMyTasksDetial';
import { IMyTasksMainResources } from '../../../Types/Resources/Checklist/IMyTasksMainResources';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// #endregion Imports

// #region Types
export interface IAlertDetailModalProps {
    onClickStep: (event: any) => void;
    onClose: () => void;
    onSaveReassign: () => void;
    open: boolean;
    resources: IMyTasksMainResources;
    saveReassign: IMyTasksDetail;
    selectedPerson?: IPeopleSearchModel;

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

type PropsWithStyles = IAlertDetailModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const MyTasksReassignModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        onClickStep,
        onClose,
        onSaveReassign,
        open,
        saveReassign,
        selectedPerson,
        resources,
        // #region Stepper
        activeStep,
        numSteps,
        stepErrors
        // #endregion Stepper
    } = props;

    let contentSetp0: JSX.Element;
    let contentSetp1: JSX.Element;
    let contentStepButtons: JSX.Element;
    let contentPage: JSX.Element | undefined;
    contentSetp0 = (
        <PeopleSearch />
    );

    if (selectedPerson) {
        contentSetp1 = (
            <>
                <br />
                <Grid container>
                    <Grid item>
                        <Text>
                            {resources.lblReassignLegend}
                        </Text>
                    </Grid>
                </Grid>
                <Grid container>
                    <Grid item>
                        <AvatarText
                            avatarInfo={selectedPerson}
                        />
                    </Grid>
                </Grid>
            </>
        );
    }

    const finalStep: boolean = activeStep === numSteps - 1;
    contentStepButtons = (
        <Grid container justifyContent="flex-end">
            <Grid item>
                <ButtonGroup id={`btgStep${activeStep}`}>
                    <Button
                        disabled={activeStep === 0}
                        id={`btnBack_${activeStep - 1}`}
                        variant="text"
                        onClick={onClickStep}
                    >
                        {resources.lblBack}
                    </Button>
                    <Button
                        disabled={activeStep === 0 && !selectedPerson}
                        id={`btnNext_${activeStep + 1}`}
                        onClick={finalStep
                            ? onSaveReassign
                            : onClickStep}
                    >
                        {finalStep
                            ? resources.lblSave
                            : resources.lblNext}
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
            header={Format.toString(resources.formatReassign, [saveReassign.actionName])}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            <Media query={Tokens.mqXSmall}>
                {(matches: boolean): JSX.Element => matches ? (
                    <MobileStepper
                        steps={numSteps}
                        position="static"
                        activeStep={activeStep}
                        nextButton={(
                            <IconButton
                                aria-label={resources.lblNext}
                                color="secondary"
                                disabled={activeStep === numSteps || (activeStep === 0 && !selectedPerson)}
                                id={`btnNext_${activeStep + 1}`}
                                onClick={onClickStep}
                            >
                                <Icon large name="chevron-right" />
                            </IconButton>
                        )}
                        backButton={(
                            <IconButton
                                aria-label={resources.lblBack}
                                color="secondary"
                                disabled={activeStep === 0}
                                id={`btnBack_${activeStep - 1}`}
                                onClick={onClickStep}
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
                                            {activeStep === 1 && resources.lblConfirm}
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
                                                        onClick={onClickStep}
                                                    >
                                                        <StepLabel error={stepError}>
                                                            {ise === 0 && resources.lblSearchPerson}
                                                            {ise === 1 && resources.lblConfirm}
                                                        </StepLabel>
                                                    </StepButton>
                                                </Step>
                                            ))}
                                        </StepProgress>
                                        <Button
                                            id="btnFinish"
                                            onClick={onSaveReassign}
                                        >
                                            {resources.lblSave}
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
                                            onClick={onClickStep}
                                        >
                                            <StepLabel error={stepError}>
                                                {ise === 0 && resources.lblSearchPerson}
                                                {ise === 1 && resources.lblConfirm}
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

    return (
        <>
            {contentPage}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(MyTasksReassignModal);