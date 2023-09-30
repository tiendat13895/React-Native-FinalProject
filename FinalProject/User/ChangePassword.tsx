import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Keyboard,
  ActivityIndicator,
  Image,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ChangePasswordScreen({navigation}: any) {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errorOldPassword, setErrorOldPassword] = useState('');
  const [errorNewPassword, setErrorNewPassword] = useState('');
  const [errorNewPasswordConfirm, setErrorNewPasswordConfirm] = useState('');
  const [loadingState, setLoadingState] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setOldPassword('');
    setNewPassword('');
    setNewPasswordConfirm('');
  }, []);

  const dochangePassword = async () => {
    Keyboard.dismiss();
    setLoadingState(true);
    let messNotify = '';

    let userData = {
      id: '',
      username: '',
      password: '',
      name: '',
      birthday: '',
      address: '',
      email: '',
      phone: '',
    };
    let oldPasswordBK = '';
    const res_getuser = await AsyncStorage.getItem(
      'userLogin',
      async (err, data) => {
        if (err) {
          console.log('Error getting userLogin from Storage');
          return false;
        }
        if (data) {
          const jsonDeValue = JSON.parse(data);
          oldPasswordBK = jsonDeValue.password;
          userData.id = jsonDeValue.id;
          userData.username = jsonDeValue.username;
          userData.name = jsonDeValue.name;
          userData.birthday = jsonDeValue.birthday;
          userData.address = jsonDeValue.address;
          userData.email = jsonDeValue.email;
          userData.phone = jsonDeValue.phone;
          userData.password = newPassword;
          return true;
        }
      },
    );

    if (res_getuser && userData.id != '') {
      if (!oldPassword || !newPassword || !newPasswordConfirm) {
        messNotify = 'Bạn chưa nhập đủ thông tin';
      }
      if (oldPassword != oldPasswordBK) {
        messNotify = 'Sai mật khẩu cũ';
      }
      if (newPassword != newPasswordConfirm) {
        messNotify = 'Mật khẩu xác nhận không khớp';
      }
      if (oldPassword == newPassword) {
        messNotify = 'Mật khẩu cũ và mới không được trùng nhau';
      }

      if (messNotify != '') {
        setLoadingState(false);
        Alert.alert(messNotify);
        return;
      }

      let newpassword = {
        password: newPassword,
      };

      const res_updatepassword = await axios
        .put(
          'https://650468e7c8869921ae24ff64.mockapi.io/api/users/' +
            userData.id,
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
          return false;
        });

      if (res_updatepassword) {
        await AsyncStorage.removeItem('userLogin', async err => {
          if (err) {
            setLoadingState(false);
            console.log('Error to remove userLogin');
            return;
          } else {
            await AsyncStorage.setItem('userLogin', JSON.stringify(userData));
            setLoadingState(false);
            Alert.alert('Đổi mật khẩu thành công');
            navigation.goBack();
            return;
          }
        });
      } else {
        Alert.alert('Đổi mật khẩu thất bại, vui lòng thử lại');
      }
    } else {
      Alert.alert('Đổi mật khẩu thất bại, vui lòng thử lại');
    }
    setLoadingState(false);
  };

  const doShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      {loadingState && <ActivityIndicator size="large" color="#D97B29" />}

      <Text style={styles.title}> Mật khẩu cũ (*) </Text>
      <View style={{flexDirection: 'row', marginVertical: 5}}>
        <TextInput
          secureTextEntry={!showPassword}
          onChangeText={text => {
            setErrorOldPassword(!text ? 'Hãy nhập mật khẩu cũ' : '');
            setOldPassword(text);
          }}
          value={oldPassword}
          style={styles.input}
          placeholder="Nhập mật khẩu cũ"
          placeholderTextColor="grey"></TextInput>
        <TouchableOpacity
          style={{
            width: '10%',
            paddingTop: 10,
          }}
          onPress={() => doShowPassword()}>
          <Image
            source={{
              uri: !showPassword
                ? 'https://icon-library.com/images/show-hide-icon/show-hide-icon-13.jpg'
                : 'https://icon-library.com/images/show-hide-icon/show-hide-icon-28.jpg',
            }}
            style={{width: 30, height: 30}}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.error}>{errorOldPassword}</Text>

      <Text style={styles.title}> Mật khẩu mới (*) </Text>
      <View style={{flexDirection: 'row', marginVertical: 5}}>
        <TextInput
          secureTextEntry={!showPassword}
          onChangeText={text => {
            setErrorNewPassword(!text ? 'Hãy nhập mật khẩu mới' : '');
            setNewPassword(text);
          }}
          value={newPassword}
          style={styles.input}
          placeholder="Nhập mật khẩu mới"
          placeholderTextColor="grey"></TextInput>
        <TouchableOpacity
          style={{
            width: '10%',
            paddingTop: 10,
          }}
          onPress={() => doShowPassword()}>
          <Image
            source={{
              uri: !showPassword
                ? 'https://icon-library.com/images/show-hide-icon/show-hide-icon-13.jpg'
                : 'https://icon-library.com/images/show-hide-icon/show-hide-icon-28.jpg',
            }}
            style={{width: 30, height: 30}}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.error}>{errorNewPassword}</Text>

      <View style={{flexDirection: 'row', marginVertical: 5}}>
        <TextInput
          secureTextEntry={!showPassword}
          onChangeText={text => {
            setErrorNewPasswordConfirm(
              !text ? 'Hãy nhập lại mật khẩu mới' : '',
            );
            setNewPasswordConfirm(text);
          }}
          value={newPasswordConfirm}
          style={styles.input}
          placeholder="Nhập lại mật khẩu mới"
          placeholderTextColor="grey"></TextInput>
        <TouchableOpacity
          style={{
            width: '10%',
            paddingTop: 10,
          }}
          onPress={() => doShowPassword()}>
          <Image
            source={{
              uri: !showPassword
                ? 'https://icon-library.com/images/show-hide-icon/show-hide-icon-13.jpg'
                : 'https://icon-library.com/images/show-hide-icon/show-hide-icon-28.jpg',
            }}
            style={{width: 30, height: 30}}
            resizeMode="stretch"
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.error}>{errorNewPasswordConfirm}</Text>

      <TouchableOpacity
        style={{...styles.button, backgroundColor: 'lightgreen'}}
        onPress={() => dochangePassword()}>
        <Text>Cập nhật</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    color: 'red',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'left',
    width: '100%',
    marginLeft: 20,
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
    width: '80%',
  },
  error: {
    color: 'red',
    fontSize: 10,
    marginBottom: 5,
    textAlign: 'left',
  },
});
