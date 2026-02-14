import { HandLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

let handLandmarker = null;

export async function initHandDetection() {
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm",
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision,{
    baseOptions:{
        modelAssetPath :
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task",
        delegate:"GPU"
    },
    runningMode:"VIDEO",
    numHands:1
  })

  return handLandmarker
}


export function detectHand(videoElement) {
    if (!videoElement) return null

    const result = handLandmarker.detectForVideo(videoElement,performance.now())

    if(result.landmarks && result.landmarks.length > 0) {
        return result.landmarks[0]
    }
    return null
}


export function destroyHandDetection() {
  if (handLandmarker) {
    handLandmarker.close();
    handLandmarker = null;
  }
}
