import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes/AppRoutes';
import NotificationLayout from './components/Common/NotificationLayout';

const App = () => {
  return (
    <BrowserRouter>
      <NotificationLayout>
        <AppRoutes />
      </NotificationLayout>
    </BrowserRouter>
  );
}

export default App;