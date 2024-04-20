import React, {useState, useEffect} from "react";

function GoalDate({date}){


    const [differenceInDays, setDifferenceInDays] = useState(null);

    useEffect(() => {
        // Convert the string date to a Date object
        const dateObject = new Date(date);
        
        // Get the current date
        const currentDate = new Date();
        
        // Calculate the difference in milliseconds between the two dates
        const differenceInMilliseconds = dateObject - currentDate;
        
        // Convert the difference in milliseconds to days
        const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
        
        // Update the state with the difference in days
        setDifferenceInDays(differenceInDays);
    }, [date]);

  return (
    <div>
      {differenceInDays !== null ? (
        differenceInDays >= 0 ? (
        <h5>{differenceInDays} days left</h5>
         ) : (
         <h5>Goal Expired</h5>
         )
      ) : (
        <h5>Loading...</h5>
      )}
    </div>
  );
}

export default GoalDate;