import fs from 'fs'
import util from 'util'
import { parse } from "csv-parse"
import { validate } from '../services/utils.services.js'
import { updateUser } from '../models/user.model.js'

const unlink = util.promisify(fs.unlink)
const fileInfo = util.promisify(fs.stat)


async function uploadCSV (req:any, res:any) {
    let phoneNumbers: any = []
    let userData = null
    if(!req.file) {
        return res.status(404).json({message: 'file has not been found'})
    }
    if(!req.params && !req.params.name) {
        return res.status(400).json({message: 'bad request'})
    }
    try {
        // validate user
        const user:any = await validate(req)
        // save file key to database
        if (!user) {
            return res.status(401).json({ message: 'user is not valid' })
        }
        await fileInfo(req.file.path)
        // read csv
        fs.createReadStream(req.file.path)
        .pipe(parse({delimiter: ','}))
        .on('data', async function (row) {
            phoneNumbers = row.map((num: any) => ({phone: num}))
        })
        .on('error', function (error){
            console.log('error: ', error)
        })
        .on('end', async function () {
            console.log('finished')
            userData = await updateUser(
                user.id,
                {
                    groups: {
                        create: {
                            name: req.params.name,
                            contacts: {
                                createMany: {
                                    data: phoneNumbers
                                }
                            }
                        }
                    }
                }
            )
        // save numbers to DB
        await unlink(req.file.path)
        return res.status(200).json({
            message: 'csv has been uploaded',
            userData
        })
        })
    } catch (error) {
        return res.status(500).json({error})
    }
}

export {
    uploadCSV
}