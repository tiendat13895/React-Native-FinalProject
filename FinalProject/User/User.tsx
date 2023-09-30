import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  Button,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  ScrollView,
  Keyboard,
  Alert,
  ActivityIndicator,
  Image,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

export function UserScreen({navigation}: any) {
  const [userid, setUserId] = useState('');
  const [username, setUserName] = useState('');
  const [password, setPassWord] = useState('');
  const [name, setName] = useState('');
  const [birthday, setBirthday] = useState('');
  const [address, setAddress] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [errorPassWord, setErrorPassWord] = useState('');
  const [errorName, setErrorName] = useState('');
  const [errorBirthday, setErrorBirthday] = useState('');
  const [errorAddress, setErrorAddress] = useState('');
  const [errorEmail, setErrorEmail] = useState('');
  const [errorPhone, setErrorPhone] = useState('');
  const [EditUser, setEditUser] = useState(false);
  const [EditButtonName, setEditButtonName] = useState('');
  const [showCancel, setShowCancel] = useState(false);
  const [loadingState, setLoadingState] = useState(false);

  useEffect(() => {
    cancelEditUser();
  }, []);

  const doLogOut = async () => {
    await AsyncAlert();
  };

  const AsyncAlert = () => {
    return new Promise((resolve, reject) => {
      Alert.alert(
        'Thông báo',
        'Bạn chắc chắn muốn thoát?',
        [
          {
            text: 'Hủy',
            onPress: () => {
              resolve('');
              return;
            },
            style: 'cancel',
          },
          {
            text: 'Xác nhận',
            onPress: () => {
              AsyncStorage.removeItem('userLogin', err => {
                if (err) {
                  console.log('Error to remove userLogin');
                  resolve('');
                } else {
                  AsyncStorage.removeItem('cartData');
                  navigation.navigate('Login');
                  resolve('');
                }
              });
            },
          },
        ],
        {cancelable: false},
      );
    });
  };

  const doEditUser = async () => {
    Keyboard.dismiss();
    setLoadingState(true);

    let messNotify = '';
    if (EditUser) {
      if (!name || !birthday || !address || !email || !phone) {
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
      }

      const res_email = await axios
        .get(
          'https://650468e7c8869921ae24ff64.mockapi.io/api/users?email=' +
            email,
        )
        .then(res => {
          if (res.data) {
            if (res.data.length > 0) {
              for (let userObject of res.data) {
                if (userObject.id != userid) {
                  return true;
                }
              }
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
          'https://650468e7c8869921ae24ff64.mockapi.io/api/users?phone=' +
            phone,
        )
        .then(res => {
          if (res.data) {
            if (res.data.length > 0) {
              for (let userObject of res.data) {
                if (userObject.id != userid) {
                  return true;
                }
              }
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
        id: userid,
        username: username,
        password: password,
        name: name,
        birthday: birthday,
        address: address,
        email: email,
        phone: phone,
      };

      const res_updateuser = await axios
        .put(
          'https://650468e7c8869921ae24ff64.mockapi.io/api/users/' + userid,
          userData,
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

      if (res_updateuser) {
        await AsyncStorage.removeItem('userLogin', async err => {
          if (err) {
            console.log('Error to remove userLogin');
            return;
          } else {
            await AsyncStorage.setItem('userLogin', JSON.stringify(userData));
            setShowCancel(false);
            setEditUser(false);
            setEditButtonName('Chỉnh sửa thông tin');
            Alert.alert('Cập nhật thông tin tài khoản thành công');
          }
        });
      }
    } else {
      setEditUser(true);
      setEditButtonName('Lưu thông tin');
      setShowCancel(true);
    }
    setLoadingState(false);
  };

  const cancelEditUser = async () => {
    setUserId('');
    setUserName('');
    setPassWord('');
    setName('');
    setBirthday('');
    setAddress('');
    setEmail('');
    setPhone('');
    setEditUser(false);
    setEditButtonName('Chỉnh sửa thông tin');

    await AsyncStorage.getItem('userLogin', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        const jsonDeValue = JSON.parse(data);
        setUserId(jsonDeValue.id);
        setUserName(jsonDeValue.username);
        setPassWord(jsonDeValue.password);
        setName(jsonDeValue.name);
        setBirthday(jsonDeValue.birthday);
        setAddress(jsonDeValue.address);
        setEmail(jsonDeValue.email);
        setPhone(jsonDeValue.phone);
        setShowCancel(false);
      }
    });
  };

  return (
    <ScrollView>
      <View style={{flex: 1, alignItems: 'center'}}>
        {loadingState && <ActivityIndicator size="large" color="#D97B29" />}
        <Text style={styles.title}>Thông tin tài khoản</Text>
        <View>
          <Image
            source={{
              uri: 'https://pluspng.com/img-png/user-png-icon-young-user-icon-2400.png',
            }}
            style={{width: 100, height: 100, margin: 20}}
            resizeMode="stretch"
          />
        </View>
        <TextInput
          onChangeText={text => {
            setErrorName(!text ? 'Hãy nhập họ tên' : '');
            setName(text);
          }}
          editable={EditUser}
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
          editable={EditUser}
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
          editable={EditUser}
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
          editable={EditUser}
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
          editable={EditUser}
          value={phone}
          style={styles.input}
          placeholder="Số điện thoại"
          placeholderTextColor="grey"></TextInput>
        <Text style={styles.error}>{errorPhone}</Text>

        <Button title={EditButtonName} onPress={() => doEditUser()} />

        {showCancel && (
          <View style={{margin: 10}}>
            <Button title="Hủy" onPress={() => cancelEditUser()} />
          </View>
        )}

        <View style={{margin: 10}}>
          <Button
            title="Đổi mật khẩu"
            onPress={() => navigation.push('ChangePassword')}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, {backgroundColor: 'silver'}]}
          onPress={() => doLogOut()}>
          <Text>Đăng xuất</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    marginBottom: 10,
  },
  title: {
    color: '#6495ED',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
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
    textAlign: 'left',
  },
});
