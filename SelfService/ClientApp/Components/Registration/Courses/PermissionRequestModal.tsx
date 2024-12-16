/* Copyright 2019 - 2023 Ellucian Company L.P. and its affiliates.
 * File: PermissionRequestModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import PermissionRequestDetail, {
    IPermissionRequestDetailPropsToExtend,
    IPermissionRequestDetailResProps
} from '@hedtech/powercampus-design-system/react/components/Section/PermissionRequestDetail';
import Popover from '@hedtech/powercampus-design-system/react/core/Popover';
import Text from '@hedtech/powercampus-design-system/react/core/Text';
import TextField from '@hedtech/powercampus-design-system/react/core/TextField';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IStudentSchedule } from '@hedtech/powercampus-design-system/types/Student/IStudentSchedule';
// #endregion Imports

// #region Types
export interface IPermissionRequestModalProps {
    id: string;
    open: boolean;
    PermissionRequestDetailProps: IPermissionRequestDetailPropsToExtend;
    resources: IPermissionRequestModalResProps;
    section: IStudentSchedule;
    viewCommentsAnchor?: any;
    onChangeStudentComments: (event: React.ChangeEvent<HTMLInputElement>) => void;
    onClose: () => void;
    onSend: () => void;
}

export interface IPermissionRequestModalResProps {
    btnSend: string;
    formatModalTitle: string;
    lblCommentRequired: string;
    lblComments: string;
    lblSendTo: string;
    permissionRequestDetail: IPermissionRequestDetailResProps;
}

const styles = (theme: Theme) => createStyles({
    avatar: {
        marginLeft: '0rem!important'
    },
    centered: {
        alignItems: 'center',
        display: 'flex'
    },
    instructorName: {
        wordBreak: 'normal'
    },
    instructorsContainer: {
        backgroundColor: Tokens.colorBrandNeutral200,
        marginBottom: Tokens.spacing50,
        marginLeft: Tokens.spacing40,
        marginRight: Tokens.spacing40,
        marginTop: Tokens.spacing50,
        paddingLeft: Tokens.spacing40,
        paddingRight: Tokens.spacing40,
        width: 'auto'
    },
    popoverContainer: {
        [theme.breakpoints.up('lg')]: {
            width: '400px'
        },
        [theme.breakpoints.only('sm')]: {
            width: '400px'
        },
        backgroundColor: Tokens.colorBrandNeutral200,
        height: 'auto',
        overflowX: 'hidden',
        overflowY: 'hidden',
        width: '300px'
    }
});

type PropsWithStyles = IPermissionRequestModalProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const PermissionRequestModal: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        id,
        open,
        PermissionRequestDetailProps,
        resources,
        section,
        viewCommentsAnchor,
        onChangeStudentComments,
        onClose,
        onSend
    } = props;

    const generalStatus: number = section.isApproved ? 0 : (section.isDenied ? 1 : 2);

    if (section.permissionRequestInfo
        && section.permissionRequestInfo
        && section.permissionRequestInfo[0].id > 0) {
        // Edit Permission Requuest(s)
        return (
            <Popover
                anchorOrigin={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
                anchorEl={viewCommentsAnchor}
                open={Boolean(viewCommentsAnchor)}
                transformOrigin={{
                    horizontal: 'right',
                    vertical: 'top'
                }}
                onClose={onClose}
            >
                <div className={classes.popoverContainer}>
                    <PermissionRequestDetail
                        chatTitleAdorned
                        generalStatus={generalStatus}
                        id="permissionRequestDetail"
                        isStudent
                        permissionRequestInfo={section.permissionRequestInfo}
                        resources={resources.permissionRequestDetail}
                        withChatTitle
                        withScroll
                        {...PermissionRequestDetailProps}
                    />
                </div>
            </Popover>
        );
    }
    else {
        // Insert Permission Request

        // #region Instructor(s)
        let instructors: JSX.Element | JSX.Element[] | undefined;
        if (section.permissionRequestInfo && section.permissionRequestInfo.length > 0) {
            instructors = section.permissionRequestInfo.map((permissionRequestInfo, i) => (
                <Grid item className={classes.centered} key={`instructor_${i}`}>
                    <div>
                        <Avatar
                            id={`Avatar_instructor_${i}`}
                            backgroundNumber={permissionRequestInfo.facultyInfo.colorFirstLetter}
                            classes={{ root: classes.avatar }}
                        >
                            {permissionRequestInfo.facultyInfo.firstLetter}
                        </Avatar>
                    </div>
                    <div>
                        <Text
                            className={classes.instructorName}
                        >
                            {permissionRequestInfo.facultyInfo.fullName}
                        </Text>
                    </div>
                </Grid>
            ));
        }
        // #endregion Instructor(s)

        let commentsError: boolean = false;
        let comments: string = '';
        if (section.permissionRequestInfo && section.permissionRequestInfo.length > 0) {
            commentsError = section.permissionRequestInfo[0].error;
            comments = section.permissionRequestInfo[0].studentComments;
        }

        return (
            <Modal
                id={id}
                header={Format.toString(resources.formatModalTitle, [section.eventId, section.eventName])}
                footer={(
                    <Button
                        id={`btnSend_${id}_${section.id}`}
                        onClick={onSend}
                    >
                        {resources.btnSend}
                    </Button>
                )}
                maxWidth="lg"
                open={open}
                onClose={onClose}
            >
                <Grid container>
                    <Grid item xs>
                        <Text size="h3">
                            {resources.lblSendTo}
                        </Text>
                    </Grid>
                </Grid>
                <div className={classes.instructorsContainer}>
                    <Grid container spacing={2}>
                        {instructors}
                    </Grid>
                </div>
                <Grid container>
                    <Grid item xs>
                        <TextField
                            error={commentsError}
                            helperText={commentsError ? resources.lblCommentRequired : ''}
                            id="txtComments"
                            label={resources.lblComments}
                            multiline
                            type="text"
                            value={comments || ''}
                            onChange={onChangeStudentComments}
                        />
                    </Grid>
                </Grid>
            </Modal>
        );
    }
};
// #endregion Component

// Export: Component
export default withStyles(styles)(PermissionRequestModal);