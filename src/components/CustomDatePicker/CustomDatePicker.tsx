'use client';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import './datepicker.modules.css';
import {
  ChevronRightIcon,
  ChevronDoubleRightIcon,
  ChevronLeftIcon,
  ChevronDoubleLeftIcon,
} from '@heroicons/react/24/outline';

interface CustomHeaderProps {
  customHeaderCount: number;
  monthDate: Date;
  date: Date;
  changeMonth: (month: number) => void;
  changeYear: (year: number) => void;
  decreaseMonth: VoidFunction;
  increaseMonth: VoidFunction;
  decreaseYear: VoidFunction;
  increaseYear: VoidFunction;
  prevMonthButtonDisabled: boolean;
  nextMonthButtonDisabled: boolean;
  prevYearButtonDisabled: boolean;
  nextYearButtonDisabled: boolean;
}

type CustomHeaderDateProps = CustomHeaderProps & {
  visibleYearsRange: {
    startYear: number;
    endYear: number;
  };
};

type DatePickerProps = {
  selected: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  dateBounds: { startDate: Date; endDate: Date };
  mode: 'year' | 'date';
};

export function CustomDatePicker({ selected, setDate, dateBounds, mode }: DatePickerProps) {
  return (
    <DatePicker
      renderCustomHeader={
        mode === 'date'
          ? (DatePickerProps) => {
              return customDateHeader({
                ...DatePickerProps,
                visibleYearsRange: {
                  startYear: dateBounds.startDate.getFullYear(),
                  endYear: dateBounds.endDate.getFullYear(),
                },
              });
            }
          : customYearHeader
      }
      selected={selected}
      onChange={(date) => date !== null && setDate(date)} // this seems bad but i keep getting a lint error that I want to think about later
      minDate={dateBounds.startDate}
      maxDate={dateBounds.endDate}
      showYearPicker={mode === 'year'}
      dateFormat={mode === 'year' ? 'yyyy' : 'MM/dd/yyyy'}
      showMonthYearDropdown
      scrollableMonthYearDropdown
      calendarClassName="calendar-class"
      className="p-2 rounded-md shadow-sm border-none focus:outline-none focus:border-2 focus:border-solid g-slate-200 dark:bg-slate-800 border-teal-400 dark:border-slate-600 w-full"
    />
  );
}

function customDateHeader({
  date,
  decreaseMonth,
  increaseMonth,
  decreaseYear,
  increaseYear,
  changeMonth,
  changeYear,
  prevMonthButtonDisabled,
  prevYearButtonDisabled,
  nextMonthButtonDisabled,
  nextYearButtonDisabled,
  visibleYearsRange,
}: CustomHeaderDateProps) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const years = Array.from(
    { length: visibleYearsRange.endYear - visibleYearsRange.startYear + 1 },
    (_, i) => visibleYearsRange.startYear + i
  );
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
      }}
      className="mx-1 mt-3 mb-2"
    >
      <div>
        <button
          onClick={(event) => {
            event.preventDefault();
            decreaseYear();
          }}
          disabled={prevYearButtonDisabled}
          className="color-black font-bold disabled:opacity-20"
          // className="border-2 rounded-sm date-button disabled:opacity-20"
        >
          <ChevronDoubleLeftIcon className="size-4 stroke-2" />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            decreaseMonth();
          }}
          disabled={prevMonthButtonDisabled}
          // className="border-2 rounded-sm date-button disabled:opacity-20"
          className="color-black font-bold disabled:opacity-20 -ml-1"
        >
          <ChevronLeftIcon className="size-4 stroke-2" />
        </button>
      </div>
      <select
        value={date.getFullYear()}
        onChange={({ target: { value } }) => changeYear(parseInt(value))}
        // className="ms-6"
      >
        {years.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <select
        value={months[date.getMonth()]}
        onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
      >
        {months.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      <div>
        <button
          onClick={(event) => {
            event.preventDefault();
            increaseMonth();
          }}
          disabled={nextMonthButtonDisabled}
          // className="border-2 rounded-sm date-button disabled:opacity-20"
          className="color-black font-bold disabled:opacity-20 -mr-1"
        >
          <ChevronRightIcon className="size-4 stroke-2" />
        </button>
        <button
          onClick={(event) => {
            event.preventDefault();
            increaseYear();
          }}
          disabled={nextYearButtonDisabled}
          className="color-black font-bold disabled:opacity-20"

          //   className="border-2 rounded-sm date-button disabled:opacity-20"
        >
          <ChevronDoubleRightIcon className="size-4 stroke-2" />
        </button>
      </div>
    </div>
  );
}

function customYearHeader({
  monthDate,
  decreaseYear,
  increaseYear,
  prevYearButtonDisabled,
  nextYearButtonDisabled,
}: CustomHeaderProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
      }}
    >
      <button
        onClick={(event) => {
          event.preventDefault();
          decreaseYear();
        }}
        disabled={prevYearButtonDisabled}
        className="color-black font-bold disabled:opacity-20"
        // className="border-2 rounded-sm date-button disabled:opacity-20"
      >
        <ChevronDoubleLeftIcon className="size-4" />
      </button>
      <div className="mx-4 rounded-sm px-4 mt-1">{monthDate.getFullYear()}</div>
      <button
        onClick={(event) => {
          event.preventDefault();
          increaseYear();
        }}
        disabled={nextYearButtonDisabled}
        className="color-black font-bold disabled:opacity-20"
        // className="border-2 rounded-sm date-button disabled:opacity-20"
      >
        <ChevronDoubleRightIcon className="size-4" />
      </button>
    </div>
  );
}
