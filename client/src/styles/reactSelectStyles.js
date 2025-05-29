// src/styles/reactSelectStyles.js

export const customSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'white',
    borderColor: state.isFocused ? '#2563EB' : '#D1D5DB', // azul tailwind o gris claro
    color: '#111827', // text-gray-900
    borderRadius: '0.375rem', // rounded-md
    minHeight: '40px',
    boxShadow: state.isFocused ? '0 0 0 1px #2563EB' : 'none',
    '&:hover': {
      borderColor: '#2563EB',
    },
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#111827', // text-gray-900
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'white',
    borderRadius: '0.375rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    marginTop: '2px',
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected
      ? '#2563EB'
      : state.isFocused
      ? '#EFF6FF'
      : 'white',
    color: state.isSelected ? 'white' : '#111827',
    padding: '10px 12px',
    cursor: 'pointer',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#6B7280', // text-gray-400
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    color: '#9CA3AF', // gray-400
    '&:hover': {
      color: '#6B7280', // gray-500
    },
  }),
  indicatorSeparator: () => ({
    display: 'none',
  }),
  input: (provided) => ({
    ...provided,
    color: '#111827', // text-gray-900
  }),
};
