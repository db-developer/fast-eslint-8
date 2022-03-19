[Back to [README](https://github.com/db-developer/fast-eslint-8#fast-eslint-8-package)]  
___

## Popular javascript style guides


* Airbnb: eslint-config-airbnb (tested and compatible)  
  [git](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb),
  [npm](https://www.npmjs.com/package/eslint-config-airbnb),
  [yarn](https://yarnpkg.com/package/eslint-config-airbnb)
* Google: eslint-config-google  
  [git](https://github.com/google/eslint-config-google),
  [npm](https://www.npmjs.com/package/eslint-config-google),
  [yarn](https://yarnpkg.com/package/eslint-config-google)
* React: eslint-config-react-app  
  [git](https://github.com/facebook/create-react-app),
  [npm](https://www.npmjs.com/package/eslint-config-react-app),
  [ywrn](https://yarnpkg.com/package/eslint-config-react-app)
* Standard: eslint-config-standard  
  [git](https://github.com/standard/eslint-config-standard),
  [npm](https://www.npmjs.com/package/eslint-config-standard),
  [yarn](https://yarnpkg.com/package/eslint-config-standard)

### Installation

<code>fast-eslint-8</code> is based on <code>eslint 8.x</code>.  
By the time of this writing, most of the style guides above, are not yet compatible and result in unresolved peer dependencies.  
In such cases, you should better switch to [fast-eslint](https://atom.io/packages/fast-eslint), which is based on <code>eslint 7</code>.  

Some <code>atom</code> packages provide tweaks to access npm packages, which are globally installed. <code>fast-eslint-8</code> will not do so. Instead, <code>fast-eslint-8</code> provides scripts to directly install style guides into atoms package directory of <code>fast-eslint-8</code>.

### Installation on Windows

1. Open a powershell or a windows command shell.
2. `cd` to your windows userhome (usually c:\\windows\\users\\&lt;username&gt;)
3. `cd` to `.atom\\packages\\fast-eslint-8`
4. type and execute `.\npm.ps1 install eslint-config-<styleguide name>`
5. type and execute `.\npm.ps1 install <peer dependency name>` for every peer dependency.

> __Note:__  
> Do not forget to replace `<styleguide name>` and `<peer dependency name>`

## Usage

Add the entry "extends" to your .eslintrc.* file.  

```javascript
// .eslintrc.js
module.exports = {
  "extends": [ "<enter the configuration name here>" ]
};

```
> __Note:__  
> If you want to use a styleguide for all of your projectsYou have two
> alternatives:
>
> * Add the configuration name to your <code>fast-eslint-8</code>
>   'base config' settings, .  
>  
>
> * Or open atoms <code>File</code> menu and go to <code>Config...</code>
>    and enter:  
>    ```
>    "*":
>      "fast-eslint-8":
>        baseConfig:
>          extends: [
>            "<enter the configuration name here>"
>          ]
>    ```
___  

[Back to [README](https://github.com/db-developer/fast-eslint-8#fast-eslint-8-package)]  
