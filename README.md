# `@vsce/create`

> 🦕 The **Deno-native** scaffolding tool for modern, dual-runtime VS Code extensions

[![JSR Scope](https://jsr.io/badges/@vsce)](https://jsr.io/@vsce)
[![JSR](https://jsr.io/badges/@vsce/create)](https://jsr.io/@vsce/create)
[![JSR Score](https://jsr.io/badges/@vsce/create/score)](https://jsr.io/@vsce/create/score)
[![GitHub CI](https://img.shields.io/github/actions/workflow/status/cursor-ide/vsce-create/update.yml?branch=main&label=sync)](https://github.com/cursor-ide/vsce-create/actions/workflows/update.yml)
[![Last Updated](https://img.shields.io/github/last-commit/cursor-ide/vsce-create?label=last%20synced)](https://github.com/cursor-ide/vsce-create/commits/main)
[![License](https://img.shields.io/github/license/cursor-ide/vsce-create)](./LICENSE)

`@vsce/create` bootstraps **Deno-first**, **web-compatible** VS Code extensions in seconds. Each project it generates is ready to build with [`@vsce/bundler`](https://jsr.io/@vsce/bundler) and ships with type-safe VS Code APIs via [`@typed/vscode`](https://jsr.io/@typed/vscode).

> **Heads-up!** `@vsce/create` is the low-level *scaffolding engine* used internally by [`@vsce/cli`](https://jsr.io/@vsce/cli) — our all-in-one, fully-featured development suite. If you want the entire toolchain (project generation, dev server, bundling, testing, publishing) in one command, install **`@vsce/cli`** instead.

---

## ✨ Features

| Category | Details |
|----------|---------|
| 🦕 **Deno-Native** | No Node.js toolchain required—scaffolds projects you can run & build with Deno only. |
| 🌐 **Dual Runtime** | Templates target both Desktop and Web extension hosts out-of-the-box (`extensionKind: ["workspace", "web"]`). |
| 🏗️ **Rich Templates** | `basic`, `treeview`, `webview`, and `language-server` templates plus shared utilities. |
| 📦 **Bundler-Ready** | Generates a `scripts/build.ts` that calls `@vsce/bundler` for a single-file, web-safe bundle. |
| 🔧 **VS Code Tasks** | Emits `.vscode/tasks.json` & `.vscode/launch.json` for one-click build, test & debug. |
| ✅ **Strict Types** | Uses `@typed/vscode` definitions with full TypeScript `--strict` compliance. |

---

## 📥 Installation

```bash
# Add to your Deno project (recommended)
deno add @vsce/create
```

or run directly without installation:

```bash
deno run -A jsr:@vsce/create@latest init my-extension
```

> `@vsce/create` targets **Deno ≥1.44** and **VS Code ≥1.90**.

---

## 🚀 Quick Start

```bash
# Scaffold a Tree View extension
deno run -A jsr:@vsce/create init my-treeview --template treeview
cd my-treeview

# Build the extension (outputs dist/extension.js)
deno task build

# Test everything
deno task test
```

Resulting structure (example `treeview`):

```text
 my-treeview/
├── README.md                # template-specific doc
├── deno.json                # import map + tasks + lint/fmt
├── jsr.json                 # JSR package meta
├── package.json             # VS Code extension manifest
├── scripts/
│   └── build.ts             # calls @vsce/bundler
├── src/
│   └── extension.ts         # your entry point
└── .vscode/
    ├── extensions.json      # recommended VS Code extensions
    ├── tasks.json           # build / test tasks
    └── launch.json          # debug configuration
```

---

## 🗂️ Available Templates

| Template | Description |
|----------|-------------|
| `basic` | Minimal “Hello World” command—perfect seed for small utilities. |
| `treeview` | Demonstrates `TreeDataProvider`, custom view registration and refresh command. |
| `webview` | Shows how to create a Webview panel with static HTML content. |
| `language-server` | Runs a minimal language server in a Web Worker using `vscode-languageclient/browser`. |

---

## 🔄 Development Workflow

1. **Start coding** inside `src/extension.ts` (or additional modules).  
   VS Code + the [Deno extension](https://marketplace.visualstudio.com/items?itemName=denoland.vscode-deno) give you instant type-checking and IntelliSense.
2. **Press `F5`** to run the *Run Extension* launch target (uses Deno to execute `scripts/build.ts`).
3. **Run tests** with `deno task test` (generated for you).  
   All templates include example tests you can extend.
4. **Bundle** with `deno task build` for production. The output `dist/extension.js` works for both desktop and web versions of VS Code.

---

### Web Extension Support

#### Why Web Extensions?

This package is optimized for the **VSCode Web Extensions** runtime as our **pragmatic path to bringing VSCode extension development to Deno**. While our ideal would be full parity with the Node.js extension development environment, the web extension runtime represents the best available approach given current VSCode architecture limitations.

**The Reality:**

- 🎯 **Goal**: Enable Deno-native VSCode extension development
- ⚠️ **Challenge**: VSCode's extension host is deeply integrated with Node.js
- ✅ **Solution**: Leverage the web extension runtime for Deno compatibility
- 🪄 **Future**: Working toward fuller Node.js runtime parity as the ecosystem evolves

#### Universal Compatibility

The web extension runtime enables you to create extensions that run **everywhere** - both desktop VSCode and web-based environments (vscode.dev, github.dev, GitHub Codespaces):

```typescript
import * as vscode from "@typed/vscode";

// Web extensions run on BOTH desktop and web VSCode
export function activate(context: vscode.ExtensionContext): void {
  // Full VSCode API support: TreeView, Commands, Language Features, etc.
  const provider = new MyTreeDataProvider();
  vscode.window.createTreeView('myView', { treeDataProvider: provider });
  
  // Limitation: Node.js APIs are not available (browser sandbox restrictions)
  // However, we can use Deno's web API's as a drop-in replacement for some Node.js APIs
  // The extension works identically on desktop and web!
}
```

**Key Benefits:**

- ✅ **Universal compatibility** - One extension runs on desktop AND web VSCode
- ✅ **Full VSCode API access** - Commands, UI, language features, etc.
- ✅ **Modern deployment** - Works in vscode.dev, github.dev, Codespaces
- ⚠️ **Browser limitations** - No Node.js/filesystem APIs (applies to web runtime only)

## 🚧 Deno VSCode Extension Ecosystem (WIP) 🚧

`@typed/vscode` is part of a complete ecosystem for Deno-based VSCode extension development. Explore these complementary packages:

### 🛠️ Development Tools

**[@vsce/cli](https://jsr.io/@vsce/cli)** - Command-line tools for Deno VSCode extensions

```bash
deno add @vsce/cli
```

- Project scaffolding and templates
- Development server with hot reload  
- Build and packaging utilities
- Extension testing and validation

**[@vsce/create](https://jsr.io/@vsce/create)** - Project generator for new extensions

```bash
deno add @vsce/create
```

- Interactive project setup
- Multiple template options (basic, language server, tree view, etc.)
- Deno-optimized project structure
- Best practices and conventions built-in

### 🔧 Build and Bundle

**[@vsce/bundler](https://jsr.io/@vsce/bundler)** - Web extension bundler for Deno

```bash
deno add @vsce/bundler
```

- Bundle Deno code for VSCode web extensions
- Tree shaking and optimization
- Source map support
- Multi-target builds (desktop + web)

### 🧪 Testing Framework

**[@vsce/testing](https://jsr.io/@vsce/testing)** - Testing utilities for VSCode extensions

```bash
deno add @vsce/testing
```

- Mock VSCode APIs for unit testing
- Extension host simulation
- Language server testing utilities
- TreeView and UI component testing

### 📚 Complete Example

```typescript
// extension.ts - Built with the full @vsce ecosystem
import * as vscode from "@typed/vscode";
import { createLanguageServer } from "@vsce/cli";
import { MockExtensionContext } from "@vsce/testing";

export async function activate(context: vscode.ExtensionContext): Promise<void> {
  // Full ecosystem integration example
  const server = await createLanguageServer({
    name: 'my-language-server',
    languages: ['typescript', 'javascript']
  });
  
  context.subscriptions.push(
    vscode.languages.registerHoverProvider(['typescript'], server),
    vscode.languages.registerCompletionItemProvider(['typescript'], server)
  );
}
```

## Runtime Compatibility

| Environment | Support | Notes |
|-------------|---------|-------|
| **VSCode Desktop** | ✅ Full | All APIs available |
| **VSCode Web** | ✅ Most APIs | No Node.js/filesystem APIs |
| **Deno Runtime** | ✅ Type-checking | For development and testing |
| **GitHub Codespaces** | ✅ Full | Web + server APIs |
| **vscode.dev** | ✅ Web APIs | Browser-based development |

---

## 📚 Docs & Resources

- VS Code Extension API: <https://code.visualstudio.com/api>
- VS Code Web Extensions Guide: <https://code.visualstudio.com/api/extension-guides/web-extensions>
- Deno Runtime Documentation: <https://docs.deno.com>
- JSR Package Registry: <https://jsr.io>

---

## License

MIT License - see [LICENSE](./LICENSE) for details.

---

**Happy coding with Deno + VSCode! 🦕⚡**

*Part of the [@vsce ecosystem](https://jsr.io/@vsce) for Deno-based VSCode extension development.*
