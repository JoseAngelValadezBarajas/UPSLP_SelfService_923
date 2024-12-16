/* Copyright 2022 - 2023 Ellucian Company L.P. and its affiliates.
 * File: GradeCommentsModal.tsx
 * Type: Presentation component */

// #region Imports
import React, { RefObject } from 'react';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Tabs from '@hedtech/powercampus-design-system/react/core/Tabs';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

//Types
import { GradeCommentsModalTab } from '../../../Types/Enum/GradeCommentsModalTab';
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';
import { IGradeCommentsDetail } from '../../../Types/Classes/IGradeCommentsDetail';
import { ITabOption } from '@hedtech/powercampus-design-system/types/ITabOption';

// #endregion Imports

// #region Types
export interface IGradeCommentsModalProps {
    blockCommentEdition: boolean;
    finalComment: IGradeCommentsDetail;
    isCourseManagement?: boolean;
    midtermComment: IGradeCommentsDetail;
    midtermCommentRef: RefObject<HTMLInputElement>;
    finalCommentRef: RefObject<HTMLInputElement>;
    openGradeModal: boolean;
    person?: IAvatar;
    resources: IGradeCommentsModalResProps;
    tabSelected: GradeCommentsModalTab;
    showMidterm: boolean;
    onApply: () => void;
    onChangeTab: (_event: object, value: number) => void;
    onClose: () => void;
    onSave: () => void;
}

export interface IGradeCommentsModalResProps {
    btnApply: string;
    btnCancel: string;
    btnSave: string;
    formatDateTimeFullname: string;
    lblComments: string;
    lblCommentsTitle: string;
    lblCreate: string;
    lblFinal: string;
    lblGrade: string;
    lblGradeSubmitted: string;
    lblLastModified: string;
    lblMidTerm: string;
    lblPending: string;
    lblPosted: string;
    lblTranscriptComments: string;
}
// #endregion Types

// #region Component
const GradeCommentsModal: React.FC<IGradeCommentsModalProps> = (props: IGradeCommentsModalProps): JSX.Element => {
    const {
        blockCommentEdition,
        finalComment,
        isCourseManagement,
        midtermComment,
        midtermCommentRef,
        finalCommentRef,
        openGradeModal,
        person,
        resources,
        showMidterm,
        tabSelected,
        onApply,
        onChangeTab,
        onClose,
        onSave
    } = props;

    let tabs: ITabOption[] = [];

    if (showMidterm) {
        tabs.push({
            id: GradeCommentsModalTab.Midterm,
            text: resources.lblMidTerm
        });
    }
    tabs.push({
        id: GradeCommentsModalTab.Final,
        text: resources.lblFinal
    });

    const footerModal: JSX.Element = (
        <ButtonGroup id="btnGradeCommenstModal">
            <Button
                id="btnCancel"
                color="secondary"
                onClick={onClose}
            >
                {resources.btnCancel}
            </Button>
            <Button
                id="btnSave_GradeCommentsModal"
                onClick={isCourseManagement ? onSave : onApply}
            >
                {isCourseManagement ? resources.btnSave : resources.btnApply}
            </Button>
        </ButtonGroup>
    );

    const headerModal: JSX.Element = (
        <Text size="h2" weight="strong">
            {resources.lblCommentsTitle}
        </Text>
    );

    let contentTab: JSX.Element | undefined;
    switch (tabSelected) {
        case GradeCommentsModalTab.Midterm:
            contentTab = (
                <Grid container spacing={2}>
                    {midtermComment.grade && (
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item xs={12}>
                                            <Text weight="strong">
                                                {resources.lblGrade}
                                            </Text>
                                        </Grid>
                                        <Grid item>
                                            <Text>
                                                {midtermComment.grade}
                                            </Text>
                                        </Grid>
                                        {(midtermComment.isPending || midtermComment.isPosted) && (
                                            <Grid item>
                                                <StatusLabel
                                                    id="stsLblMidterm_GradeCommentsModal"
                                                    text={midtermComment.isPosted ? resources.lblPosted : resources.lblPending}
                                                    type={midtermComment.isPosted ? 'success' : 'pending'}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text weight="strong">
                                        {resources.lblGradeSubmitted}
                                    </Text>
                                    {midtermComment.submissionDate && (
                                        <Text>
                                            {Format.toString(resources.formatDateTimeFullname, [
                                                midtermComment.submissionDate,
                                                midtermComment.submissionTime,
                                                midtermComment.submissionFullName
                                            ])}
                                        </Text>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {midtermComment.isPosted || blockCommentEdition ? (
                        <>
                            {midtermComment.transcriptComments && (
                                <Grid item xs={12}>
                                    <Text weight="strong">
                                        {resources.lblTranscriptComments}
                                    </Text>
                                    <Text>
                                        {midtermComment.transcriptComments}
                                    </Text>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <Grid container>
                                {midtermComment.transcriptComments && (
                                    <Grid item xs={12}>
                                        <Text weight="strong">
                                            {resources.lblTranscriptComments}
                                        </Text>
                                        <Text>
                                            {midtermComment.transcriptComments}
                                        </Text>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <TextField
                                        id="txtMidtermComment"
                                        label={resources.lblComments}
                                        multiline
                                        ref={midtermCommentRef}
                                        defaultValue={midtermComment.instructorComments ?? ''}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Text weight="strong">
                                    {resources.lblCreate}
                                </Text>
                                <Text>
                                    {Format.toString(resources.formatDateTimeFullname, [
                                        midtermComment.enteredDate,
                                        midtermComment.enteredTime,
                                        midtermComment.enteredFullName
                                    ])}
                                </Text>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Text weight="strong">
                                    {resources.lblLastModified}
                                </Text>
                                <Text>
                                    {Format.toString(resources.formatDateTimeFullname, [
                                        midtermComment.modifiedDate,
                                        midtermComment.modifiedTime,
                                        midtermComment.modifiedFullName
                                    ])}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            );
            break;
        case GradeCommentsModalTab.Final:
            contentTab = (
                <Grid container spacing={2}>
                    {finalComment.grade && (
                        <Grid item xs={12}>
                            <Grid container>
                                <Grid item xs={6}>
                                    <Grid container spacing={1} alignItems="center">
                                        <Grid item xs={12}>
                                            <Text weight="strong">
                                                {resources.lblGrade}
                                            </Text>
                                        </Grid>
                                        <Grid item>
                                            <Text>
                                                {finalComment.grade}
                                            </Text>
                                        </Grid>
                                        {(finalComment.isPending || finalComment.isPosted) && (
                                            <Grid item>
                                                <StatusLabel
                                                    id="stsLblFinal_GradeCommentsModal"
                                                    text={finalComment.isPosted ? resources.lblPosted : resources.lblPending}
                                                    type={finalComment.isPosted ? 'success' : 'pending'}
                                                />
                                            </Grid>
                                        )}
                                    </Grid>
                                </Grid>
                                <Grid item xs={6}>
                                    <Text weight="strong">
                                        {resources.lblGradeSubmitted}
                                    </Text>
                                    {finalComment.submissionDate && (
                                        <Text>
                                            {Format.toString(resources.formatDateTimeFullname, [
                                                finalComment.submissionDate,
                                                finalComment.submissionTime,
                                                finalComment.submissionFullName
                                            ])}
                                        </Text>
                                    )}
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    {finalComment.isPosted || blockCommentEdition ? (
                        <>
                            {finalComment.transcriptComments && (
                                <Grid item xs={12}>
                                    <Text weight="strong">
                                        {resources.lblTranscriptComments}
                                    </Text>
                                    <Text>
                                        {finalComment.transcriptComments}
                                    </Text>
                                </Grid>
                            )}
                        </>
                    ) : (
                        <Grid item xs={12}>
                            <Grid container>
                                {finalComment.transcriptComments && (
                                    <Grid item xs={12}>
                                        <Text weight="strong">
                                            {resources.lblTranscriptComments}
                                        </Text>
                                        <Text>
                                            {finalComment.transcriptComments}
                                        </Text>
                                    </Grid>
                                )}
                                <Grid item xs={12}>
                                    <div>
                                        <TextField
                                            id="txtFinalComment"
                                            label={resources.lblComments}
                                            multiline
                                            ref={finalCommentRef}
                                            defaultValue={finalComment.instructorComments ?? ''}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Grid container spacing={3}>
                            <Grid item xs={12} sm={6}>
                                <Text weight="strong">
                                    {resources.lblCreate}
                                </Text>
                                <Text>
                                    {Format.toString(resources.formatDateTimeFullname, [
                                        finalComment.enteredDate,
                                        finalComment.enteredTime,
                                        finalComment.enteredFullName
                                    ])}
                                </Text>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <Text weight="strong">
                                    {resources.lblLastModified}
                                </Text>
                                <Text>
                                    {Format.toString(resources.formatDateTimeFullname, [
                                        finalComment.modifiedDate,
                                        finalComment.modifiedTime,
                                        finalComment.modifiedFullName
                                    ])}
                                </Text>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            );
            break;
    }

    return (
        <Modal
            disableHeaderTypography
            footer={(midtermComment.isPosted && finalComment.isPosted) || blockCommentEdition ? undefined : footerModal}
            header={headerModal}
            id="gradeCommenstModal"
            maxWidth="md"
            open={openGradeModal}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <AvatarText
                        avatarInfo={person}
                    />
                </Grid>
                <Grid item xs={12}>
                    <Tabs
                        id="TermsTabs"
                        marginBottom
                        options={tabs}
                        scrollButtons
                        valueSelected={tabSelected}
                        onChange={onChangeTab}
                    />
                    {contentTab}
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default GradeCommentsModal;