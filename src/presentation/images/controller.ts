import { Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

export class ImageController {
  constructor() {}

  getImage = (req: Request, res: Response) => {
    const { type = '', image = '' } = req.params;

    const imagePath = path.resolve(__dirname, `../../../uploads/${type}/${image}`);
    console.log(imagePath);

    if (!fs.existsSync(imagePath)) return res.status(404).send('Image not found');

    res.sendFile(imagePath);
  };
}
