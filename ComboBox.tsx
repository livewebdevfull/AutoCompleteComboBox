import React from "react"
import styled from 'styled-components';
import PropTypes from 'prop-types';
import useAutocomplete from './useAutocomplete';

interface Option {
  code: string;
  label: string;
  phone: string;
}
  
interface ComboBoxProps {
  options: Option[], 
  inputValue?: string, 
  onChange: (value: string) => void
}
  
interface StyleProps {
  active: boolean
}

const Container = styled.div`
  position: relative;
`;

const Form = styled.div`
  background-color: #293241;
  border-radius: 5px 5px 0 0;
  padding: 5px 5px;
`;

const Input = styled.input`
  background-color: #293241;
  color: #f2e9e4;
  border: none;
  width: 100%;
  padding: 15px 15px;

  &:focus {
    outline: none;
  }
`;

const ButtonGroup = styled.div`
  top: calc(50% - 19px);
  right: 10px;
  position: absolute;
`;

const IconButton = styled.button`
  outline: none;
  border: none;
  background-color: #293241;
  color: #f2e9e4;
  border-radius: 50%;
  padding: 5px 5px;
  cursor: pointer;

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transition: background-color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms;
  };

  & svg {
    fill: currentColor;
    width: 1em;
    height: 1em;
    display: inline-block;
    font-size: 1.5rem;
    flex-shrink: 0;
    user-select: none;
  }
`;

const List = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  max-height: 300px;
  background-color: #293241;
  border-radius: 0 0 5px 5px;
  overflow-y: scroll;
  margin: 0;
  padding: 5px 10px;

  &::-webkit-scrollbar {
    width: 0.4rem;
    height: 0rem;
    border-radius: 20px;
  }
  
  &::-webkit-scrollbar-thumb {
    background-color: #b0b1ad6b;
  }
`;

const NoSuggestions = styled.div`
  border-left: 3px solid initial;
  background-color: initial;
  color: #9d9d9d;
  padding: 3px 5px;
  list-style: none;
`;

const Item = styled.li`
  border-left: 3px solid ${(props: StyleProps) => (props.active ? 'blue' : 'initial')};
  background-color: ${({ active }) => (active ? '#80808059' : 'initial')};
  padding: 3px 5px;
  color: ${({ active }) => (active ? 'white' : '#f2e9e4')};
  cursor: pointer;
  list-style: none;

  &:hover {
    background-color: #80808059;
  }
`;

const Name = styled.span`
  color: #a1908c;
`;

const Phone = styled.span`
  margin-left: 1.5rem;
  color: rgb(140, 140, 140);
`;

const Match = styled.strong`
  color: #c9ada7;
`;

const ComboBox = (props : ComboBoxProps):JSX.Element => {
  const {options, inputValue, onChange} = props;

  const {value, handleInputValueChange, selectValue,
    currentFocus, suggestions, popupOpen,
    handleKeyDown, handlePopup, handleClear,
    inputRef, listboxRef,
  } = useAutocomplete({
    options,
    value: inputValue,
    onChange,
  });

  const hasSuggestions = !(Array.isArray(suggestions) && !suggestions.length);
  // const activeDescendant = (inputValue || "").length > 0? inputValue: options[0]?.label;

  return (
    <Container>
      <Form>
        <Input
          onKeyDown={handleKeyDown}
          value={value}
          onChange={handleInputValueChange}
          aria-owns="cb-list" 
          aria-autocomplete="list" 
          aria-readonly="true" 
          // aria-activedescendant={`cb-opt-${activeDescendant}`}
          role="textbox"
          ref={inputRef}
        />
        <ButtonGroup>
          {value.length > 0 && <IconButton onClick={handleClear}>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </IconButton>}
          <IconButton role="button" aria-label="popbutton" onClick={handlePopup} style={ popupOpen ? {transform:'rotate(180deg)'} : {} }>
            <svg fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </IconButton>
        </ButtonGroup>
      </Form>
      {popupOpen && (
        <List
          aria-expanded={popupOpen}
          role="listbox" 
          id="cb-list"
          ref={listboxRef}
        >
          {suggestions.map(({ itemValue, hName, mName, tName, hPhone, mPhone, tPhone }, i: number) => (
            <Item
              key={itemValue}
              active={i === currentFocus}
              onClick={() => selectValue(itemValue)}
              data-focus={i === currentFocus}
              role="option" 
              id={`cb-opt-${itemValue}`}
              data-option-index={i}
            >
              <Name>
                {hName}
                <Match>{mName}</Match>
                {tName}
              </Name>
              <Phone>
                {hPhone}
                <Match>{mPhone}</Match>
                {tPhone}
              </Phone>
            </Item>
          ))}
          {!hasSuggestions && 
            <NoSuggestions> No Suggestions </NoSuggestions>
          }
        </List>
      )}
    </Container>
  );
};

ComboBox.propTypes = {
  inputValue: PropTypes.string,
  onChange: PropTypes.func,
  options: PropTypes.arrayOf(Object),
}

export default ComboBox;