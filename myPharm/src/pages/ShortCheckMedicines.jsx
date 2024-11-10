// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.css";
// import Table from "react-bootstrap/Table";

// function ShortCheckMedicines({ medicines }) {
//   const [alerts, setAlerts] = useState({});
//   const API_BASE_URL = "http://localhost:8080";
//   const ACCESS_TOKEN = "eyJ0eXBlIjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWQiOjM3ODUyNTY0NjksImlhdCI6MTczMTE3MTY1OSwiZXhwIjoxNzMxNzc2NDU5fQ.HjXkr1XHjQbMgc2Sqjv1m6J94NjUO88vPlOJGkrYXDM";
//   //const ACCESS_TOKEN = localStorage.getItem('accessToken');
//   console.log(JSON.stringify( medicines ))
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [response1, response2] = await Promise.all([
//           fetch(`${API_BASE_URL}/alert-once`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//               Authorization: `Bearer ${ACCESS_TOKEN}`,
//             },
//             body: JSON.stringify(medicines),
//           }),
//           fetch(`${API_BASE_URL}/interaction/check-once`, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//               Accept: "application/json",
//               Authorization: `Bearer ${ACCESS_TOKEN}`,
//             },
//             body: JSON.stringify(medicines),
//           }),
//         ]);

//         if (response1.ok && response2.ok) {
//           const data1 = await response1.json();
//           const data2 = await response2.json();
//           const combinedData = [...data1, ...data2];

//           // Group data by typeName, keeping the entry with the longest contents if `medicineName` and `typeName` are the same
//           const groupedAlerts = combinedData.reduce((acc, item) => {
//             const { typeName, medicineName, contents } = item;
//             const key = `${medicineName}-${typeName}`;

//             // Check if the medicine and typeName combination already exists
//             if (!acc[key] || acc[key].contents.length < contents.length) {
//               acc[key] = item; // Keep the entry with the longest contents
//             }
//             return acc;
//           }, {});

//           // Transform groupedAlerts back into the desired format, grouped by typeName
//           const formattedAlerts = Object.values(groupedAlerts).reduce((acc, item) => {
//             const { typeName } = item;
//             if (!acc[typeName]) {
//               acc[typeName] = [];
//             }
//             acc[typeName].push(item);
//             return acc;
//           }, {});

//           setAlerts(formattedAlerts);
//         } else {
//           console.error("Failed to fetch alerts:", response1.status, response2.status);
//         }
//       } catch (error) {
//         console.error("Error fetching alerts:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div>
//       {Object.keys(alerts).map((type) => (
//         <div key={type} className="my-4">
//           <h4>{type}</h4>
//           <Table striped bordered hover>
//             <thead>
//               <tr>
//                 <th>Medicine Name</th>
//                 <th>Contents</th>
//               </tr>
//             </thead>
//             <tbody>
//               {alerts[type].map((alert, index) => (
//                 <tr key={index}>
//                   <td>{alert.medicineName}</td>
//                   <td>{alert.contents}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </Table>
//         </div>
//       ))}
//     </div>
//   );
// }

// export default ShortCheckMedicines;

import React, { useEffect, useState } from 'react';
import { Card, Table, Alert } from 'react-bootstrap'; // react-bootstrap 컴포넌트 import

export default function ShortCheckMedicines({ medicines }) {
  const [alerts, setAlerts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_BASE_URL = 'http://localhost:8080';
  const ACCESS_TOKEN = "eyJ0eXBlIjoiYWNjZXNzIiwiYWxnIjoiSFMyNTYifQ.eyJ1c2VySWQiOjM3ODUyNTY0NjksImlhdCI6MTczMTE3MTY1OSwiZXhwIjoxNzMxNzc2NDU5fQ.HjXkr1XHjQbMgc2Sqjv1m6J94NjUO88vPlOJGkrYXDM";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [response1, response2] = await Promise.all([
          fetch(`${API_BASE_URL}/alert-once`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(medicines),
          }),
          fetch(`${API_BASE_URL}/interaction/check-once`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              Authorization: `Bearer ${ACCESS_TOKEN}`,
            },
            body: JSON.stringify(medicines),
          }),
        ]);

        if (response1.ok && response2.ok) {
          const data1 = await response1.json();
          const data2 = await response2.json();
          const combinedData = [...data1, ...data2];

          const groupedAlerts = combinedData.reduce((acc, item) => {
            const { typeName, medicineName, contents } = item;
            const key = `${medicineName}-${typeName}`;

            if (!acc[key] || acc[key].contents.length < contents.length) {
              acc[key] = item;
            }
            return acc;
          }, {});

          const formattedAlerts = Object.values(groupedAlerts).reduce((acc, item) => {
            const { typeName } = item;
            if (!acc[typeName]) {
              acc[typeName] = [];
            }
            acc[typeName].push(item);
            return acc;
          }, {});

          setAlerts(formattedAlerts);
        } else {
          setError('Failed to fetch alerts. Please try again later.');
        }
      } catch (error) {
        setError('An error occurred while fetching alerts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [medicines]);

  if (isLoading) {
    return <div>Loading...</div>; // 로딩 중일 때
  }

  if (error) {
    return (
      <Alert variant="danger">
        <Alert.Heading>Error</Alert.Heading>
        <p>{error}</p>
      </Alert>
    ); // 에러 발생 시
  }

  return (
    <div className="space-y-6">
      {Object.keys(alerts).map((type) => (
        <Card key={type}>
          <Card.Header>
            <Card.Title>{type}</Card.Title>
            <Card.Text>Medicine alerts and interactions</Card.Text>
          </Card.Header>
          <Card.Body>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Medicine Name</th>
                  <th>Contents</th>
                </tr>
              </thead>
              <tbody>
                {alerts[type].map((alert, index) => (
                  <tr key={index}>
                    <td>{alert.medicineName}</td>
                    <td>{alert.contents}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}
