import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/attendance')
      .then(response => {
        setAttendance(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  return (
    <div>
      <h1>Attendance Log</h1>
      {attendance.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Names</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.date).toLocaleDateString()}</td>
                <td>{entry.names.join(', ')}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default App;
