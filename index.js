/** @babel */

import {CompositeDisposable} from "atom";
import {promisify} from "promisificator";

export default {

	/**
	 * Activate package
	 * @return {void}
	 */
	activate() {
		this.disposables = new CompositeDisposable();

		this.disposables.add(atom.config.observe("open.confirmBeforeOpen", (value) => {
			this.confirmBeforeOpen = value;
		}));
		this.disposables.add(atom.config.observe("open.openProject", (value) => {
			this.openProject = value;
		}));
	},

	/**
	 * Deactivate package
	 * @return {void}
	 */
	deactivate() {
		this.disposables.dispose();
	},

	async handleURI(uri) {
		const {query} = uri;

		// query.url will overwrite query.file if both exist
		query.file = query.url || query.file;

		const file = (query.file ? query.file.replace(/^file:\/\//, "") : "");

		if (!file) {
			return;
		}

		const loadSettings = atom.getLoadSettings();
		const initialPaths = loadSettings.initialProjectRoots || loadSettings.initialPaths;
		const isFirstWindow = atom.project.getPaths().length === 0 && Array.isArray(initialPaths) && initialPaths.length === 0;
		const line = (+query.line ? `:${+query.line}` : "");
		const column = (+query.column ? `:${+query.column}` : "");
		const devMode = (typeof query.devMode !== "undefined");
		const safeMode = (typeof query.safeMode !== "undefined");
		const newWindow = (typeof query.newWindow !== "undefined") && !isFirstWindow;
		let pathsToOpen = [file + line + column];

		if (this.openProject) {
			const projects = atom.history.getProjects().map(proj => proj.paths);
			for (var i = 0; i < projects.length; i++) {
				const includesFile = projects[i].some(path => file.startsWith(path));
				if (includesFile) {
					pathsToOpen = pathsToOpen.concat(projects[i]);
					break;
				}
			}
		}

		if (this.confirmBeforeOpen) {
			const [confirmButton, hideDialog] = await promisify(
				atom.confirm.bind(atom),
				{rejectOnError: false, alwaysReturnArray: true}
			)({
				checkboxLabel: "Never Show This Dialog Again",
				message: "Do you want to open the file?",
				detail: file,
				buttons: [
					"Open",
					"Cancel",
				]
			});

			if (hideDialog) {
				atom.config.set("open.confirmBeforeOpen", false);
			}

			if (confirmButton === 1) {
				return;
			}
		}

		atom.open({
			pathsToOpen,
			devMode,
			safeMode,
			newWindow,
		});
	},

};
