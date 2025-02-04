import { Scene } from '@univerjs/base-render';
import { Registry, Worksheet } from '@univerjs/core';
import { Injector } from '@wendellhu/redi';

export class BaseView {
    viewKey = '';

    protected _injector: Injector;

    private _scene: Scene;

    getScene() {
        return this._scene;
    }

    updateToSheet(worksheet: Worksheet) {}

    initialize(scene: Scene) {
        this._scene = scene;
        this._initialize();
        return this;
    }

    protected _initialize() {
        // TODO
    }
}

export enum CANVAS_VIEW_KEY {
    MAIN_SCENE = 'mainScene',
    VIEW_MAIN = 'viewMain',
    VIEW_TOP = 'viewTop',
    VIEW_LEFT = 'viewLeft',
    VIEW_LEFT_TOP = 'viewLeftTop',
    SHEET_VIEW = 'sheetView',
    DRAG_LINE_VIEW = 'dragLineView',
}

export const CanvasViewRegistry = Registry.create();
