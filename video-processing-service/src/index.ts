import express from "express";
import ffmpeg from "fluent-ffmpeg";


const app = express();
app.use(express.json());

app.get("/health", (req, res)=>{
    res.send("Video Processing Service is running");
});

app.post("/process-video", (req, res)=>{
    const inputFilePath = req.body.inputFilePath;
    const outputFilePath = req.body.outputFilePath;

    if(!inputFilePath || !outputFilePath){
        return res.status(400).send("Input and output file paths are required");
    }

    ffmpeg(inputFilePath)
        .outputOptions("-vf","scale=-1:360") //converting video to 360p
        .on("end",()=>{
            return res.status(200).send("Video processing finished successfully");
        })
        .on("error", (err)=>{
            console.error("Error processing video : ",err);
            res.status(500).send("Video processing failed");
        })
        .save(outputFilePath); 
})

const port = process.env.PORT || 3000;
app.listen(port,()=>{
    console.log(`Video Processing Service is listening at http://localhost:${port}`);
});