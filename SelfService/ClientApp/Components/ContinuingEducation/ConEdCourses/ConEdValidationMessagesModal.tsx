/* Copyright 2018 - 2019 Ellucian Company L.P. and its affiliates.
 * File: ConEdValidationMessagesModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
// #endregion

// #region Internal types
export interface IConEdValidationMessagesModalProps {
    open: boolean;
    resources: IConEdValidationMessagesModalResProps;
    sectionsDateConflict: string[];
    type: 'register' | 'drop';
    onClose: () => void;
}

export interface IConEdValidationMessagesModalResProps {
    btnOk: string;
    formatDropValidationTitle: string;
    formatRegistrationValidationTitle: string;
    lblDropFailed: string;
    lblDropValidationReason: string;
    lblRegistrationFailed: string;
    lblRegistrationValidationMessage: string;
    lblRegistrationValidationReason: string;
}
// #endregion

// #region Component
const ConEdValidationMessagesModal: React.FC<IConEdValidationMessagesModalProps> = (props: IConEdValidationMessagesModalProps): JSX.Element => {
    const {
        open,
        resources,
        sectionsDateConflict,
        type,
        onClose
    } = props;

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            id="validationMessagesModal"
            header={type === 'register' ? resources.lblRegistrationFailed : resources.lblDropFailed}
            maxWidth="md"
            footer={(
                <Button
                    id={'btnOk'}
                    onClick={onClose}
                >
                    {resources.btnOk}
                </Button>
            )}
            open={open}
            showTitleBarClose={false}
            onClose={onClose}
        >
            <Grid container>
                {type === 'register' && (
                    <Grid item xs={12}>
                        <Text>
                            {resources.lblRegistrationValidationMessage}
                        </Text>
                    </Grid>
                )}
                {sectionsDateConflict.map((sectionName, sni) => (
                    <Grid item key={`sectionFailed_${sni}`} xs={12}>
                        <Text>
                            {Format.toString(type === 'register' ?
                                resources.formatRegistrationValidationTitle
                                : resources.formatDropValidationTitle, [sectionName])}
                        </Text>
                        <ul>
                            <li>
                                <Text>
                                    {type === 'register' ?
                                        resources.lblRegistrationValidationReason
                                        : resources.lblDropValidationReason}
                                </Text>
                            </li>
                        </ul>
                    </Grid>
                ))}
            </Grid>
        </Modal>
    );
};
// #endregion

// Export: Component
export default ConEdValidationMessagesModal;