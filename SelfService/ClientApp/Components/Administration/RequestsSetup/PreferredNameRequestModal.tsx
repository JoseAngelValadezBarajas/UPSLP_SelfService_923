/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PreferredNameRequestsModal.tsx
 * Type: Container component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';

// Types
import { IPreferredName } from '../../../Types/Account/IPreferredName';
import { IPreferredNameRequestsResources } from '../../../Types/Resources/Administration/IPreferredNameRequestsResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IPreferredNameRequestsModalProps {
    isOpenModal: boolean;
    open: boolean;
    preferredNameInfo?: IPreferredName;
    resources: IPreferredNameRequestsResources;
    studentName: string;
    onApproveRequest: () => void;
    onCancelRequest: () => void;
    onDenyRequest: () => void;
    onClose: () => void;
}

const styles = createStyles({
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    rowHeader: {
        marginRight: Tokens.spacing40
    }
});

type PropsWithStyles = IPreferredNameRequestsModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DemographicRequestsModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        open,
        preferredNameInfo,
        studentName,
        onApproveRequest,
        onCancelRequest,
        onClose,
        onDenyRequest,

        resources
    } = props;

    let contentPage: JSX.Element | undefined;
    if (resources && preferredNameInfo) {
        contentPage = (
            <>
                <Table layout={{ variant: 'card', breakpoint: 'sm' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell columnName={resources.lblCurrent}>
                                {resources.lblCurrent}
                            </TableCell>
                            <TableCell>
                                {resources.lblUpdatedPending}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow>
                            <TableCell>
                                <Text
                                    display="inline"
                                    weight="strong"
                                    className={classes.rowHeader}
                                >
                                    {resources.lblDisplayName}
                                </Text>
                                {preferredNameInfo.genderIdentity.displayName !==
                                    preferredNameInfo.genderIdentity.pendingGenderIdentity.displayName ?
                                    (
                                        <StatusLabel
                                            id="stsDisplayName"
                                            text={resources.lblUpdated}
                                            type="draft"
                                        />
                                    ) : undefined
                                }
                            </TableCell>
                            <TableCell columnName={resources.lblCurrent}>
                                {preferredNameInfo.genderIdentity.displayName}
                            </TableCell>
                            <TableCell columnName={resources.lblUpdatedPending}>
                                {preferredNameInfo.genderIdentity.pendingGenderIdentity.displayName}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Text
                                    display="inline"
                                    weight="strong"
                                    className={classes.rowHeader}
                                >
                                    {resources.lblGenderIdentity}
                                </Text>
                                {preferredNameInfo.genderIdentity.description !==
                                    preferredNameInfo.genderIdentity.pendingGenderIdentity.description ?
                                    (
                                        <StatusLabel
                                            id="stsDisplayName"
                                            text={resources.lblUpdated}
                                            type="draft"
                                        />
                                    )
                                    : undefined
                                }
                            </TableCell>
                            <TableCell columnName={resources.lblCurrent}>
                                {preferredNameInfo.genderIdentity.description}
                            </TableCell>
                            <TableCell columnName={resources.lblUpdatedPending}>
                                {preferredNameInfo.genderIdentity.pendingGenderIdentity.description}
                            </TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>
                                <Text
                                    display="inline"
                                    weight="strong"
                                    className={classes.rowHeader}
                                >
                                    {resources.lblPronoun}
                                </Text>
                                {preferredNameInfo.genderIdentity.pronounDesc !==
                                    preferredNameInfo.genderIdentity.pendingGenderIdentity.pronounDesc ?
                                    (
                                        <StatusLabel
                                            id="stsDisplayName"
                                            text={resources.lblUpdated}
                                            type="draft"
                                        />
                                    ) : undefined
                                }
                            </TableCell>
                            <TableCell columnName={resources.lblCurrent}>
                                {preferredNameInfo.genderIdentity.pronounDesc}
                            </TableCell>
                            <TableCell columnName={resources.lblUpdatedPending}>
                                {preferredNameInfo.genderIdentity.pendingGenderIdentity.pronounDesc}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </>
        );
    }

    const footerModal: JSX.Element = (
        <ButtonGroup id="btgPreferredNameRequests">
            <Button
                id="btnCancel"
                color="secondary"
                onClick={onCancelRequest}
            >
                {resources.btnCancel}
            </Button>
            <Button
                id="btnDeny"
                color="secondary"
                onClick={onDenyRequest}
            >
                {resources.btnDeny}
            </Button>
            <Button
                id="btnApprove"
                onClick={onApproveRequest}
            >
                {resources.btnApprove}
            </Button>
        </ButtonGroup>
    );

    return (
        <Modal
            disableBackdropClick
            disableHeaderTypography
            id="demographicRequestsModal"
            footer={footerModal}
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatModalTitle, [studentName])}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <Grid container>
                <Grid item xs={12}>
                    {contentPage}
                </Grid>
            </Grid>
        </Modal>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(DemographicRequestsModal);