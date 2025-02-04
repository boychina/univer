import { SetTabColor } from '../Apply';
import { Nullable } from '../../Shared/Types';
import { SheetActionBase, ISheetActionData } from '../../Command/SheetActionBase';
import { ActionObservers, ActionType } from '../../Command/ActionObservers';
import { CommandManager, CommandUnit } from '../../Command';

/**
 * @internal
 */
export interface ISetTabColorActionData extends ISheetActionData {
    color: Nullable<string>;
}

/**
 * @internal
 */
export class SetTabColorAction extends SheetActionBase<
    ISetTabColorActionData,
    ISetTabColorActionData,
    Nullable<string>
> {
    static NAME = 'SetTabColorAction';

    constructor(
        actionData: ISetTabColorActionData,
        commandUnit: CommandUnit,
        observers: ActionObservers
    ) {
        super(actionData, commandUnit, observers);

        this._doActionData = {
            ...actionData,
        };
        this._oldActionData = {
            ...actionData,
            color: this.do(),
        };

        this.validate();
    }

    do(): Nullable<string> {
        const worksheet = this.getWorkSheet();

        const result = SetTabColor(worksheet, this._doActionData.color);

        this._observers.notifyObservers({
            type: ActionType.REDO,
            data: this._doActionData,
            action: this,
        });

        return result;
    }

    redo(): void {
        // update pre data
        const { sheetId } = this._doActionData;
        this._oldActionData = {
            sheetId,
            // actionName: ACTION_NAMES.SET_TAB_COLOR_ACTION,
            actionName: SetTabColorAction.NAME,
            color: this.do(),
        };
    }

    undo(): void {
        const { color, sheetId } = this._oldActionData;
        const worksheet = this.getWorkSheet();

        // update current data
        this._doActionData = {
            // actionName: ACTION_NAMES.SET_TAB_COLOR_ACTION,
            actionName: SetTabColorAction.NAME,
            sheetId,
            color: SetTabColor(worksheet, color),
        };

        this._observers.notifyObservers({
            type: ActionType.UNDO,
            data: this._oldActionData,
            action: this,
        });
    }

    validate(): boolean {
        return false;
    }
}

CommandManager.register(SetTabColorAction.NAME, SetTabColorAction);
