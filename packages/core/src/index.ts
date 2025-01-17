/**
 * Export element base classes
 */
import { BasicElement } from './elements/BasicElement.js';
import { CustomStyleRegistry } from './registries/CustomStyleRegistry.js';
import { NativeStyleRegistry } from './registries/NativeStyleRegistry.js';
import { global } from './utils/global.js';

/**
 * Export common interfaces
 */
import type { MultiValue } from './interfaces/MultiValue';
import type { StyleInfo } from './interfaces/StyleInfo';
import type { StyleMap } from './interfaces/StyleMap';
import type { FocusedChangedEvent } from './types/events';

/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

export { html, svg, css, unsafeCSS, render, nothing } from 'lit';

export type {
  TemplateResult,
  SVGTemplateResult,
  CSSResult,
  CSSResultGroup,
  PropertyValues,
  ReactiveElement
} from 'lit';

export { BasicElement };
export { ControlElement } from './elements/ControlElement.js';
export { FormFieldElement } from './elements/FormFieldElement.js';
export { ResponsiveElement, ElementSize, ResizeEvent } from './elements/ResponsiveElement.js';
export class LitElement extends BasicElement {
  constructor() {
    /* eslint-disable-next-line no-console */
    console.warn('Please use an ELF element type, instead of LitElement');
    super();
  }
}

/**
 * Export notices.
 * These can be used to show warning messages in the console.
 * For example, when deprecated features are used in elements.
 */
export { WarningNotice } from './notices/WarningNotice.js';
export { DeprecationNotice } from './notices/DeprecationNotice.js';

/**
 * Export events
 */
export { TapEvent } from './events/TapEvent.js';

export type { FocusedChangedEvent };

export type { MultiValue };

export type { StyleMap };

export type { StyleInfo };

/**
 * Export useful utils
 */
export { FocusableHelper } from './utils/focusableHelper.js';
export { isBasicElement } from './utils/helpers.js';
export { triggerResize } from './utils/resizeHelper.js';

/**
 * Export focused key.
 * Used to observe `focused` attribute changes
 */
export { FocusedPropertyKey } from './registries/FocusRegistry.js';

global.addEventListener('ef.customStyles.define', (event) => {
  const { name, styles } = (event as CustomEvent).detail;
  CustomStyleRegistry.define(name, styles);
});

global.addEventListener('ef.nativeStyles.define', (event) => {
  const { name, styles } = (event as CustomEvent).detail;
  NativeStyleRegistry.define(name, styles);
});
