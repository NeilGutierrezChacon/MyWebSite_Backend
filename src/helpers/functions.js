const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

var helpers = {
  uploadFromBuffer: (file, folder) => {
    return new Promise((resolve, reject) => {
      let cld_upload_stream = cloudinary.v2.uploader.upload_stream(
        {
          folder: folder,
        },
        (error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        }
      );

      streamifier.createReadStream(file.buffer).pipe(cld_upload_stream);
    });
  },
  calcBlogPags: function (numPost, totalPost) {
    let pags = totalPost / numPost;
    if (Number.isInteger(pags)) {
      return pags;
    } else {
      return parseInt(pags) + 1;
    }
  },
  reduceTextDescription: function (text, numwords, textHidden) {
    let words = text.split(" ", numwords);
    words.push(textHidden);
    return words.join(" ");
  },
};

module.exports = helpers;
