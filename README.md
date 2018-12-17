# img-tools

Module for manipulating images with various functionalities, 
for example resizing images, rotate photos, convert base64 to Blob, among others.

## Installation 
```sh
npm install img-tools --save
yarn add img-tools
bower install img-tools --save
```

## Usage
### Javascript
```javascript
const img_tools = require('img-tools');
let thumbs = img_tools.resize(file, [600, 700], "jpg");
```
```sh
The var thumbs should be an array of the thumbnails in base64
```

### TypeScript
```typescript
import { resize } from 'img-tools';
let thumbs = resize(file, [600, 700], "jpg");
```
```sh
The var thumbs should be an array of the thumbnails in base64
```
