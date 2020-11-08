import React from 'react';
import { Table } from 'reactstrap';

const SimpleTable = ({ headers, elementsRows }) => (
  <Table striped borderless responsive>
    <thead>
      <tr>
        {headers.map((header) => (
          <th key={header}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {elementsRows.map((row, i) => (
        <tr key={i}>
          {row.map((element) => (
            <td key={element}>{element}</td>
          ))}
        </tr>
      ))}
    </tbody>
  </Table>
);

export default SimpleTable;
