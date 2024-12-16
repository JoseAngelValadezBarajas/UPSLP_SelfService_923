/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: AgreementsEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { AgreementStatus } from '../../Types/Agreements/IAgreement';
import { IAgreementDetail } from '../../Types/Agreements/IAgreementDetail';
import { IAgreementDetailValidations } from '../../Types/Agreements/IAgreementDetailValidations';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
// #endregion Imports

// #region Types
export interface IAgreementsEditProps {
    agreement: IAgreementDetail;
    agreementValidations: IAgreementDetailValidations;
    isAssignedToRegistration: boolean;
    resources: IAgreementsEditResProps;
    onBlurName: () => void;
    onCancel: () => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onDeactivate: () => void;
    onPublish: () => void;
    onSave: () => void;
}

export interface IAgreementsEditResProps {
    btnCancel: string;
    btnDeactivate: string;
    btnPublish: string;
    btnSave: string;
    formatTitleEditing: string;
    lblAcceptance: string;
    lblAcceptanceRequired: string;
    lblContent: string;
    lblContentHelpText: string;
    lblContentRequired: string;
    lblName: string;
    lblNameDuplicated: string;
    lblNameRequired: string;
    lblNotActive: string;
    lblPreview: string;
    lblPublished: string;
    lblStatus: string;
    lblTitle: string;
    lblTitleRequired: string;
}
// #endregion Types

// #region Component
const AgreementsEdit: React.FC<IAgreementsEditProps> = (props: IAgreementsEditProps): JSX.Element => {
    const {
        agreement,
        agreementValidations,
        isAssignedToRegistration,
        resources,
        onBlurName,
        onCancel,
        onChangeTextField,
        onDeactivate,
        onPublish,
        onSave
    } = props;

    // #region Acceptance
    let errorAcceptance: boolean = false;
    let errorTextAcceptance: string | undefined;
    if (agreementValidations.acceptanceModified) {
        errorAcceptance = !Boolean(agreement.acceptance);
        errorTextAcceptance = errorAcceptance ?
            resources.lblAcceptanceRequired
            : undefined;
    }
    const valueAcceptance: string = agreement.acceptance || '';
    // #endregion Acceptance

    // #region Content
    let errorContent: boolean = false;
    let errorTextContent: string | undefined;
    if (agreementValidations.acceptanceModified) {
        errorContent = !Boolean(agreement.content);
        errorTextContent = errorContent ?
            resources.lblContentRequired
            : undefined;
    }
    const valueContent: string = agreement.content || '';
    // #endregion Content

    // #region Name
    let errorName: boolean = false;
    let errorTextName: string | undefined;
    if (agreementValidations.nameModified) {
        errorName = !Boolean(agreement.name)
            || agreementValidations.nameDuplicated;
        errorTextName = !Boolean(agreement.name) ?
            resources.lblNameRequired :
            (agreementValidations.nameDuplicated ?
                resources.lblNameDuplicated : undefined);
    }
    const valueName: string = agreement.name || '';
    // #endregion Name

    // #region Title
    let errorTitle: boolean = false;
    let errorTextTitle: string | undefined;
    if (agreementValidations.acceptanceModified) {
        errorTitle = !Boolean(agreement.title);
        errorTextTitle = errorTitle ?
            resources.lblTitleRequired
            : undefined;
    }
    const valueTitle: string = agreement.title || '';
    // #endregion Title

    return (
        <>
            {agreement.id > 0 ? (
                <>
                    <Grid container>
                        <Grid item xs>
                            <Text size="h2">
                                {Format.toString(resources.formatTitleEditing, [agreement.nameOriginal])}
                            </Text>
                            {agreement.status !== AgreementStatus.Active ? (
                                <StatusLabel
                                    id={`stat_${agreement.id}`}
                                    text={agreement.status === AgreementStatus.Publish ?
                                        resources.lblPublished
                                        : resources.lblNotActive}
                                    type={agreement.status === AgreementStatus.Publish
                                        ? 'success'
                                        : 'default'}
                                />
                            ) : undefined}
                        </Grid>
                    </Grid>
                    <br />
                </>
            ) : undefined}
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                disabled={agreement.status !== AgreementStatus.Active}
                                error={errorName}
                                helperText={errorTextName}
                                id="txtName"
                                label={resources.lblName}
                                maxCharacters={64}
                                required
                                value={valueName}
                                onChange={onChangeTextField}
                                onBlur={onBlurName}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={agreement.status !== AgreementStatus.Active}
                                error={errorTitle}
                                helperText={errorTextTitle}
                                id="txtTitle"
                                label={resources.lblTitle}
                                maxCharacters={255}
                                required
                                value={valueTitle}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={agreement.status !== AgreementStatus.Active}
                                error={errorContent}
                                helperText={errorTextContent}
                                id="txtContent"
                                label={resources.lblContent}
                                multiline
                                required
                                value={valueContent}
                                onChange={onChangeTextField}
                            />
                            <Text
                                color="textSecondary"
                                display="inline"
                            >
                                {resources.lblContentHelpText}
                            </Text>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                disabled={agreement.status !== AgreementStatus.Active}
                                error={errorAcceptance}
                                helperText={errorTextAcceptance}
                                id="txtAcceptance"
                                label={resources.lblAcceptance}
                                maxCharacters={255}
                                required
                                minRows={10}
                                value={valueAcceptance}
                                onChange={onChangeTextField}
                            />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Grid container>
                        <Grid item xs>
                            <Text size="h2">
                                {resources.lblPreview}
                            </Text>
                            <Divider />
                        </Grid>
                    </Grid>
                    <Card>
                        <CardContent>
                            <Grid container>
                                <Grid item xs={12}>
                                    <Text size="h2">
                                        {agreement.title}
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    <Text>
                                        <div dangerouslySetInnerHTML={{ __html: agreement.content }} />
                                    </Text>
                                </Grid>
                                <Grid item xs={12}>
                                    <Checkbox
                                        id="chkAcceptance"
                                        label={`${agreement.acceptance}*`}
                                    />
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs>
                    <ButtonGroup id="btgAgreement">
                        {agreement.status === AgreementStatus.Active ? (
                            <Button
                                id="btnSaveAgreement"
                                onClick={onSave}
                            >
                                {resources.btnSave}
                            </Button>
                        ) : undefined}
                        {agreement.status === AgreementStatus.Inactive
                            || agreement.status === AgreementStatus.Active ? (
                                <Button
                                    color={agreement.status === AgreementStatus.Active ?
                                        'secondary' : 'primary'}
                                    id="btnPublishAgreement"
                                    onClick={onPublish}
                                >
                                    {resources.btnPublish}
                                </Button>
                            ) : undefined}
                        {agreement.status === AgreementStatus.Publish ? (
                            <Button
                                disabled={isAssignedToRegistration}
                                id="btnDeactivateAgreement"
                                onClick={onDeactivate}
                            >
                                {resources.btnDeactivate}
                            </Button>
                        ) : undefined}
                        <Button
                            color="secondary"
                            id="btnCancelAgreement"
                            onClick={onCancel}
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
export default AgreementsEdit;