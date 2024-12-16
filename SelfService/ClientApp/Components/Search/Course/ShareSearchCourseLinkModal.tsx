/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ShareSearchCourseLinkModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Types
import { IShareSearchCourseLinkModalResources } from '../../../Types/Resources/Search/ICourseResources';
// #endregion Imports

// #region Types
export interface IShareSearchCourseLinkModalProps {
    urlToShare: string;
    onCloseModal: () => void;
    open: boolean;

    resources: IShareSearchCourseLinkModalResources;
}
// #endregion Types

// #region Component
const ShareSearchCourseLinkModal: React.FC<IShareSearchCourseLinkModalProps> = (props: IShareSearchCourseLinkModalProps): JSX.Element => {
    const {
        open,
        urlToShare,
        onCloseModal,

        resources
    } = props;

    return (
        <Modal
            disableBackdropClick
            footer={(
                <Button
                    id={'btnOk'}
                    onClick={onCloseModal}
                >
                    {resources.btnOk}
                </Button>
            )}
            id="shareSearchCourseLink"
            header={resources.lblTitle}
            maxWidth="md"
            open={open}
            onClose={onCloseModal}
        >
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <TextField
                        id="txtUrlToShare"
                        label={resources.lblUrlToShare}
                        type="text"
                        value={urlToShare || ''}
                    />
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default ShareSearchCourseLinkModal;