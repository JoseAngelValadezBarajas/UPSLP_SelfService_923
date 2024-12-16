/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: NameFormatsEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';
import Media from 'react-media';

// Core components
import Alert from '@hedtech/powercampus-design-system/react/core/Alert';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import { DragDropContext, Draggable, DraggableItem, Droppable, DroppableContainer } from '@hedtech/powercampus-design-system/react/core/DragNDrop';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import StepProgress, {
    MobileStepper,
    MobileStepperLabel,
    MobileStepperStep,
    Step,
    StepLabel
} from '@hedtech/powercampus-design-system/react/core/StepProgress';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { INameFormatList } from '../../../Types/NameFormat/INameFormatList';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
// #endregion

// #region Internal types
export interface INameFormatsEditProps {
    alertText?: string;
    isNameEmpty: boolean;
    nameFormatList: INameFormatList;
    nameParts: IDropDownOption[];
    namePreviews: string[];
    onAddNamePart: () => void;
    onChangeActive: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeNameFormat: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickCancel: () => void;
    onClickStep: () => void;
    onCloseAlert: () => void;
    onDragEnd: (result: any) => void;
    onEditField: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onFinish: () => void;
    onOpenChangeExampleModal: () => void;
    onOpenDeleteNamePart: (event: React.MouseEvent<HTMLButtonElement>) => void;
    resources: INameFormatsEditResProps;
    selectedNameParts: string[];
    showAlert: boolean;
    unSelectedNameParts: string[];

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper
}

export interface INameFormatsEditResProps {
    btnAdd: string;
    btnBack: string;
    btnCancel: string;
    btnDelete: string;
    btnEdit: string;
    btnFinish: string;
    btnNext: string;
    btnSave: string;
    btnSetExample: string;
    formatDeleteNamePart: string;
    formatDeleteNamePartTitle: string;
    formatEditingNamePart: string;
    formatEditingTitle: string;
    lblActive: string;
    lblAddNameFormat: string;
    lblCancel: string;
    lblConfirm: string;
    lblDescription: string;
    lblDisplay: string;
    lblDisplayFirstName: string;
    lblDisplayName: string;
    lblDisplayOrder: string;
    lblDisplayOrderTitle: string;
    lblEmpty: string;
    lblEmptyPreview: string;
    lblEnterName: string;
    lblFirstName: string;
    lblGapsBetween: string;
    lblLastName: string;
    lblLastNamePrefix: string;
    lblMiddleName: string;
    lblName: string;
    lblNameFormatActive: string;
    lblNameFormatExists: string;
    lblNameMaxLength: string;
    lblNamePart: string;
    lblNamePartNotValid: string;
    lblNamePartRequired: string;
    lblNamePartSortRequired: string;
    lblNameParts: string;
    lblNamePartsUnique: string;
    lblNameRequired: string;
    lblNoError: string;
    lblNone: string;
    lblNullNameFormat: string;
    lblOrderLists: string;
    lblOrderListsBy: string;
    lblPrefix: string;
    lblPreview: string;
    lblPronoun: string;
    lblSave: string;
    lblSelectedFields: string;
    lblSelectNamePart: string;
    lblSeparator: string;
    lblSeparatorFormat: string;
    lblSeparatorMaxLength: string;
    lblSeparatorPipe: string;
    lblSortedByTitle: string;
    lblSortList: string;
    lblSortListBy: string;
    lblSortListDescription: string;
    lblSortOrderGreater: string;
    lblSortOrderUnique: string;
    lblSuffix: string;
}

const styles = (() => createStyles({
    breakWord: {
        wordBreak: 'break-word'
    },
    droppable: {
        height: Tokens.heightFluid,
        '& > div:nth-of-type(1)': {
            height: Tokens.heightFluid,
            padding: `${Tokens.spacingReset} ${Tokens.important}`,
            borderRadius: `${Tokens.borderRadiusReset} ${Tokens.important}`,
            backgroundColor: `${Tokens.colorBrandNeutral250} ${Tokens.important}`
        }
    },
    droppableColumn: {
        backgroundColor: Tokens.colorBrandNeutral250,
        border: `3px solid ${Tokens.colorBrandNeutral100}`,
        height: Tokens.heightFluid,
    },
    mobileStepperContent: {
        minHeight: '65vh',
        padding: `${Tokens.spacing40} ${Tokens.spacing40} 0 ${Tokens.spacing40}`
    },
    textField: {
        display: 'flex'
    },
    textInline: {
        display: 'inline',
    }
}));

type PropsWithStyles = INameFormatsEditProps & WithStyles<typeof styles> & WithWidth;
// #endregion

// #region Component
const NameFormatsEdit: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        alertText,
        classes,
        isNameEmpty,
        nameFormatList,
        showAlert,
        namePreviews,
        unSelectedNameParts,
        selectedNameParts,
        onAddNamePart,
        onClickCancel,
        onChangeActive,
        onChangeNameFormat,
        onClickStep,
        onCloseAlert,
        onDragEnd,
        onEditField,
        onFinish,
        onOpenChangeExampleModal,
        onOpenDeleteNamePart,

        // #region Stepper
        activeStep,
        numSteps,
        stepErrors,
        // #endregion Stepper

        resources
    } = props;

    const getFieldName = (field: string): string => {
        let fieldName: string = '';
        switch (field) {
            case 'PX':
                fieldName = resources.lblPrefix;
                break;
            case 'FN':
                fieldName = resources.lblFirstName;
                break;
            case 'MN':
                fieldName = resources.lblMiddleName;
                break;
            case 'LP':
                fieldName = resources.lblLastNamePrefix;
                break;
            case 'LN':
                fieldName = resources.lblLastName;
                break;
            case 'DN':
                fieldName = resources.lblDisplayName;
                break;
            case 'PN':
                fieldName = resources.lblPronoun;
                break;
            case 'SX':
                fieldName = resources.lblSuffix;
                break;
        }
        return fieldName;
    };

    const displayOrderList: JSX.Element[] = [];
    if (nameFormatList && nameFormatList.namePartList) {
        for (let i = 0; i < nameFormatList.namePartList.length; i++) {
            const namePartDesc: string = getFieldName(nameFormatList.namePartList[i].namePart);
            displayOrderList.push(
                <div className={classes.textInline}>
                    <Text>
                        {`${i + 1}.${namePartDesc}`}
                    </Text>
                </div>
            );
        }
    }

    const sortedOrderList: JSX.Element[] = [];
    if (selectedNameParts) {
        for (let i = 0; i < selectedNameParts.length; i++) {
            const namePartDesc: string = getFieldName(selectedNameParts[i]);
            sortedOrderList.push(
                <div className={classes.textInline} >
                    <Text>
                        {`${i + 1}.${namePartDesc}`}
                    </Text>
                </div>
            );
        }
    }

    const contentStep0: JSX.Element =
        (
            <Grid container>
                <Grid item xs={12}>
                    <Text size="h4">
                        {resources.lblDescription}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    <Grid container alignItems="flex-end" direction="column" justifyContent="flex-end">
                        <Grid item xs>
                            <Tooltip
                                id="tltAdd"
                                title={resources.btnAdd}
                                placement="top"
                            >
                                <IconButton
                                    aria-label={resources.btnAdd}
                                    onClick={onAddNamePart}
                                    id="btnAddNameFormat"
                                >
                                    <Icon name="add" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12}>
                    <Grid container>
                        {nameFormatList.namePartList &&
                            nameFormatList.namePartList.filter(field => field.namePart.toString() !== 'none').length > 0 ? (
                            <>
                                <Grid item xs={12}>
                                    <Grid container>
                                        <DragDropContext onDragEnd={onDragEnd}>
                                            <DroppableContainer id="drpcFields">
                                                <Droppable
                                                    droppableId="drpFields"
                                                    type="first-level"
                                                >
                                                    {nameFormatList.namePartList &&
                                                        nameFormatList.namePartList.map((field, iField) => (
                                                            field.namePart.toString() !== 'none' ? (
                                                                <>
                                                                    <Draggable
                                                                        key={`drgField_${iField}`}
                                                                        draggableId={`drgField_${iField}`}
                                                                        index={iField}
                                                                    >
                                                                        <DraggableItem
                                                                            buttons={(
                                                                                <>
                                                                                    <Grid item>
                                                                                        <Tooltip
                                                                                            id="tltEditField"
                                                                                            title={resources.btnEdit}
                                                                                        >
                                                                                            <IconButton
                                                                                                aria-label={resources.btnEdit}
                                                                                                color="gray"
                                                                                                data-id={iField}
                                                                                                id={`btnEditField_${iField}`}
                                                                                                onClick={onEditField}
                                                                                            >
                                                                                                <Icon name="edit" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </Grid>
                                                                                    <Grid item>
                                                                                        <Tooltip
                                                                                            id="tltDeleteField"
                                                                                            title={resources.btnDelete}
                                                                                        >
                                                                                            <IconButton
                                                                                                aria-label={resources.btnDelete}
                                                                                                color="gray"
                                                                                                data-id={iField}
                                                                                                id={`btnDeleteField_${iField}`}
                                                                                                onClick={onOpenDeleteNamePart}
                                                                                            >
                                                                                                <Icon name="trash" />
                                                                                            </IconButton>
                                                                                        </Tooltip>
                                                                                    </Grid>
                                                                                </>
                                                                            )}
                                                                            id={`drgiField_${iField}`}
                                                                            showDragIcon
                                                                            styleName="secondary"
                                                                        >
                                                                            <Text>
                                                                                {getFieldName(field.namePart)}
                                                                            </Text>
                                                                        </DraggableItem>
                                                                    </Draggable>
                                                                </>
                                                            ) : undefined
                                                        ))}
                                                </Droppable>
                                            </DroppableContainer>
                                        </DragDropContext>
                                    </Grid>
                                </Grid>
                            </>
                        ) : (
                            <Grid item xs={12}>
                                <Illustration
                                    height="md"
                                    color="secondary"
                                    internalName="no-activities"
                                    text={resources.lblEmpty}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Grid>
            </Grid>
        );

    const contentStep1: JSX.Element =
        (
            <Grid container>
                <Grid item xs={12}>
                    <Text size="h4">
                        {resources.lblSortListDescription}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    <DragDropContext onDragEnd={onDragEnd}>
                        <Grid container spacing={4}>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Text size="h3" weight="strong">
                                            {resources.lblSelectedFields}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.droppableColumn}>
                                    <Grid item xs={12}>
                                        <DroppableContainer
                                            id="drpcUnselectedNameParts"
                                            className={classes.droppable}
                                        >
                                            <Droppable
                                                droppableId="drpUnSelectedNameParts"
                                                type="first-level"
                                            >
                                                {unSelectedNameParts.map((unSelectedNamePart, iUnSelectedNamePart) => (
                                                    unSelectedNamePart !== 'none' && (
                                                        <Draggable
                                                            key={`drgUnselectedNamePart_${iUnSelectedNamePart}`}
                                                            draggableId={`drgUnselectedNamePart_${iUnSelectedNamePart}`}
                                                            index={iUnSelectedNamePart}
                                                        >
                                                            <DraggableItem
                                                                id={`drgiUnselectedNamePart_${iUnSelectedNamePart}`}
                                                                showDragIcon
                                                                styleName="secondary"
                                                            >
                                                                <Text>
                                                                    {getFieldName(unSelectedNamePart)}
                                                                </Text>
                                                            </DraggableItem>
                                                        </Draggable>
                                                    )
                                                ))}
                                            </Droppable>
                                        </DroppableContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6}>
                                <Grid container>
                                    <Grid item xs={12}>
                                        <Text size="h3" weight="strong">
                                            {resources.lblSortListBy}
                                        </Text>
                                    </Grid>
                                </Grid>
                                <Grid container className={classes.droppableColumn}>
                                    <Grid item xs={12}>
                                        <DroppableContainer
                                            id="drpcSelectedNameParts"
                                            className={classes.droppable}
                                        >
                                            <Droppable
                                                droppableId="drpSelectedNameParts"
                                                type="first-level"
                                            >
                                                {selectedNameParts.map((selectedNamePart, iSelectedNamePart) => (
                                                    selectedNamePart !== 'none' && (
                                                        <Draggable
                                                            key={`drgSelectedNamePart_${iSelectedNamePart}`}
                                                            draggableId={`drgSelectedNamePart_${iSelectedNamePart}`}
                                                            index={iSelectedNamePart}
                                                        >
                                                            <DraggableItem
                                                                id={`drgiSelectedNamePart_${iSelectedNamePart}`}
                                                                showDragIcon
                                                                styleName="secondary"
                                                            >

                                                                <Text>
                                                                    {getFieldName(selectedNamePart)}
                                                                </Text>
                                                            </DraggableItem>
                                                        </Draggable>
                                                    )
                                                ))}
                                            </Droppable>
                                        </DroppableContainer>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                    </DragDropContext>
                <br/>
                </Grid>
            </Grid>
        );

    const contentStep2: JSX.Element =
        (
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <Text weight="strong">
                                {resources.lblDisplayOrderTitle}
                            </Text>
                        </Grid>
                        <Grid item xs={12}>
                            {displayOrderList}
                        </Grid>
                        <Grid item xs={12}>
                            <Text weight="strong">
                                {resources.lblSortedByTitle}
                            </Text>
                        </Grid>
                        <Grid item xs={12}>
                            {sortedOrderList}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text size="h3" weight="strong">
                                        {resources.lblPreview}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    {namePreviews.length > 0 ?
                                        (
                                            <>
                                                <Grid container spacing={2}>
                                                    {namePreviews.map((namePreview, iNamePreview) => (
                                                        <Grid item xs={12} key={`namePreviewItem_${iNamePreview}`}>
                                                            <Text>
                                                                {(iNamePreview + 1) + '. ' + namePreview}
                                                            </Text>
                                                        </Grid>
                                                    ))}
                                                </Grid>
                                            </>
                                        ) : (
                                            <>
                                                <Illustration
                                                    height="xs"
                                                    color="secondary"
                                                    name="no-tasks"
                                                    text={resources.lblEmptyPreview}
                                                />
                                            </>
                                        )}
                                </Grid>
                                <Grid item xs={12}>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Button
                                                align="left"
                                                id="btnSetExample"
                                                textVariantStyling="inherit"
                                                variant="text"
                                                onClick={onOpenChangeExampleModal}
                                            >
                                                {resources.btnSetExample}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
        );

    const contentStep0Movil: JSX.Element =
        (
            <>
                {contentStep0}
                <Grid container>
                    <Grid item xs={12}>
                        <Button
                            id={`btnCancel_${activeStep - 1}`}
                            color="secondary"
                            onClick={onClickCancel}
                        >
                            {resources.btnCancel}
                        </Button>
                    </Grid>
                </Grid>
            </>
        );

    const finalStep: boolean = activeStep === numSteps - 1;
    const contentStepButtons: JSX.Element = (
        <Grid container justifyContent="flex-end">
            <Grid item>
                <ButtonGroup id={`btgStep${activeStep}`}>
                    {activeStep === 0 ?
                        <Button
                            id={`btnCancel_${activeStep - 1}`}
                            color="secondary"
                            onClick={onClickCancel}
                        >
                            {resources.btnCancel}
                        </Button>
                        : undefined
                    }
                    {activeStep !== 0 ?
                        <Button
                            id={`btnBack_${activeStep - 1}`}
                            variant="text"
                            onClick={onClickStep}
                        >
                            {resources.btnBack}
                        </Button>
                        : undefined
                    }
                    <Button
                        id={`btnNext_${activeStep + 1}`}
                        onClick={finalStep
                            ? onFinish
                            : onClickStep}
                    >
                        {finalStep
                            ? resources.btnFinish
                            : resources.btnNext}
                    </Button>
                </ButtonGroup>
            </Grid>
        </Grid>
    );

    const stepProgress: JSX.Element = (
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
                            id={`btnNext_${activeStep + 1}`}
                            disabled={activeStep === numSteps}
                            onClick={onClickStep}
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
                                        {activeStep === 0 && resources.lblNameParts}
                                        {activeStep === 1 && resources.lblSortList}
                                        {activeStep === 2 && resources.lblConfirm}
                                    </MobileStepperLabel>
                                </MobileStepperStep>
                                {activeStep === 0 && contentStep0Movil}
                                {activeStep === 1 && contentStep1}
                                {activeStep === 2 && contentStep2}
                            </>
                        ) : (
                            <>
                                <StepProgress nonLinear activeStep={activeStep} orientation="vertical">
                                    {stepErrors.map((stepError, i) => (
                                        <Step key={`step_${i}`}>
                                            <StepLabel error={stepError}>
                                                {i === 0 && resources.lblNameParts}
                                                {i === 1 && resources.lblSortList}
                                                {i === 2 && resources.lblConfirm}
                                            </StepLabel>
                                        </Step>
                                    ))}
                                </StepProgress>
                                <Button
                                    id="btnFinish"
                                    onClick={onFinish}
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
                        {stepErrors.map((stepError, i) => (
                            <Step key={`step_${i}`}>
                                <StepLabel error={stepError}>
                                    {i === 0 && resources.lblNameParts}
                                    {i === 1 && resources.lblSortList}
                                    {i === 2 && resources.lblConfirm}
                                </StepLabel>
                            </Step>
                        ))}
                    </StepProgress>
                    <Grid container>
                        <Grid item xs>
                            <Alert
                                id="msgNameFormats"
                                open={showAlert}
                                text={alertText}
                                type={ResultType.error}
                                userDismissable
                                onClose={onCloseAlert}
                                variant="inline"
                            />
                        </Grid>
                    </Grid>
                    {activeStep === 0 && contentStep0}
                    {activeStep === 1 && contentStep1}
                    {activeStep === 2 && contentStep2}
                </>
            )
            }
        </Media>
    );

    return (
        <>
            {!Boolean(nameFormatList.id) ?
                <Grid container>
                    <Grid item xs >
                        <Text size="h3" weight="strong">
                            {resources.lblAddNameFormat}
                        </Text>
                    </Grid>
                </Grid>
                :
                <Grid container>
                    <Grid item xs >
                        <Text size="h3" weight="strong">
                            {Format.toString(resources.formatEditingTitle,
                                [nameFormatList.name])}
                        </Text>
                    </Grid>
                </Grid>
            }
            {!Boolean(nameFormatList.id) ?
                <Grid container>
                    <Grid item xs sm={8} md={5} >
                        <div className={classes.textField}>
                            <TextField
                                disabled={Boolean(nameFormatList.id)}
                                error={isNameEmpty}
                                helperText={isNameEmpty ? resources.lblEnterName : ''}
                                id={'txtNameFormat'}
                                label={resources.lblName}
                                maxCharacters={40}
                                required
                                type="text"
                                value={nameFormatList.name}
                                onChange={onChangeNameFormat}
                            />
                        </div>
                    </Grid>
                </Grid>
                : undefined
            }
            <Grid container>
                <Grid item xs >
                    <Checkbox
                        id={'chkActive'}
                        checked={nameFormatList.isActive}
                        disabled={nameFormatList.isAssignedToCategory}
                        label={resources.lblActive}
                        onChange={onChangeActive}
                    />
                </Grid>
            </Grid>
            {stepProgress}
            <Hidden xsDown>
                {contentStepButtons}
            </Hidden>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(withWidth()(NameFormatsEdit));
