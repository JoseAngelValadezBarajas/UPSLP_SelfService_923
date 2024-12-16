/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AuthorizeAdviseesTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { UserCheck, UserSlash } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Types
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAdviseeClaimSetting } from '../../../Types/Advisees/IAdviseeClaimSetting';
import { IAuthorizeAdviseesList } from '../../../Types/Advisees/IAuthorizeAdviseesList';
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
// #endregion Imports

// #region Types
export interface IAuthorizeAdviseesTableProps {
    adviseesList: IAuthorizeAdviseesList;
    adviseeClaimSetting: IAdviseeClaimSetting;
    checkboxHeader: boolean;
    isAdviseeSelected: boolean;
    isAuthorizable: boolean;
    isUnauthorizable: boolean;
    numberCulture: string;
    page: number;
    periods: IDropDownOption[];
    periodSelected: number;
    resources: IAuthorizeAdviseesTableResProps;
    rowsPerPage: number;
    onChangeChkbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeChkboxAll: () => void;
    onChangeDropdown: (option: IDropDownOption, id: string) => void;
    onClickAuthorize: () => void;
    onClickUnauthorize: () => void;
    onOpenEmailModal: (emailAddresses: string[]) => void
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IAuthorizeAdviseesTableResProps {
    formatSelectAdvisee: string;
    formatResultsShowing: string;
    lblAuthorization: string;
    lblAuthorize: string;
    lblAuthorized: string;
    lblEmailSelected: string;
    lblId: string;
    lblName: string;
    lblPeriod: string;
    lblStopList: string;
    lblUnauthorize: string;
    lblUnauthorized: string;
}

const styles = ((theme: Theme) => createStyles({
    checkboxHeader: {
        [theme.breakpoints.up('md')]: {
            marginLeft: `${Tokens.spacing35}!important`
        }
    },
    error: {
        alignItems: 'center',
        background: Tokens.colorFillAlertError,
        borderRadius: Tokens.borderRadiusCircle,
        color: 'white',
        display: 'inline-flex',
        height: '1.8125rem',
        justifyContent: 'center',
        marginLeft: Tokens.spacing30,
        verticalAlign: 'middle',
        width: '1.8125rem'
    },
    errorMobile: {
        background: Tokens.colorFillAlertError,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginRight: Tokens.spacing20,
        verticalAlign: 'middle',
        width: Tokens.spacing40
    },
    formatResult: {
        marginLeft: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        verticalAlign: 'middle'
    },

    iconHeader: {
        display: 'inline',
        marginRight: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    mobileContainer: {
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing30
    },
    mobileContainerAuth: {
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing40
    },
    mobileContainerAvatar: {
        paddingRight: Tokens.spacing40
    },
    statusLabel: {
        margin: Tokens.spacing20,
        verticalAlign: 'middle'
    },
    table: {
        '& > tbody > tr > td:nth-child(1)': {
            [theme.breakpoints.up('md')]: {
                width: '85%'
            }
        }
    }
}));

type PropsWithStyles = IAuthorizeAdviseesTableProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const AuthorizeAdviseesTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        adviseesList,
        adviseeClaimSetting,
        checkboxHeader,
        classes,
        isAdviseeSelected,
        isAuthorizable,
        isUnauthorizable,
        numberCulture,
        page,
        periods,
        periodSelected,
        resources,
        rowsPerPage,
        onChangeChkbox,
        onChangeChkboxAll,
        onChangeDropdown,
        onClickAuthorize,
        onClickUnauthorize,
        onOpenEmailModal,
        onViewDossier
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    let firstRow: number = page * rowsPerPage + 1;
    let lastRow: number = page * rowsPerPage + rowsPerPage;
    const totalRows: number = adviseesList ? adviseesList.overallCount : 0;
    if (lastRow > totalRows) {
        lastRow = totalRows;
    }
    if (firstRow > lastRow) {
        firstRow = lastRow;
    }

    const onClickEmail = (): void => {
        const emails: string[] = [];
        adviseesList.advisees.forEach(status => {
            if (status.checkbox && status.email) {
                emails.push(status.email);
            }
        });

        if (adviseeClaimSetting.emailSettings.emailProvider === EmailProviderOption.External) {
            window.open(Format.toString(adviseeClaimSetting.emailSettings.staffUrl, [emails.join(adviseeClaimSetting.emailSettings.staffSeparator)]),
                adviseeClaimSetting.emailSettings.staffUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
        }
        else {
            onOpenEmailModal(emails);
        }
    };

    return (
        <>
            <Grid container>
                <Grid item xs>
                    <Grid container alignItems="center">
                        <Grid item xs={12} sm={4} md={3}>
                            <Dropdown
                                id="ddlAuhtorizePeriods"
                                label={resources.lblPeriod}
                                options={periods}
                                value={periodSelected}
                                onChange={onChangeDropdown}
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            <Grid container alignItems="center" justifyContent="space-between" >
                <Grid item>
                    <Checkbox
                        checked={checkboxHeader || isAdviseeSelected}
                        classes={{
                            focused: classes.checkboxHeader,
                            root: classes.checkboxHeader
                        }}
                        id="chkSelectAll"
                        indeterminate={!checkboxHeader && isAdviseeSelected}
                        inputProps={{
                            'aria-label': layoutResources?.lblSelectAll
                        }}
                        onChange={onChangeChkboxAll}
                    />
                    <Tooltip
                        id="tltEmailSelected"
                        title={resources.lblEmailSelected}
                        placement="bottom-start"
                    >
                        <div className={classes.inline}>
                            <IconButton
                                aria-label={resources.lblEmailSelected}
                                classes={{ root: classes.iconHeader }}
                                color="secondary"
                                disabled={!isAdviseeSelected}
                                id="EmailSelectedBtn"
                                onClick={onClickEmail}
                            >
                                <Icon large name="email" />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Tooltip
                        id="tltAuthorize"
                        placement="bottom-start"
                        title={resources.lblAuthorize}
                    >
                        <div className={classes.inline}>
                            <IconButton
                                aria-label={resources.lblAuthorize}
                                classes={{ root: classes.iconHeader }}
                                color="secondary"
                                disabled={!isAuthorizable}
                                id="AuthorizeBtn"
                                onClick={onClickAuthorize}
                            >
                                <UserCheck />
                            </IconButton>
                        </div>
                    </Tooltip>
                    <Tooltip
                        id="tltUnauthorize"
                        placement="bottom-start"
                        title={resources.lblUnauthorize}
                    >
                        <div className={classes.inline}>
                            <IconButton
                                aria-label={resources.lblUnauthorize}
                                classes={{ root: classes.iconHeader }}
                                color="secondary"
                                disabled={!isUnauthorizable}
                                id="UnauthorizeBtn"
                                onClick={onClickUnauthorize}
                            >
                                <UserSlash />
                            </IconButton>
                        </div>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Text
                        display="inline"
                        id="txtFormatResults"
                        className={classes.formatResult}
                    >
                        {Format.toString(resources.formatResultsShowing,
                            [firstRow.toLocaleString(numberCulture), lastRow.toLocaleString(numberCulture), totalRows.toLocaleString(numberCulture)])}
                    </Text>
                </Grid>
            </Grid>
            <Hidden mdUp>
                <Divider />
            </Hidden>
            <Table
                classes={{ root: classes.table }}
                breakpoint="sm"
                id="tblAdvising"
            >
                <TableHead>
                    <TableRow>
                        <TableCell component="th">
                            {resources.lblName}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblAuthorization}
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {adviseesList.advisees.map((row, i) => (
                        <TableRow key={`row_${i}`}>
                            <Hidden smDown>
                                <TableCell
                                    scope="row"
                                >
                                    <AvatarText
                                        ButtonProps={adviseeClaimSetting.hasDossierClaim ? {
                                            'data-id': row.personId,
                                            id: `btnAdvisee_${row.personId}_${i}`,
                                            onClick: onViewDossier
                                        } : undefined}
                                        CheckboxProps={{
                                            checked: Boolean(row.checkbox),
                                            id: `chkAdvisee_${row.personId}_${i}`,
                                            inputProps: {
                                                'aria-label': Format.toString(resources.formatSelectAdvisee, [row.fullName])
                                            },
                                            onChange: onChangeChkbox
                                        }}
                                        avatarInfo={row}
                                    />
                                </TableCell>
                                <TableCell>
                                    <StatusLabel
                                        className={classes.statusLabel}
                                        id="stsLblAuthorization"
                                        text={row.registrationAuthorizationId
                                            ? resources.lblAuthorized : resources.lblUnauthorized}
                                        type={row.registrationAuthorizationId ? 'success' : 'default'}
                                    />
                                    {row.hasStopList ? (
                                        <StatusLabel
                                            className={classes.statusLabel}
                                            id="stsLblStopList"
                                            text={resources.lblStopList}
                                            type={'error'}
                                        />
                                    ) : undefined}
                                </TableCell>
                            </Hidden>
                            <Hidden mdUp>
                                <TableCell
                                    scope="row"
                                >
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <Grid
                                                container
                                                alignItems="center"
                                                className={classes.mobileContainerAvatar}
                                            >
                                                <Grid item xs={11}>
                                                    <AvatarText
                                                        ButtonProps={{
                                                            'data-id': row.personId,
                                                            id: `btnAdviseeAvatar_${row.personId}_${i}`,
                                                            onClick: onViewDossier
                                                        }}
                                                        CheckboxProps={adviseeClaimSetting.hasDossierClaim ? {
                                                            checked: Boolean(row.checkbox),
                                                            id: `chkAdviseeAvatar_${row.personId}_${i}`,
                                                            onChange: onChangeChkbox
                                                        } : undefined}
                                                        avatarInfo={row}
                                                    />
                                                </Grid>
                                            </Grid>
                                            <Grid
                                                container
                                                className={classes.mobileContainerAuth}
                                            >
                                                <Grid item>
                                                    <StatusLabel
                                                        className={classes.statusLabel}
                                                        id="stsLblAuthorization"
                                                        text={row.registrationAuthorizationId
                                                            ? resources.lblAuthorized : resources.lblUnauthorized}
                                                        type={row.registrationAuthorizationId ? 'success' : 'default'}
                                                    />
                                                </Grid>
                                                {row.hasStopList ? (
                                                    <Grid item>
                                                        <StatusLabel
                                                            className={classes.statusLabel}
                                                            id="stsLblStopList"
                                                            text={resources.lblStopList}
                                                            type={'error'}
                                                        />
                                                    </Grid>
                                                ) : undefined}
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </Hidden>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(AuthorizeAdviseesTable);