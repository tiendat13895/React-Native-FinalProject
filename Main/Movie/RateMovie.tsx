import * as React from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {Result, RootObject} from './model';

import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

AxiosLogger.setGlobalConfig({
  dateFormat: 'HH:MM:ss',
  status: true,
  headers: true,
});
const instance = axios.create();
// instance.interceptors.request.use(
//   AxiosLogger.requestLogger,
//   AxiosLogger.errorLogger,
// );
instance.interceptors.response.use(AxiosLogger.responseLogger);

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

// curl --request GET \
//      --url 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1' \
//      --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI2NTMwMmQ5ZmQ1N2RkYTNlYTJiYTg2ZjM3MGFiNmI3ZiIsInN1YiI6IjVkNmRlM2E0NjU2ODZlMDkxNzg3ZWQwNSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.f0LRHeQrPh_B9G8bqsVN6TH6E8H95ftioPovN_KkbD0' \
//      --header 'accept: application/json'

export function RateMovieScreen() {
  // const RateMovieComponent: React.FC<Props> = () => {
  const [data, setData] = React.useState<RootObject | undefined>();

  const [loading, setLoading] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);

  const getMoviesFromApi = (_page = 1) => {
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
        // console.error(error);
        return undefined;
      });
  };

  React.useEffect(() => {
    getMoviesFromApi().then(response => setData(response?.data));
  }, []);

  const loadMore = React.useCallback(() => {
    setLoading(true);
    const page = data?.page ?? 1;
    getMoviesFromApi(page + 1).then(response => {
      const oldDataResults = data?.results ?? [];
      const newDataResults = response?.data?.results ?? [];
      const finalDataResults = [...oldDataResults, ...newDataResults];
      const result = {...response?.data, results: finalDataResults};
      setData(result as RootObject);
      setLoading(false);
    });
  }, [data]);

  const refresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    getMoviesFromApi().then(response => {
      setRefreshing(false);
      setLoading(false);
      setData(response?.data);
    });
  }, []);

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <View style={styles.container}>
          {data === undefined ? (
            <Text>Loading ...</Text>
          ) : (
            <MovieComponent
              post={data}
              loadMore={loadMore}
              loading={loading}
              refresh={refresh}
              refreshing={refreshing}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
  // };
}

export interface Props {
  post: RootObject;
  loadMore: () => void;
  loading: boolean;
  refresh: () => void;
  refreshing: boolean;
}

const MovieComponent: React.FC<Props> = props => {
  return (
    <View>
      <Text style={styles.title}>Rate movie</Text>
      <FlatList
        contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
        contentInsetAdjustmentBehavior="automatic"
        data={props.post.results}
        renderItem={({item}: ListRenderItemInfo<Result>) => (
          <ItemComponent item={item} />
        )}
        keyExtractor={(item: Result, index: number) => `${item.id}-${index}`}
        onEndReached={() => {
          if (!props.loading) {
            props.loadMore();
          }
        }}
        onEndReachedThreshold={0.8}
        onRefresh={() => props.refresh()}
        refreshing={props.refreshing}
      />
    </View>
  );
};

export interface ItemComponentProps {
  item: Result;
}

const ItemComponent: React.FC<ItemComponentProps> = props => {
  const {
    item: {title, backdrop_path, overview},
  } = props;
  return (
    <View style={styles.rootItem}>
      <Image
        style={styles.image}
        source={{
          uri: 'https://image.tmdb.org/t/p/w300' + backdrop_path,
        }}
      />
      <View style={styles.rightItem}>
        <Text style={styles.itemTitleText} numberOfLines={2}>
          {title}
        </Text>
        <Text style={styles.itemDescriptionText} numberOfLines={8}>
          {overview}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
  },

  rootItem: {
    flexDirection: 'row',
    marginVertical: 5,
    flex: 1,
  },
  itemTitleText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemDescriptionText: {
    fontSize: 15,
    marginEnd: 10,
  },
  rightItem: {
    flexDirection: 'column',
    marginHorizontal: 5,
    flex: 1,
  },
  image: {width: 200, height: 200},
});
