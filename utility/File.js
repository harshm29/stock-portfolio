const { base64_to_image } = require("base64-to-image");
const { base64 } = require("base64topdf");
const commonMethod = require("../utility/common");

const appRoot = require("app-root-path").path;
const fileUploadAbsolutePath = `${appRoot}/`;
//const fileType = require("file-type");
const fs = require("fs");
module.exports = new (function () {
  this.encryptedImageUpload = async (mime, fileContent, uploadPath) => {
    //#region Base 64 to retrieve Image File
    let base64Str = "data:" + mime + ";base64," + fileContent;

    let newLink = base64Str.replace(/(\r\n|\r|\n)/g, "");
    let base64Str1 = newLink.replace(/ /g, "+");

    let base64FileMimeType = base64Str1.split(";base64,");
    let type = base64FileMimeType[0].split(":image/");

    let fileName = Date.now();
    let optionalObj = { fileName: fileName, type: type[1] };

    //#region Generate Year Directory
    let currentYearMonthArray =
      await commonMethod.getYearMonthDirectoryNumber();
    let yearPath =
      fileUploadAbsolutePath + uploadPath + currentYearMonthArray[0];

    if (!fs.existsSync(yearPath)) {
      await fs.mkdirSync(yearPath);
    }
    //#endregion

    //#region Generate Year/Month Directory
    let yearMonthPath =
      fileUploadAbsolutePath +
      uploadPath +
      currentYearMonthArray[0] +
      "/" +
      currentYearMonthArray[1];
    if (!fs.existsSync(yearMonthPath)) {
      fs.mkdirSync(yearMonthPath);
    }
    //#endregion
    let uploadImage = await base64_to_image(
      base64Str1,
      yearMonthPath + "/",
      optionalObj
    );
    //#endregion
    console.log("uploadImage-->", uploadImage);
    return (
      currentYearMonthArray[0] +
      "/" +
      currentYearMonthArray[1] +
      "/" +
      uploadImage.fileName
    );
  };

  this.encryptedPdfUpload = async (mime, fileContent, uploadPath) => {
    //#region Base 64 to retrieve Pdf File
    const fileName = Date.now() + "." + mime;

    //#region Generate Year Directory
    let currentYearMonthArray = commonMethod.getYearMonthDirectoryNumber();
    let yearPath =
      fileUploadAbsolutePath + uploadPath + currentYearMonthArray[0];

    if (!fs.existsSync(yearPath)) {
      fs.mkdirSync(yearPath);
    }
    //#endregion

    //#region Generate Year/Month Directory
    let yearMonthPath =
      fileUploadAbsolutePath +
      uploadPath +
      currentYearMonthArray[0] +
      "/" +
      currentYearMonthArray[1];
    if (!fs.existsSync(yearMonthPath)) {
      fs.mkdirSync(yearMonthPath);
    }
    //#endregion

    const path = yearMonthPath + "/" + fileName;
    // to convert base64 format into random filename
    await base64.base64Decode(fileContent, path);
    //#endregion

    return (
      currentYearMonthArray[0] + "/" + currentYearMonthArray[1] + "/" + fileName
    );
  };
  this.directoryPath = async (uploadPath) => {
    let path = uploadPath;
    let currentYearMonthArray =
      await commonMethod.getYearMonthDirectoryNumber();
    let fullPath =
      path + "/" + currentYearMonthArray[0] + "/" + currentYearMonthArray[1];
    let fullPathArray = fullPath.split("/");
    let pathToGenerate = "";
    for (let i = 0; i < fullPathArray.length; i++) {
      if (i == 0) {
        pathToGenerate = fullPathArray[i];
      } else {
        pathToGenerate = pathToGenerate + "/" + fullPathArray[i];
      }
      await this.generateDirectory(pathToGenerate);
    }
    return pathToGenerate;
  };
  this.generateDirectory = async (path) => {
    let creatPathIfNotExist = fileUploadAbsolutePath + "public/upload/" + path;
    if (!fs.existsSync(creatPathIfNotExist)) {
      await fs.mkdirSync(creatPathIfNotExist);
    }
  };
  this.generateVideoDirectory = async (path) => {
    let creatPathIfNotExist =
      fileUploadAbsolutePath + "public/upload/video/" + path;
    if (!fs.existsSync(creatPathIfNotExist)) {
      await fs.mkdirSync(creatPathIfNotExist);
    }
    return creatPathIfNotExist;
  };
  this.getFileContent = async (filepath) => {
    try {
      return new Promise((resolve, reject) => {
        fs.readFile(filepath, { encoding: "utf-8" }, function (err, data) {
          if (err) reject(err);
          resolve(data);
        });
      });
    } catch (e) {
      return {
        code: 500,
        status: "error",
        message: "File can not read! Please check your connection!",
        errors: e,
        data: {},
      };
    }
  };
})();
