/* --------------------------------------------------------------------------------------------
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 * ------------------------------------------------------------------------------------------ */
'use strict';

import * as crypto from "crypto";
import * as fs from 'fs';
import * as path from 'path';
import { workspace, ExtensionContext } from 'coc.nvim';
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from 'coc.nvim';
import { getDefaultPowerShellPath, getPlatformDetails } from './platform';
import Shell from "node-powershell";

// Important paths.
const cocPowerShellRoot = path.join(__dirname, "..", "..");
const bundledModulesPath = path.join(cocPowerShellRoot, "PowerShellEditorServices");
const logPath = path.join(cocPowerShellRoot, `/.pses/logs/${crypto.randomBytes(16).toString("hex")}-${process.pid}`);

// TODO log redirection?
const logger = workspace.createOutputChannel("coc-powershell");

export async function activate(context: ExtensionContext) {
	const pwshPath = getDefaultPowerShellPath(getPlatformDetails())
    logger.appendLine("starting.")
    logger.appendLine(`pwshPath = ${pwshPath}`)
    logger.appendLine(`bundledModulesPath = ${bundledModulesPath}`)

	// If PowerShellEditorServices is not downloaded yet, run the install script to do so.
	if (!fs.existsSync(bundledModulesPath)) {
        let notification = workspace.createStatusBarItem(0, { progress: true})
        notification.text = "Downloading PowerShellEditorServices..."
        notification.show()
        
		const ps = new Shell({
			executionPolicy: 'Bypass',
			noProfile: true
		});

		ps.addCommand(path.join(cocPowerShellRoot, "src", "downloadPSES.ps1"));
        await ps.invoke()
            .catch(e => logger.appendLine("error downloading PSES: " + e))
            .finally(() => {
            notification.hide()
            notification.dispose()
        });

	}

	let serverOptions: ServerOptions = {
		command: pwshPath,
		args: [
			"-NoProfile",
			"-NonInteractive",
			path.join(bundledModulesPath, "/PowerShellEditorServices/Start-EditorServices.ps1"),
			"-HostName", "coc.vim",
			"-HostProfileId", "0",
			"-HostVersion", "2.0.0",
			"-LogPath", path.join(logPath, "log.txt"),
			"-LogLevel", "Diagnostic",
			"-BundledModulesPath", bundledModulesPath,
			"-Stdio",
			"-SessionDetailsPath", path.join(logPath, "session")],
		transport: TransportKind.stdio
	}

	workspace.addRootPatterns('ps1', ['*.ps1', '*.psd1', '*.psm1', '.vim', '.git', '.hg'])

	// Options to control the language client
	let clientOptions: LanguageClientOptions = {
		// Register the server for powershell documents
		documentSelector: [{ scheme: 'file', language: 'ps1' }],
		synchronize: {
			// Synchronize the setting section 'powershell' to the server
			configurationSection: 'ps1',
			// Notify the server about file changes to PowerShell files contain in the workspace
			fileEvents: [
				workspace.createFileSystemWatcher('**/*.ps1'),
				workspace.createFileSystemWatcher('**/*.psd1'),
				workspace.createFileSystemWatcher('**/*.psm1')
			]
		}
	}

	// Create the language client and start the client.
	let client = new LanguageClient('ps1', 'PowerShell Language Server', serverOptions, clientOptions);
	let disposable = client.start();

	// Push the disposable to the context's subscriptions so that the 
	// client can be deactivated on extension deactivation
	context.subscriptions.push(disposable);
}