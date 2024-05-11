import fs from 'fs-extra'
import {toSticker, StickerTypes} from './index.js'

const FILE_PATH_IMAGE = './test_image.png'  
const FILE_PATH_VIDEO = './test_video.mp4' 

async function convert(options){
    let bufferWebpImage = await toSticker(fs.readFileSync(FILE_PATH_IMAGE), options)
    let bufferWebpVideo = await toSticker(fs.readFileSync(FILE_PATH_VIDEO), options)
    if(!fs.pathExistsSync('result_test')) fs.mkdirSync('result_test')
    fs.writeFileSync('./result_test/test_webp_image.webp', bufferWebpImage)
    fs.writeFileSync('./result_test/test_webp_video.webp', bufferWebpVideo)
}

convert({author: 'Test', pack: 'Test_Pack', type: StickerTypes.CIRCLE})

