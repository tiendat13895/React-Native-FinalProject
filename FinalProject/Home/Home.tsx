import React, {useEffect, useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Image,
  FlatList,
  ListRenderItemInfo,
  Pressable,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Carousel from 'react-native-snap-carousel';
import CarouselCardItem, {SLIDER_WIDTH, ITEM_WIDTH} from './CarouselCardItem';
import data from './data';
import {Result, RootObject} from '../Product/model';
import axios from 'axios';

export function HomeScreen({navigation}: any) {
  const [name, setName] = useState('');
  const isCarousel = React.useRef(null);
  const [productData, setProductData] = useState<RootObject | undefined>();

  useEffect(() => {
    getProductFromApi().then(response => setProductData(response));

    AsyncStorage.getItem('userLogin', (err, data) => {
      if (err) {
        console.log('Error getting userLogin from Storage');
        return;
      }
      if (data) {
        const jsonDeValue = JSON.parse(data);
        var hour = new Date().getHours();
        if (hour >= 0 && hour < 10) {
          setName('Chào buổi sáng, ' + jsonDeValue.name);
        } else if (hour >= 10 && hour < 14) {
          setName('Chào buổi trưa, ' + jsonDeValue.name);
        } else if (hour >= 14 && hour < 18) {
          setName('Chào buổi chiều! ' + jsonDeValue.name);
        } else if (hour >= 18 && hour < 24) {
          setName('Chào buổi tối, ' + jsonDeValue.name);
        }
      }
    });
  }, []);

  const getProductFromApi = () => {
    return axios
      .get(
        `https://650468e7c8869921ae24ff64.mockapi.io/api/product?completed=false&page=1&limit=5`,
        {
          headers: {
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        if (res.data) {
          let Result = {
            page: 1,
            results: res.data,
            total_pages: 20,
            total_results: 100,
          };
          return Result;
        }
        return undefined;
      })
      .catch(err => {
        console.log(err);
        return undefined;
      });
  };

  return (
    <View style={{paddingTop: 10}}>
      <View
        style={{
          width: '100%',
          backgroundColor: '#6495ED',
          marginBottom: 10,
        }}>
        <Text style={styles.title}>{name}</Text>
      </View>
      <View
        style={{
          alignItems: 'center',
          marginBottom: 10,
        }}>
        <Carousel
          layout="tinder"
          layoutCardOffset={9}
          ref={isCarousel}
          data={data}
          renderItem={CarouselCardItem}
          sliderWidth={SLIDER_WIDTH}
          itemWidth={ITEM_WIDTH}
          inactiveSlideShift={0}
          useScrollView={true}
        />
      </View>

      <Text
        style={{
          borderTopColor: 'black',
          borderTopWidth: 2,
          width: 330,
          margin: 10,
          paddingTop: 10,
          fontSize: 18,
          color: '#6495ED',
          fontWeight: 'bold',
        }}>
        Sản phẩm nổi bật
      </Text>
      <ScrollView>
        <View style={{marginBottom: 200}}>
          {productData === undefined ? (
            <Text>Loading ...</Text>
          ) : (
            <FlatList
              style={{marginBottom: 225}}
              contentInset={{top: 0, bottom: 80, left: 0, right: 0}}
              contentInsetAdjustmentBehavior="automatic"
              data={productData?.results}
              renderItem={({item}: ListRenderItemInfo<Result>) => (
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
                    </View>
                  </View>
                </Pressable>
              )}
              keyExtractor={(item: Result, index: number) =>
                `${item.id}-${index}`
              }
            />
          )}
        </View>
      </ScrollView>
    </View>
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
  },
  title: {
    color: 'white',
    fontSize: 15,
    fontWeight: 'bold',
    margin: 15,
    textAlign: 'left',
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
});
