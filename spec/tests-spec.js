/** @babel */

import url from "url";
import qs from "querystring";
import open from "../";

describe("Open", function () {
	beforeEach(function () {
		spyOn(atom, "open");
		spyOn(atom, "confirm");
		this.confirmReturn = (bool) => atom.confirm.and.callFake((options, callback) => callback(bool));
		this.confirmReturn(true);
		this.testUrl = (query = {}) => {
			if (!query.file && !query.url) {
				query.file = "test/file.ext";
			}
			return url.parse(`atom://open/?${qs.stringify(query)}`, true);
		};
	});

	it("should call open on uri", async function () {
		// atom.packages.loadPackage("open").activateNow();
		spyOn(open, "handleURI");
		const activationPromise = atom.packages.activatePackage("open");
		atom.uriHandlerRegistry.handleURI("atom://open");
		await activationPromise;

		expect(open.handleURI).toHaveBeenCalled();
	});

	describe("handleURI", function () {
		beforeEach(function () {
			atom.packages.loadPackage("open").activateNow();
		});

		it("should call atom.open on confirm", async function () {
			await open.handleURI(this.testUrl());

			expect(atom.confirm).toHaveBeenCalled();
			expect(atom.open).toHaveBeenCalledWith(jasmine.objectContaining({
				pathsToOpen: ["test/file.ext"],
			}));
		});

		it("should not confirm", async function () {
			atom.config.set("open.confirmBeforeOpen", false);
			await open.handleURI(this.testUrl());

			expect(atom.confirm).not.toHaveBeenCalled();
			expect(atom.open).toHaveBeenCalled();
		});

		it("should cancel on no confirm", async function () {
			this.confirmReturn(false);
			await open.handleURI(this.testUrl());

			expect(atom.confirm).toHaveBeenCalled();
			expect(atom.open).not.toHaveBeenCalled();
		});

		it("should open project folder", async function () {
			atom.config.set("open.openProject", true);
			spyOn(atom.history, "getProjects").and.returnValue([{paths: ["test/"]}]);
			await open.handleURI(this.testUrl());

			expect(atom.open).toHaveBeenCalledWith(jasmine.objectContaining({
				pathsToOpen: ["test/file.ext", "test/"],
			}));
		});

		it("should pass params to atom.open", async function () {
			spyOn(atom.project, "getPaths").and.returnValue(["test"]);
			await open.handleURI(this.testUrl({
				file: "/path/test.js",
				line: 1,
				column: 2,
				devMode: true,
				safeMode: true,
				newWindow: true,
			}));

			expect(atom.open).toHaveBeenCalledWith(jasmine.objectContaining({
				pathsToOpen: ["/path/test.js:1:2"],
				devMode: true,
				safeMode: true,
				newWindow: true,
			}));
		});

		it("should not open newWindow on firstWindow", async function () {
			await open.handleURI(this.testUrl({
				newWindow: true,
			}));

			expect(atom.open).toHaveBeenCalledWith(jasmine.objectContaining({
				newWindow: false,
			}));
		});

		it("should pass params to atom.open using textMate scheme", async function () {
			await open.handleURI(this.testUrl({
				url: "file:///path/test.js",
				line: 1,
				column: 2,
			}));

			expect(atom.open).toHaveBeenCalledWith(jasmine.objectContaining({
				pathsToOpen: ["/path/test.js:1:2"],
			}));
		});
	});
});
