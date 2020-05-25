import React, { useState } from "react";
import Conditions from "../Conditions/Conditions";
import classes from "./Forecast.module.css";
import Iframe from "react-iframe";

const Forecast = () => {
  let [city, setCity] = useState("");
  let [unit, setUnit] = useState("imperial");
  let [responseObj, setResponseObj] = useState({});
  let [error, setError] = useState(false);
  let [loading, setLoading] = useState(false);
  let [tidesResponseObj, setTidesResponseObj] = useState({});
  let [stateUs, setStateus] = useState({});

  function getForecast(e) {
    e.preventDefault();

    if (city.length === 0) {
      return setError(true);
    }

    // Clear state in preparation for new data
    setError(false);
    setResponseObj({});
    setTidesResponseObj({});
    setStateus({});

    setLoading(true);

    let uriEncodedCity = encodeURIComponent(city);
    fetch(
      `https://community-open-weather-map.p.rapidapi.com/weather?units=${unit}&q=${uriEncodedCity}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "community-open-weather-map.p.rapidapi.com",
          "x-rapidapi-key": "9a986da27dmsh2560a5427d0e4dap168ab2jsndfb75fdfbcc9"
        }
      }
    )
      .then(response => response.json())
      .then(response => {
        if (response.cod !== 200) {
          throw new Error();
        }
        setResponseObj(response);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
        console.log(err.message);
      });
    fetch(
      "https://tides.p.rapidapi.com/tides?interval=60&duration=1440&/city,stateUs",
      {
        method: "GET",
        headers: {
          "x-rapidapi-host": "tides.p.rapidapi.com",
          "x-rapidapi-key": "a508b6d096msh34b71692c732b2fp1695e3jsn60240ba9b92b"
        }
      }
    )
      .then(tidesResponse => tidesResponse.json())
      .then(tidesResponse => {
        if (tidesResponse.cod !== 200) {
          throw new Error();
        }
        console.log(tidesResponse);
        setTidesResponseObj(tidesResponse);
        setLoading(false);
      })
      .catch(err => {
        setError(true);
        setLoading(false);
        console.log(err.message);
      });
  }
  return (
    // JSX code will go here
    <div>
      <h2>Find Current Weather Conditions</h2>

      <Iframe
        url="https://maps.aerisapi.com/kTs99InLpuIR9tjNfbQDN_XXTRKDE6B8tkm4AYoZgC13icvDuZrwVbcWbwvTAS/flat-dk,water-depth,radar:blend(overlay),admin-cities-dk/500x500/27.5278,-82.8809,6/current.png"
        width="450px"
        height="450px"
        id="myId"
        className="Weathermap"
        display="initial"
        position="relative"
      />

      <form onSubmit={getForecast}>
        <input
          type="text"
          placeholder="Enter City"
          maxLength="50"
          className={classes.textInput}
          value={city}
          onChange={e => setCity(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter State"
          maxLength="50"
          className={classes.textInput}
          value={stateUs}
          onChange={e => setStateus(e.target.value)}
        />
        <label>
          <input
            type="radio"
            name="units"
            checked={unit === "imperial"}
            value="imperial"
            onChange={e => setUnit(e.target.value)}
            className={classes.Radio}
          />
          Fahrenheit
        </label>
        <label>
          <input
            type="radio"
            name="units"
            checked={unit === "metric"}
            value="metric"
            onChange={e => setUnit(e.target.value)}
            className={classes.Radio}
          />
          Celcius
        </label>
        <button type="submit">Get Forecast</button>
      </form>
      <Conditions
        responseObj={responseObj}
        error={error} //new
        loading={loading} //new
        tidesResponseObj={tidesResponseObj}
      />
    </div>
  );
};
export default Forecast;
