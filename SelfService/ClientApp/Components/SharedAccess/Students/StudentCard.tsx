/* Copyright 2020 Ellucian Company L.P. and its affiliates.
 * File: StudentCard.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Avatar from '@hedtech/powercampus-design-system/react/core/Avatar';
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';

// Types
import { IPerson } from '../../../Types/Account/IPerson';

// Helpers
import Tokens from '@hedtech/powercampus-design-system/react/core/styles/Tokens';
import { createStyles, withStyles, WithStyles } from '@hedtech/powercampus-design-system/react/core/styles/withStyles';

// Constants
import Constants from '@hedtech/powercampus-design-system/helpers/Constants';

// #endregion Imports

// #region Types
export interface IStudentCardProps {
    student: IPerson;
    onViewStudentProfile: (personId: number) => void;
}

const styles = createStyles({
    studentCard: {
        border: Tokens.borderWidthThin,
        borderRadius: 8,
        borderColor: Tokens.colorGlobalBorderDefault,
        borderStyle: "solid",
        width: "17rem",
        padding: Tokens.spacing40,
        paddingTop: Tokens.spacing30
    },
    studentName: {
        height: Tokens.sizingXxLarge1,
    }
});

type PropsWithStyles = IStudentCardProps & WithStyles<typeof styles>;
// #endregion Types

// #region Component
const StudentCard: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        classes,
        student,
        onViewStudentProfile
    } = props;

    const onViewStudent = (): void => {
        onViewStudentProfile(student.personId);
    };

    return (
        <div className={classes.studentCard}>
            <Grid
                container
                direction="column"
                alignItems="center"
                justifyContent="center"
                spacing={1}
            >
                <Grid item>
                    {student.hasPicture ? (
                        <Avatar
                            size="xxxLarge"
                            src={`${Constants.peoplePictureUrl}${student.personId}`}
                        />
                    ) : (
                            <Avatar
                                size="xxxLarge"
                                backgroundNumber={student.colorFirstLetter}
                            >
                                {student.firstLetter}
                            </Avatar>
                        )}
                </Grid>
                <Grid item>
                    <Button
                        id={`btnStudentName_${student.personId}`}
                        align="center"
                        textVariantStyling="inherit"
                        variant="text"
                        onClick={onViewStudent}
                        className={classes.studentName}
                    >
                        {student.fullName}
                    </Button>
                </Grid>
            </Grid>
        </div>
    );
};
// #endregion Component

// Export: Component
export default withStyles(styles)(StudentCard);