const router = require('express').Router();
let Image = require('../models/image.model');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })

// Get all Images
router.route('/').get((req, res) => {
    Image.find({}, (err, items) => {
        if (err) {
            console.log(err);
            res.status(500).send('An error occurred while retrieving the image: ', err);
        }
        else {
            res.render('imagesPage', { items: items });
        }
    });
});

// Post Image
router.route('/').post(upload.single('image'), (req, res) => {
    var obj = {
        name: req.body.name,
        desc: req.body.desc,
        img: {
            data: fs.readFileSync(path.join(__dirname + '/uploads/' + req.file.filename)),
            contentType: 'image/png'
        }
    }
    Image.create(obj, (err, item) => {
        if (err) {
            console.log(err);
        }
        else {
            // item.save();
            res.redirect('/');
        }
    });
});

module.exports = router;