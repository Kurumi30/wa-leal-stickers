import ffmpeg from "fluent-ffmpeg"
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg'
ffmpeg.setFfmpegPath(ffmpegInstaller.path)
import crypto from 'node:crypto'
import webp from "node-webpmux"
import fs from 'fs-extra'
import {fileTypeFromBuffer} from 'file-type'
import sharp from 'sharp'
import path from 'path'
sharp.cache({files: 0})


export const createSticker = async (buffer, options)=>{
    if(!fs.pathExistsSync(path.resolve('tmp'))) fs.mkdirSync(path.resolve('tmp'))
    let {mime} = await fileTypeFromBuffer(buffer)
    let isVideo = mime.startsWith('video')
    let isAnimated = isVideo || mime.includes('gif') || mime.includes('webp')
    const webpOutputPath = await convertToWebp(buffer, isVideo, options.fps)
    const img = sharp(webpOutputPath, {animated: isAnimated}).toFormat('webp')

    switch (options.type) {
        case 'circle':
            img.composite([
                {
                    input: Buffer.from(
                        `<svg width="512" height="512"><circle cx="256" cy="256" r="256"/></svg>`
                    ),
                    blend: 'dest-in',
                    gravity: 'northeast',
                    tile: true
                }
            ])
            break
        
        case 'default':
            break

        case 'rounded':
            img.composite([
                {
                    input: Buffer.from(
                        `<svg width="512" height="512"><rect rx="75" ry="75" width="512" height="512"/></svg>`
                    ),
                    blend: 'dest-in',
                    gravity: 'northeast',
                    tile: true
                }
            ])
            break
    }

    const sharpStickerPath = path.resolve(`tmp/${Math.random().toString(36)}.webp`)
    await img.webp({quality: options.quality, lossless: false}).toFile(sharpStickerPath)
    const bufferSticker = await addExif(sharpStickerPath, options.pack, options.author)
    fs.unlinkSync(webpOutputPath)
    fs.unlinkSync(sharpStickerPath)

    return bufferSticker
}

async function convertToWebp(buffer, isVideo, fps){
    return new Promise((resolve,reject)=>{
        let inputPath,optionsFfmpeg, webpPath = path.resolve(`tmp/${Math.random().toString(36)}.webp`)
        if(isVideo){
            inputPath = path.resolve(`tmp/${Math.random().toString(36)}.mp4`)
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
            inputPath = path.resolve(`tmp/${Math.random().toString(36)}.png`)
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
            fs.unlinkSync(inputPath)
            resolve(webpPath)
        }).on('error', async (err)=>{
            fs.unlinkSync(inputPath)
            reject(err)
        })
    })
}

async function addExif(file, pack, author){
    const img = new webp.Image()
    const stickerPackId = crypto.randomBytes(32).toString('hex')
    const json = { 'sticker-pack-id': stickerPackId, 'sticker-pack-name': pack, 'sticker-pack-publisher': author}
    let exifAttr = Buffer.from([0x49, 0x49, 0x2A, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57, 0x07, 0x00, 0x00, 0x00, 0x00, 0x00, 0x16, 0x00, 0x00, 0x00])
    let jsonBuffer = Buffer.from(JSON.stringify(json), 'utf8')
    let exif = Buffer.concat([exifAttr, jsonBuffer])
    exif.writeUIntLE(jsonBuffer.length, 14, 4)
    await img.load(file)
    img.exif = exif
    return await img.save(null)
}