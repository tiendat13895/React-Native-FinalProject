import React from 'react';
// import App from './features/counter/Counter';
import {Provider} from 'react-redux';
import {store} from './Store/Index';
import Movie from './features/Movie';
export interface Props {}

const index: React.FC<Props> = () => {
  return (
    <Provider store={store}>
      {/* <App /> */}
      <Movie />
    </Provider>
  );
};

export default index;