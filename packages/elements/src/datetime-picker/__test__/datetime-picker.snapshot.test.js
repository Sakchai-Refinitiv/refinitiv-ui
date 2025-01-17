// import element and theme
import '@refinitiv-ui/elements/datetime-picker';

import '@refinitiv-ui/elemental-theme/light/ef-datetime-picker';
import { expect, fixture, nextFrame } from '@refinitiv-ui/test-helpers';

import { snapshotIgnore } from './utils.js';

describe('datetime-picker/DOMStructure', () => {
  describe('DOM Structure', () => {
    it('DOM structure is correct', async () => {
      const el = await fixture('<ef-datetime-picker lang="en-gb" view="2020-04"></ef-datetime-picker>');
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
    it('DOM structure is correct when opened', async () => {
      const el = await fixture(
        '<ef-datetime-picker lang="en-gb" view="2020-04" opened></ef-datetime-picker>'
      );
      await nextFrame();
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
    it('DOM structure is correct when range', async () => {
      const el = await fixture(
        '<ef-datetime-picker lang="en-gb" view="2020-04" range opened></ef-datetime-picker>'
      );
      await nextFrame();
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
    it('DOM structure is correct when duplex', async () => {
      const el = await fixture(
        '<ef-datetime-picker lang="en-gb" view="2020-04" duplex opened></ef-datetime-picker>'
      );
      await nextFrame();
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
    it('DOM structure is correct when timepicker', async () => {
      const el = await fixture(
        '<ef-datetime-picker lang="en-gb" view="2020-04" timepicker opened></ef-datetime-picker>'
      );
      await nextFrame();
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
    it('DOM structure is correct when timepicker and with-seconds', async () => {
      const el = await fixture(
        '<ef-datetime-picker lang="en-gb" view="2020-04" timepicker with-seconds opened></ef-datetime-picker>'
      );
      await nextFrame();
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
    it('DOM structure is correct when range timepicker', async () => {
      const el = await fixture(
        '<ef-datetime-picker lang="en-gb" view="2020-04" timepicker range opened></ef-datetime-picker>'
      );
      await nextFrame();
      await nextFrame();
      await expect(el).shadowDom.to.equalSnapshot(snapshotIgnore);
    });
  });
});
