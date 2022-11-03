import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { SelfieSegmentation } from '@mediapipe/selfie_segmentation';
import { Camera } from '@mediapipe/camera_utils';

@Injectable({
  providedIn: 'root'
})
export class FaceMlServiceService {

  // use the camera util provided by mediapose
  camera: any;
  // selfie segmentation 
  selfie: any;
  
postProcessSelfie(results: any) {
    // cancel processing results if no mask is found in frame
    if (!results.segmentationMask) {
        return;
    }
    this.selfieResults$.next(results.segmentationMask);    
  }
processInput(videoElement: any) {
  // initialize the camera with the video element from UI
  this.camera = new Camera(videoElement, {
    onFrame: async () => {
      // pose estimation inference
      await this.selfie.send({ image: videoElement });
    },
    width: this.videoInputSize.width,
    height: this.videoInputSize.height
  });
  this.camera.start();
}
  // subjects enhance reactive programming due to the real-time nature of the application

  selfieResults$ = new Subject();

  // set the input video dimensions
  // we chose smaller dimensions to make inference a bit faster
  
  private videoInputSize = { width: 960, height: 540 };
  constructor() { 
    this.initialiseSelfieModel();
  }

  async initialiseSelfieModel() {
    // initialize the pose estimation model. 
    // make sure to configure your workspace correctly to avoid 404 errors
    this.selfie = new SelfieSegmentation({locateFile: (file) => {
        return `http://localhost:4200/assets/selfie_segmentation/${file}`;
    }});

    // check out configurations in official docs
    // https://google.github.io/mediapipe/solutions/selfie_segmentation.html
    this.selfie.setOptions({
      modelSelection: 1, // 0 is general model, 1 is landscape model
    });

    this.selfie.onResults(this.postProcessSelfie.bind(this));
  }
}
