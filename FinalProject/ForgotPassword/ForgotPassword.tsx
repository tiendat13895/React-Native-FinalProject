import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
} from 'react-native';
import axios from 'axios';

export function ForgotPasswordScreen({navigation}: any) {
  const [username, setUserName] = useState('');
  const [phone, setPhone] = useState('');
  const [errorUserName, setErrorUserName] = useState('');
  const [errorPhone, setErrorPhone] = useState('');

  useEffect(() => {
    setUserName('');
    setPhone('');
  }, []);

  const dochangePassword = async () => {
    Keyboard.dismiss();
    if (!username || !phone) {
      Alert.alert('Bạn chưa nhập đủ thông tin');
      return;
    } else if (phone.includes('0', 1) == false && phone.length < 10) {
      Alert.alert('Số điện thoại không đúng định dạng');
      return;
    }

    let res_id = '';
    const res_validate = await axios
      .get(
        'https://650468e7c8869921ae24ff64.mockapi.io/api/users?phone=' +
          phone +
          '&username=' +
          username,
      )
      .then(res => {
        if (res.data) {
          if (res.data.length > 0) {
            res_id = res.data[0].id;
            return true;
          }
        }
        return false;
      })
      .catch(err => {
        console.log(err);
        return true;
      });

    if (res_validate && res_id != '') {
      let newpassword = {
        password: username + '123',
      };

      const res_reset = await axios
        .put(
          'https://650468e7c8869921ae24ff64.mockapi.io/api/users/' + res_id,
          newpassword,
        )
        .then(res => {
          if (res.data) {
            if (res.data) {
              return true;
            }
          }
          return false;
        })
        .catch(err => {
          console.log(err);
          return;
        });

      if (res_reset) {
        Alert.alert(
          'PW mới của bạn là ' +
            username +
            '123 hãy đăng nhập và đổi PW',
        );
        navigation.navigate('Login');
        return;
      }
    }
    Alert.alert('Lấy lại mật khẩu thất bại, vui lòng thử lại');
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {/* <Text style={styles.title}> Quên mật khẩu </Text> */}
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
        keyboardType="numeric"
        onChangeText={text => {
          setErrorPhone(!text ? 'Hãy nhập số điện thoại!' : '');
          setPhone(text);
        }}
        value={phone}
        style={styles.input}
        placeholder="Số điện thoại"
        placeholderTextColor="grey"></TextInput>
      <Text style={styles.error}>{errorPhone}</Text>

      <TouchableOpacity
        style={{...styles.button, backgroundColor: 'lightyellow'}}
        onPress={() => dochangePassword()}>
        <Text>Lấy lại mật khẩu</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={{...styles.button, backgroundColor: 'lightblue'}}
        onPress={() => navigation.navigate('Login')}>
        <Text>Thoát</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'orange',
    fontSize: 30,
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
    margin: 2,
    width: '95%',
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'left',
  },
});
