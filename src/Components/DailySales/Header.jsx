import { Button, DatePicker } from "@heroui/react";
import { useState, useEffect } from 'react';
import { parseDate, today, getLocalTimeZone } from "@internationalized/date";
import '../../style/dailySales.css';

const Header = ({ dateFilter, setDateFilter, searchTerm, setSearchTerm, title, icon, activeTab }) => {

  const [showCalendar, setShowCalendar] = useState(false);

  const getCurrentDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    const formattedDate = searchTerm.toLocaleDateString('es-ES', options);
    return formattedDate
      .charAt(0).toUpperCase() + formattedDate.slice(1)
        .replace(/(\s[a-z])/g, char => char.toUpperCase());
  };

  useEffect(() => {
    if (dateFilter === 'today') {
      const todayDate = new Date();
      todayDate.setHours(0, 0, 0, 0);
      setSearchTerm(todayDate);
    } else if (dateFilter === 'yesterday') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);
      setSearchTerm(yesterday);
    }
  }, [dateFilter]);

  const handleDateChange = (calendarDate) => {
    const jsDate = new Date(calendarDate.year, calendarDate.month - 1, calendarDate.day);
    jsDate.setHours(0, 0, 0, 0);
    setSearchTerm(jsDate);
    setShowCalendar(false);
  };

  // Convert JS Date to CalendarDate for DatePicker
  const getCalendarDate = () => {
    if (searchTerm instanceof Date) {
      return parseDate(searchTerm.toISOString().split('T')[0]);
    }
    return today(getLocalTimeZone());
  };

  return (
    <div className="daily-sales-header-container">
      <div className="daily-sales-container-icon-title">
        <i className={`pi ${icon} daily-sales-icon`}></i>
        <div>
          <h2 className="daily-sales-title">{title}</h2>
          <p className="daily-sales-date-text">{getCurrentDate()}</p>
        </div>
      </div>

      <div className="daily-sales-container-buttons">
        <Button
          color={dateFilter === 'today' ? 'primary' : 'default'}
          variant={dateFilter === 'today' ? 'solid' : 'bordered'}
          radius="full"
          size="sm"
          onPress={() => {
            setDateFilter('today');
            setShowCalendar(false);
          }}
        >
          Hoy
        </Button>
        <Button
          color={dateFilter === 'yesterday' ? 'primary' : 'default'}
          variant={dateFilter === 'yesterday' ? 'solid' : 'bordered'}
          radius="full"
          size="sm"
          onPress={() => {
            setDateFilter('yesterday');
            setShowCalendar(false);
          }}
        >
          Ayer
        </Button>
        <Button
          color={dateFilter === 'custom' ? 'primary' : 'default'}
          variant={dateFilter === 'custom' ? 'solid' : 'bordered'}
          radius="full"
          size="sm"
          onPress={() => {
            setDateFilter('custom');
            setShowCalendar(true);
          }}
        >
          Fecha Personalizada
        </Button>

        {showCalendar && (
          <div className="daily-sales-calendar-wrapper">
            <DatePicker
              label="Seleccionar fecha"
              value={getCalendarDate()}
              onChange={handleDateChange}
              maxValue={today(getLocalTimeZone())}
              className="max-w-xs"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Header;
