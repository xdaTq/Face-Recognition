import React, { useRef, useEffect } from "react";
import "./App.css";
import * as tf from "@tensorflow/tfjs";
import * as faceRec from "@tensorflow-models/face-landmarks-detection";
import Webcam from "react-webcam";
import { dataDraw } from "./data";

function App() {

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  async function execFaceRec () {
    const neuralNet = await faceRec.load(faceRec.SupportedPackages.mediapipeFacemesh);
    setInterval(() => {
      detect(neuralNet);
    }, 100);
  };

  async function detect (neuralNet) {
    if ( typeof webcamRef.current !== "undefined" && webcamRef.current !== null && webcamRef.current.video.readyState === 4 ) {

      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      const face = await neuralNet.estimateFaces({input:video});
      console.log(face);

      const ctx = canvasRef.current.getContext("2d");
      requestAnimationFrame(()=>{dataDraw(face, ctx)});
    }
  };

  return (
    <div className="App">
      <header className="App-Header">
        <Webcam ref={webcamRef} className="webcam"/>
        <canvas ref={canvasRef} className="webcam"/>
        <button onClick={execFaceRec} className="button">Start</button>
      </header>
    </div>
  );
}

export default App;
