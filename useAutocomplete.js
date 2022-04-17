import { useState, useRef, useEffect } from 'react';

let timeout;
const debounce = (func, delay) => {
  clearTimeout(timeout);
  timeout = setTimeout(func, delay);
};

const defaultFilter = (inputValue, items) => {
  return items
    .filter((item) => {
      if (inputValue === '') {
        return true;
      }

      const name = `${item.code} | ${item.label}`;
      const {phone} = item;
      return name.toLocaleLowerCase().includes(inputValue.toLocaleLowerCase()) || phone.includes(inputValue);
    })
    .map((item) => {
      const name = `${item.code} | ${item.label}`;
      const {phone} = item;
      const nameMatchPos = name.toLocaleLowerCase().indexOf(inputValue.toLocaleLowerCase());
      const phoneMatchPos = phone.indexOf(inputValue);

      const nameParts = nameMatchPos >= 0 ? {
        hName: name.substring(0, nameMatchPos),
        mName: inputValue,
        tName: name.substring(nameMatchPos + inputValue.length),
      } : {
        hName: name,
        mName: '',
        tName: ''
      };
      const phonePars = phoneMatchPos >= 0 ? {
        hPhone: phone.substring(0, phoneMatchPos),
        mPhone: inputValue,
        tPhone: phone.substring(phoneMatchPos + inputValue.length),
      } : {
        hPhone: phone,
        mPhone: '',
        tPhone: ''
      };

      return {
        itemValue: item.label,
        code: item.code,
        phone: item.phone,
        ...nameParts, ...phonePars,
      };
    });
}

const useAutocomplete = (props) => {
	const {value: initValue, options, customFilter, onChange} = props;
  const INITIAL_STATE = { value: initValue, currentFocus: -1, keyword: '', suggestions: [], popupOpen: false, };

  const [value, setValue] = useState(INITIAL_STATE.value);
  const [{ currentFocus, keyword, suggestions, popupOpen }, setState] = useState(INITIAL_STATE);
  
  const filter = customFilter ?? ((_value = '', items = options) => defaultFilter(_value, items));

  const inputRef = useRef(null);
  const listboxRef = useRef(null);

  const handleSuggestions = (_value) => {
    setState((s) => ({
      ...s,
      currentFocus: -1,
      keyword: _value,
      suggestions: filter(_value),
      popupOpen: true,
    }));
  }

  const handleValue = (_value) => {
    if (onChange) {
      onChange(_value);
    }

    setValue(_value);
  }

  const handleInputValueChange = (e) => {
    const newValue = e.target.value;
    handleValue(newValue);
    debounce(() => handleSuggestions(newValue), 200);
  };

  const selectValue = (_value) => {
		handleValue(_value);
    setState((s) => ({
      ...s,
      popupOpen: false,
    }));
	}

  useEffect(() => {
    if (!popupOpen) {
      return;
    }
      
    // does the currentFocus exist?
    if (currentFocus === -1) {
      inputRef.current.removeAttribute('aria-activedescendant');
    } else {
      inputRef.current.setAttribute('aria-activedescendant', `cb-opt-${suggestions[currentFocus].itemValue}`);
    }

    if (!listboxRef.current) {
      return;
    }

    const prev = listboxRef.current.querySelector('[data-focus]');
    if (prev) {
      prev.removeAttribute('data-focus');
      prev.classList.remove('Mui-focusVisible');
    }

    const listboxNode = listboxRef.current.parentElement.querySelector('[role="listbox"]');

    // "No results"
    if (!listboxNode) {
      return;
    }

    if (currentFocus === -1) {
      listboxNode.scrollTop = 0;
      return;
    }

    const option = listboxRef.current.querySelector(`[data-option-index="${currentFocus}"]`);

    if (!option) {
      return;
    }

    option.setAttribute('data-focus', 'true');

    // Scroll active descendant into view.
    if (listboxNode.scrollHeight > listboxNode.clientHeight) {
      const element = option;

      const scrollBottom = listboxNode.clientHeight + listboxNode.scrollTop;
      const elementBottom = element.offsetTop + element.offsetHeight;
      if (elementBottom > scrollBottom) {
        listboxNode.scrollTop = elementBottom - listboxNode.clientHeight;
      } else if (
        element.offsetTop - element.offsetHeight * 0 < listboxNode.scrollTop
      ) {
        listboxNode.scrollTop = element.offsetTop - element.offsetHeight * 0;
      }
    }
  }, [currentFocus, popupOpen, suggestions]);

  const handleKeyDown = ({ key }) => {
    switch (key) {
      case 'ArrowDown':
        setState((s) => ({
          ...s,
          currentFocus: currentFocus === suggestions.length - 1 ? 0 : currentFocus + 1,
        }));
        break;
      case 'ArrowUp':
        setState((s) => ({
          ...s,
          currentFocus: currentFocus === 0 || currentFocus === -1 ? suggestions.length - 1 : currentFocus - 1,
        }));
        break;
      case 'Enter':
        if (currentFocus >= 0 && currentFocus < suggestions.length) {
          selectValue(suggestions[currentFocus].itemValue);
        } else if (suggestions.length > 1) {
          selectValue(suggestions[0].itemValue);
        } else {
          setState((s) => ({
            ...s,
            popupOpen: false,
          }))
        }
        break;
      default:
        break;
    }
  };

  const handleClear = () => {
    setValue('');
    if (popupOpen) {
      setState((s) => ({
        ...s,
        currentFocus: -1,
        keyword: '',
        suggestions: filter(''),
      }));
    }
  };

  const handlePopup = () => {
    if (!popupOpen) {
      const focus = options.findIndex(item => item.label === value);
      inputRef.current?.focus();
      setState((s) => ({
        ...s,
        currentFocus: focus,
        keyword: null,
        suggestions: filter(''),
        popupOpen: true,
      }))
    } else {
      setState((s) => ({
        ...s,
        popupOpen: false,
      }));
    }
  }

  return {
    value, selectValue, handleInputValueChange,
    currentFocus, keyword, suggestions, popupOpen,
    handleKeyDown, handlePopup, handleClear,
    inputRef, listboxRef,
  };
};

export default useAutocomplete;