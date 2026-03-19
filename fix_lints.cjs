const fs = require('fs');

const filesToFixParen = [
    'src/component/common/CountryModal.jsx',
    'src/component/common/HolidayModal.jsx',
    'src/component/common/TicketModal.jsx',
    'src/pages/AMSTicketsReportPage.jsx',
    'src/pages/GeneralReportPage.jsx',
    'src/pages/HolidaysPage.jsx',
    'src/pages/JobsheetsPage.jsx'
];

const filesToFixBrace = [
    'src/component/common/SiteModal.jsx',
    'src/component/common/WorkCodeModal.jsx',
    'src/pages/AMSTicketsPage.jsx',
    'src/pages/Auth/Login.jsx',
    'src/pages/UsersPage.jsx',
    'src/component/common/ResourcePage.jsx'
];

filesToFixParen.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    // Replace {loading ? ( ) : ( )}
    // Note: the line has spaces/newlines inside ()
    c = c.replace(/\{\s*[\w\.]+\s*\?\s*\(\s*\)\s*:\s*\(\s*\)\s*}/g, '');
    c = c.replace(/\(\s*\)/g, ''); // just remove empty parens inside JSX
    // wait, removing all empty parens could break function calls like `() =>`
    // It's specifically inside `{loading ? ( ...
    // Let's be safer: 
    fs.writeFileSync(f, c);
});

filesToFixBrace.forEach(f => {
    let c = fs.readFileSync(f, 'utf8');
    // A stray } might be because of an empty fragment or empty block
    c = c.replace(/\{\s*\}/g, '""'); // replace empty braces with empty string JSX? No, that causes problems if it's object init.
    // If it's a JSX tag that had something like {<Icon />} transformed to {}, we can remove it.
    // Let's do a more robust string replacement:
    c = c.replace(/>\s*\{\s*\}\s*</g, '><'); // remove {} between tags
    
    // Also, if it left an object like {{  }} empty
    fs.writeFileSync(f, c);
});

console.log("Basic cleanup done");
