import { NextApiRequest, NextApiResponse } from "next";
import nextConnect from "next-connect";
import multer from "multer";
import mv from "mv";
import { IncomingForm } from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async (req, res) => {
  const data = new Promise((reso, rej) => {
    const form = new IncomingForm();

    console.log(`api form: `, form);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return rej(err);
      }
      console.log(fields, files);
      console.log(files.file.filepath);

      let oldPath = files.file.filepath;
      let newPath = `./public/uploads/${files.file.originalFilename}`;
      mv(oldPath, newPath, function(err){

      })
      res.status(200).json({fields, files})
    });
  });
};
