# img-tools

Module for manipulating images with various functionalities, 
for example resizing images, rotate photos, convert base64 to Blob, among others.

## Installation 
```sh
npm install img-tools --save
yarn add img-tools
bower install img-tools --save
```

### TypeScript
```typescript
import { Resize, Config_Thumbs } from 'img-tools';

let thumbs_config: Array<Config_Thumbs> = {
  {
    size: 200,
    type: "image/jpeg",
    quality: 0.6 // Quality between 0 and 1, default 0.98
  },
  {
    size: 600,
    type: "image/png",
    quality: 1  // Quality between 0 and 1, default 0.98
  }
}

const img_tools = new Resize(file, thumbs_config);
img_tools.generateThumbs().then((thumbs: Array<string>) => {
  console.log(thumbs); // Array with the thumbs in base64
}).catch((error) => {
  console.error(error);
});

```
```sh
The generateThumbs () method returns a Promise that when it resolves returns an array with the base64 thumbnails.
```
