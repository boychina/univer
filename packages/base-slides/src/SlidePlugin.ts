import { ICurrentUniverService, LocaleService, Plugin, PLUGIN_NAMES, PluginType } from '@univerjs/core';
import { Engine, IRenderingEngine } from '@univerjs/base-render';
import { Dependency, Inject, Injector } from '@wendellhu/redi';
import { zh, en } from './Locale';
import { install, SlidePluginObserve, uninstall } from './Basics/Observer';
import { CanvasView } from './View/Render';
import { ToolbarController } from './Controller';

export interface ISlidePluginConfig { }

const DEFAULT_SLIDE_PLUGIN_DATA = {};

export class SlidePlugin extends Plugin<SlidePluginObserve> {
    static override type = PluginType.Slide;

    private _config: ISlidePluginConfig;

    private _canvasEngine: Engine;

    private _canvasView: CanvasView;

    private _toolbarController: ToolbarController;

    constructor(
        config: Partial<ISlidePluginConfig> = {},
        @ICurrentUniverService private readonly _currentUniverService: ICurrentUniverService,
        @Inject(LocaleService) private readonly _localeService: LocaleService,
        @Inject(Injector) override readonly _injector: Injector
    ) {
        super(PLUGIN_NAMES.SLIDE);

        this._config = Object.assign(DEFAULT_SLIDE_PLUGIN_DATA, config);
        this._initializeDependencies(this._injector);
    }

    initialize(): void {
        this._localeService.getLocale().load({
            en,
            zh,
        });
        install(this);
        // this.initConfig();
        this.initController();
        this.initCanvasView();
        // this.registerExtension();
        // this.listenEventManager();
    }

    getConfig() {
        return this._config;
    }

    // initConfig() { }

    initController() {
        this._toolbarController = this._injector.get(ToolbarController);
    }

    initCanvasView() {
        this._canvasEngine = this._injector.get(IRenderingEngine);
    }

    override onMounted(): void {
        this.initialize();
    }

    override onDestroy(): void {
        super.onDestroy();
        uninstall(this);
    }

    // registerExtension() { }

    // listenEventManager() {
    //     this._getCoreObserver<boolean>('onUIDidMountObservable').add(({ name, value }) => {
    //         // TODO: scroll in UI or render here?
    //         // this.getCanvasView().scrollToCenter();
    //     });
    // }

    getCanvasEngine() {
        return this._canvasEngine;
    }

    getCanvasView() {
        return this._canvasView;
    }

    // protected _getCoreObserver<T>(type: string) {
    //     return this.getGlobalContext().getObserverManager().requiredObserver<UIObserver<T>>(type, 'core');
    // }

    private _initializeDependencies(slideInjector: Injector) {
        const dependencies: Dependency[] = [[CanvasView], [ToolbarController]];

        dependencies.forEach((d) => {
            slideInjector.add(d);
        });
    }
}
