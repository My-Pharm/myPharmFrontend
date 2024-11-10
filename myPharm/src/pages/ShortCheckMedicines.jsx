import React from "react";
import "bootstrap/dist/css/bootstrap.css";
import Table from "react-bootstrap/Table";

function ShortCheckMedicines({ medicines }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Table bordered hover>
        <thead>
          <tr>
            <th>번호</th>
            <th>약품명</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((medicine, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{medicine.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
}

ShortCheckMedicines.defaultProps = {
  medicines: [],
};

export default ShortCheckMedicines;
