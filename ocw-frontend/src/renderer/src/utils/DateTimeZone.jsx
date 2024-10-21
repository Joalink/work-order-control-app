import React, { useState, useEffect } from 'react';

function DateTimeZone() {
  const [dateTime, setDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div>
      <p>Fecha y Hora actuales:</p>
      <p>{dateTime.toLocaleDateString()} {dateTime.toLocaleTimeString()}</p>
    </div>
  );
}

export default DateTimeZone;