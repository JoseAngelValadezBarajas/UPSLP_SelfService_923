/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: DossierSetupEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import { DragDropContext, Draggable, DraggableItem, Droppable, DroppableContainer } from '@hedtech/powercampus-design-system/react/core/DragNDrop';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Types
import { DossierType } from '@hedtech/powercampus-design-system/types/Dossier/DossierType';
import { IDossierSetupAdmin } from '../../../Types/Dossier/IDossierSetupAdmin';

// Helpers
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
// #endregion Imports

// #region Types
export interface IDossierSetupEditProps {
    dossierType: DossierType;
    isLoadingSave: boolean;
    resources: IDossierSetupEditResProps;
    setup: IDossierSetupAdmin[];
    onAddCustom: () => void;
    onCancelEditSetup: () => void;
    onChangeVisibility: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDeleteCustom: () => void;
    onDragEndBlock: (result: any, provided: any) => void;
    onEditCustom: () => void;
    onSaveSetup: () => void;
    onViewOptionsClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export interface IDossierSetupEditResProps {
    btnAdd: string;
    btnCancel: string;
    btnDelete: string;
    btnEdit: string;
    btnSave: string;
    btnVisible: string;
    lblAcademic: string;
    lblAddress: string;
    lblAssociation: string;
    lblContact: string;
    lblEmailAddress: string;
    lblEmergencyContact: string;
    lblFacultySchedule: string;
    lblFacultyTitle: string;
    lblGeneralTitle: string;
    lblHeader: string;
    lblInstructions: string;
    lblOffice: string;
    lblPhoneNumber: string;
    lblPosition: string;
    lblReleaseInformation: string;
    lblResidencyInformation: string;
    lblTeachingSchedule: string;
    lblCourseSchedule: string;
    lblStudentSchedule: string;
    lblStudentTitle: string;
}

const styles = createStyles({
    dossierTitle: {
        paddingBottom: Tokens.spacing50
    },
    dossierTitleContainer: {
        paddingRight: Tokens.spacing30,
        paddingLeft: Tokens.spacing30
    }
});

type PropsWithStyles = IDossierSetupEditProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DossierSetupEdit: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        dossierType,
        isLoadingSave,
        resources,
        setup,
        onAddCustom,
        onCancelEditSetup,
        onChangeVisibility,
        onDeleteCustom,
        onDragEndBlock,
        onEditCustom,
        onSaveSetup,
        onViewOptionsClick
    } = props;

    let dossierTitle: string;
    switch (dossierType) {
        case DossierType.Student:
            dossierTitle = resources.lblStudentTitle;
            break;
        case DossierType.Faculty:
            dossierTitle = resources.lblFacultyTitle;
            break;
        case DossierType.General:
            dossierTitle = resources.lblGeneralTitle;
            break;
        default:
            dossierTitle = '';
    }

    const getResourceText = (key: string, general?: boolean): string => {
        switch (key) {
            case 'Header':
                return resources.lblHeader;
            case 'EmailAddress':
                return resources.lblEmailAddress;
            case 'ReleaseInformation':
                return resources.lblReleaseInformation;
            case 'FacultySchedule':
                if (!general) {
                    return resources.lblTeachingSchedule;
                }
                return resources.lblTeachingSchedule;
            case 'StudentSchedule':
                if (!general) {
                    return resources.lblCourseSchedule;
                }
                return resources.lblCourseSchedule;
            case 'Contact':
                return resources.lblContact;
            case 'PhoneNumber':
                return resources.lblPhoneNumber;
            case 'EmergencyContact':
                return resources.lblEmergencyContact;
            case 'Address':
                return resources.lblAddress;
            case 'ResidencyInformation':
                return resources.lblResidencyInformation;
            case 'Academic':
                return resources.lblAcademic;
            case 'Office':
                return resources.lblOffice;
            case 'Position':
                return resources.lblPosition;
            case 'Association':
                return resources.lblAssociation;
            default:
                return key;
        }
    };

    const droppableBlockContainers: JSX.Element[] = [];
    let draggableBlockItems: JSX.Element[] = [];
    let isBlockFixed: boolean = setup[0].isFixed;
    let iBlockDroppable: number = 0;
    let droppableFieldContainers: JSX.Element[];
    let draggableFieldItems: JSX.Element[];
    let isFieldFixed: boolean;
    let iFieldDroppable: number;
    let hasOptions: boolean;
    setup.forEach((dossierSetup, iDossierSetup) => {
        //#region Fields
        hasOptions = false;
        if (dossierSetup.dossierSetupDetails && dossierSetup.dossierSetupDetails.length > 0) {
            droppableFieldContainers = [];
            draggableFieldItems = [];
            isFieldFixed = dossierSetup.dossierSetupDetails[0].isFixed;
            iFieldDroppable = 0;
            hasOptions = true;
            dossierSetup.dossierSetupDetails.forEach((dossierSetupDetail, iDossierSetupDetail) => {
                if (isFieldFixed !== dossierSetupDetail.isFixed) {
                    droppableFieldContainers.push(
                        <Droppable
                            key={`drpDossierFields_${iDossierSetup}_${iFieldDroppable}`}
                            droppableId={`drpDossierFields_${iDossierSetup}_${iFieldDroppable}`}
                            type={`second-level_${iDossierSetup}_${iFieldDroppable}`}
                            styleName="secondary"
                        >
                            {draggableFieldItems}
                        </Droppable>
                    );
                    draggableFieldItems = [];
                    isFieldFixed = dossierSetupDetail.isFixed;
                    iFieldDroppable++;
                }

                draggableFieldItems.push(
                    <Draggable
                        key={`field_${iDossierSetup}_${iDossierSetupDetail}`}
                        draggableId={`drgField_${iDossierSetup}_${iDossierSetupDetail}`}
                        index={iDossierSetupDetail}
                        isDragDisabled={dossierSetupDetail.isFixed || isLoadingSave}
                        styleName="secondary"
                    >
                        <DraggableItem
                            buttons={(
                                <>
                                    {!dossierSetupDetail.isRequired && (
                                        <Grid item>
                                            <Checkbox
                                                checked={dossierSetupDetail.isActive}
                                                checkedIcon={<Icon name="show" />}
                                                disabled={isLoadingSave}
                                                icon={<Icon name="hide" />}
                                                id={`chkVisibleField_${iDossierSetup}`}
                                                inputProps={{
                                                    'data-block-index': iDossierSetup,
                                                    'data-index': iDossierSetupDetail,
                                                    'aria-label': resources.btnVisible
                                                }}
                                                onChange={onChangeVisibility}
                                            />
                                        </Grid>
                                    )}
                                </>
                            )}
                            id={`drgiField_${iDossierSetup}_${iDossierSetupDetail}`}
                            index={iDossierSetupDetail}
                            showDragIcon={!dossierSetupDetail.isFixed}
                            styleName="secondary"
                        >
                            <Text size="large">
                                {getResourceText(dossierSetupDetail.fieldName)}
                            </Text>
                        </DraggableItem>
                    </Draggable>
                );
            });
            droppableFieldContainers.push(
                <Droppable
                    key={`drpDossierFields_${iDossierSetup}_${iFieldDroppable}`}
                    droppableId={`drpDossierFields_${iDossierSetup}_${iFieldDroppable}`}
                    type={`second-level_${iDossierSetup}_${iFieldDroppable}`}
                    styleName="secondary"
                >
                    {draggableFieldItems}
                </Droppable>
            );
        }
        //#endregion Fields

        //#region Blocks
        if (isBlockFixed !== dossierSetup.isFixed) {
            droppableBlockContainers.push(
                <Droppable
                    key={`drpDossierBlocks_${iBlockDroppable}`}
                    droppableId={`drpDossierBlocks_${iBlockDroppable}`}
                    type={`first-level_${iBlockDroppable}`}
                >
                    {draggableBlockItems}
                </Droppable>
            );
            draggableBlockItems = [];
            isBlockFixed = dossierSetup.isFixed;
            iBlockDroppable++;
        }

        draggableBlockItems.push(
            <Draggable
                key={`block_${iDossierSetup}`}
                draggableId={`drgBlock_${iDossierSetup}`}
                index={iDossierSetup}
                isDragDisabled={dossierSetup.isFixed || isLoadingSave}
            >
                <DraggableItem
                    buttons={(
                        <>
                            {dossierSetup.isCustom && (
                                <>
                                    <Grid item>
                                        <Tooltip title={resources.btnDelete}>
                                            <IconButton
                                                aria-label={resources.btnDelete}
                                                color="gray"
                                                data-index={iDossierSetup}
                                                disabled={isLoadingSave}
                                                id={`btnDeleteBlock_${iDossierSetup}`}
                                                onClick={onDeleteCustom}
                                            >
                                                <Icon name="trash" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                    <Grid item>
                                        <Tooltip title={resources.btnEdit}>
                                            <IconButton
                                                aria-label={resources.btnEdit}
                                                color="gray"
                                                data-index={iDossierSetup}
                                                disabled={isLoadingSave}
                                                id={`btnEditBlock_${iDossierSetup}`}
                                                onClick={onEditCustom}
                                            >
                                                <Icon name="edit" />
                                            </IconButton>
                                        </Tooltip>
                                    </Grid>
                                </>
                            )}
                            {!dossierSetup.isRequired && (
                                <Grid item>
                                    <Checkbox
                                        checked={dossierSetup.isActive}
                                        checkedIcon={<Icon name="show" />}
                                        disabled={isLoadingSave}
                                        icon={<Icon name="hide" />}
                                        id={`chkVisibleBlock_${iDossierSetup}`}
                                        inputProps={{
                                            'data-index': iDossierSetup,
                                            'aria-label': resources.btnVisible
                                        }}
                                        onChange={onChangeVisibility}
                                    />
                                </Grid>
                            )}
                        </>
                    )}
                    ExpandableIconButtonProps={{
                        expanded: dossierSetup.showOptions,
                        onClick: onViewOptionsClick
                    }}
                    id={`drgiBlock_${iDossierSetup}`}
                    index={iDossierSetup}
                    showDragIcon={!dossierSetup.isFixed}
                    showExpandIcon={dossierSetup.dossierSetupDetails && dossierSetup.dossierSetupDetails.length > 0}
                >
                    <Text size="large">
                        {dossierSetup.isCustom ?
                            dossierSetup.blockName
                            : getResourceText(dossierSetup.blockName, dossierType === DossierType.General)}
                    </Text>
                </DraggableItem>
                {hasOptions && Boolean(dossierSetup.showOptions) && (
                    <DroppableContainer id={`drpcDossierSetupDetail_${iDossierSetup}`}>
                        {droppableFieldContainers}
                    </DroppableContainer>
                )}
            </Draggable>
        );
        //#endregion Blocks
    });

    droppableBlockContainers.push(
        <Droppable
            key={`drpDossierBlocks_${iBlockDroppable}`}
            droppableId={`drpDossierBlocks_${iBlockDroppable}`}
            type={`first-level_${iBlockDroppable}`}
        >
            {draggableBlockItems}
        </Droppable>
    );

    return (
        <>
            <Grid container className={classes.dossierTitleContainer}>
                <Grid item>
                    <Text gutterBottom size="h3">
                        {dossierTitle}
                    </Text>
                </Grid>
            </Grid>
            <Grid
                container
                className={classes.dossierTitleContainer}
                alignItems="center"
                justifyContent="space-between"
                wrap="nowrap"
            >
                <Grid item>
                    <Text size="h4">
                        {resources.lblInstructions}
                    </Text>
                </Grid>
                <Grid item>
                    <Tooltip title={resources.btnAdd}>
                        <IconButton
                            aria-label={resources.btnAdd}
                            disabled={isLoadingSave}
                            id="btnAddBlock"
                            onClick={onAddCustom}
                        >
                            <Icon name="add" />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <DragDropContext onDragEnd={onDragEndBlock}>
                        <DroppableContainer id="drpcDossierSetup">
                            {droppableBlockContainers}
                        </DroppableContainer>
                    </DragDropContext>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    <ButtonGroup id="btgDossierSetup">
                        <Button
                            id="btnSaveDossierSetup"
                            loading={isLoadingSave}
                            onClick={onSaveSetup}
                        >
                            {resources.btnSave}
                        </Button>
                        <Button
                            color="secondary"
                            disabled={isLoadingSave}
                            id="btnCancelDossierSetup"
                            onClick={onCancelEditSetup}
                        >
                            {resources.btnCancel}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(DossierSetupEdit);