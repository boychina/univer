import { CommandManager, ICurrentUniverService, ISheetActionData, SheetActionBase } from '@univerjs/core';
import { Inject } from '@wendellhu/redi';

import { ISelectionManager } from '../Services/tokens';
import { SelectionManager } from './Selection';
import { CanvasView } from '../View';
// All skins' less file

export class SheetContainerController {
    constructor(
        @ISelectionManager private readonly _selectionManager: SelectionManager,
        @Inject(CanvasView) private readonly canvasView: CanvasView,
        @ICurrentUniverService private readonly _currentUniverService: ICurrentUniverService
    ) {
        this._initialize();
    }

    private _initialize() {
        // Monitor all command changes and automatically trigger the refresh of the canvas
        CommandManager.getCommandObservers().add(({ actions }) => {
            if (!actions || actions.length === 0) return;

            const action = actions[0] as SheetActionBase<ISheetActionData, ISheetActionData, void>;

            const currentUnitId = this._currentUniverService.getCurrentUniverSheetInstance().getUnitId();
            // TODO not use try catch
            try {
                action.getWorkBook();
            } catch (error) {
                return;
            }

            const actionUnitId = action.getWorkBook().getUnitId();

            if (currentUnitId !== actionUnitId) return;

            // Only the currently active worksheet needs to be refreshed
            const worksheet = action.getWorkBook().getActiveSheet();
            if (worksheet) {
                try {
                    const canvasView = this.canvasView;
                    if (canvasView) {
                        this._selectionManager.updateToSheet(worksheet);
                        canvasView.updateToSheet(worksheet);
                        this.canvasView.getSheetView().getSpreadsheet().makeDirty(true);
                        this._selectionManager.renderCurrentControls(false);
                    }
                } catch (error) {
                    console.info(error);
                }
            }
        });
    }
}
