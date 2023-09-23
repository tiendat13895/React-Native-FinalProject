import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Keyboard,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import axios from 'axios';

export function CreateUserScreen({navigation}: any) {
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorUserName, setErrorUserName] = useState('');
  const [errorPassWord, setErrorPassWord] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorBirthday, setErrorBirthday] = useState('');
  const [errorAddress, setErrorAddress] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [errorPasswordConfirm, setErrorPasswordConfirm] = useState('');
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    setUserName('');
    setPassWord('');
    setPasswordConfirm('');
    setName('');
    setBirthday('');
    setAddress('');
    setEmail('');
    setPhone('');
  }, []);

  const doCreateUser = async () => {
    Keyboard.dismiss();
    setLoadingState(true);

    let messNotify = '';
    if (
      !username ||
      !password ||
      !passwordConfirm ||
      !name ||
      !birthday ||
      !address ||
      !email ||
      !phone
    ) {
      messNotify = 'Bạn chưa nhập đủ thông tin';
    } else if (birthday.length < 10) {
      messNotify = 'Ngày sinh không đúng định dạng';
    } else if (
      email.includes('@') == false ||
      email.includes('.com') == false
    ) {
      messNotify = 'Email không đúng định dạng';
    } else if (phone.includes('0', 1) == false && phone.length < 10) {
      messNotify = 'Số điện thoại không đúng định dạng';
    } else if (password != passwordConfirm) {
      messNotify = 'Mật khẩu xác nhận không trùng khớp';
    }

    const res_username = await axios
      .get(
        'https://650468e7c8869921ae24ff64.mockapi.io/api/users?username=' +
          username,
      )
      .then(res => {
        if (res.data) {
          if (res.data.length > 0) {
            return true;
          }
        }
        return false;
      })
      .catch(err => {
        console.log(err);
        return true;
      });

    if (res_username) {
      messNotify = 'Tên đăng nhập đã tồn tại';
    }

    const res_email = await axios
      .get(
        'https://650468e7c8869921ae24ff64.mockapi.io/api/users?email=' + email,
      )
      .then(res => {
        if (res.data) {
          if (res.data.length > 0) {
            return true;
          }
        }
        return false;
      })
      .catch(err => {
        console.log(err);
        return true;
      });

    if (res_email) {
      messNotify = 'Email đã tồn tại';
    }

    const res_phone = await axios
      .get(
        'https://650468e7c8869921ae24ff64.mockapi.io/api/users?phone=' + phone,
      )
      .then(res => {
        if (res.data) {
          if (res.data.length > 0) {
            return true;
          }
        }
        return false;
      })
      .catch(err => {
        console.log(err);
        return true;
      });

    if (res_phone) {
      messNotify = 'Số điện thoại đã tồn tại';
    }

    if (messNotify != '') {
      setLoadingState(false);
      Alert.alert(messNotify);
      return;
    }

    let userData = {
      username: username,
      password: password,
      name: name,
      birthday: birthday,
      address: address,
      email: email,
      phone: phone,
    };

    const res_createuser = await axios
      .post('https://650468e7c8869921ae24ff64.mockapi.io/api/users', userData)
      .then(res => {
        if (res.data) {
          return true;
        }
      })
      .catch(err => {
        console.log(err);
        return false;
      });

    if (res_createuser) {
      Alert.alert('Chúc mừng bạn đã tạo thành công tài khoản ' + username);
      setUserName('');
      setPassWord('');
      setPasswordConfirm('');
      setName('');
      setBirthday('');
      setAddress('');
      setEmail('');
      setPhone('');
      setLoadingState(false);
      navigation.navigate('Login');
    }
  };

  return (
    <ScrollView>
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        {loadingState && <ActivityIndicator size="large" color="#D97B29" />}
        {/* <Text style={styles.title}> Đăng ký </Text> */}
        <TextInput
          onChangeText={text => {
            setErrorUserName(!text ? 'Hãy nhập tên đăng nhập' : '');
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
            setErrorPassWord(!text ? 'Hãy nhập mật khẩu' : '');
            setPassWord(text);
          }}
          value={password}
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorPassWord}</Text>

        <TextInput
          secureTextEntry={true}
          onChangeText={text => {
            setErrorPasswordConfirm(!text ? 'Hãy nhập lại mật khẩu' : '');
            setPasswordConfirm(text);
          }}
          value={passwordConfirm}
          style={styles.input}
          placeholder="Nhập lại mật khẩu"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorPasswordConfirm}</Text>

        <TextInput
          onChangeText={text => {
            setErrorName(!text ? 'Hãy nhập họ tên' : '');
            setName(text);
          }}
          value={name}
          style={styles.input}
          placeholder="Họ tên"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorName}</Text>

        <TextInput
          onChangeText={text => {
            setErrorBirthday(!text ? 'Hãy nhập ngày sinh' : '');
            setBirthday(text);
          }}
          value={birthday}
          style={styles.input}
          placeholder="ngày sinh (dd/MM/yyyy)"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorBirthday}</Text>

        <TextInput
          onChangeText={text => {
            setErrorAddress(!text ? 'Hãy nhập địa chỉ' : '');
            setAddress(text);
          }}
          value={address}
          style={styles.input}
          placeholder="Địa chỉ"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorAddress}</Text>

        <TextInput
          onChangeText={text => {
            setErrorEmail(!text ? 'Hãy nhập Email' : '');
            setEmail(text);
          }}
          value={email}
          style={styles.input}
          placeholder="Email (...@....com)"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorEmail}</Text>

        <TextInput
          keyboardType="numeric"
          onChangeText={text => {
            setErrorPhone(!text ? 'Hãy nhập số điện thoại' : '');
            setPhone(text);
          }}
          value={phone}
          style={styles.input}
          placeholder="Số điện thoại"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorPhone}</Text>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'lightgreen'}}
          onPress={() => doCreateUser()}>
          <Text>Đăng ký</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{...styles.button, backgroundColor: 'lightblue'}}
          onPress={() => navigation.navigate('Login')}>
          <Text>Thoát</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
