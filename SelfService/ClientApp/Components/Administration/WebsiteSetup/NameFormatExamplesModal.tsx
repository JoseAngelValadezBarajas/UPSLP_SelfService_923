/* Copyright 2021 Ellucian Company L.P. and its affiliates.
 * File: NameFormatExamplesModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { INameFormatExample } from '../../../Types/NameFormat/INameFormatExample';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';
// #endregion Imports

// #region Types
export interface INameFormatExamplesModalProps {
    examples: INameFormatExample[];
    resources: INameFormatExamplesModalResProps;
    onSave: () => void;
    onCancel: () => void;
    onChangeTextField: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface INameFormatExamplesModalResProps {
    btnCancel: string;
    btnSave: string;
    formatExample: string;
    lblDisplayName: string;
    lblFirstName: string;
    lblInstructions: string;
    lblLastName: string;
    lblLastNamePrefix: string;
    lblMiddleName: string;
    lblPrefix: string;
    lblPreview: string;
    lblPronoun: string;
    lblSetExample: string;
    lblSuffix: string;
}
// #endregion Types

// #region Component
const NameFormatExamplesModal: React.FC<INameFormatExamplesModalProps> = (props: INameFormatExamplesModalProps): JSX.Element => {
    const {
        resources,
        examples,
        onCancel,
        onChangeTextField,
        onSave
    } = props;

    return (
        <Modal
            footer={(
                <ButtonGroup id="bgSetExample">
                    <Button
                        color="secondary"
                        id="btnCancel"
                        onClick={onCancel}
                    >
                        {resources.btnCancel}
                    </Button>
                    <Button
                        id="btnSave"
                        onClick={onSave}
                    >
                        {resources.btnSave}
                    </Button>
                </ButtonGroup>
            )}
            id="SetExampleModal"
            header={resources.lblSetExample}
            maxWidth="lg"
            open={open}
            onClose={onCancel}
        >
            <Grid container>
                <Grid item xs={12}>
                    <Text>
                        {resources.lblInstructions}
                    </Text>
                </Grid>
                <Grid item xs={12}>
                    {examples.map((example, iExample) => (
                        <ExpansionPanel
                            id={`epnlExample_${iExample}`}
                            key={`epnlExample_${iExample}`}
                            header={(
                                <Text size="h4" weight="strong">
                                    {Format.toString(resources.formatExample, [iExample + 1])}
                                </Text>
                            )}
                        >
                            <Grid container>
                                <Grid item xs={12} sm={6}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtPrefix_${iExample}`}
                                                label={resources.lblPrefix}
                                                maxCharacters={15}
                                                value={example.prefix}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtFirstName_${iExample}`}
                                                label={resources.lblFirstName}
                                                maxCharacters={60}
                                                value={example.firstName}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtMiddleName_${iExample}`}
                                                label={resources.lblMiddleName}
                                                maxCharacters={60}
                                                value={example.middleName}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtLastNamePrefix_${iExample}`}
                                                label={resources.lblLastNamePrefix}
                                                maxCharacters={60}
                                                value={example.lastNamePrefix}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <Grid container>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtLastName_${iExample}`}
                                                label={resources.lblLastName}
                                                maxCharacters={60}
                                                value={example.lastName}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtSuffix_${iExample}`}
                                                label={resources.lblSuffix}
                                                maxCharacters={15}
                                                value={example.suffix}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtDisplayName_${iExample}`}
                                                label={resources.lblDisplayName}
                                                maxCharacters={60}
                                                value={example.displayName}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                id={`txtPronoun_${iExample}`}
                                                label={resources.lblPronoun}
                                                maxCharacters={20}
                                                value={example.pronoun}
                                                onChange={onChangeTextField}
                                            />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </ExpansionPanel>
                    ))}
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default NameFormatExamplesModal;