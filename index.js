import {createSticker} from './util/convert.js'

export const toSticker  = async (buffer, stickerOptions = {author : 'not_defined', pack : 'not_defined', fps : 10}) =>{
    try{
        let options = {
            author: stickerOptions?.author || 'not_defined',
            pack : stickerOptions?.pack || 'not_defined',
            fps: stickerOptions?.fps || 10,
        }
        let bufferWebp = await createSticker(buffer, options)
        return bufferWebp
    } catch(err){
        throw err
    }
}
