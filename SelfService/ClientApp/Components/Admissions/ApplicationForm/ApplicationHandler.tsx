/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
* File: ApplicationHandler.tsx
* Type: Presentation component */

// #region Imports
import React, { RefObject } from 'react';
import Media from 'react-media';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
import ReCAPTCHA from '@hedtech/powercampus-design-system/react/core/ReCaptcha';
import StepProgress, {
    MobileStepper,
    MobileStepperLabel,
    MobileStepperStep,
    MobileStepperTitle,
    Step,
    StepButton,
    StepContent,
    StepLabel
} from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import ApplicationCompletedModal from './ApplicationCompletedModal';
import FieldsGroupHandler from './FieldsGroupHandler';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IApplicationContent } from '../../../Types/Applications/IApplicationContent';
import { IApplicationErrors } from '../../../Types/Applications/IApplicationErrors';
import { IApplicationForm } from '../../../Types/Form/IApplicationForm';
import { IFieldsGroup } from '../../../Types/Form/IFieldsGroup';
import { IPaymentTransaction } from '../../../Types/Payment/IPaymentTransaction';
import { IApplicationHandler } from '../../../Types/Resources/Admissions/IApplicationFormResources';
// #endregion

// #region Internal types
export interface IApplicationHandlerProps {
    activeStep: number;
    components?: IApplicationForm;
    dateTimeCulture: string;
    errors: IApplicationErrors[];
    expanded: boolean | string;
    failedPayment: boolean;
    firstDayOfWeek: number;
    governmentIdFormat: string;
    paymentTransaction: IPaymentTransaction;
    saveMessage?: string;
    section?: JSON;
    shortDatePattern: string;
    showSaveButton: boolean;
    successPayment: boolean;

    resources: IApplicationHandler;
    onAddMore: (fieldGroup: IFieldsGroup) => void;
    onBackStep: () => void;
    onClickSave?: () => void;
    onClickStep: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onChangeCheckBox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeDateTimeField: (date: string, id: string, isValid: boolean) => void;
    onChangeDropDown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeExpansionPanel: (label: string) => void;
    onChangeListCheckbox: (event: any) => void;
    onChangeRadioGroup: (event: React.ChangeEvent<any>, value: string) => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onCloseFailedPayment: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onDeleteItem: (event: any) => void;
    onNextStep: () => void;
    onSubmit: () => void;

    // #region ReCaptcha
    isReCaptchaSubmitEnabled: boolean;
    reCaptchaError: boolean;
    reCaptchaRef: RefObject<any>;
    reCaptchaSiteKey: string;
    uiCulture: string;
    onRecaptchaChange: (token: any) => void;
    onReCaptchaError: () => void;
    // #endregion ReCaptcha
}

const styles = (theme: Theme) => createStyles({
    backButtonMovil: {
        marginLeft: Tokens.spacing30
    },
    boxStep: {
        '& > span > span > span': {
            textAlign: 'left'
        },
        '&:focus': {
            boxShadow: 'none'
        }
    },
    buttonContainer: {
        marginTop: Tokens.spacing50
    },
    buttonsContainerMovil: {
        marginRight: Tokens.spacing50
    },
    buttonStep: {
        marginRight: Tokens.spacing40
    },
    cardRoot: {
        [theme.breakpoints.up('sm')]: {
            marginTop: Tokens.spacing80
        }
    },
    fieldContainer: {
        marginTop: Tokens.spacing30
    },
    footerPadding: {
        padding: `${Tokens.spacing50} ${Tokens.spacing50} 0 ${Tokens.spacing50}`,
        textAlign: 'center'
    },
    inline: {
        display: 'inline'
    },
    paddingLeft: {
        paddingLeft: Tokens.spacing80
    },
    marginLeft: {
        display: 'inline',
        marginLeft: Tokens.sizingSmall
    },
    mobileStepperContent: {
        minHeight: '65vh',
        padding: `${Tokens.spacing40} ${Tokens.spacing40} 0 ${Tokens.spacing40}`
    },
    reCaptchaErrorText: {
        paddingBottom: Tokens.spacing30
    },
    saveButtonMargin: {
        marginLeft: Tokens.sizingSmall,
        marginRight: Tokens.sizingSmall
    },
    saveFooter: {
        textAlign: 'center'
    },
    stepperDesktop: {
        padding: `${Tokens.spacing50} ${Tokens.spacing50} 0 ${Tokens.spacing50}`
    }
});

type PropsWithStyles = IApplicationHandlerProps & WithStyles<typeof styles>;
// #endregion

// #region Component

const ApplicationHandler: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        activeStep,
        classes,
        components,
        dateTimeCulture,
        errors,
        expanded,
        failedPayment,
        firstDayOfWeek,
        governmentIdFormat,
        paymentTransaction,
        saveMessage,
        shortDatePattern,
        showSaveButton,
        successPayment,

        onAddMore,
        onBackStep,
        onClickSave,
        onClickStep,
        onChangeCheckBox,
        onChangeDateTimeField,
        onChangeDropDown,
        onChangeExpansionPanel,
        onChangeListCheckbox,
        onChangeRadioGroup,
        onChangeTextField,
        onClickButton,
        onCloseFailedPayment,
        onDeleteItem,
        onNextStep,
        onSubmit,

        resources,

        // #region ReCaptcha
        isReCaptchaSubmitEnabled,
        reCaptchaError,
        reCaptchaRef,
        reCaptchaSiteKey,
        uiCulture,
        onRecaptchaChange,
        onReCaptchaError
        // #endregion ReCaptcha
    } = props;

    const noContent: JSX.Element = (
        <MessageStyled
            classMessage="noResults"
            message={resources.lblNotAvailable}
        />
    );

    const reCaptchaElement: JSX.Element = (
        <>
            <ReCAPTCHA
                hl={uiCulture}
                ref={reCaptchaRef}
                sitekey={reCaptchaSiteKey}
                onChange={onRecaptchaChange}
                onExpired={onReCaptchaError}
                onErrored={onReCaptchaError}
            />
            {reCaptchaError && (
                <Grid item>
                    <Text className={classes.reCaptchaErrorText} color="error" size="small">
                        {resources.lblReCaptchaRequired}
                    </Text>
                </Grid>
            )}
        </>
    );

    let content: IApplicationContent[] = [];
    if (components && components.steps && components.steps.length > 0) {
        content = Array(components.steps.length);
        components.steps.forEach((step, i) => {
            const fieldsGroupsElements: JSX.Element[] = [];
            if (step.fieldsGroups && step.fieldsGroups.length > 0) {
                step.fieldsGroups.forEach((fieldGroup, j) => {
                    fieldsGroupsElements.push(
                        <FieldsGroupHandler
                            dateTimeCulture={dateTimeCulture}
                            errors={errors}
                            expanded={expanded}
                            fieldGroup={fieldGroup}
                            fieldGroupIndex={j}
                            firstDayOfWeek={firstDayOfWeek}
                            governmentIdFormat={governmentIdFormat}
                            isExpansionPanel={fieldGroup.isExpansionPanel}
                            isHorizontalAligned={fieldGroup.isHorizontalAligned}
                            key={`fieldGroup|${j}|${i}`}
                            shortDatePattern={shortDatePattern}
                            stepIndex={i}
                            onChangeDateTimeField={onChangeDateTimeField}
                            onDeleteItem={onDeleteItem}
                            resources={resources}
                            onAddMore={onAddMore}
                            onChangeCheckBox={onChangeCheckBox}
                            onChangeDropDown={onChangeDropDown}
                            onChangeExpansionPanel={onChangeExpansionPanel}
                            onChangeListCheckbox={onChangeListCheckbox}
                            onChangeRadioGroup={onChangeRadioGroup}
                            onChangeTextField={onChangeTextField}
                            onClickButton={onClickButton}
                        />
                    );
                });
            }

            content[i] = {
                content: (
                    <Grid container key={`stepContent|${i}`} className={classes.fieldContainer}>
                        <Grid item xs>
                            {fieldsGroupsElements}
                        </Grid>
                    </Grid>),
                instructions: step.instructions,
                title: step.title
            };
        });
    }

    const fieldsGroupsModal: JSX.Element[] = [];
    const footer: JSX.Element[] = [];
    if (components && components.fieldsGroups) {
        if (components.fieldsGroups.length > 0) {
            // Confirmation Dialog
            if (components.isCompletedApplication) {
                let confirmationGroup: IFieldsGroup | undefined;
                const confirmationIndex: number =
                    components.fieldsGroups.findIndex(x => x.id === 'confirmationGroup');
                if (confirmationIndex > -1) {
                    confirmationGroup = components.fieldsGroups[confirmationIndex];
                }

                fieldsGroupsModal.push(
                    <ApplicationCompletedModal
                        key="CompletedModal"
                        dateTimeCulture={dateTimeCulture}
                        failedPayment={failedPayment}
                        fieldGroup={confirmationGroup}
                        paymentTransaction={paymentTransaction}
                        shortDatePattern={shortDatePattern}
                        successPayment={successPayment}
                        onAddMore={onAddMore}
                        onChangeCheckBox={onChangeCheckBox}
                        onChangeDateTimeField={onChangeDateTimeField}
                        onChangeDropDown={onChangeDropDown}
                        onChangeListCheckbox={onChangeListCheckbox}
                        onChangeRadioGroup={onChangeRadioGroup}
                        onChangeTextField={onChangeTextField}
                        onClickButton={onClickButton}
                        onCloseFailedPayment={onCloseFailedPayment}
                        resourcesApplicationHandler={resources}
                    />
                );
            }
            // Footer
            let footerGroup: IFieldsGroup | undefined;
            const footerGroupIndex: number =
                components.fieldsGroups.findIndex(x => x.id === 'footerGroup');
            if (footerGroupIndex > -1) {
                footerGroup = components.fieldsGroups[footerGroupIndex];
            }
            if (footerGroup) {
                footer.push(
                    <FieldsGroupHandler
                        dateTimeCulture={dateTimeCulture}
                        fieldGroup={footerGroup}
                        fieldGroupIndex={1}
                        isExpansionPanel={footerGroup.isExpansionPanel}
                        isHorizontalAligned={footerGroup.isHorizontalAligned}
                        stepIndex={1}
                        resources={resources}
                        onAddMore={onAddMore}
                        shortDatePattern={shortDatePattern}
                        onChangeCheckBox={onChangeCheckBox}
                        onChangeDateTimeField={onChangeDateTimeField}
                        onChangeDropDown={onChangeDropDown}
                        onChangeListCheckbox={onChangeListCheckbox}
                        onChangeRadioGroup={onChangeRadioGroup}
                        onChangeTextField={onChangeTextField}
                        onClickButton={onClickButton}
                    />
                );
            }
        }
    }

    return (
        <Grid container spacing={3}>
            <Grid item xs>
                <div id="applicationTop" />
                <Card classes={{ root: classes.cardRoot }} accent="secondary">
                    {content.length > 0 ? (
                        <Media query={Tokens.mqXSmall}>
                            {(matches: boolean): JSX.Element => matches ? (
                                <MobileStepper
                                    steps={content.length}
                                    position="static"
                                    activeStep={activeStep}
                                    nextButton={
                                        (
                                            <Button
                                                color="secondary"
                                                disabled={activeStep === content.length}
                                                id={'btnNext|mobile'}
                                                fluid={false}
                                                size="small"
                                                onClick={onNextStep}
                                            >
                                                {resources.lblNext}
                                            </Button>
                                        )
                                    }
                                    backButton={
                                        (
                                            <Button
                                                color="secondary"
                                                disabled={activeStep === 0}
                                                id={'btnBack|mobile'}
                                                fluid={false}
                                                size="small"
                                                onClick={onBackStep}
                                            >
                                                {resources.lblBack}
                                            </Button>
                                        )
                                    }
                                >
                                    <div className={classes.mobileStepperContent}>
                                        <MobileStepperTitle>
                                            <>
                                                {components ? (
                                                    <>
                                                        {components.name || ''}
                                                        {components.enableOnlinePayment
                                                            && components.feeAmount ?
                                                            (
                                                                <Text>
                                                                    {Format.toString(components.isFlatFee
                                                                        ? resources.formatHasFee
                                                                        : resources.formatHasFees,
                                                                        [components.feeAmount])}
                                                                </Text>
                                                            )
                                                            : undefined}
                                                    </>
                                                ) : undefined}
                                            </>
                                        </MobileStepperTitle>

                                        {activeStep !== content.length ? (
                                            <>
                                                <MobileStepperStep activeStep={activeStep}>
                                                    <MobileStepperLabel>
                                                        {content[activeStep].title}
                                                    </MobileStepperLabel>
                                                </MobileStepperStep>
                                                {content[activeStep].content}
                                            </>
                                        ) : (
                                            <>
                                                <StepProgress nonLinear activeStep={activeStep} orientation="vertical">
                                                    {content.map((step, i) => (
                                                        <Step key={`step|${i}`}>
                                                            <StepButton
                                                                classes={{ root: classes.boxStep }}
                                                                id={`step|${i}`}
                                                                onClick={onClickStep}
                                                            >
                                                                <StepLabel
                                                                    error={errors[i].isStepError}
                                                                    optional={step.instructions}
                                                                >
                                                                    {errors[i].isStepError ? (
                                                                        <Text role="alert" aria-label={Format.toString(resources.formatCompleteStep, [i + 1, step.title])}>
                                                                            {step.title}
                                                                        </Text>
                                                                    ) : step.title}
                                                                </StepLabel>
                                                            </StepButton>
                                                        </Step>
                                                    ))}
                                                </StepProgress>
                                                <Grid container>
                                                    {isReCaptchaSubmitEnabled && Boolean(reCaptchaSiteKey) && (
                                                        <Grid item xs={12}>
                                                            {reCaptchaElement}
                                                        </Grid>
                                                    )}
                                                    <Grid item xs={12}>
                                                        <Button
                                                            id="btnSubmit"
                                                            onClick={onSubmit}
                                                        >
                                                            {resources.lblSubmit}
                                                        </Button>
                                                    </Grid>
                                                </Grid>
                                            </>
                                        )
                                        }
                                    </div>
                                </MobileStepper>
                            ) : (
                                <>
                                    {components ? (
                                        <Grid container className={classes.stepperDesktop}>
                                            <Grid item xs>
                                                <Text size="h1">
                                                    {components.name || ''}
                                                </Text>
                                                {components.enableOnlinePayment
                                                    && components.feeAmount ?
                                                    (
                                                        <Text>
                                                            {Format.toString(components.isFlatFee
                                                                ? resources.formatHasFee
                                                                : resources.formatHasFees, [components.feeAmount])}
                                                        </Text>
                                                    )
                                                    : undefined}
                                                <Divider aria-hidden="true" />
                                            </Grid>
                                        </Grid>
                                    ) : undefined}
                                    <StepProgress nonLinear activeStep={activeStep} orientation="vertical">
                                        {content.map((step, i) => (
                                            <Step key={`step|${i}`}>
                                                <StepButton
                                                    classes={{ root: classes.boxStep }}
                                                    id={`step|${i}`}
                                                    onClick={onClickStep}
                                                >
                                                    <StepLabel
                                                        error={errors[i].isStepError}
                                                        optional={step.instructions}
                                                    >
                                                        {errors[i].isStepError ? (
                                                            <Text role="alert" aria-label={Format.toString(resources.formatCompleteStep, [i + 1, step.title])}>
                                                                {step.title}
                                                            </Text>
                                                        ) : step.title}
                                                    </StepLabel>
                                                </StepButton>
                                                <StepContent>
                                                    {step.content}
                                                    {activeStep !== content.length - 1 && (
                                                        <Grid container>
                                                            <Grid item>
                                                                <ButtonGroup id={`btgStep`}>
                                                                    <Button
                                                                        disabled={activeStep === 0}
                                                                        id={`btnBack|${i}`}
                                                                        variant="text"
                                                                        onClick={onBackStep}
                                                                    >
                                                                        {resources.lblBack}
                                                                    </Button>
                                                                    <Button
                                                                        className={classes.buttonStep}
                                                                        color="primary"
                                                                        id={`btnNext|${i}`}
                                                                        onClick={onNextStep}
                                                                    >
                                                                        {resources.lblNext}
                                                                    </Button>
                                                                </ButtonGroup>
                                                            </Grid>
                                                        </Grid>
                                                    )}
                                                </StepContent>
                                            </Step>
                                        ))}
                                    </StepProgress >
                                    {activeStep === content.length - 1 && (
                                        <Grid container className={classes.paddingLeft}>
                                            {isReCaptchaSubmitEnabled && Boolean(reCaptchaSiteKey) && (
                                                <Grid item xs={12}>
                                                    {reCaptchaElement}
                                                </Grid>
                                            )}
                                            <Grid item>
                                                <ButtonGroup id={`btgStep`}>
                                                    <Button
                                                        id={`btnBack|${content.length}`}
                                                        variant="text"
                                                        onClick={onBackStep}
                                                    >
                                                        {resources.lblBack}
                                                    </Button>
                                                    <Button
                                                        className={classes.buttonStep}
                                                        color="primary"
                                                        id="btnSubmit"
                                                        onClick={onSubmit}
                                                    >
                                                        {resources.lblSubmit}
                                                    </Button>
                                                </ButtonGroup>
                                            </Grid>
                                        </Grid>
                                    )}
                                </>
                            )
                            }
                        </Media>
                    ) : noContent}
                    {showSaveButton && onClickSave ?
                        (
                            <div className={classes.saveFooter}>
                                <br />
                                <Grid item xs={12}>
                                    <Text>
                                        {saveMessage}
                                    </Text>
                                </Grid>
                                <br />
                                <div className={classes.saveButtonMargin}>
                                    <Button
                                        className={classes.inline}
                                        color="secondary"
                                        id="btnSave"
                                        onClick={onClickSave}
                                    >
                                        <Icon name="save" />
                                        <div className={classes.marginLeft}>
                                            {resources.lblSave}
                                        </div>
                                    </Button>
                                </div>
                            </div>
                        )
                        : undefined
                    }
                    <div className={classes.footerPadding}>
                        {footer}
                    </div>
                    {fieldsGroupsModal}
                </Card>
            </Grid>
        </Grid >
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(ApplicationHandler);