import { SheetContext } from '@univerjs/core';
import { BaseComponentProps } from '@univerjs/base-ui/src/BaseComponent';
import { FilterPlugin } from './FilterPlugin';

export type IConfig = {
    context: SheetContext;
};

// Types for props
export interface IProps extends BaseComponentProps {
    config: IConfig;
    super: FilterPlugin;
}
