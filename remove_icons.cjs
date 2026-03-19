const fs = require('fs');
const path = require('path');

const iconNames = [
    'Search', 'Plus', 'MoreVertical', 'History', 'Pencil', 'Trash2', 
    'Loader2', 'X', 'ChevronLeft', 'ChevronRight', 'ChevronsLeft', 
    'ChevronsRight', 'ChevronDown', 'ChevronUp', 'ArrowLeft', 
    'SlidersHorizontal', 'Info', 'Eye', 'LayoutDashboard', 'Ticket', 
    'UserCircle', 'FileSliders', 'Table', 'UserSquare', 'Mail', 
    'Kanban', 'LogOut', 'Layers', 'Moon', 'Sun', 'Globe', 'Bell', 
    'Menu', 'PenSquare', 'ShoppingBag', 'MessageSquare', 'StickyNote', 
    'Calendar'
];

function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');

    const originalContent = content;

    // 1. Remove lucide-react imports completely
    content = content.replace(/import\s*\{[^}]*\}\s*from\s*['"]lucide-react['"];?/g, '');

    // 2. Remove all icon components
    iconNames.forEach(icon => {
        // match <Icon ... /> 
        const regex1 = new RegExp(`<\\s*${icon}\\b[^>]*/>`, 'g');
        // match <Icon ...>...</Icon>
        const regex2 = new RegExp(`<\\s*${icon}\\b[^>]*>.*?</\\s*${icon}\\s*>`, 'gs');
        
        content = content.replace(regex1, '');
        content = content.replace(regex2, '');
    });

    if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        console.log(`Removed icons from: ${filePath}`);
    }
}

function processDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js')) {
            processFile(fullPath);
        }
    }
}

processDir(path.join(__dirname, 'src'));
console.log('Done replacing icons.');
