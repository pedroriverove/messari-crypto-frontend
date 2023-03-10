import styled from "@emotion/styled";
import themes from "../constants/themes";

const SubHeader = () => {
  return (
    <SubHeaderEl>
      <h1>Messari Crypto</h1>
      <p>Get all the info regarding your favorite crypto currency</p>
    </SubHeaderEl>
  );
};

export default SubHeader;

const SubHeaderEl = styled.div`
  text-align: center;
  padding: 10px;
  margin: auto;
  border-radius: 14px;
  background-color: ${themes.colors.lightGrey};
  border: 2px solid ${themes.colors.grey};
`;
