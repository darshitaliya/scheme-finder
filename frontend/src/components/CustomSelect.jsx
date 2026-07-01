import { useState, useRef, useEffect } from 'react';
import { FiChevronDown } from 'react-icons/fi';
import './CustomSelect.css';

export default function CustomSelect({
  name,
  value,
  onChange,
  options = [],
  placeholder = 'Select option',
  className = '',
  error = false
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleSelect = (optionValue) => {
    if (onChange) {
      onChange({
        target: {
          name,
          value: optionValue
        }
      });
    }
    setIsOpen(false);
  };

  // Resolve active display label
  const activeOption = options.find(opt => {
    if (typeof opt === 'object') {
      return opt.value === value;
    }
    return opt === value;
  });

  const displayLabel = activeOption 
    ? (typeof activeOption === 'object' ? activeOption.label : activeOption)
    : placeholder;

  return (
    <div className={`custom-select-container ${className}`} ref={containerRef}>
      <button
        type="button"
        className={`custom-select-trigger ${error ? 'error' : ''} ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className={`custom-select-value ${!value ? 'is-placeholder' : ''}`}>
          {displayLabel}
        </span>
        <FiChevronDown className={`custom-select-chevron ${isOpen ? 'rotated' : ''}`} />
      </button>

      {isOpen && (
        <ul className="custom-select-options" role="listbox">
          {options.map((opt, idx) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const label = typeof opt === 'object' ? opt.label : opt;
            const isSelected = val === value;

            return (
              <li
                key={idx}
                className={`custom-select-option ${isSelected ? 'selected' : ''}`}
                role="option"
                aria-selected={isSelected}
                onClick={() => handleSelect(val)}
              >
                {label}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
