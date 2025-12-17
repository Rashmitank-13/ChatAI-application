import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface TableViewProps {
  data: any[];
}

const TableView: React.FC<TableViewProps> = ({ data }) => {
  const { theme } = useTheme();

  if (!data || data.length === 0) {
    return null;
  }

  const columns = Object.keys(data[0]);

  return (
    <div className="overflow-x-auto rounded-lg border my-2">
      <table className={`min-w-full border-collapse ${
        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
      }`}>
        <thead>
          <tr className={`${
            theme === 'dark' ? 'bg-gray-700 border-b border-gray-600' : 'bg-gray-100 border-b border-gray-300'
          }`}>
            {columns.map((column) => (
              <th
                key={column}
                className={`px-4 py-3 text-left text-sm font-semibold ${
                  theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                }`}
              >
                {column.charAt(0).toUpperCase() + column.slice(1).replace(/([A-Z])/g, ' $1').trim()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`${
                theme === 'dark'
                  ? 'border-b border-gray-700 hover:bg-gray-700/50'
                  : 'border-b border-gray-200 hover:bg-gray-50'
              } transition-colors`}
            >
              {columns.map((column) => (
                <td key={column} className="px-4 py-3 text-sm">
                  {typeof row[column] === 'number'
                    ? column === 'price'
                      ? `$${row[column].toFixed(2)}`
                      : row[column].toLocaleString()
                    : String(row[column])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TableView;

