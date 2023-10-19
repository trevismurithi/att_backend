import express from 'express'
import path from 'path'
import multer from 'multer'
import { fileFilter } from '../services/utils.services.js';
import { uploadCSV } from '../controller/file.controller.js'

const fileRouter = express.Router()
const upload = multer({dest: path.join('uploads/'), fileFilter})
fileRouter.post('/upload/:name',upload.single('file'),uploadCSV)

export { fileRouter } 