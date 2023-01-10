const multer = require('multer')

let uploadImage = (req, res, fileName) => {
    let storage = multer.diskStorage({
        destination: "public/upload/image",
        filename: (req, file, cd) => {
            cd(null, file.fieldname + Date.now() + file.originalname)
        }
    })
    let upload = multer({
        storage: storage,
        fileFilter: (req, file, cd) => {
            if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
                cd(null, true);
            } else {
                cd("Wrong file");
            }
        }
    }).single(fileName)
    return new Promise((resolve, reject) => {
        upload(req, res, (err) => {
            if (err) {
                reject(err)
            }
            //  Req.File if file in array or in object if the file is single then use req.file Ok 
            resolve(req.file)
        })
    })
}

module.exports = uploadImage