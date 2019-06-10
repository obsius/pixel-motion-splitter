# Pixel Motion Splitter
Split pixel motion files into the image and video parts.


## Usage
```bash
index.js <src-path> <dest-path>

babel-node -- src/index.js <src-path> <dest-path>

npm start
```


## Structure
The MVIMG format is the `end of image` segment at the end of a `JPEG` image with `mp4` video data after. It's as simple as splitting these two apart.


## Contributing
Feel free to make changes and submit pull requests whenever.


## License
Pixel Motion Splitter uses the [MIT](https://opensource.org/licenses/MIT) license.