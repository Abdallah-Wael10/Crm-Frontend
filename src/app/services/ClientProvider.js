"use client";
import { Provider } from 'react-redux';
import { store } from '../redux/store/store';
import { Toaster } from 'react-hot-toast';

export default function ClientProvider({ children }) {
  return (
    <Provider store={store}>
      {children}
      <Toaster position="top-right" />
    </Provider>
  );
}