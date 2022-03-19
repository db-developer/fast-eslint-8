#
#   Install package dependencies into atoms fast-eslint-8 package folder
#

$atomdir     = "$env:LOCALAPPDATA\atom"
$atommodules = "\resources\app\apm\node_modules"
$atomnpm     = "\.bin\npm.cmd"

$atomapp     = Get-Item -Path "$atomdir\app-*" | Sort-Object LastAccessTime -Descending | Select-Object -First 1

$cwd         = "$atomapp$atommodules"
$cmd         = "$cwd$atomnpm"

#:: Force npm to use its builtin node-gyp
set npm_config_node_gyp=
# pushd $cwd

cmd.exe /c $cmd $args

# popd
