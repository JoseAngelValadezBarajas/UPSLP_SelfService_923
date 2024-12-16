/* Copyright 2018-2020 Ellucian Company L.P. and its affiliates.
 * File: CourseDetailModal.tsx
 * Type: Presentation component */

// #region Imports
import React from 'react';

// Core components
import Divider from '@hedtech/powercampus-design-system/react/core/Divider';
import Modal from '@hedtech/powercampus-design-system/react/core/Modal';
import Text from '@hedtech/powercampus-design-system/react/core/Text';

// Internal components
import CourseDetailSubType, { ICourseDetailSubTypeResProps } from './CourseDetailSubType';

// Helpers
import Format from '@hedtech/powercampus-design-system/helpers/Format';

// Types
import { ICourseCatalog } from '../../Types/Course/ICourseCatalog';
// #endregion Imports

// #region Internal types
export interface ICourseDetailModalProps {
    courseDetail: ICourseCatalog;
    open: boolean;
    resources: ICourseDetailModalResProps;
    onClose: () => void;
}

export interface ICourseDetailModalResProps {
    courseDetailSubType: ICourseDetailSubTypeResProps;
    formatCourseName: string;
}
// #endregion Internal types

// #region Component
const CourseDetailModal: React.FC<ICourseDetailModalProps> = (props: ICourseDetailModalProps): JSX.Element => {
    const {
        courseDetail,
        open,
        resources,
        onClose
    } = props;

    let subTypeList: JSX.Element | JSX.Element[] | undefined;
    if (Array.isArray(courseDetail.subTypeList)) {
        if (courseDetail.subTypeList && courseDetail.subTypeList.length > 0) {
            subTypeList = courseDetail.subTypeList.map((subType, i) => (
                <CourseDetailSubType
                    key={`epnlCourseDetailSubtype_${i}`}
                    subType={subType}
                    resources={resources.courseDetailSubType}
                    id={`epnlCourseDetailSubtype_${i}`}
                />
            ));
        }
    }
    else {
        if (courseDetail.subTypeList) {
            subTypeList = (
                <CourseDetailSubType
                    subType={courseDetail.subTypeList}
                    resources={resources.courseDetailSubType}
                    id="epnlCourseDetailSubtype"
                />
            );
        }
    }

    return (
        <Modal
            disableHeaderTypography
            id="courseDetailModalTitle"
            header={(
                <>
                    <Text size="h2">
                        {Format.toString(resources.formatCourseName, [courseDetail.code, courseDetail.name])}
                    </Text>
                    <Divider />
                </>
            )}
            maxWidth="md"
            open={open}
            onClose={onClose}
        >
            <div>
                <Text>
                    {courseDetail.description}
                </Text>
                <br />
                {subTypeList}
            </div>
        </Modal>
    );

};
// #endregion Component

// Export: Component
export default CourseDetailModal;