
import { useNavigate} from "react-router-dom"
import { useEffect, useState } from 'react'
import axios from 'axios';
import Select from 'react-select';

export default function Register() {
    const navigate = useNavigate();
    const [username, setUserName] = useState('');
    // const [tickers,setTickers] = useState([]);
    const [selectedOption, setSelectedOption] = useState(null);
    const [optionsArray,setOptionsArray] = useState();
    async function SubmitForm(ev){
        ev.preventDefault();
        const url = 'http://127.0.0.1:8000/api/register'
        const {data} = await axios.post(url,{username,tickers:selectedOption.map(option => option.value)},{
            withCredentials:true,
        });
console.log(data)
        if(data.error){
            alert(data.error);
            return;
        }
        alert("user registered successfully")
    }


    async function GetTickers(keywords) {
        try {
          const response = await axios.get(
            'https://financialmodelingprep.com/api/v3/search-ticker',
            {
              params: {
                query: keywords,
                limit: 10,
                apikey:'mLA42nnsH47GzrRX6MHuQ1kgCNjszl9K'
              },
            }
          );
    
          const searchtickers = response.data;
    console.log(searchtickers)
          // Transform the data into the format required by react-select
          const formattedOptions = searchtickers.map(ticker => ({
            value: ticker.symbol,
            label: ticker.name +" (" +ticker.symbol +" )",
          }));
    
          setOptionsArray(formattedOptions);
          console.log(formattedOptions);
        } catch (error) {
          console.error('Error fetching tickers:', error);
        }
      }

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption);
    console.log('Selected option:', selectedOption);
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register USer
          </h2>
        </div>
        

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={SubmitForm} >
            <div className="flex items-center justify-between">
            
             
            </div>

            <div className="flex items-center justify-between">
              <label htmlFor="firstname" className="block text-sm font-medium leading-0 text-gray-900">
                username
              </label>
            </div>
            <div>
              <div className="mt-2">
                <input
                  id="firstname"
                  name="firstname"
                  type="text"
                  autoComplete="firstname"
                    value={username}
                    onChange={(ev) => setUserName(ev.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

<div className="flex items-center justify-between">
              <label htmlFor="firstname" className="block text-sm font-medium leading-0 text-gray-900">
                search tickers
              </label>
            </div>
            <div>
              <div className="mt-2">
                <input
                  id="tickers"
                  name="tickers"
                  type="text"
                  autoComplete="tickers"
                    onChange={(ev) => GetTickers(ev.target.value)}
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <Select
      isMulti
        value={selectedOption}
        onChange={handleChange}
        options={optionsArray}
      />

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign up
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Already a member?{' '}
            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
              Sign in here
            </a>
          </p>
        </div>
      </div>
    </>
  )
}
