/* Copyright 2020 - 2021 Ellucian Company L.P. and its affiliates.
 * File: InvitationsSent.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Icon from '@hedtech/powercampus-design-system/react/core/Icon';
import IconButton from '@hedtech/powercampus-design-system/react/core/IconButton';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';

// #region Types
import { IRelative } from '../../../Types/Account/IRelative';

// Helpers
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// #endregion Types
export interface IInvitationsSentProps {
    relatives: IRelative[];
    formatExpiresOn: string;
    onClickLink: (event: React.MouseEvent<HTMLAnchorElement>) => void;
    onClickRemoveButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
    onClickRemoveUserButton: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const styles = (theme: Theme) => createStyles({
    avatar: {
        border: '2px solid white'
    },
    avatarColor: {
        backgroundColor: 'white',
        color: 'gray'
    },
    cardContainter: {
        alignItems: 'center',
        border: Tokens.borderWidthThin,
        borderRadius: 8,
        borderColor: Tokens.colorGlobalBorderDefault,
        borderStyle: "solid",
        display: 'flex',
        flexDirection: 'column',
        height: '21.4375rem',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        marginLeft: '1.5rem',
        paddingBottom: `${Tokens.spacing40}`,
        paddingLeft: `${Tokens.spacing40}`,
        width: '17.4375rem'
    },
    cardContainterInvitation: {
        alignItems: 'center',
        background: theme.palette.grey[200],
        display: 'flex',
        flexDirection: 'column',
        height: '21.4375rem',
        justifyContent: 'center',
        marginBottom: '1.5rem',
        marginLeft: '1.5rem',
        paddingBottom: `${Tokens.spacing40}`,
        paddingLeft: `${Tokens.spacing40}`,
        width: '17.4375rem'
    },
    container: {
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'center',
        marginTop: '1.5rem',
        paddingBottom: '1.5rem',
        width: '70%'
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: `${Tokens.spacing40}`
    },
    itemText: {
        alignItems: 'center',
        height: '3.75rem',
        justifyContent: 'center',
        marginTop: `${Tokens.spacing40}`,
        display: 'flex ',
        flexDirection: 'row',
    },
    textDataContact: {
        textAlign: 'center',
        wordBreak: 'normal'
    }
});

type PropsWithStyles = IInvitationsSentProps & WithStyles<typeof styles>;

// #region Component
const InvitationsSent: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        formatExpiresOn,
        relatives,

        onClickLink,
        onClickRemoveButton,
        onClickRemoveUserButton
    } = props;

    const rows: JSX.Element[] = []

    relatives.forEach(relative => {
        rows.push(
            <div className={relative.isInvited ? classes.cardContainterInvitation : classes.cardContainter}>
                {
                    relative.isInvited ?
                        (
                            <div className={classes.item}>
                                <Avatar
                                    className={classes.avatarColor}
                                    size="xxxLarge"
                                >
                                    <Icon
                                        name="email"
                                        size="xxLarge1"
                                    />
                                </Avatar>
                            </div>
                        )
                        :
                        (
                            relative.avatar.hasPicture ?
                                (
                                    <div className={classes.item}>
                                        <Avatar
                                            classes={{ root: classes.avatar }}
                                            size='xxxLarge'
                                            src={`${Constants.peoplePictureUrl}${relative.avatar.personId}`}
                                        />
                                    </div>
                                )
                                :
                                (
                                    <div className={classes.item}>
                                        <Avatar
                                            classes={{ root: classes.avatar }}
                                            size='xxxLarge'
                                            backgroundNumber={relative.avatar.colorFirstLetter ?
                                                relative.avatar.colorFirstLetter : 0}
                                        >
                                            {relative.avatar.firstLetter}
                                        </Avatar>
                                    </div>
                                )
                        )
                }
                <div className={classes.itemText}>
                    {
                        relative.isInvited ?
                            (
                                <Text
                                    className={classes.textDataContact}>
                                    {relative.avatar.fullName}
                                </Text>
                            )
                            :
                            (
                                <Button
                                    TextProps={{
                                        weight: 'strong'
                                    }}
                                    align="center"
                                    id={`link_${relative.avatar.personId}`}
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onClickLink}
                                >
                                    {relative.avatar.fullName}
                                </Button>
                            )}
                </div>
                <div className={classes.item}>
                    {
                        relative.isInvited ?
                            (
                                <Text
                                    className={classes.textDataContact}
                                >
                                    {Format.toString(formatExpiresOn, [relative.expiryDate])}
                                </Text>
                            )
                            :
                            (
                                <Text
                                    className={classes.textDataContact}
                                >
                                    {relative.relationshipDesc}
                                </Text>
                            )
                    }
                </div>
                <div className={classes.item}>
                    <IconButton
                        data-relative-id={relative.id}
                        color="secondary"
                        id={`btnRemove_${relative.id}`}
                        onClick={relative.isInvited ? onClickRemoveButton : onClickRemoveUserButton}
                    >
                        <Icon name="trash" />
                    </IconButton>
                </div>
            </div>
        );
    });

    const content: JSX.Element = (
        <div className={classes.container}>
            {rows}
        </div>
    );

    return (
        <Grid
            container
            direction="column"
            alignItems="center"
            justifyContent="center"
            spacing={1}
        >
            {content}
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(InvitationsSent);