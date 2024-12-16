/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: ImageList.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { createStyles, Theme, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Types
import { IStudentEnrollment } from '../../../Types/Classes/IStudentEnrollment';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';
// #endregion Imports

// #region Types
export interface IImageListProps {
    mailToUrl: string;
    students?: IStudentEnrollment[];
    onViewDossier?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const styles = ((theme: Theme) => createStyles({
    avatar: {
        [theme.breakpoints.down('xs')]: {
            marginLeft: '0rem!important'
        }
    },
    avatarContainer: {
        maxWidth: '200px'
    },
    dataStudent: {
        wordWrap: 'break-word'
    }
}));

type PropsWithStyles = IImageListProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const ImageList: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        mailToUrl,
        students,
        onViewDossier
    } = props;

    let images: JSX.Element[] | undefined;
    let image: JSX.Element | undefined;
    if (students) {
        images = students.map(student => {
            if (student.hasPicture) {
                image = (
                    <Avatar
                        className={classes.avatar}
                        size="xxxLarge"
                        src={`${Constants.peoplePictureUrl}${student.personId}`}
                    />
                );
            }
            else {
                image = (
                    <Avatar
                        className={classes.avatar}
                        size="xxxLarge"
                        backgroundNumber={student.colorFirstLetter ?
                            student.colorFirstLetter : 0}
                    >
                        {student.firstLetter}
                    </Avatar>
                );
            }

            const onClickEmail = (): void => {
                window.open(Format.toString(mailToUrl, [student.emailAddress]),
                    mailToUrl.toLowerCase() === 'mailto:{0}' ? '_self' : '_blank');
            };

            return (
                <Grid item className={classes.avatarContainer} key={`imageStudent_${student.personId}`} id={`imageStudent_${student.personId}`}>
                    <Grid container justifyContent="center">
                        <Grid item>
                            {image}
                        </Grid>
                        <Grid item xs={12}>
                            {onViewDossier ? (
                                <Button
                                    align="left"
                                    data-id={student.personId}
                                    id={`btnStudentData_${student.personId}`}
                                    textVariantStyling="inherit"
                                    variant="text"
                                    onClick={onViewDossier}
                                >
                                    <Text
                                        align="center"
                                        className={classes.dataStudent}
                                        color="inherit"
                                    >
                                        {student.fullName}
                                    </Text>
                                    <Text
                                        align="center"
                                        className={classes.dataStudent}
                                        color="inherit"
                                        size="small"
                                    >
                                        {student.peopleId}
                                    </Text>
                                </Button>
                            ) : (
                                    <>
                                        <Text
                                            align="center"
                                            className={classes.dataStudent}
                                            color="inherit"
                                        >
                                            {student.fullName}
                                        </Text>
                                        <Text
                                            align="center"
                                            className={classes.dataStudent}
                                            color="inherit"
                                            size="small"
                                        >
                                            {student.peopleId}
                                        </Text>
                                    </>
                                )
                            }

                            <Link
                                id={`lnkStudentEmail_${student.personId}`}
                                onClick={onClickEmail}
                            >
                                <Text
                                    align="center"
                                    className={classes.dataStudent}
                                    color="inherit"
                                    size="small"
                                >
                                    {student.emailAddress}
                                </Text>
                            </Link>
                        </Grid>
                    </Grid>
                </Grid>
            );
        });
    }

    return (
        <Grid container justifyContent="center">
            {images}
        </Grid>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(ImageList);