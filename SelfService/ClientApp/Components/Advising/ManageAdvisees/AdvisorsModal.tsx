/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: AdvisorsModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Types
import { IAvatar } from '@hedtech/powercampus-design-system/types/IAvatar';

// Core components
import { AvatarText } from '@hedtech/powercampus-design-system/react/core/Avatar';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
// #endregion Imports

// #region Types
export interface IAdvisorsModalProps {
    advisors: IAvatar[];
    hasDossierClaim: boolean;
    lblSharedWith: string;
    open: boolean;
    onClose: (modalName: string) => void;
    onViewDossier: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

// #endregion Types

// #region Component
const AdvisorsModal: React.FC<IAdvisorsModalProps> = (props: IAdvisorsModalProps): JSX.Element => {
    const {
        advisors,
        lblSharedWith,
        hasDossierClaim,
        open,
        onClose,
        onViewDossier
    } = props;

    const onCloseModal = (): void => {
        onClose('Advisors');
    };

    return (
        <Modal
            id="adviseesSearchModal"
            header={lblSharedWith}
            maxWidth="md"
            open={open}
            onClose={onCloseModal}
        >
            <>
                <br />
                <Grid container>
                    {advisors.map(advisor => (
                        <Grid item xs={12} key={advisor.personId}>
                            <AvatarText
                                ButtonProps={hasDossierClaim ? {
                                    'data-id': advisor.personId,
                                    id: `btnShareDossier_${advisor.personId}`,
                                    onClick: onViewDossier
                                } : undefined}
                                avatarInfo={advisor}
                            />
                            <Divider noMarginBottom />
                        </Grid>
                    ))}
                </Grid>
            </>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default AdvisorsModal;