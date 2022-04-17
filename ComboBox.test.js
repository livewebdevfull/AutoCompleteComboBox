import * as React from 'react';
import { expect } from 'chai';
import { createClientRender, fireEvent, screen, act } from 'test/utils';
import { spy } from 'sinon';
import ComboBox from './ComboBox';

/**
 * You can run these tests with `yarn t ComboBox`.
 */
function checkHighlightIs(listbox, expected) {
  const focused = listbox.querySelector('[role="option"][data-focus]');

  if (expected) {
    if (focused) {
      expect(focused).to.have.text(expected);
    } else {
      // No options selected
      expect(null).to.equal(expected);
    }
  } else {
    expect(focused).to.equal(null);
  }
}

describe('<ComboBox />', () => {
  const render = createClientRender();

  it('should prevent the default event handlers', async () => {
    const handleSubmit = spy();
    const handleChange = spy();
    const countries = [
      { code: 'MM', label: 'Myanmar', phone: '95' },
      { code: 'MN', label: 'Mongolia', phone: '976' },
    ];
    const { findAllByRole, findByRole } = render(
      <div
        onKeyDown={(event) => {
          if (!event.defaultPrevented && event.key === 'Enter') {
            handleSubmit();
          }
        }}
      >
        {/* The ComboBox component here */}
        <ComboBox 
          onChange={handleChange} 
          inputValue="Myanmar"
          options={countries}
        />
      </div>,
    );

    const textbox = screen.getByRole('textbox');
    const popbutton = await findByRole('button', { name: "popbutton"});
    act(() => {
      fireEvent.change(textbox, { target: { value: "Myanmar" } }); // open the popup
    })
    act(() => {
      popbutton.click();
    })
    const options = await findAllByRole('option');
    expect(textbox).to.have.attribute('aria-activedescendant', options[0].getAttribute('id'));

    fireEvent.keyPress(textbox, { key: 'Enter' }); // select the first option
    expect(handleSubmit.callCount).to.equal(0);
    expect(handleChange.callCount).to.equal(0);
  });

  it('should initialize with options and inputValue', async() => {
    const handleSubmit = spy();
    const handleChange = spy();
    const countries = [
      { code: 'MM', label: 'Myanmar', phone: '95' },
      { code: 'MN', label: 'Mongolia', phone: '976' },
    ];
    const { findByRole, findAllByRole } = render(
      <div
        onKeyDown={(event) => {
          if (!event.defaultPrevented && event.key === 'Enter') {
            handleSubmit();
          }
        }}
      >
        {/* The ComboBox component here */}
        <ComboBox 
          onChange={handleChange} 
          inputValue={''}
          options={countries}
        />
      </div>,
    );

    const textbox = screen.getByRole('textbox');
    fireEvent.change(textbox, { target: { value: 'Myanmar' } });

    const listbox = await findByRole('listbox');
    const options = await findAllByRole('option');
    expect(options).to.have.length(1);
    options.forEach((option) => {
      expect(listbox).to.contain(option);
    });
  });

  it('should set the focus on the first item', async () => {
    const options = [{ code: 'MM', label: 'Myanmar', phone: '95' }];
    const { findByRole } = render(
      <ComboBox
        inputValue={'Myanmar'}
        options={options}
      />,
    );

    const textbox = await findByRole('textbox');
    const popbutton = await findByRole('button', { name: "popbutton" });
    fireEvent.change(textbox, { target: { value: "Myanmar" } }); // open the popup
    act(() => {
      popbutton.click();
    })
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');

    fireEvent.change(textbox, { target: { value: 'My' } });
    fireEvent.change(textbox, { target: { value: 'M' } });
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');

  });

  it('should keep the highlight on the first item', async() => {
    const options = [
      { code: 'MM', label: 'Myanmar', phone: '95' },
      { code: 'MN', label: 'Mongolia', phone: '976' },
    ];
    const { findByRole } = render(
      <ComboBox
        inputValue={''}
        options={options}
      />,
    );

    const textbox = screen.getByRole('textbox');
    const popbutton = await findByRole('button', { name: "popbutton" });
    act(() => {
      fireEvent.change(textbox, { target: { value: "Myanmar" } }); // open the popup
    })
    act(() => {
      popbutton.click();
    })
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');

    fireEvent.change(textbox, { target: { value: 'Mongolia' } });
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');
  });

  it('should keep the current highlight if possible', async () => {
    const options = [
      { code: 'MM', label: 'Myanmar', phone: '95' },
      { code: 'MN', label: 'Mongolia', phone: '976' },
      { code: 'MO', label: 'Macao', phone: '853' },
    ];
    const { findByRole } = render(
      <ComboBox
        inputValue={''}
        options={options}
      />,
    );
    const textbox = screen.getByRole('textbox');
    const popbutton = await findByRole('button', { name: "popbutton" });
    act(() => {
      fireEvent.change(textbox, { target: { value: "Myanmar" } }); // open the popup
    })
    act(() => {
      popbutton.click();
    })
    fireEvent.change(textbox, { target: { value: 'Myanmar' } });
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');
    fireEvent.keyPress(textbox, { key: 'ArrowDown' });
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');
    fireEvent.keyPress(textbox, { key: 'Enter' });
    checkHighlightIs(await findByRole('listbox'), 'MM | Myanmar95');
  });

  describe('prop: onChange', () => {
    it('provides details', () => {
      const onChange = spy();
      const options = [
        { code: 'MM', label: 'Myanmar', phone: '95' },
        { code: 'MN', label: 'Mongolia', phone: '976' },
        { code: 'MO', label: 'Macao', phone: '853' },
      ];
      render(
        <ComboBox
          inputValue={''}
          options={options}
          onChange={onChange}
        />,
      );
      const textbox = screen.getByRole('textbox');
      fireEvent.change(textbox, { target: { value: options[2].label } });
      fireEvent.keyPress(textbox, { key: 'Enter' });
      expect(onChange.callCount).to.equal(1);
      expect(onChange.args[0][0]).to.equal(options[2].label);
    });

  });
});
