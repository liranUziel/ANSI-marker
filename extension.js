const vscode = require("vscode");

let activeDecorations = []; // Store active decorations

const handleDocumentChange = (document) => {
    if (
        [
            "javascript",
            "typescript",
            "javascriptreact",
            "typescriptreact",
        ].includes(document.languageId)
    ) {
        activeDecorations.forEach((decoration) => {
            vscode.window.activeTextEditor.setDecorations(decoration, []);
        });
        activeDecorations = []; // Reset active decorations array
        let decorations = [];

        const content = document.getText();
        const lines = content.split("\n");
        const ANSI_REGEXP = /\/\/(A|a)(N|n)(S|s)(I|i)/g;

        lines.forEach((line, index) => {
            ANSI_REGEXP.lastIndex = 0;
            const match = ANSI_REGEXP.test(line);
            if (match) {
                const right = line.toLocaleLowerCase().split("//ansi")[1];
                const flags = right.split("]")[0].split("[")[1].split(" ");
                const msg = right.split("]")[1];
                if (!msg) {
                    return;
                }
                const msgRange = new vscode.Range(
                    new vscode.Position(index, line.indexOf(msg) + 1),
                    new vscode.Position(index, line.length)
                );
                for (let i = 0; i < flags.length; i++) {
                    switch (flags[i]) {
                        case "color": {
                            if (i + 1 < flags.length && !isNaN(flags[i + 1])) {
                                const textColor = ansiColorValueToRGBA(
                                    flags[i + 1]
                                );
                                if (textColor !== undefined) {
                                    const decorationType =
                                        vscode.window.createTextEditorDecorationType(
                                            {
                                                color: textColor,
                                            }
                                        );
                                    decorations.push({
                                        decorationType: decorationType,
                                        range: msgRange,
                                    });
                                }
                            }
                            break;
                        }
                        case "bg-color": {
                            if (i + 1 < flags.length && !isNaN(flags[i + 1])) {
                                const textColor = ansiColorValueToRGBA(
                                    flags[i + 1]
                                );
                                if (textColor !== undefined) {
                                    const decorationType =
                                        vscode.window.createTextEditorDecorationType(
                                            {
                                                backgroundColor: textColor,
                                            }
                                        );
                                    decorations.push({
                                        decorationType: decorationType,
                                        range: msgRange,
                                    });
                                }
                            }
                            break;
                        }
                        case "bold": {
                            const decorationType =
                                vscode.window.createTextEditorDecorationType({
                                    fontWeight: "bold",
                                });
                            decorations.push({
                                decorationType: decorationType,
                                range: msgRange,
                            });

                            break;
                        }
                        case "italic": {
                            const decorationType =
                                vscode.window.createTextEditorDecorationType({
                                    fontStyle: "italic",
                                });
                            decorations.push({
                                decorationType: decorationType,
                                range: msgRange,
                            });
                            break;
                        }
                        case "underline": {
                            const decorationType =
                                vscode.window.createTextEditorDecorationType({
                                    textDecoration: "underline",
                                });
                            decorations.push({
                                decorationType: decorationType,
                                range: msgRange,
                            });
                            break;
                        }
                        case "strikethrough": {
                            const decorationType =
                                vscode.window.createTextEditorDecorationType({
                                    textDecoration: "line-through",
                                });
                            decorations.push({
                                decorationType: decorationType,
                                range: msgRange,
                            });
                            break;
                        }
                    }
                }
            }
        });
        decorations.forEach((decoration) => {
            vscode.window.activeTextEditor.setDecorations(
                decoration.decorationType,
                [decoration.range]
            );
            activeDecorations.push(decoration.decorationType);
        });
    }
};

function activate(context) {
    console.log('Congratulations, your extension "ansi-marker" is now active!');

    const disposable = vscode.commands.registerCommand(
        "ansi-marker",
        function () {
            vscode.window.showInformationMessage("Ansi marker is running.");
        }
    );
    vscode.workspace.onDidChangeTextDocument((event) => {
        if (event.document === vscode.window.activeTextEditor.document) {
            handleDocumentChange(event.document);
        }
    });

    vscode.workspace.onDidOpenTextDocument((document) => {
        handleDocumentChange(document);
    });
    context.subscriptions.push(disposable);
}

function deactivate() {}

function ansiColorValueToRGBA(value) {
    const color = parseInt(value);
    if ((color >= 30 && color <= 37) || (color >= 40 && color <= 47)) {
        const colorIndex = color % 10;
        switch (colorIndex) {
            case 0:
                return "rgba(0,0,0,1)";
            case 1:
                return "rgba(205,49,49,1)";
            case 2:
                return "rgba(13,188,121,1)";
            case 3:
                return "rgba(229,229,16,1)";
            case 4:
                return "rgba(36,114,200,1)";
            case 5:
                return "rgba(136,23,152,1)";
            case 6:
                return "rgba(58,150,221,1)";
            case 7:
                return "rgba(204,204,204,1)";
        }
    } else if ((color >= 90 && color <= 97) || (color >= 100 && color <= 107)) {
        const colorIndex = color % 10;
        switch (colorIndex) {
            case 0:
                return "rgba(102,102,102,1)";
            case 1:
                return "rgba(241,76,76,1)";
            case 2:
                return "rgba(35,209,139,1)";
            case 3:
                return "rgba(245,245,16,1)";
            case 4:
                return "rgba(59,142,234,1)";
            case 5:
                return "rgba(214,112,214,1)";
            case 6:
                return "rgba(41,184,219,1)";
            case 7:
                return "rgba(229,229,229,1)";
        }
    } else {
        return undefined;
    }
}
function effect(type) {}

module.exports = {
    activate,
    deactivate,
};
