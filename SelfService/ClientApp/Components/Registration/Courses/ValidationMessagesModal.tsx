/* Copyright 2018 - 2023 Ellucian Company L.P. and its affiliates.
 * File: ValidationMessagesModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Types
import { IValidationMessage } from '../../../Types/Course/IValidationMessage';
// #endregion

// #region Internal types
export interface IValidationMessagesModalProps {
    open: boolean;
    validationMessages: IValidationMessage[];
    onClose: () => void;
    resources: IValidationMessagesModalResProps;
}

export interface IValidationMessagesModalResProps {
    lblFailed: string;
    lblOk: string;
}
// #endregion

// #region Component
const ValidationMessagesModal: React.FC<IValidationMessagesModalProps> = (props: IValidationMessagesModalProps): JSX.Element => {
    const {
        open,
        validationMessages,
        onClose,
        resources
    } = props;

    let currentSection: number = -1;
    const messages: JSX.Element[] = [];
    let subMessages: JSX.Element[] = [];
    if (validationMessages.length === 2) {
        messages.push(
            <Text key={`message_${1}`} >
                {validationMessages[1].description}
            </Text>);
    }
    else {
        validationMessages.forEach((item, i) => {
            if (item.sectionId !== currentSection) {
                currentSection = item.sectionId;
                if (subMessages.length > 0) {
                    messages.push(
                        <ul key={`ulMessage_${i}`}>
                            {subMessages}
                        </ul>);
                    subMessages = [];
                }
                messages.push(
                    <Text key={`message_${i}`} weight="strong">
                        {item.description}
                    </Text>);
            }
            else {
                subMessages.push(
                    <li key={`liMessage_${i}`}>
                        <Text weight="normal">
                            {item.description}
                        </Text>
                    </li>);
            }
        });
        if (subMessages.length > 0) {
            messages.push(
                <ul key={`ulMessage_${validationMessages.length}`}>
                    {subMessages}
                </ul>);
            subMessages = [];
        }
    }

    return (
        <Modal
            disableBackdropClick
            disableEscapeKeyDown
            id="validationMessagesModal"
            header={resources.lblFailed}
            maxWidth="md"
            footer={(
                <Button
                    id="btnOk"
                    onClick={onClose}
                >
                    {resources.lblOk}
                </Button>
            )}
            open={open}
            showTitleBarClose={true}
            onClose={onClose}
        >
            <Grid container spacing={3}>
                <Grid item xs>
                    {messages}
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion

// Export: Component
export default ValidationMessagesModal;