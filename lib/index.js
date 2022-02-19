'use babel';

const { CompositeDisposable,
        Range                 } = require( "atom"   );
const { exec,
        isIgnored,
        updateBaseCfg,
        updateEslintCfg       } = require( "./exec" );
const   helpers                 = require( "atom-linter" );
const   pkgdeps                 = require( "atom-package-deps" );

/**
 *  Initialize stringtable.
 *  @ignore
 */
function _init_STRINGS() {
  const pkgname = "fast-eslint-8";

  return {
    BASECONFIG:     pkgname + ".baseConfigExtends",
    ESLINT:         "ESLint",
    ESLINTCONFIG:   pkgname + ".eslintrc",
    ESLINTIGNORE:   ".eslintignore",
    FILE:           "file",
    GRAMMARSCOPES:  pkgname + ".grammarScopes",
    PKGNAME:        pkgname
  };
}

/**
 *  Stringtable
 *  @ignore
 */
const _STRINGS = _init_STRINGS();

module.exports = {
  activate() {
    pkgdeps.install( _STRINGS.PKGNAME );

    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add( atom.config.observe( _STRINGS.GRAMMARSCOPES, ( grammar ) => {
      this.grammarScopes = grammar;
    }));
    this.subscriptions.add( atom.config.observe( _STRINGS.BASECONFIG,    ( presets ) => {
      updateBaseCfg( presets );
    }));
    this.subscriptions.add( atom.config.observe( _STRINGS.ESLINTCONFIG,  ( presets ) => {
      updateEslintCfg( presets );
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  provideLinter() {
    return {
      grammarScopes: this.grammarScopes,
      scope: 'file',
      name: 'ESLint',
      lintsOnChange: true,
      lint: (TextEditor) => {
        const filePath = TextEditor.getPath();
        const fileText = TextEditor.getText();
        const fileBuffer = TextEditor.getBuffer();
        const ignoreFile = helpers.find(filePath, '.eslintignore');

        if (ignoreFile && isIgnored(ignoreFile, filePath)) {
          return new Promise((resolve) => resolve([]));
        }

        return exec(filePath, fileText).then((report) => {
          if (!report || !report.results || !report.results.length) return [];

          return report.results[0].messages.map(({ column = 1, line, message, ruleId, severity, fix }) => {
            const lineLength = TextEditor.getBuffer().lineLengthForRow(line - 1);
            const colStart = (column - 1 > lineLength) ? (lineLength + 1) : column;
            const position = helpers.generateRange(TextEditor, line - 1, colStart - 1);

            return {
              severity: severity === 1 ? 'warning' : 'error',
              excerpt: `${ruleId || 'fatal'}: ${message}`,
              solutions: fix ? [{
                position: new Range(
                  fileBuffer.positionForCharacterIndex(fix.range[0]),
                  fileBuffer.positionForCharacterIndex(fix.range[1]),
                ),
                replaceWith: fix.text,
              }] : null,
              location: {
                file: filePath,
                position,
              },
            };
          });
        });
      },
    };
  },
};
