import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
import crypto from 'node:crypto'
import webp from "node-webpmux"
import fs from 'fs-extra'
import {fileTypeFromBuffer} from 'file-type'
import {tmpdir} from 'os'



export const createSticker = async (buffer, options)=>{
    let {mime} = await fileTypeFromBuffer(buffer)
    let isVideo = mime.startsWith('video')
    const bufferWebp = await convertToWebp(buffer, isVideo, options.fps)
    return await addExif(bufferWebp, options.pack, options.author)
}

async function convertToWebp(buffer, isVideo, fps){
    return new Promise((resolve,reject)=>{
        let inputPath,optionsFfmpeg, webpPath = `${tmpdir()}/${Math.random().toString(36)}.webp`
        if(isVideo){
            inputPath = `${tmpdir()}/${Math.random().toString(36)}.mp4`
            optionsFfmpeg = [
                "-vcodec libwebp",
                "-filter:v",
                `fps=fps=${fps}`,
                "-lossless 0",
                "-compression_level 4",
                "-q:v 10",
                "-loop 1",
                "-preset picture",
                "-an",
                "-vsync 0",
                "-s 512:512"
            ]
        } else{
            inputPath = `${tmpdir()}/${Math.random().toString(36)}.png`
            optionsFfmpeg = [
                "-vcodec libwebp",
                "-loop 0",
                "-lossless 1",
                "-q:v 100",
                "-s 512:512"
            ]
        }

        fs.writeFileSync(inputPath, buffer)

        ffmpeg(inputPath).outputOptions(optionsFfmpeg).save(webpPath).on('end', async ()=>{
            let buffer = fs.readFileSync(webpPath)
            fs.unlinkSync(webpPath)
            fs.unlinkSync(inputPath)
            resolve(buffer)
        }).on('error', async (err)=>{
            fs.unlinkSync(inputPath)
            reject(err)
        })
    })
}

async function addExif(buffer, pack, author){
    const img = new webp.Image()
    const stickerPackId = crypto.randomBytes(32).toString('hex')
    const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': pack, 'sticker-pack-publisher': author}
    let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
    let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
    let exif = Buffer.concat([exifAttr, jsonBuffer])
    exif.writeUIntLE(jsonBuffer.length, 14, 4)
    await img.load(buffer)
    img.exif = exif
    return await img.save(null)
}