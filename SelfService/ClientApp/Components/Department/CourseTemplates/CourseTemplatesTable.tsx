/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplatesTable.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ConfirmationDialog from '@hedtech/powercampus-design-system/react/core/ConfirmationDialog';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import { UserFriends } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Pagination from '@hedtech/powercampus-design-system/react/core/Pagination';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Table, { TableBody, TableCell, TableExpandableRow, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { ICourseTemplateAssignmentShare } from '../../../Types/Department/ICourseTemplateAssignmnetShare';
import { ICourseTemplates } from '../../../Types/Department/ICourseTemplates';
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
import { ICourseTemplatesSettings } from '../../../Types/Department/ICourseTemplatesSettings';
import { ILayoutResources } from '@hedtech/powercampus-design-system/types/ILayoutResources';
import { IPeopleSearchModel } from '@hedtech/powercampus-design-system/types/PeopleSearch/IPeopleSearchModel';

// Internal components
import CourseTemplatePeopleSearchModal from './CourseTemplatePeopleSearchModal';

// State Management
import LayoutStore from '@hedtech/powercampus-design-system/flux/stores/LayoutStore';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion

// #region Internal types
export interface ICourseTemplatesTableProps {
    assignmentTemplateShareName: string;
    checkboxHeader: boolean;
    confirmationDeleteShare: boolean;
    courseTemplates: ICourseTemplates;
    getRowsPerPageOptions: (maxValue: number) => number[];
    hasDossierClaim: boolean;
    isIndeterminate: boolean;
    isPeopleSearch: boolean;
    isSharedWith: boolean;
    people: ICourseTemplateAssignmentShare[];
    selectedPerson?: IPeopleSearchModel;
    shareTemplates: ICourseTemplatesSettings[];
    onChangeCheckbox: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeCheckboxHeader: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangePage: (_event: any, pageNumber: number) => void;
    onChangeRowsPerPage: () => void;
    onClickAdd: () => void;
    onClickDelete: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickDeleteShared: () => void;
    onClickShare: () => void;
    onClickSetup: (event: any) => void;
    onClickStep: (event: any) => void;
    onClose: () => void;
    onCloseSharedModal: () => void;
    onCloseDeleteShareConfirmModal: () => void;
    onDeleteShareConfirm: () => void;
    onFinishShare: () => void;
    onSharedWith: (assignmentTemplateHeaderId: number) => void;
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>) => void;
    // #region Pagination
    page: number;
    rowsPerPage: number;
    rowsPerPageOptions: number[];
    // #endregion Pagination

    // #region Stepper
    activeStep: number;
    numSteps: number;
    stepErrors: boolean[];
    // #endregion Stepper

    resources: ICourseTemplatesResources;
}

const styles = ((theme: Theme) => createStyles({
    alignItems: {
        alignItems: 'center'
    },
    checkboxHeader: {
        marginLeft: `${Tokens.spacing35}!important`
    },
    iconHeader: {
        display: 'inline',
        marginLeft: Tokens.spacing30
    },
    inline: {
        display: 'inline'
    },
    table: {
        [theme.breakpoints.up('md')]: {
            // Width
            '& > thead > tr > th:first-child': {
                width: '1%'
            },
            '& > thead > tr > th:nth-child(2)': {
                width: '20%'
            },
            '& > thead > tr > th:nth-child(3)': {
                width: '60%'
            }
            ,
            '& > thead > tr > th:nth-child(4)': {
                width: '5%'
            }
        }
    }
}));

type PropsWithStyles = ICourseTemplatesTableProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const CourseTemplatesTable: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        assignmentTemplateShareName,
        classes,
        checkboxHeader,
        confirmationDeleteShare,
        courseTemplates,
        hasDossierClaim,
        isIndeterminate,
        isPeopleSearch,
        isSharedWith,
        people,
        shareTemplates,
        selectedPerson,
        onChangeCheckbox,
        onChangeCheckboxHeader,
        onCloseSharedModal,
        onClickAdd,
        onClickDelete,
        onClickDeleteShared,
        onClickShare,
        onClickSetup,
        onClickStep,
        onClose,
        onCloseDeleteShareConfirmModal,
        onDeleteShareConfirm,
        onFinishShare,
        onSharedWith,
        onViewDossier,

        // #region Pagination
        getRowsPerPageOptions,
        onChangePage,
        onChangeRowsPerPage,
        page,
        rowsPerPage,
        // #endregion Pagination

        // #region Stepper
        activeStep,
        numSteps,
        stepErrors,
        // #endregion Stepper

        resources
    } = props;

    const layoutResources: ILayoutResources | undefined = LayoutStore.getResourcesLayout();

    let totalRows: number = 0;
    if (courseTemplates && courseTemplates.overallCount > 0) {
        totalRows = courseTemplates.overallCount ? courseTemplates.overallCount : 0;
    }

    let PeopleSearch: JSX.Element | undefined;
    if (isPeopleSearch) {
        PeopleSearch = (
            <CourseTemplatePeopleSearchModal
                activeStep={activeStep}
                hasDossierClaim={hasDossierClaim}
                open={isPeopleSearch}
                numSteps={numSteps}
                resources={resources}
                stepErrors={stepErrors}
                selectedPerson={selectedPerson}
                templateName={shareTemplates}
                onClickStep={onClickStep}
                onClose={onClose}
                onFinishShare={onFinishShare}
                onViewDossier={onViewDossier}
            />
        );
    }

    let SharedWithModal: JSX.Element | undefined;
    if (isSharedWith) {
        SharedWithModal = (
            <Modal
                header={resources.lblSharedWith}
                id="changeDateModal"
                maxWidth="md"
                open={isSharedWith}
                onClose={onCloseSharedModal}
            >
                {people.map(person => {
                    return (
                        <>
                            <Grid container justifyContent="space-between">
                                <Grid item xs={9} md={10}>
                                    <AvatarText
                                        ButtonProps={hasDossierClaim ? {
                                            'data-id': person.avatar.personId,
                                            id: `btnShareWith_${person.avatar.personId}`,
                                            onClick: onViewDossier
                                        } : undefined}
                                        avatarInfo={person.avatar}
                                    />
                                </Grid>
                                <Grid item xs={3} md={2}>
                                    <Tooltip
                                        id="deleteSharedWith"
                                        title={resources.btnDelete}
                                        aria-label={resources.btnDelete}
                                    >
                                        <IconButton
                                            color="secondary"
                                            id={`btnDeleteSharedId_${person.assignmentTemplateShareId}_${person.avatar.fullName}`}
                                            onClick={onClickDeleteShared}
                                        >
                                            <Icon name="trash" />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                            <Divider />
                        </>
                    );
                })}
            </Modal>
        );
    }

    let ConfirmationDeleteShare: JSX.Element | undefined;
    if (confirmationDeleteShare) {
        ConfirmationDeleteShare = (
            <ConfirmationDialog
                contentText={Format.toString(resources.formatDeleteShared, [assignmentTemplateShareName])}
                open={confirmationDeleteShare}
                primaryActionOnClick={onCloseDeleteShareConfirmModal}
                primaryActionText={resources.btnCancel}
                secondaryActionOnClick={onDeleteShareConfirm}
                secondaryActionText={resources.btnDelete}
                secondaryActionProps={{ id: "btnDeleteShared" }}
                title={resources.lblTitleDeleteShared}
            />
        );
    }

    const contentPage: JSX.Element = (
        <>
            <Grid container justifyContent="space-between">
                <Grid item>
                    <Checkbox
                        checked={isIndeterminate || checkboxHeader}
                        classes={{
                            focused: classes.checkboxHeader,
                            root: classes.checkboxHeader
                        }}
                        id="chkSelectAll"
                        indeterminate={isIndeterminate && !checkboxHeader}
                        inputProps={{
                            'aria-label': layoutResources?.lblSelectAll
                        }}
                        onChange={onChangeCheckboxHeader}
                    />
                    <Tooltip
                        id="tltShareAdvisees"
                        title={resources.lblShare}
                        placement="top"
                    >
                        <div className={classes.inline}>
                            <IconButton
                                alt={resources.lblShare}
                                classes={{ root: classes.iconHeader }}
                                color="secondary"
                                disabled={!isIndeterminate && !checkboxHeader}
                                onClick={onClickShare}
                                id="ShareAdviseesBtn"
                            >
                                <Icon large name="share" />
                            </IconButton>
                        </div>
                    </Tooltip>
                </Grid>
                <Grid item>
                    <Tooltip
                        id="addCourseTemplate"
                        title={resources.lblAdd}
                        aria-label={resources.lblAdd}
                    >
                        <IconButton
                            id="btnAdd"
                            onClick={onClickAdd}
                        >
                            <Icon name="add" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <br />
            <Table
                breakpoint="sm"
                classes={{ root: classes.table }}
                id="tblCourseTemplatesList"
                variant="expansionPanels"
            >
                <TableHead>
                    <TableRow>
                        <TableCell />
                        <TableCell component="th">
                            {resources.lblTemplates}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblStatus}
                        </TableCell>
                        <TableCell component="th">
                            {resources.lblSharing}
                        </TableCell>
                        <TableCell component="th">
                            {resources.btnDelete}
                        </TableCell>
                        <TableCell />
                    </TableRow>
                </TableHead>
                <TableBody>
                    {courseTemplates.courseTemplates.map((templates, i) => {
                        const onClickSharedWith = function (): void {
                            onSharedWith(templates.templateId);
                        };
                        return (
                            <TableExpandableRow
                                key={`templatesList_${templates.templateId}_${i}`}
                            >
                                <Hidden smDown>
                                    <TableCell>
                                        <Checkbox
                                            checked={Boolean(templates.checked)}
                                            disabled={Boolean(templates.isShared && !templates.userIsOwner)}
                                            id={`chkSelect_${templates.templateId}_${i}`}
                                            inputProps={{
                                                'aria-label': Format.toString(resources.formatSelectCourseTemplate, [templates.name])
                                            }}
                                            onChange={onChangeCheckbox}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {templates.userIsOwner && templates.isRestrictive && (templates.isAssigned || !templates.isAssigned) ?
                                            (
                                                <Tooltip
                                                    id={`editCourseTemplate_${templates.templateId}_${i}`}
                                                    title={resources.lblTemplateSetup}
                                                    aria-label={resources.lblTemplateSetup}
                                                >
                                                    <Button
                                                        align="left"
                                                        id={`lnkNameTemplate_${templates.templateId}_${templates.name}`}
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={onClickSetup}
                                                    >
                                                        {templates.name}
                                                    </Button>
                                                </Tooltip>
                                            )
                                            :
                                            (
                                                <Tooltip
                                                    id={`viewCourseTemplate_${templates.templateId}_${i}`}
                                                    title={resources.lblTemplateSetup}
                                                    aria-label={resources.lblTemplateSetup}
                                                >
                                                    <Button
                                                        align="left"
                                                        id={`lnkNameTemplate_${templates.templateId}_${templates.name}`}
                                                        textVariantStyling="inherit"
                                                        variant="text"
                                                        onClick={onClickSetup}
                                                    >
                                                        {templates.name}
                                                    </Button>
                                                </Tooltip>
                                            )
                                        }
                                    </TableCell>
                                </Hidden>
                                <Hidden mdUp>
                                    <TableCell>
                                        <div className={classes.alignItems}>
                                            <Checkbox
                                                checked={templates.checked ? true : false}
                                                id={`chkSelect_${templates.templateId}_${i}`}
                                                inputProps={{
                                                    'aria-label': Format.toString(resources.formatSelectCourseTemplate, [templates.name])
                                                }}
                                                onChange={onChangeCheckbox}
                                            />
                                            {templates.userIsOwner && templates.isRestrictive && (templates.isAssigned || !templates.isAssigned) ?
                                                (
                                                    <Tooltip
                                                        id={`editCourseTemplate_${templates.templateId}_${i}`}
                                                        title={resources.lblTemplateSetup}
                                                        aria-label={resources.lblTemplateSetup}
                                                    >
                                                        <Button
                                                            align="left"
                                                            id={`lnkNameTemplate_${templates.templateId}_${templates.name}`}
                                                            textVariantStyling="inherit"
                                                            variant="text"
                                                            onClick={onClickSetup}
                                                        >
                                                            {templates.name}
                                                        </Button>
                                                    </Tooltip>
                                                )
                                                :
                                                (
                                                    <Tooltip
                                                        id={`viewCourseTemplate_${templates.templateId}_${i}`}
                                                        title={resources.lblTemplateSetup}
                                                        aria-label={resources.lblTemplateSetup}
                                                    >
                                                        <Button
                                                            align="left"
                                                            id={`lnkNameTemplate_${templates.templateId}_${templates.name}`}
                                                            textVariantStyling="inherit"
                                                            variant="text"
                                                            onClick={onClickSetup}
                                                        >
                                                            {templates.name}
                                                        </Button>
                                                    </Tooltip>
                                                )
                                            }
                                        </div>
                                    </TableCell>
                                </Hidden>
                                <TableCell columnName={resources.lblStatus}>
                                    <Grid container>
                                        {templates.isShared && !templates.userIsOwner ?
                                            <Grid item>
                                                <StatusLabel
                                                    id={`stsLbl_${templates.templateId}_Shared_${i}`}
                                                    text={resources.lblSharedStatus}
                                                    type={'default'}
                                                />
                                            </Grid>
                                            :
                                            templates.isShared && (
                                                <Grid item>
                                                    <StatusLabel
                                                        id={`stsLbl_${templates.templateId}_Sharing_${i}`}
                                                        text={resources.lblSharing}
                                                        type={'pending'}
                                                    />
                                                </Grid>
                                            )
                                        }
                                        {templates.isAssigned && (
                                            <Grid item>
                                                <StatusLabel
                                                    id={`stsLbl_${templates.templateId}_Assigned_${i}`}
                                                    text={resources.lblAssigned}
                                                    type={'draft'}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </TableCell>
                                <TableCell columnName={resources.lblSharing}>
                                    <Grid container>
                                        <Grid item>
                                            {templates.isShared && templates.userIsOwner && (
                                                <Tooltip
                                                    id="tltSharedWith"
                                                    title={resources.lblSharedWith}
                                                >
                                                    <IconButton
                                                        color="secondary"
                                                        id={`btnShareWith_${templates.templateId}_${templates.name}`}
                                                        onClick={onClickSharedWith}
                                                    >
                                                        <UserFriends
                                                            aria-label={resources.lblSharedWith}
                                                            small
                                                        />
                                                    </IconButton>
                                                </Tooltip>
                                            )}
                                        </Grid>
                                    </Grid>
                                </TableCell>
                                <TableCell columnName={resources.btnDelete}>
                                    <Grid container>
                                        <Grid item>
                                            {templates.userIsOwner && !templates.isAssignedByUser ?
                                                (
                                                    <Tooltip
                                                        id="deleteCourseTemplate"
                                                        title={resources.btnDelete}
                                                        aria-label={resources.btnDelete}
                                                    >
                                                        <IconButton
                                                            color="secondary"
                                                            id={`btnDelete_${templates.templateId}_${templates.name}`}
                                                            onClick={onClickDelete}
                                                        >
                                                            <Icon name="trash" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )
                                                :
                                                (
                                                    <IconButton
                                                        color="secondary"
                                                        disabled={true}
                                                        id="btnDelete"
                                                    >
                                                        <Icon name="trash" />
                                                    </IconButton>
                                                )
                                            }
                                        </Grid>
                                    </Grid>
                                </TableCell>
                            </TableExpandableRow>
                        );
                    })}
                </TableBody>
            </Table>
            {
                rowsPerPage > 0 ? (
                    <Grid container>
                        <Grid item xs>
                            <Pagination
                                count={totalRows}
                                page={page}
                                rowsPerPage={rowsPerPage}
                                rowsPerPageOptions={getRowsPerPageOptions(totalRows)}
                                onPageChange={onChangePage}
                                onRowsPerPageChange={onChangeRowsPerPage}
                            />
                        </Grid>
                    </Grid >
                ) : undefined
            }
        </>
    );

    return (
        <>
            {contentPage}
            {ConfirmationDeleteShare}
            {SharedWithModal}
            {PeopleSearch}
            <br />
        </>
    );
};
// #endregion

// Export: Component
export default withStyles(styles)(CourseTemplatesTable);