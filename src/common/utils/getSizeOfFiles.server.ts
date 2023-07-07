import fs from 'fs-extra';


const getAllFiles = async (dirPath: string, arrayOfFiles: string[] = []) => {
	const stat = await fs.stat(dirPath);
	if (stat.isDirectory()) {
		const files = await fs.readdir(dirPath, {withFileTypes: true});
		await Promise.all(files.map(async file => {
			const filePath = `${dirPath}/${file.name}`;
			if (file.isDirectory()) {
				arrayOfFiles = await getAllFiles(filePath, arrayOfFiles);
			} else {
				arrayOfFiles.push(filePath);
			}
		}));
	} else {
		arrayOfFiles.push(dirPath);
	}
	return arrayOfFiles;
};

export const getTotalSize = async (dirPath: string) => {
	const arrayOfFiles = await getAllFiles(dirPath);
	return arrayOfFiles.reduce((size, filePath) => size + fs.statSync(filePath).size, 0);
};
