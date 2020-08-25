
/**
 * @File Helpers
 * @description General purpose functions
 */

const cloudinary = require("cloudinary");
const streamifier = require("streamifier");

var helpers = {

  /**
   * @function uploadFromBuffer 
   * @param {file} file File in format Buffer.
   * @param {String} folder Path where it will be stored in Cloudinary.
   * @description Upload image to cloudinary in streaming (without saving locally).
   * */

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


  /**
   * @function calcBlogPag
   * @param {Int} numPost Number of posts per page.
   * @param {Int} totalPost Total number of the posts.
   * @description Calculate the number of pages of the posts.
   */
  calcBlogPags: function (numPost, totalPost) {
    let pags = totalPost / numPost;
    if (Number.isInteger(pags)) {
      return pags;
    } else {
      return parseInt(pags) + 1;
    }
  },

  /**
   * @function reduceTextDescription 
   * @param {String} text Text to reduce.
   * @param {Int} numwords Final total number of words.
   * @param {String} textHidden Hidden of the text.
   * 
   * @description Reduce the text by a specified number of words.
   */
  reduceTextDescription: function (text, numwords, textHidden) {
    let words = text.split(" ", numwords);
    words.push(textHidden);
    return words.join(" ");
  },
};

module.exports = helpers;
