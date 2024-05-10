import {createSticker} from './util/convert.js'
import fs from 'fs-extra'

export const toSticker  = async (buffer, stickerOptions = {author : 'not_defined', pack : 'not_defined', fps : 10, quality : 60, type : 'default'}) =>{
    try{
        let options = {
            author: stickerOptions?.author || 'not_defined',
            pack : stickerOptions?.pack || 'not_defined',
            fps: stickerOptions?.fps || 10,
            quality: stickerOptions?.quality || 60,
            type: stickerOptions?.type || 'default'
        }
        let bufferWebp = await createSticker(buffer, options)
        return bufferWebp
    } catch(err){
        throw err
    }
}

export const StickerTypes = {
    CIRCLE: 'circle',
    ROUNDED: 'rounded',
    DEFAULT: 'default'
}

