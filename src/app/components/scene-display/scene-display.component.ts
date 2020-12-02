import { Component, OnInit, Input, Output, EventEmitter, ElementRef, ViewChild} from '@angular/core';
import { Scene} from '../../types';
import { ScenesService } from '../../services/scenes.service';
import { AddSceneDialogComponent } from '../add-scene-dialog/add-scene-dialog.component';
import { AddImageDialogComponent } from '../add-image-dialog/add-image-dialog.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {ModeService} from "../../services/mode.service";
import {SceneDisplayService} from "../../services/scene-display.service";

@Component({
  selector: 'app-scene-display',
  templateUrl: './scene-display.component.html',
  styleUrls: ['./scene-display.component.css'],
  providers: [ { provide : MatDialogRef, useValue: {}}],
})
export class SceneDisplayComponent implements OnInit {

  @Input() public set imageName(imageName: string) {
      if (imageName != null && this.scenesService.SCENES[this.sceneDisplayService.selectedScene]!==null) {
        this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images[this.sceneDisplayService.selectedImage].name = imageName;
      }
    }
  @Output() imageChange = new EventEmitter<string>();
  @Input() imageSelected : boolean = true;


  addSceneDialogRef: MatDialogRef<AddSceneDialogComponent>;
  addImageDialogRef: MatDialogRef<AddImageDialogComponent>;

  addButtonPath = 'images/add.png';
  SETTINGS : Array<Boolean> = [];

  changeScene(sceneNumber: number) {
    this.sceneDisplayService.selectedScene = sceneNumber;
    this.selectNonHiddenImage();
    this.imageChange.emit(this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images[this.sceneDisplayService.selectedImage].name);
    this.scenesService.updateScenes();
    this.sceneDisplayService.UpdateDimensions();
    this.imageSelected = false;
  }

  changeImage(imageNumber: number) {
    this.sceneDisplayService.selectedImage = imageNumber;
    this.imageChange.emit(this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images[this.sceneDisplayService.selectedImage].name);
    this.scenesService.updateScenes();
    this.sceneDisplayService.UpdateDimensions();
    this.imageSelected = true;
  }



  hasAtLeastOneScene(){
    if(this.scenesService.SCENES !== null) {
      return this.scenesService.SCENES.length != 0;
    }
    return false;
  }

  selectNonHiddenScene() {
      let i: number = 0;
      while (i < this.scenesService.SCENES.length && this.scenesService.SCENES[i].hidden == true) {
        i++;
      }
      if (i != this.scenesService.SCENES.length) {
        this.sceneDisplayService.selectedScene = i;
      } else {
        this.sceneDisplayService.selectedScene = 0;
      }
      this.selectNonHiddenImage();
      this.sceneDisplayService.UpdateDimensions();
  }

  selectNonHiddenImage() {
    let i: number = 0;
    while (i < this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images.length && this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images[i].hidden == true) {
      i++;
    }
    if (i != this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images.length) {
      this.sceneDisplayService.selectedImage = i;
    } else {
      this.sceneDisplayService.selectedImage = 0;
    }
  }

  onScenesChange(functionUsed: string): void {
    this.scenesService.SCENES = this.scenesService.getScenes();
    switch(functionUsed) {
      case "hide":
        break;
      case "remove":
        if (this.imageSelected === true) {
          this.sceneDisplayService.selectedImage = 0;
        } else {
          this.sceneDisplayService.selectedScene = 0;
          this.sceneDisplayService.selectedImage = 0;
        }
        break;
      case "rename":
        this.imageChange.emit(this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images[this.sceneDisplayService.selectedImage].name);
        break;
    }

  }

  onHotspotsChange() {
    this.scenesService.SCENES = this.scenesService.getScenes();
    this.sceneDisplayService.currImage++;
  }

  constructor(public scenesService: ScenesService,
              private dialog: MatDialog,
              public modeService: ModeService,
              public sceneDisplayService: SceneDisplayService) { }

  openAddSceneDialog() {
    this.addSceneDialogRef = this.dialog.open(AddSceneDialogComponent, {
      hasBackdrop: true
    });
    this.addSceneDialogRef.afterClosed().subscribe(result => {
      this.sceneDisplayService.onCanvasChange();
      this.ngOnInit();
    });
  }

  openAddImageDialog() {
    this.addImageDialogRef = this.dialog.open(AddImageDialogComponent, {
      hasBackdrop: true
    });
    let instance = this.addImageDialogRef.componentInstance;
    instance.sceneNumber = this.sceneDisplayService.selectedScene;
    this.addImageDialogRef.afterClosed().subscribe(result => {
      this.sceneDisplayService.onCanvasChange();
    });
  }

  ngOnInit(): void {
    (async () => {
      this.sceneDisplayService.onCanvasChange();
       await this.delay(400);
       if (this.scenesService.SCENES != null && this.scenesService.SCENES.length != 0) {
         this.selectNonHiddenScene();
         this.imageChange.emit(this.scenesService.SCENES[this.sceneDisplayService.selectedScene].images[this.sceneDisplayService.selectedImage].name);
         this.sceneDisplayService.UpdateDimensions();
       }
    })();
  }

  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
