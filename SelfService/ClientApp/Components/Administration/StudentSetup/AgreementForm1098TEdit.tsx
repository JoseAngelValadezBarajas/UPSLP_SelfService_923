/* Copyright 2019 - 2022 Ellucian Company L.P. and its affiliates.
 * File: AgreementForm1098TEdit.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Checkbox from '@hedtech/powercampus-design-system/react/core/Checkbox';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Switch from '@hedtech/powercampus-design-system/react/core/Switch';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { AgreementStatus } from '../../../Types/Agreements/IAgreement';
import { IAgreementDetail } from '../../../Types/Agreements/IAgreementDetail';
import { IAgreementDetailValidations } from '../../../Types/Agreements/IAgreementDetailValidations';
// #endregion Imports

// #region Types
export interface IAgreementForm1098TEditProps {
    agreement: IAgreementDetail;
    agreementValidations: IAgreementDetailValidations;
    resources: IAgreementForm1098TEditResProps;
    onCancel: () => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeStatus: () => void;
    onSave: () => void;
}

export interface IAgreementForm1098TEditResProps {
    btnCancel: string;
    btnSave: string;
    lblAcceptance: string;
    lblAcceptanceRequired: string;
    lblAgreementTitle: string;
    lblContent: string;
    lblContentHelpText: string;
    lblContentRequired: string;
    lblEnable: string;
    lblGeneralTitle: string;
    lblPreview: string;
    lblTitle: string;
    lblTitleRequired: string;
}
// #endregion Types

// #region Component
const AgreementForm1098TEdit: React.FC<IAgreementForm1098TEditProps> = (props: IAgreementForm1098TEditProps): JSX.Element => {
    const {
        agreement,
        agreementValidations,
        resources,
        onCancel,
        onChangeTextField,
        onChangeStatus,
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
            <Grid container>
                <Grid item xs>
                    <Text size="h2">
                        {resources.lblGeneralTitle}
                    </Text>
                </Grid>
            </Grid>
            <Divider />
            {agreement.id > 0 && (
                <Grid container>
                    <Grid item xs>
                        <Switch
                            id="swtEnableAgreement"
                            checked={agreement.status !== AgreementStatus.Inactive}
                            label={resources.lblEnable}
                            onChange={onChangeStatus}
                        />
                    </Grid>
                </Grid>
            )}
            <Grid container>
                <Grid item xs>
                    <Text size="h2">
                        {resources.lblAgreementTitle}
                    </Text>
                </Grid>
            </Grid>
            <Divider />
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
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
                                error={errorContent}
                                helperText={errorTextContent}
                                id="txtContent"
                                label={resources.lblContent}
                                multiline
                                required
                                minRows={15}
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
                                error={errorAcceptance}
                                helperText={errorTextAcceptance}
                                id="txtAcceptance"
                                label={resources.lblAcceptance}
                                maxCharacters={255}
                                required
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
                        <Button
                            id="btnSaveAgreement"
                            onClick={onSave}
                        >
                            {resources.btnSave}
                        </Button>
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
export default AgreementForm1098TEdit;