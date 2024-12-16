/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: Attachments.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
// import Hidden from '@hedtech/powercampus-design-system/react/core/Hidden';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
// import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
// import MessageStyled from '@hedtech/powercampus-design-system/react/core/MessageStyled';
// import Table, { TableBody, TableCell, TableHead, TableRow } from '@hedtech/powercampus-design-system/react/core/Table';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
// import Tooltip from '@hedtech/powercampus-design-system/react/core/Tooltip';

// Helpers
// import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IApplicationAttachment } from '../../../Types/Applications/IApplicationAttachment';
import { IAttachments } from '../../../Types/Resources/Admissions/IApplicationFormResources';
// #endregion Imports
// #region Types

export interface IAttachmentProps {
    attachments?: IApplicationAttachment[];
    numberOfAttachments: number;
    totalSize?: string;
    onClickContinue: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickInfo: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickOpenFolder: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickRemoveAttachment: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onPagoRefer: () => void;
    resources: IAttachments;
}

const styles = (theme: Theme) => createStyles({
    buttonContainer: {
        marginTop: Tokens.spacing50
    },
    buttonStep: {
        marginRight: Tokens.spacing40
    },
    icon: {
        color: theme.palette.action.active,
        cursor: 'pointer'
    },
    inline: {
        display: 'inline'
    },
    marginLeft: {
        display: 'inline',
        marginLeft: Tokens.sizingSmall
    },
    marginRigth: {
        display: 'inline',
        marginRigth: Tokens.sizingSmall
    },
    table: {
        '& > tbody > tr > th:nth-child(1)': {
            width: '70%'
        },
        '& > tbody > tr > th:nth-child(2)': {
            width: '10%'
        },
        '& > tbody > tr > th:nth-child(3)': {
            width: '10%'
        },
        '& > tbody > tr > th:nth-child(4)': {
            width: '10%'
        }
    }
});

type PropsWithStyles = IAttachmentProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const Attachment: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        onClickContinue,
        onPagoRefer,
        resources
    } = props;

    // let table: JSX.Element | undefined;
    // if (attachments && attachments.length > 0) {
    //    table = (
    //        <Table
    //            breakpoint="sm"
    //            classes={{ root: classes.table }}
    //            id="tblList"
    //        >
    //            <TableHead>
    //                <TableRow>
    //                    <TableCell component="th">
    //                        {resources.lblName}
    //                    </TableCell>
    //                    <TableCell component="th">
    //                        {resources.lblType}
    //                    </TableCell>
    //                    <TableCell component="th">
    //                        {resources.lblSize}
    //                    </TableCell>
    //                    <TableCell component="th">
    //                        {resources.lblDelete}
    //                    </TableCell>
    //                </TableRow>
    //            </TableHead>
    //            <TableBody>
    //                {attachments.map((attachment, i) => (
    //                    <TableRow
    //                        key={`row_${i}`}
    //                    >
    //                        <TableCell
    //                            columnName={resources.lblName}
    //                            scope="row"
    //                        >
    //                            <Text>
    //                                {attachment.attachmentTitle}
    //                            </Text>
    //                        </TableCell>
    //                        <TableCell
    //                            columnName={resources.lblType}
    //                            scope="row"
    //                        >
    //                            <Text>
    //                                {attachment.extension}
    //                            </Text>
    //                        </TableCell>
    //                        <TableCell
    //                            columnName={resources.lblSize}
    //                            scope="row"
    //                        >
    //                            <Text>
    //                                {attachment.fileSize}
    //                            </Text>
    //                        </TableCell>
    //                        <TableCell
    //                            columnName={resources.lblDelete}
    //                            scope="row"
    //                        >
    //                            <Tooltip
    //                                id="DeleteIcon"
    //                                placement="top"
    //                                title="Remove"
    //                            >
    //                                <IconButton
    //                                    color="secondary"
    //                                    id={`deleteButton|${attachment.applicationAttachmentId}|${attachment.attachmentTitle}${attachment.extension}`}
    //                                    onClick={onClickRemoveAttachment}
    //                                >
    //                                    <Icon name="trash" />
    //                                </IconButton>
    //                            </Tooltip>
    //                        </TableCell>
    //                    </TableRow>
    //                ))}
    //            </TableBody>
    //        </Table>
    //    );
    // }

    let content: JSX.Element | undefined;
    if (resources) {
        content = (
            <Card>
                <CardContent>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={12}>
                            <Text size="h3">
                            {'Solicitud de Nuevo Ingreso'}
                            </Text>
                        </Grid>
                        <Divider />
                        <Grid item xs={12}>
                            <Text>
                                {'Has concluido exitosamente tu SOLICITUD, recuerda continuar con el PROCESO DE INGRESO, realizando el PAGO, entregando los DOCUMENTOS correspondientes; y presentando las EVALUACIONES, Institucionales y Examen de Ingreso, en las FECHAS y HORARIOS indicados por SERVICIOS ESCOLARES. Si tienes alguna duda, envía un correo a aspirantes@upslp.edu.mx o al WhatsApp al 444 660 7707'}
                            </Text>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <Button
                                id="btnRefer"
                                onClick={onPagoRefer}
                            >
                                {'DESCARGAR REFERENCIA'}
                            </Button>
                        </Grid>
                        <Grid
                            alignItems="flex-end"
                            container
                            direction="column"
                            justifyContent="flex-end"
                            spacing={3}
                        >
                            <Grid item xs={12}>
                                <div className={classes.buttonContainer}>
                                    <div className={classes.buttonStep}>
                                        <Button
                                            className={classes.inline}
                                            id="btnContinue"
                                            onClick={onClickContinue}
                                        >
                                            <div className={classes.marginRigth}>
                                                {resources.lblContinue}
                                            </div>
                                            <div className={classes.marginLeft}>
                                                <Icon name="chevron-right" />
                                            </div>
                                        </Button>
                                    </div>
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                    <br />
                </CardContent>
            </Card >
        );
    }

    return (
        <>
            {content}
        </>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(Attachment);