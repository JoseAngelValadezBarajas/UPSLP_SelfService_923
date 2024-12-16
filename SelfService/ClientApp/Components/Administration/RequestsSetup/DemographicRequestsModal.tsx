/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: DemographicRequestsModal.tsx
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
import { GenderType } from '../../../Types/Account/GenderType';
import { IDemographicMain } from '../../../Types/Account/IDemographicMain';
import { RetirementStatus } from '../../../Types/Account/RetirementStatus';
import { IDemographicRequestsResources } from '../../../Types/Resources/Administration/IDemographicRequestsResources';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// #endregion Imports

// #region Types
export interface IDemographicRequestsModalProps {
    demographicFormId: number;
    demographicInfo?: IDemographicMain;
    isOpenModal: boolean;
    open: boolean;
    studentName: string;
    onApproveRequest: () => void;
    onCancelRequest: () => void;
    onDenyRequest: () => void;
    onClose: () => void;

    resources: IDemographicRequestsResources;
}

const styles = createStyles({
    cardContainerTop: {
        marginTop: Tokens.spacing40
    },
    rowHeader: {
        marginRight: Tokens.spacing40
    }
});

type PropsWithStyles = IDemographicRequestsModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const DemographicRequestsModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {

    const {
        classes,
        demographicInfo,
        open,
        studentName,
        onApproveRequest,
        onCancelRequest,
        onClose,
        onDenyRequest,

        resources
    } = props;

    let contentPage: JSX.Element | undefined;
    if (resources && demographicInfo && demographicInfo.demographicViewModelList.length > 0) {
        let label: string;
        let pendingDescription: string;
        let description: string;
        const contentTable: JSX.Element[] | undefined = [];
        demographicInfo.demographicViewModelList.map((info, i) => {
            label = '';
            description = info.description;
            pendingDescription = info.pendingDescription;
            if (description !== pendingDescription) {
                info.isDifferent = true;
            }
            // Cases based on ids defined in ViewModal
            switch (info.id) {
                case 'gender':
                    label = resources.lblGender;
                    switch (info.description) {
                        case GenderType.female:
                            description = resources.lblFemale;
                            pendingDescription = resources.lblFemale;
                            break;
                        case GenderType.male:
                            description = resources.lblMale;
                            pendingDescription = resources.lblMale;
                            break;
                        case GenderType.unknown:
                            description = resources.lblUnknown;
                            pendingDescription = resources.lblUnknown;
                            break;
                    }
                    if (info.isDifferent) {
                        switch (info.pendingDescription) {
                            case GenderType.female:
                                pendingDescription = resources.lblFemale;
                                break;
                            case GenderType.male:
                                pendingDescription = resources.lblMale;
                                break;
                            case GenderType.unknown:
                                pendingDescription = resources.lblUnknown;
                                break;
                        }
                    }
                    break;
                case 'ethnicity':
                    label = resources.lblEthnicity;
                    break;
                case 'maritalStatus':
                    label = resources.lblMaritalStatus;
                    break;
                case 'religion':
                    label = resources.lblReligion;
                    break;
                case 'retirementStatus':
                    label = resources.lblRetired;
                    switch (info.description) {
                        case RetirementStatus.no:
                            description = resources.lblNo;
                            pendingDescription = resources.lblNo;
                            break;
                        case RetirementStatus.yes:
                            description = resources.lblYes;
                            pendingDescription = resources.lblYes;
                            break;
                        case RetirementStatus.unknown:
                            description = resources.lblUnknown;
                            pendingDescription = resources.lblUnknown;
                            break;
                    }
                    if (info.isDifferent) {
                        switch (info.pendingDescription) {
                            case RetirementStatus.no:
                                pendingDescription = resources.lblNo;
                                break;
                            case RetirementStatus.yes:
                                pendingDescription = resources.lblYes;
                                break;
                            case RetirementStatus.unknown:
                                pendingDescription = resources.lblUnknown;
                                break;
                        }
                    }
                    break;
                case 'veteran':
                    label = resources.lblVeteran;
                    break;
                case 'primaryCitizenship':
                    label = resources.lblCitizenship;
                    break;
                case 'secondaryCitizenship':
                    label = resources.lblCitizenshipSecondary;
                    break;
                case 'visa':
                    label = resources.lblVisa;
                    break;
                case 'countryOfBirth':
                    label = resources.lblCountryOfBirth;
                    break;
                case 'primaryLanguage':
                    label = resources.lblLanguage;
                    break;
                case 'secondaryLanguage':
                    label = resources.lblLanguageSecondary;
                    break;
                case 'monthsInCountry':
                    label = resources.lblMonthsInCountry;
                    break;
            }
            contentTable.push(
                <TableRow>
                    <TableCell>
                        <Text
                            display="inline"
                            weight="strong"
                            className={classes.rowHeader }
                        >
                            {label}
                        </Text>
                        { info.isDifferent ?
                        (
                        <StatusLabel
                            id={`stsUpdatedRow_${i}`}
                            text={resources.lblUpdated}
                            type="draft"
                        />
                        ) : undefined }
                    </TableCell>
                    <TableCell columnName={resources.lblCurrent }>
                        {description }
                    </TableCell>
                    <TableCell columnName={resources.lblUpdatedPending}>
                        {pendingDescription }
                    </TableCell>
                </TableRow>
            );
        });

        contentPage = (
            <>
                <Table
                    layout={{ variant: 'card', breakpoint: 'sm' }}
                >
                    <TableHead>
                        <TableRow>
                            <TableCell />
                            <TableCell>
                                {resources.lblCurrent}
                            </TableCell>
                            <TableCell>
                                {resources.lblUpdatedPending}
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contentTable}
                    </TableBody>
                </Table>
            </>
        );
    }

    let footerModal: JSX.Element;
    footerModal = (
        <ButtonGroup id="btgEditDemographic">
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