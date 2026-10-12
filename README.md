# Viora Extension 2

This repository contains a packaged extension ZIP and `Idea.txt`, which describes intended features. Planning notes are not proof that every feature is implemented in the ZIP.

## Install for testing

1. Download `viora-extension-6-1-Best-VR.zip`.
2. Extract the ZIP to a folder.
3. Review the extracted files and the extension manifest.
4. For a Chrome/Edge unpacked extension, open the browser's extensions page, enable Developer mode, choose **Load unpacked**, and select the folder that contains `manifest.json`.
5. Test in a separate browser profile before using personal accounts.

## Before publishing

- Include the unpacked source and build instructions.
- Add a changelog and list tested browser versions.
- Request only permissions that are necessary.
- Store API keys in supported local configuration, never in source code or Git.
- Clearly distinguish implemented features from ideas in `Idea.txt`.

Only install packages you trust, and review browser permissions before enabling the extension.
