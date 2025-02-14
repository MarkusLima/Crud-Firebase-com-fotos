import React, { Component } from 'react';
import { StyleSheet, ScrollView, ActivityIndicator, View, Alert } from 'react-native';
import {Text, Card, Button } from 'react-native-elements';
import firebase from '../Firebase';

class BoardDetailScreen extends Component {
  static navigationOptions = {
    title: 'Detalhes do Post',
  };
  constructor() {
    super();
    this.state = {
      isLoading: true,
      board: {},
      key: ''
    };
    console.disableYellowBox = true;
  }
  componentDidMount() {
    const { navigation } = this.props;
    const ref = firebase.firestore().collection('boards').doc(JSON.parse(navigation.getParam('key')));
    ref.get().then((doc) => {
      if (doc.exists) {
        this.setState({
          board: doc.data(),
          key: doc.id,
          isLoading: false
        });
      } else {
        Alert.alert("Não foi possivel completar a ação", "Tente novamente mais tarde!");
      }
    });
  }
  deleteBoard(key) {
    const { navigation } = this.props;
    this.setState({
      isLoading: true
    });
    firebase.firestore().collection('boards').doc(key).delete().then(() => {
      Alert.alert("Post deletado com sucesso!");
      this.setState({
        isLoading: false
      });
      navigation.navigate('Board');
    }).catch((error) => {
      Alert.alert("Não foi possivel completar a ação", "Tente novamente mais tarde! "+ error);
      this.setState({
        isLoading: false
      });
    });
  }
  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.activity}>
          <ActivityIndicator size="large" color="#0000ff" />
        </View>
      )
    }
    return (
      <ScrollView>
        <Card style={styles.container}>
          <View style={styles.subContainer}>
            <View>
              <Text h3>{this.state.board.title}</Text>
            </View>
            <View>
              <Text h5>{this.state.board.description}</Text>
            </View>
            <View>
              <Text h4>{this.state.board.author}</Text>
            </View>
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#CCCCCC'}
              leftIcon={{name: 'edit'}}
              title='Edit'
              onPress={() => {
                this.props.navigation.navigate('EditBoard', {
                  boardkey: `${JSON.stringify(this.state.key)}`,
                });
              }} />
          </View>
          <View style={styles.detailButton}>
            <Button
              large
              backgroundColor={'#999999'}
              color={'#FFFFFF'}
              leftIcon={{name: 'delete'}}
              title='Delete'
              onPress={() => this.deleteBoard(this.state.key)} />
          </View>
        </Card>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1, padding: 20
  },
  subContainer: {
    flex: 1, paddingBottom: 20, borderBottomWidth: 2, borderBottomColor: '#CCCCCC',
  },
  activity: {
    position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, alignItems: 'center', justifyContent: 'center'
  },
  detailButton: {
    marginTop: 10
  }
})

export default BoardDetailScreen;