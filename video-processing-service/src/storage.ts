// 1. GCS interaction
// 2. Local filesystem interaction
import {Storage} from "@google-cloud/storage";
import fs from "fs";
import path from "path";
import ffmpeg from "fluent-ffmpeg";


const storage = new Storage();

const rawVideoBucketName = "kg-yt-raw-videos";
const processedVideoBucketName = "kg-yt-processed-videos";

const localRawVideoPath = "./raw-videos";
const localProcessedVideoPath = "./processed-videos";

export function setUpDirectories(){
    ensureDirectoryExistence(localRawVideoPath);
    ensureDirectoryExistence(localProcessedVideoPath);
}

export function convertVideo(rawVideoName: string, processedVideoName: string){
    return new Promise<void>((resolve,reject)=>{
         ffmpeg(`${localRawVideoPath}/${rawVideoName}`)
            .outputOptions("-vf","scale=-1:360") //converting video to 360p
            .on("end",()=>{
                console.log("Video processing finished successfully");
                resolve();
            })
            .on("error", (err)=>{
                console.error("Error processing video : ",err);
                reject(err);
            })
            .save(`${localProcessedVideoPath}/${processedVideoName}`);
    });
}

export async function downloadRawVideo(fileName: string){
    await storage.bucket(rawVideoBucketName)
    .file(fileName)
    .download({destination: `${localRawVideoPath}/${fileName}`});

    console.log(
        `gs://${rawVideoBucketName}/${fileName} downloaded to ${localRawVideoPath}/${fileName}`
    );
}

export async function uploadProcessedVideo(fileName: string){
   const bucket = storage.bucket(processedVideoBucketName);

   await bucket.upload(`${localProcessedVideoPath}/${fileName}`, {
       destination: fileName
   });
   console.log(
        `gs://${processedVideoBucketName}/${fileName} uploaded from ${localProcessedVideoPath}/${fileName}`
    );

   await bucket.file(fileName).makePublic();
}

export function deleteRawVideo(fileName:string){
    return deleteFile(`${localRawVideoPath}/${fileName}`);
} 

export function deleteProcessedVideo(fileName:string){
    return deleteFile(`${localProcessedVideoPath}/${fileName}`);
}

function deleteFile(filePath:string){
    return new Promise<void>((resolve,reject)=>{
        if(fs.existsSync(filePath)){
            fs.unlink(filePath,(err) =>{
                if(err){
                    console.error(`Error deleting file at path ${filePath}: `,err);
                    console.log(JSON.stringify(err));
                }else{
                    console.log(`File at path ${filePath} deleted successfully.`);
                    resolve();
                }
                
            });
        }else{
            console.log(`File at path ${filePath} does not exist, skipping deletion.`);
            resolve();
        }
    });
}

function ensureDirectoryExistence(dirPath:string){
    if(!fs.existsSync(dirPath)){
        fs.mkdirSync(dirPath, {recursive:true});
        console.log(`Directory created at path ${dirPath} and it is ready.`);
    }
   
}


