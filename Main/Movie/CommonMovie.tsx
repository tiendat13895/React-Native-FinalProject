import * as React from 'react';
import {StyleSheet, Text, View} from 'react-native';

type Movie = {
  id?: string;
  title?: string;
  releaseYear?: string;
};
interface Post {
  title?: string;
  description?: string;
  movies?: Movie[];
}

export function CommonMovieScreen() {
  const [data, setData] = React.useState<Post | undefined>();

  const getMoviesFromApi = () => {
    return fetch('https://reactnative.dev/movies.json')
      .then(response => response.json())
      .then(json => {
        // console.log(json);
        return json as Post;
      })
      .catch(error => {
        // console.error(error);
        return undefined;
      });
  };

  React.useEffect(() => {
    getMoviesFromApi().then(response => setData(response));
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>NetworkDemo</Text>
      {data === undefined ? (
        <Text>Loading ...</Text>
      ) : (
        <MovieComponent post={data} />
      )}
    </View>
  );
}

export interface Props {
  post: Post;
}

const MovieComponent: React.FC<Props> = props => {
  // console.log(props);
  return (
    <View>
      <Text>Title : {props.post.title}</Text>
      <Text>Description : {props.post.description}</Text>
      <Text>Movie List </Text>
      {props.post.movies?.map(movie => (
        <Text key={movie.id}>
          {movie.id} - {movie.title} - {movie.releaseYear}
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fffff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 22,
    color: '#000',
  },
});
