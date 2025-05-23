import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCurrentUser } from './store/auth/authActions';
import { router } from './router/router';
import { Toaster } from './components/ui/sonner'
import { fetchProducts } from './store/product/productActions';

function App() {
  const dispatch = useDispatch();

  useEffect(() => {

    const initApp = async () => {

      try {
        await dispatch(fetchProducts()).unwrap();
      } catch (error) {
        console.error('fetch products failed:', error);
      } 
      try {
        await dispatch(fetchCurrentUser()).unwrap();
      } catch (error) {
        console.error('Authentication check failed:', error);
      } 


    };

    initApp();
  }, [dispatch]);



  return <>
    <RouterProvider router={router} />
    <Toaster />
  </>;
}

export default App;