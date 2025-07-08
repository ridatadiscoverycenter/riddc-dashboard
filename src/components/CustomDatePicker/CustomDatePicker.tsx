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

interface ReactDatePickerCustomHeaderProps {
  customHeaderCount: number;
  monthDate: Date;
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
  visibleYearsRange?: {
    startYear: number;
    endYear: number;
  };
}

type DatePickerProps = {
  selected: Date;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  dateBounds: { startDate: Date; endDate: Date };
  mode: 'year' | 'date';
};

export function CustomDatePicker({ selected, setDate, dateBounds, mode }: DatePickerProps) {
  return (
    <DatePicker
      renderCustomHeader={mode === 'date' ? customDateHeader : customYearHeader}
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
  monthDate,
  decreaseMonth,
  increaseMonth,
  decreaseYear,
  increaseYear,
  prevMonthButtonDisabled,
  prevYearButtonDisabled,
  nextMonthButtonDisabled,
  nextYearButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
  //   return (
  //     <div className="mb-3">
  //       <button
  //         className={'react-datepicker__navigation react-datepicker__navigation--previous'}
  //         onClick={(event) => {
  //           event.preventDefault();
  //           decreaseMonth();
  //         }}
  //         disabled={prevMonthButtonDisabled}
  //         style={{
  //           visibility: customHeaderCount === 0 ? 'visible' : 'hidden',
  //           opacity: prevMonthButtonDisabled ? 0.1 : 1.0,
  //         }}
  //       >
  //         <ChevronLeftIcon className="size-4" />
  //       </button>
  //       <button
  //         className={'react-datepicker__navigation react-datepicker-year'}
  //         onClick={(event) => {
  //           event.preventDefault();
  //           decreaseYear();
  //         }}
  //         style={{
  //           visibility: customHeaderCount === 0 ? 'visible' : 'hidden',
  //           opacity: prevYearButtonDisabled ? 0.1 : 1.0,
  //         }}
  //         disabled={prevYearButtonDisabled}
  //       >
  //         <ChevronDoubleLeftIcon className="size-4" />
  //       </button>
  //       <span className="react-datepicker__current-month">
  //         {monthDate.toLocaleString('en-US', {
  //           month: 'long',
  //           year: 'numeric',
  //         })}
  //       </span>
  //       <button
  //         className={'react-datepicker__navigation react-datepicker__navigation--next'}
  //         onClick={(event) => {
  //           event.preventDefault();
  //           increaseMonth();
  //         }}
  //         style={{
  //           visibility: customHeaderCount === 0 ? 'visible' : 'hidden',
  //           opacity: nextMonthButtonDisabled ? 0.1 : 1.0,
  //         }}
  //         disabled={nextMonthButtonDisabled}
  //       >
  //         <ChevronRightIcon className="size-4" />
  //       </button>
  //       <button
  //         className={
  //           'react-datepicker__navigation react-datepicker__navigation--next react-datepicker-year'
  //         }
  //         onClick={(event) => {
  //           event.preventDefault();
  //           increaseYear();
  //         }}
  //         style={{
  //           visibility: customHeaderCount === 0 ? 'visible' : 'hidden',
  //           opacity: nextYearButtonDisabled ? 0.1 : 1.0,
  //         }}
  //         disabled={nextYearButtonDisabled}
  //       >
  //         <ChevronDoubleRightIcon className="size-4" />
  //       </button>
  //     </div>
  //   );
  return (
    <div
      style={{
        margin: 10,
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
        className="border-2 rounded-sm date-button"
      >
        <ChevronDoubleLeftIcon className="size-4" />
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          decreaseMonth();
        }}
        disabled={prevMonthButtonDisabled}
        className="border-2 rounded-sm date-button"
      >
        <ChevronLeftIcon className="size-4" />
      </button>
      <div className="mx-4 border-2 rounded-sm border-solid px-4 date-button">
        {monthDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          increaseMonth();
        }}
        disabled={nextMonthButtonDisabled}
        className="border-2 rounded-sm date-button"
      >
        <ChevronRightIcon className="size-4" />
      </button>
      <button
        onClick={(event) => {
          event.preventDefault();
          increaseYear();
        }}
        disabled={nextYearButtonDisabled}
        className="border-2 rounded-sm date-button"
      >
        <ChevronDoubleRightIcon className="size-4" />
      </button>
    </div>
  );
}

function customYearHeader({
  monthDate,
  decreaseYear,
  increaseYear,
  prevYearButtonDisabled,
  nextYearButtonDisabled,
}: ReactDatePickerCustomHeaderProps) {
  return (
    <div
      style={{
        margin: 10,
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
        className="border-2 rounded-sm date-button"
      >
        <ChevronDoubleLeftIcon className="size-4" />
      </button>
      <div className="mx-4 border-2 rounded-sm border-solid px-4 date-button">
        {monthDate.getFullYear()}
      </div>
      <button
        onClick={(event) => {
          event.preventDefault();
          increaseYear();
        }}
        disabled={nextYearButtonDisabled}
        className="border-2 rounded-sm date-button"
      >
        <ChevronDoubleRightIcon className="size-4" />
      </button>
    </div>
  );
}
