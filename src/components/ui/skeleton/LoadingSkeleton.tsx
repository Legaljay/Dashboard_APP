import styled, { keyframes } from "styled-components";

const shimmer = keyframes`
    0% {
        background-position: -300px 0;
    }
    100% {
        background-position: 300px 0;
    }
`;

const Card = styled.section`
  padding: 10px;
  border-radius: 8px;
  background-color: rgba(249,249,249,0.86);
`;

const Card__skeleton = styled.section`
  background-image: linear-gradient(
    90deg,
    rgb(249, 249, 249) 0px,
    rgb(229 229 229 / 90%) 40px,
    rgba(249, 249, 249, 0.86) 80px
  );
  background-size: 300%;
  background-position: 100% 0;
  border-radius: inherit;
  position: relative;
  animation: ${shimmer} 1.5s infinite linear;
`;

const Card_title = styled.section`
  height: 15px;
  margin-bottom: 15px;
`;


export function SmallCard() {
  return (
    <Card
      className="w-full h-[158px]"
    >
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
    </Card>
  );
}
export function ServiceFeaturesCard() {
  return (
    <Card className="w-full h-[158px]">
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
    </Card>
  );
}

export function TableCard(){
  return (
    <Card className="w-full h-[158px]">
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
      <Card__skeleton>
        <Card_title></Card_title>
      </Card__skeleton>
    </Card>
  );
}