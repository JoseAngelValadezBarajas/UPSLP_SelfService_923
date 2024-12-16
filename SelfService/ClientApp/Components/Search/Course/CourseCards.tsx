/* Copyright 2019 Ellucian Company L.P. and its affiliates.
 * File: CourseCards.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Button from '@hedtech/powercampus-design-system/react/core/Button';
import Card, { CardContent } from '@hedtech/powercampus-design-system/react/core/Card';
import Grid from '@hedtech/powercampus-design-system/react/core/Grid';
import Link from '@hedtech/powercampus-design-system/react/core/Link';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';
import { isWidthDown, withWidth, WithWidth } from '@hedtech/powercampus-design-system/react/core/withWidth';

// Types
import { ICourseCatalog } from '../../../Types/Course/ICourseCatalog';
import { ICourseCardResources } from '../../../Types/Resources/Search/ICourseResources';
// #endregion Imports

// #region Types
export interface ICourseCardProps {
    searchResultsList?: ICourseCatalog[];
    onCourseNameClick: (event: any) => void;
    onFindCourse: (event: any) => void;
    resources: ICourseCardResources;
}

type PropsWithStyles = ICourseCardProps & WithWidth;
// #endregion Types

// #region Component
const CourseCards: React.FC<PropsWithStyles> = (props: PropsWithStyles): JSX.Element => {
    const {
        searchResultsList,
        width,
        onCourseNameClick,
        onFindCourse,
        resources
    } = props;

    const cards: JSX.Element[] = [];
    const descLengthLimit: number = isWidthDown('sm', width, true) ? 150 : 300;

    if (searchResultsList) {
        searchResultsList.forEach((course, iCourse) => {
            cards.push(
                <>
                    <Card id={`crdResult_${iCourse}`}>
                        <CardContent>
                            <Grid container spacing={3}>
                                <Grid item xs={12} md={8}>
                                    <Link
                                        id={`btnTitle_courseCard_${iCourse}_${course.code}`}
                                        onClick={onCourseNameClick}
                                    >
                                        <Text color="inherit" size="h4">
                                            {Format.toString(resources.formatTitleSection, [course.code, course.name])}
                                        </Text>
                                    </Link>
                                    <Text>
                                        {Format.toString(resources.formatTitleSection, [resources.lblSubtypes,
                                        (course.subtypes ? course.subtypes : '')])}
                                    </Text>
                                    <Text>
                                        {course.description && course.description.length > descLengthLimit ?
                                            Format.toString(resources.formatTitleSectionShort, [resources.lblDescription, course.description.substring(0, descLengthLimit)])
                                            : Format.toString(resources.formatTitleSection, [resources.lblDescription,
                                            (course.description ? course.description : '')])}
                                    </Text>
                                </Grid>
                                <Grid item xs={12} md={4}>
                                    <Button
                                        color="secondary"
                                        fluid
                                        id={`btnFindSections|${course.code}`}
                                        onClick={onFindCourse}
                                    >
                                        {resources.lblFindSections}
                                    </Button>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                    <br />
                </>
            );
        });
    }

    return (
        <>
            {cards}
        </>
    );
};
// #endregion Component

// Export: Component
export default (withWidth()(CourseCards));