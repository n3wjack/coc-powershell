# coc-powershell

[![Build Status](https://v-yadli.visualstudio.com/coc-powershell/_apis/build/status/yatli.coc-powershell?branchName=master)](https://v-yadli.visualstudio.com/coc-powershell/_build/latest?definitionId=1&branchName=master)
![npm](https://img.shields.io/npm/v/coc-powershell.svg)

A vim plugin powered by
[PowerShellEditorService](https://github.com/PowerShell/PowerShellEditorServices) and
[coc.nvim](https://github.com/neoclide/coc.nvim)
to provide a rich PowerShell editing experience.

Features include:
* Intellisense/Completions
* Go to definition
* [PSScriptAnalyzer](https://github.com/PowerShell/PSScriptAnalyzer) integration
* Integrated REPL environment that shares the context with the language services
* and much more!

## Prerequisites

1. vim 8.0+/neovim
2. [PowerShell Core](https://github.com/powershell/powershell) or Windows PowerShell
3. [coc.nvim](https://github.com/neoclide/coc.nvim)

## Installation

`coc-powershell` is an extension for `coc.nvim`.
You can install `coc.nvim` with a plugin manager like [vim-plug](https://github.com/junegunn/vim-plug):
```vimL
Plug 'neoclide/coc.nvim', {'tag': '*', 'do': { -> coc#util#install()}}
```

Then, use `:CocInstall coc-powershell` to install.

Alternatively, you can have `coc.nvim` automatically install the extension if it's missing:
```vimL
let g:coc_global_extensions=[ 'coc-powershell', ... ]
```

On the first activation (when you edit a powershell script), [PowerShellEditorServices](https://github.com/PowerShell/PowerShellEditorServices) will be automatically downloaded.

## TODO
- [x] pwsh core support
- [x] xplat support
- [x] REPL support

## Recommended plugins

[vim-polyglot](https://github.com/sheerun/vim-polyglot) for syntax highlighting 🎨
