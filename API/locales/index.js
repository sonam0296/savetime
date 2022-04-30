const i18nLib = require('i18n');

i18nLib.configure({
    locales: ['en', 'ca', 'es', 'pt', 'fr'],
    directory: './locales',
    queryParameter: 'lang',
    defaultLocale: 'en',
    autoReload: true,
    updateFiles: false
});

module.exports = i18nLib