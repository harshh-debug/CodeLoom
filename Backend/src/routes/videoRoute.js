import express from "express"
import { adminMiddleware } from "../middleware/adminMiddleware.js";
const videoRouter= express.Router()
const {generateUploadSignature,saveVideoMetadata,deleteVideo} = require("../controllers/videoSection")


videoRouter.get("/create/:problemId",adminMiddleware,generateUploadSignature);
videoRouter.post("/save",adminMiddleware,saveVideoMetadata);
videoRouter.delete("/delete/:videoId",adminMiddleware,deleteVideo);


export default videoRouter;