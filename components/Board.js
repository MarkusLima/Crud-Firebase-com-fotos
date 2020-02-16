import React from 'react';
import { StyleSheet, ActivityIndicator, View, Text, FlatList, Image, Button } from 'react-native';
import firebase from '../Firebase';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default class BoardScreen extends React.Component {
    static navigationOptions = ({ navigation }) => {
        return {
            title: 'Feeds',
            headerRight: (
                <Button
                    title="Adicionar"
                    buttonStyle={{ padding: 0, backgroundColor: 'transparent' }}
                    icon={{ name: 'add-circle', style: { marginRight: 0, fontSize: 32 } }}
                    onPress={() => { navigation.push('AddBoard') }}
                />
            ),
        };
    };
    constructor() {
        super();
        this.ref = firebase.firestore().collection('boards');
        this.unsubscribe = null;
        this.state = {
            isLoading: true,
            boards: []
        };
        console.disableYellowBox = true;
    }
    componentDidMount() {
        this.unsubscribe = this.ref.onSnapshot(this.onCollectionUpdate);
    }
    onCollectionUpdate = (querySnapshot) => {
        const boards = [];
        querySnapshot.forEach((doc) => {
            const { title, description, author, image } = doc.data();
            boards.push({
                key: doc.id,
                doc, // DocumentSnapshot
                title,
                description,
                author,
                image
            });
        });
        this.setState({
            boards,
            isLoading: false,
        });
    }

    fun = (key) => {
        this.props.navigation.navigate('BoardDetails', { key: `${JSON.stringify(key)}` })
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.container}>
                    <ActivityIndicator size="large" color="#0000ff" />
                    <Text>Carregando...</Text>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.boards}
                    keyExtractor={item => item.key}
                    renderItem={({ item }) => <DadosApi fun={this.fun} data={item} />}
                />
            </View>
        );
    }
}

class DadosApi extends React.Component {
    render() {
        return (
            <View>

                <View style={{ flexDirection: 'row' }}>
                    <Text style={{ fontSize: 15, fontWeight: '800' }}>{this.props.data.title} </Text>
                    <Text style={{ fontSize: 15, fontWeight: '800' }}> {this.props.data.description}</Text>
                    <Text style={{ fontSize: 15, fontWeight: '800' }}> {this.props.data.author}  </Text>
                    <TouchableOpacity onPress={() => { this.props.fun(this.props.data.key) }}>
                        <Text style={{ color: 'red', fontSize: 15 }}> Editar</Text>
                    </TouchableOpacity>
                </View>

                <View>
                    <Image
                        source={{ uri: this.props.data.image }}
                        style={{ height: 350, width: 340, borderRadius: 10, borderColor: '#663399', borderWidth: 2 }}
                    />
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1, alignItems: 'center', justifyContent: 'center'
    }
})