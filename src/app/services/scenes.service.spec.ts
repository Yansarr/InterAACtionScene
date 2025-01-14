import {TestBed} from '@angular/core/testing';

import {ScenesService} from './scenes.service';
import {TranslateModule} from '@ngx-translate/core';
import {RouterTestingModule} from '@angular/router/testing';
import { imgBase64Mock } from './scene-display.service.spec';
import {HttpClientModule} from "@angular/common/http";
import {Hotspot, ImageHotspot, SoundHotspot} from '../types';

describe('ScenesService', () => {
  let service: ScenesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), RouterTestingModule, HttpClientModule]
    });
    service = TestBed.inject(ScenesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // check if it returns specific value
  it('hasAtLeastOneScene:: should return false if there is no scene', () => {
    service.SCENES = null;
    expect(service.hasAtLeastOneScene()).toBeFalsy();
  });


  // check if it sets specific variable after calling the function
  it('addScene & addImag:: should add scene and images to SCENES array', () => {
    service.addScene(imgBase64Mock, 'abc', 'xyz');
    expect(service.SCENES.length).toEqual(1);
    service.addImage(imgBase64Mock, 0, 'img1');

    service.addScene(imgBase64Mock);
    expect(service.SCENES.length).toEqual(2);
    service.addImage(imgBase64Mock, 0);
  });

  // check if it returns correct boolean based on passed params
  it('checkNames:: should return false if name is exist', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'abc'}]}]}] as any;
    expect(service.checkNames(0, 0, 'abc')).toBeFalsy();
  });

  // check if it returns correct boolean based on passed params
  it('checkNames:: should return true if name does not exist', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'xyz'}]}]}] as any;
    expect(service.checkNames(0, 0, 'abc')).toBeTruthy();
  });

  // check if it returns correct boolean based on passed params
  it('checkNames:: should return true if scene and image does not exists', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'xyz'}]}]}] as any;
    expect(service.checkNames(0, undefined, 'abc')).toBeTruthy();
  });

  // check if it sets specific variable after calling the function
  it('canvasSave:: should save canvas data in given scene', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'xyz'}], canvasData: null}]}] as any;
    service.canvasSave(0, 0, 'abc');
    service.updateConfig();
    service.loadUsersList();
    expect(service.SCENES[0].images[0].canvasData).toEqual('abc');
  });

  // check if it sets specific variable after calling the function
  it('updateScenes:: should call update function', () => {
    spyOn(service, 'update');
    service.updateScenes();
    expect(service.update).toHaveBeenCalled();
  });

  // check if it sets specific variable after calling the function
  it('renameImage:: should rename image', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'xyz'}], canvasData: null, name: 'abc'}]}] as any;
    service.renameImage(0, 0, 'xyz');
    expect(service.SCENES[0].images[0].name).toEqual('xyz');
  });

  // check if it sets specific variable after calling the function
  it('renameScene:: should rename scene', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'xyz'}], canvasData: null, name: 'abc'}], name: 'abc'}] as any;
    service.renameScene(0, 'xyz');
    expect(service.SCENES[0].name).toEqual('xyz');
  });

  // check if it sets specific variable after calling the function
  it('removeImage:: should remove image and scene', () => {
    service.SCENES = [{images: [{}, {}]}] as any;
    service.removeImage(0, 0);
    expect(service.SCENES[0].images.length).toEqual(1);
    service.removeImage(0, 0);
    expect(service.SCENES.length).toEqual(0);
  });

  it('removeAllHotspots:: should remove all hotspots of an image', () => {
    service.SCENES = [{images: [{hotspots: [{name: 'a'}, {name: 'b'}]}]}] as any;
    service.removeAllHotspots(0, 0);
    expect(service.SCENES[0].images[0].hotspots.length).toEqual(0);
  });

  // check if it calls specific function after calling the function
  it('hideImage:: should hide scene and images', () => {
    spyOn(service, 'update');
    service.SCENES = [
      { hidden: true, images: [{hidden: false}, { hidden: false }, { hidden: false }] }] as any;
    service.hideImage(0, 0);
    service.SCENES = [
      { hidden: false, images: [{hidden: false}] }] as any;
    service.hideImage(0, 0);

    service.SCENES = [
      { hidden: true, images: [{hidden: false}] }] as any;
    service.hideImage(0, 0);
    expect(service.update).toHaveBeenCalled();
  });

  // check if it calls specific function after calling the function
  it('hideScene:: should hide scene', () => {
    spyOn(service, 'update');
    service.SCENES = [{hidden: true, images: [{hidden: true}]}] as any;
    service.hideScene(0);
    service.SCENES = [{hidden: true, images: [{hidden: false}]}] as any;
    service.hideScene(0);
    expect(service.update).toHaveBeenCalled();
  });

  // check if it sets specific variable after calling the function
  it('changeHotspot:: should change a sound hotspot based on provided values', () => {
    // const hotspot = {strokeColor: null, name: null, svgPointArray: [], base64sound: null} as SoundHotspot;
    const hotspot = new SoundHotspot(null, [], null, null, 0, null);
    service.changeHotspot(hotspot, 0, 0, 'abc', [1, 2, 3], '#000', 'test');
    service.changeHotspot(hotspot, 0, 0, 'abc', [1, 2, 3], '#000', null);
    expect(hotspot.strokeColor).toEqual('#000');
    expect(hotspot.name).toEqual('abc');
    expect(hotspot.svgPointArray.length).toEqual(3);
    expect(hotspot.base64sound).toEqual('test');
  });

  // check if it sets specific variable after calling the function
  it('addHotspotSound:: should add SoundHotspot to scenes', () => {
    service.SCENES = [{images: [{ hotspots: null }]}] as any;
    service.addHotspotSound(0, 0, 'abc', [], '#000', 'type1', 2, 'base64');
    expect(service.SCENES[0].images[0].hotspots.length).toEqual(1);
    service.addHotspotSound(0, 0, 'abc', [], '#000', 'type1', 2, 'base64');
    expect(service.SCENES[0].images[0].hotspots.length).toEqual(2);
    expect(service.haveAddHotspot).toBeTruthy();
  });

  it('addHotspotImage:: should add ImageHotspot to scenes', () => {
    service.SCENES = [{images: [{ hotspots: null }]}] as any;
    service.addHotspotImage(0, 0, 'abc', [], '#000', 'type1', 2, 0);
    expect(service.SCENES[0].images[0].hotspots.length).toEqual(1);
    service.addHotspotImage(0, 0, 'abc', [], '#000', 'type1', 2, 1);
    expect(service.SCENES[0].images[0].hotspots.length).toEqual(2);
    expect(service.haveAddHotspot).toBeTruthy();
  });


  // check if it sets specific variable after calling the function
  it('getImageHotspots:: should return image hotspot', () => {
    service.SCENES = [{images: [{ hotspots: true }]}] as any;
    expect(service.getImageHotspots(0, 0)).toEqual(true as any);
    expect(service.getImageHotspots(0, undefined)).toEqual([]);
  });

  // spy upon the alert
  // call onerror method of index db to check if it calls alert with passed data
  it('updateConfig:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.updateConfig();
    service.openRequest.onerror({target: {errorCode: 1}});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // call the method, and it will create the db stores in the indexDb
  // check if it is not breaking the service
  it('should create lists in index db', () => {
    const dbObj = { createObjectStore: () => {} };
    const transactionObj = { objectStore: () => {return {add: () => {}} }};
    // @ts-ignore
    service.createUsersListObject(dbObj, transactionObj);
    // @ts-ignore
    service.createSceneObject(dbObj, transactionObj);
    // @ts-ignore
    service.createConfigurationObject(dbObj, transactionObj);
    expect(service).toBeTruthy();
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('loadUserOfUsersList:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    // @ts-ignore
    spyOn(service, 'createUsersListObject');
    // @ts-ignore
    spyOn(service, 'createSceneObject');
    // @ts-ignore
    spyOn(service, 'createConfigurationObject');
    service.loadUserOfUsersList('name');
    service.openRequest.onerror({target: {errorCode: 1}});
    service.openRequest.onupgradeneeded({ target: { result: {}, transaction: {}} });
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('loadInfoFromCurrentUser:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.loadInfoFromCurrentUser();
    service.openRequest.onerror({target: {errorCode: 1}});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('init:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.init();
    service.openRequest.onerror({target: {errorCode: 1}});
    service.openRequest.onupgradeneeded(
      {oldVersion: 0,
      target: {
        result: {createObjectStore: () => {}, objectStoreNames: {contains: () => false}},
        transaction: {objectStore: () => {return {add: () => {}}}}
      }});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('init:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.init();
    service.openRequest.onerror({target: {errorCode: 1}});
    service.openRequest.onupgradeneeded(
      {oldVersion: 0,
      target: {
        result: {createObjectStore: () => {}, objectStoreNames: {contains: () => true}},
        transaction: {objectStore: () => {return {add: () => {}}}}
      }});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('init:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.init();
    service.openRequest.onerror({target: {errorCode: 1}});
    service.openRequest.onupgradeneeded(
      {oldVersion: 2,
      target: {
        result: {createObjectStore: () => {}, objectStoreNames: {contains: () => true}},
        transaction: {objectStore: () => {return {add: () => {}}}}
      }});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  it('loadHotspots:: should return hotspots', () => {
    let hotspot1 = {name: '1', svgPatg: [], strokeColor: 'white', type: 'writeAudio', strokeWidth: 2, base64sound: 'test'};
    let hotspot2 = {name: '2', svgPatg: [], strokeColor: 'black', type: 'refImage', strokeWidth: 2, numImage: 1};
    let noLoadHotspots = [hotspot1, hotspot2];
    let loadHotspots = service.loadHotspots(noLoadHotspots);
    expect(loadHotspots[0] instanceof Hotspot).toBeTruthy();
    expect(loadHotspots[1] instanceof Hotspot).toBeTruthy();
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('update:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.update();
    service.openRequest.onerror({target: {errorCode: 1}});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('updateUserList:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    service.updateUserList();
    service.openRequest.onerror({target: {errorCode: 1}});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });

  // spy upon the alert
  // call onerror method of index db to check if it is calling alert with passed data
  it('loadUsersList:: should show error if index db could not open', () => {
    spyOn(window, 'alert');
    // @ts-ignore
    spyOn(service, 'createUsersListObject');
    // @ts-ignore
    spyOn(service, 'createSceneObject');
    // @ts-ignore
    spyOn(service, 'createConfigurationObject');
    service.loadUsersList();
    service.openRequest.onerror({target: {errorCode: 1}});
    service.openRequest.onupgradeneeded(
      {oldVersion: 0,
      target: {
        result: {createObjectStore: () => {}, objectStoreNames: {contains: () => false}},
        transaction: {objectStore: () => {return {add: () => {}}}}
      }});
    expect(window.alert).toHaveBeenCalledWith('Database error: 1');
  });
});

