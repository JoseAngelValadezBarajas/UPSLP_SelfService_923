/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AlertsTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// Types
import { ISectionViolation } from '../../../Types/Section/ISectionViolation';
// #endregion

// #region Internal types
export interface IAlertsTableProps {
    alerts: ISectionViolation[];
    checkboxHeader: boolean;
    resources: IAlertsTableResProps;
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onOpenAlertModal: (violationId: number, studentPosition: number) => void;
}

export interface IAlertsTableResProps {
    formatSelectStudent: string;
    lblAlert: string;
    lblCategory: string;
    lblDate: string;
    lblName: string;
    lblWithdrawn: string;
}

const styles = ((theme: Theme) => createStyles({
    listTyle: {
        [theme.breakpoints.down('sm')]: {
            display: 'block!important'
        },
        listStyleType: 'none',
        margin: 0,
        padding: 0
    },
    nameStyle: {
        marginBottom: Tokens.spacing40,
        marginTop: Tokens.spacing40
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '40%'
            }
        }
    }
}));

type PropsWithStyles = IAlertsTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AlertsTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        alerts,
        classes,
        resources,
        onChangeCheckbox,
        onOpenAlertModal
    } = props;

    const onClickAlert = (event: React.MouseEvent<HTMLAnchorElement>): void => {
        const ids: string[] = event.currentTarget.id.split('_');
        if (ids.length > 0) {
            onOpenAlertModal(Number(ids[1]), Number(ids[2]));
        }
    };

    return (
        <Table
            breakpoint="sm"
            classes={{ root: classes.table }}
            id="tblAlerts"
            variant="expansionPanels"
        >
            <TableHead>
                <TableRow>
                    <TableCell component="th">
                        {resources.lblName}
                    </TableCell>
                    <TableCell component="th">
                        {resources.lblAlert}
                    </TableCell>
                    <TableCell component="th">
                        {resources.lblDate}
                    </TableCell>
                    <TableCell />
                </TableRow>
            </TableHead>
            <TableBody>
                {alerts.map((row, i) =>
                    (
                        row.violationList.length > 0 ?
                            <TableExpandableRow key={`rowAlert_${i}`}>
                                <TableCell
                                    component="th"
                                    scope="row"
                                >
                                    <AvatarText
                                        CheckboxProps={{
                                            checked: Boolean(row.checkbox),
                                            id: `chkAlert_${row.personId}_${i}`,
                                            inputProps: {
                                                'aria-label': Format.toString(resources.formatSelectStudent, [row.fullName])
                                            },
                                            onChange: onChangeCheckbox
                                        }}
                                        avatarInfo={row}
                                        complement={row.withdrawn ? (
                                            <StatusLabel
                                                id={`stsLbl_${i}_${row.personId}`}
                                                text={resources.lblWithdrawn}
                                                type="draft"
                                            />
                                        ) : undefined}
                                    />
                                </TableCell>
                                <TableCell
                                    columnName={resources.lblCategory}
                                >
                                    <ul className={classes.listTyle}>
                                        {row.violationCategoryList.map((category, j) => (
                                            <>
                                                {row.violationList.map((alert, k) => (
                                                    <li
                                                        className={classes.nameStyle}
                                                        key={`category_${i}_${j}_${k}`}
                                                    >
                                                        {alert.violationCategoryId === category.violationCategoryId ?
                                                            <Button
                                                                align="left"
                                                                id={`alert_${alert.violationId}_${i}_${j}_${k}`}
                                                                textVariantStyling="inherit"
                                                                variant="text"
                                                                onClick={onClickAlert}
                                                            >
                                                                {`${category.violationCategory} - ${alert.violationType}`}
                                                            </Button>
                                                            : undefined}
                                                    </li>
                                                ))}
                                            </>
                                        ))}
                                    </ul>
                                </TableCell>
                                <TableCell
                                    columnName={resources.lblDate}
                                >
                                    <ul className={classes.listTyle}>
                                        {row.violationList.map((alert, j) => (
                                            <li
                                                className={classes.nameStyle}
                                                key={`alertDate_${j}`}
                                            >
                                                {alert.violationDateTable}
                                            </li>
                                        ))}
                                    </ul>
                                </TableCell>
                            </TableExpandableRow>
                            : undefined
                    ))}
            </TableBody>
        </Table>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AlertsTable);