import { coffeeOptions } from "../utils";
import { useState } from "react";
import Modal from "./Modal";
import Authentication from "./Authentication";
import { useAuth } from "../context/AuthContext";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";

export default function CoffeeForm(props) {
  const { isAuthentication } = props;
  const [showModal, setShowModal] = useState(false);
  const [selectedCoffee, setSelectedCoffee] = useState(null);
  const [showCoffeeTypes, setShowCoffeeTypes] = useState(false);
  // value prop in input can't be null
  const [coffeeCost, setCoffeeCost] = useState(0);
  const [hour, setHour] = useState(0);
  const [min, setMin] = useState(0);

  const { globalData, setGlobalData, globalUser } = useAuth();

  async function handleSubmitForm() {
    if (!isAuthentication) {
      setShowModal(true);
      return;
    }

    // guard clause that only submits the form if it is completed
    if (!selectedCoffee) {
      return;
    }

    // then create A new data object

    try {
      // create a duplicate of globalData but if null give it an empty object
      const newGlobalData = { ...(globalData || {}) };
      const nowTime = Date.now();

      // convert time into milliseconds
      const timeToSubtract = hour * 60 * 60 * 1000 + min * 60 * 1000;
      const timestamp = nowTime - timeToSubtract;
      // add the new data
      const newData = {
        name: selectedCoffee,
        cost: coffeeCost,
      };
      newGlobalData[timestamp] = newData;
      console.log(timestamp, selectedCoffee, coffeeCost);

      // update the global state
      setGlobalData(newGlobalData);

      //persist the data in the firebase firestore

      // access from the "users" collection globalUser - userid
      const userRef = doc(db, "users", globalUser.uid);
      // ,merge helps to join the data without overwritting it
      const res = await setDoc(
        userRef,
        { [timestamp]: newData },
        { merge: true }
      );

      setSelectedCoffee(null);
      setShowCoffeeTypes(false);
      setCoffeeCost(0);
      setHour(0);
      setMin(0);
    } catch (err) {
      console.log(err.message);
    }
  }

  function handleCloseModal() {
    setShowModal(false);
  }

  return (
    <>
      {showModal && (
        <Modal handleCloseModal={handleCloseModal}>
          <Authentication handleCloseModal={handleCloseModal} />
        </Modal>
      )}
      <div className="section-header">
        <i className="fa-solid fa-pen-fancy"></i>
        <h2>Start Your Coffee Tracking</h2>
      </div>
      <h4>Select your coffee</h4>
      <div className="coffee-grid">
        {coffeeOptions.slice(0, 5).map((option, optionIndex) => {
          return (
            <button
              onClick={() => {
                setSelectedCoffee(option.name);
                setShowCoffeeTypes(false);
              }}
              className={
                "button-card " +
                (option.name === selectedCoffee
                  ? " coffee-button-selected"
                  : " ")
              }
              key={optionIndex}
            >
              <h4>{option.name}</h4>
              <p>{option.caffeine} mg</p>
            </button>
          );
        })}
        <button
          onClick={() => {
            setShowCoffeeTypes(true);
            setSelectedCoffee(null);
          }}
          className={
            "button-card " +
            (showCoffeeTypes === true ? " coffee-button-selected" : " ")
          }
        >
          <h4>Options</h4>
        </button>
      </div>
      {/* if  showCoffeeTypes is true,i.e,Options is clicked; display coffee list*/}
      {showCoffeeTypes && (
        <select
          onChange={(e) => {
            // value is passed as {option.name} & SelectedCoffee button is highlighted
            setSelectedCoffee(e.target.value);
          }}
          id="coffee-list"
          name="coffee-list"
        >
          <option value={null}>Select type</option>
          {coffeeOptions.map((option, optionIndex) => {
            return (
              <option value={option.name} key={optionIndex}>
                {option.name} ({option.caffeine}mg)
              </option>
            );
          })}
        </select>
      )}
      <h4>Input Cost ($)</h4>
      <input
        className="w-full"
        type="number"
        value={coffeeCost}
        onChange={(e) => {
          setCoffeeCost(e.target.value);
        }}
        placeholder="5.06"
      />
      <h4>Time Since You Drank It</h4>
      <div className="time-entry">
        <div>
          <h6>Hours</h6>
          <select
            value={hour}
            onChange={(e) => {
              setHour(e.target.value);
            }}
            id="hours-select"
          >
            {[
              0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
              19, 20, 21, 22, 23,
            ].map((hour, hourIndex) => {
              return (
                <option key={hourIndex} value={hour}>
                  {hour}
                </option>
              );
            })}
          </select>
        </div>
        <div>
          <h6>minutes</h6>
          <select
            value={min}
            onChange={(e) => {
              setMin(e.target.value);
            }}
            id="mins-select"
          >
            {[0, 5, 10, 15, 30, 45].map((mins, minsIndex) => {
              return (
                <option key={minsIndex} value={mins}>
                  {mins}
                </option>
              );
            })}
          </select>
        </div>
        <button onClick={handleSubmitForm}>
          <p>Add Entry</p>
        </button>
      </div>
    </>
  );
}
