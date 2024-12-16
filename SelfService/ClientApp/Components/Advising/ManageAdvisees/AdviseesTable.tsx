/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AdviseesTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { HandPaper, UserFriends } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Table, { TableBody, TableCell, TableExpandableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import AdviseesContent, { IAdviseesContentResProps } from './AdviseesContent';
import AdviseesWarnings from './AdviseesWarnings';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Types
import { AdviseeList } from '../../../Types/Enum/AdviseeList';
import { EmailProviderOption } from '../../../Types/Enum/EmailProviderOption';
import { IAdviseeClaimSetting } from '../../../Types/Advisees/IAdviseeClaimSetting';
import { IAdviseesPermissions } from '../../../Types/Permissions/IAdviseesPermissions';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IManageAdviseesList } from '../../../Types/Advisees/IManageAdviseesList';
// #endregion

// #region Internal types
export interface IAdviseesTableProps {
    adviseeClaimSetting: IAdviseeClaimSetting;
    adviseesList: IManageAdviseesList;
    checkboxHeader: boolean;
    id: string;
    isAdviseeSelected: boolean;
    numberCulture: string;
    page: number;
    permissions: IAdviseesPermissions;
    resources: IAdviseesTableResProps;
    rowsPerPage: number;
    listOptionSelected: number;
    onAbortRequest: () => void;
    onChangeChkbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeChkHeader: () => void;
    onClickGetAdvisors: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    onClickRemove: () => void;
    onClickShareAdvisee: () => void;
    onDownloadModal: () => void;
    onOpenEmailModal: (emailAddresses: string[]) => void
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IAdviseesTableResProps {
    adviseesContent: IAdviseesContentResProps;
    btnRemoveSelected: string;
    formatSelectAdvisee: string;
    formatResultsShowing: string;
    lblAuthorizeRegistration: string;
    lblDownload: string;
    lblEmailSelected: string;
    lblSchedule: string;
    lblScheduleRequest: string;
    lblShareAdvisees: string;
    lblShared: string;
    lblStopList: string;
    lblWarning: string;
}

const styles = (theme: Theme) => createStyles({
    checkboxHeader: {
        marginLeft: `${Tokens.spacing35}!important`
    },
    divider: {
        backgroundColor: 'rgba(0,0,0,0.12)'
    },
    error: {
        alignItems: 'center',
        background: Tokens.colorFillAlertError,
        borderRadius: Tokens.borderRadiusCircle,
        color: 'white',
        display: 'inline-flex',
        height: '1.8125rem',
        justifyContent: 'center',
        marginRight: Tokens.spacing30,
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
        marginLeft: Tokens.spacing30
    },
    infoMobile: {
        background: Tokens.colorCtaBlueBase,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginRight: Tokens.spacing20,
        verticalAlign: 'middle',
        width: Tokens.spacing40
    },
    inline: {
        display: 'inline'
    },
    share: {
        alignItems: 'center',
        background: Tokens.colorCtaBlueBase,
        borderRadius: Tokens.borderRadiusCircle,
        color: 'white',
        display: 'inline-flex',
        height: '1.8125rem',
        justifyContent: 'center',
        marginRight: Tokens.spacing30,
        verticalAlign: 'middle',
        width: '1.8125rem'
    },
    successMobile: {
        background: Tokens.colorFillAlertSuccess,
        borderRadius: Tokens.borderRadiusCircle,
        display: 'inline-flex',
        height: Tokens.spacing40,
        marginRight: Tokens.spacing20,
        verticalAlign: 'middle',
        width: Tokens.spacing40
    },
    tableCell: {
        '& > tbody > tr > td:not([data-actionmenu]):nth-child(n+3)': {
            width: Tokens.spacing50
        },
        [theme.breakpoints.only('md')]: {
            '& > tbody > tr > td:not([data-actionmenu]):nth-child(n+2)': {
                width: Tokens.spacing50
            }
        }
    },
    paddingRight: {
        paddingRight: Tokens.sizingXSmall,
    }
});

type PropsWithStyles = IAdviseesTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const AdviseesTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        adviseesList,
        adviseeClaimSetting,
        checkboxHeader,
        classes,
        id,
        isAdviseeSelected,
        numberCulture,
        page,
        permissions,
        rowsPerPage,
        listOptionSelected,
        resources,
        onAbortRequest,
        onChangeChkbox,
        onChangeChkHeader,
        onClickGetAdvisors,
        onClickRemove,
        onClickShareAdvisee,
        onDownloadModal,
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
        adviseesList.advisees.forEach(advisee => {
            if (advisee.checkbox && advisee.email) {
                emails.push(advisee.email);
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
                        onChange={onChangeChkHeader}
                    />
                    <Tooltip
                        id="tltEmailSelected"
                        placement="top"
                        title={resources.lblEmailSelected}
                    >
                        <div className={classes.inline}>
                            <IconButton
                                aria-label={resources.lblEmailSelected}
                                classes={{ root: classes.iconHeader }}
                                color="secondary"
                                disabled={!isAdviseeSelected}
                                onClick={onClickEmail}
                                id="EmailSelectedBtn"
                            >
                                <Icon large name="email" />
                            </IconButton>
                        </div>
                    </Tooltip>
                    {adviseeClaimSetting.hasShareClaim && (
                        <Tooltip
                            id="tltShareAdvisees"
                            title={resources.lblShareAdvisees}
                            placement="top"
                        >
                            <div className={classes.inline}>
                                <IconButton
                                    aria-label={resources.lblShareAdvisees}
                                    classes={{ root: classes.iconHeader }}
                                    color="secondary"
                                    disabled={!isAdviseeSelected}
                                    onClick={onClickShareAdvisee}
                                    id="ShareAdviseesBtn"
                                >
                                    <Icon large name="share" />
                                </IconButton>
                            </div>
                        </Tooltip>
                    )}
                    {listOptionSelected === AdviseeList.mySharedAdvisees && (
                        <Tooltip
                            id="tltRemoveSelected"
                            placement="top"
                            title={resources.btnRemoveSelected}
                        >
                            <div className={classes.inline}>
                                <IconButton
                                    aria-label={resources.btnRemoveSelected}
                                    classes={{ root: classes.iconHeader }}
                                    color="secondary"
                                    disabled={!isAdviseeSelected}
                                    onClick={onClickRemove}
                                    id="btnRemoveSelected"
                                >
                                    <Icon large name="trash" />
                                </IconButton>
                            </div>
                        </Tooltip>
                    )}
                </Grid>
                <Grid item>
                    {permissions.download && (
                        <>
                            <Hidden xsDown>
                                <Button
                                    IconProps={{
                                        name: 'download'
                                    }}
                                    id="download"
                                    align="left"
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onDownloadModal}
                                >
                                    {resources.lblDownload}
                                </Button>
                            </Hidden>
                            <Hidden smUp>
                                <Tooltip
                                    id="tltDownload"
                                    title={resources.lblDownload}
                                    placement="top"
                                >
                                    <div className={classes.inline}>
                                        <IconButton
                                            aria-label={resources.lblDownload}
                                            classes={{ root: classes.iconHeader }}
                                            color="secondary"
                                            onClick={onDownloadModal}
                                            id="downloadBtn"
                                        >
                                            <Icon large name="download" />
                                        </IconButton>
                                    </div>
                                </Tooltip>
                            </Hidden>
                        </>
                    )}
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
            <Divider classes={{ root: classes.divider }} noMarginBottom />
            <Table
                breakpoint="sm"
                classes={{ root: classes.tableCell }}
                id={id}
                variant="expansionPanels"
            >
                <TableBody>
                    {adviseesList.advisees.map((row, i) =>
                    (
                        <TableExpandableRow
                            key={`row_${i}`}
                            expandedRowContent={
                                (
                                    <AdviseesContent
                                        hasAttendanceClaim={adviseeClaimSetting.hasAttendanceClaim}
                                        hasGradeReportClaim={adviseeClaimSetting.hasGradeReportClaim}
                                        hasScheduleClaim={adviseeClaimSetting.hasScheduleClaim}
                                        hasProfileClaim={adviseeClaimSetting.hasProfileClaim}
                                        hasScheduleRequestsClaim={adviseeClaimSetting.hasScheduleRequestsClaim}
                                        hasPendingSchedule={row.hasPendingSchedules}
                                        hasStopList={row.hasStopList}
                                        id={i}
                                        isSharedAdvisee={row.isSharedAdvisee}
                                        key={`adviseeContent_${i}`}
                                        personId={row.personId}
                                        resources={resources.adviseesContent}
                                        showAttendanceWarning={adviseesList.showAttendanceWarning}
                                        showGradesWarning={adviseesList.showGradesWarning}
                                        showViolationWarning={adviseesList.showViolationWarning}
                                        listOptionSelected={listOptionSelected}
                                        warnings={row.warnings}
                                        onAbortPrevRequest={onAbortRequest}
                                        onClickGetAdvisors={onClickGetAdvisors}
                                    />
                                )
                            }
                        >
                            <Hidden mdUp>
                                <TableCell
                                    scope="row"
                                >
                                    <Grid container spacing={1} alignItems="center" justifyContent="space-between">
                                        <Grid item xs={8} sm={6}>
                                            <AvatarText
                                                ButtonProps={adviseeClaimSetting.hasDossierClaim ? {
                                                    'data-id': row.personId,
                                                    id: `btnAdvisee_${row.personId}_${i}`,
                                                    onClick: onViewDossier
                                                } : undefined}
                                                CheckboxProps={{
                                                    checked: Boolean(adviseesList.advisees[i].checkbox),
                                                    id: `chkAdvisee_${row.personId}_${i}`,
                                                    inputProps: {
                                                        'aria-label': Format.toString(resources.formatSelectAdvisee, [row.fullName])
                                                    },
                                                    onChange: onChangeChkbox
                                                }}
                                                avatarInfo={row}
                                                id={`Advisee_${row.personId}_${i}`}
                                            />
                                        </Grid>
                                        <Hidden only="sm">
                                            <Grid item xs={4}>
                                                <Grid container spacing={1} justifyContent="flex-end" alignItems="center" className={classes.paddingRight}>
                                                    {row.hasPendingSchedules
                                                        && adviseeClaimSetting.hasScheduleRequestsClaim && (
                                                            <Grid item>
                                                                <span className={classes.successMobile} />
                                                            </Grid>
                                                        )}
                                                    {row.isSharedAdvisee && (
                                                        <Grid item>
                                                            <span className={classes.infoMobile} />
                                                        </Grid>
                                                    )}
                                                    {row.hasStopList && (
                                                        <Grid item>
                                                            <span className={classes.errorMobile} />
                                                        </Grid>
                                                    )}
                                                    {adviseesList.showAttendanceWarning
                                                        || adviseesList.showGradesWarning
                                                        || adviseesList.showViolationWarning ? (
                                                        <AdviseesWarnings
                                                            warnings={row.warnings}
                                                        />
                                                    ) : undefined}
                                                </Grid>
                                            </Grid>
                                        </Hidden>
                                        <Hidden only="xs">
                                            <Grid item>
                                                {row.hasPendingSchedules
                                                    && adviseeClaimSetting.hasScheduleRequestsClaim && (
                                                        <span className={classes.successMobile} />
                                                    )}
                                                {row.isSharedAdvisee && (
                                                    <span className={classes.infoMobile} />
                                                )}
                                                {row.hasStopList && (
                                                    <span className={classes.errorMobile} />
                                                )}
                                                {adviseesList.showAttendanceWarning
                                                    || adviseesList.showGradesWarning
                                                    || adviseesList.showViolationWarning ? (
                                                    <AdviseesWarnings
                                                        warnings={row.warnings}
                                                    />
                                                ) : undefined}
                                            </Grid>
                                        </Hidden>
                                    </Grid>
                                </TableCell>
                            </Hidden>
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
                                            checked: Boolean(adviseesList.advisees[i].checkbox),
                                            id: `chkAdvisee_${row.personId}_${i}`,
                                            inputProps: {
                                                'aria-label': Format.toString(resources.formatSelectAdvisee, [row.fullName])
                                            },
                                            onChange: onChangeChkbox
                                        }}
                                        avatarInfo={row}
                                        id={`Advisee_${row.personId}_${i}`}
                                    />
                                </TableCell>
                                <TableCell
                                    data-actionmenu
                                >
                                    {row.isSharedAdvisee && (
                                        <Tooltip
                                            id="tltShareAdvisees"
                                            title={resources.lblShared}
                                        >
                                            <div className={classes.share}>
                                                <UserFriends
                                                    aria-label={resources.lblShared}
                                                    small
                                                />
                                            </div>
                                        </Tooltip>
                                    )}
                                    {row.hasPendingSchedules
                                        && adviseeClaimSetting.hasScheduleRequestsClaim ? (
                                        <Tooltip
                                            id="tltScheduleRequest"
                                            title={resources.lblScheduleRequest}
                                        >
                                            <Icon
                                                aria-label={resources.lblScheduleRequest}
                                                marginRight
                                                name="calendar-check"
                                                type="success"
                                                iconWithBackground
                                            />
                                        </Tooltip>
                                    ) : undefined}
                                    {row.hasStopList ? (
                                        <Tooltip
                                            id="tltStopList"
                                            title={resources.lblStopList}
                                        >
                                            <div className={classes.error}>
                                                <HandPaper
                                                    aria-label={resources.lblStopList}
                                                    small
                                                    viewBoxWidth={448}
                                                />
                                            </div>
                                        </Tooltip>
                                    ) : undefined}
                                    {adviseesList.showAttendanceWarning
                                        || adviseesList.showGradesWarning
                                        || adviseesList.showViolationWarning ? (
                                        <AdviseesWarnings
                                            lblWarning={resources.lblWarning}
                                            warnings={row.warnings}
                                        />
                                    ) : undefined}
                                </TableCell>
                            </Hidden>
                        </TableExpandableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(AdviseesTable);