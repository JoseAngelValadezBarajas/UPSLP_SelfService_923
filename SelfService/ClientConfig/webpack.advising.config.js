const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Advising';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            AdviseeProfile: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/AdviseeProfile/AdviseeProfileView`),
            AuthorizeAdvisees: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/AuthorizeAdvisees/AuthorizeAdviseesView`),
            ManageAdvisees: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/ManageAdvisees/ManageAdviseesView`),
            SharedAdvisees: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/SharedAdvisees/SharedAdviseesView`)
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