const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Home';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            AccountConfirmation: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/AccountConfirmation/AccountConfirmationView`),
            Home: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Dashboard/DashboardView`),
            LogIn: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/LogIn/LogInView`),
            RecoverPassword: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/RecoverPassword/RecoverPasswordView`),
            SignOutConfirmation: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/SignOutConfirmation/SignOutConfirmationView`)
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