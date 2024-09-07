// src/styles/reactSelectStyles.js

export const customSelectStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: '#3B3B3B',
      borderColor: '#3B3B3B',
      color: 'white',
      padding: '6px',
      borderRadius: '0.375rem',
      minHeight: '40px',
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#3B3B3B',
      },
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: '#3B3B3B',
      borderRadius: '0.375rem',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#2563EB' : state.isFocused ? '#4B5563' : '#3B3B3B',
      color: 'white',
      padding: '10px',
      '&:hover': {
        backgroundColor: '#4B5563',
      },
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#9CA3AF',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: 'white',
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    input: (provided) => ({
      ...provided,
      color: 'white',
    }),
  };
  