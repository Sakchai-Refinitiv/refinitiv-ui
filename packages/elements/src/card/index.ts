import { BasicElement, CSSResultGroup, PropertyValues, TemplateResult, css, html } from '@refinitiv-ui/core';
import { customElement } from '@refinitiv-ui/core/decorators/custom-element.js';
import { property } from '@refinitiv-ui/core/decorators/property.js';
import { query } from '@refinitiv-ui/core/decorators/query.js';
import { state } from '@refinitiv-ui/core/decorators/state.js';

import '@refinitiv-ui/phrasebook/locale/en/card.js';
import { Translate, translate } from '@refinitiv-ui/translate';
import { isSlotEmpty } from '@refinitiv-ui/utils/is-slot-empty.js';

import '../button/index.js';
import '../label/index.js';
import '../overlay-menu/index.js';
import { VERSION } from '../version.js';

import type { Button } from '../button';
import type { ItemTriggerEvent, OpenedChangedEvent } from '../events';
import type { OverlayMenu, OverlayMenuData } from '../overlay-menu';
import type { CardConfig } from './helpers/types';

export type { CardConfig };

/**
 * A card frame component.
 *
 * @fires item-trigger - Fired when the user selects card menu.
 *
 * @slot header - Adds slotted content into the header of the card.
 * @slot footer - Adds slotted content into the footer of the card.
 */
@customElement('ef-card')
export class Card extends BasicElement {
  /**
   * Element version number
   * @returns version number
   */
  static override get version(): string {
    return VERSION;
  }

  /**
   * A `CSSResultGroup` that will be used
   * to style the host, slotted children
   * and the internal template of the element.
   * @returns CSS template
   */
  static override get styles(): CSSResultGroup {
    return css`
      :host {
        display: flex;
        flex-flow: column nowrap;
      }
      [part~='header'] {
        display: flex;
      }
      [part~='header-body'] {
        flex: 1;
        min-width: 0px;
      }
      [part~='footer']:not([part~='has-content']),
      [part~='header']:not([part~='has-content']) {
        display: none;
      }
    `;
  }

  private _config: CardConfig = {};

  /**
   * Set text on the header
   */
  @property({ type: String })
  public header = '';

  /**
   * Set text on the footer
   */
  @property({ type: String })
  public footer = '';

  /**
   * Set card configurations
   * @type {CardConfig}
   * @default {}
   */
  @property({ type: Object, attribute: false })
  public get config(): CardConfig {
    return this._config;
  }
  public set config(config: CardConfig) {
    const data = config?.menu?.data;
    if (data !== this.menuData) {
      this.menuData = data;
    }
    this._config = config;
  }

  /**
   * Get menu element from shadow root
   */
  @query('[part=menu-popup]')
  private menuElement?: OverlayMenu;

  /**
   * Get button element from shadow root
   */
  @query('[part=menu-button]')
  private openMenuElement?: Button;

  /**
   * Used for translations
   */
  @translate()
  protected t!: Translate;

  /**
   * Menu data for creating overlay-menu
   */
  @state()
  private menuData?: OverlayMenuData;

  /**
   * Menu open state
   */
  @state()
  private menuOpened = false;

  /**
   * True if header has slotted content
   */
  @state()
  private headerHasContent = false;

  /**
   * True if footer has slotted content
   */
  @state()
  private footerHasContent = false;

  /**
   * Open menu
   * @returns {void}
   */
  private openMenu(): void {
    if (this.menuElement && !(this.menuElement.fullyOpened || this.menuElement.transitioning)) {
      this.menuElement.opened = true;
      this.menuOpened = true;
    }
  }

  /**
   * Close menu
   * @param event ItemTriggerEvent
   * @returns {void}
   */
  private closeMenu(event: ItemTriggerEvent): void {
    if (this.menuElement?.opened && event.detail.value) {
      this.menuElement.opened = false;
      this.menuOpened = false;
    }
  }

  /**
   * Run on header slot slotchange
   * @param event Footer slotchange event
   * @returns {void}
   */
  private onHeaderSlotChange(event: Event): void {
    this.headerHasContent = isSlotEmpty(event.target as HTMLSlotElement);
  }

  /**
   * Run on footer slot slotchange
   * @param event Header slotchange event
   * @returns {void}
   */
  private onFooterSlotChange(event: Event): void {
    this.footerHasContent = isSlotEmpty(event.target as HTMLSlotElement);
  }

  /**
   * Run on overlay menu open changed
   * @param event overlay menu opened changed event
   * @returns {void}
   */
  private onMenuOpenChanged(event: OpenedChangedEvent): void {
    this.menuOpened = event.detail.value;
  }

  /**
   * True if card has header
   */
  private get withHeader(): boolean {
    return this.headerHasContent || !!this.header || !!this.menuData;
  }

  /**
   * True if card has footer
   */
  private get withFooter(): boolean {
    return this.footerHasContent || !!this.footer;
  }

  /**
   * Called after render life-cycle finished
   * @param changedProperties Properties which have changed
   * @return {void}
   */
  protected override updated(changedProperties: PropertyValues): void {
    super.updated(changedProperties);

    if (changedProperties.has('menuData') && this.menuElement) {
      this.menuElement.positionTarget = this.openMenuElement;
    }
  }

  /**
   * Called after the component is first rendered
   * @param changedProperties Properties which have changed
   * @return {void}
   */
  protected override firstUpdated(changedProperties: PropertyValues): void {
    super.firstUpdated(changedProperties);
    this.addEventListener('item-trigger', (event) => this.closeMenu(event as ItemTriggerEvent)); // Here to cover nested menus
  }

  /**
   * Template of menu
   * @return menu template
   */
  protected get menuTemplate(): TemplateResult {
    return html`${this.menuData
      ? html` <ef-button
            part="menu-button"
            icon="more-vertical"
            transparent
            aria-label=${this.t('OPEN_MENU')}
            aria-haspopup="true"
            aria-controls="menu-popup"
            aria-expanded=${this.menuOpened}
            @tap=${this.openMenu}
          ></ef-button>
          <ef-overlay-menu
            id="menu-popup"
            part="menu-popup"
            .data=${this.menuData}
            position="bottom-end"
            @opened-changed=${this.onMenuOpenChanged}
          ></ef-overlay-menu>`
      : undefined} `;
  }

  /**
   * Template of header
   * @return header template
   */
  protected get headerTemplate(): TemplateResult {
    return html`
      <div part="header${this.withHeader ? ' has-content' : ''}">
        <div part="header-body">
          <slot name="header" @slotchange="${this.onHeaderSlotChange}"></slot>
          ${!this.headerHasContent && this.header
            ? html`<ef-label line-clamp="3" part="header-text">${this.header}</ef-label>`
            : null}
        </div>
        ${this.menuTemplate}
      </div>
    `;
  }

  /**
   * Template of footer
   * @return footer template
   */
  protected get footerTemplate(): TemplateResult {
    return html`
      <div part="footer${this.withFooter ? ' has-content' : ''}">
        <div part="footer-body">
          <slot name="footer" @slotchange="${this.onFooterSlotChange}"></slot>
          ${!this.footerHasContent && this.footer
            ? html`<ef-label line-clamp="3">${this.footer}</ef-label>`
            : undefined}
        </div>
      </div>
    `;
  }

  /**
   * A `TemplateResult` that will be used
   * to render the updated internal template.
   * @return Render template
   */
  protected override render(): TemplateResult {
    return html`
      ${this.headerTemplate}
      <div part="body"><slot></slot></div>
      ${this.footerTemplate}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'ef-card': Card;
  }
}
