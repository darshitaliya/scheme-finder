import { useState, useRef, useEffect } from 'react';
import { FiCalendar, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import './CustomDatePicker.css';

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function CustomDatePicker({
  name,
  value,
  onChange,
  error = false,
  placeholder = 'Select date'
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Initialize calendar view state from value or current date
  const [currentDate, setCurrentDate] = useState(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) return parsed;
    }
    return new Date();
  });

  const viewYear = currentDate.getFullYear();
  const viewMonth = currentDate.getMonth();

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update view state when value changes externally
  useEffect(() => {
    if (value) {
      const parsed = new Date(value);
      if (!isNaN(parsed)) {
        setCurrentDate(parsed);
      }
    }
  }, [value]);

  const handleToggle = (e) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };

  const handleMonthChange = (direction) => {
    const nextDate = new Date(viewYear, viewMonth + direction, 1);
    setCurrentDate(nextDate);
  };

  const handleYearChange = (year) => {
    const nextDate = new Date(year, viewMonth, 1);
    setCurrentDate(nextDate);
  };

  const handleMonthSelect = (month) => {
    const nextDate = new Date(viewYear, month, 1);
    setCurrentDate(nextDate);
  };

  const handleDateSelect = (day) => {
    const selectedDateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    if (onChange) {
      onChange({
        target: {
          name,
          value: selectedDateStr
        }
      });
    }
    setIsOpen(false);
  };

  // Days in month logic
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDayIndex = new Date(viewYear, viewMonth, 1).getDay();

  // Selected date highlights
  const selectedDay = value ? new Date(value).getDate() : null;
  const selectedMonth = value ? new Date(value).getMonth() : null;
  const selectedYear = value ? new Date(value).getFullYear() : null;

  const isSelected = (day) => {
    return day === selectedDay && viewMonth === selectedMonth && viewYear === selectedYear;
  };

  // Generate lists of years (from 1920 to current year + 10)
  const currentYear = new Date().getFullYear();
  const yearsList = [];
  for (let y = currentYear; y >= 1920; y--) {
    yearsList.push(y);
  }

  // Days array generation
  const daysArray = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysArray.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    daysArray.push(d);
  }

  // Format value for display (DD/MM/YYYY or placeholder)
  const getDisplayValue = () => {
    if (!value) return '';
    const date = new Date(value);
    if (isNaN(date)) return '';
    return `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}/${date.getFullYear()}`;
  };

  return (
    <div className="custom-datepicker-container" ref={containerRef}>
      <div className="custom-datepicker-wrapper">
        <input
          type="text"
          readOnly
          className={`input-field custom-datepicker-input ${error ? 'error' : ''}`}
          value={getDisplayValue()}
          placeholder={placeholder}
          onClick={handleToggle}
        />
        <FiCalendar className="custom-datepicker-icon" onClick={handleToggle} />
      </div>

      {isOpen && (
        <div className="custom-datepicker-calendar animate-calendar">
          {/* Header */}
          <div className="calendar-header">
            <button type="button" className="calendar-nav-btn" onClick={() => handleMonthChange(-1)}>
              <FiChevronLeft />
            </button>
            
            <div className="calendar-selectors">
              <select 
                value={viewMonth} 
                onChange={(e) => handleMonthSelect(parseInt(e.target.value))}
                className="calendar-select"
              >
                {MONTH_NAMES.map((name, idx) => (
                  <option key={idx} value={idx}>{name}</option>
                ))}
              </select>

              <select 
                value={viewYear} 
                onChange={(e) => handleYearChange(parseInt(e.target.value))}
                className="calendar-select"
              >
                {yearsList.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button type="button" className="calendar-nav-btn" onClick={() => handleMonthChange(1)}>
              <FiChevronRight />
            </button>
          </div>

          {/* Weekday Labels */}
          <div className="calendar-weekdays">
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className="calendar-days">
            {daysArray.map((day, idx) => (
              <div 
                key={idx}
                className={`calendar-day-cell ${!day ? 'empty' : ''} ${day && isSelected(day) ? 'selected' : ''}`}
                onClick={() => day && handleDateSelect(day)}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
