const express = require('express');
const router = express.Router();

const userController = require('../controller/userController');
const sightController = require('../controller/sightController');
const chatController = require('../controller/chatController');

const {response} = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const SightModel = require('../model/sightModel');

/**
 * Multer configuration to store uploaded files
 */
const storage = multer.diskStorage({
    /**
     * Specifies the directory where uploaded files will be saved
     * @param {object} req - Express request object
     * @param {object} file - File object from request
     * @param {function} cb - Callback function
     */
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/');
    },
    /**
     * Specifies the name of the uploaded file
     * @param {object} req - Express request object
     * @param {object} file - File object from request
     * @param {function} cb - Callback function
     */
    filename: function (req, file, cb) {
        // Get the original file name
        const original = file.originalname;
        // Get the file extension
        const file_extension = original.split('.');
        // Set the file name to the current date + file extension
        const filename = `${Date.now()}.${file_extension[file_extension.length - 1]}`;
        cb(null, filename);
    },
});
// Create a multer object that specifies how files are saved
const upload = multer({storage: storage});


/**
 * Display the loading page
 */
router.get('/', async function (req, res, next) {
    res.render('loading')
});

/**
 * Display the index page
 */
router.get('/index', async function (req, res, next) {
    let location = {
        lat: req.query.lat,
        lng: req.query.lng,
    }
    let byDateData = await sightController.getSightListByDateDesc()
    let byLocationData = await sightController.getSightsByLocation(location)
    res.render('index', {
        byDate: byDateData,
        byLocation: byLocationData,
        title: "sight"
    })
})

/**
 * Display the records page
 */
router.get('/records', async function (req, res, next) {
    // TODO Get a location from user

    res.render('index', {records: data, title: "sight"});
});

/**
 * Display the maps page
 */
router.get('/maps', function (req, res, next) {
    let result = sightController.testDBPedia()
    // getBirdInfoFromGraph("chicken").then(result =>{
    //     console.log(("BirdInfo"))
    //     console.log(result)
    //
    // })
    res.render('maps')
})

router.get('/sortByDate', async function (req, res, next) {
    let data = await sightController.getSightListByDateDesc()
    console.log(data)
    res.render('index', {records: data});
});

router.get('/sortByDistance', async function (req, res, next) {
    const location = {
        lat: parseFloat(req.query.lat),
        lng: parseFloat(req.query.lng),
    }
    let data = await sightController.getSightsByLocation(location)
    res.render('index', {records: data})
})
router.get('/sightDetails/:id', async function (req, res, next) {
    let sight_id = req.params.id;
    console.log("/sightDetails/" + sight_id)
    let recordData = await sightController.getSightById(sight_id);
    let birdInfo = await sightController.getBirdInfoFromGraph(recordData.identification)
    let messages = await chatController.getChatList(sight_id)
    res.render('sightDetails', {
            record: recordData,
            birdInfo: birdInfo,
            messages: messages,
            id: sight_id,
        }
    );
});
router.post('/setUser', function (req, res) {
    userController.createUserInMongo(req, res).then(r => {

    })
});

router.post('/saveSighting', upload.single('image'), async function (req, res) {
    await sightController.insertSight(req)
    return res.status(200).json({message: 'Success'});
});

router.post('/saveChatContent', function (req, res, next) {
    let data = req.body
    chatController.insertChat(data).then(r => console.log("InsertChatSuccessfully"))
})
//Mock
router.get('/sightDetails', function (req, res, next) {
    let data = {
        identification: "unknown",
        description: "This is a description",
        date: "2023-02-03 ",
        user_name: "crowds",
        location: "Sheffield",
        image: "https://picsum.photos/100",
        wiki: "www.baidu.com"
    }

    let messages = [
        {
            username: "Crowds",
            date: "2023/04/10",
            content: "This is a chat msg"
        },
        {
            username: "Crowds",
            date: "2023/04/09",
            content: "This is a chat msg"
        }]
    res.render('sightDetails', {record: data, messages: messages})
})

router.post('/saveChatList', function (req, res, next) {
    let data = req.body
    chatController.insertChatList(data).then(r => {
        console.log("InsertChatListSuccessfully")
    })
})


router.post('/insertToMongo', async function (req, res, next) {
    // get Base64 String
    const base64String = req.body[0].image;
    // Convert to buffer objcet
    const buffer = base64ToBuffer(base64String);
    // Get the fileName
    const fileName = Date.now() + '.jpg';
    // Convert Buffer to file
    console.log("start to generated th filename")
    const filepath = path.join('public', 'uploads', fileName);
    await fs.writeFile(filepath, buffer, (err) => {
        if (err) {
            return next(err);
        };
        // Save to MongoDB
        console.log("fileName=" + fileName)

        let sight = new SightModel({
            identification: req.body[0].identification,
            description: req.body[0].description,
            date: req.body[0].date,
            user_name: req.body[0].user_name,
            location: req.body[0].location,
            loc: req.body[0].loc,
            image: fileName
        })
        sightController.insertSightFromIndexDB(sight)
        return res.status(200).json({message: 'Success'});
    });
})

router.post('/updateSightIdentification',function (req, res, next) {
    let data = req.body
    sightController.updateSightIdentification(data.sight_id,data.identification)
    return res.status(200);
})

router.post('/updateSightIdentList',function (req, res, next){
    let data = req.body
    for(let index in data){
        sightController.updateSightIdentification(data[index].sight_id,data[index].identification)
    }
})

function base64ToBuffer(base64) {
    const base64Data = base64.replace(/^data:.+?;base64,/, '');
    return Buffer.from(base64Data, 'base64');
}

module.exports = router;
