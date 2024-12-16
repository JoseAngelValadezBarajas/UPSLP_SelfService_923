/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AreasListTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
// import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { INotificationsEvents } from '../../../Types/Notifications/INotificationsEvents';
import { INotificationsSetupResources } from '../../../Types/Resources/Administration/INotificationsSetupResources';

// #endregion

// #region Internal types
export interface IAreasListTableProps {
    areasList: INotificationsEvents;
    index: number;
    onChangeEnable: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickSetup?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resources: INotificationsSetupResources;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:nth-child(1)': {
                width: '25%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '40%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '15%'
            }
        }
    }
}));

type PropsWithStyles = IAreasListTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AreasListTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        areasList,
        index,
        classes,
        onChangeEnable,
        onClickSetup,

        resources
    } = props;

    let content: JSX.Element | undefined;
    content = (
        <>
            <br />
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id={`tblAreasListTable_${index}`}
                variant="expansionPanels"
            >
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {resources.lblMessage}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblDescription}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblEnable}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblTypes}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {areasList.notificationEvents.map((event, i) => (
                        <TableExpandableRow key={`areasList_${i}_${index}`}>
                            <TableCell columnName={resources.lblMessage}>
                                <Tooltip
                                    id={`setupAreas_${i}_${index}`}
                                    title={resources.lblSetup}
                                    aria-label={resources.lblSetup}
                                >
                                    <Link
                                        id={`lnkAreasList_${i}_${index}_${event.eventId}_${areasList.areaName}`}
                                        onClick={onClickSetup}
                                    >
                                        {event.eventName}
                                    </Link>
                                </Tooltip>
                            </TableCell>
                            <TableCell columnName={resources.lblDescription}>
                                {event.eventDescription}
                            </TableCell>
                            <TableCell columnName={resources.lblEnable}>
                                <Switch
                                    checked={event.isActive}
                                    id={`swt_${index}_${event.eventId}_${i}`}
                                    onChange={onChangeEnable}
                                />
                            </TableCell>
                            <TableCell columnName={resources.lblTypes}>
                                {event.eventTypes.map(type => (
                                    type
                                ))}
                            </TableCell>
                        </TableExpandableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );

    return (
        <>
            {content}
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AreasListTable);