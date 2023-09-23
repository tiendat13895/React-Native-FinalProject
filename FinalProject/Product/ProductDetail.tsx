import React, {useEffect, useState} from 'react';
import {
  Button,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export function ProductDetailScreen({navigation, route}: any) {
  const doAddToCart = async () => {
    let cartData: any = [];
    let cartItems = {
      id: '',
      productCode: '',
      productName: '',
      patternName: '',
      rangeName: '',
      unitName: '',
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      capacity: 0,
      unitPrice: 0,
      categoryName: '',
      quantity: 0,
      // isChoose: false,
    };
    await AsyncStorage.getItem('cartData', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        cartData = JSON.parse(data);
      }
    });

    let isExists = false;
    if (cartData != undefined) {
      for (let items of cartData) {
        if (items.productCode === route.params.productCode) {
          items.quantity += 1;
          isExists = true;
        }
      }
    }

    if (isExists == false) {
      cartItems.id = route.params.id;
      cartItems.productCode = route.params.productCode;
      cartItems.productName = route.params.productName;
      cartItems.patternName = route.params.patternName;
      cartItems.rangeName = route.params.rangeName;
      cartItems.unitName = route.params.unitName;
      cartItems.length = route.params.length;
      cartItems.width = route.params.width;
      cartItems.height = route.params.height;
      cartItems.weight = route.params.weight;
      cartItems.capacity = route.params.capacity;
      cartItems.unitPrice = route.params.unitPrice;
      cartItems.categoryName = route.params.categoryName;
      cartItems.quantity = 1;
      // cartItems.isChoose = false;
      cartData.push(cartItems);
    }
    await AsyncStorage.setItem('cartData', JSON.stringify(cartData));
    Alert.alert('Đã thêm vào giỏ hàng');
  };

  const doOpenPayment = () => {
    let cartData: any = [];
    let cartItems = {
      id: '',
      productCode: '',
      productName: '',
      patternName: '',
      rangeName: '',
      unitName: '',
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
      capacity: 0,
      unitPrice: 0,
      categoryName: '',
      quantity: 0,
    };

    cartItems.id = route.params.id;
    cartItems.productCode = route.params.productCode;
    cartItems.productName = route.params.productName;
    cartItems.patternName = route.params.patternName;
    cartItems.rangeName = route.params.rangeName;
    cartItems.unitName = route.params.unitName;
    cartItems.length = route.params.length;
    cartItems.width = route.params.width;
    cartItems.height = route.params.height;
    cartItems.weight = route.params.weight;
    cartItems.capacity = route.params.capacity;
    cartItems.unitPrice = route.params.unitPrice;
    cartItems.categoryName = route.params.categoryName;
    cartItems.quantity = 1;

    cartData.push(cartItems);
    navigation.navigate('Payment', {
      paymentList: cartData,
      mode: 'Detail',
    });
  };

  return (
    <ScrollView>
      <View style={{flex: 1}}>
        <View style={{alignItems: 'center'}}>
          <Image
            style={styles.image}
            source={{
              uri:
                'https://product.minhlong.com/product/' +
                route.params.productCode +
                '/avatar.png',
            }}
          />
        </View>
        <View style={styles.itemDescriptionText}>
          <Text style={styles.itemTitleText} numberOfLines={5}>
            {route.params.productName}
          </Text>
          <Text>Mã sản phẩm: {route.params.productCode}</Text>
          <Text>Hoa văn: {route.params.patternName}</Text>
          <Text>Bộ sản phẩm: {route.params.rangeName}</Text>
          <Text>Đơn vị: {route.params.unitName}</Text>
          <Text>
            Kích thước (cm): {route.params.length} x {route.params.width} x{' '}
            {route.params.height}
          </Text>
          <Text>Cân nặng (g): {route.params.weight}</Text>
          <Text>Dung tích (ml): {route.params.height}</Text>
          <Text>Chủng loại: {route.params.categoryName}</Text>
          <Text style={styles.itemPriceText}>
            {route.params.unitPrice.toLocaleString(undefined, {
              maximumFractionDigits: 2,
            })}
            đ
          </Text>
        </View>
        <View style={styles.rootItem}>
          <TouchableOpacity
            style={{...styles.button, backgroundColor: '#DCDCDC', width: 70}}
            onPress={() => doAddToCart()}>
            <Image
              source={{
                uri: 'https://cdn1.iconfinder.com/data/icons/materia-finance-vol-1/24/012_033_shopping_cart_shop_basket_buy_add-512.png',
              }}
              style={{width: 30, height: 30}}
              resizeMode="stretch"
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={{...styles.button, backgroundColor: '#FF3366', width: 150}}
            onPress={() => doOpenPayment()}>
            <Text
              style={{
                color: 'white',
              }}>
              Thanh toán
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: 250,
    height: 250,
    margin: 20,
    borderRadius: 20,
    alignItems: 'center',
  },
  rootItem: {
    flexDirection: 'row',
    marginVertical: 5,
    marginLeft: 20,
  },
  button: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginHorizontal: 20,
  },
  itemTitleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemPriceText: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#DAA520',
    marginTop: 10,
  },
  itemDescriptionText: {
    margin: 20,
  },
});
