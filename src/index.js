import path from 'path';
import fs from 'fs';

const IMG_PREFIX = 'img_';
const VID_PREFIX = 'vid_';

// first two bytes are end of image, next 4 need to be preserved for mp4 header
const IMG_DELIM = Buffer.from([0xFF, 0xD9, 0x00, 0x00, 0x00, 0x18]);

let scannedNum = 0;
let splitNum = 0;

function splitFile(srcFilename, destPath, dirPath) {

	// original file path / name / extension
	let destLocal = path.join(destPath, dirPath);
	let filename = path.basename(srcFilename).split('.')[0];
	let extension = path.extname(srcFilename);

	let buffer = fs.readFileSync(srcFilename);

	// split the buffer at the delimeter
	let splitAt = buffer.indexOf(IMG_DELIM);
	if (~splitAt) {


		fs.mkdirSync(destLocal, { recursive: true });

		fs.writeFileSync(path.join(destLocal, IMG_PREFIX + filename + extension), buffer.subarray(0, splitAt));
		fs.writeFileSync(path.join(destLocal, VID_PREFIX + filename + '.mp4'), buffer.subarray(splitAt + 2));

		splitNum++;
	}

	scannedNum++;
}

function splitFiles(dir, destPath, dirPath = '') {
	let files = fs.readdirSync(dir);

	for (let file of files) {

		let filePath = path.join(dir, file);

		if (fs.statSync(filePath).isDirectory()) {
			splitFiles(filePath, destPath, path.join(dirPath, file));
		} else {
			splitFile(filePath, destPath, dirPath);
		}
	}
}

try {
	console.log('Scanning...');

	if (process.argv.length != 4) {
		throw new Error('Failed to read args for src folder and destination folder: split <src> <dest>');
	}

	splitFiles(process.argv[2], process.argv[3]);

	console.log(`Scanned ${scannedNum} files.`);
	console.log(`Split ${splitNum} files.`);

} catch (e) {
	console.error('Failed to split motion files: ' + e);
}