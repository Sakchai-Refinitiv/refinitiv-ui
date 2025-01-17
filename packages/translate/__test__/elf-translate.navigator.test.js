import { elementUpdated, expect, fixture, nextFrame } from '@refinitiv-ui/test-helpers';

import '../lib/test/test-translate.js';

describe('Elf Translate Navigator Test', () => {
  it('If lang is not define navigator language should be applied', async function () {
    // make sure lang is not set from previous tests
    document.documentElement.removeAttribute('lang');

    // Force navigator language
    Object.defineProperty(navigator, 'language', { value: 'ru' });
    const el = await fixture('<test-translate></test-translate>');
    expect(el.defaultEl.innerText).to.equal(
      'Региональные настройки: ru',
      'Navigator locale is not taken into account'
    );

    document.documentElement.lang = 'en-US';
    await nextFrame();

    expect(el.defaultEl.innerText).to.equal(
      'This is en-US locale',
      'Document locale should take priority over navigator'
    );

    el.lang = 'en-GB';
    await elementUpdated(el);
    await nextFrame();
    expect(el.defaultEl.innerText).to.equal(
      'This is en locale',
      'Element locale should take priority over document locale'
    );
  });
});
