import React, {useEffect, useState} from 'react';
import {Text, View, TouchableOpacity, Button, StyleSheet} from 'react-native';

// export function HomeScreen({navigation, route}: any) {
  export function HomeScreen({navigation}: any) {
  // const [username, setUserName] = useState('');
  // setUserName(!route.params.username ? '' : route.params.username);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text>Home Screen</Text>
      {/* Lỗi khi từ các màn hình khác navigate về Home không truyền biến username */}
      {/* <Text>Xin chào {username}</Text> */}
      <Text>Xin chào</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Details')}
      />
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'lightyellow'}]}
        onPress={() => navigation.navigate('Category', {text: 'Story'})}>
        <Text>Story</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'lightgreen'}]}
        onPress={() => navigation.navigate('Category', {text: 'Music'})}>
        <Text>Music</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.button, {backgroundColor: 'lightblue'}]}
        onPress={() => navigation.navigate('Category', {text: 'Picture'})}>
        <Text>Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginVertical: 10,
  },
});
