/* Copyright 2019 - 2021 Ellucian Company L.P. and its affiliates.
 * File: AppSetupHandler.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Chip from '@hedtech/powercampus-design-system/react/core/Chip';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Table, { TableBody, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IAppSetupForm } from '../../../Types/Form/IAppSetupForm';
import { IAppSetupHandlerResProps } from '../../../Types/Resources/Administration/IApplicationSetupResources';
// #endregion Imports

// #region Types
export interface IAppSetupHandlerProps {
    activeStep: number;
    applicationForm: IAppSetupForm;
    layoutDescription?: string;
    layoutName?: string;

    resources: IAppSetupHandlerResProps;

    onChangeExpansionPanel: (stepIndex: number) => void;
    onClickAddComponent: () => void;
    onClickAddNewStep: (event: any) => void;
    onClickDownButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickDownFieldGroupButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickSendToButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickUpButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickUpFieldGroupButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onEditFieldGroup: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onEditName: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onEditStepButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onSave: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const styles = createStyles({
    addStepIcon: {
        backgroundColor: Tokens.colorTextNeutral300,
        borderRadius: '100%',
        color: Tokens.colorTextNeutral600
    },
    chipForm: {
        cursor: 'pointer'
    },
    table: {
        '& > tbody > tr > th:nth-child(1)': {
            width: '2%'
        },
        '& > tbody > tr > th:nth-child(2)': {
            width: '92%'
        },
        '& > tbody > tr > th:nth-child(3)': {
            width: '2%'
        },
        '& > tbody > tr > th:nth-child(4)': {
            width: '2%'
        },
        '& > tbody > tr > th:nth-child(5)': {
            width: '2%'
        }
    },
    margin: {
        marginTop: Tokens.spacing60,
        marginBottom: Tokens.spacing40
    }
});

type PropsWithStyles = IAppSetupHandlerProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AppSetupHandler: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        activeStep,
        applicationForm,
        classes,
        layoutDescription,
        layoutName,
        onClickAddComponent,
        onClickAddNewStep,
        onChangeExpansionPanel,
        onClickSendToButton,
        onClickDownButton,
        onClickDownFieldGroupButton,
        onClickUpButton,
        onClickUpFieldGroupButton,
        onEditFieldGroup,
        onEditName,
        onEditStepButton,
        onSave,

        resources
    } = props;

    const steps: JSX.Element[] = [];
    const pageHeader: JSX.Element[] = [];
    let saveButton: JSX.Element | undefined;
    let contentPage: JSX.Element | undefined;

    if (applicationForm) {
        if (applicationForm.name) {
            pageHeader.push(
                <Grid
                    container
                    key="GridName"
                    spacing={3}
                >
                    <Grid item xs={2} md={1}>
                        <Tooltip
                            id="editNameIcon"
                            placement="top"
                            title={resources.lblEdit}
                        >
                            <IconButton
                                aria-label={resources.lblEdit}
                                color="secondary"
                                id={'iconButton_formName'}
                                onClick={onEditName}
                            >
                                <Icon name="edit" />
                            </IconButton>
                        </Tooltip>
                    </Grid>
                    <Grid item xs={10} md={10}>
                        <Text size="h1">
                            {layoutName ? layoutName : applicationForm.name}
                        </Text>
                    </Grid>
                </Grid>
            );
        }
        if (applicationForm.description) {
            pageHeader.push(
                <Grid
                    container
                    key="GridDescription"
                    spacing={3}
                >
                    <Grid item xs={2} md={1} />
                    <Grid item xs={10} md={10}>
                        <Text>
                            {layoutDescription ? layoutDescription : applicationForm.description}
                        </Text>
                    </Grid>
                </Grid>
            );
        }

        // Steps
        if (applicationForm.steps) {
            applicationForm.steps.sort(function (a, b) {
                if (a.stepNumber > b.stepNumber) {
                    return 1;
                }
                if (a.stepNumber < b.stepNumber) {
                    return -1;
                }
                return 0;
            }).forEach((step, i) => {
                // Table Body
                const tableBody: JSX.Element[] = [];
                step.stepFieldGroups.sort(function (a, b) {
                    if (a.sortOrder > b.sortOrder) {
                        return 1;
                    }
                    if (a.sortOrder < b.sortOrder) {
                        return -1;
                    }
                    return 0;
                }).forEach((fieldGroup, j) => {
                    tableBody.push(
                        <TableRow
                            key={`fieldGroupRow_${j}`}
                        >
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                <Tooltip
                                    id="EditFGIcon"
                                    placement="top"
                                    title={resources.lblEdit}
                                >
                                    <IconButton
                                        color="secondary"
                                        id={`iconEditFGButton|${step.stepNumber}|${fieldGroup.sortOrder}`}
                                        onClick={onEditFieldGroup}
                                    >
                                        <Icon name="edit" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                {fieldGroup.id}
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                <Tooltip
                                    id="UpFGIcon"
                                    placement="top"
                                    title={resources.lblUp}
                                >
                                    <IconButton
                                        color="secondary"
                                        id={`iconFGButtonUp|${step.stepNumber}|${fieldGroup.sortOrder}`}
                                        onClick={onClickUpFieldGroupButton}
                                    >
                                        <Icon name="arrow-up" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                <Tooltip
                                    id="DownFGIcon"
                                    placement="top"
                                    title={resources.lblDown}
                                >
                                    <IconButton
                                        color="secondary"
                                        id={`iconFGButtonDown|${step.stepNumber}|${fieldGroup.sortOrder}`}
                                        onClick={onClickDownFieldGroupButton}
                                    >
                                        <Icon name="arrow-down" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                            <TableCell
                                component="th"
                                scope="row"
                            >
                                <Tooltip
                                    id="OutFGIcon"
                                    placement="top"
                                    title={resources.lblSendTo}
                                >
                                    <IconButton
                                        color="secondary"
                                        id={`iconFGButtonOut|${step.stepNumber}|${fieldGroup.sortOrder}`}
                                        onClick={onClickSendToButton}
                                    >
                                        <Icon name="forward" />
                                    </IconButton>
                                </Tooltip>
                            </TableCell>
                        </TableRow>
                    );
                });
                let chip: JSX.Element;
                chip = (
                    <Chip
                        activated={activeStep === i}
                        classes={{ root: classes.chipForm }}
                        id={`chip_${i}`}
                        label={step.stepNumber}
                    />
                );

                steps.push(
                    <ExpansionPanel
                        background="gray"
                        expanded={activeStep === i}
                        id={`expansionPanel_${i}`}
                        key={`panelSteps_${i}`}
                        header={(
                            <Grid container spacing={3}>
                                <Grid item xs={3} md={1}>
                                    {chip}
                                </Grid>
                                <Grid item xs={2} md={1}>
                                    <Tooltip
                                        id="editStepIcon"
                                        placement="top"
                                        title={resources.lblEdit}
                                    >
                                        <IconButton
                                            color="secondary"
                                            id={`iconButton_${i}|${step.stepNumber}`}
                                            onClick={onEditStepButton}
                                        >
                                            <Icon name="edit" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={6} md={5}>
                                    <Text>
                                        {step.stepTitle}
                                    </Text>
                                </Grid>
                                <Grid item xs={2} md={1}>
                                    <Tooltip
                                        id="upStepIcon"
                                        placement="top"
                                        title={resources.lblUp}
                                    >
                                        <IconButton
                                            color="secondary"
                                            id={`iconButtonUp|${step.stepNumber}`}
                                            onClick={onClickUpButton}
                                        >
                                            <Icon name="arrow-up" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={2} md={1}>
                                    <Tooltip
                                        id="downStepIcon"
                                        placement="top"
                                        title={resources.lblDown}
                                    >
                                        <IconButton
                                            color="secondary"
                                            id={`iconButtonDown|${step.stepNumber}`}
                                            onClick={onClickDownButton}
                                        >
                                            <Icon name="arrow-down" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        )}
                        onChange={onChangeExpansionPanel(i)}
                    >
                        <Table
                            classes={{ root: classes.table }}
                            id="tblFieldGroupsList"
                        >
                            <TableBody>
                                {tableBody}
                            </TableBody>
                        </Table>
                        <Grid
                            alignItems="center"
                            container
                            direction="column"
                            justifyContent="center"
                            key="GridAddComponent"
                            spacing={3}
                        >
                            <Grid item>
                                <br />
                                <br />
                                <Tooltip
                                    id="AddComponentIcon"
                                    placement="top"
                                    title={resources.lblAddNewComponent}
                                >
                                    <IconButton
                                        classes={{ root: classes.addStepIcon }}
                                        id={`iconAddComponent|${step.stepNumber}`}
                                        onClick={onClickAddComponent}
                                    >
                                        <Icon name="add" />
                                    </IconButton>
                                </Tooltip>
                            </Grid>
                        </Grid>
                    </ExpansionPanel>
                );
            });

            const tableFooterBody: JSX.Element[] = [];
            const tableConfirmationBody: JSX.Element[] = [];
            if (applicationForm.fieldsGroups) {
                applicationForm.fieldsGroups.forEach(fieldGroup => {
                    if (fieldGroup.id === 'footerGroup') {
                        fieldGroup.fields.sort(function (a, b) {
                            if (a.sortOrder > b.sortOrder) {
                                return 1;
                            }
                            if (a.sortOrder < b.sortOrder) {
                                return -1;
                            }
                            return 0;
                        }).forEach((field, i) => {
                            tableFooterBody.push(
                                <TableRow
                                    key={`footerRow_${i}`}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Tooltip
                                            id="EditFooterIcon"
                                            placement="top"
                                            title={resources.lblEdit}
                                        >
                                            <IconButton
                                                color="secondary"
                                                id={`iconEditFooterButton|${i}|${field.sortOrder}`}
                                                onClick={onEditFieldGroup}
                                            >
                                                <Icon name="edit" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        {field.id}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Tooltip
                                            id="UpFGIcon"
                                            placement="top"
                                            title={resources.lblUp}
                                        >
                                            <IconButton
                                                color="secondary"
                                                id={`iconFooterButtonUp|${i}|${field.sortOrder}`}
                                                onClick={onClickUpFieldGroupButton}
                                            >
                                                <Icon name="arrow-up" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Tooltip
                                            id="DownFGIcon"
                                            placement="top"
                                            title={resources.lblDown}
                                        >
                                            <IconButton
                                                color="secondary"
                                                id={`iconFooterButtonDown|${i}|${field.sortOrder}`}
                                                onClick={onClickDownFieldGroupButton}
                                            >
                                                <Icon name="arrow-down" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                        );
                    }
                    if (fieldGroup.id === 'confirmationGroup') {
                        fieldGroup.fields.sort(function (a, b) {
                            if (a.sortOrder > b.sortOrder) {
                                return 1;
                            }
                            if (a.sortOrder < b.sortOrder) {
                                return -1;
                            }
                            return 0;
                        }).forEach((field, i) => {
                            tableConfirmationBody.push(
                                <TableRow
                                    key={`confirmationRow_${i}`}
                                >
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Tooltip
                                            id="EditFooterIcon"
                                            placement="top"
                                            title={resources.lblEdit}
                                        >
                                            <IconButton
                                                color="secondary"
                                                id={`iconEditConfirmationButton|${i}|${field.sortOrder}`}
                                                onClick={onEditFieldGroup}
                                            >
                                                <Icon name="edit" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        {field.id}
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Tooltip
                                            id="UpFGIcon"
                                            placement="top"
                                            title={resources.lblUp}
                                        >
                                            <IconButton
                                                color="secondary"
                                                id={`iconConfirmationButtonUp|${i}|${field.sortOrder}`}
                                                onClick={onClickUpFieldGroupButton}
                                            >
                                                <Icon name="arrow-up" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                    <TableCell
                                        component="th"
                                        scope="row"
                                    >
                                        <Tooltip
                                            id="DownFGIcon"
                                            placement="top"
                                            title={resources.lblDown}
                                        >
                                            <IconButton
                                                color="secondary"
                                                id={`iconConfirmationButtonDown|${i}|${field.sortOrder}`}
                                                onClick={onClickDownFieldGroupButton}
                                            >
                                                <Icon name="arrow-down" />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            );
                        }
                        );
                    }
                });
            }

            steps.push(
                <>
                    <Grid
                        alignItems="center"
                        container
                        direction="column"
                        justifyContent="center"
                        key="GridAddStep"
                        spacing={3}
                    >
                        <Grid item>
                            <br />
                            <br />
                            <Tooltip
                                id="AddStepIcon"
                                placement="top"
                                title={resources.lblAddNewStep}
                            >
                                <IconButton
                                    classes={{ root: classes.addStepIcon }}
                                    id={'iconAddStep'}
                                    onClick={onClickAddNewStep}
                                >
                                    <Icon name="add" />
                                </IconButton>
                            </Tooltip>
                        </Grid>
                    </Grid>
                    <br />
                    <ExpansionPanel
                        background="gray"
                        id={'expansionPanel_footer'}
                        key={'panelSteps_footer'}
                        header={(
                            <Grid container spacing={3}>
                                <Grid item xs={8} md={5}>
                                    <Text>
                                        {resources.lblFooter}
                                    </Text>
                                </Grid>
                            </Grid>
                        )}
                    >
                        <Table
                            classes={{ root: classes.table }}
                            id="tblFooterTableList"
                        >
                            <TableBody>
                                {tableFooterBody}
                            </TableBody>
                        </Table>
                    </ExpansionPanel>
                    <ExpansionPanel
                        background="gray"
                        id={'expansionPanel_confirmation'}
                        key={'panelSteps_confirmation'}
                        header={(
                            <Grid container spacing={3}>
                                <Grid item xs={2} md={1}>
                                    <Tooltip
                                        id="editConfirmationIcon"
                                        placement="top"
                                        title={resources.lblEdit}
                                    >
                                        <IconButton
                                            color="secondary"
                                            id={'iconEditConfirmationButton'}
                                            onClick={onEditStepButton}
                                        >
                                            <Icon name="edit" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                                <Grid item xs={8} md={5}>
                                    <Text>
                                        {resources.lblConfirmationDialog}
                                    </Text>
                                </Grid>
                            </Grid>
                        )}
                    >
                        <Table
                            classes={{ root: classes.table }}
                            id="tblFooterTableList"
                        >
                            <TableBody>
                                {tableConfirmationBody}
                            </TableBody>
                        </Table>
                    </ExpansionPanel>
                </>
            );
        }

        saveButton = (
            <ButtonGroup id="btnGroupSave">
                <Button
                    id={'btnSave'}
                    onClick={onSave}
                >
                    {resources.btnSave}
                </Button>
            </ButtonGroup>
        );

        contentPage = (
            <>
                <Grid container spacing={3} classes={{root: classes.margin}}>
                    {pageHeader}
                </Grid>
                <br />
                <Card>
                    <CardContent>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                {steps}
                            </Grid>
                            <br />
                            <Grid item xs={12}>
                                {saveButton}
                            </Grid>
                        </Grid>
                    </CardContent>
                </Card>
            </>
        );
    }

    return (
        <>
            {contentPage}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AppSetupHandler);