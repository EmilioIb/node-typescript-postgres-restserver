import path from 'path';
import fs from 'fs';
import { UploadedFile } from 'express-fileupload';
import { CustomError } from '../../domain';
import { UuidAdapter } from '../../config';

export class FileUploadService {
  constructor(private readonly uuid = UuidAdapter.v4) {}

  private checkFolder(folderPath: string) {
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath);
  }

  async uploadSingle(file: UploadedFile, folder: string = 'uploads', validExtensions: string[] = ['png', 'jpg', 'jpeg', 'gif']) {
    const fileExtension = file.mimetype.split('/')[1];
    if (!validExtensions.includes(fileExtension)) throw CustomError.badRequest(`Invalid extension: ${fileExtension}, valid ones ${validExtensions}`);

    try {
      const destionation = path.resolve(__dirname, '../../../', folder);
      this.checkFolder(destionation);

      const fileName = `${this.uuid()}.${fileExtension}`;
      file.mv(`${destionation}/${fileName}`);

      return { fileName };
    } catch (error) {
      throw CustomError.internalServer('Error uploading file');
    }
  }

  async uploadMultiple(files: UploadedFile[], folder: string = 'uploads', validExtensions: string[] = ['png, jpg', 'jpeg', 'gif']) {
    const fileNames = await Promise.all(files.map(file => this.uploadSingle(file, folder, validExtensions)));
    return fileNames;
  }
}
