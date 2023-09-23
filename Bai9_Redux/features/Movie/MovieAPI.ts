import axios from 'axios';
import * as AxiosLogger from 'axios-logger';
import {RootObject} from './model';

AxiosLogger.setGlobalConfig({
  dateFormat: 'HH:MM:ss',
  status: true,
  headers: true,
});
const instance = axios.create();
instance.interceptors.request.use(
  // @ts-ignore: type error issue https://github.com/hg-pyun/axios-logger/issues/131
  AxiosLogger.requestLogger,
  AxiosLogger.errorLogger,
);
instance.interceptors.response.use(AxiosLogger.responseLogger);

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  },
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Any status code that lie within the range of 2xx cause this function to trigger
    // Do something with response data
    return response;
  },
  function (error) {
    // Any status codes that falls outside the range of 2xx cause this function to trigger
    // Do something with response error
    return Promise.reject(error);
  },
);

export const getMoviesFromApi = (_page = 1) => {
  return instance
    .get<RootObject | undefined>(
      `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${_page}`,
      {
        headers: {
          Accept: 'application/json',
          Authorization:
            'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTMwMmQ5ZmQ1N2RkYTNlYTJiYTg2ZjM3MGFiNmI3ZiIsInN1YiI6IjVkNmRlM2E0NjU2ODZlMDkxNzg3ZWQwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f0LRHeQrPh_B9G8bqsVN6TH6E8H95ftioPovN_KkbD0',
        },
      },
    )
    .catch(error => {
      console.error(error);
      return undefined;
    });
};