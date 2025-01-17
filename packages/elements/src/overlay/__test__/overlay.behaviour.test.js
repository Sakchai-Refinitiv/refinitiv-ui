import '@refinitiv-ui/elements/overlay';

import '@refinitiv-ui/elemental-theme/light/ef-overlay';
import { elementUpdated, expect, fixture } from '@refinitiv-ui/test-helpers';

describe('overlay/Behaviour', () => {
  describe('User Interaction Test', () => {
    it('Overlay should close on click', async () => {
      const el = await fixture('<ef-overlay opened><div>Default</div></ef-overlay>');
      expect(el.opened).to.equal(true);
      document.dispatchEvent(new CustomEvent('tapstart'));
      await elementUpdated(el);
      expect(el.opened).to.equal(false);
    });
  });
});
