const express = require("express");
const router = express.Router();

const userController = require("../controller/userController");
const sightController = require("../controller/sightController");
const chatController = require("../controller/chatController");
/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - user_name
 *       properties:
 *         user_name:
 *           type: string
 *           description: The username of the user
 *       example:
 *     Sighting:
 *       type: object
 *       required:
 *         - device_id
 *         - identification
 *         - description
 *         - date
 *         - user_name
 *         - location
 *         - loc
 *         - image
 *       properties:
 *         device_id:
 *           type: string
 *           description: The device ID of the sighting
 *         identification:
 *           type: string
 *           description: The identification of the bird in the sighting
 *         description:
 *           type: string
 *           description: The description of the sighting
 *         date:
 *           type: string
 *           description: The date of the sighting
 *         user_name:
 *           type: string
 *           description: The name of the user who made the sighting
 *         location:
 *           type: object
 *           description: The location of the sighting
 *           properties:
 *             lat:
 *               type: number
 *               description: The latitude of the location
 *             lng:
 *               type: number
 *               description: The longitude of the location
 *         loc:
 *           type: string
 *           description: The JSON representation of the location
 *         image:
 *           type: string
 *           description: The image of the sighting
 *       example:
 *         device_id: "1234567890"
 *         identification: "Eurasian Sparrowhawk"
 *         description: "A beautiful bird in flight"
 *         date: "2023-05-15"
 *         user_name: "John Doe"
 *         location:
 *           lat: 37.7749
 *           lng: -122.4194
 *         loc: '{"type":"Point","coordinates":[-122.4194,37.7749]}'
 *         image: "sparrowhawk.jpg"
 *     Chat:
 *       type: object
 *       required:
 *         - sight_id
 *         - sender_id
 *         - content
 *       properties:
 *         sight_id:
 *           type: string
 *           description: The ID of the sighting associated with the chat
 *         sender_id:
 *           type: string
 *           description: The ID of the user who sent the chat message
 *         content:
 *           type: string
 *           description: The content of the chat message
 *       example:
 *         sight_id: "5f68b82397bc6b00089a12f5"
 *         sender_id: "johndoe123"
 *         content: "Hey, have you seen any other birds around here?"
 */
const { response } = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const SightModel = require("../model/sightModel");
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
    cb(null, "public/uploads/");
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
    const file_extension = original.split(".");
    // Set the file name to the current date + file extension
    const filename = `${Date.now()}.${
      file_extension[file_extension.length - 1]
    }`;
    cb(null, filename);
  },
});
// Create a multer object that specifies how files are saved
const upload = multer({ storage: storage });
/**
 * @swagger
 * /:
 *   get:
 *     summary: Display the loading page
 *     responses:
 *       200:
 *         description: Returns the loading page
 *         content:
            text/html:
              schema:
                type: string
 */
/**
 * Display the loading page
 */
router.get("/", async function (req, res, next) {
  res.render("loading");
});

/**
 * @swagger
 * /index:
 *   get:
 *     summary: Get sight data by date and location
 *     tags: 
 *       - Sight
 *     parameters:
 *       - name: lat
 *         in: query
 *         required: true
 *         description: Latitude of the location to search for nearby sights
 *         schema:
 *           type: number
 *       - name: lng
 *         in: query
 *         required: true
 *         description: Longitude of the location to search for nearby sights
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: OK
 *         content:
            text/html:
              schema:
                type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * Display the index page
 */
router.get("/index", async function (req, res, next) {
  let location = {
    lat: req.query.lat,
    lng: req.query.lng,
  };
  let byDateData = await sightController.getSightListByDateDesc();
  let byLocationData = await sightController.getSightsByLocation(location);
  res.render("index", {
    byDate: byDateData,
    byLocation: byLocationData,
    title: "sight",
  });
});

/**
 * @swagger
 * /records:
 *   get:
 *     summary: Get sight data by  location
 *     tags: 
 *       - Sight
 *     parameters:
 *     responses:
 *       200:
 *         description: OK
 *         content:
            text/html:
              schema:
                type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */
/**
 * Display the records page
 */
router.get("/records", async function (req, res, next) {
  // TODO Get a location from user

  res.render("index", { records: data, title: "sight" });
});

/**
 * @swagger
 * /maps:
 *   get:
 *     summary: Display the maps page
 *     tags: 
 *       - Sight
 *     parameters:
 *     responses:
 *       200:
 *         description: OK
 *         content:
            text/html:
              schema:
                type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

/**
 * Display the maps page
 */
router.get("/maps", function (req, res, next) {
  let result = sightController.testDBPedia();
  // getBirdInfoFromGraph("chicken").then(result =>{
  //     console.log(("BirdInfo"))
  //     console.log(result)
  //
  // })
  res.render("maps");
});

/**
 * @swagger
 * /sortByDate:
 *   get:
 *     summary: Get sight data by  sort by date
 *     tags: 
 *       - Sight
 *     parameters:
 *     responses:
 *       200:
 *         description: OK
 *         content:
            text/html:
              schema:
                type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get("/sortByDate", async function (req, res, next) {
  let data = await sightController.getSightListByDateDesc();
  console.log(data);
  res.render("index", { records: data });
});

/**
 * @swagger
 * /sortByDistance:
 *   get:
 *     summary: Get sight data by  sort by distance
 *     tags: 
 *       - Sight
 *     parameters:
*       - name: lat
 *         in: query
 *         required: true
 *         description: Latitude of the location to search for nearby sights
 *         schema:
 *           type: number
 *       - name: lng
 *         in: query
 *         required: true
 *         description: Longitude of the location to search for nearby sights
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: OK
 *         content:
            text/html:
              schema:
                type: string
 *       400:
 *         description: Bad Request
 *       500:
 *         description: Internal Server Error
 */

router.get("/sortByDistance", async function (req, res, next) {
  const location = {
    lat: parseFloat(req.query.lat),
    lng: parseFloat(req.query.lng),
  };
  let data = await sightController.getSightsByLocation(location);
  res.render("index", { records: data });
});
/**
 * @swagger
 * /sightDetails/{id}:
 *   get:
 *     summary: Get sight details by ID
 *     tags: [Sights]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the sight to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           text/html:
 *             schema:
 *              type: string
 *       404:
 *         description: Sight not found
 *       500:
 *         description: Server error
 */

router.get("/sightDetails/:id", async function (req, res, next) {
  let sight_id = req.params.id;
  console.log("/sightDetails/" + sight_id);
  let recordData = await sightController.getSightById(sight_id);
  let birdInfo = await sightController.getBirdInfoFromGraph(
    recordData.identification
  );
  let messages = await chatController.getChatList(sight_id);
  res.render("sightDetails", {
    record: recordData,
    birdInfo: birdInfo,
    messages: messages,
    id: sight_id,
  });
});
/**
 * @swagger
 * /setUser:
 *   post:
 *     summary: Creates a new user in MongoDB.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Successfully created a new user in MongoDB.
 *       400:
 *         description: Bad request. The request body must include a valid user object.
 *       500:
 *         description: Internal server error. Failed to create the user in MongoDB.
 *
 */

router.post("/setUser", function (req, res) {
  userController.createUserInMongo(req, res).then((r) => {});
});
/**
 * @swagger
 * /saveSighting:
 *   post:
 *     summary: Save a new sighting
 *     tags: [Sightings]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               identification:
 *                 type: string
 *                 description: Identification of the sighting.
 *                 required: true
 *               description:
 *                 type: string
 *                 description: Description of the sighting.
 *                 required: true
 *               date:
 *                 type: string
 *                 format: date
 *                 description: Date of the sighting.
 *                 required: true
 *               user_name:
 *                 type: string
 *                 description: Name of the user who posted the sighting.
 *                 required: true
 *               location:
 *                 type: string
 *                 description: Location of the sighting.
 *                 required: true
 *               loc:
 *                 type: object
 *                 properties:
 *                   type:
 *                     type: string
 *                     description: Type of the location.
 *                     required: true
 *                   coordinates:
 *                     type: array
 *                     items:
 *                       type: number
 *                     description: Longitude and latitude of the location.
 *                     required: true
 *               image:
 *                 type: file
 *                 description: Image file of the sighting.
 *                 required: true
 *     responses:
 *       200:
 *         description: The created sighting.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Success
 *       500:
 *         description: Some server error
 *
 */

router.post("/saveSighting", upload.single("image"), async function (req, res) {
  await sightController.insertSight(req);
  return res.status(200).json({ message: "Success" });
});
/**
 * @swagger
 * /saveChatContent:
 *   post:
 *     summary: Save a new chat content
 *     tags: [Chat]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date-time
 *               content:
 *                 type: string
 *             required:
 *               - username
 *               - date
 *               - content
 *     responses:
 *       200:
 *         description: The created chat content.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Success
 *       500:
 *         description: Some server error
 */

router.post("/saveChatContent", function (req, res, next) {
  let data = req.body;
  chatController
    .insertChat(data)
    .then((r) => console.log("InsertChatSuccessfully"));
});
//Mock

router.get("/sightDetails", function (req, res, next) {
  let data = {
    identification: "unknown",
    description: "This is a description",
    date: "2023-02-03 ",
    user_name: "crowds",
    location: "Sheffield",
    image: "https://picsum.photos/100",
    wiki: "www.baidu.com",
  };

  let messages = [
    {
      username: "Crowds",
      date: "2023/04/10",
      content: "This is a chat msg",
    },
    {
      username: "Crowds",
      date: "2023/04/09",
      content: "This is a chat msg",
    },
  ];
  res.render("sightDetails", { record: data, messages: messages });
});

/**
 * @swagger
 * /saveChatList:
 *   post:
 *     summary: Save a list of chat messages
 *     tags: [Chats]
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               chatMessages:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     username:
 *                       type: string
 *                     date:
 *                       type: string
 *                     content:
 *                       type: string
 *     responses:
 *       200:
 *         description: The list of chat messages has been saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Success
 *       500:
 *         description: Some server error
*/
router.post("/saveChatList", function (req, res, next) {
  let data = req.body;
  chatController.insertChatList(data).then((r) => {
    console.log("InsertChatListSuccessfully");
  });
});

/**
 * @swagger
 * /insertToMongo:
 *   post:
 *     summary: Insert a new sight to MongoDB
 *     tags: [Sights]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: image
 *         type: file
 *         required: true
 *         description: Base64-encoded image data
 *       - in: formData
 *         name: identification
 *         type: string
 *         required: true
 *         description: Identification of the sight
 *       - in: formData
 *         name: description
 *         type: string
 *         required: false
 *         description: Description of the sight
 *       - in: formData
 *         name: date
 *         type: string
 *         format: date-time
 *         required: false
 *         description: Date of the sighting in ISO format (e.g., 2023-05-15T10:30:00Z)
 *       - in: formData
 *         name: user_name
 *         type: string
 *         required: false
 *         description: Name of the user who made the sighting
 *       - in: formData
 *         name: location
 *         type: string
 *         required: false
 *         description: Location of the sight
 *       - in: formData
 *         name: loc
 *         type: string
 *         required: false
 *         description: Geographic coordinates of the sight (e.g., "39.938546, 116.117281")
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Success
 *       500:
 *         description: Some server error
 */
 
router.post("/insertToMongo", async function (req, res, next) {
  // 获取base64字符串
  const base64String = req.body[0].image;

  // 转换为Buffer对象
  const buffer = base64ToBuffer(base64String);

  // 获取文件名和扩展名
  const fileName = Date.now() + ".jpg";
  // 将Buffer对象保存为文件
  console.log("start to generated th filename");
  const filepath = path.join("public", "uploads", fileName);
  await fs.writeFile(filepath, buffer, (err) => {
    if (err) {
      // 处理错误
      return next(err);
    }
    // Save to MongoDB
    console.log("fileName=" + fileName);

    let sight = new SightModel({
      identification: req.body[0].identification,
      description: req.body[0].description,
      date: req.body[0].date,
      user_name: req.body[0].user_name,
      location: req.body[0].location,
      loc: req.body[0].loc,
      image: fileName,
    });
    sightController.insertSightFromIndexDB(sight);
    return res.status(200).json({ message: "Success" });
  });
});

/**
 * @swagger
 * /updateSightIdentification:
 *   post:
 *     summary: Update a sighting's identification
 *     tags: [Sightings]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: sight_id
 *         description: ID of the sighting to update
 *         type: string
 *         required: true
 *       - in: formData
 *         name: identification
 *         description: New identification for the sighting
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: The identification was updated successfully.
 *       500:
 *         description: Some server error
 */

router.post("/updateSightIdentification", function (req, res, next) {
  let data = req.body;
  sightController.updateSightIdentification(data.sight_id, data.identification);
  return res.status(200);
});
/**
 * @swagger
 * /updateSightIdentList:
 *   post:
 *     summary: Update identification of multiple sightings
 *     tags: [Sightings]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: formData
 *         name: data
 *         type: string
 *         description: JSON-encoded array of objects containing the sight_id and identification to update
 *         example: '[{"sight_id":"sight1","identification":"bird"}, {"sight_id":"sight2","identification":"tree"}]'
 *     responses:
 *       200:
 *         description: The sightings were updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message
 *                   example: Sightings updated successfully
 *       500:
 *         description: Some server error
 *
 */

router.post("/updateSightIdentList", function (req, res, next) {
  let data = req.body;
  for (let index in data) {
    sightController.updateSightIdentification(
      data[index].sight_id,
      data[index].identification
    );
  }
});

function base64ToBuffer(base64) {
  const base64Data = base64.replace(/^data:.+?;base64,/, "");
  return Buffer.from(base64Data, "base64");
}

module.exports = router;
