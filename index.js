"use babel";

export default {

	/**
	 * Activate package
	 * @return {void}
	 */
	activate() {
		this.confirmBeforeOpen = true;
		atom.config.observe("open.confirmBeforeOpen", function (value) {
			this.confirmBeforeOpen = value;
		});
	},

	/**
	 * Deactivate package
	 * @return {void}
	 */
	deactivate() {},

	handleURI(uri) {
		let file = uri.query.url.replace(/^file:\/\//, "") || "";

		if (!file) {
			return;
		}

		if (typeof uri.query.line !== "undefined") {
			file += ":" + +uri.query.line;
			file += (uri.query.column ? ":" + +uri.query.column : "");
		}

		let confirm = true;

		if (this.confirmBeforeOpen) {
			confirm = atom.confirm({
				message: "Do you want to open the file?",
				detailedMessage: file,
				buttons: {
					"Open": () => true,
					"Cancel": () => false,
				}
			});
		}

		if (confirm) {
			atom.open({
				pathsToOpen: [file]
			});
		}
	},

};
