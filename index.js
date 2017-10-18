"use babel";

export default {

	/**
	 * Activate package
	 * @return {void}
	 */
	activate() {},

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
		atom.open({
			pathsToOpen: [file]
		});
	},

};
