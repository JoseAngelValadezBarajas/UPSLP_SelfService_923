/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: SaveSettings.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableBody, TableCell, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { ISaveSettings } from '../../../Types/Resources/Administration/ILayoutListResources';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import { isWidthDown, isWidthUp, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// #endregion Imports

// #region Types
export interface ISaveSettingsProps {
    confirmationMessage?: string;
    enableSaveApplication: boolean;
    saveMessage?: string;

    onClickEditSaveSettings: (event: any) => void;
    onEnableSaveApplication: (event: React.ChangeEvent<HTMLInputElement>) => void;

    resources: ISaveSettings;
}

const styles = (() => createStyles({
    table: {
        '& > tbody > tr > th:nth-child(1)': {
            width: '30%'
        },
        '& > tbody > tr > th:nth-child(2)': {
            width: '70%'
        }
    }
}));

type PropsWithStyles = WithStyles<typeof styles> & ISaveSettingsProps & WithWidth;
// #endregion Types

// #region Component
const SaveSettings: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        confirmationMessage,
        classes,
        enableSaveApplication,
        saveMessage,
        width,

        onClickEditSaveSettings,
        onEnableSaveApplication,

        resources
    } = props;

    let editButton: JSX.Element | undefined;
    if (isWidthDown('sm', width)) {
        editButton = (
            <Grid item xs={2} md={1}>
                <Tooltip
                    id="editNameIcon"
                    placement="top"
                    title={resources.lblEdit}
                >
                    <IconButton
                        color="secondary"
                        id={'iconButton_formName'}
                        onClick={onClickEditSaveSettings}
                    >
                        <Icon name="edit" />
                    </IconButton>
                </Tooltip>
            </Grid>
        );
    }

    let table: JSX.Element | undefined;
    table = (
        <Table
            classes={{ root: classes.table }}
            id="LayoutList"

        >
            <TableBody>
                <TableRow
                    key="SaveSettingsRow"
                >
                    <TableCell
                        columnName={resources.lblSaveMessage}
                        component="th"
                        scope="row"
                    >
                        {resources.lblSaveMessage}
                    </TableCell>
                    <TableCell
                        columnName={resources.lblConfirmationMessage}
                        component="th"
                        scope="row"
                    >
                        {saveMessage}
                    </TableCell>
                    {isWidthUp('sm', width) ?
                        (
                            <TableCell
                                columnName={resources.lblEdit}
                                component="th"
                                scope="row"
                            >
                                <Link
                                    id="editLink"
                                    onClick={onClickEditSaveSettings}
                                >
                                    {resources.lblEdit}
                                </Link>
                            </TableCell>
                        )
                        : undefined}
                </TableRow>
                <TableRow
                    key="SaveSettingsRowConfirmation"
                >
                    <TableCell
                        columnName={resources.lblConfirmationMessage}
                        component="th"
                        scope="row"
                    >
                        {resources.lblConfirmationMessage}
                    </TableCell>
                    <TableCell
                        columnName={resources.lblConfirmationMessage}
                        component="th"
                        scope="row"
                    >
                        {confirmationMessage}
                    </TableCell>
                    {isWidthUp('sm', width) ?
                        (
                            <TableCell
                                columnName={resources.lblEdit}
                                component="th"
                                scope="row"
                            >
                                <Link
                                    id="editLink"
                                    onClick={onClickEditSaveSettings}
                                >
                                    {resources.lblEdit}
                                </Link>
                            </TableCell>
                        )
                        : undefined}
                </TableRow>
            </TableBody>
        </Table>
    );

    let content: JSX.Element | undefined;
    content = (
        <>
            <Grid container spacing={3}>
                <Grid item md={6} lg={9}>
                    <Switch
                        id={'enableSaveSwitch'}
                        checked={enableSaveApplication}
                        label={resources.lblEnableSave}
                        onChange={onEnableSaveApplication}
                    />
                </Grid>
            </Grid>
            {enableSaveApplication ?
                (
                    <>
                        <Grid
                            alignItems="flex-end"
                            container
                            direction="column"
                            justifyContent="flex-end"
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                {editButton}
                            </Grid>
                        </Grid>
                        <Grid container spacing={3}>

                            <Grid item xs={12}>
                                {table}
                            </Grid>
                        </Grid>
                    </>
                ) :
                undefined}
        </>
    );

    return (
        <>
            {content}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(withWidth()(SaveSettings));