const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const commonEntries = [];
const colors = require('colors');
const clientBundleInputViewsDir = './ClientApp/Components/';
const moduleName = 'Finances';
console.log(colors.magenta(`${moduleName} Module: ${new Date()}`));

module.exports = (env, argv) => {
    return merge(common(env, argv), {
        entry: {
            Balance: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Balance/BalanceView`),
            Form1098T: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Form1098T/Form1098TView`),
            FinancialAid: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/FinancialAid/FinancialAidView`),
            Statement: commonEntries.concat(`${clientBundleInputViewsDir}${moduleName}/Statement/StatementView`)
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