// Import element and theme
import '@refinitiv-ui/elements/card';

import '@refinitiv-ui/elemental-theme/light/ef-card';
import { elementUpdated, expect, fixture, oneEvent } from '@refinitiv-ui/test-helpers';

const menuData = [
  { label: 'Spain', value: 'Spain' },
  { label: 'France', value: 'France', disabled: true },
  { label: 'Italy', value: 'Italy' },
  { label: 'Other', items: [{ label: 'Thailand', value: 'Thailand' }] }
];

describe('card/Card', () => {
  describe('DOM structure', () => {
    it('Basic DOM structure', async () => {
      const el = await fixture('<ef-card lang="en-gb">Card</ef-card>');
      await expect(el).shadowDom.to.equalSnapshot();
    });

    it('DOM structure with header and footer', async () => {
      const el = await fixture('<ef-card header="Header" footer="Footer" lang="en-gb">Card</ef-card>');
      await expect(el).shadowDom.to.equalSnapshot();
    });

    it('DOM structure with slotted content', async () => {
      const el = await fixture(`
        <ef-card lang="en-gb">
          <div slot="header">Header</div>
          <div>Body</div>
          <div slot="footer">Footer</div>
        </ef-card>`);

      await expect(el).shadowDom.to.equalSnapshot();
    });

    describe('DOM structure with menu', () => {
      it('Should contain menu data', async () => {
        const el = await fixture('<ef-card lang="en-gb">Card</ef-card>');
        el.config = {
          menu: {
            data: menuData
          }
        };
        await elementUpdated(el);
        await expect(el).shadowDom.to.equalSnapshot();
      });
      it('Should not contain menu data when unset the menu data', async () => {
        const el = await fixture('<ef-card lang="en-gb">Card</ef-card>');
        el.config = {
          menu: {
            data: menuData
          }
        };
        await elementUpdated(el);
        expect(el.config).to.not.equal(null);

        el.config = {};
        await elementUpdated(el);
        expect(Object.keys(el.config).length).to.be.equal(0);
        await expect(el).shadowDom.to.equalSnapshot();
      });
    });
  });

  describe('Interaction Test', () => {
    it('Should open menu and fire item-trigger event', async () => {
      const el = await fixture('<ef-card lang="en-gb">Card</ef-card>');
      el.config = {
        menu: {
          data: menuData
        }
      };
      await elementUpdated(el);

      const openMenu = el.openMenuElement;
      const menu = el.menuElement;

      expect(openMenu, 'Open menu button element does not exist').to.exist;
      expect(menu, 'Menu element does not exist').to.exist;

      openMenu.click();

      await elementUpdated(el);
      expect(menu.opened).to.equal(true, 'Menu should open on button click');

      const item = menu.shadowRoot.querySelector('ef-item');
      expect(item, 'Menu config is not passed correctly').to.exist;

      setTimeout(() => {
        item.click();
      });

      await oneEvent(el, 'item-trigger');
      expect(menu.opened).to.equal(false, 'Menu should close when item is selected');
    });
    it('Should open menu and not close when clicked on non value item', async function () {
      const el = await fixture('<ef-card lang="en-gb">Card</ef-card>');
      el.config = {
        menu: {
          data: menuData
        }
      };
      await elementUpdated(el);

      const openMenu = el.openMenuElement;
      const menu = el.menuElement;

      expect(openMenu, 'Open menu button element does not exist').to.exist;
      expect(menu, 'Menu element does not exist').to.exist;

      openMenu.click();

      await elementUpdated(el);
      expect(menu.opened).to.equal(true, 'Menu should open on button click');

      const item = menu.shadowRoot.querySelectorAll('ef-item')[3];

      expect(item, 'Menu config is not passed correctly').to.exist;

      setTimeout(() => {
        item.click();
      });
      await oneEvent(el, 'item-trigger');
      expect(menu.opened).to.equal(true, 'Menu should still open');
    });
  });

  describe('Accessibility', () => {
    let el;
    let headerPart;
    let menuButtonPart;

    beforeEach(async () => {
      el = await fixture('<ef-card lang="en-gb">Card</ef-card>');
      headerPart = el.shadowRoot.querySelector('[part=header]');
      el.config = {
        menu: {
          data: menuData
        }
      };
      await elementUpdated(el);
      menuButtonPart = el.shadowRoot.querySelector('[part=menu-button]');
    });

    it('Should pass common rules for accessibility', async () => {
      await expect(el).to.be.accessible();
    });

    it('Should toggle aria-expanded attribute value on menu button correctly when popup open and close', async () => {
      await expect(menuButtonPart.getAttribute('aria-expanded')).to.equal('false');

      setTimeout(() => menuButtonPart.dispatchEvent(new Event('tap')));
      await oneEvent(menuButtonPart, 'tap');
      await elementUpdated(el); // Safari required
      await expect(menuButtonPart.getAttribute('aria-expanded')).to.equal('true');
    });
  });
});
