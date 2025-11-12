import express from "express";
import ffmpeg from "fluent-ffmpeg";
import { setUpDirectories, downloadRawVideo, convertVideo, uploadProcessedVideo, deleteRawVideo, deleteProcessedVideo } from "./storage.js";

setUpDirectories();
const app = express();
app.use(express.json());

app.get("/health", (req, res)=>{
    res.send("Video Processing Service is running");
});

app.post("/process-video", async (req, res)=>{
    let data;

    try{
        const message = Buffer.from(req.body.message.data, "base64").toString("utf-8");
        data = JSON.parse(message);
        if(!data.name){
            throw new Error("Invalid message payload received");
        }

    }catch(err){
        console.error(err);
        return res.status(400).send("Bad Request: Invalid message payload,missing fileName");
    }

    const inputFileName = data.name;
    const outputFileName = `processed-${inputFileName}`;

    await downloadRawVideo(inputFileName);

    try{
        await convertVideo(inputFileName, outputFileName);
    }catch (err){
        Promise.all([
         deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
       ]);
        console.error(err);
        return res.status(500).send("Internal Server Error: video processing failed");
    }

    await uploadProcessedVideo(outputFileName);
    Promise.all([
        deleteRawVideo(inputFileName),
        deleteProcessedVideo(outputFileName)
       ]);
    return res.status(200).send("Video processed successfully");
});

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Video Processing Service is listening at http://localhost:${port}`);
});