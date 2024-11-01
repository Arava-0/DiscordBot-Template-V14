const { glob } = require("glob");
const path = require("path");

async function deleteCachedFile(file)
{
	const filePath = path.resolve(file)
	if (require.cache[filePath]){
		delete require.cache[filePath];
	}
}

async function loadFiles(dirName, excludeDirs = []) {
	try {
		const files = await glob(path.join(process.cwd(), dirName, "**/*.js").replace(/\\/g, "/"));
		let jsfiles = files.filter((file) => path.extname(file) === ".js");
		await Promise.all(jsfiles.map(deleteCachedFile));

		jsfiles = jsfiles.filter((file) => !excludeDirs.some((dir) => file.includes(dir)));

		return (jsfiles);
	} catch (err) {
		console.error(`Error while loading files from directory ${dirName}: ${err}`);
		throw err;
	}
}

module.exports = { loadFiles };