import { FormulaDataType } from '@univerjs/base-formula-engine';
import { SheetActionBase, ActionObservers, ISheetActionData, CommandUnit } from '@univerjs/core';
import { SetFormulaRangeData } from '../Apply/SetFormulaRangeData';
import { FormulaController } from '../../Controller/FormulaController';

export interface ISetFormulaRangeActionData extends ISheetActionData {
    formulaData: FormulaDataType;
}

export class SetFormulaRangeDataAction extends SheetActionBase<ISetFormulaRangeActionData, ISetFormulaRangeActionData, FormulaDataType> {
    constructor(actionData: ISetFormulaRangeActionData, commandUnit: CommandUnit, observers: ActionObservers) {
        super(actionData, commandUnit, observers);
        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            ...actionData,
            formulaData: this.do(),
        };
    }

    do(): FormulaDataType {
        return this.redo();
    }

    redo(): FormulaDataType {
        const { _workbook } = this;
        const { formulaData, injector } = this._doActionData;
        return SetFormulaRangeData(_workbook, formulaData, injector!.get(FormulaController));
    }

    undo(): void {
        const { _workbook } = this;
        const { formulaData, injector } = this._oldActionData;
        SetFormulaRangeData(_workbook, formulaData, injector!.get(FormulaController));
    }

    validate(): boolean {
        return false;
    }
}
