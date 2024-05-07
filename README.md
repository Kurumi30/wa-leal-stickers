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
    pack: 'Leal Pack', // The pack name
    author: 'Leal', // The author name
    type: StickerTypes.DEFAULT, // The sticker type
    quality: 60, // The quality of the output file
    fps: 10 // The fps of the output file
})

// Example sending sticker on Baileys
conn.sendMessage(jid, {sticker : stickerBuffer})

```

## Sticker Types

```js
const StickerTypes = {
    DEFAULT = 'default',
    CIRCLE = 'circle',
    ROUNDED = 'rounded'
}

```

