import { ChangeEvent, KeyboardEvent } from 'react';

interface InputProps {
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onEnter?: () => void;
}

const Input = (props: InputProps) => {
  const { value, onChange, onEnter } = props;

  const onKeyup = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!onEnter) return;
    if (e.key === 'Enter') onEnter();
  };
  return (
    <input
      value={value}
      autoFocus
      onChange={onChange}
      onKeyUp={onKeyup}
      className="search-input"
    />
  );
};

export default Input;
