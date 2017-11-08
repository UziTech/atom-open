"use babel";

import { CompositeDisposable } from "atom";

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

	handleURI(uri) {
		const { query } = uri;

		// query.url will overwrite query.file if both exist
		query.file = query.url || query.file;

		const file = (query.file ? query.file.replace(/^file:\/\//, "") : "");

		if (!file) {
			return;
		}

		const line = (+query.line ? `:${+query.line}` : "");
		const column = (+query.column ? `:${+query.column}` : "");
		const devMode = (typeof query.devMode !== "undefined");
		const safeMode = (typeof query.safeMode !== "undefined");
		const newWindow = (typeof query.newWindow !== "undefined");
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

		const confirm = !this.confirmBeforeOpen || atom.confirm({
			message: "Do you want to open the file?",
			detailedMessage: file,
			buttons: {
				"Open": () => true,
				"Cancel": () => false,
			}
		});

		if (confirm) {
			atom.open({
				pathsToOpen,
				devMode,
				safeMode,
				newWindow,
			});
		}
	},

};
