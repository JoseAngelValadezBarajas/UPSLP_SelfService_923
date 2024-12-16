/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: ChangePasswordModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import PasswordConfirmation from '@hedtech/powercampus-design-system/react/components/PasswordConfirmation';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IPasswordConfirmationResources } from '@hedtech/powercampus-design-system/types/PasswordConfirmation/IPasswordConfirmationResources';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, WithStyles, withStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion

// #region Internal types
export interface IChangePasswordModalProps {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    errorConfirmNewPassword: boolean;
    errorCurrentPassword: boolean;
    errorNewPassword: boolean;
    errorMessageConfirmNewPassword: string;
    errorMessageCurrentPassword: string;
    errorMessageNewPassword: string;
    validCurrentPassword: boolean;
    validNewPassword: boolean;
    validConfirmNewPassword: boolean;
    open: boolean;
    onChangeCurrentPassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeConfirmNewPassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onChangeNewPassword: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSavePassword: () => void;

    resources: IPasswordResetResProps;
}

export interface IPasswordResetResProps {
    lblCancelPassword: string;
    lblChangePwdLegend: string;
    lblCurrentPassword: string;
    lblCurrentPasswordError: string;
    lblCurrentPasswordInvalid: string;
    lblChangePassword: string;
    lblSavePassword: string;
    passwordConfirmation: IPasswordConfirmationResources;
    lblSuccess: string;
}

const styles = () => createStyles({
    marginLeft: {
        marginLeft: Tokens.sizingLarge
    }
});

type PropsWithStyles = IChangePasswordModalProps & WithStyles<typeof styles>;
// #endregion

// #region Component
const ChangePasswordModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        currentPassword,
        errorCurrentPassword,
        validCurrentPassword,
        open,
        resources,
        onChangeCurrentPassword,
        onClose,
        onSavePassword
    } = props;

    let contentTable: JSX.Element | undefined;
    contentTable = (
        <>
            <PasswordConfirmation
                topElements={[(
                    <Grid container>
                        <Grid item xs={12}>
                            <Text>
                                {resources.lblChangePwdLegend}
                            </Text>
                        </Grid>
                    </Grid>
                ), (
                    <Grid container>
                        <Grid item xs={12}>
                            <TextField
                                autoComplete="current-password"
                                id="txtCurrentPassword"
                                label={resources.lblCurrentPassword}
                                onChange={onChangeCurrentPassword}
                                value={currentPassword}
                                type="password"
                                passwordToggle={true}
                                error={!validCurrentPassword || errorCurrentPassword}
                                required={true}
                                helperText={errorCurrentPassword ? resources.lblCurrentPasswordError
                                    : !validCurrentPassword ? resources.lblCurrentPasswordInvalid : ''}
                            />
                        </Grid>
                    </Grid>
                )]}
                data={{ appArea: "Profile" }}
                resourcesToOverwrite={resources.passwordConfirmation}
                route="/Password/Policy"
            />
        </>
    );

    return (
        <Modal
            disableBackdropClick
            disableHeaderTypography
            id="changePasswordModal"
            footer={(
                <ButtonGroup id="btgChangePassword">
                    <Button
                        id="btnCancel"
                        color="secondary"
                        onClick={onClose}
                    >
                        {resources.lblCancelPassword}
                    </Button>
                    <Button
                        id="btnSave"
                        onClick={onSavePassword}
                    >
                        {resources.lblChangePassword}
                    </Button>
                </ButtonGroup>
            )}
            header={(
                <>
                    <Text size="h2">
                        {resources.lblChangePassword}
                    </Text>
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            {contentTable}
        </Modal>
    );

};
// #endregion

export default withStyles(styles)(ChangePasswordModal);