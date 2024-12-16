const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Classes';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            FacultyCourseManagement: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/CourseManagement/FacultyCourseManagementView`),
            FacultySchedule: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Schedule/FacultyScheduleView`)
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