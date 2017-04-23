import {MdIconRegistry, MdDialog} from '@angular/material';
import {Component, NgZone, OnInit} from '@angular/core'
import {CommonModule} from '@angular/common'
import {DomSanitizer, SafeUrl, SafeResourceUrl} from "@angular/platform-browser";
import 'rxjs/Rx';
import {Observable} from 'rxjs/Rx';
import {AnnyangService} from './shared/services/annyang.service'
import {YouTubeService} from "./shared/services/youtube.service";
import {TAWHttpRequestService} from "./shared/services/taw-http-request.service"

import {DialogComponent} from './dialog/dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: `app/templates/home.component.html`,
})
export class TellAndWatchComponent implements OnInit {
  results: Observable<any>;
  searchText: any = "Tell Something...";
  videoUrl: any;
  dangerousVideoUrl: string
  gridClass:string="s12"
  val: string

  constructor(private annyang: AnnyangService,
              private _ngZone: NgZone,
              private youtubeService: YouTubeService,
              private tAWHttpRequestService: TAWHttpRequestService,
              private domSanitizer: DomSanitizer) {

  }

  ngOnInit() {
    this.annyang.commands = {
      'search *val': (val)=> {
        console.log("command start");
        this.captureVoiceAndSearchVideos(val);
      }, 'play *val': (val)=> {
        //console.log("command start");
        this.playVideo(val);
      }
    };
    this.annyang.start();
    //this.playVideo("HajRjVMSPq8")
  }

  captureVoiceAndSearchVideos = function (val) {
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        this.searchText = val;
        this.youtubeService.getYouTubeVideos(val)
          .subscribe(data=> {
            this.results = data;
            console.log(this.results);
          })
      });
    });
  };
  playVideo = function (val) {
    let numaricArray1 = {
      "first": 0,
      "second": 1,
      "third": 2,
      "fourth": 3,
      "fifth": 4
    };
    this._ngZone.runOutsideAngular(() => {
      this._ngZone.run(() => {
        this.val = val
        //console.log(numaricArray1[this.val], this.val);
        //console.log(this.results[numaricArray1[this.val]].id.videoId);
        // https://www.youtube.com/embed/HajRjVMSPq8?rel=0
        this.dangerousVideoUrl = 'https://www.youtube.com/embed/' + this.results[numaricArray1[val]].id.videoId + '?rel=0&autoplay=1';
        console.log(this.dangerousVideoUrl)
        this.videoUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(this.dangerousVideoUrl);
        this.gridClass = "m3 list-view"
        console.log(this.videoUrl)
      })
    })

  }
}
