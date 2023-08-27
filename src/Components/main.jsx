import React from "react";
import { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import Select from "react-select";
import cities from "../cities";
import "react-datepicker/dist/react-datepicker.css";
import Loader from "./loader";

const Main = () => {
  const cityOptions = cities.map((city) => ({
    value: city,
    label: city + " Havalimanı",
  }));
  const [isLoading, setIsLoading] = useState(false);
  const [filteredDepartureFlights, setFilteredDepartureFlights] = useState([]);
  const [filteredReturnFlights, setFilteredReturnFlights] = useState(
    ([].length = 0)
  );
  const [showInfo, setShowInfo] = useState(false);
  const [originCity, setOriginCity] = useState(null);
  const [destinationCity, setDestinationCity] = useState(null);
  const today = new Date();
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [showSecondDatePicker, setShowSecondDatePicker] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [APIError, setAPIError] = useState(null);

  const handleCheckBox = (e) => {
    setShowSecondDatePicker(null);
    setShowSecondDatePicker(e.target.checked);
  };
  const handleOriginCityChange = (selectedOption) => {
    setOriginCity(selectedOption.value);
  };

  const handleDestinationCityChange = (selectedOption) => {
    setDestinationCity(selectedOption.value);
  };
  const formatDate = (date) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    const formattedDate = new Date(date).toLocaleDateString("tr-TR", options);
    return formattedDate;
  };
  const fetchFlights = () => {
    setIsLoading(true);
    setTimeout(() => {
      fetch(`${process.env.REACT_APP_API_URL}/flights`)
        .then((response) => response.json())
        .then((data) => {
          const filteredDepartureFlights = data.filter(
            (flight) =>
              flight.origin === originCity &&
              flight.destination === destinationCity &&
              flight.date === formatDate(startDate)
          );
          setFilteredDepartureFlights(filteredDepartureFlights);
          if (endDate && showSecondDatePicker) {
            const filteredReturnFlights = data.filter(
              (flight) =>
                flight.origin === destinationCity &&
                flight.destination === originCity &&
                flight.date === formatDate(endDate)
            );
            setFilteredReturnFlights(filteredReturnFlights);
          }
          setIsLoading(false);
          setShowInfo(true);
        })
        .catch((err) => {
          console.error("API isteği başarısız", err);
          setAPIError("Sunucu ile bağlantı hatası.");
          setIsLoading(false);
        });
    }, 2000);
  };
  const sortByDepartureTime = (flights) => {
    const sortedFlights = [...flights].sort((a, b) =>
      a.departureTime.localeCompare(b.departureTime)
    );
    setFilteredDepartureFlights(sortedFlights);
    if (filteredReturnFlights > 0) setFilteredReturnFlights(sortedFlights);
  };
  const sortByLandingTime = (flights) => {
    const sortedFlights = [...flights].sort((a, b) =>
      a.landingTime.localeCompare(b.landingTime)
    );
    setFilteredDepartureFlights(sortedFlights);
    if (filteredReturnFlights > 0) setFilteredReturnFlights(sortedFlights);
  };
  const sortByDuration = (flights) => {
    const sortedFlights = [...flights].sort((a, b) =>
      a.landingTime.localeCompare(b.landingTime)
    );
    setFilteredDepartureFlights(sortedFlights);
    if (filteredReturnFlights > 0) setFilteredReturnFlights(sortedFlights);
  };
  const sortByPrice = (flights) => {
    const sortedFlights = [...flights].sort((a, b) => a.price - b.price);
    setFilteredDepartureFlights(sortedFlights);
    if (filteredReturnFlights > 0) setFilteredReturnFlights(sortedFlights);
  };

  return (
    <>
      <div>
        <div
          className="select-container"
          style={{
            display: "flex",
            margin: "20px",
            gap: "30px",
          }}
        >
          <span style={{ marginTop: "16px" }}>Nereden ? </span>
          <Select
            id="From"
            styles={{
              control: (provided) => ({
                ...provided,
                width: 200,
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                outline: "none",
                borderColor: "gray",
                "&:hover": {
                  borderColor: "gray",
                },
              }),
            }}
            options={cityOptions.filter(
              (option) => option.value !== destinationCity
            )}
            value={cityOptions.find((option) => option.value === originCity)}
            onChange={handleOriginCityChange}
            isSearchable={true}
            placeholder="Şehir seçiniz..."
          />
          <span style={{ marginTop: "16px" }}>Nereye ? </span>
          <Select
            className="departureCity"
            styles={{
              control: (provided) => ({
                ...provided,
                width: 200,
                marginTop: 8,
                display: "flex",
                alignItems: "center",
                outline: "none",
                borderColor: "gray",
                "&:hover": {
                  borderColor: "gray",
                },
              }),
            }}
            options={cityOptions.filter(
              (option) => option.value !== originCity
            )}
            value={cityOptions.find(
              (option) => option.value === destinationCity
            )}
            onChange={handleDestinationCityChange}
            isSearchable={true}
            placeholder="Şehir seçiniz..."
          />

          <div
            className="Date"
            style={{
              display: "flex",
              margin: 8,
              justifyContent: "space-between",
            }}
          >
            <span style={{ margin: "8px 24px" }}>Gidiş Tarihi </span>
            <DatePicker
              className="startDay"
              id="startDay"
              dateFormat={"d.M.Y"}
              placeholderText="Ne zaman ?"
              selected={startDate}
              minDate={today}
              maxDate={endDate}
              onChange={(startDate) => setStartDate(startDate)}
              autoComplete="off"
            />
            <span style={{ margin: 8 }}>Gidiş-Geliş</span>
            <input
              className="checkbox"
              type="checkbox"
              checked={showSecondDatePicker}
              onChange={handleCheckBox}
            />
            <span style={{ margin: "8px 24px" }}>Geri Dönüş Tarihi</span>
            <DatePicker
              className="endDay"
              id="endDay"
              dateFormat={"d.M.Y"}
              placeholderText="Geri Donus"
              minDate={startDate}
              selected={endDate}
              onChange={(endDate) => setEndDate(endDate)}
              disabled={!showSecondDatePicker}
              autoComplete="off"
            />

            <button
              className="search-btn"
              disabled={
                !startDate ||
                !originCity ||
                !destinationCity ||
                (showSecondDatePicker && !endDate)
              }
              onClick={() => {
                setShowInfo(false);
                setShowErrorMessage(true);
                fetchFlights();
                setAPIError(null);
              }}
            >
              Uçuş Ara
            </button>
          </div>
        </div>
        <h2>{APIError}</h2>
        {(filteredDepartureFlights.length > 0 ||
          filteredReturnFlights.length > 0) && (
          <div className="btns-container">
            <button
              className="filter-btns"
              onClick={() => sortByDepartureTime(filteredDepartureFlights)}
            >
              Kalkış Saatine Göre Sırala
            </button>
            <button
              className="filter-btns"
              onClick={() => sortByLandingTime(filteredDepartureFlights)}
            >
              İniş Saatine Göre Sırala
            </button>
            <button
              className="filter-btns"
              onClick={() => sortByDuration(filteredDepartureFlights)}
            >
              Uçuş Süresine Göre Sırala
            </button>
            <button onClick={() => sortByPrice(filteredDepartureFlights)}>
              Fiyata Göre Sırala(En Ucuz)
            </button>
          </div>
        )}
      </div>
      {isLoading && startDate && <Loader />}
      <div className="flights-container">
        {!isLoading &&
          showInfo &&
          showErrorMessage &&
          filteredDepartureFlights.length === 0 && (
            <h2>Belirttiğiniz Tarihlerde Gidiş Uçuşu Bulunamadı.</h2>
          )}
        {showInfo && filteredDepartureFlights.length > 0 ? (
          <>
            <h2>Gidiş</h2>
            <h2>Uçuş Bilgileri</h2>
            <ul>
              {filteredDepartureFlights.map((flight) => (
                <li className="flights-list" key={flight.id}>
                  <div className="flight-details">
                    <div className="flight-cities">
                      Uçuş {flight.origin} &#10132; {flight.destination}
                    </div>
                    <div className="flight-info">
                      <div>Kalkış Saati: {flight.departureTime}</div>
                      <div>Süre: {flight.duration}</div>
                      <div>Tahmini İniş Saati: {flight.landingTime}</div>
                    </div>
                    <div className="flight-price">Fiyat: {flight.price} TL</div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
        {showSecondDatePicker && !endDate && (
          <h2>Lütfen Dönüş Tarihini Seçiniz</h2>
        )}

        {showInfo &&
          showSecondDatePicker &&
          filteredReturnFlights.length === 0 && (
            <h2>Belirttiğiniz Tarihlerde Dönüş Uçuşu Bulunamadı.</h2>
          )}
        {showSecondDatePicker &&
        showInfo &&
        filteredReturnFlights.length > 0 ? (
          <>
            <h2>Dönüş</h2>
            <h2>Uçuş Bilgileri</h2>
            <ul>
              {filteredReturnFlights.map((flight) => (
                <li className="flights-list" key={flight.id}>
                  <div className="flight-details">
                    <div className="flight-cities">
                      Uçuş {flight.origin} &#10132; {flight.destination}
                    </div>
                    <div className="flight-info">
                      <div>Kalkış Saati: {flight.departureTime}</div>
                      <div>Süre: {flight.duration}</div>
                      <div>Tahmini İniş Saati: {flight.landingTime}</div>
                    </div>
                    <div className="flight-price">
                      Fiyat:
                      {flight.price} TL
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </div>
    </>
  );
};

export default Main;
