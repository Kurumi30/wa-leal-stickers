<div align=center>

<img src="https://cdn.icon-icons.com/icons2/1645/PNG/512/whatsapp_109861.png"  alt="wsf" width="150" height="150"/>

# WA-Leal-Stickers

Wa-Leal-Stickers is a simple tool which allows you to create WhatsApp Stickers.

</div>

# Installation

```cmd
> npm i wa-leal-stickers
```

## Import

Before using the library, you need to import it.

```js
import { toSticker, StickerTypes } from 'wa-leal-stickers' // ES6
```

## Usage

```js
const stickerBuffer = await toSticker(buffer, {
    pack: 'Pack_name', // The pack name
    author: 'Your_name', // The author name
    type: StickerTypes.DEFAULT, // The sticker type (only work for images)
    fps: 10 // The fps of the output file
})

// Example sending sticker on Baileys
conn.sendMessage(jid, {sticker : stickerBuffer})

```


# Sticker Types (Only for images)

```js
const StickerTypes = {
    DEFAULT = 'default',
    CIRCLE = 'circle',
}

```

