require('dotenv').config();

const express    = require('express');
const fileUpload = require('express-fileupload');
const cors       = require('cors');
const fs         = require('fs-extra');

const { uploadMedia, deleteMedia } = require('./cloudinary');
const { plainFilesTree } = require('./helpers');

const PORT = Number(process.env.PORT);
const MAX_FILE_SIZE = 10485760; // 100 mb

function main() {
  const app = express();

  app.use(express.json());
  app.use(cors());
  app.use(fileUpload({
    tempFileDir: './temp-media',
    useTempFiles: true
  }));
  app.use((req, res, next) => {
    console.log(`Request '${req.method}' received at ${req.url}`);
    next();
  });
  
  app.post('/media', (req, res) => {
    console.log(req.files);
    const uploadingPromises = [];
    const filesInformation = [];
    
    if (req.files) {
      const files = plainFilesTree(req.files);

      for (let file of files) {

        if (file.size < MAX_FILE_SIZE) {
          uploadingPromises.push(
            uploadMedia(file.tempFilePath, file.mimetype)
          );
          filesInformation.push({
            name: file.name,
            mimetype: file.mimetype
          });
          fs.remove(file.tempFilePath);
        }
        else {
          // TODO: pushing with low quality
        }
      }

      Promise.allSettled(uploadingPromises).then(results => {
        console.log('🐢 RESULTS:', results);
        res.json(results.map((result, i) => {
          if (result.status !== 'rejected') {
            return ({
              title: filesInformation[i].name,
              url: result.value.secure_url,
              public_id: result.value.public_id,
              type: filesInformation[i].mimetype || 'unknown'
            })
          }
        }));
      })
    }
    else {
      res.status(400).send('No files provided');
    }
  })
  app.delete('/media/:id', (req, res) => {
    deleteMedia(req.params.id).then(() => {
      res.sendStatus(204);
    }).catch(error => {
      console.log(error);
      res.status(500).json({
        message: error.message
      })
    })
  })

  app.listen(PORT);
  console.log('Listening on port', PORT);
}

if (require.main === module) main();
