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
  const data = new Promise((resolve, reject) => {
    const form = new IncomingForm();

    // console.log(`api form: `, form);

    form.parse(req, (err, fields, files) => {
      if (err) {
        return reject(err);
      }
       console.log(`fields: `, fields);
      // console.log(files.file.filepath);

      let oldPathAudio;
      let oldPathImage;

      let newPathAudio;
      let newPathImage;

      if (files.audioFile){
        oldPathAudio = files.audioFile.filepath;
        newPathAudio = `./public/uploads/${files.audioFile.originalFilename}`;
        mv(oldPathAudio, newPathAudio, function(err){

        })
      }
      if (files.imageFile){
        oldPathImage = files.imageFile.filepath;
        newPathImage = `./public/uploads/${files.imageFile.originalFilename}`;
        mv(oldPathImage, newPathImage, function(err){

        })
      }
   
      
     return res.status(200).json({fields, files})
     
    });
  });
};
