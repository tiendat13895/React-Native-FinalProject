import React, {useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
} from 'react-native';
import {Result, RootObject} from './model';
import AsyncStorage from '@react-native-async-storage/async-storage';

import axios from 'axios';
import * as AxiosLogger from 'axios-logger';

AxiosLogger.setGlobalConfig({
  dateFormat: 'HH:MM:ss',
  status: true,
  headers: true,
});
const instance = axios.create();

instance.interceptors.response.use(AxiosLogger.responseLogger);

instance.interceptors.request.use(
  function (config) {
    return config;
  },
  function (error) {
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    return Promise.reject(error);
  },
);

export function ProductScreen({navigation}: any) {
  const [data, setData] = React.useState<RootObject | undefined>();
  const [loading, setLoading] = React.useState<boolean>(false);
  const [refreshing, setRefreshing] = React.useState<boolean>(false);
  const [cartQuantity, setCartQuantity] = React.useState(0);

  const getProductFromApi = (_page = 1) => {
    return instance
      .get(
        `https://650468e7c8869921ae24ff64.mockapi.io/api/product?completed=false&page=${_page}&limit=10`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        if (res.data) {
          let Result = {
            page: _page,
            results: res.data,
            total_pages: 10,
            total_results: 100,
          };
          return Result;
        }
      })
      .catch(err => {
        console.log(err);
        return undefined;
      });
  };

  useEffect(() => {
    // AsyncStorage.removeItem('cartData');

    getProductFromApi().then(response => setData(response));
    navigation.addListener('focus', () => {
      AsyncStorage.getItem('cartData', (err, data) => {
        if (err) {
          console.log('Error getting userLogin from Storage');
          return;
        }
        if (data) {
          let cartData = JSON.parse(data);
          let cqty = 0;
          for (let items of cartData) {
            cqty += items.quantity;
          }
          setCartQuantity(cqty);
        }
      });
    });
  }, [navigation]);

  const loadMore = React.useCallback(() => {
    setLoading(true);
    const page = data?.page ?? 1;
    getProductFromApi(page + 1).then(response => {
      const oldDataResults = data?.results ?? [];
      const newDataResults = response?.results ?? [];
      const finalDataResults = [...oldDataResults, ...newDataResults];
      const result = {...response, results: finalDataResults};
      setData(result as RootObject);
      setLoading(false);
    });
  }, [data]);

  const refresh = React.useCallback(() => {
    setRefreshing(true);
    setLoading(true);
    getProductFromApi().then(response => {
      setRefreshing(false);
      setLoading(false);
      setData(response);
    });
  }, []);

  const doAddToCart = async (item: Result) => {
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
        if (items.productCode === item.productCode) {
          items.quantity += 1;
          isExists = true;
        }
      }
    }

    if (isExists == false) {
      cartItems.id = item.id;
      cartItems.productCode = item.productCode;
      cartItems.productName = item.productName;
      cartItems.patternName = item.patternName;
      cartItems.rangeName = item.rangeName;
      cartItems.unitName = item.unitName;
      cartItems.length = item.length;
      cartItems.width = item.width;
      cartItems.height = item.height;
      cartItems.weight = item.weight;
      cartItems.capacity = item.capacity;
      cartItems.unitPrice = item.unitPrice;
      cartItems.categoryName = item.categoryName;
      cartItems.quantity = 1;
      // cartItems.isChoose = false;
      cartData.push(cartItems);
    }
    await AsyncStorage.setItem('cartData', JSON.stringify(cartData));
    let cqty = 0;
    for (let items of cartData) {
      cqty += items.quantity;
    }
    setCartQuantity(cqty);
  };

  const doOpenCart = () => {
    if (cartQuantity > 0) {
      navigation.navigate('Cart');
    } else {
      Alert.alert('Không có sản phẩm trong giỏ hàng');
    }
  };

  return (
    <SafeAreaView>
      <StatusBar />
      <View>
        <View style={styles.container}>
          {/* <ProductComponent
            navigation={navigation}
            post={data}
            loadMore={loadMore}
            loading={loading}
            refresh={refresh}
            refreshing={refreshing}
            cartQuantity={cartQuantity}
          /> */}
          <View style={{...styles.rootItem, width: '100%'}}>
            <Text style={{...styles.title, marginRight: 70}}>Sản phẩm</Text>
            <TouchableOpacity
              style={{
                ...styles.button,
                ...styles.rootItem,
                backgroundColor: '#DCDCDC',
                width: 100,
                margin: 10,
              }}
              onPress={() => doOpenCart()}>
              <Image
                source={{
                  uri: 'https://pluspng.com/img-png/cart-png-hd-png-image-256.png',
                }}
                style={{width: 30, height: 30}}
                resizeMode="stretch"
              />
              <Text style={{color: 'red', fontSize: 20}}>({cartQuantity})</Text>
            </TouchableOpacity>
          </View>

          {data === undefined ? (
            <Text>Loading ...</Text>
          ) : (
            <FlatList
              style={{marginBottom: 225}}
              contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
              contentInsetAdjustmentBehavior="automatic"
              data={data.results}
              renderItem={({item}: ListRenderItemInfo<Result>) => (
                // <ItemComponent
                //   item={item}
                //   navigation={navigation}
                //   cartQuantity={cartQuantity}
                // />
                <Pressable
                  style={styles.rootItem}
                  onPress={() =>
                    navigation.navigate('ProductDetail', {
                      id: item.id,
                      productCode: item.productCode,
                      productName: item.productName,
                      patternName: item.patternName,
                      rangeName: item.rangeName,
                      unitName: item.unitName,
                      length: item.length,
                      width: item.width,
                      height: item.height,
                      weight: item.weight,
                      capacity: item.capacity,
                      unitPrice: item.unitPrice,
                      categoryName: item.categoryName,
                    })
                  }>
                  <Image
                    style={styles.image}
                    source={{
                      uri:
                        'https://product.minhlong.com/product/' +
                        item.productCode +
                        '/avatar.png',
                    }}
                  />

                  <View style={styles.rightItem}>
                    <Text style={styles.itemTitleText} numberOfLines={5}>
                      {item.productName}
                    </Text>
                    <Text style={styles.itemCategoryText} numberOfLines={1}>
                      {item.categoryName}
                    </Text>
                    <View style={styles.rootItem}>
                      <Text style={styles.itemPriceText} numberOfLines={1}>
                        {item.unitPrice.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                        đ
                      </Text>
                      <TouchableOpacity
                        style={{
                          ...styles.button,
                          backgroundColor: '#DCDCDC',
                          width: 80,
                          marginLeft: 15,
                        }}
                        onPress={() => doAddToCart(item)}>
                        <Image
                          source={{
                            uri: 'https://cdn1.iconfinder.com/data/icons/materia-finance-vol-1/24/012_033_shopping_cart_shop_basket_buy_add-512.png',
                          }}
                          style={{width: 30, height: 30}}
                          resizeMode="stretch"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item: Result, index: number) =>
                `${item.id}-${index}`
              }
              onEndReached={() => {
                if (!loading) {
                  loadMore();
                }
              }}
              onEndReachedThreshold={0.8}
              onRefresh={() => refresh()}
              refreshing={refreshing}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

// export interface Props {
//   post?: RootObject;
//   loadMore: () => void;
//   loading: boolean;
//   refresh: () => void;
//   refreshing: boolean;
//   navigation: any;
//   cartQuantity: number;
// }

// const ProductComponent: React.FC<Props> = props => {
//   return (
//     <View>
//       <View style={{...styles.rootItem, width: '100%'}}>
//         <Text style={{...styles.title, marginRight: 70}}>Sản phẩm</Text>
//         <TouchableOpacity
//           style={{
//             ...styles.button,
//             ...styles.rootItem,
//             backgroundColor: '#DCDCDC',
//             width: 100,
//             margin: 10,
//           }}
//           onPress={() => doOpenCart()}>
//           <Image
//             source={require('../Images/Shop.png')}
//             style={{width: 30, height: 30}}
//             resizeMode="stretch"
//           />
//           {/* <MaterialIcons size={32} name={'shopping-cart'} /> */}
//           <Text style={{color: 'red', fontSize: 20}}>
//             ({props.cartQuantity})
//           </Text>
//         </TouchableOpacity>
//       </View>

//       {props.post === undefined ? (
//         <Text>Loading ...</Text>
//       ) : (
//         <FlatList
//           style={{marginBottom: 300}}
//           contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
//           contentInsetAdjustmentBehavior="automatic"
//           data={props.post.results}
//           renderItem={({item}: ListRenderItemInfo<Result>) => (
//             <ItemComponent
//               item={item}
//               navigation={props.navigation}
//               cartQuantity={props.cartQuantity}
//             />
//           )}
//           keyExtractor={(item: Result, index: number) => `${item.id}-${index}`}
//           onEndReached={() => {
//             if (!props.loading) {
//               props.loadMore();
//             }
//           }}
//           onEndReachedThreshold={0.8}
//           onRefresh={() => props.refresh()}
//           refreshing={props.refreshing}
//         />
//       )}
//     </View>
//   );
// };

// export interface ItemComponentProps {
//   navigation: any;
//   item: Result;
//   cartQuantity: number;
// }

// const ItemComponent: React.FC<ItemComponentProps> = props => {
//   const {
//     item: {
//       id,
//       productCode,
//       productName,
//       patternName,
//       rangeName,
//       unitName,
//       length,
//       width,
//       height,
//       weight,
//       capacity,
//       unitPrice,
//       categoryName,
//     },
//   } = props;
//   return (
//     <Pressable
//       style={styles.rootItem}
//       onPress={() =>
//         props.navigation.navigate('ProductDetail', {
//           id: id,
//           productCode: productCode,
//           productName: productName,
//           patternName: patternName,
//           rangeName: rangeName,
//           unitName: unitName,
//           length: length,
//           width: width,
//           height: height,
//           weight: weight,
//           capacity: capacity,
//           unitPrice: unitPrice,
//           categoryName: categoryName,
//         })
//       }>
//       <Image
//         style={styles.image}
//         source={{
//           uri:
//             'https://product.minhlong.com/product/' +
//             productCode +
//             '/avatar.png',
//         }}
//       />

//       <View style={styles.rightItem}>
//         <Text style={styles.itemTitleText} numberOfLines={5}>
//           {productName}
//         </Text>
//         <Text style={styles.itemCategoryText} numberOfLines={1}>
//           {categoryName}
//         </Text>
//         <View style={styles.rootItem}>
//           <Text style={styles.itemPriceText} numberOfLines={1}>
//             {unitPrice.toLocaleString(undefined, {maximumFractionDigits: 2})}đ
//           </Text>
//           <TouchableOpacity
//             style={{
//               ...styles.button,
//               backgroundColor: '#DCDCDC',
//               width: 80,
//               marginLeft: 15,
//             }}
//             onPress={() => doAddToCart(props.item, props.cartQuantity)}>
//             <Image
//               source={require('../Images/AddToCart.png')}
//               style={{width: 30, height: 30}}
//               resizeMode="stretch"
//             />
//           </TouchableOpacity>
//         </View>
//       </View>
//     </Pressable>
//   );
// };

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fffff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 30,
    color: '#4169E1',
    textAlign: 'center',
    margin: 10,
  },

  rootItem: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  itemTitleText: {
    fontSize: 15,
    fontWeight: 'bold',
    marginBottom: 5,
    color: 'black',
  },
  itemCategoryText: {
    fontSize: 12,
    marginBottom: 5,
  },
  itemPriceText: {
    fontSize: 20,
    color: '#DAA520',
  },
  rightItem: {
    flexDirection: 'column',
    marginHorizontal: 10,
    flex: 1,
  },
  image: {
    width: 120,
    height: 120,
    marginLeft: 10,
    borderRadius: 20,
  },
  button: {
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    marginHorizontal: 10,
  },
});
