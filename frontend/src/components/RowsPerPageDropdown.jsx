import { Listbox } from '@headlessui/react';
import { ChevronUpDownIcon } from '@heroicons/react/20/solid';

const options = [5, 10, 15, 20];

const RowsPerPageDropdown = ({ value, onChange }) => {
  return (
    <div className='relative w-32'>
      <Listbox value={value} onChange={onChange}>
        <Listbox.Button className='w-full cursor-pointer rounded-md border px-3 py-2 bg-white text-sm text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex justify-between items-center'>
          <span>{value} rows</span>
          <ChevronUpDownIcon className='h-4 w-4 text-gray-400' />
        </Listbox.Button>
        <Listbox.Options className='absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 focus:outline-none'>
          {options.map((opt) => (
            <Listbox.Option
              key={opt}
              value={opt}
              className={({ active }) =>
                `cursor-pointer px-4 py-2 text-sm ${
                  active ? 'bg-indigo-100 text-indigo-700' : 'text-gray-800'
                }`
              }
            >
              {opt} rows
            </Listbox.Option>
          ))}
        </Listbox.Options>
      </Listbox>
    </div>
  );
};

export default RowsPerPageDropdown;
