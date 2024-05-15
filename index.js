import {createSticker, addExif} from './util/convert.js'

export const toSticker  = async (buffer, stickerOptions = {author : 'not_defined', pack : 'not_defined', fps : 10, type: 'default'}) =>{
    try{
        let options = {
            author: stickerOptions?.author || 'not_defined',
            pack : stickerOptions?.pack || 'not_defined',
            fps: stickerOptions?.fps || 10,
            type: stickerOptions.type || 'default'
        }
        let bufferWebp = await createSticker(buffer, options)
        return bufferWebp
    } catch(err){
        throw err
    }
}

export const updateExif = async(buffer, pack, author) =>{
    try{
        let bufferWebp = await addExif(buffer, pack, author)
        return bufferWebp
    } catch(err){
        throw err
    }
}

export const StickerTypes = {
    CIRCLE: 'circle',
    DEFAULT: 'default'
}