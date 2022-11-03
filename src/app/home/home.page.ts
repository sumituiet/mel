import { Component, ElementRef, ViewChild } from '@angular/core';
import { FaceMlServiceService } from '../face-ml-service.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

@ViewChild('videoPlayer') videoplayer: ElementRef | any;
@ViewChild('outputCanvas') canvas: ElementRef | any;

  canvasCtx;
  canvasElement;
  constructor(private mlService: FaceMlServiceService) { }

  ngOnInit(): void {
  }

  ngAfterViewInit(): void {
    // initialize  camera
    this.initCamera();

    // subscribe to selfie results
    this.mlService.selfieResults$.subscribe((result) => {
      this.drawSelfieSegmentaion(result);
    }, (error) => {
      console.log("selfie results error:")
      console.log(error)
    })
  }
  initCamera(){
    this.mlService.processInput(this.videoplayer.nativeElement);
  }
  drawSelfieSegmentaion(results) {
    this.canvasCtx.save();
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    // draw the original image
    this.canvasCtx.drawImage(results.image, 0, 0, this.canvasElement.width, this.canvasElement.height);

    // mask the original image and remove unwanted pixels
    this.canvasCtx.globalCompositeOperation = 'destination-in';
    this.canvasCtx.drawImage(results.segmentationMask, 0, 0, this.canvasElement.width, this.canvasElement.height);
    
    // Only overwrite missing pixels.
    this.canvasCtx.globalCompositeOperation = 'destination-atop';
    this.canvasCtx.fillStyle = '#00FF00';
    this.canvasCtx.fillRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.canvasCtx.restore();
  }
}
