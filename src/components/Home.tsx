import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Button = styled.button`
  background-color: red;
`;
const Home = () => {
  const navigate = useNavigate();
  const handleNavigate = () => {
    navigate("/about");
  };
  return (
    <div>
      <Button onClick={handleNavigate}>about</Button>
    </div>
  );
};
export default Home;
