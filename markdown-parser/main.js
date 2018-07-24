const {app, BrowserWindow, dialog } = require('electron');
const fs = require('fs');

let mainWindow = null;

const windows = new Set();

const createWindow = exports.createWindow = () => {
	let newWindow = new BrowserWindow({
		width:700,
		height: 600,
		show: false,
		minWidth:600,
		minHeight:500
	});
	windows.add(newWindow);

	newWindow.loadURL(`file://${__dirname}/index.html`);
	// mainWindow.toggleDevTools();

	newWindow.once('ready-to-show', () => {
		newWindow.show();
	});
	newWindow.on('close', (event) => {
		event.preventDefault();
		if (newWindow.isDocumentEdited()) {
		const result = 	dialog.showMessageBox(newWindow, {
				type: 'warning',
				title: 'Quick with unsaved Changes?',
				message: 'You changes will be lost unless you save them first',
				buttons: [
					'Quit Anyway',
					'Cancel'
				],
				defaultId: 0,
				cancelId: 1
			});
		if (result === 0) {
			newWindow.destroy();
		}
		}
	});
	newWindow.on('closed', () => {
		windows.delete(newWindow);
		newWindow = null;
	});
}
const getFileFromUserSelection = (targetWindow) => {
	const files = dialog.showOpenDialog(targetWindow, {
		properties: ['openFile'],
		filters: [
			{name :'Text files', extensions: ['txt', 'text'] },
			{name :'Markdown files', extensions: ['md', 'markdown'] },
		]
	});
	if (!files) return;
	return  files[0];

};

const openFile = exports.openFile = (targetWindow, filePath) => {
	const file = filePath || getFileFromUserSelection(targetWindow);
	app.addRecentDocument(file);
	const content = fs.readFileSync(file).toString();
	targetWindow.webContents.send('file-opened', file, content);
	targetWindow.setTitle(`${file} - Fire Sale`);
};

app.on('ready', () => {
	createWindow();
});

