/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: OfficesSetupEditModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableHead, TableBody, TableCell, TableRow, TableExpandableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IOfficePermission } from '../../../Types/Administration/IOfficePermission';
import { IStaffMember } from '../../../Types/Administration/IStaffMember';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// #endregion Imports

// #region Types
export interface IOfficesSetupEditModalProps {
    isLoadingPermissions: boolean;
    officePermissions: IOfficePermission[];
    officeSelected: IDropDownOption;
    open: boolean;
    resources: IOfficesSetupEditModalResProps;
    staffMember: IStaffMember;
    onChangeSwitch: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onDelete: (permission: IOfficePermission) => void;
    onDeleteAll: () => void;
}

export interface IOfficesSetupEditModalResProps {
    btnCancel: string;
    btnDelete: string;
    btnDeleteAll: string;
    formatConfirmDelete: string;
    formatConfirmDeleteAll: string;
    formatDeleteOffice: string;
    formatEditingName: string;
    lblActions: string;
    lblDelete: string;
    lblDeleteAllTitle: string;
    lblEditTasks: string;
    lblOffice: string;
    lblViewNotes: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '45%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(4)': {
                width: '15%'
            }
        }
    },
    iconLeftSpacing: {
        [theme.breakpoints.down('sm')]: {
            marginLeft: Tokens.spacing30,
            paddingLeft: Tokens.spacing20
        }
    },
    rowSelected: {
        borderLeft: `${Tokens.spacing30} solid ${theme.palette.secondary.main} ${Tokens.important}`
    }
}));

type PropsWithStyles = IOfficesSetupEditModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const OfficesSetupEditModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        isLoadingPermissions,
        officePermissions,
        officeSelected,
        open,
        resources,
        staffMember,
        onChangeSwitch,
        onClose,
        onDelete,
        onDeleteAll
    } = props;

    return (
        <Modal
            footer={(
                <Button
                    color="secondary"
                    disabled={isLoadingPermissions}
                    IconProps={{
                        name: 'trash'
                    }}
                    id={`btnDeleteAll_${staffMember.personId}`}
                    onClick={onDeleteAll}
                >
                    {resources.btnDeleteAll}
                </Button>
            )}
            id="editStaffModal"
            header={Format.toString(resources.formatEditingName, [staffMember.fullName])}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12}>
                    {isLoadingPermissions ? (<ContainerLoader id="ldrPermissionsTable" height="sm" />) : (
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
                                    <TableCell component="th" align="center">
                                        <Text weight="strong">
                                            {resources.lblActions}
                                        </Text>
                                    </TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {officePermissions.map((permission, iPermission) => {

                                    const onDeleteCallback = () => {
                                        onDelete(permission);
                                    }

                                    return (
                                        <TableExpandableRow
                                            key={`tblRow_${iPermission}`}
                                            TableRowProps={permission.officeId == officeSelected.value ? {
                                                classes: { root: classes.rowSelected }
                                            } : undefined}
                                        >
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                {permission.officeDesc}
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                columnName={resources.lblViewNotes}
                                            >
                                                <Switch
                                                    checked={permission.canViewNotes}
                                                    id={`swtViewNotes_${permission.staffMemberId}`}
                                                    loading={permission.isSwitchViewNotesLoading}
                                                    noPaddingBreakpoint="sm"
                                                    onChange={onChangeSwitch}
                                                />
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                columnName={resources.lblEditTasks}
                                            >
                                                <Switch
                                                    checked={permission.canEditTasks}
                                                    id={`swtEditTasks_${permission.staffMemberId}`}
                                                    loading={permission.isSwitchEditTasksLoading}
                                                    noPaddingBreakpoint="sm"
                                                    onChange={onChangeSwitch}
                                                />
                                            </TableCell>
                                            <TableCell
                                                align="center"
                                                columnName={resources.lblDelete}
                                            >
                                                <Tooltip
                                                    id="tltDelete"
                                                    title={resources.btnDelete}
                                                    placement="top"
                                                >
                                                    <IconButton
                                                        alt={resources.btnDelete}
                                                        classes={{ root: classes.iconLeftSpacing }}
                                                        color="gray"
                                                        id={`btnDelete_${permission.officeId}`}
                                                        onClick={onDeleteCallback}
                                                    >
                                                        <Icon large name="trash" />
                                                    </IconButton>
                                                </Tooltip>
                                            </TableCell>
                                        </TableExpandableRow>
                                    )
                                })}
                            </TableBody>
                        </Table>
                    )}
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(OfficesSetupEditModal);