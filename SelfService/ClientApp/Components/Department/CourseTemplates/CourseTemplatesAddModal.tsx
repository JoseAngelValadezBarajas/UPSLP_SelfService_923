/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: CourseTemplatesAddModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Generic components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { ICourseTemplatesResources } from '../../../Types/Resources/Department/ICourseTemplatesResources';
// #endregion Imports

// #region Types
export interface ICourseTemplatesAddModalProps {
    errorTemplateName: boolean;
    existTemplateName: boolean;
    open: boolean;
    onCancel: () => void;
    onClose: () => void;
    onSave: () => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resources: ICourseTemplatesResources;
}

const styles = () => createStyles({
    buttonFooter: {
        textAlign: 'right'
    },
    containerFooter: {
        width: '100%'
    },
    messageMargin: {
        marginTop: Tokens.sizingLarge
    }
});

type PropsWithStyles = ICourseTemplatesAddModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const CourseTemplatesAddModalModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        errorTemplateName,
        existTemplateName,
        open,
        onCancel,
        onClose,
        onSave,
        onTextFieldChange,

        resources
    } = props;

    let body: JSX.Element | undefined;
    let footerModal: JSX.Element;
    let contentPage: JSX.Element | undefined;
    if (resources) {
        body = (
            <Grid container>
                <Grid item xs={12}>
                    <TextField
                        error={errorTemplateName || existTemplateName}
                        id="txtTemplateName"
                        helperText={errorTemplateName ? resources.lblEnterTemplateName : existTemplateName ? resources.lblExistTemplateName : ''}
                        label={resources.lblTemplates}
                        onChange={onTextFieldChange}
                    />
                </Grid>
            </Grid>
        );

        footerModal = (
            <ButtonGroup id="btgAddTemplate">
                <Button
                    id="btnCancel"
                    color="secondary"
                    onClick={onCancel}
                >
                    {resources.btnCancel}
                </Button>
                <Button
                    id="btnApprove"
                    onClick={onSave}
                >
                    {resources.btnSave}
                </Button>
            </ButtonGroup>
        );

        contentPage = (
            <Modal
                disableBackdropClick
                disableEscapeKeyDown
                id="courseTemplatesAddModal"
                footer={footerModal}
                header={(
                    <div>
                        <Text size="h2">
                            {resources.lblAddTemplate}
                        </Text>
                    </div>
                )}
                maxWidth="md"
                open={open}
                onClose={onClose}
            >
                {body}
            </Modal>
        );
    }

    return (
        <>
            {contentPage}
        </>
    );
};
// #endregion

export default withStyles(styles)(CourseTemplatesAddModalModal);