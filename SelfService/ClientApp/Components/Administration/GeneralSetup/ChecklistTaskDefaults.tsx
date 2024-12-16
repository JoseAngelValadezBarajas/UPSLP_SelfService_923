/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ChecklistTaskDefaults.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableHead, TableBody, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

//Types
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { ITaskDefault, ITaskDefaultOffice } from '../../../Types/Checklist/IChecklistsTaskDefaults';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';
// #endregion Imports

// #region Types
export interface IChecklistTaskDefaultsProps {
    allExpanded: boolean;
    resources: IChecklistTaskDefaultsResProps;
    taskDefaultOffices?: ITaskDefaultOffice[]
    onAddTaskDefault: () => void;
    onChangeStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickDelete: (taskDefault: ITaskDefault) => void;
    onExpand: (iTaskDefaultOffice: number, expanded: boolean) => void;
    onExpandAll: (event: React.MouseEvent<HTMLButtonElement>) => void;

    // edit task
    onClikEditTask: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface IChecklistTaskDefaultsResProps {
    btnAccept: string;
    btnAdd: string;
    btnDecline: string;
    formatDeleteConfirmation: string;
    lblActive: string;
    lblConfirmationDialogTitle: string;
    lblCreated: string;
    lblDelete: string;
    lblInstructionsTaskDefaults: string;
    lblName: string;
    lblNoTaskDefaults: string;
    lblTaskDefaults: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '50%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '10%'
            }
        }
    }
}));

type PropsWithStyles = IChecklistTaskDefaultsProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const ChecklistTaskDefaults: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        allExpanded,
        classes,
        resources,
        taskDefaultOffices,
        onAddTaskDefault,
        onChangeStatus,
        onClickDelete,
        onExpand,
        onExpandAll,

        // edit task
        onClikEditTask
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    let taskDefaultsContent: JSX.Element;

    if (taskDefaultOffices && taskDefaultOffices.length > 0) {
        taskDefaultsContent = (
            <>
                {layoutResources && (
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Button
                                data-expanded={!allExpanded}
                                id="btnExpandCollapseAll"
                                variant="text"
                                onClick={onExpandAll}
                            >
                                {allExpanded ? layoutResources.lblCollapseAll : layoutResources.lblExpandAll}
                            </Button>
                        </Grid>
                    </Grid>
                )}
                <Grid container>
                    <Grid item xs={12}>
                        {taskDefaultOffices.map((office, iOffice) => {
                            const onExpandCallback = (_event: any, expanded: boolean) => {
                                onExpand(iOffice, expanded);
                            }

                            return (
                                <ExpansionPanel
                                    expanded={Boolean(office.expanded)}
                                    id={`epnlOffice_${iOffice}`}
                                    key={`epnlOffice_${iOffice}`}
                                    header={(
                                        <Text size="large" weight="strong">
                                            {office.officeDesc}
                                        </Text>
                                    )}
                                    onChange={onExpandCallback}
                                >
                                    <Table
                                        breakpoint="sm"
                                        classes={{ root: classes.table }}
                                        id={`lblTaskDefaultsOffice_${iOffice}`}
                                    >
                                        <TableHead>
                                            <TableRow>
                                                <TableCell component="th">
                                                    {resources.lblName}
                                                </TableCell>
                                                <TableCell component="th" align="center">
                                                    {resources.lblCreated}
                                                </TableCell>
                                                <TableCell component="th" align="center">
                                                    {resources.lblActive}
                                                </TableCell>
                                                <TableCell component="th" align="center">
                                                    {resources.lblDelete}
                                                </TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {office.actions.map((taskDefault, iTaskDefault) => {

                                                const onClickDeleteCallback = () => {
                                                    onClickDelete(taskDefault);
                                                }

                                                return (
                                                    <TableRow key={`tblRow_${iOffice}_${iTaskDefault}`}>
                                                        <TableCell
                                                            component="th"
                                                            scope="row"
                                                        >
                                                            <Button
                                                                TextProps={{
                                                                    weight: 'strong'
                                                                }}
                                                                align="left"
                                                                id={`btnEditTaskDefault_${taskDefault.checklistTemplateId}_${office.officeDesc}_${taskDefault.actionName}`}
                                                                textVariantStyling="inherit"
                                                                variant="text"
                                                                onClick={onClikEditTask}
                                                            >
                                                                {taskDefault.actionName}
                                                            </Button>
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            columnName={resources.lblCreated}
                                                        >
                                                            {taskDefault.createDate}
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            columnName={resources.lblActive}
                                                        >
                                                            <Switch
                                                                checked={taskDefault.isActive}
                                                                id={`swtStatus_${taskDefault.checklistTemplateId}_${iOffice}_${iTaskDefault}`}
                                                                loading={taskDefault.isSwitchLoading}
                                                                noPaddingBreakpoint='sm'
                                                                onChange={onChangeStatus}
                                                            />
                                                        </TableCell>
                                                        <TableCell
                                                            align="center"
                                                            columnName="&#8205;"
                                                        >
                                                            <IconButton
                                                                alt={resources.lblDelete}
                                                                color="gray"
                                                                onClick={onClickDeleteCallback}
                                                                id={`btnDelete_${taskDefault.checklistTemplateId}_${iOffice}_${iTaskDefault}`}
                                                            >
                                                                <Icon large name="trash" />
                                                            </IconButton>
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            })}
                                        </TableBody>
                                    </Table>
                                </ExpansionPanel>
                            )
                        })}
                    </Grid>
                </Grid>
            </>
        );
    }
    else {
        taskDefaultsContent = (
            <Grid container>
                <Grid item xs={12}>
                    <Illustration
                        color="secondary"
                        internalName="no-activities"
                        text={resources.lblNoTaskDefaults}
                    />
                </Grid>
            </Grid>
        );
    }

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Text size="h2" weight="strong">
                        {resources.lblTaskDefaults}
                    </Text>
                    <Divider noMarginBottom />
                </Grid>
                <Grid item xs>
                    <Text size="large">
                        {resources.lblInstructionsTaskDefaults}
                    </Text>
                </Grid>
            </Grid>
            <Grid container justifyContent="flex-end">
                <Grid item>
                    <Tooltip
                        id="tltAdd"
                        title={resources.btnAdd}
                        placement="top"
                    >
                        <IconButton
                            aria-label={resources.btnAdd}
                            onClick={onAddTaskDefault}
                            id="btnAddAddress"
                        >
                            <Icon name="add" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            {taskDefaultsContent}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ChecklistTaskDefaults);