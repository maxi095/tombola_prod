import React from 'react';
import './Table.css';

const Table = ({ headers, rows, renderRowActions }) => {
  return (
    <table className="standard-table">
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index}>{header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index) => (
          <tr key={index}>
            {Object.values(row).map((cell, idx) => (
              <td key={idx}>{cell}</td>
            ))}
            {renderRowActions && <td>{renderRowActions(row)}</td>}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
