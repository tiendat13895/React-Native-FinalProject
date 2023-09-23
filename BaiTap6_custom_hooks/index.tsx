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
import {useLoadMovie} from './hook';

export interface Props {}
const BaiTap6: React.FC<Props> = () => {
  const {data, loading, loadMore, refresh, refreshing} = useLoadMovie();
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
};

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
      <Text style={styles.title}>Most movie</Text>
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
    // backgroundColor: '#cacaca',
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

export default BaiTap6;
