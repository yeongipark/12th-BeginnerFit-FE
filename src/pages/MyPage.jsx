import { MainH2, Wrapper, Container, MainContent } from "./Main";
import { Header } from "../layouts/header";
import TagList from "../components/Main/TagList";

export default function MyPage() {
  return (
    <Wrapper>
      <Container>
        <MainContent>
          <Header type={"people"} size={30} />
          <MainH2>
            사용자님의
            <br />
            마이페이지
          </MainH2>
          <TagList />
        </MainContent>
      </Container>
    </Wrapper>
  );
}
