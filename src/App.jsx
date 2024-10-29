import { useEffect, useState } from 'react';
import { Route, Routes, Link } from 'react-router-dom';
import { Chart, BarController, CategoryScale, LinearScale, BarElement } from 'chart.js';
import BreweryDetail from './BreweryDetail';
import './index.css';

// Register required Chart.js components
Chart.register(BarController, CategoryScale, LinearScale, BarElement);

function App() {
  const [city, setCity] = useState('');
  const [breweryType, setBreweryType] = useState('');
  const [breweryData, setBreweryData] = useState([]);
  const [message, setMessage] = useState('');
  const [totalBreweries, setTotalBreweries] = useState(0);
  const [showAbout, setShowAbout] = useState(false);

  useEffect(() => {
    if (breweryData.length) {
      setTotalBreweries(breweryData.length);
    }
  }, [breweryData]);

  const fetchBreweriesByCity = async (city, type) => {
    try {
      const response = await fetch(`https://api.openbrewerydb.org/v1/breweries?by_city=${city}${type ? `&by_type=${type}` : ''}`);
      const data = await response.json();
      if (data.length > 0) {
        setBreweryData(data);
        setMessage('');
      } else {
        setMessage("No breweries found in this city. Try a different one.");
        setBreweryData([]);
      }
    } catch (error) {
      setMessage("An error occurred while fetching data. Please try again.");
    }
  };

  const handleCitySubmit = (e) => {
    e.preventDefault();
    if (city) {
      fetchBreweriesByCity(city, breweryType);
    }
  };

  const generateChart = () => {
    const ctx = document.getElementById('breweryChart').getContext('2d');
    const postalCodeCount = breweryData.reduce((acc, brewery) => {
      acc[brewery.postal_code] = (acc[brewery.postal_code] || 0) + 1;
      return acc;
    }, {});

    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(postalCodeCount),
        datasets: [{
          label: 'Breweries by Postal Code',
          data: Object.values(postalCodeCount),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      },
      options: {
        scales: {
          y: { beginAtZero: true }
        }
      }
    });
  };

  useEffect(() => {
    if (breweryData.length > 0) {
      generateChart();
    }
  }, [breweryData]);

  return (
    <div>
      <div className='top'>
        <div className='left'>
          <h1>Welcome to Our Thirst Utopia</h1>
        </div>
        <div className='middle'>
          <Link to="/">Home</Link>
          <button onClick={() => setShowAbout(!showAbout)}>About</button>
        </div>
      </div>

      {showAbout ? (
        <div className="about">
          <h2>About This Website</h2>
          <p>We would love to help you search for breweries by zip code or city.</p>
          <button onClick={() => setShowAbout(false)}>Back to Home</button>
        </div>
      ) : (
        <div className='search-section'>
          <h2>Search for Breweries by City</h2>
          <form onSubmit={handleCitySubmit}>
            <input
              type="text"
              placeholder="Enter City Name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <select value={breweryType} onChange={(e) => setBreweryType(e.target.value)}>
              <option value="">All Types</option>
              <option value="micro">Micro</option>
              <option value="nano">Nano</option>
              <option value="regional">Regional</option>
              <option value="brewpub">Brewpub</option>
              <option value="large">Large</option>
              <option value="planning">Planning</option>
              <option value="contract">Contract</option>
              <option value="proprietor">Proprietor</option>
              <option value="closed">Closed</option>
            </select>
            <button type="submit">Search</button>
          </form>

          {message && <p>{message}</p>}

          <div className="stats">
            <h3>Total Breweries: {totalBreweries}</h3>
          </div>

          {breweryData.length > 0 && (
            <div>
              <canvas id="breweryChart" width="400" height="200"></canvas>
              <ul>
                {breweryData.map(brewery => (
                  <li key={brewery.id}>
                    <Link to={`/brewery/${brewery.id}`}>{brewery.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <Routes>
        <Route path="/" element={<div>Welcome! Please search for breweries.</div>} />
        <Route path="/brewery/:breweryId" element={<BreweryDetail />} />
      </Routes>
    </div>
  );
}

export default App;
