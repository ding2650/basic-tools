import React, { ChangeEvent } from 'react';

interface InputProps {
  value: string;
  onkeydown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const Input = (props: InputProps) => {
  const { value, onChange, onkeydown } = props;

  return (
    <input
      value={value}
      autoFocus
      onChange={onChange}
      onKeyDown={onkeydown}
      className="his-search-input"
    />
  );
};

export default Input;
