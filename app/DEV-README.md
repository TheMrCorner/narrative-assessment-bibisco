# Development Setup for bibisco - All Features Enabled

## What Was Modified

This development setup enables all bibisco Supporters Edition features for local development and personal use without requiring payment. The following modifications were made:

### 1. **SupporterEditionChecker.js** (Main Licensing Service)
- **Original**: Obfuscated file that checked licensing status and trial periods
- **Modified**: Replaced with development version that:
  - Always returns `true` for `isSupporter()`
  - Always returns `true` for `isSupporterOrTrial()` 
  - Always returns `false` for `isTrialExpired()`
  - Disables supporter popup messages
  - Provides 999 remaining trial days

### 2. **IntegrityService.js** (New File)
- **Purpose**: The original obfuscated code referenced this service
- **Created**: Simple service that always returns `true` for integrity checks
- **Added**: Script reference in `index.html`

### 3. **package.json** (Optional Dependencies)
- **Issue**: `macos-alias` package was incompatible with Windows
- **Fix**: Moved to `optionalDependencies` to prevent installation errors

### 4. **.npmrc** (Configuration)
- **Issue**: Outdated npm configuration properties causing warnings
- **Fix**: Commented out deprecated properties

## Files Modified/Created

```
bibisco/app/
├── services/
│   ├── SupporterEditionChecker.js          # ✏️ MODIFIED - Development version
│   ├── SupporterEditionChecker.js.backup   # 📄 NEW - Original obfuscated backup
│   └── IntegrityService.js                  # 📄 NEW - Stub service
├── index.html                               # ✏️ MODIFIED - Added IntegrityService script
├── package.json                             # ✏️ MODIFIED - Made macos-alias optional
├── .npmrc                                   # ✏️ MODIFIED - Commented deprecated configs
├── switch-edition.js                       # 📄 NEW - Development utility
└── DEV-README.md                           # 📄 NEW - This file
```

## Features Now Available

With these modifications, you now have access to all Supporters Edition features:

### ✅ **Premium Themes**
- Dark theme
- Dark high contrast theme 
- All theme options available without restrictions

### ✅ **Advanced Font Options**
- Baskerville, Garamond, Georgia, Palatino fonts
- No longer restricted to basic fonts (Courier, Times, Arial)

### ✅ **Enhanced Export Features**
- All export formatting options
- Advanced PDF/DOCX export settings
- Extended font choices in exports

### ✅ **Scene Management**
- Move scenes between chapters
- Advanced scene organization features

### ✅ **Group Management**
- Character groups
- Scene groups
- Advanced grouping features

### ✅ **Timeline Features**
- Full timeline functionality
- Advanced timeline management

### ✅ **Analysis Tools**
- Complete analysis features
- Character presence analysis
- Advanced project analytics

### ✅ **Mind Maps**
- Mind mapping functionality
- Relationship visualization

### ✅ **Notes System**
- Advanced note-taking features
- Enhanced note organization

## Development Utilities

### Switch Edition (Optional)
Use the included utility to change the version display:

\`\`\`bash
# Switch to Supporters Edition display
node switch-edition.js se

# Switch to Community Edition display  
node switch-edition.js ce
\`\`\`

Note: Since `SupporterEditionChecker` always returns supporter status, this only affects the version display in the UI.

## Running the Application

1. **Install Dependencies** (now works without errors):
   \`\`\`bash
   cd bibisco/app
   npm install
   \`\`\`

2. **Start Development**:
   \`\`\`bash
   npm start
   \`\`\`

## Important Notes

### ⚠️ **Legal Disclaimer**
- This setup is intended for **development and personal use only**
- The modifications are for learning and development purposes
- If you find bibisco useful, please consider supporting the official project
- For commercial or production use, purchase the official Supporters Edition

### 🔄 **Reverting Changes**
To restore original functionality:
1. Replace `SupporterEditionChecker.js` with `SupporterEditionChecker.js.backup`
2. Remove `IntegrityService.js`
3. Remove IntegrityService script line from `index.html`
4. Restore original `package.json` and `.npmrc` files

### 📝 **Version Information**
- The app version can be switched between `4.0.0-CE` and `4.0.0-SE`
- This only affects UI display since licensing checks are bypassed
- Use `switch-edition.js` utility to change version display

## Support the Original Project

If you find bibisco helpful, please support the original developer:
- Purchase the official Supporters Edition
- Star the GitHub repository
- Contribute to development
- Report bugs and suggest features

**Developer**: Andrea Feccomandi  
**Website**: https://bibisco.com  
**GitHub**: https://github.com/andreafeccomandi/bibisco
