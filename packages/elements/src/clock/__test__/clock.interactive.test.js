import '@refinitiv-ui/elements/clock';

import '@refinitiv-ui/elemental-theme/light/ef-clock.js';
import { elementUpdated, expect, fixture, nextFrame, oneEvent } from '@refinitiv-ui/test-helpers';

describe('clock/Interactive', () => {
  describe('Interactive', () => {
    let el;
    let hoursSegment;
    let minutesSegment;
    let incrementBtnInHours;
    let decrementBtnInHours;
    let incrementBtnInMinutes;
    let decrementBtnInMinutes;

    const onTapstart = async (target, el) => {
      setTimeout(() => target.dispatchEvent(new CustomEvent('tapstart', { bubbles: true })));
      await oneEvent(el.renderRoot, 'tapstart');
      await elementUpdated(el);
    };

    const InputKey = {
      ArrowLeft: {
        key: 'ArrowLeft'
      },
      ArrowUp: {
        key: 'ArrowUp'
      },
      ArrowRight: {
        key: 'ArrowRight'
      },
      ArrowDown: {
        key: 'ArrowDown'
      }
    };

    const createKeyboardEvent = (elem, keyOption) => {
      keyOption = Object.assign({ bubbles: true }, keyOption);
      elem.dispatchEvent(new KeyboardEvent('keydown', keyOption));
      elem.dispatchEvent(new KeyboardEvent('keypress', keyOption));
      elem.dispatchEvent(new KeyboardEvent('keyup', keyOption));
    };

    beforeEach(async () => {
      el = await fixture('<ef-clock interactive></ef-clock>');
      hoursSegment = el.shadowRoot.querySelector('[part~=hours]');
      minutesSegment = el.shadowRoot.querySelector('[part~=minutes]');
      incrementBtnInHours = hoursSegment.querySelector('[part=increment-button]');
      decrementBtnInHours = hoursSegment.querySelector('[part=decrement-button]');
      incrementBtnInMinutes = minutesSegment.querySelector('[part=increment-button]');
      decrementBtnInMinutes = minutesSegment.querySelector('[part=decrement-button]');
    });

    it('Increases hour when increase button is clicked', async () => {
      await onTapstart(hoursSegment, el);
      await onTapstart(incrementBtnInHours, el);

      expect(el.offset, 'offset should be 3600').to.be.equal(3600);
      expect(el.displayHours, 'hours should be 1').to.be.equal(1);
    });
    it('Decreases hour when decrease button is clicked', async () => {
      await onTapstart(hoursSegment, el);
      await onTapstart(decrementBtnInHours, el);

      expect(el.offset, 'offset should be 82800').to.be.equal(82800);
      expect(el.displayHours, 'hours should be 23').to.be.equal(23);
    });
    it('Increases hour when arrow Up is pressed', async () => {
      await onTapstart(hoursSegment, el);
      createKeyboardEvent(el, InputKey.ArrowUp);
      await elementUpdated(el);

      expect(el.offset, 'offset should be 3600').to.be.equal(3600);
      expect(el.displayHours, 'hours should be 1').to.be.equal(1);
    });
    it('Decreases hour when arrow Down is pressed', async () => {
      await onTapstart(hoursSegment, el);
      createKeyboardEvent(el, InputKey.ArrowDown);
      await elementUpdated(el);

      expect(el.offset, 'offset should be 82800').to.be.equal(82800);
      expect(el.displayHours, 'hours should be 23').to.be.equal(23);
    });
    it('Increases minute when increase button is clicked', async () => {
      await onTapstart(minutesSegment, el);
      await onTapstart(incrementBtnInMinutes, el);

      expect(el.offset, 'offset should be 60').to.be.equal(60);
      expect(el.displayMinutes, 'minutes should be 1').to.be.equal(1);
    });
    it('Decreases minute when decrease button is clicked', async () => {
      await onTapstart(minutesSegment, el);
      await onTapstart(decrementBtnInMinutes, el);

      expect(el.offset, 'offset should be 86340').to.be.equal(86340);
      expect(el.displayMinutes, 'minutes should be 59').to.be.equal(59);
    });
    it('Increases minute when arrow Up is pressed', async () => {
      await onTapstart(minutesSegment, el);
      createKeyboardEvent(el, InputKey.ArrowUp);
      await elementUpdated(el);

      expect(el.offset, 'offset should be 60').to.be.equal(60);
      expect(el.displayMinutes, 'minutes should be 1').to.be.equal(1);
    });
    it('Decreases minute when arrow Down is pressed', async () => {
      await onTapstart(minutesSegment, el);
      createKeyboardEvent(el, InputKey.ArrowDown);
      await elementUpdated(el);

      expect(el.offset, 'offset should be 86340').to.be.equal(86340);
      expect(el.displayMinutes, 'minutes should be 59').to.be.equal(59);
    });
    it('Should fire offset-changed when user interact on hour segment', async () => {
      let offsetChangedCount = 0;
      const offsetSpy = () => offsetChangedCount++;
      el.addEventListener('offset-changed', offsetSpy);

      await onTapstart(hoursSegment, el);
      setTimeout(() => createKeyboardEvent(el, InputKey.ArrowUp));
      const offsetEvent = await oneEvent(el, 'offset-changed');

      expect(offsetChangedCount, 'offset-changed count should be 1').to.be.equal(1);
      expect(offsetEvent.detail.value, '  should be 3600').to.be.equal(3600);
    });
    it('Should fire offset-changed when user interact on minute segment', async () => {
      let offsetChangedCount = 0;
      const offsetSpy = () => offsetChangedCount++;
      el.addEventListener('offset-changed', offsetSpy);

      await onTapstart(minutesSegment, el);
      setTimeout(() => createKeyboardEvent(el, InputKey.ArrowUp));
      const offsetEvent = await oneEvent(el, 'offset-changed');

      expect(offsetChangedCount, 'offset-changed count should be 1').to.be.equal(1);
      expect(offsetEvent.detail.value, '  should be 60').to.be.equal(60);
    });

    describe('Accessibility', () => {
      it('Should have role="spinbutton", be focusable, and aria attributes', () => {
        expect(el.getAttribute('role')).to.be.equal('spinbutton');
        expect(el.getAttribute('tabindex')).to.be.equal('0');
        expect(el.getAttribute('aria-valuenow')).to.be.equal(`${el.displayTime}`);
        expect(el.getAttribute('aria-valuetext')).to.be.equal('Time: 00:00');
      });
      it('Should remove attributes when interactive attribute has been change', async () => {
        el.interactive = false;
        await elementUpdated(el);
        expect(el.getAttribute('role')).to.be.equal(null);
        expect(el.getAttribute('aria-valuenow')).to.be.equal(null);
        expect(el.getAttribute('aria-valuetext')).to.be.equal(null);
      });
      it('Should increase hour value and update aria-valuetext when Arrow Up is pressed on hour segment', async () => {
        await onTapstart(hoursSegment, el);
        createKeyboardEvent(el, InputKey.ArrowUp);
        await elementUpdated(el);
        await nextFrame();

        expect(el.getAttribute('aria-valuetext')).to.be.equal('Time: 01:00');
        expect(el.getAttribute('aria-valuenow')).to.be.equal(el.displayTime.toString());
      });
      it('Should decrease hour value and update aria-valuetext when Arrow Down is pressed on hour segment', async () => {
        await onTapstart(hoursSegment, el);
        createKeyboardEvent(el, InputKey.ArrowDown);
        await elementUpdated(el);
        await nextFrame();

        expect(el.getAttribute('aria-valuetext')).to.be.equal('Time: 23:00');
        expect(el.getAttribute('aria-valuenow')).to.be.equal(el.displayTime.toString());
      });
      it('Should increase minute value and update aria-valuetext when Arrow Up is pressed on minute segment', async () => {
        await onTapstart(minutesSegment, el);
        createKeyboardEvent(el, InputKey.ArrowUp);
        await elementUpdated(el);
        await nextFrame();

        expect(el.getAttribute('aria-valuetext')).to.be.equal('Time: 00:01');
        expect(el.getAttribute('aria-valuenow')).to.be.equal(el.displayTime.toString());
      });
      it('Should decrease minute value and update aria-valuetext when Arrow Down is pressed on minute segment', async () => {
        await onTapstart(minutesSegment, el);
        createKeyboardEvent(el, InputKey.ArrowUp);
        await elementUpdated(el);
        await nextFrame();

        expect(el.getAttribute('aria-valuetext')).to.be.equal('Time: 00:01');
        expect(el.getAttribute('aria-valuenow')).to.be.equal(el.displayTime.toString());
      });
      it('Switches active segment to hours when Arrow Right is pressed', async () => {
        await onTapstart(hoursSegment, el);
        createKeyboardEvent(el, InputKey.ArrowRight);
        await elementUpdated(el);

        expect(el.activeSegment).to.be.equal('minutes');
      });
      it('Switches active segment to minutes when Arrow Left is pressed', async () => {
        await onTapstart(hoursSegment, el);
        createKeyboardEvent(el, InputKey.ArrowLeft);
        await elementUpdated(el);

        expect(el.activeSegment).to.be.equal('hours');
      });
    });
  });
});
