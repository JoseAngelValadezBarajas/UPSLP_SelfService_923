/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: AreasSetup.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button, { ButtonGroup } from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Chip from '@hedtech/powercampus-design-system/react/core/Chip';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Dropdown from '@hedtech/powercampus-design-system/react/core/Dropdown';
import ExpansionPanel from '@hedtech/powercampus-design-system/react/core/ExpansionPanel';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import StatusLabel from '@hedtech/powercampus-design-system/react/core/StatusLabel';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// Types
import { IDropDownOption } from '@hedtech/powercampus-design-system/types/IDropDownOption';
import { INotificationsEventsDetails } from '../../../Types/Notifications/INotificationsEventsDetails';
import { INotificationsTypes } from '../../../Types/Notifications/INotificationsTypes';
import { INotificationsTypesSetup } from '../../../Types/Notifications/INotificationsTypesSetup';
import { INotificationsSetupResources } from '../../../Types/Resources/Administration/INotificationsSetupResources';
// #endregion

// #region Internal types
export interface IAreasSetupProps {
    areasList: INotificationsEventsDetails;
    areaName: string;
    isCcoRequired: boolean;
    isFromRequired: boolean;
    isMessageRequired: boolean;
    isSubjectRequired: boolean;
    isToRequired: boolean;
    notificationsTypes: INotificationsTypes;
    notificationsTypesSetup: INotificationsTypesSetup;
    typeSelected: any;
    onCancel: () => void;
    onChangeDropdown: (optionSelected: IDropDownOption, id: string) => void;
    onChangeEnable: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickChip: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClickChipSubject: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onSave: () => void;
    onTextFieldChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    resources: INotificationsSetupResources;
}

// #endregion

// #region Component
const AreasSetup: React.FC<IAreasSetupProps> = (props: IAreasSetupProps): JSX.Element => {
    const {
        areasList,
        areaName,
        isCcoRequired,
        isFromRequired,
        isMessageRequired,
        isSubjectRequired,
        isToRequired,
        notificationsTypes,
        notificationsTypesSetup,
        typeSelected,
        onCancel,
        onChangeDropdown,
        onClickChip,
        onClickChipSubject,
        onSave,
        onTextFieldChange,

        resources
    } = props;

    let isFrom: boolean = false;
    let isTo: boolean = false;
    let isCco: boolean = false;
    let isSubject: boolean = false;
    let isMessage: boolean = false;
    let lengthCco: number = 0;
    let lengthFrom: number = 0;
    let lengthMessage: number = 0;
    let lengthSubject: number = 0;
    let lenghtTo: number = 0;
    if (notificationsTypes.notificationTypes) {
        notificationsTypes.notificationTypes.forEach(type => {
            if (type.value === 1) {
                type.description = resources.lblEmail;
            }
            else {
                type.description = resources.lblSms;
            }
            notificationsTypes.notificationTypes.push();
        });
        notificationsTypes.notificationTypesDetails.forEach(typesDetails => {
            typesDetails.notificationTemplate.forEach(detail => {
                switch (detail.id) {
                    case 'from':
                        isFrom = detail.isRequired;
                        lengthFrom = detail.length;
                        break;
                    case 'to':
                        isTo = detail.isRequired;
                        lenghtTo = detail.length;
                        break;
                    case 'cco':
                        isCco = detail.isRequired;
                        lengthCco = detail.length;
                        break;
                    case 'subject':
                        isSubject = detail.isRequired;
                        lengthSubject = detail.length;
                        break;
                    case 'message':
                        isMessage = detail.isRequired;
                        lengthMessage = detail.length;
                        break;
                }
            });
        });
    }
    const contentSubjectChip: JSX.Element[] | undefined = [];
    let headerSubject: JSX.Element | undefined;
    headerSubject = (
        <Grid container>
            <Grid item>
                <Text size="h3">
                    {resources.lblSubjectTokens}
                </Text>
            </Grid>
        </Grid>
    );

    let containerSubject: JSX.Element | undefined;
    let containerContentSubject: JSX.Element | undefined;
    areasList.tokenGroupDetail.forEach((token, i) => {
        if (!token.isCollection) {
            contentSubjectChip.push(
                <React.Fragment key={`tokenSubject_${i}`}>
                    <Hidden smDown>
                        <Grid item>
                            <Chip
                                activated
                                clickable
                                id={`chpTokenSubject_${token.tokenKey}_${token.isCollection}`}
                                label={token.tokenKey}
                                onClick={onClickChipSubject}
                            />
                        </Grid>
                    </Hidden>
                    <Hidden smUp>
                        <Grid item xs={12}>
                            <Chip
                                activated
                                clickable
                                id={`chpTokenSubject_${token.tokenKey}_${token.isCollection}`}
                                label={token.tokenKey}
                                onClick={onClickChip}
                            />
                        </Grid>
                    </Hidden>
                </React.Fragment>
            );
        }
    });

    if (contentSubjectChip.length > 0) {
        containerContentSubject = (
            <Grid container>
                {contentSubjectChip}
            </Grid>
        );
    }

    containerSubject = (
        <ExpansionPanel
            key="eventsSubjectTokens"
            header={headerSubject}
        >
            {containerContentSubject}
        </ExpansionPanel>
    );

    let headerMessage: JSX.Element | undefined;
    let containerMessage: JSX.Element | undefined;
    let containerContentMessage: JSX.Element | undefined;
    const contentMessage: JSX.Element[] = [];
    headerMessage = (
        <Grid container>
            <Grid item>
                <Text size="h3">
                    {resources.lblMessageTokens}
                </Text>
            </Grid>
        </Grid>
    );

    areasList.tokenGroupDetail.forEach((token, i) => {
        contentMessage.push(
            <Grid item key={`token_${i}`}>
                <Chip
                    activated
                    id={`chpTokenMessage_${token.tokenKey}_${token.isCollection}`}
                    label={token.tokenKey}
                    onClick={onClickChip}
                />
            </Grid>
        );
    });

    if (contentMessage.length > 0) {
        containerContentMessage = (
            <Grid container>
                {contentMessage}
            </Grid>
        );
    }

    containerMessage = (
        <ExpansionPanel
            key="eventsMessageTokens"
            header={headerMessage}
        >
            {containerContentMessage}
        </ExpansionPanel>
    );

    let content: JSX.Element | undefined;
    content = (
        <>
            <Grid container>
                <Grid item xs>
                    <Text size="h2">
                        {Format.toString(resources.formatEditingMessage, [areasList.eventName])}
                    </Text>
                    <Divider />
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs>
                    <Text size="h3">
                        {resources.lblGeneralInformation}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Text>
                        {Format.toString(resources.formatMessage, [areasList.eventName])}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Text>
                        {resources.formatStatus}
                        <StatusLabel
                            id={`stsLbl_${areasList.eventId}`}
                            text={areasList.isActive ? resources.lblEnabled : resources.lblDisabled}
                            type={areasList.isActive ? 'success' : 'draft'}
                        />
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Text>
                        {Format.toString(resources.formatArea, [areaName])}
                    </Text>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Text>
                        {Format.toString(resources.formatTypes, [areasList.eventTypes])}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs>
                    <Text>
                        {Format.toString(resources.formatDescription, [areasList.eventDescription])}
                    </Text>
                    <Divider />
                </Grid>
            </Grid>
            <br />
            <Grid container>
                <Grid item xs>
                    <Text size="h2">
                        {resources.lblSetupMessage}
                    </Text>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12} md={6}>
                    <Dropdown
                        id="ddlType"
                        label={resources.lblType}
                        options={notificationsTypes.notificationTypes}
                        value={typeSelected ? typeSelected.value : notificationsTypes.notificationTypes[0].value}
                        onChange={onChangeDropdown}
                    />
                </Grid>
            </Grid>
            {typeSelected && typeSelected.value === 2 ?
                (
                    <>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    id="txtTo"
                                    label={resources.lblTo}
                                    type="text"
                                    value={notificationsTypesSetup.to}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    id="txtMessage"
                                    label={resources.lblMessage}
                                    multiline
                                    type="text"
                                    value={notificationsTypesSetup.message}
                                    onChange={onTextFieldChange}
                                />
                                <Divider />
                            </Grid>
                        </Grid>
                    </>
                )
                :
                (
                    <>
                        <Grid container>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    error={isFromRequired}
                                    helperText={isFromRequired ? resources.lblFromRequired : ''}
                                    id="txtFrom"
                                    label={resources.lblFrom}
                                    maxCharacters={lengthFrom}
                                    required={isFrom}
                                    type="text"
                                    value={notificationsTypesSetup.from}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={isToRequired}
                                    helperText={isToRequired ? resources.lblToRequired : ''}
                                    id="txtTo"
                                    label={resources.lblTo}
                                    maxCharacters={lenghtTo}
                                    required={isTo}
                                    type="text"
                                    value={notificationsTypesSetup.to}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={isCcoRequired}
                                    helperText={isCcoRequired ? resources.lblCcoRequired : ''}
                                    id="txtCco"
                                    label={resources.lblCco}
                                    maxCharacters={lengthCco}
                                    required={isCco}
                                    type="text"
                                    value={notificationsTypesSetup.cco}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                {containerSubject}
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs={12} md={12}>
                                <TextField
                                    error={isSubjectRequired}
                                    helperText={isSubjectRequired ? resources.lblSubjectRequired : ''}
                                    id="txtSubject"
                                    label={resources.lblSubject}
                                    maxCharacters={lengthSubject}
                                    required={isSubject}
                                    type="text"
                                    value={notificationsTypesSetup.subject}
                                    onChange={onTextFieldChange}
                                />
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs>
                                {containerMessage}
                            </Grid>
                        </Grid>
                        <br />
                        <Grid container>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    error={isMessageRequired}
                                    helperText={isMessageRequired ? resources.lblMessageRequired : ''}
                                    id="txtMessage"
                                    label={resources.lblMessage}
                                    maxCharacters={lengthMessage}
                                    multiline
                                    required={isMessage}
                                    minRows={15}
                                    type="text"
                                    value={notificationsTypesSetup.message}
                                    onChange={onTextFieldChange}
                                />
                                <Text>
                                    {resources.lblMessageLegend}
                                </Text>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Text>
                                    {resources.lblPreview}
                                </Text>
                                <Card>
                                    <CardContent>
                                        <Text>
                                            <div
                                                dangerouslySetInnerHTML={
                                                    {
                                                        __html: notificationsTypesSetup.message ?
                                                            notificationsTypesSetup.message : ''
                                                    }
                                                }
                                            />
                                        </Text>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </>
                )
            }
            <br />
            <Grid container justifyContent="flex-end">
                <Grid item xs>
                    <ButtonGroup id="btgActions">
                        <Button
                            id="btnSave"
                            onClick={onSave}
                        >
                            {resources.btnSave}
                        </Button>
                        <Button
                            color="secondary"
                            id="btnCancel"
                            onClick={onCancel}
                        >
                            {resources.btnCancel}
                        </Button>
                    </ButtonGroup>
                </Grid>
            </Grid>
        </>
    );

    return (
        <>
            {content}
        </>
    );
};
// #endregion

// Export: Component
export default AreasSetup;