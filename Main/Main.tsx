import React, {useEffect, useState} from 'react';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createDrawerNavigator} from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import {Image} from 'react-native';

import {LoginScreen} from './Login/Login';
import {HomeScreen} from './Home/Home';
import {DetailsScreen} from './Detail/Detail';
import {CategoryScreen} from './Category/Category';
import {AboutScreen} from './About/About';
import {CommonMovieScreen} from './Movie/CommonMovie';
import {RateMovieScreen} from './Movie/RateMovie';

// useContext???
// useState chỉ xài trong mỗi function, mỗi màn hình?
// Làm sao để useEffect alert chỉ 1 lần
// Làm sao để lưu thông tin đăng nhập và nhận biết để đá ra màn hình login

const homeName = 'Home';

const Stack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
// const Drawer = createDrawerNavigator();

// const HomeDrawer = () => {
//   return (
//     <NavigationContainer>
//       <Drawer.Navigator
//         initialRouteName="Login"
//         screenOptions={{headerShown: false}}>
//         {/* <Drawer.Screen name="Login" component={LoginScreen} /> */}
//         <Drawer.Screen name="Home" component={HomeScreen} />
//         <Drawer.Screen name="Details" component={DetailsScreen} />
//         <Drawer.Screen name="Category" component={CategoryScreen} />
//         <Drawer.Screen name="About" component={AboutScreen} />
//       </Drawer.Navigator>
//     </NavigationContainer>
//   );
// };

export function HomeTab() {
  return (
    <BottomTab.Navigator screenOptions={{headerShown: false}}>
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarIcon: () => (
            <Image
              source={require('./Images/Home.png')}
              style={{width: 30, height: 30}}
              resizeMode="stretch"
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="Details"
        component={DetailsScreen}
        options={{
          tabBarIcon: DetailIcon
        }}
      />
      <BottomTab.Screen
        name="CommonMovie"
        component={CommonMovieScreen}
        options={{
          tabBarIcon: MovieIcon,
        }}
      />
      <BottomTab.Screen
        name="RateMovie"
        component={RateMovieScreen}
        options={{
          tabBarIcon: MovieIcon,
        }}
      />
      <BottomTab.Screen
        name="About"
        component={AboutScreen}
        options={{
          tabBarIcon: AboutIcon
        }}
      />
      <BottomTab.Screen
        name="LogOut"
        component={LoginScreen}
        options={{
          tabBarIcon: LogoutIcon
        }}
      />
    </BottomTab.Navigator>
  );
}

const MovieIcon = () => (
  <MaterialIcons size={32} name="movie" color={'green'} />
);
const DetailIcon = (props: {
  focused: boolean;
  color: string;
  size: number;
}) => <MaterialIcons size={props.size} name="info" color={props.color} />;

const AboutIcon = () => (
  <MaterialIcons size={32} name="info" color={'gray'} />
);
const LogoutIcon = () => (
  <MaterialIcons size={32} name="logout" color={'black'} />
);

export function Main() {
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
        {/* <Stack.Screen name="HomeDrawer" component={HomeDrawer} /> */}
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Category" component={CategoryScreen} />
        <Stack.Screen name="About" component={AboutScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
