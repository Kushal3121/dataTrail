import { Listbox } from '@headlessui/react';
import { CheckIcon, ChevronUpDownIcon } from '@heroicons/react/20/solid';

const FileIcon = () => (
  <svg
    className='w-4 h-4 text-gray-400'
    fill='none'
    stroke='currentColor'
    strokeWidth='1.5'
    viewBox='0 0 24 24'
    xmlns='http://www.w3.org/2000/svg'
  >
    <path
      strokeLinecap='round'
      strokeLinejoin='round'
      d='M3 7.5A2.5 2.5 0 015.5 5h6.379a2.5 2.5 0 011.768.732l4.121 4.121A2.5 2.5 0 0118.5 12v6.5A2.5 2.5 0 0116 21H5.5A2.5 2.5 0 013 18.5V7.5z'
    />
  </svg>
);

const FileDropdown = ({ files, selected, setSelected }) => {
  return (
    <div className='w-full'>
      <Listbox value={selected} onChange={setSelected}>
        <div className='relative'>
          <Listbox.Button className='relative w-full cursor-pointer rounded-lg bg-white py-3 pl-4 pr-10 text-left shadow focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-800'>
            <span className='block truncate'>
              {selected || 'Select uploaded file'}
            </span>
            <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3'>
              <ChevronUpDownIcon
                className='h-5 w-5 text-gray-400'
                aria-hidden='true'
              />
            </span>
          </Listbox.Button>

          <Listbox.Options className='absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm'>
            {files.length === 0 ? (
              <Listbox.Option
                value=''
                disabled
                className='text-gray-400 cursor-not-allowed px-4 py-2'
              >
                No files uploaded
              </Listbox.Option>
            ) : (
              files.map((file) => (
                <Listbox.Option
                  key={file}
                  value={file}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? 'bg-indigo-100 text-indigo-900' : 'text-gray-900'
                    }`
                  }
                >
                  {({ selected }) => (
                    <>
                      <span className='flex items-center gap-2 truncate'>
                        <FileIcon />
                        <span
                          className={`${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {file}
                        </span>
                      </span>
                      {selected && (
                        <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-indigo-600'>
                          <CheckIcon className='h-5 w-5' aria-hidden='true' />
                        </span>
                      )}
                    </>
                  )}
                </Listbox.Option>
              ))
            )}
          </Listbox.Options>
        </div>
      </Listbox>
    </div>
  );
};

export default FileDropdown;
