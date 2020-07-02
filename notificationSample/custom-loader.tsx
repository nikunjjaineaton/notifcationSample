import React from 'react';
import { Animated, View,Text } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { HttpRequest } from './http-request';


type Props = {
 
};

export class CustomLoader extends React.Component<Props> {
  loadingSpin: Animated.Value;

  constructor(props: Props) {
    super(props);
    this.loadingSpin = new Animated.Value(1);
   
  }

  spinAnimation() {
    this.loadingSpin.setValue(0);
    Animated.timing(this.loadingSpin, {
      toValue: 1,
      duration: 1000
    }).start(() => this.spinAnimation());
  }

  componentDidMount() {
    this.spinAnimation();
  }

  render() {
    const spin = this.loadingSpin.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg']
    });
   
    return (
     
      <View 
        style={{
          position: 'absolute',
          alignItems: 'center',
          bottom: 0,
          top: 0,
          left: 0,
          right: 0,
          justifyContent: 'center'
        }}
        
      >
        <Animated.View
          style={{
            transform: [{ rotate: spin }]
          }}
        >
          
          <MaterialIcon name={'loading'} size={40} color={'#007bc1'} />
        </Animated.View>
        
      </View>
    );
  }
}
