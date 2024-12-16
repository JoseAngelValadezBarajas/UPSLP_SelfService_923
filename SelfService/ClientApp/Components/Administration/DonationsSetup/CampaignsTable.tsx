/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: CampaignsTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Illustration from '@hedtech/powercampus-design-system/react/core/Illustration';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { IInstitutionSettingFilter } from '../../../Types/InstitutionSettings/IInstitutionSettingFilter';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface ICampaignsTableProps {
    campaigns?: IInstitutionSettingFilter[];
    pcCampaigns: IDropDownOption[];
    resources: ICampaignsTableResProps;
    onAdd: () => void;
    onDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface ICampaignsTableResProps {
    btnAdd: string;
    lblEmptyCampaigns: string;
    lblName: string;
    lblRemove: string;
}

const styles = ((theme: Theme) => createStyles({
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '90%'
            }
        }
    }
}));
type PropsWithStyles = ICampaignsTableProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const CampaignsTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        campaigns,
        classes,
        resources,
        onAdd,
        onDelete
    } = props;

    return (
        <Grid container justifyContent="flex-end">
            <Grid item>
                <Tooltip
                    id="tltAdd"
                    title={resources.btnAdd}
                    placement="top"
                >
                    <IconButton
                        aria-label={resources.btnAdd}
                        onClick={onAdd}
                        id="btnAddCampaign"
                    >
                        <Icon name="add" />
                    </IconButton>
                </Tooltip>
            </Grid>
            <Grid item xs={12}>
                {campaigns && campaigns.length > 0 ? (
                    <Table
                        classes={{ root: classes.table }}
                        breakpoint="sm"
                        id="tblCampaigns"
                    >
                        <TableHead>
                            <TableRow>
                                <TableCell component="th">
                                    <span>
                                        {resources.lblName}
                                    </span>
                                </TableCell>
                                <TableCell component="th">
                                    <span>
                                        {resources.lblRemove}
                                    </span>
                                </TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {campaigns.map((row, i) => (
                                <TableRow key={`campaign_${i}`}>
                                    <TableCell
                                        columnName={resources.lblName}
                                        scope="row"
                                    >
                                        {row.description}
                                    </TableCell>
                                    <TableCell
                                        columnName={resources.lblRemove}
                                        scope="row"
                                    >
                                        <IconButton
                                            color="gray"
                                            id={`btnRemoveCampaign_${i}`}
                                            data-id={i}
                                            onClick={onDelete}
                                            aria-label={resources.lblRemove}
                                        >
                                            <Icon name="trash" />
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                        <Illustration
                            color="secondary"
                            internalName="no-activities"
                            text={resources.lblEmptyCampaigns}
                        />
                    )}
            </Grid>
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(CampaignsTable);