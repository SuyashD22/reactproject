import React from "react";
import { useEffect } from "react";
interface UserProps {
  id: number;
  name: string;
  email: string;
}

const About = () => {
  const [state, setState] = React.useState([]);
  async function getUsers() {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    setState(data);
  }
  useEffect(() => {
    getUsers();
  }, []);
  return (
    <div>
      <h1>About Us</h1>
      {state.map((user: UserProps) => (
        <div key={user.id}>
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      ))}
    </div>
  );
};

export default About;
