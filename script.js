/*eslint no-console: 0*/
'use strict';

const fs = require('fs');

const routePath = 'src/routes/';
const testRoutesPath = 'test/routes/';

let totalRoutes = 0;
let totalRoutesTested = 0;

const displayTotalFiles = true;
const displayTotalRoutes = false;
const displayAllRoutes = false;

const displayTotalTestFiles = true;
const displayTotalTestRoutes = false;
const displayAllTestRoutes = false;

function srcRoutes() {

	this.init = (routePath, callback) => {
        this.beginReadFiles(routePath, callback);
	};

	this.beginReadFiles = (routePath, callback) => {

		this.getAllRoutesFiles(routePath, [], [''], (items) => {

            this.readFile(0, items, () => {

				if(displayTotalRoutes) {
					console.log('--------------------------');
					console.log('TOTAL : '+totalRoutes+' routes !');
					console.log('--------------------------');
				}

				if(callback) callback();
			});
		});
	};

	this.readFile = (i, items, callback) => {

		// Si le fichier est un bien un fichier .js et non un dossier ou autre
		if(typeof items[i] !== "undefined" && items[i].match(/.js/g)) {

			fs.readFile(routePath+items[i], 'utf8', (err,data) => {

				if (err) return console.log(err);

				const countGet = (data.match(/router.get/g) || []).length;
				const countPost = (data.match(/router.post/g) || []).length;
				const countPut = (data.match(/router.put/g) || []).length;
				const countDelete = (data.match(/router.delete/g) || []).length;

				totalRoutes += countPost;
				totalRoutes += countGet;
				totalRoutes += countPut;
				totalRoutes += countDelete;

				const text = 'Le fichier '+items[i]+' possède '+countGet+ ' routes en GET et '+countPost+' routes en POST.';

				if(displayAllRoutes) console.log(text);

				if(i < items.length) return this.readFile(i+1, items, callback);
				return callback();
			});

		} else {

			if(i < items.length) return this.readFile(i+1, items, callback);
			return callback();
		}
	};

	this.getAllRoutesFiles = (routesPath, arrayFiles, arrayFolders, callback) => {

		fs.readdir(routesPath+arrayFolders[0], (err, items) => {

			for (let i = 0; i < items.length; i++) {
				if(typeof items[i] !== "undefined" && items[i].match(/.js/g)) {
					arrayFiles.push(arrayFolders[0]+'/'+items[i]);
				} else {
					arrayFolders.push(items[i]);
				}
			}

			arrayFolders.shift();

			if(arrayFolders.length > 0) {
                this.getAllRoutesFiles(routesPath, arrayFiles, arrayFolders, callback);

			} else {

				if(displayTotalFiles) {
					console.log('--------------------------');
					console.log('TOTAL : '+arrayFiles.length+' fichiers de routes');
					console.log('--------------------------');
				}

		    	return callback(arrayFiles);
			}
		});
	};
}

function testRoutes() {

	this.init = (testRoutesPath, callback) => {
        this.beginReadFiles(testRoutesPath, callback);
	};

	this.beginReadFiles = (testRoutesPath, callback) => {

        this.getAllRoutesFiles(testRoutesPath, [], [''], (items) => {

            this.readFile(0, items, () => {
				if(displayTotalTestRoutes) {
					console.log('--------------------------');
					console.log('TOTAL : '+totalRoutesTested+' routes testées !');
					console.log('--------------------------');
				}

				if(callback) callback();
			});
		});
	};

	this.readFile = (i, items, callback) => {

		// Si le fichier est un bien un fichier .js et non un dossier ou autre
		if(typeof items[i] !== "undefined" && items[i].match(/.js/g)) {

			fs.readFile(testRoutesPath+items[i], 'utf8', (err,data) => {
				if (err) return console.log(err);

				// console.log(data);

				let countRoutes = 0;

				const regex = /(\/\/routeTest)/g;

				if(data.match(regex)) countRoutes = data.match(regex).length;

				totalRoutesTested += countRoutes;

				if(displayAllTestRoutes) console.log(items[i]+ ' '+countRoutes);

				if(i < items.length) return this.readFile(i+1, items, callback);
				return callback();
			});

		} else {

			if(i < items.length) return this.readFile(i+1, items, callback);
			return callback();
		}
	};

	this.getAllRoutesFiles = (testRoutesPath, arrayFiles, arrayFolders, callback) => {

		fs.readdir(testRoutesPath+arrayFolders[0], (err, items) => {

			for (let i = 0; i < items.length; i++) {
				if(typeof items[i] !== "undefined" && items[i].match(/.js/g)) {
					arrayFiles.push(arrayFolders[0]+'/'+items[i]);
				} else {
					arrayFolders.push(items[i]);
				}
			}

			arrayFolders.shift();

			if(arrayFolders.length > 0) {
                this.getAllRoutesFiles(testRoutesPath, arrayFiles, arrayFolders, callback);

			} else {

				if(displayTotalTestFiles) {
					console.log('--------------------------');
					console.log('TOTAL : '+arrayFiles.length+' fichiers de routes testés !');
					console.log('--------------------------');
				}

		    	return callback(arrayFiles);
			}
		});
	};
}

const srcRoutesFunctions = new srcRoutes();
const testRoutesFunctions = new testRoutes();

srcRoutesFunctions.init(routePath, function() {
	testRoutesFunctions.init(testRoutesPath, function() {
		console.log('TOTAL : '+totalRoutesTested+ ' routes testées sur '+totalRoutes);
	});
});
