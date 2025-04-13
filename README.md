[中文文档](README_zh.md)

# Photoshop Batch Scale Plugin

This UXP plugin for Adobe Photoshop allows batch scaling of multiple layers while keeping them in place. It's particularly useful for designers working with multiple layers that need consistent scaling.

## Features
- Scale multiple selected layers simultaneously
- Maintain layer positions during scaling
- Simple percentage-based scaling input
- Preserves layer relationships and compositions

## Installation

### Reminder: Before using the PS Beta version plugin, please make sure that you have installed Creative Cloud (click here to download) and logged in to your Adobe account.

If Adobe Creative Cloud is not installed, the following image will appear when installing the beta plugin:

If the PS version is lower than 2021, the following image will appear:

## Install the plugin

If you have installed and logged in to Creative Cloud, and the PS version is 2021 or above. After downloading the Mockplus plugin, double-click the file to open it:

After double-clicking, Creative Cloud will automatically open, click "Local Installation":

The following status indicates successful installation:

Then open the 2021 or later version of PS, "Plug-ins" - "Upload Design", you can start using the PS Beta version plugin.

## Unable to open the add-in after updating Creative Cloud

Method 1:

1. Please log in with a foreign Adobe account or Google email account, and double-click the plugin to install after logging in.

Method 2:

Mac computer

1. Mac computer opens the terminal. (Shortcut key command + space, search for terminal, and click Enter.)

2. Paste the following code into the terminal:

"/Library/Application Support/Adobe/Adobe Desktop Common/RemoteComponents/UPI/UnifiedPluginInstallerAgent/UnifiedPluginInstallerAgent.app/Contents/MacOS/UnifiedPluginInstallerAgent" --install

(Note: There is a space after install)

3. Drag the downloaded Beta version plugin into the terminal and click Enter.

4. After successful installation, restart PS. In the top "Plug-ins" - "Upload Design", you can start using the PS Beta version plugin.

Windows computer

1. Search for "terminal" in the search bar and click Windows PowerShell

2. Paste the following code and press Enter:

cd "C:\Program Files\Common Files\Adobe\Adobe Desktop Common\RemoteComponents\UPI\UnifiedPluginInstallerAgent"

3. Then paste the following code

.\UnifiedPluginInstallerAgent.exe /install

(Note: There is a space after install)

4. Drag the plugin to be installed into the terminal and press Enter.

5. After successful installation, restart PS. In the top "Plug-ins" - "Upload Design", you can start using the PS Beta version plugin.

Method 3:

Mac M1 computers can make the following settings to use the official version of the plugin.

1. Right-click "PS application - Show Introduction", check "Use Rosetta to open". If there is no such option, you can install the latest version of PS software;

2. After checking, download the official version of the PS plugin;

3. After installation, please restart the PS software and wake up the official version of the plugin in the top "Window-Extension".

## Usage
1. Open your document in Photoshop
2. Select multiple layers you want to scale
3. Run the Batch Scale plugin
4. Enter the desired scale percentage (e.g. 50 for 50%)
5. Click "Scale" to apply the transformation

## Development Setup
To modify or extend this plugin:

1. Install dependencies:
   `npm install`

2. Start development server:
   `npm run watch`

3. The plugin will automatically reload when you make changes to the source files.

## Project Structure
- `index.js` - Main plugin logic
- `index.html` - Plugin UI
- `style.css` - Plugin styles
- `manifest.json` - Plugin configuration
- `batch_scale_PS.ccx` - Photoshop CCX Plugin file
- `icons/` - Plugin icons for different themes and resolutions

## License
MIT - See LICENSE file for details
