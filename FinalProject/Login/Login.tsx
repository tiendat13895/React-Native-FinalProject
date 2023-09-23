import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// import {HomeTab} from '../Main';

export function LoginScreen({navigation}: any) {
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [errorUserName, setErrorUserName] = useState('');
  const [errorPassWord, setErrorPassWord] = useState('');

  useEffect(() => {
    // Alert.alert('Chào mừng bạn đến với G-Shop!');
    setUserName('');
    setPassWord('');

    AsyncStorage.getItem('userLogin', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        navigation.navigate('HomeTab');
      }
    });
  }, []);

  const doLogin = () => {
    Keyboard.dismiss();
    if (!username || !password) {
      Alert.alert('Chưa nhập tên đăng nhập hoặc mật khẩu!');
      return;
    }

    axios
      .get(
        'https://650468e7c8869921ae24ff64.mockapi.io/api/users?username=' +
          username,
      )
      .then(async res => {
        if (res.data) {
          if (res.data.length != 1) {
            Alert.alert('Sai tên đăng nhập!');
          } else {
            let objUser = res.data[0];
            if (objUser.password != password) {
              Alert.alert('Sai mật khẩu!');
              return;
            } else {
              try {
                await AsyncStorage.setItem(
                  'userLogin',
                  JSON.stringify(objUser),
                );
                Alert.alert(
                  'Chúc mừng ' + objUser.name + ' đã đăng nhập thành công!',
                );
                setUserName('');
                setPassWord('');
                navigation.navigate('HomeTab');
              } catch (err) {
                console.log(`Error save userLogin to Storage`);
                return;
              }
            }
          }
        }
      })
      .catch(err => console.log(err));
  };

  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.container}>
        <Text style={styles.title}> G - SHOP </Text>
        <TextInput
          onChangeText={text => {
            setErrorUserName(!text ? 'Hãy nhập tên đăng nhập!' : '');
            setUserName(text);
          }}
          value={username}
          style={styles.input}
          placeholder="Tên đăng nhập"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorUserName}</Text>

        <TextInput
          secureTextEntry={true}
          onChangeText={text => {
            setErrorPassWord(!text ? 'Hãy nhập mật khẩu!' : '');
            setPassWord(text);
          }}
          value={password}
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorPassWord}</Text>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'lightyellow'}}
          onPress={() => doLogin()}>
          <Text>Đăng Nhập</Text>
        </TouchableOpacity>

        <Text>Hoặc</Text>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'lightgreen'}]}
          onPress={() => navigation.navigate('CreateUser')}>
          <Text>Đăng ký</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'lightblue'}]}
          onPress={() => navigation.navigate('ForgotPassword')}>
          <Text>Quên mật khẩu</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{marginBottom: 10, marginTop: 50}}
          onPress={() => navigation.navigate('About')}>
          <Text style={{color: 'gray'}}>Thông tin</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    // justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
  },
  title: {
    color: 'green',
    fontSize: 40,
    fontWeight: 'bold',
  },
  button: {
    width: '90%',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 10,
    padding: 8,
    margin: 10,
    width: '90%',
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'left',
  },
});
