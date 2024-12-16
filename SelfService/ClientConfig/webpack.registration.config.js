const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Registration';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            Courses: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Courses/CoursesView`),
            AcademicPlan: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/AcademicPlan/AcademicPlanView`),
            StudentSchedule: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Schedule/ScheduleView`),
            WhatIf: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/WhatIf/WhatIfView`)
        },

        optimization: {
            splitChunks: {
                cacheGroups: {
                    defaultVendor: {
                        name: `${moduleName}Vendors`
                    }
                }
            }
        }
    });
};