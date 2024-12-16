const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Planning';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            DegreeRequirements: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/DegreeRequirements/DegreeRequirementsView`),
            TransferCourses: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/TransferCourses/TransferCoursesView`)
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