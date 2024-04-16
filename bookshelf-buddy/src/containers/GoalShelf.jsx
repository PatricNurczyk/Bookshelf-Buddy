import React, { useState, useEffect} from "react";
import { Stack } from "react-bootstrap";
import "../stylesheets/goalshelf.css"
import Popup from "./Popup";
import axios from "axios";


function GoalShelf({user}) {
    
    const width = 200;
    const height = 200;
    const color = "gold"
    const [goals, setGoals] = useState([])
    const [trigger, setTrigger] = useState(false);
    const [goalData, setgoalData] = useState({
        goal: '',
        bookCount: '',
    });

    const addGoalClick = (category_id) => {
        setTrigger(true);
    };
    
    const handleGoalInputChange = (event) => {
        const { name, value } = event.target;
        setgoalData({
        ...goalData,
        [name]: value,
        });
    };

    useEffect(() => {
        if (user !== undefined) {
            let url = 'http://localhost:8080/goals?email=' + user;
            console.log(url);
            fetch(url)
            .then(res => res.json())
            .then(data => setGoals(data))
            .catch(error => console.error(error));
            console.log(goals);
        }
    },[user]);

    const addGoal = async (category) => {
        try{
          const response = await axios.post('http://localhost:8080/addGoal', {
            goal_name : goalData.goal,
            total : goalData.bookCount
          });
          console.log('Goal uploaded successfully:', response.data);
        } catch (error) {
          console.log(error);
        }
        setgoalData({
            goal: '',
            bookCount: '',
        });
        setTrigger(false);
      }

    return (
        <>
            <div className="scroll-container">
                <Stack>
                    {goals.length > 0 ? (
                        goals.map((item, index) => (
                            <div className="goal-container">
                                <h4 className="goalName">{item.goal_name}</h4>
                                <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={width}
                                height={height}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke={color}
                                strokeWidth="1"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="goal"
                                >
                                    <defs>
                                        <linearGradient id="grad" x1="0%" y2="0%" x2="0%" y1="100%">
                                            <stop offset={(item.goal_progress/item.goal_total)*100 + "%"} stop-color="yellow"/>
                                            <stop offset="0%" stop-color="grey"/>
                                        </linearGradient>
                                    </defs>
                                    <path fill="url(#grad)" d="M12 2 L15.09 8.26 L22 9.27 L17 14.14 L18.18 21.02 L12 17.77 L5.82 21.02 L7 14.14 L2 9.27 L8.91 8.26 L12 2 z" />
                                    
                                </svg>
                                <h4 className="prog">{(item.goal_progress/item.goal_total)*100 + "%"}</h4>
                            </div>
                        ))
                    ) : (
                        <div></div>
                    )}
                </Stack>
                <h3>Add New Goal</h3>   
                <button onClick={() => setTrigger(true)} className="add-btn"></button> 
                <Popup title="Add New Goal" trigger={trigger} onClose={setTrigger}>
                    <form onSubmit={addGoal}>
                        <div className="form-group">
                        <label htmlFor="Goal">Goal Name: </label>
                        <input
                            type="text"
                            className="form-control"
                            id="goal"
                            name="goal"
                            value={goalData.goal}
                            onChange={handleGoalInputChange}
                        />
                        </div>
                        <div className="form-group">
                            <label htmlFor="bookCount">Total Book Count: </label>
                            <input
                                type="number"
                                className="form-control"
                                id="bookCount"
                                name="bookCount"
                                value={goalData.bookCount}
                                onChange={handleGoalInputChange}
                            />
                        </div>
                        <button type="submit" className="btn btn-success">
                        Add Goal
                        </button>
                    </form>
                </Popup>
            </div>
        </>
    )
}

export default GoalShelf;