/* Copyright 2020 - 2023 Ellucian Company L.P. and its affiliates.
 * File: BlockDetailModal.tsx
 * Type: Presentation component */

// #region Imports
import React, { useState } from 'react';

// Core components
import { BoxesAlt } from '@hedtech/powercampus-design-system/react/core/IconSvg';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import ContainerLoader from '@hedtech/powercampus-design-system/react/core/ContainerLoader';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Internal components
import ScheduleCalendar, { IScheduleCalendarResProps } from '@hedtech/powercampus-design-system/react/components/Section/ScheduleCalendar';
import SectionCard, { ISectionCardPropsToExtend } from '../../Generic/SectionCard';

// Types
import { ISection } from '@hedtech/powercampus-design-system/types/Section/ISection';
import { ISectionStatus } from '@hedtech/powercampus-design-system/types/Section/ISectionStatus';
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
import { ResultType } from '@hedtech/powercampus-design-system/types/ResultType';
import { BlockRegBlockStatus, IBlockStudentSchedule } from '../../../Types/Students/IStudentSchedule';
import { BlockRegRuleGroupStatus } from '../../../Types/Administration/IBlockRegistrationRuleGroup';
import { IBlockRegRuleGroup } from '../../../Types/Administration/IBlockRegistrationGroupDetail';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { isWidthDown, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';
// #endregion Imports

// #region Types
export interface IBlockDetailModalProps {
    block: IBlockRegRuleGroup;
    countActions: number;
    enableCart: boolean;
    errorLoading: boolean;
    groupDisplayName: string;
    groupStatus?: BlockRegRuleGroupStatus;
    isLoading: boolean;
    open: boolean;
    resources: IBlockDetailModalResProps;
    SectionCardProps: ISectionCardPropsToExtend;
    selectedBlock?: IBlockStudentSchedule;
    selectedBlockIndex?: number;
    showDeniedCourses: boolean;
    canAddToCart: (section: ISection) => boolean;
    canAddToWaitlist: (section: ISection) => boolean;
    canChangeCreditType: (studentSchedule: IStudentSchedule) => boolean;
    canDropBlock: (index: number) => boolean;
    canDropSection: (section: ISection, includingBlocks?: boolean) => boolean;
    canRemoveBlock: (index: number) => boolean;
    canRemoveFromCart: (section: ISection, includingBlocks?: boolean) => boolean;
    canRemoveFromWaitlist: (section: ISection, includingBlocks?: boolean) => boolean;
    getSectionStatus: (section: IStudentSchedule) => ISectionStatus;
    onAddBlock: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onChangeShowDeniedCourses: () => void;
    onClose: () => void;
    onDropBlock: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onRemoveBlock: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onViewSectionDetailsByCalendar: (id: number) => void;
}

export interface IBlockDetailModalResProps {
    btnAdd: string;
    btnCalendarView: string;
    btnDropBlock: string;
    btnListView: string;
    btnRemoveBlock: string;
    formatBlockInfo: string;
    lblCompleted: string;
    lblCompletedTooltip: string;
    lblDeniedCourses: string;
    lblProcessing: string;
    lblProcessingTooltip: string;
    scheduleCalendar: IScheduleCalendarResProps;
}

type PropsWithStyles = IBlockDetailModalProps & WithWidth;
// #endregion Types

// #region Component
const BlockDetailModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        block,
        countActions,
        enableCart,
        errorLoading,
        groupDisplayName,
        groupStatus,
        isLoading,
        open,
        resources,
        SectionCardProps,
        selectedBlock,
        selectedBlockIndex,
        showDeniedCourses,
        width,
        canAddToCart,
        canAddToWaitlist,
        canChangeCreditType,
        canDropBlock,
        canDropSection,
        canRemoveBlock,
        canRemoveFromCart,
        canRemoveFromWaitlist,
        getSectionStatus,
        onAddBlock,
        onChangeShowDeniedCourses,
        onClose,
        onDropBlock,
        onRemoveBlock,
        onViewSectionDetailsByCalendar
    } = props;

    const [calendarView, setCalendarViewStatus] = useState(false);
    const onShowCalendar = (): void => {
        setCalendarViewStatus(true);
    };
    const onShowList = (): void => {
        setCalendarViewStatus(false);
    };

    const disableDrop: boolean = countActions > 0;

    let enableAddButton: boolean = false;
    let sectionIsSelected: boolean = false;
    let canAddSectionToCart: boolean;
    let canAddSectionToWaitlist: boolean;

    let blockStatusSection: JSX.Element | undefined;
    if (block.status === BlockRegBlockStatus.Completed
        || block.status === BlockRegBlockStatus.Processing) {
        blockStatusSection = (
            <Grid
                container
                spacing={0}
                wrap="nowrap"
            >
                <Grid item>
                    {block.status === BlockRegBlockStatus.Processing && (
                        <StatusLabel
                            id={`stl${block.blockRegRuleGroupBlockId}`}
                            text={resources.lblProcessing}
                            type="default"
                        />
                    )}
                    {block.status === BlockRegBlockStatus.Completed && (
                        <StatusLabel
                            id={`stl${block.blockRegRuleGroupBlockId}`}
                            text={resources.lblCompleted}
                            type="success"
                        />
                    )}
                </Grid>
                <Grid item>
                    <Tooltip
                        id={`tltInfo_${block.blockRegRuleGroupBlockId}`}
                        placement="top"
                        title={block.status === BlockRegBlockStatus.Completed ?
                            resources.lblCompletedTooltip
                            : resources.lblProcessingTooltip}
                    >
                        <IconButton
                            aria-label={block.status === BlockRegBlockStatus.Completed ?
                                resources.lblCompletedTooltip
                                : resources.lblProcessingTooltip}
                            color="gray"
                            id={`btnInfo_${block.blockRegRuleGroupBlockId}`}
                        >
                            <Icon
                                name="info"
                                type={ResultType.info}
                            />
                        </IconButton>
                    </Tooltip>
                </Grid>
            </Grid>
        );
    }

    const headerModal: JSX.Element = (
        <>
            <Grid
                container
                alignItems="center"
                spacing={width === 'xs' ? 0 : 3}
            >
                <Grid item xs={width === 'xs' ? 12 : undefined}>
                    <Grid container justifyContent="center" direction="column" spacing={0}>
                        <Grid item>
                            <Grid container spacing={1} wrap="nowrap">
                                <Grid item>
                                    <BoxesAlt />
                                </Grid>
                                <Grid item>
                                    <Text
                                        display="inline"
                                        size="h4"
                                        weight="strong"
                                    >
                                        {block.blockRegistrationGroup.displayName}
                                    </Text>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item>
                            <Text
                                color="textSecondary"
                                size="small"
                            >
                                {groupDisplayName}
                            </Text>
                        </Grid>
                        <Grid item>
                            <Text
                                color="textSecondary"
                                size="small"
                            >
                                {Format.toString(resources.formatBlockInfo, [block.sectionList.length, block.totalCredits])}
                            </Text>
                        </Grid>
                    </Grid>
                </Grid>
                {blockStatusSection && (
                    <Grid item xs={width === 'xs' ? 12 : undefined}>
                        {blockStatusSection}
                    </Grid>
                )}
            </Grid>
            <Grid container>
                <Grid item xs>
                    <Checkbox
                        id="chkCoursesCart_BlockDetailModal"
                        checked={showDeniedCourses}
                        label={resources.lblDeniedCourses}
                        onChange={onChangeShowDeniedCourses}
                    />
                </Grid>
                <Grid item>
                    <ButtonGroup id="btgScheduleView" toggle>
                        <Tooltip
                            id="tltList"
                            title={resources.btnListView}
                        >
                            <IconButton
                                aria-label={resources.btnListView}
                                color="secondary"
                                id="btnList"
                                selected={!calendarView}
                                onClick={onShowList}
                            >
                                <Icon name="list-view" />
                            </IconButton>
                        </Tooltip>
                        <Tooltip
                            id="tltCalendar"
                            title={resources.btnCalendarView}
                        >
                            <IconButton
                                aria-label={resources.btnCalendarView}
                                color="secondary"
                                id="btnCalendar"
                                selected={calendarView}
                                onClick={onShowCalendar}
                            >
                                <Icon name="calendar" />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
    );

    let bodyModal: JSX.Element | undefined;
    if (!errorLoading) {
        if (isLoading) {
            bodyModal = (
                <ContainerLoader id="ldrBlockDetail" height="sm" />
            );
        }
        else {
            let bodyContent: JSX.Element | undefined;
            if (block.sectionList) {
                if (calendarView) {
                    const sectionsForCalendar: (ISection | IStudentSchedule)[] = [];
                    block.sectionList.filter(s => !s.isHidden).forEach(section => sectionsForCalendar.push(section));
                    if (selectedBlock?.studentSchedule) {
                        selectedBlock.studentSchedule.forEach(sectionList => {
                            if (sectionList) {
                                sectionList.filter(sl => !sl.isLoading).forEach(section => {
                                    if (showDeniedCourses || !section.isDenied) {
                                        sectionsForCalendar.push(section);
                                    }
                                });
                            }
                        });
                    }
                    bodyContent = (
                        <ScheduleCalendar
                            resources={resources.scheduleCalendar}
                            sections={sectionsForCalendar}
                            withLegend
                            onViewSectionDetailsById={onViewSectionDetailsByCalendar}
                        />
                    );
                }
                else {
                    if (selectedBlock) {
                        bodyContent = (
                            <>
                                {selectedBlock.studentSchedule.map(sectionList => {
                                    if (sectionList) {
                                        return sectionList.filter(section => !section.isLoading && (showDeniedCourses || !section.isDenied)).map((section, iSection) => {
                                            canAddSectionToCart = canAddToCart(section);
                                            canAddSectionToWaitlist = canAddToWaitlist(section);
                                            enableAddButton = enableAddButton || canAddSectionToCart || canAddSectionToWaitlist;
                                            if (canAddSectionToCart || canAddSectionToWaitlist) {
                                                sectionIsSelected = sectionIsSelected || Boolean(section.isSelected);
                                            }
                                            return (
                                                <SectionCard
                                                    allowChanges={block.blockRegistrationGroup.allowChanges}
                                                    canAddToCart={canAddSectionToCart}
                                                    canAddToWaitlist={canAddSectionToWaitlist}
                                                    canChangeCreditType={canChangeCreditType(section)}
                                                    canDrop={canDropSection(section, true)}
                                                    canRemoveFromCart={canRemoveFromCart(section, true)}
                                                    canRemoveFromWaitlist={canRemoveFromWaitlist(section, true)}
                                                    disableDrop={disableDrop}
                                                    id={`sectionCardFromCart_${iSection}`}
                                                    key={`sectionCardFromCart_${iSection}_${section.id}`}
                                                    ruleGroupBlockId={block.blockRegRuleGroupBlockId}
                                                    section={section}
                                                    sectionStatus={getSectionStatus(section)}
                                                    {...SectionCardProps}
                                                />
                                            );
                                        });
                                    }
                                    else {
                                        return (<></>);
                                    }
                                })}
                            </>
                        );
                    }
                    bodyContent = (
                        <>
                            {bodyContent}
                            {block.sectionList.filter(s => !s.isHidden).map((section, iSection) => {
                                canAddSectionToCart = canAddToCart(section);
                                canAddSectionToWaitlist = canAddToWaitlist(section);
                                enableAddButton = enableAddButton || canAddSectionToCart || canAddSectionToWaitlist;
                                if (canAddSectionToCart || canAddSectionToWaitlist) {
                                    sectionIsSelected = sectionIsSelected || Boolean(section.isSelected);
                                }
                                return (
                                    <SectionCard
                                        allowChanges={block.blockRegistrationGroup.allowChanges}
                                        canAddToCart={canAddSectionToCart}
                                        canAddToWaitlist={canAddSectionToWaitlist}
                                        id={`sectionCard_${iSection}`}
                                        key={`sectionCard_${iSection}_${section.id}`}
                                        ruleGroupBlockId={block.blockRegRuleGroupBlockId}
                                        section={section}
                                        {...SectionCardProps}
                                    />
                                );
                            })}
                        </>
                    );
                }
            }
            bodyModal = (
                <>
                    {bodyContent}
                </>
            );
        }
    }

    let footerModal: JSX.Element | undefined;
    if (!errorLoading && !isLoading) {
        footerModal = (
            <ButtonGroup id={`btgBlockDetail_${block.blockRegRuleGroupBlockId}`}>
                {selectedBlockIndex !== undefined && canDropBlock && canDropBlock(selectedBlockIndex) && (
                    <Button
                        color="secondary"
                        data-index={selectedBlockIndex}
                        disabled={disableDrop}
                        IconProps={{
                            name: 'trash'
                        }}
                        id={`btnDropBlock_${block.blockRegRuleGroupBlockId}`}
                        onClick={onDropBlock}
                    >
                        {resources.btnDropBlock}
                    </Button>
                )}
                {selectedBlockIndex !== undefined && canRemoveBlock && canRemoveBlock(selectedBlockIndex) && (
                    <Button
                        color="secondary"
                        data-index={selectedBlockIndex}
                        IconProps={{
                            name: 'close'
                        }}
                        id={`btnRemoveBlock_${block.blockRegRuleGroupBlockId}`}
                        onClick={onRemoveBlock}
                    >
                        {resources.btnRemoveBlock}
                    </Button>
                )}
                {(enableCart
                    && enableAddButton
                    && groupStatus as number === block.status as number
                    && (
                        <Button
                            data-id={block.blockRegRuleGroupBlockId}
                            disabled={!sectionIsSelected}
                            IconProps={{
                                name: 'cart'
                            }}
                            id={`btnAddBlockToCart_${block.blockRegRuleGroupBlockId}`}
                            onClick={onAddBlock}
                        >
                            {resources.btnAdd}
                        </Button>
                    ))}
            </ButtonGroup>
        );
    }

    return (
        <Modal
            disableHeaderTypography
            id="mdlBlockDetail"
            footer={footerModal}
            fullWidth={isWidthDown('md', width)}
            header={headerModal}
            maxWidth="lg"
            open={open}
            onClose={onClose}
        >
            {bodyModal}
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default (withWidth()(BlockDetailModal));