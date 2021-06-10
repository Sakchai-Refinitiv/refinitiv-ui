import { DataItem } from '@refinitiv-ui/utils';

export interface TreeItemData extends DataItem {
  /**
   * Label to show, when rendering the item.
   */
  label?: string;
  /**
   * Expanded state of child items.
   * If `true`, child items will be visible
   */
  expanded?: boolean;
}