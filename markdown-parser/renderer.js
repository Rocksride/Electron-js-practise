const Rx = require('rxjs/Rx');
const marked = require('marked');
const { remote, ipcRenderer} = require('electron');
const { Observable } = Rx;
const currentWindow = remote.getCurrentWindow();
const newFile = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveFile = document.querySelector('#save-file');
const revertFile = document.querySelector('#revert-file');
const saveHTML = document.querySelector('#save-html');
const markdownView = document.querySelector('#markdown-view');
const HTMLView =document.querySelector('#html-view');
let isChanged = false;

const mainProcess = remote.require('./main');

const markdownView$ = Observable.fromEvent(markdownView, 'keyup');
const openFileButton$ = Observable.fromEvent(openFileButton, 'click');
const openNewFile$ = Observable.fromEvent(newFile, 'click');

const openFileSubscr = openFileButton$
	.subscribe(event => {
		mainProcess.openFile(currentWindow)
	});

const openNewFileSubscr = openNewFile$
	.subscribe(event => {
		mainProcess.createWindow();
	})
const renderMarkdownToHTML = (markdown) => {
	HTMLView.innerHTML = marked(markdown, {sanitize: true });
}

const subsHTML = markdownView$.subscribe(
	event => {
		renderMarkdownToHTML(event.target.value);
		if (event.target.value.length != 0) {
			isChanged = true;
			console.log(isChanged);
			saveFile.classList.toggle('disabled-button', !isChanged);	
		} else {
			isChanged = false;
			console.log(isChanged);
			saveFile.classList.toggle('disabled-button', !isChanged);
		}

	}
);

ipcRenderer.on('file-opened', (event, file, content) => {
	markdownView.value = content;
	renderMarkdownToHTML(content);
});
