import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';

import {LoginScreen} from './Login/Login';
import {HomeScreen} from './Home/Home';
import {UserScreen} from './User/User';
import {ChangePasswordScreen} from './User/ChangePassword';
import {AboutScreen} from './About/About';
import {CreateUserScreen} from './CreateUser/CreateUser';
import {ForgotPasswordScreen} from './ForgotPassword/ForgotPassword';
import {ProductScreen} from './Product/Product';
import {ProductDetailScreen} from './Product/ProductDetail';
import {CartScreen} from './Product/Cart';
import {PaymentScreen} from './Product/Payment';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();

export function HomeTab() {
  return (
    <BottomTab.Navigator screenOptions={{headerShown: false}}>
      <BottomTab.Screen
        name="Trang chủ"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://pluspng.com/img-png/home-icon-png-home-house-icon-image-202-512.png',
              }}
              // source={require('./Images/Home.png')}
              style={{width: 30, height: 30}}
              resizeMode="stretch"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="G-Shop"
        component={ProductScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://pluspng.com/img-png/cart-png-hd-png-image-256.png',
              }}
              style={{width: 30, height: 30}}
              resizeMode="stretch"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Tài khoản"
        component={UserScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={{
                uri: 'https://pluspng.com/img-png/user-png-icon-download-icons-logos-emojis-users-2240.png',
              }}
              style={{width: 30, height: 30}}
              resizeMode="stretch"
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

export function FinalProject() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="LoginScreen">
        <Stack.Screen
          options={{headerShown: false}}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{headerShown: false}}
          name="HomeTab"
          component={HomeTab}
        />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen
          // options={{headerShown: false}}
          name="ChangePassword"
          component={ChangePasswordScreen}
          options={{title: 'Đổi mật khẩu'}}
        />
        <Stack.Screen
          name="About"
          component={AboutScreen}
          options={{title: 'Thông tin'}}
        />
        <Stack.Screen
          name="CreateUser"
          component={CreateUserScreen}
          options={{title: 'Đăng ký'}}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{title: 'Quên mật khẩu'}}
        />
        <Stack.Screen
          name="ProductDetail"
          component={ProductDetailScreen}
          options={{title: 'Chi tiết sản phẩm'}}
        />
        <Stack.Screen
          name="Cart"
          component={CartScreen}
          options={{title: 'Giỏ hàng'}}
        />
        <Stack.Screen
          name="Payment"
          component={PaymentScreen}
          options={{title: 'Thanh toán'}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
