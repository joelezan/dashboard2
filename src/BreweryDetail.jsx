import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

function BreweryDetail() {
  const { breweryId } = useParams();
  const [brewery, setBrewery] = useState(null);

  useEffect(() => {
    const fetchBrewery = async () => {
      console.log(`Fetching brewery with ID: ${breweryId}`); // Log the ID being fetched
      const response = await fetch(`https://api.openbrewerydb.org/v1/breweries/${breweryId}`);
      if (!response.ok) {
        console.error('Failed to fetch brewery:', response.status);
        return;
      }
      const data = await response.json();
      setBrewery(data);
    };
    fetchBrewery();
  }, [breweryId]);

  return (
    brewery ? (
      <div>
        <h2>{brewery.name}</h2>
        <p>Type: {brewery.brewery_type}</p>
        <p>City: {brewery.city}</p>
        <p>State: {brewery.state}</p>
        <a href={brewery.website_url} target="_blank" rel="noopener noreferrer">Visit Website</a>
      </div>
    ) : (
      <p>Loading...</p>
    )
  );
}

export default BreweryDetail;
