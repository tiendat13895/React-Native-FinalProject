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

// import {HomeTab} from '../Main';

export function LoginScreen({navigation}: any) {
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [errorUserName, setErrorUserName] = useState('');
  const [errorPassWord, setErrorPassWord] = useState('');

  useEffect(() => {
    Alert.alert('Chào mừng bạn đến với Yolo System!');
  }, []);

  const loginAlert = () => {
    Alert.alert('Chúc mừng ' + username + ' đã đăng nhập thành công!');
  };

  const validate = () => {
    Keyboard.dismiss();
    let valid = true;
    if (!username || !password) {
      Alert.alert('Chưa nhập tên đăng nhập hoặc mật khẩu!');
      valid = false;
    }
    if (valid == true) {
      loginAlert();
      // navigation.navigate('Home', {username: username});
      navigation.navigate('HomeTab');
    }
  };
  return (
    <View style={{flex: 1, justifyContent: 'center'}}>
      <View style={styles.container}>
        <Text style={styles.title}> Yolo System </Text>
        <TextInput
          onChangeText={text => {
            // if (!text) {
            //   setErrors('Hãy nhập tên đăng nhập!');
            // } else {
            //   setErrors('');
            // }
            setErrorUserName(!text ? 'Hãy nhập tên đăng nhập!' : '');
            setUserName(text);
          }}
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
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorPassWord}</Text>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'purple'}}
          onPress={() => validate()}>
          <Text>Login</Text>
        </TouchableOpacity>

        <Text>OR</Text>

        <TouchableOpacity style={[styles.button, {backgroundColor: 'green'}]}>
          <Text>Facebook</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, {backgroundColor: 'red'}]}>
          <Text>Google</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{marginBottom: 10, marginTop: 50}}
          onPress={() => navigation.navigate('About')}>
          <Text style={{color: 'gray'}}>About</Text>
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
