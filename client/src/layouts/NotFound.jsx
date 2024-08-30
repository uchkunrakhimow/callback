import { Container, Header, Content } from 'rsuite';
import { useLocation } from 'react-router-dom';

const ErrorPage = () => {
  const location = useLocation();

  return (
    <Container className='container-center'>
      <Header>
        <h1>Oops!</h1>
      </Header>
      <Content>
        <div>
          <p>404. That’s an error.</p>
          <p>
            The requested URL{' '}
            <span style={{ backgroundColor: 'yellow', padding: '5px' }}>
              {location.pathname}
            </span>{' '}
            was not found on this server. That’s all we know.
          </p>
        </div>
      </Content>
    </Container>
  );
};

export { ErrorPage };
