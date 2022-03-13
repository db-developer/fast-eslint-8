[README](https://github.com/db-developer/fast-eslint-8#fast-eslint-8-package)  
<hr\>

fast-eslint-8 settings can be changed via the 'File' => 'Settings' menu in Atom.  
![atom settings-short](https://user-images.githubusercontent.com/2765933/158047464-9f39a5c5-d460-426e-8415-45339c2028e0.png)  
This will open the ![atom fast-eslint-8 settings-tab](https://user-images.githubusercontent.com/2765933/156207814-8cb06045-2982-4c0a-9270-10968f55f50e.png)-Tab.  
Navigate to ![atom fast-eslint-8 settings-tab-packages](https://user-images.githubusercontent.com/2765933/156208574-c340356b-8494-4924-aca7-9b192c19ada2.png) and type 'fast-eslint-8' into the searchbox and click on 'Settings'.  

![atom fast-eslint-8 packages](https://user-images.githubusercontent.com/2765933/156210348-b76da99f-d2e8-42f0-abbb-1223bd31c4c8.png)

# ![atom fast-eslint-8 settings](https://user-images.githubusercontent.com/2765933/156205865-223d0351-5efa-4a1f-a0a8-4cee36c382a7.png)

## Base Config
![atom fast-eslint-8 settings baseconfig](https://user-images.githubusercontent.com/2765933/156211318-7e2fca76-d261-4bcc-8c33-505e72aa38db.png)

If set, this option will create a [configuration](https://eslint.org/docs/user-guide/configuring/configuration-files#using-configuration-files) object, with a single property: 'extends'.

## ESLint Engine Options
![atom fast-eslint-8 settings eslint-engine-options](https://user-images.githubusercontent.com/2765933/156214600-4de51344-d4cd-445a-bd2f-11313b53e874.png)

You can read here about [ESLint Engine Options](https://eslint.org/docs/developer-guide/nodejs-api#-new-eslintoptions).  

__Note:__  
Options changing the behaviour of <code>eslint.lintFiles()</code> will never get supported, because fast-eslint-8 runs <code>eslint.lintText( code, options )</code>.

### cwd
![atom fast-eslint-8 settings eslint-engine-options cwd](https://user-images.githubusercontent.com/2765933/156216805-991c8cd0-722b-4f75-b319-d0430a540e0b.png)

Set the 'current working directory' to use by ESLint. If not set, this defaults to <code>process.cwd()</code>.

### Allow inline configuration
![atom fast-eslint-8 settings eslint-engine-options allow-inline-configuration](https://user-images.githubusercontent.com/2765933/156217490-176eb1a4-a3bb-4d42-9708-c1e1c590b291.png)

[Enable or disable eslint configuration by code comments](https://eslint.org/docs/2.13.1/user-guide/configuring#disabling-rules-with-inline-comments)

### .eslintrc.* override file
![atom fast-eslint-8 settings eslint-engine-options override-file](https://user-images.githubusercontent.com/2765933/156218481-f02b9bac-e1c3-4b3d-8df3-969665da5cc2.png)

Files can be be specified with filepaths of the following types:
- absolute, if the filepath starts with '/' or a 'drive-letter' on windows.  
  __Examples:__  
  Unix: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /tmp/.eslintrc.js &nbsp; => /tmp/.eslintrc.js  
  Windows: &nbsp; /Temp/.eslintrc.js => C:\\Temp\\.eslintrc.js  
- relative, for files which are not absolute.  
  This will prepend the current project path (e.g. '/tmp/myproject') to the specified filepath.  
  __Examples:__  
  Unix: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; conf/.eslintrc.js => /tmp/myproject/conf/.eslintrc.js  
  Windows: &nbsp; conf/.eslintrc.js => C:\\Temp\\myproject\\conf\\.eslintrc.js  
- relative to a user home directors, if the path starts with ~ .  
  This will prepend a user home directory (e.g. '/usr/username') to the specified filepath.  
  __Examples:__  
  Unix: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; ~/.eslintrc.js => /usr/username/.eslintrc.js  
  Windows: &nbsp; ~/.eslintrc.js => C:\\Users\\username\\.eslintrc.js  

### Report unused disable directives
![atom fast-eslint-8 settings eslint-engine-options report-unused](https://user-images.githubusercontent.com/2765933/156225128-017a29f7-d472-468b-9523-91882bc485f3.png)

Possible values are: "error", "warn", "off", "not set"

### Configuration directories
![atom fast-eslint-8 settings eslint-engine-options rule-paths](https://user-images.githubusercontent.com/2765933/156225856-daf8929d-5fe1-4451-8697-df1566861c13.png)

For [working with rules](https://eslint.org/docs/developer-guide/working-with-rules), paths can be set. Rule paths will be resolved in the same way, an .eslintrc.* override file is resolved (see above).

### Autoload .eslintrc.* files
![atom fast-eslint-8 settings eslint-engine-options auto-load](https://user-images.githubusercontent.com/2765933/156226792-19daa8d1-5dee-4f1d-bc86-6eca2ea302db.png)

## Grammar scopes
![atom fast-eslint-8 settings grammar-scopes](https://user-images.githubusercontent.com/2765933/156227907-e7e1974f-85c1-456f-aaee-21c746bbdab5.png)
